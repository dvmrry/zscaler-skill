#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""access-check.py — "Can user X access URL Y, and which policy layer decides?"

Status: SCAFFOLD. Docstring, CLI, auth wiring, and logical flow are in place.
TODOs mark spots where per-layer SDK response traversal needs real-tenant
output to confirm field names — running against a live tenant is how they
get finished.

Implements the `check-access` / `check-user-url-access` workflow documented by
Zscaler's MCP server at:
  vendor/zscaler-mcp-server/commands/check-access.md
  vendor/zscaler-mcp-server/skills/zia/check-user-url-access/SKILL.md

Walks the full ZIA policy chain for a given (user, URL) pair and reports the
effective verdict per layer — SSL Inspection → URL Filtering → DLP Web → Cloud
App Control → Cloud Firewall. Within each layer the first matching rule wins
(true to Zscaler's first-match-wins evaluation) and subsequent rules in that
layer are not evaluated; across layers, every layer is reported so the operator
can see, e.g., how a DLP rule would have matched even if an upstream layer
already decided the request.

Auth — reads credentials from environment (see references/zia/api.md):
  ZSCALER_CLIENT_ID        required
  ZSCALER_CLIENT_SECRET    (or ZSCALER_PRIVATE_KEY for JWT auth)
  ZSCALER_VANITY_DOMAIN    required
  ZSCALER_CLOUD            optional
  ZSCALER_USE_LEGACY       set to "true" to use pre-ZIdentity legacy auth

Usage:
  ./scripts/access-check.py --user <user-email-or-id> <url>
  ./scripts/access-check.py --group <group-name> <url>

Output: a per-layer policy-impact report with verdict (ALLOW / BLOCK / CAUTION /
BYPASSED) and cited rule ID / name per layer.

Design notes (from MCP skill reasoning):
  - Before answering "URL filtering said X", check SSL Inspection state. A Do
    Not Inspect + Bypass rule means URL filtering doesn't evaluate. A Do Not
    Inspect + Evaluate rule means URL filtering evaluates but only on SNI —
    rules depending on URL path / method / body silently don't fire.
  - CAUTION is a third URL-filtering outcome; user sees a warning and can
    click through. Must be reported distinctly from BLOCK.
  - DLP is only meaningful if SSL Inspection is actually inspecting (decrypt).
    If the target URL's category is SSL-bypassed, the script surfaces the DLP
    rule that would have matched but annotates it as "not effective for HTTPS
    over this URL" — a common source of misconfigured-but-believed-enforced DLP.
  - Checks ZIA activation status (`client.zia.activate.status`) at start and
    warns if `PENDING` — the live policy may differ from what the console
    shows.
  - If URL matches multiple categories and any custom entries have
    Retain Parent Category set, the most-specific-entry-wins rule runs before
    policy evaluation; the script reports the resolved category first.

Caveats:
  - Malware Protection and ATP policy types have no API coverage (per the MCP
    `investigate-sandbox` skill). If the final verdict is "file blocked by
    Malware Protection / ATP", this script cannot diagnose it — operator must
    open the ZIA Admin Console.
  - User-scoped rule evaluation requires the user identity to be known to the
    service. If the user is unauthenticated or enrolled via a path that doesn't
    surface identity (e.g., plain GRE without Surrogate IP), user-based
    criteria silently don't match. Script surfaces this via a probe.
"""

from __future__ import annotations

import argparse
import os
import sys
from typing import Any


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("url", help="Target URL to evaluate")
    identity = p.add_mutually_exclusive_group(required=True)
    identity.add_argument("--user", help="User email or ID to evaluate against")
    identity.add_argument("--group", help="Group name or ID to evaluate against")
    p.add_argument(
        "--json",
        action="store_true",
        help="Emit structured JSON instead of human-readable report",
    )
    return p.parse_args()


def build_zia_client() -> Any:
    # Mirrors the pattern in url-lookup.py / snapshot-refresh.py.
    from zscaler import ZscalerClient
    from zscaler.oneapi_client import LegacyZIAClient

    use_legacy = os.environ.get("ZSCALER_USE_LEGACY", "").lower() == "true"
    if use_legacy:
        return LegacyZIAClient()  # env-driven config per SDK docs

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


def check_activation(client: Any) -> None:
    """Warn on stderr if config is in PENDING state (per shared/activation.md)."""
    status, _resp, err = client.zia.activate.status()
    if err:
        print(f"WARN: could not fetch activation status: {err}", file=sys.stderr)
        return
    # Response shape TBD against live tenant — log whatever we get.
    state = getattr(status, "status", None) or (
        status.get("status") if isinstance(status, dict) else None
    )
    if state and state.upper() != "ACTIVE":
        print(
            f"WARN: ZIA activation status = {state!r} — pending changes may not be live yet",
            file=sys.stderr,
        )


def resolve_url_categories(client: Any, url: str) -> list[str]:
    """Return predefined + custom categories the URL resolves to.

    Per references/zia/url-filtering.md, /urlLookup returns predefined
    categories only. Custom-category membership must come from scanning
    the customer's custom categories and matching entries.
    """
    # TODO: implement. /urlLookup + scan of /urlCategories?customOnly=true.
    raise NotImplementedError("resolve_url_categories not yet implemented")


def walk_ssl_inspection(client: Any, url: str, user_ctx: dict) -> dict:
    """Return {verdict, rule_id, rule_name, cascading_effect}."""
    # TODO: list SSL rules, find first match; report DECRYPT / DO_NOT_DECRYPT / BLOCK
    # and the 'Evaluate Other Policies' vs 'Bypass Other Policies' sub-action,
    # which determines whether downstream layers evaluate.
    raise NotImplementedError


def walk_url_filtering(client: Any, url: str, categories: list[str], user_ctx: dict) -> dict:
    """Return {verdict, rule_id, rule_name, action}."""
    # TODO: list URL filtering rules, apply specificity + Retain Parent Category
    # resolution (see references/zia/url-filtering.md), then first-match.
    # Verdict may be ALLOW / BLOCK / CAUTION / ISOLATE / CONDITIONAL.
    raise NotImplementedError


def walk_cac(client: Any, url: str, user_ctx: dict) -> dict:
    """Return {verdict, rule_id, rule_name, cascading_enabled}."""
    # TODO: list CAC rules, first-match. Note: if URL Filtering and CAC have
    # conflicting decisions, CAC wins on allow unless cascading is enabled
    # (per references/zia/cloud-app-control.md).
    raise NotImplementedError


def walk_dlp(
    client: Any, url: str, user_ctx: dict, ssl_state: dict
) -> dict:
    """Return {verdict, rule_id, rule_name, effective}.

    `effective` is False if SSL for this URL is not inspected — DLP needs
    decrypted content to operate on HTTPS. Rule is reported regardless so the
    skill can flag "you configured DLP but bypassed SSL for this category".
    """
    # TODO: list DLP web rules; match user scope + category; flag effective=False
    # if ssl_state.verdict in {"DO_NOT_DECRYPT", "BLOCK"}.
    raise NotImplementedError


def walk_firewall(client: Any, url: str, user_ctx: dict) -> dict:
    """Return {verdict, rule_id, rule_name}."""
    # TODO: resolve URL → IP(s) if needed; list firewall rules; first-match.
    raise NotImplementedError


def main() -> int:
    args = parse_args()
    try:
        client = build_zia_client()
    except KeyError as e:
        print(f"ERROR: missing required env var {e}", file=sys.stderr)
        return 2

    check_activation(client)

    # TODO: resolve user identity to the context object rules match against
    # (SAML attributes, group membership, department, location). Needs one
    # of: client.zia.user_management.get_user, client.zia.groups.get_group.
    user_ctx: dict = {}

    categories = resolve_url_categories(client, args.url)
    ssl = walk_ssl_inspection(client, args.url, user_ctx)
    url_filter = walk_url_filtering(client, args.url, categories, user_ctx)
    cac = walk_cac(client, args.url, user_ctx)
    dlp = walk_dlp(client, args.url, user_ctx, ssl)
    firewall = walk_firewall(client, args.url, user_ctx)

    result = {
        "url": args.url,
        "user": args.user or args.group,
        "categories": categories,
        "layers": {
            "ssl_inspection": ssl,
            "url_filtering": url_filter,
            "cloud_app_control": cac,
            "dlp_web": dlp,
            "firewall": firewall,
        },
    }
    if args.json:
        import json

        print(json.dumps(result, indent=2, default=str))
    else:
        # TODO: pretty-printer — ordered layer walk, call out DLP-not-effective
        # when SSL is bypassed, call out pending-activation warnings, etc.
        import pprint

        pprint.pprint(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
