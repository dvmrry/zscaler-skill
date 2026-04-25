# About AppProtection Applications

**Source:** https://help.zscaler.com/zpa/about-appprotection-applications
**Captured:** 2026-04-24 via Playwright MCP.

---

When creating an application segment, you can identify the web applications that require AppProtection before users can access those applications. This is done by using various levels and types of custom and predefined controls in an AppProtection profile before ZPA provides access.

## Benefits

- Identify and select applications for protection against attacks related to OWASP predefined controls and zero-day threats.
- Configure HTTP/S ports and provide certificates for inspection of encrypted traffic.

## Dual-access model with TLS requirement

When you define an application within an application segment and **enable AppProtection** for the application, **Zscaler Client Connector access is automatically applied**. This allows your users to request access to the application via:

- Any web browser that supports **TLS 1.2 with cipher suite `ECDHE-RSA-AES128-GCM-SHA256`**, OR
- Zscaler Client Connector

ZPA supports HTTP and HTTPS protocols.
