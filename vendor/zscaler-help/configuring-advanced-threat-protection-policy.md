# Configuring the Advanced Threat Protection Policy

**Source:** https://help.zscaler.com/zia/configuring-advanced-threat-protection-policy
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Policies 
Advanced Threat Protection 
Configuring the Advanced Threat Protection Policy
Internet & SaaS (ZIA)
Configuring the Advanced Threat Protection Policy
Ask Zscaler

Hackers routinely embed malicious scripts and applications not only on their own websites but on legitimate websites that they have hacked, as well. To ensure your organization's web security, the Zscaler service can identify a variety of these objects and scripts and prevent them from downloading to the end user's browser. Zscaler does this by using a combination of methods to detect various phishing techniques, including signature-based and AI/ML models and offers protection against URL-based phishing techniques, such as typosquatting, punycode, character substitution, domain hijacking, and many more. Zscaler also offers the Advanced Threats Protection policy which protects your traffic from fraud, unauthorized communication, and other malicious objects and scripts.

There might be trusted websites of partners or vendors whose webmail or file downloads might otherwise be blocked due to antivirus, anti-spyware, or anti-malware policies. You can exempt these sites from inspection by adding them to the ATP security exceptions list. The service allows users to download content from these URLs without inspecting the traffic. To learn more, see Adding URLs to the Allowlist.

When you configure the Advanced Threat Protection policy, you can set a Suspicious Content Protection (Page RiskTM) value. The Zscaler service calculates the Page Risk Index score of a web page in real time. This score is then evaluated against the value that you set. Zscaler also has a recommended policy for Advanced Threat Protection.

You can capture and store traffic blocked by this policy as PCAP files. To learn more, see About Traffic Capture Settings.

If you have Advanced Threat Protection as well as IPS Control, any rules you create for Advanced Threat Protection are evaluated first.

The Advanced Threat Protection policy is a global policy, so it applies to all users.
If the Advanced Threat Protection policy is configured to block malicious activity, and a user's traffic matches a blocked activity, Zscaler Client Connector displays a notification that the activity was blocked as potentially harmful. The Zscaler service logs transactions in real time and shows the information on the Security Dashboard (Dashboard > Security) in the ZIA Admin Portal. To access this feature, contact your Zscaler Account team.

To learn how this policy fits into the overall order of policy enforcement, see About Policy Enforcement.

Configuring the Advanced Threat Protection Policy

To configure the Advanced Threat Protection policy:

Go to Policy > Advanced Threat Protection.
On the Advanced Threat Policy tab, configure the following advanced threats. URLs on the allowlist take precedence over all the following options. For example, if a URL on the allowlist is hosted on a web server in a blocked country, the service allows users to download content from that website.
Suspicious Content Protection (Page RiskTM)

Set the slider to the page risk tolerance score of your organization. The Zscaler service blocks users from accessing web pages with a Page Risk Index score higher than the value you set. The Zscaler service analyzes malicious content on a web page (e.g., injected scripts, vulnerable ActiveX, zero-pixel iFrames, etc.) and creates a Page Risk Index. The service also analyzes data from the domain (e.g., hosting country, domain age, past results, links to high-risk, top-level domains, etc.) and creates a Domain Risk Index. The Page Risk and Domain Risk Index are combined to produce a single Page Risk Index score. This score is then evaluated against the value you set. Zscaler recommends setting it to 35.

Low Risk: Allow users to access safe web pages. There is no risk tolerance.
Moderate Risk: Allow users to access slightly suspicious web pages. There is a moderate risk tolerance.
High Risk: Allow users to access very risky web pages. There is a high risk tolerance.

See image.

Close

Close
Botnet Protection

Botnets are systems in which attackers have secretly installed software designed to communicate periodically with a command and control (C2) center, where a master command node instructs the infected computers to send spam, phishing email, or perform other malicious tasks. The inspection feature uses rate-based control to detect and block connections for default profiles for popular security testing tools (e.g., Cobalt Strike, Mythic, Brute Ratel, and Posh C2).

Command & Control Servers: Choose to Allow or Block connections to known C2 servers for profiles such as Cobalt Strike, Mythic, Brute Ratel, and PoshC2. You can view known C2 botnet activity, including triggered policy actions, in the SaaS Security Insights Logs.

See image.

Close

To learn more, see About SaaS Security Insights Logs and About Custom IPS Signature Rules.

