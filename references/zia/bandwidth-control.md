---
product: zia
topic: "bandwidth-control"
title: "ZIA Bandwidth Control"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-bandwidth-control.md"
  - "vendor/zscaler-help/adding-bandwidth-classes.md"
  - "vendor/zscaler-help/bandwidth-control-policy-example.md"
author-status: draft
---

# ZIA Bandwidth Control

Bandwidth Control is the ZIA module that governs **how tenant internet bandwidth is allocated across traffic categories during contention**. It's a protect-the-business-critical mechanism: when the pipe is full, ensure streaming + social don't starve collaboration + SaaS. The module has two primary objects: **Bandwidth Classes** (traffic categorization) and **Bandwidth Control policy rules** (allocation decisions).

Distinct from — and not to be confused with:

- **Firewall Filtering** — allow/block traffic flows ([`./firewall.md`](./firewall.md)).
- **Location-level `Enforce Bandwidth Control` toggle** ([`./locations.md`](./locations.md)) — this is the on/off gate; Bandwidth Control rules only fire for locations where the toggle is on.

## The two-object model

```
Bandwidth Class            ← groups URL categories / cloud apps / custom domains
   ↓ referenced by
Bandwidth Control Rule     ← allocation decision (guarantee %, max %, protocol, time-window)
```

### Bandwidth Class

A bandwidth class is the matcher. It identifies the traffic bucket that a rule applies to. Classes can contain:

- **URL Categories** — predefined (Social Networking, Streaming Media, etc.) or custom.
- **Cloud Applications** — individual apps or app categories (Office 365, Slack, Zoom, etc.).
- **Custom Domains** — arbitrary FQDNs added as literal strings.

Classes are configured in **Administration > Bandwidth Classes**.

