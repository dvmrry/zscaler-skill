# Scan setup and results: the AD posture scan, AD Privileged Account Tracking and the endpoint credential exposure scan (identity-protection.posture-scans)
Also called: ad privileged account tracking; endpoint credential exposure scan configuration; ad scan configuration

When setting up an AD domain scan, the domain drop-down lists only domains where the endpoint agent is installed and the agent drop-down lists only active agents of that domain; the scan frequency choices are Daily, Weekly, Monthly or Quarterly. [identity-protection.posture-scans:ad-scan-setup-inputs] An AD domain scan runs only at the scheduled time in the browser's time zone; it might be delayed by up to 10 minutes if the agent is available, and if the agent does not connect within an hour of the scheduled time the domain is not scanned until the next selected time period. [identity-protection.posture-scans:ad-scan-time-window]

## Active Directory posture scan

**Page and statuses.** On the Active Directory Posture page, an endpoint agent that has not checked in for more than 7 days is removed from the scan and its Current State is set to Error. [identity-protection.posture-scans:ad-agent-stale-removed] The Active Directory Posture page's Current State column uses the statuses Active (scan enabled), Disabled (scan disabled), Waiting (waiting to connect to the endpoint agent so it can start the AD scan), Scanning (scan in progress) and Error (the endpoint agent is uninstalled or deleted). [identity-protection.posture-scans:ad-current-state-values] What Error means differs between the two [divergence:identity-protection.posture-scans:ad-error-state-meaning]. The Active Directory Posture page's Last Scan Status is one of Scan Completed, Processing scan data, Unable to connect to the domain, Scan Timed Out, Scan Canceled or Scan Failed. [identity-protection.posture-scans:ad-last-scan-status-values]

**Setup and timeouts.** The Logon Server field in an AD domain's Scan Agents Details window specifies the domain controller or LDAP server to use for scanning. [identity-protection.posture-scans:ad-logon-server] The AD scan timeout defaults to 30 minutes and the LDAP connection timeout to 5 minutes, both set in minutes per domain; Zscaler recommends keeping the defaults. [identity-protection.posture-scans:ad-scan-and-ldap-timeouts] ITDR collects AD user and computer attributes through the Windows endpoint agent assigned to the scan; attribute collection is enabled by default once the domain is configured, can be toggled off, and has a Weekly or Monthly scan frequency. [identity-protection.posture-scans:ad-attribute-collection] Which defaults the pages leave out is open [gap:identity-protection.posture-scans:ad-defaults-not-stated].

**Failed checks.** For a scanned AD domain whose Last Scan Status is Scan Completed but with failed checks, the fractional number (for example 18/31) opens a Failed Scans window listing each failed check's Name, Type and Reason; 18/31 means 18 of 31 scan checks failed. [identity-protection.posture-scans:ad-failed-scan-checks] The values the Type and Reason columns can take are open [gap:identity-protection.posture-scans:failed-scan-values].

**Stopping and deleting.** Stopping an AD scan (for example to update ITDR software or change ITDR or AD configuration) also halts scheduled scans: until the scan is started again no further scans run, even at the scheduled frequencies. [identity-protection.posture-scans:ad-stop-scan] Deleting an AD scan deletes all identity vulnerability results for that AD domain on the Active Directory Posture dashboard. [identity-protection.posture-scans:ad-delete-scan-results]

## AD Privileged Account Tracking

The AD Privileged Account Tracking page counts default privileged accounts, admin-added accounts and their total, can be filtered by AD domain, and its Object ID shows the UPN for a user or the distinguished name for a group. [identity-protection.posture-scans:pat-page-fields] The AD Privileged Account Tracking page shows a machine-learning Training Status per tracked account: Not Trained, Data Gathering or Evolving; the Last Successful Training Date appears only for Evolving. [identity-protection.posture-scans:pat-training-status]

At most 200 user accounts can be added for tracking per AD domain; adding requires the Session Tracking setting enabled on the server agent and a user or group found in the AD domain, and when all users are fetched from a group the group name is replaced by the users in it. [identity-protection.posture-scans:pat-add-limits] A user is added for tracking by its UPN as it appears in the AD domain and a group by its full distinguished name; the account or group cannot be tracked if the value is not found. [identity-protection.posture-scans:pat-identifiers]

## Endpoint credential exposure scan

**Module.** The Endpoint Credential Exposure module is installed automatically after an ITDR license is purchased; the installer is always present on endpoints but the module stays dormant until a credential exposure scan is initiated. [identity-protection.posture-scans:cred-module-install] The module installs to C:\Program Files\Zscaler\Identity Protection with ZSIdentityProtection.exe as the primary program file, and the installer path is C:\Program Files\Common Files\Landmine\ZSIdentityProtectionInstaller.exe. [identity-protection.posture-scans:cred-install-paths]

