# Isolation Debug Mode and the Network Latency window: what they do, capture and export (zbi.troubleshooting)
Also called: debug mode isolation; isolation debug zip; network latency window isolation; export isolation session logs; isolation HAR netlog

Debug Mode lets an end user troubleshoot whether an issue relates to the isolated session itself, without revealing confidential information. [zbi.troubleshooting:debug-purpose]

**Debug Mode.** Starting Debug Mode terminates the current isolation session and restarts it with debug mode active; only the selected tab enters debug mode, the other tabs of the session close with their information lost, and tabs opened afterwards are automatically in debug mode. [zbi.troubleshooting:debug-start] Debug mode deactivates by itself after a timeout of 10 minutes if not stopped manually; data is still captured if the isolation session ends during debug mode, and stopping with several tabs open captures data from all tabs. [zbi.troubleshooting:debug-stop-timeout] When debug mode ends a ZIP file named debug_DDMMYY: TimeinUTC, encrypted with a password set by the admin, is generated and downloaded; it holds console logs, HAR data, netlog data, network latency information and general Zscaler information. [zbi.troubleshooting:debug-zip] The General Information part of the debug ZIP includes the isolation profile name and ID, the Internet & SaaS or Private Access tenant ID, the isolation tenant ID, isolation region and cluster information, the isolation browser egress IP address, the Internet & SaaS PAC file, any modified PAC file, flow details and correlation IDs. [zbi.troubleshooting:debug-general-information] The ZIP password is set in the profile: [When Debug Mode is enabled in an isolation profile, the admin can set a password for the ZIP file created at the end of a debug troubleshoot and should share it with the user associated with the profile.](kb:zbi.isolation-profiles:debug-mode-zip-password). One ZIP field is not defined [gap:zbi.troubleshooting:ectx-field].

**Network Latency.** The Network Latency window shows live, real-time latency statistics for WebSocket and HTTP connectivity: last value, number of pings, max, 99%, 75%, 50Mean and standard deviation. [zbi.troubleshooting:network-latency-window] Export Logs in the Network Latency window saves the report to the device as a text file by default, which can be sent to Zscaler Support. [zbi.troubleshooting:network-latency-export]

What to check:
1. Whether Debug Mode was started, which terminates and restarts the session and closes the other tabs.
2. Whether the latency statistics were exported and sent to Zscaler Support.

Not known (open gaps):
- What the debug ZIP field Expected cooperative transmission count (ECTX) means [gap:zbi.troubleshooting:ectx-field]: settled by source-read. Blocks: interpreting the network latency data in a debug ZIP

Area: zbi.troubleshooting, its subjects in references/_meta/spine/zbi/zbi.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)
