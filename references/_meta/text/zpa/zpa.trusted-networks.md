# ZPA trusted networks (zpa.trusted-networks)
Also called: trusted network; trusted networks; TRUSTED_NETWORK; zpa_trusted_network; networkId; on-network users zpa

"How do trusted networks affect ZPA policy and routing?" takes four questions in order. The detection criteria themselves belong to Zscaler Client Connector and are covered in [ZCC trusted networks](kb:zcc.trusted-networks).

1. **What is the ZPA trusted network object and how do I fetch it?** Fields, identifiers, endpoints: [The ZPA trusted network object and how to fetch it](kb:zpa.trusted-networks.object).
2. **How does a rule reference one?** The `TRUSTED_NETWORK` operand and its validators: [The TRUSTED_NETWORK operand in ZPA policy rules](kb:zpa.trusted-networks.policy-operand).
3. **How do trusted networks steer Private Service Edge choice?** [Trusted networks on ZPA Private Service Edge groups](kb:zpa.trusted-networks.service-edge-groups).
4. **How does this relate to the networks defined in Client Connector?** [Trusted networks in ZPA and in Client Connector](kb:zpa.trusted-networks.zcc-relationship).

Area: zpa.trusted-networks, its subjects in references/_meta/spine/zpa/zpa.trusted-networks.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network): Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria]
- links-to references/_meta/text/zcc/zcc.trusted-networks.md (ZCC trusted networks)
- links-to references/_meta/text/zpa/zpa.trusted-networks.object.md (The ZPA trusted network object and how to fetch it)
- links-to references/_meta/text/zpa/zpa.trusted-networks.policy-operand.md (The TRUSTED_NETWORK operand in ZPA policy rules)
- links-to references/_meta/text/zpa/zpa.trusted-networks.service-edge-groups.md (Trusted networks on ZPA Private Service Edge groups)
- links-to references/_meta/text/zpa/zpa.trusted-networks.zcc-relationship.md (Trusted networks in ZPA and in Client Connector)
