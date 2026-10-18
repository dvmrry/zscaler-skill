"Why didn't DLP catch this file?" often lands on a size or depth limit. The limits are stated, but not consistently, so state which figure is in play and which source it comes from.

{{whole-file-cap}} The captured articles give 400 MB as the file limit, but no source tests the whole-file cap (gap `file-size-cap`), so say 400 MB is the documented figure rather than a verified one. {{extracted-text-window}} {{extracted-text-tail-uninspected}}

Archives add two more limits. {{archive-entry-cap}} {{archive-depth}} The content-inspection article also says the maximum size applies to files extracted from archives, which conflicts with the per-entry wording (the divergence `archive-extracted-cap`).

No captured source says whether content past a limit is allowed, blocked or logged, so an answer that an attacker "silently evades DLP" by nesting archives is an inference, not documented behavior. Check the transaction in Web Insights before concluding a limit was the cause.

Incident evidence has its own cap. {{evidence-file-cap}} A forensics workflow that expects the original document for a large violation gets the placeholder.

If the file was never decrypted, or an upstream policy blocked it first, the size limits are irrelevant: see [[zia.dlp.evaluation]]. The rule-side minimum data size and file type criteria are in [[zia.dlp.rules]].
