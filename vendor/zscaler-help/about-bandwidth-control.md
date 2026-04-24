# About Bandwidth Control

**Source:** https://help.zscaler.com/zia/about-bandwidth-control
**Captured:** 2026-04-24 via Playwright MCP.

---

Bandwidth control allows you to preserve access to your business-critical applications regardless of your internet pipe consumption. This enables you to do things like adding more restrictive rules around social media and streaming media.

For example, you can allocate a maximum of 10% of the bandwidth to the streaming media, social media, or file share bandwidth classes. When bandwidth is restricted, these classes are not guaranteed any bandwidth and are restricted to 10% of the bandwidth when it is available.

## Key topics covered

- Bandwidth Control at Two Levels
- How Bandwidth Control Works
- Best Practices for Bandwidth Control Policy
- Recommended Bandwidth Control Policy

For a sample policy, see *Bandwidth Control Policy Example*. For where this policy fits in the overall policy enforcement order, see *About Policy Enforcement*.

## Monitoring

- **Bandwidth Control dashboard** — view your organization's bandwidth usage in real time.
- **Analytics > Interactive Reports** — standard bandwidth-control reports, plus custom reports.

## The Bandwidth Control page (Policy > Bandwidth Control)

You can:

- Configure a bandwidth control policy rule.
- View the recommended policy for bandwidth control.
- Select a **View by** option:
  - **Rule Order** — rules listed in ascending rule-order.
  - **Rule Label** — rules grouped by label; Expand All / Collapse All buttons.
- Search for a configured rule.
- View a list of all configured rules.

### Per-rule columns

- **Rule Order** — evaluated in ascending numerical order; the **default rule is evaluated last**.
- **Admin Rank** — visible only if admin ranking is enabled in Advanced Settings.
- **Rule Name**.
- **Criteria** — e.g., Bandwidth Classes, Protocols, etc.
- **Action**.
- **Label and Description**.

Admins can modify the table columns, edit a rule, or duplicate a rule.
