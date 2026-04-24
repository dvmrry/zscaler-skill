# Understanding Step-Up Authentication (ZIdentity)

**Source:** https://help.zscaler.com/zidentity/understanding-step-up-authentication
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

ZIdentity Help 
Authentication 
Understanding Step-Up Authentication
ZIdentity
Understanding Step-Up Authentication
Ask Zscaler

Step-up authentication allows dynamic requests for stronger authentication when users attempt to access sensitive resources or when risk signals indicate a potential threat. This feature enhances the existing authentication process by requiring multi-factor authentication (MFA) when needed, ensuring that access to high-risk or sensitive data is protected. Step-up authentication is a method that prompts users to reauthenticate with a higher assurance level (e.g., using MFA) when accessing specific resources. This process helps organizations verify user identity with greater certainty, ensuring that only authorized users can access sensitive applications or data. For example, if a user logs in with a username and password (a lower assurance level), they might still be asked to verify their identity via MFA (a higher assurance level) when accessing a sensitive resource, such as financial information or critical applications.

Step-up authentication in ZIdentity enables organizations to:

Enhance Security: Protect sensitive resources by requiring stronger authentication methods when necessary.
Provide Dynamic Risk-Based Access: Automatically adjust the level of authentication required based on user behavior or risk signals.
Simplify Compliance: Meet regulatory requirements by ensuring high-assurance authentication for critical data access.

Step-up authentication is supported only with OIDC-based external IdP integrations.

Use Cases for Step-Up Authentication

Step-up authentication is essential for organizations managing different access levels for users and resources. The following are common scenarios where step-up authentication is useful:

Sensitive Resource Access: When users attempt to access critical applications, step-up authentication prompts them to provide additional authentication, as defined by access policies configured in Internet & SaaS (ZIA) and Private Access (ZPA), which integrate with ZIdentity to enforce these policies.
Increased Risk Detected: If the system detects that a user’s behavior is unusual or the environment changes (e.g., accessing from an unrecognized device or location), step-up authentication might be triggered to request a higher authentication level.
Compliance Requirements: For regulatory reasons, certain data must be protected with MFA to ensure that only authorized users can access it.
Step-Up Authentication Process

Step-up authentication is configured using authentication levels (e.g., AL1 to AL4), representing increasing authentication strength. These levels are hierarchical, where higher levels provide stronger assurance. The following sections outline the key steps in authentication with step-up authentication enabled:

User Attempts Access: The user logs in to ZIdentity with standard credentials (e.g., username and password).
Accessing a Sensitive Resource: When the user attempts to access a high-sensitivity resource (as defined by policies in Internet & SaaS or Private Access), ZIdentity checks the required authentication level.
Step-Up Triggered: If the user’s current authentication level is insufficient (e.g., they logged in with a basic password), ZIdentity prompts the user to reauthenticate, typically using MFA via Zscaler Client Connector.
Access Granted: After the user successfully authenticates with the required level, access is granted.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Using ZIdentity with Zscaler Client Connector Device Tokens
Configuring the Authentication Session
Configuring Authentication Levels
Managing Device Token Authentication
Understanding Step-Up Authentication
Configuring Step-Up Authentication
