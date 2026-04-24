# About Hosted PAC Files

**Source:** https://help.zscaler.com/zia/about-hosted-pac-files
**Captured:** 2026-04-24 via Playwright MCP.

---

The Zscaler service hosts 4 default PAC files: **recommended.pac**, **proxy.pac**, **mobile_proxy.pac**, and **kerberos.pac**. These files are all configured to automatically forward all browser traffic to the nearest ZIA Public Service Edge. The default PAC files are non-editable, but you can copy them to create and build your custom PAC files. Your organization can use more than one PAC file. For example, you can use one PAC file for mobile devices and another for all other devices. Zscaler recommends using the Kerberos PAC file if you are deploying Kerberos authentication.

To forward web traffic to the Zscaler service, you can use a default PAC file or a custom PAC file. PAC servers support both HTTP and HTTPS. To use a PAC file with HTTPS, change the PAC file URL string from `http` to `https`. HTTPS is recommended for additional security.

Hosted PAC files enable you to:

- Configure custom PAC files to forward your organization's traffic to the desired ZIA Public Service Edge.
- Configure and host **up to 10 versions** of your PAC files in the Zscaler cloud to ensure availability with assured uptime.
- Leverage the Zscaler-specific PAC variables to design optimal custom PAC files.

## Hosted PAC Files Page (Administration > Hosted PAC Files)

On this page you can:

- Add a custom PAC file.
- Host up to 10 versions of a custom PAC file in the ZIA Admin Portal.
- Search for a PAC file.
- View a list of default and custom PAC files. For each PAC file:
  - **Name** — name of the PAC file.
  - **Description** — additional notes or information.
  - **Domain** — the Zscaler domain in which the PAC file is hosted.
  - **Hosted URL** — the hosted URL of the PAC file.
  - **Status** — verification status. Values:
    - **Verified** — PAC file is verified on the ZIA Admin Portal.
    - **Error-Accepted** — PAC file has errors and the admin has accepted and saved it with errors at verification time.
  - **Number of Hits** — number of times the PAC file is hit in the last 30 days.
  - **Currently Deployed Version** — version number of the currently deployed PAC file.
- Preview a PAC file.
- Export a PAC file as text, `.pac`, or `.js`.
- Manage versions of a custom PAC file.
- Delete a custom PAC file.
