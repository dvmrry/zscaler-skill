# About Hosted PAC Files

**Source:** https://help.zscaler.com/zia/about-hosted-pac-files
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399456, revision 3239905

---

The Zscaler service hosts 4 default PAC files: recommended.pac, proxy.pac, mobile_proxy.pac, and kerberos.pac. These files are all configured to automatically forward all browser traffic to the nearest Public Service Edge for Internet & SaaS (ZIA). The default PAC files are non-editable, but you can copy them to create and build your custom PAC files. Your organization can use more than one PAC file. For example, you can use one PAC file for mobile devices and another for all other devices. Zscaler recommends using the Kerberos PAC file if you are deploying Kerberos authentication.
To forward web traffic to the Zscaler service, you can use a default PAC file or a custom PAC file. PAC servers support both HTTP and HTTPS. To use a PAC file with HTTPS, change the PAC file URL string from http to https. HTTPS is recommended for additional security.
Hosted PAC files provide the following benefits and enable you to:
- Configure custom PAC files to forward your organization's traffic to the desired Public Service Edge.
- Configure and host up to 10 versions of your PAC files in the Zscaler cloud to ensure the availability of the PAC file with assured uptime.
- Leverage the Zscaler-specific PAC variables to design optimal custom PAC files.
On the Hosted PAC Files page (Infrastructure > Internet & SaaS > Hosted PAC Files), you can do the following:
- Add a custom PAC file.
- You can host up to 10 versions of your custom PAC files in the Zscaler Admin Console.
- Search for a PAC file.
- View a list of default and custom PAC files if you've configured any. For each PAC file, you can view the following information:
  - **Name**: The name of the PAC file.
  - **Description**: Additional notes or information about the PAC file.
  - **Domain**: The Zscaler domain in which the PAC file is hosted.
  - **Hosted URL**: The hosted URL of the PAC file.
  - **Status**: Indicates the verification status of the PAC file. The verification status can be:
    - **Verified**: Indicates that the PAC file is verified in the Zscaler Admin Console.
    - **Error-Accepted**: Indicates that the PAC file has some errors and the admin has accepted and saved it with errors at the time of verification in the Zscaler Admin Console.
  - **Number of Hits**: The number of times the PAC file is hit in the last 30 days.
  - **Currently Deployed Version**: The version number of the currently deployed PAC file.
- Preview a PAC file.
- Export a PAC file as a text, PAC, or JS file.
- Manage versions of a custom PAC file.
- Delete a custom PAC file.
