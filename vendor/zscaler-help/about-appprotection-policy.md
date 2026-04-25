# About AppProtection Policy

**Source:** https://help.zscaler.com/zpa/about-appprotection-policy
**Captured:** 2026-04-24 via Playwright MCP.

---

AppProtection policy rules allow you to set up AppProtection controls for Private Access (ZPA) web applications.

**AppProtection policies work similarly to access policies.** You can reuse an existing access policy's criteria to create an AppProtection policy. This allows you to match up your AppProtection policies to your access policies.

## Benefits

- Create a policy to inspect traffic to internal web applications based on specific criteria — application segments, Client Connector posture profiles, SAML and SCIM attributes.
- Apply a previously created AppProtection profile to a policy with the default actions (Allow, Block, or Redirect) set for each related AppProtection control.

## Building blocks

AppProtection policy rules are composed of:

- **Criteria** — conditions of a policy rule. A user's application request must match all the conditions.
- **Boolean Operators** — `AND` and `OR` between criteria.

## AppProtection Policy Page

(Policies > Cybersecurity > Inline Security > Protection Policies > AppProtection)

- **Rule Order** — Private Access applies policy rules based on the order they are listed.
- **Rule Action** — `Inspect` or `Bypass Inspection`.
- **Criteria** — visual representation of SAML attributes, application segments, posture profiles, and Boolean logic.

> Depending on your AppProtection subscription, you see the following Security policy option: **Browser Protection**.