Command & Control Traffic: Choose to Allow or Block botnets sending or receiving commands to unknown servers. The Zscaler service examines the content of the requests and responses to unknown servers.
Alert for Unknown/Suspicious C2 Traffic: Enable to allow the service to send alerts for unknown or suspicious C2 traffic that does not match a botnet callback or other blocking malware signature by reclassifying the traffic to the new URL category. This feature is disabled by default. To learn how to create a matching alert subscription for Zscaler admins to investigate detections, see Adding Alert Subscriptions.
Domain Generation Algorithm (DGA) Domains: Choose to Allow or Block domains that are suspected to be generated using domain generation algorithms. These algorithms are used in various malware families to periodically generate a large number of domain names that can be used by malware-infected devices to connect with command and control servers in order to circumvent the identification and shutting down of malicious domains.

The Zscaler service also supports counter-based detection of known C2 profiles (i.e., number of occurrences during a specific period). To access this feature, contact your Zscaler Account team.

Close
Malicious Active Content Protection

The Zscaler service blocks access to websites that attempt to download dangerous content to your browser when you visit them, as well as vulnerable ActiveX controls and web browsers that are known to have been exploited are blocked. Here, you can also manage specific URLs for your organization.

Malicious Content & Sites: Choose to Allow or Block websites that attempt to download dangerous content to your browser when you visit them. Increasingly, this content is downloaded silently without the user's knowledge or awareness. Malicious sites include exploit kits, compromised websites, and malicious advertising.
Vulnerable ActiveX Controls: Choose to Allow or Block ActiveX controls that are known to have been exploited. An ActiveX control is a software program for Internet Explorer, often referred to as an add-on.
Browser Exploits: Choose to Allow or Block known web browser vulnerabilities that can be exploited, including exploits for Internet Explorer and Adobe Flash.
File Format Vulnerabilities: Choose to Allow or Block known file format vulnerabilities and suspicious or malicious content in Microsoft Office or PDF documents.
Blocked Malicious URLs: Enter URLs you want to allowlist or denylist for ATP and click Add Items. You can enter multiple entries. Press Enter after each entry. To add a comment to a URL, enter two forward slashes (//) after each URL entry and separate each entry by pressing Shift+Enter. You can add up to 25K URLs. For guidance on entering URLs, see the URL format guidelines. For item lists, you can view up to 500 items on a page; filter the list by searching for a word, phrase, or number contained in an item; and remove the first 25K items from the list (Remove 25K Items) or only items from a specific page (Remove Page). If you select Remove 25K Items or Remove Page, a confirmation window appears. More specific blocked malicious URLs always take precedence. URL filtering rules aren’t applied to a category with a wildcard if the destination is defined more specifically in another category. For example, if the first rule CUSTOM_C1 contains .example.com and the second rule CUSTOM_C2 contains www.example.com, when accessing www.example.com, the CUSTOM_C1 policy isn’t applied because CUSTOM_C2 is more specific (even though CUSTOM_C1 is higher in the rule order).
Close
Fraud Protection

Phishing sites are websites that mimic legitimate banking and financial sites (e.g., Citibank.com, PayPal.com, etc.). Their purpose is to fool you into thinking you can safely submit your bank account, password, and other personal information which criminals can use to steal your money.

Known Phishing Sites: Choose to Allow or Block websites known to be phishing sites.
Suspected Phishing Sites: Choose to Allow or Block suspected phishing sites. The Zscaler service can inspect the content of a website for indications that it might be a phishing site.
Spyware Callback: Choose to Allow or Block spyware callbacks. Spyware sites gather users' information without notification and sell this information to advertisers or criminals. When Spyware Callback is blocked, the Zscaler service prevents the spyware from calling back home.
Web Spam: Choose to Allow or Block web pages that pretend to contain useful information, to get higher ranking in search engine results or drive traffic to phishing, adware, or spyware distribution sites.
Crypto Mining: Choose to Allow or Block cryptocurrency mining network traffic and scripts. Most organizations prefer to block crypto mining traffic indicative of cryptojacking, malicious scripts, or programs that secretly use the device to mine cryptocurrency. For example, JavaScript in a compromised website, banner, or ad can use the browser to mine cryptocurrency and harm the user's device. However, in some cases, blocking this traffic might cause certain sites that use crypto mining as a source of income to stop working. It might also interfere with legitimate attempts to use cryptocurrency for payments.

Security exceptions can be used to exempt and allowlist specific cryptomining destinations. However, sites on the allowlist are exempted from any form of security scanning. Therefore, Zscaler recommends keeping the number of trusted sites on the allowlist to a minimum.

Known Adware & Spyware Sites: Choose to Allow or Block websites known to contain adware or spyware. Adware displays malicious advertisements that can collect users' information without their knowledge.
Close
Unauthorized Communication Protection

Unauthorized communications refer to IRC tunneling applications, and "anonymizer" sites that are used to bypass firewalls and proxies.

IRC Tunneling: Choose to Allow or Block IRC traffic being tunneled over HTTP/S.
SSH Tunneling: Choose to Allow or Block This refers to SSH traffic being tunneled over HTTP/S.
Anonymizers: Choose to Allow or Block applications and methods used to obscure the destination and the content accessed by the user. The use of anonymizers might enable users to bypass policies that control access to websites and internet resources.
WPAD Protocol: Choose to Allow or Block the use of the Web Proxy Auto-Discovery (WPAD) protocol from external sources to automatically discover proxy settings by locating a PAC file via DHCP or DNS queries.
Close
Cross-Site Scripting (XSS) Protection

Cross-Site Scripting (XSS) attacks are a type of injection in which malicious scripts are injected into otherwise benign and trusted websites. XSS includes the following:

Cookie Stealing: Choose to Allow or Block third party websites that gather cookie information, which can be used to personally identify users, track internet activity, or steal a user's session or sensitive information. These detections are often IPS signature-based detections, so they are high fidelity.
Potentially Malicious Requests: These are a type of cross-site scripting request. Select Block to block cross-site scripting.
Close
Suspicious Destinations Protection

Blocked Countries: Choose to Allow or Block requests to any country in the world based on ISO3166 mapping of countries to their IP address space. Websites are blocked based on the location of the web server.

Close
P2P File Sharing Protection

P2P File Sharing refers to internet resources that allow users to easily share files with each other. The danger is that users might illegally share copyrighted or protected content. The file-sharing applications listed are some of the more common ones in use today.

BitTorrent: Choose to Allow or Block the usage of BitTorrent, a popular P2P file sharing application. Content downloaded with BitTorrent is encrypted, therefore it cannot be inspected.

Close
P2P Anonymizer Protection

P2P Anonymizer refers to applications and methods used to obscure the destination and content accessed by the user. Use of anonymizers might enable users to bypass policies controlling what websites they might visit or internet resources they might access.

Tor: Choose to Allow or Block the usage of Tor, a popular P2P anonymizer protocol. Content downloaded with Tor is encrypted, therefore it cannot be inspected.

To fully block Tor usage, you must set the Tor toggle to Block and then create a firewall filtering rule that blocks Tor as a network application. The ability to block network applications requires Advanced Firewall. To learn more, see Configuring the Firewall Filtering Policy and Understanding Firewall Capabilities.

Close
P2P VoIP Protection

P2P VoIP lists several popular Voice over Internet Protocol (VoIP) applications. While VoIP can be encouraged for its telephone cost savings, it can also be discouraged because of the high bandwidth usage associated with it.

Google Hangouts has been deprecated by Google and replaced by Google Chat. To locate controls for Google Chat and other cloud applications, go to URL & Cloud App Control > Cloud App Control Policy and select Edit Instant Messaging Rule. To learn more, see Adding an Instant Messaging Rule for Cloud App Control.

Close

If Traffic Capture is enabled, the Capture option appears when Block is selected. To capture web and non-web threat category traffic with the Allow and Block actions, see Configuring IPS Control Policy. Captured traffic is stored in PCAP files for later analysis. To enable Traffic Capture for this policy, see Configuring Traffic Capture Settings.

Click Save and activate the change.

The AI/ML tools detect C2 botnets, credential theft, and phishing URLs by analyzing the URLs that are not categorized and those in the Miscellaneous or Unknown category. The tools then categorize the URLs under Botnet Protection or Fraud Protection (Phishing) advanced threats or the Miscellaneous or Unknown URL category.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Configuring the Advanced Threat Protection Policy
Configuring Security Exceptions for the Advanced Threat Protection Policy
Adding URLs to the ATP URL Allowlist or Denylist
Understanding User Risk Score
Recommended Advanced Threat Protection Policy
