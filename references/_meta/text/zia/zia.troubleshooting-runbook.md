# How the Internet & SaaS Access Control Policies troubleshooting runbook triages a case and routes it to its pages (zia.troubleshooting-runbook)
Also called: access control policies troubleshooting runbook; Internet & SaaS Access Control Policies Support Troubleshooting Runbook; initial information set; policy action field routing

The Access Control runbook triage asks first whether the website loads after a delay or not at all (delay or slowness is routed to Internet & SaaS performance), then whether transactions go through Zscaler (No or Not sure is routed to traffic not going through Zscaler). [zia.troubleshooting-runbook:triage-first-two] The runbook's triage defines QUIC, also known as http/3 or h3, as a transport protocol developed by Google that operates over UDP instead of TCP. [zia.troubleshooting-runbook:quic-definition]

**Routing by log value.** When an Allow policy is configured but the web logs show access blocked or cautioned, the runbook directs the reader to the Policy Action field value for the URL and lists these pages: Undecryptable Traffic Block, Not Allowed to Use HTTP Tunnel, Blocked Due to Server Probe Failure, Access Denied Due to Bad Server Certificate, Blocked Due to Bad SSL Record, Access Denied Due to Domain Fronting and Not Allowed to Browse this Category. [zia.troubleshooting-runbook:allow-but-blocked-routing] The pages for those Policy Action values [gap:zia.troubleshooting-runbook:policy-action-values-are-titles] are grouped in [Runbook: SSL and HTTP-tunnel block outcomes (bad SSL record, undecryptable traffic, server probe failure, domain fronting, HTTP tunnel)](kb:zia.troubleshooting-runbook.ssl-block-actions), [Runbook: bad server certificates and untrusted certificates that are allowed](kb:zia.troubleshooting-runbook.server-certificates) and [Runbook: unable to access a site or blocked for browsing a category](kb:zia.troubleshooting-runbook.access-failures). For traffic that is not inspected although the SSL Inspection policy has no exemptions, the runbook says to read the SSL Policy Reason field value for the URL and refer to the SSL Policy Reason Runbook. [zia.troubleshooting-runbook:not-inspected-routing] The SSL Policy Reason values are in [Runbook: SSL Policy Reason values and what causes each](kb:zia.troubleshooting-runbook.ssl-policy-reasons). For Firewall Control, the runbook routes two outcomes to their own pages: Allow Due to Insufficient App Data and Bypassed Due to Missing Config. [zia.troubleshooting-runbook:firewall-control-routing] Those two are in [Runbook: Firewall Control outcomes Allow due to insufficient app data and Bypassed due to missing config](kb:zia.troubleshooting-runbook.firewall-actions).

**Other runbook pages.** Policy configured but the logs show a different outcome is in [Runbook: policy configured but the logs show a different outcome](kb:zia.troubleshooting-runbook.policy-mismatch), URL category conflicts are in [Runbook: URL category conflicts, Miscellaneous and Newly Registered and Observed Domains handling](kb:zia.troubleshooting-runbook.url-category-conflicts), and header, QUIC, XFF and SSL configuration checks are in [Runbook diagnostics: HAR analysis, QUIC detection, XFF compatibility and SSL configuration checks](kb:zia.troubleshooting-runbook.diagnostics).

**Initial Information Set.** Zscaler Support's Initial Information Set for these cases is Remote Assistance in view-only mode plus: the client IP output (ipconfig /all and route print 165.225.* on Windows; ifconfig /all and route get 165.225.0.0 on Mac), a screenshot of https://ip.zscaler.com, an error screenshot if applicable, the timestamp or period, the complete URL or destination IP, and the policy name or a screenshot of the policy. [zia.troubleshooting-runbook:initial-information-set] If Remote Assistance cannot be enabled, the runbook says to download Web Insights logs with all columns for the period, using not more than 2-3 relevant filters; it names URL Search, User, Client IP and Location as useful filters. [zia.troubleshooting-runbook:initial-information-set-logs]

Not known (open gaps):
- Whether the runbook page titles equal the logged Policy Action strings [gap:zia.troubleshooting-runbook:policy-action-values-are-titles]: settled by tenant-data or source-read

Area: zia.troubleshooting-runbook, its subjects in references/_meta/spine/zia/zia.troubleshooting-runbook.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.access-failures.md (Runbook: unable to access a site or blocked for browsing a category)
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.diagnostics.md (Runbook diagnostics: HAR analysis, QUIC detection, XFF compatibility and SSL configuration checks)
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.firewall-actions.md (Runbook: Firewall Control outcomes Allow due to insufficient app data and Bypassed due to missing config)
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.policy-mismatch.md (Runbook: policy configured but the logs show a different outcome)
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.server-certificates.md (Runbook: bad server certificates and untrusted certificates that are allowed)
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.ssl-block-actions.md (Runbook: SSL and HTTP-tunnel block outcomes (bad SSL record, undecryptable traffic, server probe failure, domain fronting, HTTP tunnel))
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.ssl-policy-reasons.md (Runbook: SSL Policy Reason values and what causes each)
- links-to references/_meta/text/zia/zia.troubleshooting-runbook.url-category-conflicts.md (Runbook: URL category conflicts, Miscellaneous and Newly Registered and Observed Domains handling)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.troubleshooting.md (Troubleshooting Internet & SaaS: routes from a few common symptoms to the subjects that hold the answer, and capturing HTTP headers for Support)
- see-also references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection)
- see-also references/_meta/text/zia/zia.ssl-inspection.uninspectable.md (What SSL/TLS inspection cannot inspect: pinned apps, client certs, QUIC, BYOD, IoT)
- see-also references/_meta/text/zia/zia.ssl-inspection.cipher-suites.md (Which TLS versions and cipher suites SSL/TLS inspection supports, and what happens to the rest)
- see-also references/_meta/text/zia/zia.ssl-inspection.actions.md (What an SSL/TLS inspection action does: Inspect, Do Not Inspect, Block and their settings)
- see-also references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)
- see-also references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)
- see-also references/_meta/text/zia/zia.url-categories.entry-matching.md (How URL category entries match requests (wildcards))
- see-also references/_meta/text/zia/zia.cloud-app-control.troubleshooting.md (Cloud App Control troubleshooting: blocked-but-allowed and allowed-but-blocked)
- see-also references/_meta/text/zia/zia.firewall.network-applications.md (Network applications and network application groups: DPI identification, undetermined-app outcomes, rule placement)
- see-also references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- see-also references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- see-also references/_meta/text/zia/zia.advanced-settings.partial-configuration.md (Behavior When Partial Configuration Available: Fail Open, Fail Closed and Best Effort Policies)
- see-also references/_meta/text/zia/zia.advanced-settings.http-tunnel-control.md (HTTP CONNECT tunnel control and the domain fronting blocks in Advanced Settings)
- see-also references/_meta/text/zia/zia.advanced-settings.m365-one-click.md (Microsoft 365 One Click configurations: the two options, where each is set, and the DNS Control rule)
- see-also references/_meta/text/zia/zia.authentication.exemptions.md (Destinations that skip authentication)
