# Configuring the FTP Control Policy

**Source:** https://help.zscaler.com/zia/configuring-ftp-control-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400596, revision 3240462

---

Watch a video about FTP Control Policy.
You can configure the FTP Control policy to allow access to specific sites. With Malware Protection, you can also scan FTP over HTTP traffic and FTP traffic in real time.
# Configuring the FTP Control Policy
To configure the FTP Control policy:
- 1. Allow or block FTP over HTTP traffic and native FTP traffic.
- From the FTP Control page, you can allow or block FTP over HTTP traffic. You can also allow or block native FTP traffic by URL categories or specified URLs.
- To configure the FTP Control policy:
  - From the navigation menu, go to Internet Access > Policy > FTP Control.
  - Click Edit.
  - The Edit page appears.
  - On the Edit page:
    - Under FTP over HTTP Traffic:
    - Allow FTP over HTTP: By default, the Zscaler service doesn't allow users from a location to upload or download files from FTP sites that use FTP over HTTP. Enable this option to allow browsers to connect to FTP over HTTP sites and download files. If a remote user uses a dedicated port, then the service supports FTP over HTTP for them.
    - Under Native FTP Traffic:
    - Allow Native FTP: Enable this option to allow users to connect to native FTP sites and download files.
    - If you enable this setting, the following additional options appear:
      - Allow Any URL Category: Enable this option to allow FTP traffic for all URL categories. The policy applies to traffic from the known locations of an organization.
      - When you disable this option, you can configure the FTP Control policy to allow access to specific sites by configuring the following additional options:
        - Allowed URL Categories: You can select URL super categories, URL categories, or both. You can select any number of categories. You can also search for categories or add a custom category by clicking the Add icon.
        - Allowed URLs: Enter the URLs for which native FTP traffic will be allowed. You can add up to 25,000 URLs. For guidance on entering URLs, see the URL format guidelines. For item lists, you can view up to 500 items on a page; filter the list by searching for a word, phrase, or number contained in an item; and remove the first 25,000 items from the list (Remove 25K Items) or only items from a specific page (Remove Page). If you select Remove 25K Items or Remove Page, a confirmation window appears.
        - This feature is successful when the FTP proxy can retrieve the URLs. If you are using transparent traffic forwarding, enter an IP address instead of a URL. Alternatively, Zscaler recommends implementing one of the following workarounds:
          - FQDN-based Firewall rule set to allow traffic
          - Forward proxy mode
          - FTP traffic over HTTP CONNECT
  - See image.
  - Click Save and activate the change.
- 2. Enable or disable scanning for FTP traffic.
- From the Malware Protection page, you can enable or disable scanning for FTP over HTTP traffic and native FTP traffic.
- To inspect FTP over HTTP traffic and native FTP traffic:
  - Go to Cyberthreat Protection > Policy > Malware Protection.
  - In the Protocol Inspection section, enable the following toggles to scan FTP traffic:
    - Inspect FTP over HTTP: Enable to scan FTP over HTTP traffic in real time. The Traffic Inspection setting determines whether inbound, outbound, or both types of traffic is scanned. It scans all files, including those with up to 5 layers of recursive compression.
    - Inspect FTP: Enable to scan FTP traffic in real time. The Traffic Inspection setting determines whether inbound, outbound, or both types of traffic is scanned. It scans all files, including those with up to 5 layers of recursive compression.
  - See image.
  - Click Save and activate the change.
- You can also apply Data Loss Prevention (DLP), Sandbox, and File Type Control policies to files extracted from the preceding protocols.
