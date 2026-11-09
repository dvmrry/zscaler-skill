# Transferring and viewing files in isolation: file types, size limit, Protected Storage and printing (zbi.file-handling)
Also called: Protected Storage; isolation file types; isolation file size limit; view files in isolation; isolation printing disabled

Files rendered in isolation are converted into a PDF in the isolation browser rather than rendered in their original format, and Protected Storage holds certain files temporarily for the duration of the isolation session. [zbi.file-handling:pdf-conversion-protected-storage] To access files from isolation via an Internet & SaaS isolation profile an exception rule for URL filtering must be configured, and the profile Security controls must allow file download, upload or viewing. [zbi.file-handling:zia-url-filtering-exception]

**File types.** Files of these types can be uploaded, downloaded and opened to render and view in isolation: video .mp4, .ogg, .webm, .wav; audio .mp3, .wav, .ogg; documents .pdf, .txt, .doc, .docx, .xls, .xlsx, .xlsm, .pptx, .ppt; images .jpg, .png, .gif, .bmp, .svg, .ico, .webp, .apng; compressed .zip, .tar, .7z, .rar; other .json, .xml, .html, .csv, .rtf. [zbi.file-handling:viewable-file-types] The .odt, .ods, .odp and .vsdx types can be uploaded and downloaded but not opened for rendering in isolation; video .avi, .mov, .wmv, .avif, .m4v, .m4a, .mkv, .ogv, .oga and image .tiff, .mng, .cur cannot be rendered or viewed but can still be downloaded or uploaded directly. [zbi.file-handling:non-viewable-file-types]

**Limits and prompts.** The file size limit for uploading and downloading in an isolated session is 1 GB per file; isolation sets no minimum or maximum number of files transferred at once, multiple files can be uploaded simultaneously and downloads are individual. [zbi.file-handling:size-limit-and-counts] A user opening an Office file or password-protected file is prompted for the file-specific password, and the file is then rendered in the isolation browser for the duration of the session. [zbi.file-handling:password-protected-prompt]

**Printing.** When printing is disabled on an isolation profile the user cannot see the print option in the right-click menu or the Print icon in the Zero Trust Mode menu, and File > Print or Ctrl/Cmd+P shows a message that this is disabled by policy. [zbi.file-handling:printing-disabled]

**Browsers.** The article says available file types can be viewed in isolation in both Google Chrome and Mozilla Firefox browsers. [zbi.file-handling:chrome-firefox-viewing]

**Mobile.** On some mobile devices file types such as PDFs require the user to allow pop-ups. [zbi.file-handling:mobile-popups-and-browsers]

Sandbox and Votiro handling of transferred files is in [Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings](kb:zbi.file-scanning). A page that lists these limits outside this area is open [gap:zbi.file-handling:ranges-limits-page].

What to check:
1. Whether the file type is one that can be opened in isolation or only downloaded and uploaded, and whether it is under 1 GB.
2. Whether an exception rule for URL filtering exists and the profile Security controls allow the transfer.

Not known (open gaps):
- Whether the Ranges & Limitations page states other values for file size, sessions or mobile [gap:zbi.file-handling:ranges-limits-page]: settled by source-read. Blocks: confirming the limits against the page that lists them

Area: zbi.file-handling, its subjects in references/_meta/spine/zbi/zbi.file-handling.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zbi/zbi.file-scanning.md (Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings)
