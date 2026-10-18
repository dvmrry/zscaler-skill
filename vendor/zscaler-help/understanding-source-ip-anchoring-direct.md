# Configuring Source IP Anchoring Direct

**Source:** https://help.zscaler.com/zpa/understanding-source-ip-anchoring-direct
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485671, revision 3238032

---

Source IP Anchoring Direct is a set of Private Access (ZPA) configurations that supports Source IP Anchoring forwarding policies when Internet & SaaS (ZIA) is in disaster recovery mode. When Internet & SaaS is configured for disaster recovery, the Private Access Source IP Anchoring configurations must be changed to the Source IP Anchoring Direct configurations to ensure proper forwarding during a Internet & SaaS disaster recovery event.
To configure Private Access Source IP Anchoring client policies for Source IP Anchoring Direct, you must change or verify the following configurations for the duration of a Internet & SaaS disaster recovery event:
- Client Forwarding Policy Configuration
  - From the navigation menu, go to **Private Access** > **Steering** > **Client Forwarding Policy**.
  - Change the client forwarding policy rules:
    - For the domain-based application rule with **Segment Groups** and **Client Types** > **Client Connector** criteria, change the **Rule Action** from **Bypass ZPA** to **Forward to ZPA**.
    - See image.
    - For the IP address-based application rule with **Segment Groups**, change the **Rule Action** from **Only Forward Allowed Applications** to **Forward to ZPA**.
- Access Policy Configuration
- Some access policy configurations support Source IP Anchoring but do not support Source IP Anchoring Direct. The following access policy configurations prevent Source IP Anchoring Direct from working:
  - Any access policy rule that blocks access to Zscaler Client Connector. For example, **Application Segment** (or **Segment Groups**) and **Client Type** > **Client Connector** with the **Block Access** rule action enabled.
  - Any access policy rule that results in the Default Rule.
If you plan to use the Source IP Anchoring Direct configurations, Zscaler recommends that you ensure there is an access policy that allows access to the applications from Zscaler Client Connector. To learn more, see Configuring Access Policies.
# Restoring Source IP Anchoring After Source IP Anchoring Direct
When the Internet & SaaS disaster recovery event ends, revert the client forwarding policy rule and access policy rule configured for Source IP Anchoring Direct back to the Source IP Anchoring configuration as follows:
- Client Forwarding Policy Configuration
  - From the navigation menu, go to **Private Access** > **Steering** > **Client Forwarding Policy**.
  - Change the client forwarding policy rules:
    - For the domain-based application rule with **Segment Groups** and **Client Types** > **Client Connector** criteria, change the **Rule Action** from **Forward to ZPA** to **Bypass ZPA**.
    - See image.
    - For the IP address-based application rule with **Segment Groups**, change the **Rule Action** from **Forward to ZPA** to **Only Forward Allowed Applications**.
- Access Policy Configuration
  - From the navigation menu, go to **Private Access** > **Policy** > **Access Policy**.
  - Change the access policy rules:
    - For domain-based applications, ensure that you allow the Source IP Anchoring client (Internet & SaaS Service Edge client type) to access the applications.
    - For IP address-based applications, configure the following rules:
      - Rule 1: Select the **Block Access** rule action and add all the client types, except the **ZIA Service Edge** client type for the Source IP Anchoring application segments. This rule prevents application download on Zscaler Client Connector.
      - Rule 2: Select the **Allow Access** rule action and add only the **ZIA Service Edge** client type for the Source IP Anchoring application segments.
