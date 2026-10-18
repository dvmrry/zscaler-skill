Three separate things decide whether a DLP rule gets a say, in this order: whether DLP is reached, which evaluation mode the tenant uses, and what is exempted.

**Is DLP reached?** {{dlp-after-url-and-file-type}} {{earlier-block-skips-dlp}} Earlier policies are in [[zia.url-filtering]] and [[zia.cloud-app-control.precedence]]. {{decrypt-dependency}} {{scope-bounded-by-decryption}} The decrypt side is in [[zia.ssl-inspection.pipeline]]. Whether this is the most common cause is open {{gap:ssl-bypass-most-common-cause}}.

**Which mode?** {{evaluate-all-default-vs-mode}} {{evaluate-all-switch}} The API shape of sub-rules is in [[zia.dlp.rule-wire-shape]]. {{exception-rules}}

**What is exempt?** {{exemption-list}}

Size, archive and text limits that stop inspection of a file that was reached are in [[zia.dlp.inspection-limits]]; timeouts on large uploads are open [[zia.dlp.inspection-limits:large-upload-timeout]]. Rule criteria are in [[zia.dlp.rules]].
