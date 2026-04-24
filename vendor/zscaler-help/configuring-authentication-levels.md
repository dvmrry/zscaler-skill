# Configuring Authentication Levels

**Source:** https://help.zscaler.com/zidentity/configuring-authentication-levels
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

ZIdentity Help 
Authentication 
Configuring Authentication Levels
ZIdentity
Configuring Authentication Levels
Ask Zscaler

An authentication level in ZIdentity represents a specific strength of authentication with hierarchical levels where higher levels represent stronger authentication methods. When users are authenticated at a higher level, their authentication level satisfies policies that require a sub-level of authentication. These authentication levels are mapped with access policies in supported Zscaler services to enable step-up authentication for resources.

To configure an authentication level:

Go to Administration > Identity > ZIdentity > Authentication Levels.

The Authentication Levels page appears.

On the Authentication Levels page:

Click New Authentication Level.
Level Name: Enter a name for the level.
Validity: Enter a validity period for this level of authentication. You can specify the validity period in minutes, hours, or days.
Description: Enter a description for the level.
Message to the user (optional): Enter a message that you want to be shown to the users via Zscaler Client Connector notifications while accessing resources that require this level of authentication.
(Optional) If you want to create sub-levels of authentication with different authentication contexts:
Click Create level beneath the level you want to add a sub-level.
Sub-Level Name: Enter a name for the sub-level.
Validity: Enter a validity period for this level of authentication. You can specify the validity period in minutes, hours, or days.
Description: Enter a description for the sub-level.
Message to the user (optional): Enter a message that you want to be shown to the users via Zscaler Client Connector notifications while accessing resources that require this level of authentication.

See image.

Close

Click Save.
You can create multiple sub-levels forming a tree hierarchy. A tree can contain a total of up to 32 authentication levels and the maximum depth for any branch cannot exceed 4.
The validity period for a parent level must be less than the validity period defined for any of its sub-levels.

After configuring authentication levels, you need to create access policies in the supported Zscaler services.

If you have configured external IdP for authentication via OIDC, you need to map the authentication levels to their respective acr values in the IdP. To learn more about external IdPs, see About External Identity Providers.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Using ZIdentity with Zscaler Client Connector Device Tokens
Configuring the Authentication Session
Configuring Authentication Levels
Managing Device Token Authentication
Understanding Step-Up Authentication
Configuring Step-Up Authentication
