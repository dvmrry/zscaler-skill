"Why was this blocked as a threat?" and "what is ATP set to?" are answered in a fixed order. ATP is the policy of inline URL, content and behavior detections; file scanning is [[zia.malware-protection]], and which engine produced a block is read from the log: [[zia.atp.block-diagnosis]], [[zia.sandbox.verdicts]].

{{global-policy}} {{no-scoping}} {{before-ips}} IPS Control itself is covered in [[zia.firewall.ips]].

1. **Which detection fired?** The toggles and their groups: [[zia.atp.categories]], with the Page Risk threshold in [[zia.atp.page-risk]], C2 and DGA in [[zia.atp.botnet]], country blocking in [[zia.atp.blocked-countries]] and Tor in [[zia.atp.tor]].
2. **Is a list involved?** The tenant denylist is [[zia.atp.blocked-urls]]; the allowlist is [[zia.atp.security-exceptions]].
3. **Did the policy change at all?** A URL can start blocking with no edit: [[zia.atp.ai-ml-recategorization]].
4. **Where does it run?** The order of checks, and what an exception skips: [[zia.atp.enforcement-order]]. Content detections need decryption: [[zia.ssl-inspection.bypass-impact]].
5. **What does the user see?** {{client-connector-notice}}

The reference configuration: {{recommended-policy}} {{save-and-activate}}

API and field-name traps are in [[zia.atp.api-surface]]; provider defects are in [[zia.terraform.multi-step-writes]], [[zia.terraform.error-handling]] and [[zia.terraform.activation]].
