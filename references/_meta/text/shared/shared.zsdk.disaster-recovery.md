# ZSDK disaster recovery: scope, prerequisites, settings and DNS records (shared.zsdk.disaster-recovery)
Also called: zsdk disaster recovery; zsdk dr; zsdk dr dns txt record; zsdk max age for authentication

Disaster recovery ensures business continuity when the Zscaler service is impacted globally, and can be enabled on defined application segments, App Connector groups and Private Service Edge groups. [shared.zsdk.disaster-recovery:purpose-and-scope] Application segments and Private Service Edge groups designated for disaster recovery bypass the ZSDK cloud; disaster recovery is disabled by default on both. [shared.zsdk.disaster-recovery:bypass-cloud-default-off]

## Prerequisites and settings

Before enabling disaster recovery, critical segments and groups must be identified, end users must run ZSDK version 2.0 or later, and a separate DNS domain name must be created for it with the Private Service Edge IP addresses entered in what the page calls the "TXT DNS A record" (it mixes the TXT and A record names). [shared.zsdk.disaster-recovery:prerequisites] A Private Service Edge deployed behind a firewall must be allowed outbound connections to the Public Service Edge IP addresses and inbound connections from App Connectors and Zscaler Client Connectors. [shared.zsdk.disaster-recovery:firewall-requirement] The Disaster Recovery Settings page takes Max Age for Authentication (a number plus Hours, Days or Weeks), a Disaster Recovery Public Key and a Disaster Recovery Domain Name. [shared.zsdk.disaster-recovery:settings-fields]

## DNS records

Disaster recovery needs two DNS record types: a DNS TXT record that triggers it (for the initial version, v=1;k=all;b=on;d=dr.domain.com, where b=on enables disaster recovery for the domain) and a DNS A record that the page says Zscaler Client Connector uses to discover the Private Service Edges. [shared.zsdk.disaster-recovery:dns-records] Upon a successful upload of the DNS records to the cloud computing platforms, the ZSDK client attempts connections to the Private Service Edges enabled for disaster recovery. [shared.zsdk.disaster-recovery:client-behavior-after-upload] Which client the Client Connector wording means is open [gap:shared.zsdk.disaster-recovery:client-connector-wording]. The TXT record format shown in the prerequisites differs from the configuration example [gap:shared.zsdk.disaster-recovery:txt-record-format], and the meaning of its fields and of the settings is open [gap:shared.zsdk.disaster-recovery:settings-meaning].

What to check:
1. Whether end users run ZSDK version 2.0 or later, a separate DR domain exists, and the Private Service Edge IP addresses are in the DNS records.
2. Whether a firewall in front of the Private Service Edge allows outbound connections to the Public Service Edge IP addresses and inbound connections from App Connectors and Zscaler Client Connectors.

Not known (open gaps):
- Which client the Zscaler Client Connector wording in the disaster recovery steps refers to [gap:shared.zsdk.disaster-recovery:client-connector-wording]: settled by source-read or lab-test
- Whether the DR TXT record is b=off or b=on [gap:shared.zsdk.disaster-recovery:txt-record-format]: settled by source-read or support-ticket
- What the DR settings and TXT fields mean [gap:shared.zsdk.disaster-recovery:settings-meaning]: settled by source-read or support-ticket

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json
