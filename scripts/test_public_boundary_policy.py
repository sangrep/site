from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from public_boundary_policy import (
    normalize_github_actions_log,
    scan_bytes,
    scan_path,
)


class GeneratedMediaPolicyTests(unittest.TestCase):
    def test_normalizes_only_github_managed_runner_paths(self) -> None:
        runner_root = "/" + "home" + "/runner"
        private_root = "/" + "home" + "/person"
        payload = (
            f"workspace={runner_root}/work/site/site/.git/path\n"
            f"cache={runner_root}/.npm\n"
            f"temp={runner_root}/work/_temp/"
            "02969a6a-e741-42c8-a35b-730b1dc57d30/cache.tzst\n"
            f"private={private_root}/private-file\n"
        ).encode()

        normalized = normalize_github_actions_log(payload).decode()

        self.assertNotIn(runner_root, normalized)
        self.assertIn(f"{private_root}/private-file", normalized)

    def test_accepts_valid_font_headers_and_rejects_malformed_fonts(self) -> None:
        self.assertEqual(
            scan_bytes(
                b"\x00\x01\x00\x00\x00\x01" + b"\x00" * 6,
                source="fixture-font",
                suffix=".ttf",
            ),
            [],
        )
        self.assertEqual(
            scan_bytes(
                b"wOF2" + b"\x00" * 4 + (12).to_bytes(4, "big"),
                source="fixture-font",
                suffix=".woff2",
            ),
            [],
        )
        self.assertEqual(
            [finding.category for finding in scan_bytes(
                b"not-a-font",
                source="fixture-font",
                suffix=".woff2",
            )],
            ["invalid-media"],
        )

    def test_validates_extensionless_generated_open_graph_png(self) -> None:
        png = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
            + b"\x00\x00\x00\x01\x00\x00\x00\x01"
            + b"\x00" * 13
            + b"\x00\x00\x00\x00IEND\xaeB\x60\x82"
        )
        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            try:
                os.chdir(directory)
                path = Path("out/opengraph-image")
                path.parent.mkdir()
                path.write_bytes(png)
                self.assertEqual(
                    scan_path(path, source="working-output:out/opengraph-image"),
                    [],
                )
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()
