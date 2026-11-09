# NSS and Cloud NSS alert feeds: levels, triggers, thresholds and the Cloud NSS alert format (shared.nss.alerts)
Also called: nss alerts; nss alert feed; cloud nss alerts; data lag alert; data loss alert; siem health alert; nss cpu alert; nss swap alert

A separate TCP NSS feed can carry alerts that monitor the Nanolog Streaming Service, at the level Critical, Warn, or both. The service sends the alerts in RFC 3164 The BSD syslog Protocol format to the specified IP address and port. [shared.nss.alerts:vm-alert-levels-format] The vendor names the format two ways [divergence:shared.nss.alerts:syslog-naming].

**What a VM alert feed raises.** The TCP alerts table lists the alerts that are sent for each level, in the columns Warning and Critical. Its Warning column has the connection to the SIEM, to the Zscaler Central Authority (CA) and to the Nanolog being down. Its Critical column has memory being low, disk space being low, and a poor connection between the NSS and the SIEM, where the NSS can drop some logs if connectivity doesn't improve, and its last cell also names high CPU utilization and high memory swap. [shared.nss.alerts:vm-alert-list] Which level the CPU and swap alerts are sent at is ambiguous [gap:shared.nss.alerts:alert-table-layout].

**Thresholds.** An alert is sent if the SIEM-to-NSS connection is down for 5 minutes, and then every 30 minutes. For the NSS to CA / Nanolog connection down, an alert is generated at 30 minutes and every 1 hour after. CPU utilization above 85% for 3 minutes sends a warning and above 95% for 1 minute a critical alert; swap memory utilization above 30% sends a warning and above 70% a critical alert. [shared.nss.alerts:vm-alert-thresholds]

**Feed shape.** Alert feeds are configured with Log Type Alert in both the TCP and the HTTP NSS feed articles, and the HTTP article lets the admin select the levels at which alerts are sent, Critical, Warn, or both, with multiple levels allowed. [shared.nss.alerts:vm-alert-feed-fields] The settings the alert feeds lack are open [gap:shared.nss.alerts:alert-feed-absent-settings].

**Cloud NSS.** A separate Cloud NSS feed can monitor Cloud NSS feeds for data lag, data loss and the connection to the SIEM. Data Lag alerts after 10 minutes of lag time and then every 30 minutes until resolved, Data Loss alerts every minute, and SIEM Health, for a connection timeout, certificate issue or request type issue such as POST or PUT not supported on the endpoint, alerts every 30 minutes. [shared.nss.alerts:cloud-alert-types] Cloud NSS sends alert log data in JSON format to the SIEM. The article's field table includes %d{alert_source}, which identifies the Cloud NSS node for Zscaler Support, %s{alert_title} with values Data Lag, Data Loss or SIEM Health, and %s{severity} with values Warning or Critical. [shared.nss.alerts:cloud-alert-format]

Sources disagree (name both sides):
- The syslog overview and the alerts article name the BSD syslog format differently. [divergence:shared.nss.alerts:syslog-naming]
  - zscaler-help: The syslog overview calls RFC 5424 the standard BSD syslog format.
  - zscaler-help: The alerts article calls RFC 3164 The BSD syslog Protocol and says alerts are sent in that format.
  Impact: Which RFC the VM alert feed follows is taken from the alerts article; the overview's naming cannot be read as saying alerts are RFC 5424.

Not known (open gaps):
- Which level the CPU and swap alerts belong to [gap:shared.nss.alerts:alert-table-layout]: settled by source-read or lab-test. Blocks: choosing Critical or Warn for an alert feed that should carry CPU and swap alerts
- Settings the alert feeds do not have [gap:shared.nss.alerts:alert-feed-absent-settings]: settled by source-read or lab-test

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json
