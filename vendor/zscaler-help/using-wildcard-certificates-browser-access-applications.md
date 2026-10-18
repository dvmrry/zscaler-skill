# Using Wildcard Certificates for Browser Access Applications

**Source:** https://help.zscaler.com/zpa/using-wildcard-certificates-browser-access-applications
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484096, revision 3207600

---

Private Access (ZPA) supports using wildcard certificates when defining Browser Access applications within an application segment. You can use a wildcard certificate for multiple fully qualified domain names (FQDNs) within a single application segment or within multiple application segments.
For example, you can create two application segments:
- App1 that contains app1.example.com
- App2 that contains app2.example.com
For both application segments, you use the same wildcard certificate: *.example.com.
You can also use a wildcard certificate with a wildcard application. However, while the wildcard application includes subdomains, the wildcard certificate only matches against one level. For example:
- A *.example.com wildcard application matches against app1.example.com, app2.example.com, and app1.local.example.com.
- A *.example.com wildcard certificate matches against app1.example.com and app2.example.com, but will not match against app1.local.example.com. In this example, Private Access does not consider the wildcard certificate to be valid for app1.local.example.com.
If you need to enable Browser Access for a particular subdomain, you must define a separate wildcard application (i.e., *.local.example.com) within an application segment that includes the equivalent wildcard certificate.
To learn more, see About (Web Server) Certificates, About Browser Access, and Configuring Defined Application Segments.
