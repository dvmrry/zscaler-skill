# Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings (zbi.file-scanning)
Also called: sandbox integration zero trust browser; Votiro isolation profile; Votiro Secure File Gateway; flattened PDF CDR; red Sandbox banner; isolation sandbox verdict

**Sandbox.** Using Sandbox with Zero Trust Browser requires a Sandbox policy configured in Internet & SaaS and the Sandbox option for file transfer enabled in the isolation profile. [zbi.file-scanning:sandbox-prerequisites] In the Internet & SaaS sandbox flow where the file is quarantined (the user sees a temporary quarantine page), the article says analysis of the file can take anywhere between 5 to 10 minutes, and that if the sandbox determines the file is malicious it blocks the file download. [zbi.file-scanning:sandbox-analysis-time] When a downloaded document meets the sandbox criteria, the user is redirected to an isolated session to view the file while analysis runs; if the verdict is Malicious the user can keep viewing in isolation or download a flattened PDF with no active content, and if Benign the user can download the original file. [zbi.file-scanning:sandbox-flow-verdicts] After rendering, a red Sandbox banner appears if the sandbox finds malicious content and a blue one if not; clicking the red banner offers the Original File or a Flattened PDF, and clicking the blue banner downloads the original file. [zbi.file-scanning:sandbox-banner-colors] The download options after a Malicious verdict differ between the two articles [divergence:zbi.file-scanning:malicious-verdict-download-options].

**Votiro.** Votiro integration sanitizes supported files downloaded from or uploaded to internet destinations through its Content Disarm and Reconstruction services, which return a file in the same format as the original, sanitized. [zbi.file-scanning:votiro-cdr-behavior] Votiro is configured in the Internet & SaaS isolation profile for admins with access to the Votiro Secure File Gateway: separate Download and Upload toggles and a Votiro Policy Name, with a default Votiro policy applied if none is selected. [zbi.file-scanning:votiro-profile-settings] The Votiro article says any file downloaded or uploaded to the isolation container is inline scanned to ensure it does not contain malware. [zbi.file-scanning:inline-scan] The partner-page description is in [The partner integrations page lists integrating with Votiro CDR under Zero Trust Browser > Chrome Enterprise Browser > Votiro, to further sanitize files accessed through Zero Trust Browser; its path is the Chrome Enterprise Browser. Votiro allows any file downloaded or uploaded to or from internet destinations to be sanitized by the CDR services, which consume the original file and return a file in the same format, sanitized.](kb:zbi.cloud-browser:votiro-cdr).

Limits on the files sent to the sandbox are open [gap:zbi.file-scanning:sandbox-limits].

What to check:
1. Whether a Sandbox policy exists in Internet & SaaS and the profile has the Sandbox option for file transfer enabled.
2. Whether the Votiro Download or Upload toggle is on in the Internet & SaaS profile.

Sources disagree (name both sides):
- For a Malicious sandbox verdict in an isolated session, the About page says the user can keep viewing in isolation or download a flattened PDF, while the Using page says the red banner offers the Original File or a Flattened PDF. [divergence:zbi.file-scanning:malicious-verdict-download-options]
  - zscaler-help: On a Malicious verdict the user can keep viewing in isolation or download a flattened PDF with no active content.
  - zscaler-help: On a malicious file the red Sandbox banner offers the Original File or a Flattened PDF.
  Impact: An answer on whether a user can download the original file after a Malicious verdict depends on which article is followed; both are quoted, neither is settled.

Not known (open gaps):
- File size or type limits for files an isolation session sends to the sandbox [gap:zbi.file-scanning:sandbox-limits]: settled by source-read. Blocks: saying which files get sandboxed from isolation

Area: zbi.file-scanning, its subjects in references/_meta/spine/zbi/zbi.file-scanning.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.policy.md (What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy)
- see-also references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)
- see-also references/_meta/text/zbi/zbi.file-handling.md (Transferring and viewing files in isolation: file types, size limit, Protected Storage and printing)
