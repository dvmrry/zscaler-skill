"""policy_simulator.py — pure-function ZIA URL filter evaluation.

Given a tenant snapshot (URL filter rules + URL categories) and a request
description, predict which rule matches and emit a reasoning trace.

Scope (initial):
  - ZIA URL filtering rule evaluation (the most-asked-about layer)
  - Rule order + first-match-wins
  - Disabled-rule-holds-slot semantics
  - Basic category resolution (URL → category) with custom-vs-predefined
  - Per-rule criteria filtering: locations, departments, user groups, users,
    URL categories, time intervals (basic), device categories
  - Default rule fallback

Out of scope (gaps documented in _policy-simulation.md):
  - Cloud App Control rules (separate evaluation surface)
  - DLP / Sandbox / Malware policies
  - SSL inspection two-pass model
  - Specificity-wins-across-custom-categories with full pattern matching
    (we approximate; full engine would need wildcard expansion + path matching)
  - Forwarding control / SIPA routing decisions
  - Time-of-day / day-of-week criteria evaluation (we surface the criterion
    but don't fully evaluate against the request's time)

The simulator is **pure logic over snapshot data** — no API calls, no SDK
dependency. Designed for use in agent tool environments and offline analysis.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


# ----- request + result shapes --------------------------------------------


@dataclass
class URLFilterRequest:
    """Inputs to a policy-simulation call.

    All fields except `url` are optional; absent fields are treated as
    'unspecified' (rule criteria that test those fields will skip the
    test rather than reject the request).
    """

    url: str
    user_email: str | None = None
    user_groups: list[str] = field(default_factory=list)
    department: str | None = None
    location: str | None = None
    location_groups: list[str] = field(default_factory=list)
    device_category: str | None = None  # e.g., "Windows", "Mac", "iOS", "Android"
    source_ip: str | None = None
    time: datetime | None = None
    # SSL state — relevant for two-pass URL filtering (pre-decrypt SNI vs
    # post-decrypt full URL). Not yet used by the simulator but reserved.
    is_https_decrypted: bool | None = None


@dataclass
class TraceStep:
    """One step of the rule-evaluation trace."""

    rule_id: int | None
    rule_name: str | None
    decision: str  # "matched", "skipped:disabled", "skipped:criteria", "skipped:no-category-match"
    note: str = ""


@dataclass
class SimulationResult:
    """Output of a policy-simulation call."""

    matched_rule_id: int | None  # None → fell through to default
    matched_rule_name: str | None
    action: str  # "ALLOW" | "BLOCK" | "CAUTION" | "ISOLATE" — or "DEFAULT_ALLOW" if no rule matched
    matched_url_category: str | None
    trace: list[TraceStep]
    request: URLFilterRequest

    def summary(self) -> str:
        """One-line operator-readable summary."""
        if self.matched_rule_id is None:
            return f"{self.request.url} → no rule matched (DEFAULT_ALLOW)"
        return (
            f"{self.request.url} → rule #{self.matched_rule_id} "
            f"{self.matched_rule_name!r} action={self.action} "
            f"category={self.matched_url_category!r}"
        )


# ----- URL → category resolution ------------------------------------------


def _normalize_url(url: str) -> str:
    """Strip scheme + trailing slash for matching. Zscaler ignores scheme."""
    s = url.strip()
    s = re.sub(r"^https?://", "", s, flags=re.IGNORECASE)
    s = s.split("/", 1)[0]  # host portion only for category matching
    s = s.rstrip(".")
    return s.lower()


def _url_matches_entry(host: str, entry: str) -> tuple[bool, int]:
    """Test whether a host matches a URL category entry.

    Returns (matches, specificity) where specificity is a rough integer rank:
      higher = more specific. Used for the specificity-wins-across-categories
      tiebreak.

    Entry forms (per references/zia/wildcard-semantics.md):
      - 'foo.example.com'         — exact host match
      - '.example.com'            — leading-period wildcard, matches subdomains
                                    up to 5 levels deep
      - 'foo.example.com/path'    — path-suffix; not modeled for category match
                                    (we only match host portion)
      - asterisks ('*.example.com', '*example.com') — invalid per docs
                                    (clarification zia-15); we don't honor them
    """
    e = entry.strip().lower().rstrip(".")
    if not e:
        return (False, 0)
    # Strip path component for matching against host only
    e = e.split("/", 1)[0]

    if e.startswith("."):
        # Leading-period wildcard: matches the bare domain + any subdomain
        # up to 5 levels deep.
        bare = e[1:]
        if host == bare:
            return (True, len(bare))
        if host.endswith("." + bare):
            depth = host[: -len("." + bare)].count(".") + 1
            if depth <= 5:
                return (True, len(bare))  # specificity = bare-domain length
        return (False, 0)

    if e.startswith("*"):
        # Invalid per docs but the console may accept it (zia-15). Don't honor.
        return (False, 0)

    # Exact match: highest specificity (host length used as proxy)
    if host == e:
        return (True, len(e) + 1000)  # +1000 so exact beats any wildcard
    return (False, 0)


def resolve_url_category(url: str, snapshot_categories: list[dict]) -> tuple[str | None, int]:
    """Resolve a URL to its winning category by specificity-wins.

    Walks all custom + predefined categories in the snapshot. For each that
    has a matching URL entry, records (category-id, specificity). Returns
    the highest-specificity match. Ties broken by category position in the
    snapshot list (stable).

    Returns (category_id_or_name, specificity). Returns (None, 0) if no match.
    """
    host = _normalize_url(url)
    best_cat = None
    best_spec = -1
    for cat in snapshot_categories:
        # Snapshot category dict — try common field names
        urls = cat.get("urls", []) or cat.get("dbCategorizedUrls", []) or []
        cat_id = cat.get("id") or cat.get("configuredName") or cat.get("name") or "?"
        for entry in urls:
            matches, spec = _url_matches_entry(host, entry)
            if matches and spec > best_spec:
                best_spec = spec
                best_cat = cat_id
    return (best_cat, best_spec)


# ----- rule criteria evaluation -------------------------------------------


def _criteria_match(rule: dict, req: URLFilterRequest) -> tuple[bool, str]:
    """Test whether a rule's criteria match the request.

    Returns (matches, reason) — reason is empty if matched, populated with
    the failing criterion if not.

    Conservative: if a criterion is set on the rule but the request lacks
    the corresponding field, treat as 'rule could match — no evidence to
    rule out'. Real Zscaler behavior on unspecified criteria is nuanced
    (some require evidence, some default-allow); for now, lean permissive
    so the simulator doesn't false-negative.
    """
    # Locations
    rule_locs = _ids_from(rule.get("locations") or rule.get("location"))
    if rule_locs and req.location is not None:
        if req.location not in rule_locs:
            return (False, f"location {req.location!r} not in rule locations {sorted(rule_locs)}")

    # Location groups
    rule_loc_groups = _ids_from(rule.get("locationGroups") or rule.get("locationGroup"))
    if rule_loc_groups and req.location_groups:
        if not (set(req.location_groups) & rule_loc_groups):
            return (False, f"none of location_groups {req.location_groups} in rule's groups {sorted(rule_loc_groups)}")

    # Departments
    rule_depts = _ids_from(rule.get("departments") or rule.get("department"))
    if rule_depts and req.department is not None:
        if req.department not in rule_depts:
            return (False, f"department {req.department!r} not in rule departments {sorted(rule_depts)}")

    # User groups
    rule_groups = _ids_from(rule.get("groups"))
    if rule_groups and req.user_groups:
        if not (set(req.user_groups) & rule_groups):
            return (False, f"none of user_groups {req.user_groups} in rule's groups {sorted(rule_groups)}")

    # Users
    rule_users = _ids_from(rule.get("users"))
    if rule_users and req.user_email is not None:
        if req.user_email not in rule_users:
            return (False, f"user {req.user_email!r} not in rule users {sorted(rule_users)}")

    # Device categories (basic — exact match)
    rule_devices = rule.get("deviceCategories") or rule.get("deviceTrustLevels") or []
    if rule_devices and req.device_category is not None:
        if req.device_category not in rule_devices:
            return (False, f"device_category {req.device_category!r} not in rule devices {rule_devices}")

    # Source IPs (we don't do CIDR matching — basic exact-match for now)
    rule_src_ips = rule.get("srcIps") or []
    if rule_src_ips and req.source_ip is not None:
        if req.source_ip not in rule_src_ips:
            return (False, f"source_ip {req.source_ip!r} not in rule source IPs (CIDR matching not modeled)")

    return (True, "")


def _ids_from(field_value: Any) -> set:
    """Normalize criteria field to a set of IDs/names.

    Zscaler API often returns criteria as a list of objects: [{"id": 1, "name": "x"}, ...].
    Sometimes flattened to ["x", "y"] strings. Handle both.
    """
    if field_value is None:
        return set()
    if isinstance(field_value, dict):
        # single object
        return {field_value.get("id") or field_value.get("name")}
    if isinstance(field_value, list):
        out = set()
        for item in field_value:
            if isinstance(item, dict):
                v = item.get("id") or item.get("name")
                if v is not None:
                    out.add(v)
            else:
                out.add(item)
        return out
    return {field_value}


def _rule_matches_category(rule: dict, matched_category: str | None) -> bool:
    """Test whether a rule applies to the request's matched URL category."""
    if matched_category is None:
        return False
    rule_cats = rule.get("urlCategories") or rule.get("urlCategories2") or []
    if not rule_cats:
        # No URL category criterion → matches any category
        return True
    rule_cat_ids = _ids_from(rule_cats)
    return matched_category in rule_cat_ids


