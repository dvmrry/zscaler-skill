# Using Wildcard Certificates for Browser Access Applications

**Source:** https://help.zscaler.com/zpa/using-wildcard-certificates-browser-access-applications
**Captured:** 2026-04-24 via Playwright MCP.

---

Private Access (ZPA) supports using wildcard certificates when defining Browser Access applications within an application segment. You can use a wildcard certificate for multiple fully qualified domain names (FQDNs) within a single application segment or within multiple application segments.

## Example

Two application segments:

- App1 containing `app1.example.com`
- App2 containing `app2.example.com`

Both application segments use the same wildcard certificate: `*.example.com`.

## Wildcard certificate scope — only one level

You can use a wildcard certificate with a wildcard application. However, **while the wildcard application includes all subdomains, the wildcard certificate only matches against one level.** Example:

- A `*.example.com` wildcard **application** matches against `app1.example.com`, `app2.example.com`, and `app1.local.example.com`.
- A `*.example.com` wildcard **certificate** matches against `app1.example.com` and `app2.example.com`, **but will not match against `app1.local.example.com`**.

So Private Access will not consider the wildcard certificate to be valid for `app1.local.example.com`.

**Therefore:** if you need to enable Browser Access for a particular subdomain, you must define a separate wildcard application (e.g., `*.local.example.com`) within an application segment that includes the equivalent wildcard certificate.
