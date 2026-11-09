# How the Internet & SaaS security policies troubleshooting runbook scopes a case to Malware Protection, ATP or Sandbox and what support asks for (zia.troubleshooting.security-policies-runbook)
Also called: Internet & SaaS Security Policies Support Troubleshooting Runbook; security policies troubleshooting runbook

The runbook lists Malware Protection, Advanced Threat Protection (ATP) and Sandbox as the security controls, and uses Web Insights log information to scope which control is involved. [zia.troubleshooting.security-policies-runbook:three-controls]

**Where the symptoms go.** Malware Protection and ATP block and allow checks and the Unscannable Files rules are in [Security policies runbook: Malware Protection and ATP log values, unexpected block and allow checks, and Unscannable Files rules](kb:zia.troubleshooting.security-policies-runbook.malware-atp). Sandbox symptoms are in [Security policies runbook: Sandbox symptoms (licensing, no active content, quarantine, Patient 0, MD5 report)](kb:zia.troubleshooting.security-policies-runbook.sandbox).

**Detection disagreements and CVE queries.** For a query about Zscaler's protection against a specific CVE or vulnerability, the runbook says to search the ThreatLabz Product Security Advisories for the CVE number or keyword. [zia.troubleshooting.security-policies-runbook:cve-route] When an admin disagrees with Zscaler's detection of a URL or file, the runbook says to export the Web Insights logs with all fields selected, check Zulu (Reanalyze an existing verdict), search the Threat Library by threat name, check VirusTotal (noting the verdict and recording its URL), and submit the files to the Sandbox Scanning Portal; it then states that the maximum size for one file is 20 MB. [zia.troubleshooting.security-policies-runbook:detection-disagreement]

**Policy block reasons.** For a policy block action, the runbook refers to Policy Reasons. [zia.troubleshooting.security-policies-runbook:policy-block-reasons] [gap:zia.troubleshooting.security-policies-runbook:policy-reasons-content]

**Further steps.** For Malware Protection and ATP cases, the runbook's Further Steps list asks for screenshots of the Malware Policy & Exception configuration and the Advanced Threat Protection Policy & Exception configuration, the Web Insights logs with all fields selected, and to temporarily enable Remote Assistance. [zia.troubleshooting.security-policies-runbook:malware-atp-support-data] The runbook's closing Further Steps list, after the Sandbox section, asks for screenshots of the Sandbox policy configuration and the Advanced Threat Protection Exception configuration, for the Web Insights logs with all fields selected, and to temporarily enable Remote Assistance. [zia.troubleshooting.security-policies-runbook:sandbox-support-data]

Not known (open gaps):
- What Allow to Differentiate means in the unexpected-block example [gap:zia.troubleshooting.security-policies-runbook:policy-reasons-content]: settled by source-read

Area: zia.troubleshooting, its subjects in references/_meta/spine/zia/zia.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.troubleshooting.security-policies-runbook.malware-atp.md (Security policies runbook: Malware Protection and ATP log values, unexpected block and allow checks, and Unscannable Files rules)
- links-to references/_meta/text/zia/zia.troubleshooting.security-policies-runbook.sandbox.md (Security policies runbook: Sandbox symptoms (licensing, no active content, quarantine, Patient 0, MD5 report))
