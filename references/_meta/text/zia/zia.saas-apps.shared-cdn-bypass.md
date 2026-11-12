# Bypassing a SaaS that lives on a shared cloud storage or CDN domain (zia.saas-apps.shared-cdn-bypass)
Also called: bypass s3 bucket; wildcard cloudfront bypass; blob.core.windows.net bypass; googleusercontent bypass; cdn wildcard anti-pattern; exact bucket hostname exemption

The temptation when an app breaks on pinning or inspection is to bypass the CDN or storage domain it uses. For shared storage and CDN domains the rule is in [Writing SSL/TLS inspection exemptions without exempting too much](kb:zia.ssl-inspection.exemptions): avoid exempting `.s3.amazonaws.com`, `.blob.core.windows.net`, `.cloudfront.net` or similar major CDNs without serious consideration, because any subscriber can have a subdomain there.

If one bucket, container or distribution really must be exempt: When one S3 bucket, Blob container or CloudFront distribution must be exempted, exempt its exact hostname (for example `mybucket.s3.amazonaws.com`) rather than the shared parent domain. [zia.saas-apps.shared-cdn-bypass:exact-subdomain-only] A parent-domain exemption on shared storage becomes an uninspected path for any subscriber's storage account, including one an attacker controls, so it is a data-exfiltration channel as well as a malware one. [zia.saas-apps.shared-cdn-bypass:parent-exemption-is-exfil-path]

Whether `googleusercontent.com` belongs on the list is open [gap:zia.saas-apps.shared-cdn-bypass:googleusercontent-wildcard]. What stops working for traffic that is exempted is in [What stops working when traffic bypasses SSL/TLS inspection](kb:zia.ssl-inspection.bypass-impact); where a Cloud Application exists, prefer it to a hand-maintained domain list.

Inferred, not quoted (say so when an answer rests on one):
- [zia.saas-apps.shared-cdn-bypass:exact-subdomain-only] Tier B: Combination of the guide's advice to avoid exempting shared storage parents without serious consideration and its advice to prefer the most specific domains; the guide does not give a bucket example.
- [zia.saas-apps.shared-cdn-bypass:parent-exemption-is-exfil-path] Tier B: The guide says no inspection occurs for any account; naming the effect as exfiltration is the conclusion drawn here.

Not known (open gaps):
- Whether a wildcard on googleusercontent.com carries the same risk [gap:zia.saas-apps.shared-cdn-bypass:googleusercontent-wildcard]: settled by source-read

Area: zia.saas-apps, its subjects in references/_meta/spine/zia/zia.saas-apps.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.ssl-inspection.exemptions.md (Writing SSL/TLS inspection exemptions without exempting too much): Avoid exempting the shared-storage CDN domains `.s3.amazonaws.com`, `.blob.core.windows.net`, `.cloudfront.net` or similar major CDNs without serious consideration: any subscriber can get its own storage subdomain there, so exempting the parent leaves every AWS S3 or Azure Blob storage account uninspected. [zia.ssl-inspection.exemptions:shared-storage-domains]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.uninspectable.md (What SSL/TLS inspection cannot inspect: pinned apps, client certs, QUIC, BYOD, IoT), from zia.saas-apps: Applications that pin a certificate reject any other certificate, so Zscaler cannot inspect them; the guide names Apple, many Microsoft 365 apps, Adobe, Cisco WebEx and the Dropbox app, and says pinning is common in iOS and Android apps. The remedies are to replace the application, bypass it only if it is valuable enough to justify the risk, or deny it. [zia.ssl-inspection.uninspectable:cert-pinning]
- interacts-with references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction), from zia.saas-apps: Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- links-to references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection)
