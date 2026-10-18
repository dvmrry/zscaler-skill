Sandbox questions arrive as "why was this file blocked", "why was it not analyzed", or "why is it stuck". Ask them in this order; skipping a step is how a Sandbox answer ends up blaming the wrong engine.

1. **Which engine blocked it?** The Blocked Policy Type in the transaction log decides whether this is a Sandbox question at all: [[zia.sandbox.verdicts]]. Malware Protection and ATP are covered in [[zia.malware-protection]] and [[zia.atp]].
2. **Was the file ever eligible for analysis?** Subscription tier, file type and size, static pre-checks, and whether the traffic was decrypted: [[zia.sandbox.coverage]], with the decryption side in [[zia.ssl-inspection.pipeline]].
3. **What does the report say, and how far can it be trusted?** [[zia.sandbox.report]].
4. **Is the file held, or does the user keep re-downloading?** One-time links, per-request hashes, and Public Service Edge lag: [[zia.sandbox.quarantine]].

The rules that decide what happens to first-seen files are in [[zia.sandbox.rules]]; the out-of-band submission calls are in [[zia.sandbox.submission]]; the tenant's custom hash list is in [[zia.sandbox.md5-blocklist]]. URL Filtering can block before Sandbox is reached: [[zia.url-filtering]]. Provider and SDK defects on Sandbox resources are in [[zia.terraform.error-handling]] and [[zia.terraform.data-source-fidelity]].
