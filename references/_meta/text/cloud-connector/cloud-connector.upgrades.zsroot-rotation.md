# Rotating the zsroot password on Cloud and Branch Connectors (cloud-connector.upgrades.zsroot-rotation)
Also called: zsroot; zsroot password; cloud connector service account; branch connector ssh 169.254.2.2; cloud connector password rotation; passwd zsroot; zsroot rotation; zsroot credential rotation

Every Cloud and Branch Connector device has a local privileged account whose password the admin rotates by hand on each device. It is a different credential from Admin Console users.

**The account.** Cloud & Branch Connector virtual devices contain a Zscaler Service Account called zsroot, a privileged user for administrative access and management of the device, and Zscaler strongly recommends routine rotation of its password. [cloud-connector.upgrades.zsroot-rotation:zsroot-account] Cloud Connectors are typically accessed with the SSH key the cloud provider supplies when the connector is created; the zsroot password is not required to log in, but Zscaler recommends changing it periodically. [cloud-connector.upgrades.zsroot-rotation:cc-ssh-key] Whether it has any role beyond device administration is open [gap:cloud-connector.upgrades.zsroot-rotation:zsroot-scope]. Zero Trust SD-WAN devices carry an account of the same name: [Hardware Zero Trust SD-WAN devices also contain the zsroot service account, a privileged user; on these devices the password is changed by logging in through the console or management interface as zsroot and running passwd zsroot.](kb:cloud-connector.sdwan.device-modes:zsroot).

**Procedure.** On a Cloud Connector the admin logs in to the VM as zsroot, runs `passwd zsroot`, and enters the current and then the new password at the prompts. [cloud-connector.upgrades.zsroot-rotation:cc-procedure] On a virtual Branch Connector the admin logs in through the console or management interface as zsroot, runs `ssh zsroot@169.254.2.2` and then `passwd zsroot`, and follows the same prompts. [cloud-connector.upgrades.zsroot-rotation:bc-procedure]

**No fleet-wide rotation.** zsroot is rotated per device: the documented procedure is an interactive passwd on each connector, and the Cloud & Branch Connector API offers no operation for device account passwords. [cloud-connector.upgrades.zsroot-rotation:no-rotation-api] Admin Console users are a different credential with an API path: The Python SDK's `change_password` changes the password of a specified admin user with a POST to `/passwordChange`. [cloud-connector.upgrades.zsroot-rotation:console-admin-password]

**Open points.** What a redeployment does to the password, and what a new connector's password is, is open [gap:cloud-connector.upgrades.zsroot-rotation:redeploy-password-state]. Failure modes during a rotation are open [gap:cloud-connector.upgrades.zsroot-rotation:rotation-failure-modes].

What to check:
1. Whether the device is a Cloud Connector (log in with the cloud SSH key as zsroot) or a virtual Branch Connector (console, then SSH to 169.254.2.2), before running passwd.
2. Whether connectors were redeployed since the last rotation, which may have changed the password state.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.upgrades.zsroot-rotation:no-rotation-api] Tier B: Rests on a search: the captured Cloud & Branch Connector OpenAPI document does not mention zsroot, and its only password path is the admin user's password change. Absence from the captures is not proof that no such operation exists.

Not known (open gaps):
- What a redeployment does to the zsroot password, and what a new connector's password is [gap:cloud-connector.upgrades.zsroot-rotation:redeploy-password-state]: settled by source-read or lab-test. Blocks: keeping a rotation record valid across OS-image redeployments
- Failure modes of a zsroot rotation [gap:cloud-connector.upgrades.zsroot-rotation:rotation-failure-modes]: settled by lab-test or support-ticket. Blocks: recovering a connector after an interrupted or failed rotation
- What zsroot is not used for [gap:cloud-connector.upgrades.zsroot-rotation:zsroot-scope]: settled by source-read. Blocks: judging what a zsroot password change can affect besides device login

Area: cloud-connector.upgrades, its subjects in references/_meta/spine/cloud-connector/cloud-connector.upgrades.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/cloud-connector/cloud-connector.logs.event-records.md (Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades), from cloud-connector.upgrades: UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]
- scoped-by references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling), from cloud-connector.upgrades: On the Cloud Connector Groups overview, selected groups or connectors can be given an upgrade schedule (a day and time for periodic software updates) or a new release channel, and each group shows its Upgrade Window. [cloud-connector.upgrades:group-actions]
- logged-in references/_meta/text/types/ztw/event-log.md (Cloud & Branch Connector Event log (NSS feed)), from cloud-connector.upgrades: UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]
- links-to references/_meta/text/cloud-connector/cloud-connector.sdwan.device-modes.md (Zero Trust SD-WAN devices: gateway and one-arm modes, zero touch provisioning)
