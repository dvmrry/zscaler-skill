# Understanding FTP Control

**Source:** https://help.zscaler.com/zia/about-ftp-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398756, revision 3233308

---

Watch a video about FTP Control Policy.
By default, the Zscaler service doesn't allow users from a location to upload or download files from FTP sites that use FTP over HTTP. Only native FTP traffic is allowed. With FTP Control, Zscaler provides access control for native FTP and FTP over HTTP traffic. This can be particularly useful if you are using a Zscaler Client Connector or PAC-based deployment, as they only support FTP over HTTP traffic. FTP Control also extracts files and runs a security scan.
There are multiple levels of FTP Control:
- You can configure the FTP Control policy to allow access to specific FTP sites.
- If you have Malware Protection, you can scan FTP over HTTP traffic and native FTP traffic in real time. To learn more, see Configuring the FTP Control Policy.
- If you have Data Loss Prevention (DLP), Sandbox, File Type Control, URL Filtering, and Bandwidth Control, you can configure those policies based on protocols (e.g., FTP over HTTP and native FTP).
- Complete FTP logging in Firewall Insights.
Using FTP Control, you can manage your organization's FTP traffic by monitoring users' access to FTP servers using FTP (only passive FTP), FTPS, and FTP over HTTPS protocol. You can inspect your users' FTP traffic, including passive FTP, FTPS, and FTP over HTTPS traffic, and protect the traffic against malicious software using the Malware Protection policy.
The FTP Control policy applies to traffic from the known locations of an organization. However, if a remote user uses a dedicated port, then the service supports FTP over HTTP for them. When they use a dedicated port, if their browser connects to FTP sites and downloads files, the service is able to scan the content for viruses and spyware.
URL Filtering policy rules take precedence over the FTP Control policy. For example, if you have a URL Filtering Policy rule that blocks access to gambling sites, the Zscaler service blocks users who try to transfer files from ftp://ftp.site.com. Also, user-, department-, or group-level URL filtering rules blocking access to specific sites are not enforced for FTP sites because FTP does not support cookies. Only rules applied to all users are enforced. For example, if you have a catch-all URL filtering rule that blocks access to gambling sites, users trying to FTP to ftp://ftp.site.com would be blocked. To learn how the FTP policy fits into the overall order of policy enforcement, see Understanding Policy Enforcement.
The service supports only passive FTP. If the destination server does not support passive FTP, the service generates an alert message to this effect in the end user's browser. The service also supports FTPS (FTP over TLS) in passive mode. You can either set up implicit or explicit FTPS. To use explicit FTPS, set a proxy in the FTP client.
To learn how to configure FTP Control settings, see Configuring the FTP Control Policy.
