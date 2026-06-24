#!/usr/bin/env python3
"""Scan PLX MC changed files for raw color drift outside --p-* design tokens."""

from __future__ import annotations

import re
import sys
from pathlib import Path

RAW_COLOR = re.compile(
    r"(#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(|hsl\(|hsla\(|oklch\()",
)
TOKEN_OK = re.compile(r"var\(--p-")


def scan_file(path: Path) -> list[str]:
    findings: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        return [f"{path}: read error: {exc}"]
    for idx, line in enumerate(text.splitlines(), start=1):
        if TOKEN_OK.search(line):
            continue
        if RAW_COLOR.search(line):
            findings.append(f"{path}:{idx}: raw color outside --p-* tokens")
    return findings


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: check-plx-ui-tokens.py <file>...", file=sys.stderr)
        return 2
    errors: list[str] = []
    for arg in argv[1:]:
        path = Path(arg)
        if path.is_file():
            errors.extend(scan_file(path))
    if errors:
        for err in errors:
            print(err)
        return 1
    print("PASS: no raw color drift in scanned files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
