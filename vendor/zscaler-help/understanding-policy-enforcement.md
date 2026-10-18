# Understanding Policy Enforcement

**Source:** https://help.zscaler.com/zia/understanding-policy-enforcement
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399856, revision 3243727

---

Zscaler uses full-featured inline proxies called Public Service Edges for Internet & SaaS (ZIA), which feature Single Scan Multi-Action (SSMA) technology, to inspect and enforce policies on traffic leaving and coming into your organization. SSMA technology handles the traffic inspection. The policy enforcement takes place in the Public Service Edge's web and Firewall modules.
SSMA allows inspection engines to scan all content in a single pass. Packets are placed in shared memory in highly optimized custom servers that can be accessed by all CPUs on a Public Service Edge at the same time. By having dedicated CPUs for each function, all engines can inspect the same packets at the same time. This approach is starkly different from the chained model of physical or virtual appliances, whereby each security service independently processes packets, adding incremental latency at each hop. Due to SSMA technology, the Zscaler service applies policies based on a variety of security engines with minimal latency. After the SSMA inspection process is complete, the Public Service Edge executes policies with specific precedence.
Each Public Service Edge has two main modules for applying policies: a web module and a Firewall module. The following section shows how traffic flows through the modules:
- **Outbound web traffic**: When the Public Service Edge receives outbound web traffic from your organization to the internet, it sends the traffic to its Firewall module for policy evaluation. If the traffic violates a Firewall policy, it blocks the transaction. If the traffic does not violate any Firewall policies, it sends the traffic to the web module for policy evaluation. In the web module, if the traffic violates a Web policy, it blocks the transaction. If the traffic does not violate any Web policies, it allows the traffic to the internet.
- **Outbound non-web traffic**: When the Public Service Edge receives outbound non-web traffic going to ports other than 80/443 (or other HTTP or HTTPS ports), it sends the traffic directly to the Firewall module for policy evaluation. If the traffic violates a Firewall policy, it blocks the transaction. If the traffic does not violate any Firewall policies, it allows the traffic to the internet.
- **Inbound web traffic**: When the Public Service Edge receives inbound web traffic (HTTP or HTTPS traffic for ports 80/443) from the internet in response to HTTP GET or POST requests, it sends the traffic to its web module for policy evaluation. If the traffic violates a Web policy, it blocks the transaction. If the traffic does not violate any Web policies, it allows the traffic into your organization.
When the web traffic violates a Firewall policy, both the Firewall and the Web Insights Logs indicate that the traffic is blocked. However, if the traffic passes the Firewall policy but violates a Web policy, the Firewall Insights Logs indicate that the traffic is allowed, whereas the Web Insights Logs indicate it as blocked.
# Policy Enforcement for Web Traffic
All web traffic is first evaluated in the Firewall module and only if it passes the Firewall module (i.e., if it didn't violate any Firewall policies), it's forwarded to the web module where the traffic is evaluated against the Web policies.
- Policy Enforcement in the Firewall Module
- The following conditions must be true for the policy enforcement for web traffic in the Firewall module. If these conditions are met, the Firewall module enforces policies on web traffic:
  - The traffic is outbound, going from the user to the web.
  - The organization has enabled a Firewall policy for the location.
- If your organization's Web policy allows a transaction but has a conflicting Firewall policy that blocks it, the service applies the Firewall policy. For example, if the web Cloud App Control policy allows the application Box.com, but the Firewall policy blocks it, the service blocks the transaction.
- For remote users using explicit forwarding traffic, Zscaler evaluates both the inner and outer tuples. To learn more, see Firewall HTTP Tunnel Connectivity.
- Policy Enforcement in the Web Module
- If the user's HTTP or HTTPS transaction is not blocked by the Firewall module, the Public Service Edge sends the traffic to the web module for policy enforcement.
- When the Public Service Edge receives web traffic (HTTP or HTTPS traffic on port 80/443), the web module first inspects the traffic and applies your organization's Web policies. The web module has a specific order in which it applies policies for different types of web traffic. As it inspects the traffic, when the service finds a policy violation, it immediately blocks the transaction and does not apply any of the pending Web policies.
- The Public Service Edge applies policies to your traffic depending upon the type of web traffic received, if the traffic is encrypted, and whether you have SSL/TLS Inspection enabled or not.
- To learn more about the order of policy enforcement by the type of web traffic, see the following sections:
  - HTTP Traffic Policies and Order of Enforcement
  - The policies enforced depend on whether the transaction is an HTTP GET request, HTTP POST request, or an HTTP GET or POST response. In each case, when the web module determines that a transaction violates a specific policy, the Public Service Edge immediately blocks that transaction and does not continue enforcing the policies that follow. The Public Service Edge also does not send the traffic to the Firewall module for policy evaluation. However, your Firewall logs show that the user's web transaction is blocked.
    - HTTP GET Request
    - This is a user request to retrieve a resource from the web (e.g., a web page). The Public Service Edge scans the GET request and applies policies in the following order:
      - **Custom Malicious URLs (Advanced Threat Protection)**: The Public Service Edge checks if the requested URL has malicious content using our extensive URL database that is updated daily with feeds from various partners (i.e., The Public Service Edge checks if the URL exists on the organization's custom Advanced Threat Protection denylist).
      - **Cloud App Control**: The Public Service Edge checks if the requested application violates the Cloud App Control policy configured by your organization.
      - By default, if a user requests a cloud app that you explicitly allow with the Cloud App Control policy, the service only applies the Cloud App Control policy and not the URL Filtering policy. The service then proceeds to evaluate Browser Control. For example, if you have a Cloud App Control policy rule that allows viewing Facebook, but a URL Filtering policy rule that blocks www.facebook.com, a user is still allowed to view Facebook. This is because, by default, the service does not apply the URL Filtering policy if a Cloud App Control policy rule allows the transaction.
      - However, this behavior changes if you enable **Allow** **Cascading to URL Filtering** in Advanced Settings. If you do, the service applies the URL Filtering policy even if it applies a Cloud App Control policy rule allowing the transaction. Therefore, in the preceding example, with cascading enabled, the service applies the URL Filtering policy and blocks the user from Facebook. However, if the example changed so that you had a Cloud Control Policy rule that blocked Facebook, while URL Filtering allowed it, Facebook would be blocked even if **Allow Cascading to URL Filtering** is enabled.
      - If a user requests a cloud app for which you have not configured a Cloud App Control policy rule (for example, the user requests eBay.com, and you don't have a Cloud App Control rule for eBay.com), the service still evaluates and applies the URL filtering policy.
      - **URL Filtering**: The Public Service Edge checks if the requested URL belongs to URL categories or custom URL categories blocked by your organization's URL Filtering policy. If the user's requested URL is for a cloud app that is explicitly allowed by a Cloud App Control rule, the service skips this policy and moves to the next one. The only exception is if your organization has enabled **Cascading to URL Filtering** in Advanced Settings.
      - When enforcing URL Filtering policy rules containing a wildcard, the Public Service Edge always looks for a specific match first. For example, let's consider that you have configured Custom Category 1 containing the wildcard entry .example.com, Custom Category 2 containing abc.example.com, and a URL Filtering policy rule that states, "for Location X, block everything in Custom Category 1".
      - In this case, if a user tries to access abc.example.com from Location X, they aren't blocked because that exact domain name is in Custom Category 2, which is not blocked.
      - **Security Exceptions**: If exceptions are configured for your organization, the Public Service Edge checks if the requested URL is included in your organization's allowlist. The URLs are configured in the Security Exceptions tab of the Malware Protection or Advanced Threat Protection policies. If the URL is included under Security Exceptions, the Public Service Edge skips over the Malware Protection, Advanced Threat Protection, and Sandbox policies listed.
      - **Browser Control**: The Public Service Edge checks if a user's browser, or the plug-ins and applications within a user's browser, violates your organization's Browser Control policy.
      - **Country-Based Blocking (Advanced Threat Protection)**: The Public Service Edge checks if the request is being sent to a server in a country you've blocked as a suspicious destination under your Advanced Threat Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **IPS Signature Detection (Advanced Threat Protection)**: The Public Service Edge checks the request using signature-based detection and provides protection against botnets, XSS, phishing, malicious active content, and other advanced threats. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **Suspicious Content Protection (Advanced Threat Protection)**: The Public Service Edge calculates the Suspicious Content Protection (Page RiskTM) value and blocks the page if the value exceeds the value set in the Advanced Threat Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **P2P Control (Advanced Threat Protection)**: The Public Service Edge checks if the requested application is a prohibited P2P file sharing, anonymizer, or VoIP application. This check falls under the Advanced Threat Protection policy.
      - **Bandwidth Control**: The Public Service Edge checks if the request is allowed full or reduced bandwidth based on your organization's Bandwidth Control policy and the current bandwidth usage at the user's location.
    - HTTP POST Request
    - This is a user request to submit or post data to the web (for example, emails sent through webmail or posts on social networking sites). The Public Service Edge scans the POST request and applies policies in the following order:
      - **Custom Malicious URLs**: The Public Service Edge checks if the requested URL exists on the organization's custom Advanced Threat Protection denylist.
      - **Cloud App Control**: The Public Service Edge checks if the requested application violates the Cloud App Control policy configured by your organization.
      - **URL Filtering**: The Public Service Edge checks if the requested URL belongs to URL categories or custom URL categories blocked by your organization's URL Filtering policy.
      - **Security Exceptions**: If exceptions are configured for your organization, the Public Service Edge checks if the requested URL is included in your organization's allowlist. These are configured in the Security Exceptions tab of the Malware Protection or Advanced Threat Protection policies. If the URL is included under Security Exceptions, the Public Service Edge skips over the Malware Protection, Advanced Threat Protection, and Sandbox policies listed.
      - **Browser Control**: The Public Service Edge checks if a user's browser, or the plug-ins and applications within a user's browser, violates your organization's Browser Control policy.
      - **Country-Based Blocking (Advanced Threat Protection)**: The Public Service Edge checks if the request is being sent to a server in a country you've blocked as a suspicious destination under your Advanced Threat Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **Malicious URL Block (Advanced Threat Protection)**: The Public Service Edge checks if the requested URL is known to have malicious content using an extensive URL database that is updated daily with feeds from various partners. This check falls under the Advanced Threat Protection policies. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **IPS Signature Detection (Advanced Threat Protection):** The Public Service Edge checks the request using signature-based detection and provides protection against botnets, XSS, phishing, malicious active content, and other advanced threats. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one**.** The Public Service Edge checks the request using signature-based detection and provides protection against botnets, XSS, phishing, malicious active content, and other advanced threats.
      - **Suspicious Content Protection (Advanced Threat Protection)**: ThePublic Service Edge calculates the Suspicious Content Protection (Page RiskTM) value and blocks the page if the value exceeds the value you set in the Advanced Threat Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **Malware Protection**: The Public Service Edge checks files in the request against anti-virus and anti-spyware signatures. The service has dedicated threads for processing files that are larger than 10 MB to ensure that the evaluation of large files does not cause a bottleneck and delay the evaluation of smaller files. This check falls under the Malware Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **File Type Control**: The Public Service Edge checks if the POST request violates your File Type Control policy.
      - **Data Loss Prevention**: The Public Service Edge checks if the POST request includes content that violates your organization's DLP policy.
      - **P2P Controls**: The Public Service Edge checks if the requested application is a prohibited P2P file sharing, anonymizer, or VoIP application. This check falls under the Advanced Threat Protection policy.
      - **Bandwidth Control**: The Public Service Edge checks if the request is allowed full or reduced bandwidth based on your organization's Bandwidth Control policy and the current bandwidth usage at the user's location.
    - HTTP GET or POST Response
    - This is data sent from the destination host back to the user in response to an HTTP GET or POST request. The Public Service Edge scans the response and applies policies in the following order:
      - **Security Exceptions**: If exceptions are configured for your organization, the Public Service Edge checks if the responding URL is included in your organization's allowlist. These are configured in the Security Exceptions tab of the Malware Protection or Advanced Threat Protection policies. If the URL is included under Security Exceptions, the Public Service Edge skips over the Malware Protection, Advanced Threat Protection, and Sandbox policies listed.
      - **IPS Signature Detection (Advanced Threat Protection):** The Public Service Edge checks the response using signature-based detection and provides protection against botnets, XSS, phishing, malicious active content, and other advanced threats. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one. The Public Service Edge checks the request using signature-based detection and provides protection against botnets, XSS, phishing, malicious active content, and other advanced threats.
      - **Suspicious Content Protection**: The Public Service Edge calculates the Suspicious Content Protection (Page RiskTM) value and blocks the page if the value exceeds the value you set in the Advanced Threat Protection policy. This entire check falls under the Advanced Threat Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **Sandbox (check for known malicious files)**: The Public Service Edge checks if the response contains any malicious files that are previously identified by the Sandbox engine. If the responding URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **Malware Protection**: The Public Service Edge checks the files in the response against anti-virus and anti-spyware signatures. The service has dedicated threads for processing files that are larger than 10 MB to ensure that the evaluation of large files does not cause a bottleneck and delay the evaluation of smaller files. This check falls under the Malware Protection policy. If the user's requested URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **File Type Control**: The Public Service Edge checks if any files in the response violate your File Type Control policy.
      - **Sandbox (check for unknown files)**: If a file in the response has not been previously identified as a malicious file by the Sandbox engine, the service conducts an analysis of the file to detect any malicious behavior. If the responding URL falls under Security Exceptions, the service skips this policy and moves to the next one.
      - **AI/ML-based Content Categorization**: The Public Service Edge checks the responding URL for any content that could place the website into one of the following categories using AI/ML tools:
| URL Categories | URL Super Categories |
|---|---|
| Alcohol/Tobacco | Society and Lifestyle |
| Anonymizer | Illegal or Questionable |
| Art/Culture | Society and Lifestyle |
| Blogs | Internet Communication |
| Classifieds | Business and Economy |
| Continuing Education/College | Education |
| Dining/Restaurant | Society and Lifestyle |
| FileHost | Information Technology |
| Finance | Business and Economy |
| Gambling | Gambling |
| Government | Government and Politics |
| Health | Health |
| Job/Employment Search | Job/Employment Search |
| K-12 | Education |
| Online and Other Games | Games |
| Online Auctions | Shopping and Auctions |
| Online Shopping | Shopping and Auctions |
| Other Adult Material | Adult Material |
| Other Drugs | Drugs |
| Other Religion | Religion |
| Radio Stations | Entertainment/Recreation |
| Real Estate | Shopping and Auctions |
| Social Networking | Society and Lifestyle |
| Special Interests/Social Organizations | Special Interests/Social Organizations |
| Sports | Sports |
| Travel | Travel |
| Vehicles | Vehicles |
| Weapons/Bombs | Weapons/Bombs |
| Webmail | Internet Communication |
    - If the Public Service Edge determines that the website belongs in one of these categories, it checks your URL filtering policy to see if the response must be allowed or blocked. If the responding URL does not belong to any of those four super categories, the Public Service Edge categorizes the page as belonging to the Miscellaneous super category and allows or blocks based on your policy. AI/ML-based Content Categorization must be enabled in the Advanced URL Policy Settings.
      - **Bandwidth Control**: The Public Service Edge checks if the request is allowed full or reduced bandwidth based on your organization's Bandwidth Control policy and the current bandwidth usage at the user's location.
  - The following diagram summarizes the order of policy enforcement for different HTTP traffic types:
  - SSL/TLS Traffic Policies and Order of Enforcement
  - When the Public Service Edge receives SSL/TLS traffic, the evaluation and execution of the policies that are enforced follows a workflow depending on the traffic forwarding method, SSL/TLS Inspection scenarios (enabled, disabled, disable and show end user notification), and URL or cloud application policy evaluation on the CONNECT request and SNI.
  - The following diagram shows the SSL/TLS policy evaluation workflow:
    - In the explicit proxy mode, the URL filtering and cloud application policies are evaluated against the first CONNECT request.
    - The SSL/TLS Inspection policy is evaluated against the CONNECT request.
      - When SSL/TLS Inspection is disabled
        - If the host header is included in the list of URLs, URL categories, or hosts or applications that are exempted from SSL/TLS Inspection and other policies, then the Public Service Edge neither inspects nor enforces policy on the traffic. Instead, it sends the traffic directly to the internet.
        - If the request hits the block rule, then the Public Service Edge closes the connection and returns a 403 error.
        - If the request is allowed, then the Public Service Edge continues for another round of policy evaluation against the SNI.
      - When SSL/TLS Inspection is enabled
        - The Public Service Edge continues with another round of policy evaluation on the SNI irrespective of whether the request hits the allow or block rule.
    - The policies are evaluated on the incoming SSL/TLS connection based on the SNI. This is the first step of policy evaluation for the traffic in transparent proxy mode.
      - When SSL/TLS Inspection is disabled
        - If the requested SNI is included in the list of URLs, URL categories, or hosts or applications that are exempted from SSL/TLS Inspection and other policies, then the Public Service Edge neither inspects nor enforces policy on the traffic and sends the traffic to the internet.
        - If the traffic hits the block rule, then the Public Service Edge resets the connection.
        - If the connection is allowed, then the Public Service Edge sends the traffic to the internet without inspecting the traffic further.
      - When SSL/TLS Inspection is enabled
        - If the traffic hits the block rule, then the Public Service Edge continues with decrypting the first HTTP transaction to show EUN. Rarely, the policy action might change after decrypting the first HTTP transaction due to additional information discovery after decrypting the first transaction (such as user identity).
        - If the traffic is allowed, then the Public Service Edge decrypts the further HTTP transactions and enforces the policies on them.
## Important Notes on Policy Evaluation Workflow​​​
    - If SSL/TLS Inspection is disabled, but Show EUN for Blocked Traffic is enabled, then the Public Service Edge performs SSL/TLS Inspection on the first HTTPS transaction to respond with an end user notification (EUN). In the SSL/TLS Policy Evaluation Workflow diagram, this case is considered under the scenario where SSL/TLS Inspection is enabled.
    - When the destination domain is known to contain an advanced threat, the connection terminates immediately without showing an EUN even if SSL/TLS Inspection is enabled (or even if SSL/TLS Inspection is disabled with Show EUN for Blocked Traffic enabled). If the block happens on the CONNECT host header, the service responds with a 403 error. If the block happens on the SNI, the service resets the connection.
    - You must enable Surrogate IP or use Zscaler Client Connector for the Public Service Edge to have the user context during the CONNECT request or the Client Hello SNI. If there is no user context and if authentication is enabled for the location, then the Public Service Edge skips the policy evaluation to avoid an incorrect decision. However, when the user context is missing, but the policy for unauthenticated traffic is enabled, then the Public Service Edge evaluates the policy on the CONNECT request and Client Hello SNI.
    - During a CONNECT request or an incoming SSL/TLS connection (SNI), only the destination domain is available and not the full URL. So, the Public Service Edge applies only the following set of policies, which are based only on the requested domain and not the full URL or HTTP header. These policies are only a subset of the policies enforced on the HTTP traffic:
      - **Known Malicious URLs (Advanced Threat Protection)**: The Public Service Edge checks if the requested URL is known to have malicious content, using an extensive URL database. This check falls under the Advanced Threat Protection policies.
      - **Cloud App Control**: The Public Service Edge checks if the request violates the Cloud App Control policy configured by your organization.
      - **URL Filtering**: The Public Service Edge checks if the requested URL belongs to URL categories or custom URL categories blocked by your organization's URL Filtering policy.
      - **Bandwidth Control**: The Public Service Edge checks how much bandwidth to allocate the request based on your organization's Bandwidth Control policy and the current bandwidth usage at the user's location.
- Summary of Policy Evaluation and Logging
- The following table summarizes how the protocol and the request methods are evaluated and recorded in the logs based on different connection types:
| **Traffic type** | **Protocol used for policy evaluation and web logging** | **Request method used for policy evaluation** | **Request method used for web logging** |
|---|---|---|---|
| CONNECT to Public Service Edge | HTTP-PROXY | CONNECT | CONNECT |
| CONNECT to third-party proxy | HTTP | CONNECT | CONNECT |
| Binary after CONNECT | TUNNEL | Any | NA |
| SSL/TLS Client Hello | SSL/TLS | GET, POST, etc. | GET, POST, etc. |
| HTTP after SSL/TLS | HTTPS | Any | NA |
| Binary after SSL/TLS | TUNNEL-SSL/TLS | Any | NA |
- The following is some important information about policy evaluation and logging:
  - A CONNECT request destined to a Public Service Edge is evaluated and recorded using a special protocol category called HTTP-PROXY. This special protocol is used to differentiate the request destined to Zscaler from an HTTP CONNECT request that is destined to a third-party proxy. This allows you to define granular policies to selectively allow or block only those CONNECT requests that are destined for third-party proxies.
  - When an SSL/TLS connection is inspected, the Public Service Edge evaluates the policy on the SNI, but does not record an aggregate web log for the full session.
# Policy Enforcement for Non-Web Traffic
If the Public Service Edge receives outbound, non-web traffic going to ports other than 80/443, and the organization has Firewall policy enabled on the user's location, the Public Service Edge inspects the traffic and applies the policy using only the Firewall module. If the organization has not enabled Firewall policy for the location, the Public Service Edge neither scans nor applies any policy to the traffic.
## Policy Enforcement Examples
Knowing how the Zscaler service applies your policies in different scenarios helps you understand why certain policies do or do not trigger your users' traffic. It also ensures that your organization's traffic is secured as expected. The following are some policy enforcement scenario examples:
- Example 1
- Consider an organization that does the following:
  - Under the Firewall policy, the organization allows the cloud application Box.net.
  - Under the Web policy, the organization blocks the same application.
- When a user from the organization opens a browser and requests the application Box.net, the user is blocked. Even though the Firewall module which first performs inspection allows the traffic, the web module still inspects and enforces Web policy on that traffic.
- Example 2
- Consider an organization that does the following:
  - Under the File Type Control policy, the organization blocks PDFs from being sent out of its corporate network.
  - Under the DLP policy, the organization blocks documents containing US Social Security numbers and specifies that the Zscaler service send notifications to auditors when it detects users attempting to do so.
- If a user in this organization attempts to send a PDF that contains credit card numbers, the service blocks the transaction, but it does so because of the File Type Control policy, rather than the DLP policy. The DLP policy itself is never triggered, and the service does not send a notification alerting the auditor that a user has attempted to send Social Security numbers out of the organization.
By default, if a user requests a cloud app that you explicitly allow with Cloud App Control, the service only applies the Cloud App Control policy and it skips the URL Filtering Policy.
