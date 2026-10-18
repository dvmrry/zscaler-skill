Three separate things decide whether a DLP rule gets a say, in this order: whether DLP is reached, which evaluation mode the tenant uses, and what is exempted.

**Is DLP reached?** {{dlp-after-url-and-file-type}} {{earlier-block-skips-dlp}} So "DLP didn't catch it" can mean something upstream blocked the request first; check [[zia.url-filtering]] and [[zia.cloud-app-control.precedence]] before the DLP rule. {{decrypt-dependency}} {{scope-bounded-by-decryption}} The decrypt side is in [[zia.ssl-inspection.pipeline]]. Whether this is the most common cause is not established by any source (see the gap `ssl-bypass-most-common-cause`).

**Which mode?** {{evaluate-all-default-vs-mode}} Every answer about "which rule won" branches on this. {{evaluate-all-switch}} Read the tenant's `webDlpGlobalOptions` before assuming first match. Rules written for one mode need re-checking when the other is enabled. {{exception-rules}} The API shape of sub-rules is in [[zia.dlp.rule-wire-shape]].

**What is exempt?** {{exemption-list}}

Size, archive and text limits that stop inspection of a file that was reached are in [[zia.dlp.inspection-limits]]; timeouts on large uploads are an open question (`large-upload-timeout` in that subject). Rule criteria are in [[zia.dlp.rules]].
