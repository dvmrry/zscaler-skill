# DLP file size, archive and text limits: why DLP did not catch a large file (zia.dlp.inspection-limits)
Also called: dlp 400 mb; dlp file size limit; dlp did not catch large file; dlp archive depth; dlp nested zip; dlp extracted text limit; dlp incident evidence size; dlp 100 mb

Size, depth and extracted-text limits bound what DLP scans, and the sources state them inconsistently [divergence:zia.dlp.inspection-limits:file-size-conflict].

DLP engines are documented to support files up to 400 MB. [zia.dlp.inspection-limits:whole-file-cap] Whether that is the true maximum is open [gap:zia.dlp.inspection-limits:file-size-cap]. DLP engines can scan the first 100 MB of a file's extracted text. [zia.dlp.inspection-limits:extracted-text-window] A document under the file-size cap can still have its tail uninspected when its extracted text is larger than 100 MB. [zia.dlp.inspection-limits:extracted-text-tail-uninspected]

**Archives.** For an archive, the size of each file inside it when decompressed can also be a maximum of 100 MB, a separate cap from the whole-file cap. [zia.dlp.inspection-limits:archive-entry-cap] DLP engines can scan up to 5 levels of compression. [zia.dlp.inspection-limits:archive-depth] The maximum size is also stated for files extracted from archives, which conflicts with the per-entry wording [divergence:zia.dlp.inspection-limits:archive-extracted-cap].

**Past the limit.** What happens to content past a limit is open [gap:zia.dlp.inspection-limits:over-limit-behavior].

**Incident evidence.** DLP incident evidence files are capped at 100 MB, and larger files are replaced with a `.txt` placeholder. The Azure Incident Receiver deployment page also says the policy-violating files can be a maximum of 100 MB. [zia.dlp.inspection-limits:evidence-file-cap] Timeouts on large uploads are open [gap:zia.dlp.inspection-limits:large-upload-timeout].

**Images.** OCR settings are configured for the organization and apply to all DLP policies, and if OCR options are not enabled, DLP rules do not apply to image files. DLP engines support OCR scanning of PNG, JPEG, TIFF and BMP files. [zia.dlp.inspection-limits:ocr-images] The service can use OCR to scan images for sensitive text as part of inline DLP, Data at Rest Scanning DLP and Outbound Email DLP policies, through three options on the DLP Advanced Settings page: Inline DLP (images in data in transit), SaaS Security API (images in data at rest) and Outbound Email DLP (images in outbound emails sent to external domains). [zia.dlp.inspection-limits:ocr-channels] No OCR size or resolution limit is stated [gap:zia.dlp.inspection-limits:ocr-size-limit]. How the per-rule `ocrEnabled` field interacts with these switches is open [Whether the per-rule ocrEnabled field is accepted and how it interacts with enableInlineDlpOcr](kb:zia.dlp.rule-wire-shape:ocr-switch-interaction).

If the file was never decrypted, or an upstream policy blocked it first, see [Why DLP did or did not fire: pipeline position, evaluation mode and exemptions](kb:zia.dlp.evaluation). The rule-side minimum data size and file type criteria are in [Web DLP policy rules: order, criteria and actions](kb:zia.dlp.rules). The Endpoint DLP rule article's figure is [The Endpoint DLP policy rules article says the Zscaler DLP engines support files up to 100 MB, and that the maximum size also applies to files extracted from archive files. The other articles' figures are in zia.dlp.inspection-limits.](kb:zia.dlp.endpoint-rules:file-size-limit), and it is one of the positions in the file size divergence above.

What to check:
1. Which file-size figure applies to the file, and which source states it.
2. Whether the transaction in Web Insights shows a limit as the cause, before concluding that one was.

Inferred, not quoted (say so when an answer rests on one):
- [zia.dlp.inspection-limits:extracted-text-tail-uninspected] Tier B: Derived from the stated 100 MB window; no source describes the tail explicitly.

Sources disagree (name both sides):
- The content-inspection article says the maximum size also applies to files extracted from archives, which reads as 400 MB, while the same article and the engines article give 100 MB for decompressed archive entries. [divergence:zia.dlp.inspection-limits:archive-extracted-cap]
  - zscaler-help: The overall maximum size applies to each file extracted from an archive.
  - zscaler-help: Each decompressed entry is limited to 100 MB.
  - zscaler-help: The Evaluate All Rules article repeats that the overall maximum size applies to files extracted from archives.
  Impact: The per-entry cap for a large archive member is either 400 MB or 100 MB depending on which sentence is read.
