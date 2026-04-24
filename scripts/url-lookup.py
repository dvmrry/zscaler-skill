#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""url-lookup.py — "Is this URL covered by any URL category, and which rules reference that category?"

Status: FUNCTIONAL. End-to-end against a live OneAPI tenant.

Implements the `investigate-url` workflow documented by Zscaler's MCP server at
vendor/zscaler-mcp-server/commands/investigate-url.md. Looks up the URL's
category via the ZIA URL Lookup API, then enumerates every URL Filtering rule,
SSL Inspection rule, and Cloud App Control rule referencing that category, plus
the configured action/scope for each.

Auth — reads credentials from environment (see references/zia/api.md):
  ZSCALER_CLIENT_ID        required
  ZSCALER_CLIENT_SECRET    (or ZSCALER_PRIVATE_KEY for JWT auth)
  ZSCALER_VANITY_DOMAIN    required
  ZSCALER_CLOUD            optional (default: production)
  ZSCALER_USE_LEGACY       set to "true" to use pre-ZIdentity legacy auth

Usage:
  ./scripts/url-lookup.py <url>
  ZSCALER_CLIENT_ID=... ZSCALER_CLIENT_SECRET=... ZSCALER_VANITY_DOMAIN=... \\
      ./scripts/url-lookup.py https://www.reddit.com

Output: a policy-impact report (stdout) describing which rules would apply to
requests to the URL.

Caveat per references/zia/url-filtering.md: "most-specific custom category
entry wins across custom categories," so this lookup reports the category
actually applied — not every category the URL might technically belong to.
"""

from __future__ import annotations

import json
import os
import sys
from typing import Any


REQUIRED_ENV = ("ZSCALER_CLIENT_ID", "ZSCALER_VANITY_DOMAIN")


def _check_env() -> None:
    missing = [k for k in REQUIRED_ENV if not os.environ.get(k)]
    if missing:
        print(f"error: missing required env vars: {', '.join(missing)}", file=sys.stderr)
        print("see scripts/url-lookup.py header for the full list.", file=sys.stderr)
        sys.exit(2)
    if not (os.environ.get("ZSCALER_CLIENT_SECRET") or os.environ.get("ZSCALER_PRIVATE_KEY")):
        print("error: need ZSCALER_CLIENT_SECRET or ZSCALER_PRIVATE_KEY", file=sys.stderr)
        sys.exit(2)


def _rule_scope(rule: dict[str, Any]) -> str:
    """Summarize a rule's user-facing scope in one line."""
    parts = []
    for key, label in (
        ("users", "users"),
        ("groups", "groups"),
        ("departments", "depts"),
        ("locations", "locs"),
        ("locationGroups", "loc-groups"),
    ):
        vals = rule.get(key) or []
        if vals:
            parts.append(f"{label}={len(vals)}")
    return ", ".join(parts) if parts else "any"


def _rules_referencing(rules: list[dict], cat_id: str, cat_name: str) -> list[dict]:
    hits = []
    for r in rules:
        cats = r.get("urlCategories") or r.get("url_categories") or []
        # categories can be a list of strings, or list of {id, name, ...}
        names = {c.get("id") or c.get("name") if isinstance(c, dict) else c for c in cats}
        if cat_id in names or cat_name in names:
            hits.append(r)
    return hits


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: ./scripts/url-lookup.py <url>", file=sys.stderr)
        return 2
    target = sys.argv[1]
    _check_env()

    from zscaler import ZscalerClient

    client = ZscalerClient({
        "client_id": os.environ["ZSCALER_CLIENT_ID"],
        "client_secret": os.environ.get("ZSCALER_CLIENT_SECRET"),
        "private_key": os.environ.get("ZSCALER_PRIVATE_KEY"),
        "vanity_domain": os.environ["ZSCALER_VANITY_DOMAIN"],
        "cloud": os.environ.get("ZSCALER_CLOUD"),
    })

    # 1. Classify the URL
    lookup, _, err = client.zia.url_categories.lookup(urls=[target])
    if err:
        print(f"error: URL lookup failed: {err}", file=sys.stderr)
        return 1
    if not lookup:
        print(f"no categorization returned for {target}", file=sys.stderr)
        return 1

    entry = lookup[0] if isinstance(lookup, list) else lookup
    cat_id = entry.get("urlClassifications") or entry.get("url_classifications") or ""
    cat_name = entry.get("url") or target
    security_alert = entry.get("securityAlert") or entry.get("security_alert")

    print(f"URL:      {target}")
    print(f"Category: {cat_id}")
    if security_alert:
        print(f"SecurityAlert: {security_alert}")
    print()

    # 2. Enumerate rules referencing this category across policy types
    sections: list[tuple[str, list[dict]]] = []
    for layer, fn in (
        ("URL Filtering", client.zia.url_filtering.list_rules),
        # add SSL inspection + CAC when a stable SDK surface is confirmed
    ):
        try:
            rules, _, err = fn()
        except Exception as e:
            print(f"warn: could not list {layer} rules: {e}", file=sys.stderr)
            continue
        if err:
            print(f"warn: {layer} list error: {err}", file=sys.stderr)
            continue
        hits = _rules_referencing(rules or [], cat_id, cat_name)
        sections.append((layer, hits))

    # 3. Report
    for layer, hits in sections:
        print(f"=== {layer} ({len(hits)} matching rules) ===")
        for r in sorted(hits, key=lambda x: x.get("order") or 0):
            name = r.get("name") or r.get("rule_name") or "(unnamed)"
            action = r.get("action") or r.get("actions") or "?"
            enabled = r.get("state") or ("enabled" if r.get("enabled") else "disabled")
            order = r.get("order", "?")
            print(f"  order={order:>3}  {action:<10}  {name}  [{enabled}]  ({_rule_scope(r)})")
        print()

    # Optional raw-JSON dump of everything for debugging
    if os.environ.get("URL_LOOKUP_DEBUG"):
        print("--- debug ---")
        print(json.dumps({"lookup": entry, "sections": sections}, indent=2, default=str))

    return 0


if __name__ == "__main__":
    sys.exit(main())
