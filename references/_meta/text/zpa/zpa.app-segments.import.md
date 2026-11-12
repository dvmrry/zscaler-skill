# Application Segment Import: the CSV template, limits, re-import and merge (zpa.app-segments.import)
Also called: Application Segment Import; bulk import application segments; import application segments CSV; merge imported application segments

Application Segment Import lets an admin bulk import database files, or bulk import application information, for faster application segment configuration. [zpa.app-segments.import:what-it-is]

**The file.** Download Sample CSV downloads a sample template to the admin's system, and the page says to open the template file and add information for the fields Application Name, Application FQDN/IP, Server IP, TCP Ports, UDP Ports, App Owner Contact, Application Importance, Hosting Location and Environment. [zpa.app-segments.import:template-fields] The limit of application segments that can be imported is 50,000; importing a file with more than 50,000 entries of application segment data fails. Depending on how many application segments are imported, the import time can increase. [zpa.app-segments.import:limit] The value formats and what the importance and environment columns do are open [gap:zpa.app-segments.import:csv-values].

**After the import.** After an import, a message confirms the number of successfully imported entries and the number of failed downloads. A link in the message downloads a new file containing the failed entries and the reasons for their import failure. [zpa.app-segments.import:results] If a file is imported with entries that were included in a previous import, the new entries are automatically added as additional information to the existing entries of the same name. [zpa.app-segments.import:reimport-adds]

**Merging.** Merging imported application segments takes at least two application segments selected from the table, then a Defined Application Segment and a Port Type chosen from the drop-down menus before clicking Apply. The table can show All, Defined Application Segments, Undefined Application Segments, or Partially Selected Application Segments. [zpa.app-segments.import:merge] Whether a merge creates defined segments is open [gap:zpa.app-segments.import:merge-creates-defined].

Recommendations that Private Access generates from user logs are in [AI-powered recommendations for application segments: prerequisites, reading a recommendation and settings](kb:zpa.app-segments.ai-recommendations); the segment hub is [ZPA application segments](kb:zpa.app-segments).

What to check:
1. Whether the import file has more than 50,000 entries, which fails the import.
2. The failed-entries file linked from the result message for the reason each entry failed.
3. Whether the entries were in an earlier import, in which case they are added as additional information to the existing entries of the same name.

Not known (open gaps):
- CSV value formats and what Application Importance and Environment do [gap:zpa.app-segments.import:csv-values]: settled by source-read or lab-test
- Whether merging imported application segments creates defined application segments [gap:zpa.app-segments.import:merge-creates-defined]: settled by lab-test

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments)
- links-to references/_meta/text/zpa/zpa.app-segments.ai-recommendations.md (AI-powered recommendations for application segments: prerequisites, reading a recommendation and settings)