**Configuration.** A credential exposure configuration takes a name, a scan frequency (Daily, Weekly, Monthly or Quarterly) and a scan time entered in UTC. [identity-protection.posture-scans:cred-config-fields] Password Analysis in a credential exposure scan is enabled by default; when enabled, passwords are hashed with a custom salt locally on the endpoint and collected on the tenant, and when disabled passwords are neither processed nor collected. [identity-protection.posture-scans:cred-password-analysis] All exposure or scan types are enabled by default in a credential exposure scan, and after saving only the enabled types run on the endpoints. [identity-protection.posture-scans:cred-scan-types-default] Which scan types can be toggled is open [gap:identity-protection.posture-scans:cred-scan-types-list].

**Endpoint selection.** A newly created credential exposure scan defaults to the Catch All selection criterion, which applies the policy to all endpoint agents. [identity-protection.posture-scans:cred-selection-criterion-default] Credential exposure endpoint selection offers Catch All, User, Group, Hostname (Specific), Hostname (RegEx), DNS Hostname (Specific), DNS Hostname (RegEx), User OU (RegEx) and Computer OU (RegEx), each matching as the vendor describes. [identity-protection.posture-scans:cred-selection-criterion-types]

**Running and statuses.** The Endpoint Credential Exposure page's scan Info status is Completed, Partially Completed (only some modules scanned because of errors in others), Failed, Not Started (queued in the ITDR Admin Portal) or Processing. [identity-protection.posture-scans:cred-scan-status-values] An on-demand credential exposure scan can be triggered when new endpoint agents are installed or to view a report immediately, in addition to the scheduled scan. [identity-protection.posture-scans:cred-on-demand-scan] Stopping a credential exposure scan lets scans already in progress complete but no new scheduled scans run until the scan is started again. [identity-protection.posture-scans:cred-stop-scan] Deleting a credential exposure scan deletes all identity vulnerability results for that credential exposure on the Endpoint Credential Exposure dashboard. [identity-protection.posture-scans:cred-delete-scan-results]

## Related subjects

[Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview) [Active Directory posture in Identity Protection: dashboard, issues, roadmap, reports, remediation, privileged account tracking and password analysis](kb:identity-protection.ad-posture) [Endpoint Credential Exposure in Identity Protection: dashboard, scan types, cleanup and reports](kb:identity-protection.credential-exposure) [How an Entra ID tenant is connected to ITDR: deployment script, permissions, certificates and scan setup](kb:identity-protection.entra-connection) [How ITDR threat detection policies, custom change detection policies and email notifications are configured](kb:identity-protection.detection-policies) [How the AD and Entra ID issue, object and change detection safelists work](kb:identity-protection.safelists)

What to check:
1. Which scan a quoted interval belongs to: the AD domain scan frequency of Daily, Weekly, Monthly or Quarterly, or the AD change detection scan that runs every 15 minutes.
2. Which meaning of Error the Active Directory Posture page gives before stating why a domain shows Error.

Sources disagree (name both sides):
- The Active Directory Posture page gives two meanings for the Error Current State. [divergence:identity-protection.posture-scans:ad-error-state-meaning]
  - zscaler-help: Error is set when an endpoint agent has not checked in for more than 7 days.
  - zscaler-help: Error means the endpoint agent is uninstalled or deleted.
  Impact: The page does not say whether the 7-day no-check-in case and the uninstalled or deleted case are the same condition, so the cause of an Error state is not settled by either statement.

Not known (open gaps):
- Defaults the AD scan articles do not state [gap:identity-protection.posture-scans:ad-defaults-not-stated]: settled by source-read or lab-test
- Which Type and Reason values the Failed Scans window shows [gap:identity-protection.posture-scans:failed-scan-values]: settled by source-read or lab-test
- Which exposure or scan types a credential exposure scan can toggle [gap:identity-protection.posture-scans:cred-scan-types-list]: settled by source-read or lab-test

Area: identity-protection.posture-scans, its subjects in references/_meta/spine/identity-protection/identity-protection.posture-scans.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/identity-protection/identity-protection.ad-posture.md (Active Directory posture in Identity Protection: dashboard, issues, roadmap, reports, remediation, privileged account tracking and password analysis)
- links-to references/_meta/text/identity-protection/identity-protection.credential-exposure.md (Endpoint Credential Exposure in Identity Protection: dashboard, scan types, cleanup and reports)
- links-to references/_meta/text/identity-protection/identity-protection.detection-policies.md (How ITDR threat detection policies, custom change detection policies and email notifications are configured)
- links-to references/_meta/text/identity-protection/identity-protection.entra-connection.md (How an Entra ID tenant is connected to ITDR: deployment script, permissions, certificates and scan setup)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.safelists.md (How the AD and Entra ID issue, object and change detection safelists work)