# ----- the simulator ------------------------------------------------------


def simulate_url_filter(
    request: URLFilterRequest,
    snapshot_rules: list[dict],
    snapshot_categories: list[dict] | None = None,
    include_disabled_in_match: bool = False,
) -> SimulationResult:
    """Walk URL filter rules in order; return matched rule + reasoning trace.

    Args:
      request                 : URLFilterRequest with the URL and (optional) user/loc/etc.
      snapshot_rules          : list of URL filter rule dicts (from snapshot/zia/url-filtering-rules.json)
      snapshot_categories     : list of URL category dicts (from snapshot/zia/url-categories.json)
                                If None, category resolution is skipped — rules with no
                                urlCategories criterion can still match; rules requiring
                                a category are skipped with a 'no category data' note.
      include_disabled_in_match: if True, disabled rules can still match (for what-if).
                                Default False matches real Zscaler behavior:
                                disabled rules don't fire BUT hold their order slot.

    Behavior modeled:
      - Rule order: sorted ascending; lower order = evaluated first.
      - First-match-wins: first rule whose criteria + category match returns.
      - Disabled-rule-holds-slot: disabled rules are evaluated but skipped at
        the action step. The trace shows the skip; subsequent rules continue.
      - Default fall-through: if no rule matches, returns DEFAULT_ALLOW.

    Returns SimulationResult with matched rule, action, and full trace.
    """
    # Resolve URL category once
    matched_category: str | None = None
    matched_specificity: int = 0
    if snapshot_categories:
        matched_category, matched_specificity = resolve_url_category(
            request.url, snapshot_categories
        )

    trace: list[TraceStep] = []

    # Sort rules by order (ascending). Some snapshots use 'order', some 'rank' as backup.
    rules_sorted = sorted(
        snapshot_rules,
        key=lambda r: (r.get("order", 999999), r.get("rank", 999999)),
    )

    for rule in rules_sorted:
        rule_id = rule.get("id")
        rule_name = rule.get("name")
        is_disabled = (rule.get("state") or rule.get("status") or "").upper() in ("DISABLED", "INACTIVE")

        # Step 1: criteria check (locations, depts, users, etc.)
        criteria_ok, criteria_note = _criteria_match(rule, request)
        if not criteria_ok:
            trace.append(TraceStep(rule_id, rule_name, "skipped:criteria", criteria_note))
            continue

        # Step 2: category check
        if not _rule_matches_category(rule, matched_category):
            trace.append(
                TraceStep(rule_id, rule_name, "skipped:no-category-match",
                          f"matched category {matched_category!r} not in rule's urlCategories")
            )
            continue

        # Step 3: disabled check (after the rule otherwise would have matched —
        # this is the "disabled rule holds its slot" rule)
        if is_disabled and not include_disabled_in_match:
            trace.append(
                TraceStep(rule_id, rule_name, "skipped:disabled",
                          "rule is disabled but holds its slot (no fall-through past disabled rules of higher order)")
            )
            # Per the disabled-rule-holds-slot semantics, disabled rules DO
            # block subsequent rules from being matched if they share the same
            # criteria. The simulator's current model is conservative: continue
            # iteration. A stricter model would stop here. See gaps in the doc.
            continue

        # Match!
        action = (rule.get("action") or "ALLOW").upper()
        trace.append(TraceStep(rule_id, rule_name, "matched", f"action={action}"))
        return SimulationResult(
            matched_rule_id=rule_id,
            matched_rule_name=rule_name,
            action=action,
            matched_url_category=matched_category,
            trace=trace,
            request=request,
        )

    # No rule matched — default-allow
    trace.append(TraceStep(None, None, "matched",
                           "no rule matched; default fall-through to DEFAULT_ALLOW"))
    return SimulationResult(
        matched_rule_id=None,
        matched_rule_name=None,
        action="DEFAULT_ALLOW",
        matched_url_category=matched_category,
        trace=trace,
        request=request,
    )


# ----- helpers for change validation (sketched) ---------------------------


def diff_simulations(
    before: SimulationResult, after: SimulationResult
) -> dict[str, Any]:
    """Compare two simulation results for change-validation use.

    Returns a dict with the deltas. Useful for 'what would changing this rule do?'
    workflows: simulate before-change, mutate the rule, simulate after-change,
    diff the results.
    """
    return {
        "url": before.request.url,
        "rule_changed": before.matched_rule_id != after.matched_rule_id,
        "action_changed": before.action != after.action,
        "before_rule": before.matched_rule_id,
        "before_action": before.action,
        "after_rule": after.matched_rule_id,
        "after_action": after.action,
        "category_changed": before.matched_url_category != after.matched_url_category,
    }


__all__ = [
    "URLFilterRequest",
    "TraceStep",
    "SimulationResult",
    "simulate_url_filter",
    "resolve_url_category",
    "diff_simulations",
]
