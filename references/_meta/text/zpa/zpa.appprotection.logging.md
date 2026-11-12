# Where AppProtection events go: the LSS log type and its fields (zpa.appprotection.logging)
Also called: appprotection logs siem; zpn_waf_http_exchanges_log; appprotection log fields; lss appprotection nss; krb ldap smb inspection logs; appprotection events not in nss

AppProtection events are Private Access log data. A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type] [LSS is deployed using two components, a log receiver and an App Connector: LSS resides in the Zero Trust Exchange and starts a log stream through a Public Service Edge, and the App Connector in the company's environment receives the stream and forwards it to the log receiver.](kb:zpa.log-receivers.architecture:two-components)

**Not NSS.** [LSS captures log data about App Connectors and users in Private Access, while the Nanolog Streaming Service resides in Internet & SaaS (ZIA) and streams traffic logs from the Zscaler Nanolog to a SIEM.](kb:zpa.log-receivers.architecture:not-nss) AppProtection events reach a SIEM through an LSS receiver, so a ZIA NSS feed does not carry them. [zpa.appprotection.logging:no-nss-delivery]

**Configuring it.** The source_log_type value for the AppProtection log type is zpn_waf_http_exchanges_log, shown as ZPA App Protection in the provider's log type table. [zpa.appprotection.logging:wire-id]

**Fields.** The default AppProtection log fields include InspectionPolicy, InspectionProfile, ParanoiaLevel and InspectionControlsHitCount, and the log content can be edited to specific fields with a custom template. [zpa.appprotection.logging:field-set] The default AppProtection log fields have no field for the control number, severity or action of a hit, only a hit count. [zpa.appprotection.logging:no-per-control-fields]

**Active Directory.** Kerberos, LDAP and SMB inspection each have their own LSS log type: KRB Inspection Logs, LDAP Inspection Logs and SMB Inspection Logs. [zpa.appprotection.logging:ad-log-types] Whether Active Directory control hits also appear in the AppProtection log type is open [gap:zpa.appprotection.logging:ad-in-appprotection-log].

**KRB, LDAP and SMB templates.** The Log Streaming Service can send Kerberos (KRB), LDAP and SMB inspection log information to any third-party log analytics tool. [zpa.appprotection.logging:inspection-lss-send] The example templates on the KRB, LDAP and SMB inspection log pages each end with the per-control list fields InspectionControlArray, ControlTypeArray, InspectionControlCategories, Actions, SeveritiesArray and DescriptiveExplanationsArray, each written with a comma-separated list specifier. [zpa.appprotection.logging:inspection-template-tail] The KRB example template carries Transport, InspectionProtocolConfig, TrafficClassfication (as the page spells it), ProtocolClassification, ProtocolInspectionError, ProtocolVersion and ProtocolActivityType, followed by KRBRealm, KRBClientRealm, KRBUserPrincipal, KRBServicePrincipal, KRBEncryption, KRBTicketEncryption and KRBErrorCode. The LDAP example template carries request and query counters from LDAPNullBindRequests through LDAPWholeSubTreeQueries, and the SMB one carries SMBSessionControlRequests through SMBUserListEnum. [zpa.appprotection.logging:inspection-template-protocol-fields] The field tables on those three pages do not match their templates [divergence:zpa.appprotection.logging:inspection-field-tables]. The template fields are not defined [gap:zpa.appprotection.logging:inspection-template-fields], and the three log types are not among the generated field tables [gap:zpa.appprotection.logging:inspection-not-generated].

What to check:
1. That an LSS log receiver exists with an AppProtection log type, rather than looking in NSS.
2. The source_log_type value used when configuring the receiver by API or Terraform.
3. Which of the profile, policy, paranoia and hit-count fields the template includes, and that per-control detail is not among them.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.appprotection.logging:no-nss-delivery] Tier B: Derived from the AppProtection log type being listed under LSS and NSS being the ZIA Nanolog stream. No source states that NSS cannot carry AppProtection events.
- [zpa.appprotection.logging:no-per-control-fields] Tier B: Absence claim. The full default field table was read (the Field column from LogTimestamp to TotalBytesProcessed); no row names a control number, severity or action. The vendor example record could not add fields beyond that table.

Sources disagree (name both sides):
- On the KRB, LDAP and SMB inspection log pages, the field table lists the HTTP fields of the AppProtection log, while the example template on the same page names protocol fields the table does not list. [divergence:zpa.appprotection.logging:inspection-field-tables]
  - zscaler-help: KRB page table: lists HTTP fields such as Method and ExchangeSequenceIndex.
  - zscaler-help: LDAP page table: lists the HTTP Method field.
  - zscaler-help: SMB page table: lists the HTTP Method field.
  - zscaler-help: KRB page example template: names protocol fields such as KRBRealm that the table does not list.
  - zscaler-help: AppProtection log page: the same Method row appears in the AppProtection log field table.
  Impact: The tables on these three pages cannot be used as the KRB, LDAP or SMB field definitions; the templates name the protocol fields but no captured page describes them.

Not known (open gaps):
- What the KRB, LDAP and SMB template fields mean [gap:zpa.appprotection.logging:inspection-template-fields]: settled by tenant-data or support-ticket
- KRB, LDAP and SMB inspection fields are not among the generated log types [gap:zpa.appprotection.logging:inspection-not-generated]: settled by source-read
- Whether Active Directory control hits also appear in the AppProtection log type [gap:zpa.appprotection.logging:ad-in-appprotection-log]: settled by lab-test or tenant-data

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators): A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile), from zpa.appprotection: A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- depends-on references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service): AppProtection events reach a SIEM through an LSS receiver, so a ZIA NSS feed does not carry them. [zpa.appprotection.logging:no-nss-delivery]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.appprotection.active-directory.md (Active Directory controls: Kerberos, SMB and LDAP inspection)
