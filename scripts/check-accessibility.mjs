#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { resolve } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const HOST = "127.0.0.1";
const PORT = 8788;
const ORIGIN = `http://${HOST}:${PORT}`;
const ROUTES = ["/", "/privacy", "/terms"];
const VIEWPORTS = [
  { height: 900, name: "desktop", width: 1440 },
  { height: 844, name: "mobile", width: 390 },
];

async function waitForPreview(process) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (process.exitCode !== null) throw new Error("preview-server-exited");
    try {
      const response = await fetch(ORIGIN, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return;
    } catch {
      // The local Worker has not opened its socket yet.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error("preview-server-timeout");
}

async function launchBrowser() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) {
    return chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
      headless: true,
    });
  }
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    try {
      return await chromium.launch({ headless: true });
    } catch {
      throw new Error("accessibility-browser-unavailable");
    }
  }
}

async function stopProcess(process) {
  if (process.exitCode !== null) return;
  process.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => process.once("exit", resolveExit)),
    new Promise((resolveWait) => setTimeout(resolveWait, 5_000)),
  ]);
  if (process.exitCode === null) process.kill("SIGKILL");
}

async function main() {
  await access(resolve("out", "index.html"));
  const wrangler = resolve("node_modules", ".bin", "wrangler");
  const preview = spawn(
    wrangler,
    ["dev", "--env", "preview", "--port", String(PORT), "--ip", HOST],
    {
      env: {
        ...process.env,
        CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false",
        NO_COLOR: "1",
      },
      stdio: "ignore",
    },
  );
  const findings = [];
  let browser;
  try {
    await waitForPreview(preview);
    browser = await launchBrowser();
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        reducedMotion: "reduce",
        viewport,
      });
      const page = await context.newPage();
      let consoleErrors = 0;
      let pageErrors = 0;
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors += 1;
      });
      page.on("pageerror", () => {
        pageErrors += 1;
      });
      for (const route of ROUTES) {
        const response = await page.goto(`${ORIGIN}${route}`, {
          waitUntil: "networkidle",
        });
        if (!response?.ok()) {
          findings.push(`http-status:${viewport.name}:${route}`);
          continue;
        }
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        if (overflow)
          findings.push(`horizontal-overflow:${viewport.name}:${route}`);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        for (const violation of result.violations) {
          findings.push(
            `axe:${violation.id}:${viewport.name}:${route}:nodes=${violation.nodes.length}`,
          );
        }
      }
      if (consoleErrors)
        findings.push(`console-error:${viewport.name}:count=${consoleErrors}`);
      if (pageErrors)
        findings.push(`page-error:${viewport.name}:count=${pageErrors}`);
      await context.close();
    }
  } catch (error) {
    findings.push(
      error instanceof Error ? error.message : "accessibility-scan-failed",
    );
  } finally {
    if (browser) await browser.close();
    await stopProcess(preview);
  }

  const unique = [...new Set(findings)].sort();
  if (unique.length) {
    for (const finding of unique) {
      console.error(`accessibility: blocked category=${finding}`);
    }
    return 1;
  }
  console.log(
    `accessibility: passed routes=${ROUTES.length} viewports=${VIEWPORTS.length}`,
  );
  return 0;
}

process.exitCode = await main();
