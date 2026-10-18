"Is this traffic inspected, and what does that change?" needs several questions answered in order. Skipping one is how SSL answers go wrong.

1. **Where does the SSL decision sit?** Between two passes of URL Filtering and Cloud App Control, and what survives without decryption depends on Evaluate versus Bypass Other Policies: [[zia.ssl-inspection.pipeline]].
2. **Which rule matches?** First match by ascending order, with predefined and default rules you did not write: [[zia.ssl-inspection.rules]]. Whether its criteria can match this traffic at all (destination groups with SNI, user agents, identity, platform): [[zia.ssl-inspection.criteria]].
3. **What does the rule do?** Certificates, OCSP, SNI, TLS floors, HTTP/2 and notifications: [[zia.ssl-inspection.actions]]. The same settings as a nested wire object, with tokens, casing and validators: [[zia.ssl-inspection.api-shape]].
4. **Could it be inspected at all?** Who signs the certificate and where the root must be trusted: [[zia.ssl-inspection.certificates]]. Pinned apps, client certificates, QUIC, BYOD and IoT: [[zia.ssl-inspection.uninspectable]].
5. **What does an exemption cost?** How to write one safely: [[zia.ssl-inspection.exemptions]]. What stops working behind it: [[zia.ssl-inspection.bypass-impact]].

Terraform and SDK defects for SSL rules are not repeated here; the validator and plan-time checks are in [[zia.sdk-go.service-defects]].
