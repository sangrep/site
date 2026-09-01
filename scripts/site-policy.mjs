#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import {
  basename,
  extname,
  join,
  posix,
  relative,
  resolve,
  sep,
} from "node:path";
import { promisify } from "node:util";

import { JSDOM } from "jsdom";

const execFileAsync = promisify(execFile);

const BRAND_LICENSE = "LicenseRef-Sangrep-Brand-Content";
const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
const CLAIM_PATTERNS = [
  /\bcurrent capabilities\b/i,
  /\bparsed today\b/i,
  /\bon the roadmap\b/i,
  /\broadmap\b/i,
  /\bcoming soon\b/i,
  /\bprivate beta\b/i,
  /\bunderway\b/i,
];
const BLOCKED_DEPENDENCY_LICENSE =
  /(?:^|[^A-Z])(?:AGPL|GPL|SSPL|BUSL|UNLICENSED)(?:[^A-Z]|$)/i;
const ALLOWED_DEPENDENCY_LICENSES = new Set([
  "0BSD",
  "Apache-2.0",
  "Apache-2.0 AND LGPL-3.0-or-later",
  "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BlueOak-1.0.0",
  "CC0-1.0",
  "CC-BY-4.0",
  "ISC",
  "LGPL-3.0-or-later",
  "MIT",
  "MIT AND CC-BY-3.0",
  "MIT OR Apache-2.0",
  "MPL-2.0",
  "OFL-1.1",
  "Python-2.0",
  "SIL OPEN FONT LICENSE",
  "Unicode-3.0",
  "Unicode-DFS-2016",
]);

function slash(path) {
  return path.split(sep).join("/");
}

async function walkFiles(root) {
  const files = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) files.push(path);
      else files.push(path);
    }
  }
  await visit(root);
  return files.sort();
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function parseJson(bytes, finding) {
  try {
    return JSON.parse(bytes);
  } catch {
    return { __parseFinding: finding };
  }
}

function validateSvg(text, name) {
  const findings = [];
  const dom = new JSDOM(text, { contentType: "image/svg+xml" });
  const document = dom.window.document;
  if (document.documentElement.localName !== "svg") {
    findings.push(`invalid-svg-root:${name}`);
    return findings;
  }
  if (document.querySelector("script, foreignObject")) {
    findings.push(`active-svg-content:${name}`);
  }
  for (const element of document.querySelectorAll("*")) {
    for (const attribute of element.attributes) {
      if (/^on/i.test(attribute.name))
        findings.push(`active-svg-content:${name}`);
      if (
        /^(?:href|xlink:href)$/i.test(attribute.name) &&
        /^(?:https?:|data:|javascript:)/i.test(attribute.value)
      ) {
        findings.push(`external-svg-reference:${name}`);
      }
    }
  }
  return findings;
}

