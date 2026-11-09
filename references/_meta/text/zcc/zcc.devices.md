# ZCC enrolled devices (zcc.devices)
Also called: zcc devices; enrolled devices; device inventory; is this endpoint enrolled; when did the device last check in; device overview

"Is this endpoint enrolled, and what is it doing?" takes four questions in order. Removing a device is a separate path with its own timing.

1. **Is the device in the list at all?** The list is paged and each SDK reads it differently: [Listing enrolled devices: page size and how each SDK pages](kb:zcc.devices.listing).
2. **What state is it in?** States, the 16-device limit and the keepalive that moves a device between states: [Enrolled device states and what moves a device between them](kb:zcc.devices.lifecycle).
3. **What do its fields say?** Owner, hostname, times and service health, and where the list and details calls disagree: [What a device record's fields mean, and how the list and detail calls return them](kb:zcc.devices.record-fields).
4. **Was it removed automatically?** The device threshold, inactive removal and permanent deletion: [Automated device cleanup: device threshold, inactive removal, permanent deletion](kb:zcc.devices.cleanup).

Removing devices and machine tunnels through the API: [Removing devices and machine tunnels through the API and SDKs](kb:zcc.devices.removal-api). CSV exports, including why users disabled a service: [Device CSV exports: inventory, service status and disable reasons](kb:zcc.devices.exports). One-time passwords for a device: [One-time passwords for an enrolled device](kb:zcc.passwords-and-otp.otp). Admin log fetch from a device: [Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures](kb:zcc.logging.collection). Partner devices, a separate list: [Partner devices: the Partner Devices list, its filters, search, exports, the 24-hour removal of unregistered devices and the device details](kb:zcc.devices.partner-devices). Fleet-level counts and widgets: [The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs](kb:zcc.devices.dashboard).

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.devices.cleanup.md (Automated device cleanup: device threshold, inactive removal, permanent deletion)
- links-to references/_meta/text/zcc/zcc.devices.dashboard.md (The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs)
- links-to references/_meta/text/zcc/zcc.devices.exports.md (Device CSV exports: inventory, service status and disable reasons)
- links-to references/_meta/text/zcc/zcc.devices.lifecycle.md (Enrolled device states and what moves a device between them)
- links-to references/_meta/text/zcc/zcc.devices.listing.md (Listing enrolled devices: page size and how each SDK pages)
- links-to references/_meta/text/zcc/zcc.devices.partner-devices.md (Partner devices: the Partner Devices list, its filters, search, exports, the 24-hour removal of unregistered devices and the device details)
- links-to references/_meta/text/zcc/zcc.devices.record-fields.md (What a device record's fields mean, and how the list and detail calls return them)
- links-to references/_meta/text/zcc/zcc.devices.removal-api.md (Removing devices and machine tunnels through the API and SDKs)
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.otp.md (One-time passwords for an enrolled device)
