Three questions decide whether File Type Control sees a file and how it interacts with its neighbors.

**Does the traffic reach it?** File Type Control needs decrypted HTTPS, like DLP and Sandbox: the list of features that stop working when HTTPS bypasses decryption includes it, and is held in [[zia.ssl-inspection.bypass-impact]] (`dependent-features`). For FTP, File Type Control applies to the extracted files: [[zia.ftp-control.scope]] (`dlp-sandbox-ftc-on-extracted`).

**Where is it in the order?** {{post-and-response-position}} DLP's side of this, including the vendor's example of a File Type Control block that keeps DLP from ever firing, is in [[zia.dlp.evaluation]] (`dlp-after-url-and-file-type`, `earlier-block-skips-dlp`). Practical consequence: a File Type Control block means no DLP incident for that file; if you need DLP visibility, check whether the File Type Control rule is a block before reasoning about DLP.

**Is the file too large?** {{rule-count-limit}} {{scan-limit-400mb}} {{limit-equals-size-field-max}} What the service does with files above the limit is not documented: see gap `over-limit-handling`; Sandbox's own size handling is in [[zia.sandbox.coverage]]. Where archive extraction happens relative to DLP is also open: see gap `archive-extraction-and-dlp-handoff`.
