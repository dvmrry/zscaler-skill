# About Browser Access

**Source:** https://help.zscaler.com/zpa/about-browser-access
**Captured:** 2026-04-24 via Playwright MCP.

---

Browser Access allows you to leverage a web browser for user authentication and application access over Private Access (ZPA), without requiring users to install Zscaler Client Connector on their devices.

For certain use cases, it might not be feasible or desirable to install Zscaler Client Connector on all devices. For example, you might want to:

- Control user access to applications on devices with operating systems that are not currently supported by Zscaler Client Connector.
- Provide third-party access to applications on devices that might not be owned or managed by your company (e.g., contractor or partner-owned devices).

Browser Access enhances your Private Access experience by enabling you to:

- Make applications accessible for your users from any web browser without requiring Zscaler Client Connector or browser plugins and configurations.
- Use your existing Identity Provider (IdP) to provide access to your current users, contractors, and other third-party users without managing an internet footprint.

**When Browser Access is enabled on an application within an application segment, Zscaler Client Connector access is automatically applied.** This allows users to request access to the application via any web browser that supports TLS 1.2 (with cipher suite `ECDHE-RSA-AES128-GCM-SHA256`) with a proxy that doesn't modify the webpage contents, or via Zscaler Client Connector.

Private Access supports HTTP and HTTPS protocols, and Private Access inserts a `Via` header in HTTP requests. Private Access also accepts CORS requests with the right settings and valid OPTIONS requests that include certain headers.

Private Access Browser Access requires that the application server supports TLS 1.2 encryption.

Supported browsers for CORS requests: Firefox 81.0, Chrome 64_65, Google Chrome 86.0.4240.75, Microsoft Edge 86.0.622.43, Safari 12.0, and Safari 13.0.

Browser Access cookies are **session-based** — they're cleared when a web browser's session terminates. Therefore, users must authenticate before accessing applications via Browser Access. In addition, users are asked to reauthenticate periodically based on the Authentication Timeout setting of the Private Access timeout policy rule.

## External vs internal hostname — two scenarios

**Different external and internal hostname:**

- Internal hostnames are not exposed, so there is no record of internal hostnames on public DNS.
- Backend SSL cannot be verified, so a web server certificate error is displayed to end users because the hostname of the application doesn't match the hostname of the certificate.

**Same external and internal hostname:**

- Internal hostnames are exposed on public DNS.
- Backend SSL can be verified, so end users will not receive a web server certificate error.

## The Browser Access page (Policies > Access Control > Clientless > Access Methods > Browser Access)

You can:

- View and add DNS search domains.
- Expand all rows to see more information about each application.
- Filter the table.
- View a list of all applications specifically configured for Browser Access within an application segment. Columns:
  - **Name**
  - **Segment Group**
  - **Server Groups**
  - **Canonical Name (CNAME)**
  - **Certificate** — the Browser Access web server certificate
  - **Domain** — fully qualified domain name
  - **Status**
  - **Application Protocol** — HTTPS or HTTP
  - **Application Port**