- Whole-file DLP scan limit: 400 MB in the engines and content-inspection articles versus 100 MB in the Evaluate All Rules File Type field, the Endpoint DLP rule article and the Outbound Email rule article [divergence:zia.dlp.inspection-limits:file-size-conflict]
  - zscaler-help: The engines support files up to 400 MB.
  - zscaler-help: The engines can scan files of up to 100 MB (File Type field).
  - zscaler-help: The engines article gives 400 MB for Zscaler DLP engines, with no per-product limit.
  - zscaler-help: The Endpoint DLP policy rules article says the Zscaler DLP engines support files up to 100 MB.
  - zscaler-help: The Outbound Email policy rules article says the engines can scan files of up to 100 MB.
  Impact: Whether a 100-400 MB file is content-inspected by a file-type DLP rule, an Endpoint DLP rule or an Outbound Email rule is unclear; the engines article states 400 MB without a per-product limit.

Not known (open gaps):
- The true maximum file size Zscaler DLP engines scan [gap:zia.dlp.inspection-limits:file-size-cap]: settled by lab-test or support-ticket. Blocks: stating a single whole-file cap
- What the service does with content past a DLP limit [gap:zia.dlp.inspection-limits:over-limit-behavior]: settled by lab-test or support-ticket. Blocks: saying that nested or oversized content silently evades DLP, or that it is blocked, or that it is logged
- Whether OCR has an image size or resolution limit [gap:zia.dlp.inspection-limits:ocr-size-limit]: settled by source-read or support-ticket. Blocks: saying a large or low-resolution image is or is not scanned
- Unverified legacy statement: large uploads time out before DLP completes [gap:zia.dlp.inspection-limits:large-upload-timeout]: settled by lab-test or operator-experience. Blocks: advising what to look for in Web Insights for a timed-out scan

Area: zia.dlp, its subjects in references/_meta/spine/zia/zia.dlp.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.dlp.evaluation.md (Why DLP did or did not fire: pipeline position, evaluation mode and exemptions), from zia.dlp: By default inline DLP rules are evaluated in rule order and evaluation stops at the first match. In Evaluate All Rules mode (enabled through the Zscaler account team) the service evaluates all rules and enforces the rule with the most restrictive action; the Evaluate All Rules article says that mode uses rule order only when multiple rules with the same action are matched. [zia.dlp.evaluation:evaluate-all-default-vs-mode]
- decided-by references/_meta/text/zia/zia.dlp.rules.md (Web DLP policy rules: order, criteria and actions), from zia.dlp: DLP policy rules are evaluated in ascending rule order and, by default, evaluation stops at the first match; a disabled rule keeps its place in the order while the service skips it. Evaluate All Rules mode (see zia.dlp.evaluation) changes this. [zia.dlp.rules:ascending-order]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.dlp: For a POST request the Public Service Edge applies policies in a listed order in which Cloud App Control, URL Filtering, Malware Protection and File Type Control all come before Data Loss Prevention. [zia.dlp.evaluation:dlp-after-url-and-file-type]
- depends-on references/_meta/text/zia/zia.dlp.engines.md (DLP engines: the unit a rule references), from zia.dlp: DLP policy rules and Endpoint DLP policy rules must reference engines, not dictionaries. To use a custom dictionary in a rule, put it in an engine first. [zia.dlp.engines:rules-reference-engines]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.dlp: URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both]
- logged-in references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields), from zia.dlp: dlprulename applies only to Allow rules; trig_dlprulename names the DLP rule that triggered the transaction, allowed or blocked; all_dlprulenames combines other_dlprulenames and trig_dlprulename. [zia.logs.web-field-semantics:dlp-rule-fields]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.dlp: Payload-based checks, DLP among them, do not run on traffic that SSL inspection does not decrypt, so an SSL inspection bypass upstream silently removes DLP for that traffic. [zia.dlp.evaluation:decrypt-dependency]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.dlp: For a POST request the Public Service Edge applies policies in a listed order in which Cloud App Control, URL Filtering, Malware Protection and File Type Control all come before Data Loss Prevention. [zia.dlp.evaluation:dlp-after-url-and-file-type]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.dlp: dlprulename applies only to Allow rules; trig_dlprulename names the DLP rule that triggered the transaction, allowed or blocked; all_dlprulenames combines other_dlprulenames and trig_dlprulename. [zia.logs.web-field-semantics:dlp-rule-fields]
- links-to references/_meta/text/zia/zia.dlp.endpoint-rules.md (Endpoint DLP policy rules: channels, criteria, actions (Allow, Block, Confirm, Protect) and notifications)
- links-to references/_meta/text/zia/zia.dlp.rule-wire-shape.md (Web DLP rule API fields, enums and fields the contract does not document)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/dlp-web-rules.md (config type)
