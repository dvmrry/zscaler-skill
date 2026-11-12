# Client Connector log modes as users and the API see them: Verbose, user choice, logMode and logLevel (zcc.logging.log-modes)
Also called: zcc log mode; zcc log level; logLevel vs logMode; zcc debug logging; zcc verbose logging; change log mode in zcc
Former IDs: log-21, zcc-56, zcc-57

What each of Error, Warn, Info and Debug records, the per-profile override of the global default, and the log file size are in [App profile log mode and log file size](kb:zcc.app-profiles.logging). A fifth mode, Verbose, logs when invoked by external events such as a Firebase push notification or Mobile Manager flags, and exists only in Client Connector 1.5 and later for Android. [zcc.logging.log-modes:verbose-android]

**Who chooses.** When logging controls are visible, users change the log mode in the app's More window, among the modes the app profile makes available. [zcc.logging.log-modes:user-choice] A log mode a user changes in the Troubleshoot section is effective for that connection session only; at the start of the next connection session the app returns to the default log mode set by the organization. The Windows sections of the Classic UI and Modern UI pages both say this. [zcc.logging.log-modes:session-only] The Android app profile's Verbose Logging option lets users enable extra debugging logs. [zcc.logging.log-modes:android-verbose-logging] By name, the Android block of the web policy carries Verbose Logging as `androidPolicy.enableVerboseLog`, a string the contract gives no description. [zcc.logging.log-modes:android-verbose-api] Whether that option is the Verbose mode is open [gap:zcc.logging.log-modes:verbose-option-vs-mode]. When a device picks up a changed profile is in [When an app profile change reaches a device](kb:zcc.app-profiles.propagation).

**In the API.** `logMode` in the API is the console's Log Mode: the API reference describes it as the scope of the logs, the console's own words for that setting. `logLevel`, which the API reference describes as a three-step severity (Low 0, Normal 1, High 2), has no counterpart in the captured console articles; `logFileSize` is the maximum log file size. [zcc.logging.log-modes:log-mode-is-console-mode] The Python SDK's docstring gives example `log_mode` codes: -1 disabled, 0 info, 3 debug. [zcc.logging.log-modes:python-log-mode-codes] The full coding is not documented, and vendor code disagrees on what -1 means [gap:zcc.logging.log-modes:log-mode-codes]; the SDKs' readings are compared in [zcc.api.web-policy-wire:log-mode-minus-one](kb:zcc.api.web-policy-wire:log-mode-minus-one). What `logLevel` changes on the device, and how it differs from `logMode`, is open [gap:zcc.logging.log-modes:level-vs-mode]. How the Go SDK writes these fields is in [The Go SDK's model says every web policy write requires integer settings such as `ruleOrder`, `logMode` and `logLevel` as JSON numbers, while the GET response quotes some of them as strings; the SDK writes numbers and reads either form.](kb:zcc.api.web-policy-wire:numbers-on-write).

**Default.** The value of the tenant's global default log mode is not sourced [gap:zcc.logging.log-modes:default-mode].

What to check:
1. Before reproducing an issue for support, set the user's app profile to Debug and confirm the device has downloaded the profile since.
2. Whether the user could have changed the mode themselves, which needs visible logging controls.
3. When writing `logMode` through the API, read the profile first and reuse a known value, since the full integer coding is undocumented.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.logging.log-modes:android-verbose-api] Tier B: Name correspondence only; no source maps enableVerboseLog to the console option or documents its values.
- [zcc.logging.log-modes:log-mode-is-console-mode] Tier B: Rests on matching descriptions: the console introduces Log Mode "to specify the scope of the logs" and the API reference describes logMode as "the scope of the logs". No source maps logLevel to a console setting.

Not known (open gaps):
- Whether Android's Verbose Logging option is the Verbose log mode [gap:zcc.logging.log-modes:verbose-option-vs-mode]: settled by lab-test or source-read
- Full integer coding of logMode [gap:zcc.logging.log-modes:log-mode-codes]: settled by tenant-data or lab-test. Blocks: writing a log mode through the API
- The tenant's global default log mode [gap:zcc.logging.log-modes:default-mode] (data gap): filled by operator
- How logLevel differs from logMode [gap:zcc.logging.log-modes:level-vs-mode]: settled by tenant-data or source-read. Blocks: reading a profile's verbosity from its API record

Area: zcc.logging, its subjects in references/_meta/spine/zcc/zcc.logging.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.app-profiles.logging.md (App profile log mode and log file size): `logMode` in the API is the console's Log Mode: the API reference describes it as the scope of the logs, the console's own words for that setting. `logLevel`, which the API reference describes as a three-step severity (Low 0, Normal 1, High 2), has no counterpart in the captured console articles; `logFileSize` is the maximum log file size. [zcc.logging.log-modes:log-mode-is-console-mode]
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.app-profiles.propagation.md (When an app profile change reaches a device)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.logging.md (Client Connector logs: verbosity, user access and collection)
- see-also references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
