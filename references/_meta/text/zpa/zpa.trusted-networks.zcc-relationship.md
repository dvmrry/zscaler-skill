# Trusted networks in ZPA and in Client Connector (zpa.trusted-networks.zcc-relationship)
Also called: zpa trusted network vs zcc trusted network; are zpa and zcc trusted networks the same; send trusted network result to zpa; where do zpa trusted networks come from; trusted network provisioning

This subject covers how ZPA trusted networks relate to Client Connector. Criteria fields and forwarding profile network types are in [How Client Connector decides it is on a trusted network](kb:zcc.trusted-networks.detection) and [The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted](kb:zcc.forwarding-profiles.network-types).

**Where networks are defined.** Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria] The trusted networks offered when building a ZPA access policy rule are the ones configured in the Client Connector Portal; the AppProtection policy page names the Admin Console instead. [zpa.trusted-networks.zcc-relationship:policy-menu-source] The read-only trusted network records ZPA returns are the trusted networks configured on the Client Connector side. [zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks] Whether the two identifiers match is open [gap:zpa.trusted-networks.zcc-relationship:id-correspondence].

**The result sent to ZPA.** A Client Connector forwarding profile's ZPA action has a Send Trusted Network Result to ZPA setting, described by the Client Connector API as indicating whether it is enabled. [zpa.trusted-networks.zcc-relationship:send-result-setting] How and when the exchange happens is open [gap:zpa.trusted-networks.zcc-relationship:signal-path]. What ZPA does differently for such users is open [gap:zpa.trusted-networks.zcc-relationship:policy-effects].

How a rule names a network: [The TRUSTED_NETWORK operand in ZPA policy rules](kb:zpa.trusted-networks.policy-operand). Provider fields on the Client Connector side: [ZCC Terraform provider fields that are not sent, not read back, or collapsed](kb:zcc.terraform.field-fidelity).

What to check:
1. Where the trusted network is defined; detection criteria are configured on the Client Connector side.
2. Whether the forwarding profile sends the result to ZPA for the network type in question.
3. Whether a ZPA networkId can be matched to a Client Connector record, which needs a tenant comparison.
4. How and when the result reaches ZPA, which no source describes.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks] Tier B: Inference: the rule menu is fed from the Client Connector configuration and the provider points its trusted network documentation at the Client Connector article; no source states that a ZPA `networkId` equals a Client Connector identifier.

Not known (open gaps):
- Whether a ZPA networkId equals the identifier of the Client Connector trusted network [gap:zpa.trusted-networks.zcc-relationship:id-correspondence] (data gap): filled by live; run `zscalerctl zpa trusted-networks list`; settled by tenant-data. Blocks: saying a ZPA networkId can be read from a Client Connector record
- How and when Client Connector reports the trusted network result to ZPA [gap:zpa.trusted-networks.zcc-relationship:signal-path]: settled by lab-test or support-ticket. Blocks: saying when a trusted network change takes effect in ZPA policy
- What ZPA policy can do differently for users on a trusted network [gap:zpa.trusted-networks.zcc-relationship:policy-effects]: settled by lab-test or source-read

Area: zpa.trusted-networks, its subjects in references/_meta/spine/zpa/zpa.trusted-networks.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network): Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria]
- interacts-with references/_meta/text/zpa/zpa.trusted-networks.policy-operand.md (The TRUSTED_NETWORK operand in ZPA policy rules): In an access policy rule, Client Connector Trusted Networks is a criterion naming the type of network the user is connected to that Zscaler Client Connector can trust. Selecting several trusted networks combines them with OR. [zpa.trusted-networks.policy-operand:console-criterion]
- interacts-with references/_meta/text/zcc/zcc.forwarding-profiles.private-access-actions.md (Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type): A Client Connector forwarding profile's ZPA action has a Send Trusted Network Result to ZPA setting, described by the Client Connector API as indicating whether it is enabled. [zpa.trusted-networks.zcc-relationship:send-result-setting]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.network-types.md (The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted)
- links-to references/_meta/text/zcc/zcc.terraform.field-fidelity.md (ZCC Terraform provider fields that are not sent, not read back, or collapsed)