export async function auditBrandAssets(repositoryRoot) {
  const brandRoot = join(repositoryRoot, "public", "brand");
  const findings = [];
  let manifest;
  try {
    manifest = parseJson(
      await readFile(join(brandRoot, "provenance.json"), "utf8"),
      "brand-provenance-invalid-json",
    );
  } catch {
    return ["brand-provenance-missing"];
  }
  if (manifest.__parseFinding) return [manifest.__parseFinding];
  if (
    manifest.schemaVersion !== "sangrep.site.brand-provenance.v1" ||
    !Array.isArray(manifest.assets)
  ) {
    return ["brand-provenance-invalid-schema"];
  }

  const actualFiles = (await readdir(brandRoot))
    .filter((name) => extname(name).toLowerCase() === ".svg")
    .sort();
  const declared = new Set();
  for (const entry of manifest.assets) {
    if (
      !entry ||
      typeof entry.file !== "string" ||
      basename(entry.file) !== entry.file ||
      entry.license !== BRAND_LICENSE ||
      entry.provenance !== "first-party" ||
      !/^[0-9a-f]{64}$/.test(entry.sha256)
    ) {
      findings.push("brand-provenance-invalid-entry");
      continue;
    }
    if (declared.has(entry.file))
      findings.push(`brand-provenance-duplicate:${entry.file}`);
    declared.add(entry.file);
    try {
      const bytes = await readFile(join(brandRoot, entry.file));
      if (sha256(bytes) !== entry.sha256) {
        findings.push(`brand-asset-digest-mismatch:${entry.file}`);
      }
      if (bytes.length > MAX_MEDIA_BYTES)
        findings.push(`media-over-size-budget:${entry.file}`);
      findings.push(...validateSvg(bytes.toString("utf8"), entry.file));
    } catch {
      findings.push(`brand-asset-missing:${entry.file}`);
    }
  }
  for (const file of actualFiles) {
    if (!declared.has(file)) findings.push(`brand-asset-unprovenanced:${file}`);
  }
  for (const file of declared) {
    if (!actualFiles.includes(file))
      findings.push(`brand-provenance-orphan:${file}`);
  }
  if (manifest.copies !== undefined && !Array.isArray(manifest.copies)) {
    findings.push("brand-provenance-invalid-copies");
  }
  for (const copy of manifest.copies ?? []) {
    const target = manifest.assets.find(
      (entry) => entry?.file === copy?.matches,
    );
    const normalized =
      typeof copy?.file === "string" ? posix.normalize(copy.file) : "";
    if (
      !target ||
      !normalized ||
      normalized.startsWith("../") ||
      normalized.startsWith("/") ||
      normalized !== copy.file
    ) {
      findings.push("brand-provenance-invalid-copy");
      continue;
    }
    try {
      const bytes = await readFile(join(repositoryRoot, normalized));
      if (sha256(bytes) !== target.sha256) {
        findings.push(`brand-copy-digest-mismatch:${normalized}`);
      }
    } catch {
      findings.push(`brand-copy-missing:${normalized}`);
    }
  }
  return [...new Set(findings)].sort();
}

function htmlRoute(outputRoot, path) {
  const local = slash(relative(outputRoot, path));
  if (local === "index.html") return "/";
  if (local.endsWith("/index.html"))
    return `/${local.slice(0, -"/index.html".length)}`;
  return `/${local.slice(0, -".html".length)}`;
}

function routeCandidates(pathname) {
  const normalized = posix.normalize(pathname).replace(/\/$/, "") || "/";
  if (extname(normalized)) return [normalized];
  return normalized === "/" ? ["/"] : [normalized, `${normalized}.html`];
}

export async function auditStaticSite(outputRoot) {
  const findings = [];
  let files;
  try {
    files = await walkFiles(outputRoot);
  } catch {
    return ["static-output-missing"];
  }
  const fileRoutes = new Set(
    files.map((path) => `/${slash(relative(outputRoot, path))}`),
  );
  const htmlFiles = files.filter(
    (path) => extname(path).toLowerCase() === ".html",
  );
  const pages = new Map();
  for (const path of htmlFiles) {
    const route = htmlRoute(outputRoot, path);
    const dom = new JSDOM(await readFile(path, "utf8"));
    pages.set(route, dom.window.document);
  }

  for (const [route, document] of pages) {
    const source = route === "/" ? "/index.html" : `${route}.html`;
    if (document.documentElement.getAttribute("lang") !== "en") {
      findings.push(`missing-page-language:${source}`);
    }
    if (!document.title.trim()) findings.push(`missing-page-title:${source}`);
    if (
      !document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
        ?.trim()
    ) {
      findings.push(`missing-page-description:${source}`);
    }
    if (!document.querySelector("main"))
      findings.push(`missing-main-landmark:${source}`);
    if (document.querySelectorAll("h1").length !== 1)
      findings.push(`invalid-heading-one-count:${source}`);

    for (const image of document.querySelectorAll("img")) {
      const alt = image.getAttribute("alt");
      const decorative =
        image.getAttribute("aria-hidden") === "true" ||
        image.getAttribute("role") === "presentation";
      if (alt === null || (!decorative && !alt.trim()))
        findings.push(`missing-image-alt:${source}`);
    }

    for (const anchor of document.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href")?.trim() ?? "";
      if (!href) {
        findings.push(`empty-link:${source}`);
        continue;
      }
      if (/^(?:mailto:|tel:)/i.test(href)) continue;
      if (/^(?:data:|javascript:|http:)/i.test(href)) {
        findings.push(`unsafe-link-scheme:${source}`);
        continue;
      }
      let url;
      try {
        url = new URL(href, `https://sangrep.com${route}`);
      } catch {
        findings.push(`malformed-link:${source}`);
        continue;
      }
      if (url.origin !== "https://sangrep.com") {
        if (anchor.target === "_blank" && !/\bnoreferrer\b/.test(anchor.rel)) {
          findings.push(`external-link-missing-rel:${source}`);
        }
        continue;
      }
      const candidates = routeCandidates(url.pathname);
      const pageRoute = candidates.find((candidate) => pages.has(candidate));
      const fileRoute = candidates.find((candidate) =>
        fileRoutes.has(candidate),
      );
      if (!pageRoute && !fileRoute) {
        findings.push(`broken-local-link:${url.pathname}`);
        continue;
      }
      if (url.hash && pageRoute) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!pages.get(pageRoute)?.getElementById(id)) {
          findings.push(`broken-local-anchor:${url.pathname}${url.hash}`);
        }
      }
    }
  }
  return [...new Set(findings)].sort();
}

