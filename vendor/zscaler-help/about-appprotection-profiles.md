# About AppProtection Profiles

**Source:** https://help.zscaler.com/zpa/about-appprotection-profiles
**Captured:** 2026-04-24 via Playwright MCP.

---

AppProtection profiles allow you to determine how traffic is inspected and managed.

Each AppProtection profile uses a **Paranoia Level** if using API controls, ThreatLabZ predefined controls, OWASP predefined controls, or WebSocket predefined controls.

Predefined controls are a selection of the controls to establish the requirements for AppProtection, and what action is taken for those controls. You can use:

- **Custom WebSocket controls** or **HTTP custom controls**
- **ThreatLabZ predefined controls**, **OWASP predefined controls**, **API controls**, **WebSocket predefined controls**

There is flexibility to have **the same action for all the controls**, or **a different action for each control** in the AppProtection profile.

## Benefits

- Create a comprehensive security profile by selecting controls from multiple categories: OWASP predefined controls, HTTP custom controls, WebSocket controls, API controls, and ThreatLabZ controls.
- Assign a specific action to take in the event of malicious traffic — Allow, Block, or Redirect.

## Default AppProtection Profile Template

A default AppProtection profile is included with the setup of your ZPA account. It is named **OWASP Top-10 for Visibility**.

- Use the default profile as a template for custom AppProtection profiles.
- The default profile **can't be edited or deleted**.
- Its **Paranoia Level is set to 1**.
- You can use this default profile in an AppProtection policy.
- **Some controls are excluded from the default AppProtection profile for higher efficacy.**

After creating an AppProtection profile, add it to an AppProtection policy for the ZPA service to use.

## Profile table fields (expanded row)

- Description
- Paranoia Level
- Used in AppProtection Controls — control number, control name, control action, control exception (with exception detail view)
