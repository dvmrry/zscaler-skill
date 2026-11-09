# Sending Private Access logs to Splunk with LSS: the TA and App, source types, index and TCP input (zpa.log-receivers.splunk)
Also called: splunk; zscaler splunk app; zscaler technical add-on; splunk TA; zscalerlss-zpa-app; zscalerlss source types; splunk CIM; private access and splunk deployment guide

In Private Access, LSS uses a log receiver and an App Connector to stream traffic logs in real time from the log receiver to a SIEM such as Splunk. [zpa.log-receivers.splunk:lss-vs-nss] How the App Connector forwards the stream to the receiver is in [LSS is deployed using two components, a log receiver and an App Connector: LSS resides in the Zero Trust Exchange and starts a log stream through a Public Service Edge, and the App Connector in the company's environment receives the stream and forwards it to the log receiver.](kb:zpa.log-receivers.architecture:two-components), and NSS is in [LSS captures log data about App Connectors and users in Private Access, while the Nanolog Streaming Service resides in Internet & SaaS (ZIA) and streams traffic logs from the Zscaler Nanolog to a SIEM.](kb:zpa.log-receivers.architecture:not-nss). Zscaler on Splunk has two parts, the Zscaler Technical Add-On (TA) and the Zscaler Splunk App, and the TA is required for the App. [zpa.log-receivers.splunk:two-parts]

**What the App expects.** The Zscaler Splunk App expects data bound to source types: zscalerlss-zpa-app (User Activity), zscalerlss-zpa-web-inspection (AppProtection), zscalerlss-zpa-audit (Audit), zscalerlss-zpa-auth (User Status), zscalerlss-zpa-bba (Browser Access), zscalerlss-zpa-connector (listed as App Connector Logs) and zscalerlss-zpa-pse (Private Service Edge Status). [zpa.log-receivers.splunk:source-types] The Splunk App requires data in the index named zscaler (base macros can be edited for another index), expects field names as seen in Private Access LSS with JSON output, and a Splunk administrator might need to create aliases in these fields. [zpa.log-receivers.splunk:index-and-fields] The Splunk App depends on the Splunk Common Information Model (CIM); the Web and Network Sessions data models must be accelerated for some of its functions. [zpa.log-receivers.splunk:cim-dependency]

**Adding the source.** To add LSS as a Splunk log source, add a TCP data input for each Zscaler source type you add in Splunk, specifying the receiving TCP port, the Zscaler source type, Set host = DNS and the zscaler index. [zpa.log-receivers.splunk:tcp-input] Which receiver settings or LSS format produce each source type, and which TCP port to use, are not stated [gap:zpa.log-receivers.splunk:source-type-mapping]. The log types are in [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types) and the output formats in [Log stream format and content templates for a ZPA log receiver](kb:zpa.log-receivers.formats).

What to check:
1. Whether the data is in the index named zscaler, or the base macros were edited for another index.
2. Whether the Web and Network Sessions data models are accelerated.
3. Whether a TCP input exists for each Zscaler source type the deployment adds in Splunk, with the zscaler index.

Not known (open gaps):
- Which log receiver settings produce each Splunk source type, and which TCP port to use [gap:zpa.log-receivers.splunk:source-type-mapping]: settled by source-read or lab-test

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.log-receivers.architecture.md (How the Log Streaming Service reaches a SIEM)
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
