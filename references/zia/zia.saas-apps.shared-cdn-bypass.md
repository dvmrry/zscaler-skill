The temptation when an app breaks on pinning or inspection is to bypass the CDN or storage domain it uses. For shared storage and CDN domains the rule is in [[zia.ssl-inspection.exemptions]]: do not exempt `.s3.amazonaws.com`, `.blob.core.windows.net`, `.cloudfront.net` or similar, because any subscriber can have a subdomain there.

If one bucket, container or distribution really must be exempt: {{exact-subdomain-only}} {{parent-exemption-is-exfil-path}}

Whether `googleusercontent.com` belongs on the list is open {{gap:googleusercontent-wildcard}}. What stops working for traffic that is exempted is in [[zia.ssl-inspection.bypass-impact]]; where a Cloud Application exists, prefer it to a hand-maintained domain list.
