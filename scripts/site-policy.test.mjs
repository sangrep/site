import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  auditBrandAssets,
  auditContentClaims,
  auditDependencyLicenses,
  auditHeaders,
  auditLicenseCoverage,
  auditStaticSite,
} from "./site-policy.mjs";

async function fixtureRoot() {
  return mkdtemp(join(tmpdir(), "sangrep-site-policy-"));
}

describe("site policy", () => {
  it("accepts complete first-party brand provenance and rejects changed bytes", async () => {
    const root = await fixtureRoot();
    const brand = join(root, "public", "brand");
    await mkdir(brand, { recursive: true });
    await mkdir(join(root, "src", "app"), { recursive: true });
    const asset = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
    );
    await writeFile(join(brand, "mark.svg"), asset);
    await writeFile(join(root, "src", "app", "icon.svg"), asset);
    await writeFile(
      join(brand, "provenance.json"),
      JSON.stringify({
        assets: [
          {
            file: "mark.svg",
            license: "LicenseRef-Sangrep-Brand-Content",
            provenance: "first-party",
            sha256: createHash("sha256").update(asset).digest("hex"),
          },
        ],
        copies: [{ file: "src/app/icon.svg", matches: "mark.svg" }],
        schemaVersion: "sangrep.site.brand-provenance.v1",
      }),
    );

    await expect(auditBrandAssets(root)).resolves.toEqual([]);
    await writeFile(join(brand, "mark.svg"), Buffer.from("changed"));
    await expect(auditBrandAssets(root)).resolves.toContain(
      "brand-asset-digest-mismatch:mark.svg",
    );
    await writeFile(join(brand, "mark.svg"), asset);
    await writeFile(
      join(root, "src", "app", "icon.svg"),
      Buffer.from("changed"),
    );
    await expect(auditBrandAssets(root)).resolves.toContain(
      "brand-copy-digest-mismatch:src/app/icon.svg",
    );
  });

  it("rejects broken local links and images without useful alternatives", async () => {
    const root = await fixtureRoot();
    const output = join(root, "out");
    await mkdir(output, { recursive: true });
    await writeFile(
      join(output, "index.html"),
      '<!doctype html><html lang="en"><head><title>Home</title><meta name="description" content="Home page"></head><body><main><h1 id="start">Start</h1><a href="/missing">Missing</a><img src="/mark.svg"></main></body></html>',
    );

    const findings = await auditStaticSite(output);
    expect(findings).toContain("missing-image-alt:/index.html");
    expect(findings).toContain("broken-local-link:/missing");
  });

  it("accepts complete local routes, anchors, and decorative images", async () => {
    const root = await fixtureRoot();
    const output = join(root, "out");
    await mkdir(output, { recursive: true });
    await writeFile(
      join(output, "index.html"),
      '<!doctype html><html lang="en"><head><title>Home</title><meta name="description" content="Home page"></head><body><main><h1 id="start">Start</h1><a href="#start">Start</a><a href="/privacy">Privacy</a><img aria-hidden="true" alt="" src="/mark.svg"></main></body></html>',
    );
    await writeFile(
      join(output, "privacy.html"),
      '<!doctype html><html lang="en"><head><title>Privacy</title><meta name="description" content="Privacy page"></head><body><main><h1>Privacy</h1></main></body></html>',
    );
    await writeFile(
      join(output, "mark.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
    );

    await expect(auditStaticSite(output)).resolves.toEqual([]);
  });

  it("rejects website source that reintroduces release or roadmap claims", async () => {
    const root = await fixtureRoot();
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "src", "page.tsx"),
      "export const copy = 'Current capabilities and coming soon';",
    );

    await expect(auditContentClaims(root)).resolves.toEqual([
      "unsupported-public-claim:src/page.tsx",
    ]);
  });

  it("requires one license classification for every tracked file", () => {
    const manifest = {
      exact: { "README.md": "Apache-2.0" },
      prefixes: { "src/": "Apache-2.0" },
      schemaVersion: "sangrep.site.license-map.v1",
    };

    expect(
      auditLicenseCoverage(["README.md", "src/page.tsx"], manifest),
    ).toEqual([]);
    expect(
      auditLicenseCoverage(["README.md", "public/mark.svg"], manifest),
    ).toEqual(["unclassified-license-path:public/mark.svg"]);
  });

  it("rejects missing or copyleft production dependency licenses", () => {
    expect(
      auditDependencyLicenses([
        { license: "MIT", name: "allowed" },
        { license: "GPL-3.0-only", name: "blocked" },
        { name: "unknown" },
      ]),
    ).toEqual([
      "blocked-dependency-license:blocked",
      "missing-dependency-license:unknown",
    ]);
  });

  it("requires the static hosting security header set", () => {
    const headers = `/*
  Content-Security-Policy: default-src 'self'; object-src 'none'; frame-ancestors 'none'
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Permissions-Policy: camera=(), microphone=()
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
`;

    expect(auditHeaders(headers)).toEqual([]);
    expect(auditHeaders("/*\n  X-Content-Type-Options: nosniff\n")).toContain(
      "missing-security-header:content-security-policy",
    );
  });
});