**Predefined classes ship with the service** and cannot be deleted (you can add domains to them but can't remove them). Typical predefined classes cover Social Media, Streaming, File Share, Business Apps categories.

### Bandwidth Control Rule

A rule associates bandwidth classes with enforcement terms — guaranteed percentage, maximum percentage, protocol(s), admin rank, time window, and location scope.

Rules are first-match-wins in **ascending Rule Order**. The **default rule evaluates last**. Same order-model as URL Filtering and Firewall.

## Limits

| Object | Limit |
|---|---|
| Custom bandwidth classes | 245 per org |
| Bandwidth classes with custom domains | **8** (hard cap on classes using the domains field, not on total classes) |
| Domains across all bandwidth classes | 25,000 (including those contributed by URL categories) |
| Per-list pagination | 500 items per page |

The 8-classes-with-domains cap is the surprising one: you can have 245 total classes, but only 8 of them can hold custom domains. The rest must match via URL Category + Cloud App criteria only. Plan topology accordingly — if you need domain-based matching for a new traffic bucket, you may be forced to restructure existing classes.

## Default-rule behavior for orphan classes

**A custom bandwidth class that isn't referenced in any location's policy rules lands in that location's default rule automatically.**

Implications:
- The default rule covers all internet traffic not matched by explicit rules.
- By default: **not guaranteed any bandwidth, but can consume up to 100% when available**. These defaults are editable.
- A newly created class that nobody remembers to wire into a rule will silently fall into default-rule treatment for every location where Bandwidth Control is enforced.

This is usually fine (default rule is generous) but can be wrong in two directions:
- **Too generous** — a class carrying low-priority traffic gets unlimited headroom because nobody added an explicit rule capping it.
- **Too restrictive** — if an admin has tightened the default rule for one location to clamp "everything else", a newly-added class inherits that tight cap, starving the new traffic type.

Audit new classes against all locations before assuming class creation alone is sufficient.

## When Bandwidth Control actually enforces

**Enforcement is contention-driven.** Zscaler doesn't cap every flow all the time; it reacts when the pipe between the tenant location and the nearest PSE is saturated.

Contention patterns per the help docs:
- Typically predictable — e.g., 8-10am weekday spikes.
- Recommended approach: observe traffic for a baseline window, then create **time-based rules** that activate during known contention periods.

**During contention:**
- Guaranteed allocations (per-class floor) are respected — high-priority classes get their minimum.
- Restricted allocations (per-class ceiling) kick in — low-priority classes capped to their maximum share.
- Classes without explicit restrictions fall to the default rule's terms.

**Outside contention:**
- All classes can consume up to 100% of available bandwidth. Restrictions are inert when pipe is healthy.

## Location scoping and the `Enforce Bandwidth Control` toggle

Bandwidth Control is gated per-Location. A location must have **Enforce Bandwidth Control = on** ([`./locations.md § Location`](./locations.md)) for any Bandwidth Control rule to fire for its traffic.

**Sublocation behavior** (per `./locations.md § The XFF mechanic` and sublocation discussion):
- Sublocation bandwidth limits are **bounded by the parent location's total bandwidth**.
- **Unused sublocation bandwidth is shared back to the parent** — not a strict isolation boundary.
- Burst behavior can cross sublocation lines during contention relief.

This means "I guaranteed the corporate sublocation 80%" doesn't prevent the guest sublocation from burst-using idle corporate bandwidth. If strict isolation is required, use separate Locations rather than sublocations.

## Dashboard + reporting

- **Bandwidth Control dashboard** — real-time view of per-class usage.
- **Analytics > Interactive Reports** — standard bandwidth reports (per-class consumption over time, top consumers, contention events). Custom reports supported.

These surfaces are operator-facing; no dedicated API doc found in this capture pass. The Python SDK has some bandwidth-control methods under `client.zia.*` — check `references/zia/api.md § Traffic forwarding` if needed.

## Pipeline position

Bandwidth Control sits **alongside** URL Filtering / CAC / DLP / SSL Inspection in the web-module stage, not at the firewall layer. From *About Policy Enforcement* (cited in the help doc but not captured in this pass):

- Firewall Control runs first (L3/L4 + IPS).
- Web module runs next, and inside the web module Bandwidth Control runs as a traffic-shaping filter across the flow.

**Implication:** traffic blocked at Firewall Control never reaches the Bandwidth Control rule list. Bandwidth Control only shapes traffic that Firewall has allowed.

## Limits (per *Ranges and Limitations*)

| Object | Limit | Notes |
|---|---|---|
| Bandwidth Control policy rules | **125 rules** | Lower than most other ZIA policies; per-department / per-app rule designs hit this earlier than expected |
| Predefined bandwidth classes | 8 | Not deletable; can add domains |
| Custom bandwidth classes | 245 | |
| Bandwidth classes with custom domains | 8 | Hard cap on classes using the domains field |
| Domains across all bandwidth classes | 25,000 | Including those contributed by URL categories |
| File Type Control rules (parallel limit, since FTC interacts with bandwidth) | 2,048 | |
| File Type Control file size scan cap | 400 MB | Files larger pass through unscanned |

## Surprises worth flagging

1. **The "custom domains" cap is a class count, not a domain count.** You can have 24,000 domains distributed across 8 classes + thousands more classes using URL-Category matching only. Tenants hitting the 8-class cap often conflate domain count with class count.

2. **Orphan classes don't just fail — they silently fall into the default rule.** A class you thought was "inactive because no rule references it" actually shares in the default rule's allocation. If the default rule is tight, orphan classes get clamped unexpectedly.

3. **No enforcement outside contention.** Bandwidth Control looks like it's doing nothing 90% of the time. Reports showing uncapped usage during off-peak hours aren't a misconfiguration — they're the expected state. Only contention triggers the allocation logic.

4. **Sublocation "isolation" is actually sublocation "priority."** Sublocation bandwidth limits are guidance under contention, not walls. Unused bandwidth from one sublocation flows to siblings and the parent. True isolation requires separate Locations.

5. **The Location `Enforce Bandwidth Control` toggle is the master switch.** Tenants with elaborate bandwidth classes + rules see no effect if the per-location toggle is off. Check the toggle first when debugging "my bandwidth rule doesn't seem to fire."

6. **Time-based rules require admin-observation discipline.** Contention patterns are predictable but only visible post-hoc. The recommended practice is: run without contention policy → observe in Analytics → design time-windowed rules from observed patterns. Day-one tenants without baselines often over-restrict and under-allocate.

7. **Class changes take effect on activation, not instantly.** Bandwidth classes and rules are ZIA config objects — they participate in the ZIA staged-vs-live activation gate (see [`../shared/activation.md`](../shared/activation.md)). Saving a class doesn't mean it's live until activation.

## Common operational questions

- **"Why isn't my Bandwidth Control rule firing?"** — check the location's `Enforce Bandwidth Control` toggle; check rule order (first-match-wins); confirm the class criteria actually match target traffic (URL category vs cloud app vs domain).
- **"I created a new class but didn't add a rule — why is it capped?"** — orphan classes fall into the location's default rule; edit the class into an explicit rule or widen the default rule's allocation.
- **"Bandwidth limits look ignored during business hours"** — contention-driven; if pipe isn't saturated, enforcement is inert. Check the Bandwidth Control dashboard for saturation evidence.
- **"My guest sublocation is eating corporate bandwidth"** — sublocations share, not isolate. Use Locations for hard isolation.
- **"How do I cap Zoom to 20% globally?"** — create a bandwidth class referencing the Zoom cloud app; create a rule referencing that class with max 20%; apply at all relevant locations with `Enforce Bandwidth Control` on.

## Cross-links

- Location-level enforcement toggle + sublocation burst behavior: [`./locations.md`](./locations.md).
- Firewall-then-web-module pipeline: [`./firewall.md`](./firewall.md), [`./url-filtering.md`](./url-filtering.md).
- Activation lifecycle: [`../shared/activation.md`](../shared/activation.md).
- Cloud App categorization (which apps are in which predefined classes): [`./cloud-app-control.md`](./cloud-app-control.md).
- URL Categories backing bandwidth-class matching: [`./url-filtering.md § URL categories`](./url-filtering.md).
