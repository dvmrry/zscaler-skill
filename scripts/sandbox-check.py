#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""sandbox-check.py — "Why is this file blocked, unanalyzed, or stuck in quarantine?"

Status: SCAFFOLD. Docstring, CLI, auth wiring, and diagnosis structure are in
place. TODOs mark the Sandbox SDK method names and response-field paths that
need confirming against live-tenant output before the text report becomes
trustworthy.

Implements the `investigate-sandbox` workflow documented by Zscaler's MCP
server at:
  vendor/zscaler-mcp-server/commands/investigate-sandbox.md
  vendor/zscaler-mcp-server/skills/zia/investigate-sandbox/SKILL.md

Walks the Sandbox diagnostic tree documented in references/zia/sandbox.md.
Given an MD5 (if known) and/or a source URL, reports:
  - Sandbox report for the file (if MD5 provided)
  - Sandbox tier (Basic vs Advanced) and quota
  - Whether an SSL Inspection rule is bypassing the source URL's category
    — #1 cause of 'file wasn't sandboxed'
  - Whether static-analysis fast-path applies (Office/PDF with no active
    content → BENIGN without dynamic analysis)
  - URL lookup + which rules reference the category

Auth — reads credentials from environment (see references/zia/api.md):
  ZSCALER_CLIENT_ID        required
  ZSCALER_CLIENT_SECRET    (or ZSCALER_PRIVATE_KEY for JWT auth)
  ZSCALER_VANITY_DOMAIN    required
  ZSCALER_CLOUD            optional
  ZSCALER_USE_LEGACY       set to "true" to use pre-ZIdentity legacy auth

Usage:
  ./scripts/sandbox-check.py --md5 <hash> [--url <source-url>]
  ./scripts/sandbox-check.py --url <source-url>

At least one of --md5 or --url is required. Having both is preferred — MD5
resolves the verdict; URL resolves why the file did/didn't get scanned.

Critical limitation (surfaced prominently in output):
  - ZIA Sandbox blocks → full API diagnosis possible.
  - Malware Protection blocks → NO API coverage.
  - Advanced Threat Protection (ATP) blocks → NO API coverage.

  If the user reports a "blocked file" and the Blocked Policy Type is
  Malware Protection or ATP (visible in Web Insights logs, NOT via API),
  this script will surface that limitation and direct the operator to the
  ZIA Admin Console rather than attempt an API-based diagnosis.

Design notes (from MCP skill reasoning):
  - Sandbox TIER matters a lot: Basic handles only .exe/.dll/.scr/.ocx/.sys/.zip
    up to 2 MB. Everything else passes unanalyzed. If MD5 shows no Sandbox
    report and the file was a .docx, check Sandbox tier first.
  - Static-analysis fast-path: Office/PDF with no macros / embedded scripts
    get a BENIGN verdict without dynamic analysis. This is expected
    behavior; surface it as 'static_analysis_cleared' rather than 'skipped'.
  - A BENIGN Sandbox verdict is not a clean bill of health — Malware
    Protection or ATP may still be blocking. If the user says 'Sandbox
    says clean but it's still blocked', point to the other two engines.
  - Stuck-in-quarantine edge cases (one-time download URLs, dynamic hashes,
    PSE cache propagation lag) are surfaced as recommended
    remediation patterns in the report.
