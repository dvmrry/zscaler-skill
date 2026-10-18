# Best Practices for DNS Control Rules

**Source:** https://help.zscaler.com/zia/best-practices-dns-control-rules
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1459191, revision 3238001

---

Zscaler recommends the following best practices for using the DNS Control policy. These best practices are applicable when DNS traffic is forwarded to the Zscaler service and inspected by the DNS Control module of Zscaler Firewall.
# Block Unknown DNS Traffic
Configure the default Unknown DNS Traffic rule to block traffic. This rule prevents malformed DNS queries or non-DNS traffic masquerading as DNS traffic on destination port 53. In addition, this rule also identifies and blocks certain forms of DNS abuse in real time that are consistent with certain DNS tunneling methods.
See image.
# Block DNS Tunnels
Create a DNS filtering rule to block the following DNS tunnels by using the DNS Tunnel & Network Apps criteria:
- **Commonly Blocked DNS Tunnels**: These are DNS tunnels in the denylist classification that are determined to be malicious by ThreatLabZ (Zscaler's security research team).
- **Unknown DNS Tunnels**: These are DNS tunnels in the graylist classification that are yet to be classified and are determined to be potentially malicious by ThreatLabZ.
- (Optional) **Commonly Allowed DNS Tunnels**: These are legitimate tunnels operated by security services, but they typically have alternate, more standard modes of communication.
See image.
To learn how Zscaler detects tunneling in your network, see Detecting and Controlling DNS Tunnels.
# Block Risky URL Categories
Configure your DNS filtering rule to block the following risky URL categories using Request Categories and Response Categories criteria:
- **Advanced Security and Security**: These categories target both domains and IP addresses that are known to host targeted malicious content, host hijacked domains, or be used as a backchannel (command and control) communication. This includes adware/spyware sites, botnets, phishing sites, Domain Generation Algorithm (DGA) Domains, and other malicious content.
- **Miscellaneous**: This includes sites that are not yet classified by Zscaler. There is minimal business need to allow all unknown and unclassified applications or sites.
- Zscaler recommends blocking the entire Miscellaneous super category on the DNS request side (i.e., using the Request Categories condition) with caution. Blocking this entire category on the response side is not recommended as it can have an overly broad impact, given that relatively few IP addresses are categorized, as opposed to domains.
- Blocking the Newly Registered and Observed Domains (NRODs) category is especially recommended. NRODs are often part of attack chains; for example, they act as termination points for DNS exfiltration by using tunneling techniques or hosting drive-by and other malware before the domain is classified. There is also minimal general business need for a business-critical (or commonly-used) application to be hosted at an NROD.
- **Other Risky URL Categories**: Block other categories of domains and resolved IP addresses that have no business need for users, such as Gambling, Adult Content, etc. For categories that are exclusive to web browsing, you can use the URL categorization of the secure web gateway (i.e., web proxy) and display block or caution end user notifications (EUNs) when users browse to specific websites (beacons to the outside server in the case of HTTPS).
See image.
To learn about URL categorization, see About URL Categories.
# Create Block Rules for DNS Request and Response Phases
Consider adding block rules that apply to both request and response phases of a DNS transaction. The block action on the request side is enforced immediately. The blocked request is prevented from reaching the targeted DNS resolver (Zscaler Trusted Resolver or third-party resolver), and the response phase of the transaction does not take place.
- Zscaler supports both domain-based and IP address-based categorization. However, domain-based categorization supports a wider range of categories compared to IP-based categorization. Also, domain-based categorization is more precise as they rely on the content, while IP-based classification might not be accurate as multiple domains of different categories can resolve to the same IP address.
- IP-based categorization can offer an additional layer of security in cases such as DNS poisoning. For example, if a properly categorized domain has been poisoned with a known IP address to host malicious content, the rule can still block the traffic based on the IP address. Therefore, it is recommended to mirror the policy on both DNS request and response sides whenever possible.
# Suppress the Use of HTTP/3, QUIC, and ECH
The DNS request type HTTPS, available in policy rules, is a DNS resource record (type 65) defined in RFC 9460. It allows servers to advertise connection parameters directly in the DNS response, improving performance by specifying supported HTTP protocols (e.g., HTTP/2 and HTTP/3), alternate ports, and Encrypted Client Hello (ECH) configuration data. HTTPS records are increasingly used by web browsers and applications to leverage the use of HTTP/3 with QUIC and ECH, which the Zscaler web proxy currently does not support.
Zscaler recommends configuring your DNS Control policy to block HTTPS and SVCB resource records to suppress the use of HTTP/3 over QUIC and to stop ECH and prevent unmanaged encrypted traffic flows happening via the secure web gateway. To do this, create a DNS filtering rule with HTTPS and SVCB selected as the DNS Request Type criteria and the action should be Block with Response Code along with "2 - Server Failure" selected as the response code, as shown in the following image. This would allow you to block the HTTPS and SVCB request types and send a Server Failure response (i.e., ServFail DNS response code according to RFC 6895) to the client.
See image.
Other response codes such as "3 - Non-Existent Domain" (i.e., NXDomain) might result in blocking the domains themselves, so exercise caution when using the Block with Response Code action, adhering to the following recommendations:
- NXDomain should only be used exclusively with rule criteria such as Request Categories and Response Categories. These categories can include specific URL categories (both predefined and custom) and top-level domain (TLD) categories. However, categories such as Miscellaneous that are not mapped to specific target domains should be avoided in the criteria. Alternatively, consider using less definitive and less globally cacheable response codes such as "5 - Query Refused" (i.e., Refused) and "2 - Server Failure" (i.e., ServFail).
- Defining a response code for an entire type of DNS request should be strictly avoided. For example, defining a rule to block all DNS requests of A or AAAA record types (i.e., using DNS Request Type criteria) with NXDomain would likely result in an unintended DNS outage.
To learn more about blocking QUIC, see Managing the QUIC Protocol.
