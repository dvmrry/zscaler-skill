"ZIA blocked my file" has three candidate engines, and the first question is which one logged the block. {{blocked-policy-type}} Only the Sandbox case has an API investigation path. {{sandbox-row}} The report side is in [[zia.sandbox.report]]. {{mp-atp-no-transaction-api}} {{mp-atp-python-surfaces}} Their policy configuration is covered in `references/zia/malware-and-atp.md`, which also holds the console diagnosis workflow.

When the block is a Sandbox one, read the report's classification. {{classification-types}}

A clean Sandbox verdict does not clear the file. {{benign-not-clean}} Eligibility, meaning whether Sandbox saw the file at all, is in [[zia.sandbox.coverage]]; URL Filtering order is in [[zia.url-filtering]].

What to check: the Blocked Policy Type from the logged transaction, the MD5 from the same log line, and only then the report.
