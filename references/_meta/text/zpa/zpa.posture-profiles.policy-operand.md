# The POSTURE operand in ZPA policy rules (zpa.posture-profiles.policy-operand)
Also called: POSTURE object_type; posture lhs rhs; VERIFIED VERIFICATION FAILED; posture_udid in policy; posture rule never matches; client connector posture profile condition set; posture timeout rule

POSTURE criteria point a rule at a profile and at its verification result.

**Operand.** A POSTURE operand's lhs is the profile's posture_udid, not its resource id: the data source note says to export posture_udid instead of the id, and the access rule documentation says lhs is the posture_udid. [zpa.posture-profiles.policy-operand:lhs-is-udid] In a POSTURE operand rhs true means VERIFIED and rhs false means VERIFICATION FAILED. [zpa.posture-profiles.policy-operand:rhs-verified] In the console each posture profile in a condition set is set to VERIFIED, meaning Zscaler Client Connector verified the device against the profile's criteria, or VERIFICATION FAILED, meaning it was unable to verify the device against them. [zpa.posture-profiles.policy-operand:console-states] A rule can have up to 10 Client Connector Posture Profile condition sets, and each set can hold several posture profiles. [zpa.posture-profiles.policy-operand:condition-sets] The general operand forms are in [PLATFORM, COUNTRY_CODE, POSTURE and TRUSTED_NETWORK operands carry the identifier in lhs (the platform name, an ISO country code, the posture profile's posture_udid, the trusted network's network_id) and the string true or false in rhs.](kb:zpa.policy.conditions:boolean-rhs-entry-types); the AND and OR defaults are in [Multiple Cloud Connector groups and multiple posture profile condition sets in one rule are joined by AND, while profiles inside one condition set are joined by OR by default with a toggle to AND.](kb:zpa.policy.conditions:and-within-some-criteria).

**Provider checks.** For v1 policy rule resources the provider looks the POSTURE lhs up with GetByPostureUDID, so a value that is not a known posture UDID fails the create or update, and it requires rhs to be "true" or "false". [zpa.posture-profiles.policy-operand:v1-lookup] For v2 policy rule resources the provider requires a non-empty lhs and an rhs of "true" or "false" for a POSTURE operand and does not look the lhs up. [zpa.posture-profiles.policy-operand:v2-no-lookup] What ZPA does with a wrong identifier is open [gap:zpa.posture-profiles.policy-operand:wrong-lhs-effect].

**Families and scope.** The provider's access, forwarding, timeout and inspection rule resources, in their v1 and v2 forms, list POSTURE among their operand object types. [zpa.posture-profiles.policy-operand:families] The provider's isolation rule resources, v1 and v2, do not list POSTURE among their operand object types. [zpa.posture-profiles.policy-operand:isolation-excluded] The data source documentation disagrees [divergence:zpa.posture-profiles.policy-operand:posture-isolation]. [The v1 access rule doc says microtenant_id is not supported inside operands when object_type is SAML, SCIM, SCIM_GROUP, IDP, POSTURE or TRUSTED_NETWORK, and follows it directly with the sentence that ZPA automatically assumes the posture profile ID that belongs to the parent tenant.](kb:zpa.terraform.policy-rule-resources:operand-microtenant-unsupported-types) Timeout rules that tier by posture are in [The MCP skill's posture example gives devices that pass a posture check a longer timeout and non-compliant devices a shorter one, using two rules with the POSTURE rhs set to true and to false.](kb:zpa.policy.timeout-rules:posture-tiering-example).

**Clients without posture.** Web Browser rules cannot use posture criteria, as in [Rules that use the Web Browser or Internet & SaaS Service Edge client types cannot also use posture profiles or trusted networks criteria, which only work with Client Connector.](kb:zpa.browser-access.policy:no-posture-with-web-browser); the Browser Access outcome is the open question [What a Browser Access session gets from a rule that has a posture condition](kb:zpa.browser-access.policy:posture-rule-outcome).

**Failed versus absent.** Whether false covers a device with no result is open [gap:zpa.posture-profiles.policy-operand:false-meaning].

Whether posture and trusted-network operands are rewritten is open [gap:zpa.posture-profiles.policy-operand:operand-name-rewrite-scope].

What to check:
1. Which value the lhs holds: the posture_udid, not the id and not the name.
2. Whether rhs true or false is meant: VERIFIED or VERIFICATION FAILED, and whether devices with no result are expected under false.
3. Whether the rule's client type is Client Connector, since posture criteria work only with it.
4. Whether the rule family accepts POSTURE: isolation rules do not.
5. Whether the rule is for the machine tunnel, where posture profile criteria need Zscaler Client Connector 3.9 or later.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.posture-profiles.policy-operand:isolation-excluded] Tier B: Absence claim from a search: the string "POSTURE" does not occur in either isolation resource file.

Sources disagree (name both sides):
- Whether a posture profile can be referenced in an isolation policy. [divergence:zpa.posture-profiles.policy-operand:posture-isolation]
  - tf-zpa: The data source can be referenced in an Isolation Policy.
  - tf-zpa: The isolation rule resource's operand type list has no POSTURE.
  - zscaler-help: The isolation policy help says the Client Connector Posture Profiles criterion may appear in the drop-down menu but is not supported with the Web Browser client type that isolation rules require, while the same page also describes up to 10 posture profile condition sets and says a posture profile must be selected before a client type.
  Impact: A configuration that follows the data source documentation and puts a POSTURE operand in an isolation rule is rejected by the provider schema, and the isolation help is internally mixed about whether the criterion is usable, so which isolation rules accept posture is unresolved.

Not known (open gaps):
- Whether rhs false matches a device that has never reported a result for the profile [gap:zpa.posture-profiles.policy-operand:false-meaning]: settled by lab-test. Blocks: using rhs false to cover non-compliant and unknown devices together
- What a v2 rule does when the POSTURE lhs is not a posture UDID [gap:zpa.posture-profiles.policy-operand:wrong-lhs-effect]: settled by lab-test. Blocks: saying a wrong identifier fails silently
- Whether the API rewrites the name of POSTURE and TRUSTED_NETWORK operands [gap:zpa.posture-profiles.policy-operand:operand-name-rewrite-scope]: settled by lab-test. Blocks: telling whether posture and trusted-network operands cause drift in Terraform plans

Area: zpa.posture-profiles, its subjects in references/_meta/spine/zpa/zpa.posture-profiles.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria): Rules that use the Web Browser or Internet & SaaS Service Edge client types cannot also use posture profiles or trusted networks criteria, which only work with Client Connector. [zpa.browser-access.policy:no-posture-with-web-browser]
- links-to references/_meta/text/zpa/zpa.policy.conditions.md (Boolean logic and operand forms of ZPA policy conditions)
- depends-on references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles), from zpa.posture-profiles: Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels. [zpa.posture-profiles.object-model:zcc-defined]
- depends-on references/_meta/text/zpa/zpa.posture-profiles.object-model.md (The ZPA posture profile object and where it comes from): The posture profiles configured in the Zscaler Client Connector portal appear in the access policy criteria drop-down menu, where a specific profile can be searched. [zpa.posture-profiles.object-model:appear-in-policy-list]
- links-to references/_meta/text/zpa/zpa.policy.timeout-rules.md (ZPA timeout policy rules)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-resources.md (ZPA Terraform policy rule resources: v1 and v2 conditions, operand types and provider changes)
