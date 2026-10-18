Size, depth and extracted-text limits bound what DLP scans, and the sources state them inconsistently {{divergence:file-size-conflict}}.

{{whole-file-cap}} Whether that is the true maximum is open {{gap:file-size-cap}}. {{extracted-text-window}} {{extracted-text-tail-uninspected}}

**Archives.** {{archive-entry-cap}} {{archive-depth}} The maximum size is also stated for files extracted from archives, which conflicts with the per-entry wording {{divergence:archive-extracted-cap}}.

**Past the limit.** What happens to content past a limit is open {{gap:over-limit-behavior}}.

**Incident evidence.** {{evidence-file-cap}} Timeouts on large uploads are open {{gap:large-upload-timeout}}.

If the file was never decrypted, or an upstream policy blocked it first, see [[zia.dlp.evaluation]]. The rule-side minimum data size and file type criteria are in [[zia.dlp.rules]].