export async function auditContentClaims(repositoryRoot) {
  const sourceRoot = join(repositoryRoot, "src");
  const findings = [];
  for (const path of await walkFiles(sourceRoot)) {
    if (/\.test\.[^.]+$/.test(path)) continue;
    if (!new Set([".css", ".js", ".jsx", ".ts", ".tsx"]).has(extname(path)))
      continue;
    const text = await readFile(path, "utf8");
    if (CLAIM_PATTERNS.some((pattern) => pattern.test(text))) {
      findings.push(
        `unsupported-public-claim:${slash(relative(repositoryRoot, path))}`,
      );
    }
  }
  return findings.sort();
}

export function auditLicenseCoverage(paths, manifest) {
  if (
    !manifest ||
    manifest.schemaVersion !== "sangrep.site.license-map.v1" ||
    !manifest.exact ||
    !manifest.prefixes
  ) {
    return ["license-map-invalid-schema"];
  }
  const findings = [];
  const prefixes = Object.keys(manifest.prefixes).sort(
    (left, right) => right.length - left.length,
  );
  for (const path of paths) {
    const license =
      manifest.exact[path] ??
      manifest.prefixes[prefixes.find((prefix) => path.startsWith(prefix))];
    if (typeof license !== "string" || !license.trim()) {
      findings.push(`unclassified-license-path:${path}`);
    }
  }
  return findings.sort();
}

export function auditDependencyLicenses(dependencies) {
  const findings = [];
  for (const dependency of dependencies.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (typeof dependency.license !== "string" || !dependency.license.trim()) {
      findings.push(`missing-dependency-license:${dependency.name}`);
    } else if (
      BLOCKED_DEPENDENCY_LICENSE.test(dependency.license) ||
      !ALLOWED_DEPENDENCY_LICENSES.has(dependency.license)
    ) {
      findings.push(`blocked-dependency-license:${dependency.name}`);
    }
  }
  return findings;
}