"""

from __future__ import annotations

import argparse
import os
import sys
from typing import Any


BASIC_SANDBOX_FILE_TYPES = {".exe", ".dll", ".scr", ".ocx", ".sys", ".zip"}
BASIC_SANDBOX_SIZE_LIMIT_BYTES = 2 * 1024 * 1024  # 2 MB


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--md5", help="File MD5 hash (from ZIA Web Insights log)")
    p.add_argument("--url", help="Source URL the file was downloaded from")
    p.add_argument("--json", action="store_true", help="Emit JSON report")
    args = p.parse_args()
    if not (args.md5 or args.url):
        p.error("at least one of --md5 or --url is required")
    return args


def build_zia_client() -> Any:
    from zscaler import ZscalerClient
    from zscaler.oneapi_client import LegacyZIAClient

    use_legacy = os.environ.get("ZSCALER_USE_LEGACY", "").lower() == "true"
    if use_legacy:
        return LegacyZIAClient()

    cfg = {
        "client_id": os.environ["ZSCALER_CLIENT_ID"],
        "vanity_domain": os.environ["ZSCALER_VANITY_DOMAIN"],
    }
    if pk := os.environ.get("ZSCALER_PRIVATE_KEY"):
        cfg["private_key"] = pk
    else:
        cfg["client_secret"] = os.environ["ZSCALER_CLIENT_SECRET"]
    if cloud := os.environ.get("ZSCALER_CLOUD"):
        cfg["cloud"] = cloud
    return ZscalerClient(cfg)


def fetch_sandbox_report(client: Any, md5: str) -> dict | None:
    """Fetch the Sandbox report for an MD5.

    Per the MCP skill and vendor/zscaler-sdk-python/zscaler/zia/sandbox.py
    (approximate module name), the API is
    GET /zia/api/v1/sandbox/report/{md5} and returns behavioral
    analysis details if the file was dynamically analyzed.
    """
    try:
        report, _resp, err = client.zia.sandbox.get_report(md5)  # TODO: confirm method name
    except AttributeError:
        # TODO: SDK surface may differ; check for client.zia.cloud_sandbox or similar
        return None
    if err:
        print(f"WARN: sandbox report fetch failed: {err}", file=sys.stderr)
        return None
    return report if isinstance(report, dict) else (report.as_dict() if report else None)


def fetch_sandbox_quota(client: Any) -> dict | None:
    """Return tenant quota + tier. Basic vs Advanced is derivable from quota shape."""
    try:
        q, _resp, err = client.zia.sandbox.get_quota()
    except AttributeError:
        return None
    if err:
        print(f"WARN: sandbox quota fetch failed: {err}", file=sys.stderr)
        return None
    return q if isinstance(q, dict) else (q.as_dict() if q else None)


def find_ssl_bypass_for_url(client: Any, url: str) -> dict | None:
    """Return an SSL-inspection bypass finding if one matches the URL.

    Steps:
      1. URL lookup → predefined category/ies
      2. Scan SSL Inspection rules in order; first matching rule where
         action type is DO_NOT_DECRYPT / DO_NOT_INSPECT wins.
      3. If the matching rule references the URL's category as a Do-Not-
         Inspect target, Sandbox cannot see files from this URL.
    """
    # TODO: reuse url-lookup.py's category-resolution logic or factor into common
    try:
        lookup, _, err = client.zia.url_categories.lookup([url])
    except AttributeError:
        return None
    if err or not lookup:
        return None
    # TODO: parse lookup response, scan SSL rules, return matched rule + reason
    return None


def analyze_static_fast_path(report: dict | None) -> bool:
    """Detect 'BENIGN - No Active Content' static-analysis fast-path.

    If the report shows verdict BENIGN and no dynamic-analysis section,
    treat as static fast-pathed (file delivered without Sandbox submission).
    """
    if not report:
        return False
    classification = report.get("Classification") or report.get("classification")
    summary = report.get("Summary") or report.get("summary") or ""
    if classification == "BENIGN" and "no active content" in str(summary).lower():
        return True
    # TODO: verify against live tenant — exact field names unconfirmed
    return False


def build_diagnosis(args: argparse.Namespace, client: Any) -> dict:
    result: dict = {
        "md5": args.md5,
        "url": args.url,
        "sandbox_report": None,
        "sandbox_quota": None,
        "sandbox_tier": "unknown",  # basic | advanced | unknown
        "ssl_bypass": None,
        "static_fast_path": False,
        "limitations": [],
        "recommendations": [],
    }

    result["sandbox_quota"] = fetch_sandbox_quota(client)
    # TODO: derive tier from quota response shape once API confirmed
    # (e.g., Advanced Sandbox has 'advanced_sandbox_quota' vs 'basic_sandbox_quota').

    if args.md5:
        result["sandbox_report"] = fetch_sandbox_report(client, args.md5)
        result["static_fast_path"] = analyze_static_fast_path(result["sandbox_report"])

    if args.url:
        result["ssl_bypass"] = find_ssl_bypass_for_url(client, args.url)
        if result["ssl_bypass"]:
            result["limitations"].append(
                "SSL Inspection is bypassing this URL's category. Sandbox does "
                "not see files over bypassed traffic. If the file was not "
                "analyzed, this is almost certainly why."
            )

    if result["sandbox_report"] is None and args.md5:
        result["limitations"].append(
            "No Sandbox report for this MD5. Possible causes: (1) file is outside "
            "Sandbox tier scope (Basic Sandbox only handles .exe/.dll/.scr/.ocx/"
            ".sys/.zip up to 2 MB), (2) SSL bypass prevented Sandbox from seeing "
            "it, (3) static-analysis fast-path cleared it without submission, "
            "(4) file hasn't been seen yet by the tenant."
        )

    # Always surface the Malware Protection / ATP gap
    result["limitations"].append(
        "This script diagnoses Sandbox blocks only. Malware Protection and "
        "Advanced Threat Protection (ATP) blocks have NO API coverage per the "
        "MCP server's documented capability matrix. If the blocked-policy-type "
        "in Web Insights logs is Malware Protection or ATP, diagnose via the "
        "ZIA Admin Console — this script cannot help."
    )

    if result["ssl_bypass"]:
        result["recommendations"].append(
            "To make Sandbox see files from this URL, either remove the bypass "
            "rule or scope it narrower (e.g., by device group, location) so the "
            "file's traffic is decrypted. See references/zia/ssl-inspection.md."
        )
    if result["static_fast_path"]:
        result["recommendations"].append(
            "BENIGN verdict came from the static-analysis fast-path, not dynamic "
            "behavioral analysis. This is expected for Office/PDF with no macros/"
            "scripts but it does NOT confirm the file is safe under dynamic "
            "analysis — only that Sandbox didn't find a reason to run it."
        )

    return result


def main() -> int:
    args = parse_args()
    try:
        client = build_zia_client()
    except KeyError as e:
        print(f"ERROR: missing required env var {e}", file=sys.stderr)
        return 2

    result = build_diagnosis(args, client)
    if args.json:
        import json

        print(json.dumps(result, indent=2, default=str))
        return 0

    # Text report
    print("ZIA Sandbox Diagnosis")
    print("=" * 40)
    if args.md5:
        print(f"MD5: {args.md5}")
    if args.url:
        print(f"URL: {args.url}")
    print(f"Sandbox tier: {result['sandbox_tier']}")
    if result["sandbox_report"]:
        cls = result["sandbox_report"].get("Classification") or result["sandbox_report"].get("classification") or "?"
        print(f"Sandbox verdict: {cls}")
        if result["static_fast_path"]:
            print("  (static-analysis fast-path — no dynamic analysis)")
    else:
        print("No Sandbox report for this MD5")
    print()
    if result["limitations"]:
        print("Limitations & likely causes:")
        for note in result["limitations"]:
            print(f"  - {note}")
        print()
    if result["recommendations"]:
        print("Recommendations:")
        for rec in result["recommendations"]:
            print(f"  - {rec}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
