# Adding Rules to the Cloud App Control Policy

**Source:** https://help.zscaler.com/zia/adding-rules-cloud-app-control-policy
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Cloud App Control Policies — Adding Rules to the Cloud App Control Policy

You can create rules to control access to specific cloud applications. Cloud apps are organized into categories to facilitate defining rules for similar applications. Additionally, you can define a daily quota by bandwidth or time.

## Policy Execution

The Cloud App Control rules consist of a series of logical operators between their criteria. The rules are triggered based on the result of the following logical operations between the criteria:

`[Cloud Applications (OR) Cloud Application Risk Profile] (AND) [Users (OR) Groups (OR) Departments] (AND) [Location Groups (OR) Locations] (AND) Time (AND) [Device Groups (OR) Devices] (AND) Device Trust Level (AND) User Agent (AND) User Risk Profile`

## Predefined IoT Classification Rules

Zscaler provides the **Allow Unauthenticated Traffic for IoT Classifications** predefined rules for each cloud application category. You can enable these rules to temporarily allow unauthenticated traffic that could be blocked by other rules, so that the Zscaler AI/ML can classify devices. These rules are **disabled by default and cannot be deleted**. You can modify the Rule Order, Rule Status, Rule Label, and Description for these rules and cannot edit other attributes.

## Category-Specific Rule Articles

See the parent article's related links for per-category Adding-X-Rule articles. All share the following common fields:

- **Rule Order** — ascending numerical, Admin Rank constrains selectable values
- **Admin Rank** — 0–7 (0 is highest); higher rank always precedes lower
- **Rule Name** — unique
- **Rule Status** — *An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.* (Identical semantic to URL Filtering.)
- **Rule Label**
- **Cloud Applications** (OR) **Cloud Application Risk Profile** — use one or the other
- **Cloud Application Instances** (max 8/rule)
- **Users / Groups / Departments / Locations / Location Groups** (32 max each)
- **Adaptive Access Profile** (requires Experience Center subscription)
- **Time / Devices / Device Groups / Device Trust Level / User Agent / User Risk Profile**
- **Rule Expiration** (optional start/end/time zone)
- **Action** — Allow / Caution / Block / Conditional / Isolate (Isolate requires Zero Trust Browser)
- **Cascade to URL Filtering** (per-rule) — appears only when the Advanced Settings global *Allow Cascading to URL Filtering* is **disabled**. Forces URL Filtering to evaluate after this rule explicitly allows a transaction.
- **Browser Notification Template / End User Notification / Custom Message / Description**

## User Risk Score Levels

Default ranges:

- Low: 0–29
- Medium: 30–59
- High: 60–79
- Critical: 80–100

Contact Zscaler Support to customize the range per level.
