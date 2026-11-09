# What a device record's fields mean, and how the list and detail calls return them (zcc.devices.record-fields)
Also called: device details fields; getDeviceDetails; zcc device owner blank; machine hostname blank; last seen time zcc; device state integer or string; registrationState vs state; zdp vs zd fields; ziaHealth zpaHealth; device service status

The portal's Device Overview and Device Details pages, the device list call and the device details call show overlapping data under different names. Field names and types are in the API contract; this subject holds what the fields mean and where the sources disagree.

## Meanings

**Owner.** With Collect Device Owner Information enabled, the Owner field shows the locally logged-in user on Windows and macOS and the Client Connector username on Android and iOS; with it disabled, the field shows no owner information. [zcc.devices.record-fields:owner-collection] Collection is on by default: [With Collect Device Owner Information on, the default, the app collects the device owner name into the Admin Console database, shown as the Owner in the device fingerprint.](kb:zcc.web-privacy.collection:device-owner).

**Hostname.** The Machine Hostname field and the iOS 16 limit: [With Collect Machine Hostname Information on, the app collects the hostname of supported devices into the Admin Console database, where it shows as the device's Machine Hostname and is included in the device fingerprint CSV export; on iOS 16 and later the full hostname is no longer collected.](kb:zcc.web-privacy.collection:hostname). Whether turning collection off also changes Internet & SaaS and Private Access logs is open [gap:zcc.devices.record-fields:collection-log-effect].

**Policy and configuration.** A device's Policy Name is the Client Connector app profile assigned to it. [zcc.devices.record-fields:policy-name] Configuration Download Count is the number of times the app profile was updated on the device since enrollment, and Last Configuration Download Time is the last such update. [zcc.devices.record-fields:config-download] Whether the policy name can go stale after a rename is open [gap:zcc.devices.record-fields:policy-name-staleness].

**Times.** In the portal, Last Registration Time is the last time the user logged in to Client Connector on the device, and Last Deregistration Time the last time the user logged out. [zcc.devices.record-fields:registration-times] Last Seen with Client Connector Active is the last time Client Connector was active on the device; Last Seen Connected to ZIA is the last known connection to Internet & SaaS. [zcc.devices.record-fields:last-seen] The keepalive time and its interval: [Enrolled device states and what moves a device between them](kb:zcc.devices.lifecycle).

**Service status.** On the device details page, each service's Enabled flag says whether the user is entitled to it in Client Connector, its Health says whether Client Connector is connected to it (Active or Inactive), and Last Seen gives the last connection; the services listed are Internet & SaaS, Private Access, ZDX and Deception. [zcc.devices.record-fields:service-status] The device's posture trust level is in [A device's details page shows its Device Trust Level, Low, Medium, High or Unknown, based on the levels configured in Internet & SaaS posture profiles.](kb:zcc.device-posture:trust-level-shown).

## API shapes

**List and details use different keys.** The list call (`getDevices`) and the details call (`getDeviceDetails`) name the same data with different keys: `keepAliveTime` against `keep_alive_time`, `macAddress` against `mac_address`, `agentVersion` against `agent_version`, `policyName` against `devicePolicyName`, `deregistrationTimestamp` against `deregistration_time` and `user` against `user_name`. [zcc.devices.record-fields:list-and-detail-keys-differ]

**State and type encoding.** The sources disagree on how `state`, `type` and `vpnState` are typed [zcc.api.devices-wire:state-type-encoding](kb:zcc.api.devices-wire:state-type-encoding). One recorded tenant sends them as numbers; whether every tenant does, and the full value set, is open [gap:zcc.devices.record-fields:state-wire-type]. On that tenant `registrationState` carries a state name and `state` a number, and how the numbers map to states is only partly known [gap:zcc.devices.record-fields:registration-state-vs-state].

**Details is one object, or a list.** [zcc.api.devices-wire:details-response-shape](kb:zcc.api.devices-wire:details-response-shape) In legacy-client mode the Go details call fails or goes to the ZIA legacy client: [So for a direct SDK caller in legacy mode, these ZCC reads and deletes fail when only a ZCC legacy client is configured, and go to the ZIA legacy client when both are.](kb:zcc.sdk-go.legacy-routing:legacy-zcc-reads-fail-or-misroute).

**Fields only the Python model reads.** The Python `DeviceDetails` model reads keys that neither the details contract nor the Go struct has, among them `serialNumber`, the per-service `ziaEnabled`/`ziaHealth`/`zpaHealth`/`zdxHealth`, `zdEnabled`, `zdHealth`, `zdLastSeenTime`, `zdpEnabled`, `zdpHealth`, `zdpVersion`, `zdpLastSeenTime`, `deviceTrust`, `antiTamperingStatus`, `expectedZCCVersion`, `zccUpgradeStatus`, `deviceOtpArray` and `logFetchInfo`. [zcc.devices.record-fields:python-details-extra-keys] A recorded `getDeviceDetails` response carries keys that only the Python model reads, among them `serialNumber`, `ziaEnabled`, `deviceTrust` and `logFetchInfo`, and also `lastLocationSourceUsed`, which neither SDK models. [zcc.devices.record-fields:details-extra-keys-recorded] Whether every tenant returns those keys is open [gap:zcc.devices.record-fields:details-extra-keys-on-wire]. The Python details call camel-cases every response key before building `DeviceDetails`, but the model looks `internal_model` up in snake_case, so that attribute is always None; a recorded details response carries the key as `internal_model`, which the camel-casing renames before the model sees it. [zcc.devices.record-fields:python-internal-model-never-read] The Python details model reads `logFetchInfo` as an object with `logTs`, `logAckTs`, `error`, `logFetchPCAPEnabled`, `logFetchDBEnabled` and `logFetchFromNoOfDays`. [zcc.devices.record-fields:python-log-fetch-info] The portal's log fetch is in [Fetch Log Status moves from Waiting for KeepAlive to Extraction in progress to Completion, or Error while fetching logs; on completion the device details show a Log URL for the uploaded logs.](kb:zcc.logging.collection:fetch-status).

**Prefixes and mobile fields.** What the `zd` and `zdp` prefixes name is open [gap:zcc.devices.record-fields:zd-vs-zdp], and so is what `rooted` reports [gap:zcc.devices.record-fields:rooted-meaning]. The `zad` prefix is named by the password contract: [The `managePass` contract describes `zadDisablePass` as the password to disable Zscaler Active Defense (ZAD) and `zdpDisablePass` as the password to disable Zscaler Deception.](kb:zcc.passwords-and-otp.password-api:zad-zdp-names).

What to check:
1. Whether a blank owner or hostname is the User Privacy collection setting being off, or iOS 16 and later, before treating it as a missing record.
2. Which key the call you are reading uses, since the list and details calls name the same data differently.
3. Whether `state` arrived as a number or a string before comparing it, and whether a Go details call failed on decoding rather than on the API.
4. Whether the device is connected to a service (Health) or only entitled to it (Enabled).

Not known (open gaps):
- Whether the list and details calls send `state` and `type` as numbers or strings [gap:zcc.devices.record-fields:state-wire-type]: settled by tenant-data or lab-test. Blocks: decoding and comparing device state across calls, and trusting the Go SDK on either call
- How `registrationState` differs from `state` on the device list [gap:zcc.devices.record-fields:registration-state-vs-state]: settled by tenant-data. Blocks: filtering the device list by portal state through the API
- Whether the details call returns the keys only the Python model reads [gap:zcc.devices.record-fields:details-extra-keys-on-wire]: settled by tenant-data. Blocks: API-based audits of service health, trust level or upgrade status per device
- Which services the `zd` and `zdp` device-detail prefixes name [gap:zcc.devices.record-fields:zd-vs-zdp]: settled by tenant-data or support-ticket. Blocks: reading the per-service health fields for Deception and Endpoint DLP
- What the details field `rooted` reports [gap:zcc.devices.record-fields:rooted-meaning]: settled by tenant-data. Blocks: API audits of jailbroken or rooted devices
- Whether a device's policy name updates when the app profile is renamed [gap:zcc.devices.record-fields:policy-name-staleness]: settled by lab-test. Blocks: joining devices to app profiles by name
- Whether disabling owner or hostname collection changes service logs [gap:zcc.devices.record-fields:collection-log-effect]: settled by lab-test or support-ticket. Blocks: privacy reviews and log correlation that depend on hostname or owner in service logs

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.devices-wire.md (ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords)
- links-to references/_meta/text/zcc/zcc.web-privacy.collection.md (What each User Privacy setting collects or allows)
- links-to references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles)
- links-to references/_meta/text/zcc/zcc.devices.lifecycle.md (Enrolled device states and what moves a device between them)
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.password-api.md (Reading and setting app profile passwords through the API)
- links-to references/_meta/text/zcc/zcc.sdk-go.legacy-routing.md (ZCC SDK calls in legacy-client mode routed to the ZIA client)