export function auditHeaders(text) {
  const headers = new Map();
  let inGlobalBlock = false;
  for (const line of text.split(/\r?\n/)) {
    if (line.trim() === "/*") {
      inGlobalBlock = true;
      continue;
    }
    if (inGlobalBlock && line && !/^\s/.test(line)) break;
    if (!inGlobalBlock) continue;
    const match = line.match(/^\s+([^:]+):\s*(.+)$/);
    if (match) headers.set(match[1].trim().toLowerCase(), match[2].trim());
  }
  const required = [
    "content-security-policy",
    "cross-origin-opener-policy",
    "cross-origin-resource-policy",
    "permissions-policy",
    "referrer-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
  ];
  const findings = required
    .filter((name) => !headers.has(name))
    .map((name) => `missing-security-header:${name}`);
  const csp = headers.get("content-security-policy") ?? "";
  for (const directive of ["default-src", "object-src", "frame-ancestors"]) {
    if (!csp.includes(`${directive} `)) {
      findings.push(`incomplete-content-security-policy:${directive}`);
    }
  }
  if (headers.get("x-content-type-options")?.toLowerCase() !== "nosniff") {
    findings.push("invalid-security-header:x-content-type-options");
  }
  if (headers.get("x-frame-options")?.toUpperCase() !== "DENY") {
    findings.push("invalid-security-header:x-frame-options");
  }
  return [...new Set(findings)].sort();
}

async function trackedFiles(repositoryRoot) {
  const options = {
    cwd: repositoryRoot,
    encoding: "buffer",
    maxBuffer: 16 * 1024 * 1024,
  };
  const [{ stdout: indexed }, { stdout: untracked }] = await Promise.all([
    execFileAsync("git", ["ls-files", "-z"], options),
    execFileAsync(
      "git",
      ["ls-files", "--others", "--exclude-standard", "-z"],
      options,
    ),
  ]);
  return [
    ...new Set(
      Buffer.concat([indexed, untracked])
        .toString("utf8")
        .split("\0")
        .filter(Boolean),
    ),
  ].sort();
}

async function productionDependencies(repositoryRoot) {
  const lock = JSON.parse(
    await readFile(join(repositoryRoot, "package-lock.json"), "utf8"),
  );
  return Object.entries(lock.packages ?? {})
    .filter(
      ([path, value]) =>
        path.startsWith("node_modules/") && value?.dev !== true,
    )
    .map(([path, value]) => ({
      license: value.license,
      name: value.name ?? path.slice("node_modules/".length),
    }));
}

async function auditLicense(repositoryRoot) {
  let manifest;
  try {
    manifest = JSON.parse(
      await readFile(
        join(repositoryRoot, "LICENSES", "license-map.json"),
        "utf8",
      ),
    );
  } catch {
    return ["license-map-unavailable"];
  }
  return [
    ...auditLicenseCoverage(await trackedFiles(repositoryRoot), manifest),
    ...auditDependencyLicenses(await productionDependencies(repositoryRoot)),
  ].sort();
}

async function auditHostingHeaders(repositoryRoot) {
  try {
    return auditHeaders(
      await readFile(join(repositoryRoot, "public", "_headers"), "utf8"),
    );
  } catch {
    return ["hosting-headers-unavailable"];
  }
}

async function main() {
  const repositoryRoot = resolve(process.cwd());
  const mode = process.argv[2] ?? "--all";
  const findings = [];
  if (["--all", "--brand", "--media"].includes(mode))
    findings.push(...(await auditBrandAssets(repositoryRoot)));
  if (["--all", "--claims"].includes(mode))
    findings.push(...(await auditContentClaims(repositoryRoot)));
  if (["--all", "--headers"].includes(mode))
    findings.push(...(await auditHostingHeaders(repositoryRoot)));
  if (["--all", "--links"].includes(mode))
    findings.push(...(await auditStaticSite(join(repositoryRoot, "out"))));
  if (["--all", "--license"].includes(mode))
    findings.push(...(await auditLicense(repositoryRoot)));
  if (
    ![
      "--all",
      "--brand",
      "--claims",
      "--headers",
      "--license",
      "--links",
      "--media",
    ].includes(mode)
  ) {
    findings.push("unknown-site-policy-mode");
  }
  const unique = [...new Set(findings)].sort();
  if (unique.length) {
    for (const finding of unique)
      console.error(`site-policy: blocked category=${finding}`);
    return 1;
  }
  console.log(`site-policy: passed mode=${mode}`);
  return 0;
}

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  process.exitCode = await main();
}
