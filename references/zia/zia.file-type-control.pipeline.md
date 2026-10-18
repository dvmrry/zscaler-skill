**Does the traffic reach it?** File Type Control needs decrypted HTTPS, like DLP and Sandbox; see [[zia.ssl-inspection.bypass-impact:dependent-features]]. For FTP, File Type Control applies to the extracted files: [[zia.ftp-control.scope:dlp-sandbox-ftc-on-extracted]].

**Where is it in the order?** {{post-and-response-position}} The DLP side, including the example of a File Type Control block that keeps DLP from firing, is in [[zia.dlp.evaluation:earlier-block-skips-dlp]].

**Is the file too large?** {{rule-count-limit}} {{scan-limit-400mb}} {{limit-equals-size-field-max}} What the service does with files above the limit is open {{gap:over-limit-handling}}. Sandbox's own size handling is in [[zia.sandbox.coverage]]. Where archive extraction happens relative to DLP is open {{gap:archive-extraction-and-dlp-handoff}}.
