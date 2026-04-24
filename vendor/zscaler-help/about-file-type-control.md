# About File Type Control

**Source:** https://help.zscaler.com/zia/about-file-type-control + https://help.zscaler.com/zia/configuring-file-type-control-policy
**Captured:** 2026-04-24 via Playwright MCP (consolidated summary from two related articles).

---

File Type Control restricts uploads and downloads of specified file types to prevent bandwidth waste and control data transfer. **By default, Zscaler allows all file types.**

## Matching criteria

- **By extension** — e.g., `.mp3`, `.wav` (audio); `.avi`, `.mp4`, `.mpeg` (video).
- **By MIME type** — Zscaler performs MIME type checking on initially unidentifiable files. Files falling outside well-defined MIME types for common apps are tagged as **"unknown file type"**.
- **Archive content inspection** — Zscaler scans ZIP, 7-Zip, GZIP, TAR, and RAR files to recognize file types within archives.
- **Active content** (newer feature) — rules can target files with active content in Microsoft Office and PDF formats.
- **Unscannable files** — policies can handle files the service cannot scan.

## Operations and actions

- Rules apply to **upload**, **download**, or **both** operations.
- Three action types:
  - **ALLOW**
  - **CAUTION** — shows warning before execution.
  - **BLOCK** — displays notification.
- **File size limit for scanning: 400 MB.**

## Protocols

File Type Control rules apply to **HTTP, HTTPS, and FTP** protocols (confirmed via Terraform/SDK: `HTTP_RULE`, `HTTPS_RULE`, `FTP_RULE`).

## Where it sits

Web-module policy — Policies > File Type Control. Rules evaluate files regardless of whether they're transferred via HTTP, HTTPS, or FTP.

## Recommended policy

Zscaler provides a predefined recommended policy that blocks common bandwidth-consuming file types by default.

---

## Enhanced File Type Control (newer innovation)

**Active Content Control** — apply rules to files containing active content. Supports Microsoft Office and PDF file formats, enabling granular oversight of potentially risky embedded elements.

**Unscannable Files Management** — configure policies for files that Zscaler's service cannot scan, ensuring comprehensive protection when standard scanning methods fail.
