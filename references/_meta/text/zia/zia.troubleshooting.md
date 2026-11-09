# Troubleshooting Internet & SaaS: routes from a few common symptoms to the subjects that hold the answer, and capturing HTTP headers for Support (zia.troubleshooting)
Also called: zia troubleshooting; internet access not working; capture http headers; har file zscaler support; browser developer tools zscaler support; zscaler support asks for headers

This hub routes the symptoms listed below to the subject that holds the evidence; a symptom not listed is not covered here.

1. **Traffic may not be reaching the service, or not the nearest Public Service Edge.** The check page and the vendor's causes are in [ip.zscaler.com and the vendor's causes when traffic does not land on the nearest Public Service Edge](kb:zia.traffic-forwarding.verification), and the forwarding methods in [How traffic reaches ZIA](kb:zia.traffic-forwarding).
2. **The service feels slow, or a speed test gives a poor figure.** The vendor's own test and why Speedtest, Iperf and ping mislead are in [Measuring ZIA performance: the Cloud Performance Test and why common speed tests mislead](kb:zia.troubleshooting.performance-testing).
3. **Google shows a CAPTCHA or the wrong country.** See [What stops working when traffic bypasses SSL/TLS inspection](kb:zia.ssl-inspection.bypass-impact).
4. **Citrix XenDesktop or XenApp workloads.** Forwarding choices for those workloads are in [Forwarding Citrix XenDesktop and XenApp workloads to ZIA](kb:zia.traffic-forwarding.citrix-workloads).
5. **Sign-in redirects or SAML problems.** See [SAML login failures: browser symptoms, Microsoft Edge security zones and the SAML error codes](kb:zia.authentication.saml-troubleshooting). [zia.troubleshooting:headers-capture-settings]
6. **The Executive Insights mobile app (in the Reports area) will not sign in or shows stale data.** See [Executive Insights mobile app: access errors, data freshness and widgets](kb:zia.reports.executive-insights-app).
7. **Cloud App Control rules do not behave as expected.** See [Cloud App Control troubleshooting: blocked-but-allowed and allowed-but-blocked](kb:zia.cloud-app-control.troubleshooting).
8. **Reading what a transaction recorded.** The web log's fields are in [Value encodings and caveats of ZIA web log fields](kb:zia.logs.web-field-semantics).

**Capturing HTTP headers for Zscaler Support.** Zscaler Support might ask for HTTP headers when troubleshooting certain issues; the Google Chrome page says the HTTP headers identify the specific URL the browser accessed when a web page is opened. The Chrome, Microsoft Edge, Mozilla Firefox and Safari help pages each say this. [zia.troubleshooting:headers-ask] The capture steps are written for Google Chrome version 54.0.2840.71 m and later, Microsoft Edge version 126, Mozilla Firefox version 128 (Mozilla's Inspector tool) and Safari version 17.5 (Safari's Inspector tool). Each of the four pages says that if a different browser version is running, the steps might be different. In Safari, if the Develop menu is not shown, the Advanced tab's Show features for web developers checkbox is selected to make it appear. [zia.troubleshooting:headers-versions] On the Chrome page the Network tab has Keep log and Disable cache checked to save data after SSO redirects, with the network log cleared before the test. The Firefox page selects Disable Cache in the Network tab, and the Safari page selects the Disable Cache checkbox and reloads the page. The Chrome and Edge pages also save the Console messages, and the Firefox page selects Save all Messages to File. [zia.troubleshooting:headers-capture-settings] Chrome version 130 and later does not include sensitive data by default when Export or Save is selected; the page says this includes the Cookie, Set-Cookie and Authorization headers. The Edge page says the same of the latest Microsoft Edge versions. In Chrome, including it takes Allow to generate HAR (with sensitive data) in the Network section, then Export HAR (with sensitive data) or Copy > Copy all as HAR (with sensitive data). The Chrome page warns that such files can expose personally identifiable information such as usernames and passwords, and says to delete any password data before sending the files to Zscaler Support. [zia.troubleshooting:headers-sensitive-data]

What to check:
1. Before asking a user for a HAR file, which browser and version the steps cover, and whether the sensitive-data option is needed and the user has been warned to remove passwords.

Not known (open gaps):
- Sensitive-data handling in Firefox and Safari header captures [gap:zia.troubleshooting:headers-firefox-safari-sensitive-data]: settled by lab-test or source-read

Area: zia.troubleshooting, its subjects in references/_meta/spine/zia/zia.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.authentication.saml-troubleshooting.md (SAML login failures: browser symptoms, Microsoft Edge security zones and the SAML error codes)
- links-to references/_meta/text/zia/zia.cloud-app-control.troubleshooting.md (Cloud App Control troubleshooting: blocked-but-allowed and allowed-but-blocked)
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- links-to references/_meta/text/zia/zia.reports.executive-insights-app.md (Executive Insights mobile app: access errors, data freshness and widgets)
- links-to references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection)
- links-to references/_meta/text/zia/zia.traffic-forwarding.md (How traffic reaches ZIA)
- links-to references/_meta/text/zia/zia.traffic-forwarding.citrix-workloads.md (Forwarding Citrix XenDesktop and XenApp workloads to ZIA)
- links-to references/_meta/text/zia/zia.traffic-forwarding.verification.md (ip.zscaler.com and the vendor's causes when traffic does not land on the nearest Public Service Edge)
- links-to references/_meta/text/zia/zia.troubleshooting.performance-testing.md (Measuring ZIA performance: the Cloud Performance Test and why common speed tests mislead)
