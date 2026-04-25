# Configuring AppProtection Policies

**Source:** https://help.zscaler.com/zpa/configuring-appprotection-policies
**Captured:** 2026-04-24 via Playwright MCP.

---

To configure an AppProtection policy rule:

1. Go to **Policies > Cybersecurity > Inline Security > Protection Policies > AppProtection**.
2. Click **Add Rule**.
3. In the **Add AppProtection Rule** window:
   - **Name** — no special characters except `.`, `-`, `_`
   - **Description** — optional
   - **Rule Action** — `Inspect` or `Bypass Inspection`
   - **AppProtection Profile** — choose a security profile with a set of common or control-specific actions

## Criteria section

You can copy criteria from an existing **Access Policy** rule, or use **Add Criteria** (up to 10 condition sets):

- **Applications** — application segments and segment groups (`OR` between multiples)
- **Client Connector Posture Profiles** — `AND` between condition sets; `OR` within a set, toggleable to `AND`
- **Client Connector Trusted Networks** — `OR` between multiples
- **Client Types** — Client Connector, Cloud Browser, Cloud Connector, Machine Tunnel, Web Browser, Internet & SaaS (ZIA) Service Edge
- **Cloud Connector Groups** — `AND` between multiples
- **Machine Groups + platform criteria**
- **SAML and SCIM Attributes** / **Session and User Attributes** (ZIdentity)
