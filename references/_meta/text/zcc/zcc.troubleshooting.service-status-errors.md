# Error messages in Client Connector's Service Status field and the action for each (zcc.troubleshooting.service-status-errors)
Also called: service status errors; connection status errors; zcc service status

Client Connector shows its error messages in the Service Status field; the vendor's table gives each message's explanation and the action users can take. [zcc.troubleshooting.service-status-errors:service-status-field]

**Authentication.** Intermediate Authentication Error (an intermediate proxy service intercepted the app's authentication request) and Authenticating... (the Public Service Edge for Internet & SaaS is waiting for user configuration) are tunnel authentication errors that need no action. [zcc.troubleshooting.service-status-errors:no-action-auth] Authentication Error is a tunnel authentication error, and Chaining Authentication Error one caused by proxy chaining. For both, users click Retry (next to the Status) for Internet Security or Authenticate for Private Access; if the error persists, More > Restart Service; if it continues, log out and log in again; then contact Zscaler Support. [zcc.troubleshooting.service-status-errors:auth-errors]

**Captive portal.** Captive Portal Detected means Client Connector is in a fail-open state because it detected a captive portal; the user clicks Open Browser (next to the Status) to reach the internet, and Retry if the portal is not resolved in time. Captive Portal Error means the user has not resolved the captive portal within the time configured in the Admin Console; the message disappears when the user reconnects, and the action is Retry and then resolving the portal. [zcc.troubleshooting.service-status-errors:captive-portal] The captive portal window and the open question on what happens when it ends are in [Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures](kb:zcc.forwarding-profiles.fail-open). Whether the setting named in the message is the captive portal minutes setting is not stated [gap:zcc.troubleshooting.service-status-errors:captive-portal-setting-name].

**Driver, firewall and fail states.** Driver Error means a Windows driver installation issue was detected and the tunnel interface cannot be started; the action is Repair App in the More window's Troubleshoot section. Endpoint FW/AV Error means a firewall or antivirus program on the device is blocking Client Connector traffic; the user contacts the administrator for configuration changes on the device. In both, Client Connector is in a fail-open state unless a fail-close app profile option is enabled. [zcc.troubleshooting.service-status-errors:driver-and-fw-av] Fail Close <reason> means Client Connector is in a fail-close state because the tunnel interface cannot be started (for example a driver error or an endpoint FW/AV error); the action is Retry, then More > Restart Service if the error persists. Fail Open means it is in a fail-open state because it detected Windows safe mode activation; the action is to restart Windows without safe mode. [zcc.troubleshooting.service-status-errors:fail-close-and-fail-open] The platform is stated only for Driver Error and Fail Open, and Fail Close gives only examples of its reason [gap:zcc.troubleshooting.service-status-errors:platform-and-reason].

**Connectivity.** Connection Error means the Public Service Edge for Internet & SaaS cannot be reached; Network Error that no network interface is detected; Internal Error that an internal socket problem was detected. For each, the action is Retry (next to the Status), then More > Restart Service if the error persists. For Connection Error, if the error continues, contact Zscaler Support. [zcc.troubleshooting.service-status-errors:connectivity]

**Digital Experience.** Installation Error means Client Connector experienced a network error while trying to connect to the Digital Experience (ZDX) server, and Server Error that it is unable to connect to the ZDX cloud (the action adds checking network connectivity). For both, the action is Retry, then More > Restart Service if the error persists. [zcc.troubleshooting.service-status-errors:zdx-errors]

**Safe mode and certificates.** Safe Mode means the Zscaler service is down and the user has access only to critical resources determined by the organization; no action is required, and the vendor points to Configuring Disaster Recovery. [zcc.troubleshooting.service-status-errors:safe-mode] Untrusted Root Cert means Client Connector is unable to validate the Private Service Edge for Private Access root certificate; the action is to contact Zscaler Support. [zcc.troubleshooting.service-status-errors:untrusted-root-cert]

Not known (open gaps):
- Which Admin Console setting is the time in the Captive Portal Error message [gap:zcc.troubleshooting.service-status-errors:captive-portal-setting-name]: settled by source-read or lab-test
- Which platforms show each Service Status message, and what reasons Fail Close names [gap:zcc.troubleshooting.service-status-errors:platform-and-reason]: settled by lab-test or support-ticket

Area: zcc.troubleshooting, its subjects in references/_meta/spine/zcc/zcc.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.troubleshooting.md (Troubleshooting Client Connector: from symptom to the subject that holds the answer)
- see-also references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)
- see-also references/_meta/text/zcc/zcc.support-options.restart-and-repair.md (Restart Service and Repair App for end users)
- see-also references/_meta/text/zcc/zcc.app-profiles.failover.md (App profile failover: disaster recovery, cloud unreachable, captive portals)
- see-also references/_meta/text/zcc/zcc.troubleshooting.registry-keys.md (Client Connector state in the Windows registry: ZNW_State, ZPA_State, ZWS_State and ZPA_AuthState values)
