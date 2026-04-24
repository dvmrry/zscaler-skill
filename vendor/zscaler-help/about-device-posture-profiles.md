# About Device Posture Profiles

**Source:** https://help.zscaler.com/zscaler-client-connector/about-device-posture-profiles
**Captured:** 2026-04-24 via Playwright MCP.

---

The **Device Posture profile** is a set of criteria evaluated on devices. You can configure policies in both Internet & SaaS and Private Access based on the outcome of this evaluation. For example, if you specify a file path in a device posture profile, the user has access to the application only if the user's system has the specified file.

## Benefits

- Determine access to corporate resources and public applications based on device posture.
- Ensure a minimum security level is present on the device before allowing access.

Posture profiles are defined in the **Device Posture** section. They must be configured in the Zscaler Admin Console. They are consumed by:

- Private Access **Access Policies**.
- Internet & SaaS **Posture Profile Trust Levels**.

Each posture profile has its own set of criteria. See *Configuring Device Posture Profiles* for each posture type.

## Device Posture Evaluation

Zscaler Client Connector evaluates device posture profiles **every 15 minutes** by default. **New connections** are established based on updated security postures. **Existing connections are not affected** by updates to security postures.

For Zscaler Client Connector version 4.4+ for Windows, you can configure evaluation frequency.

### Events that trigger a posture evaluation

- The Zscaler service restarts.
- A device **reboots**.
- A device **joins a network**.
- A device **comes out of hibernation**.
- A device **moves from non-domain-joined to domain-joined**.
- A device **moves from Wi-Fi to Ethernet**.
- A device **changes Wi-Fi networks**.

## Device Posture page (Policies > Common Configuration > Resources > Device Posture)

- Add a device posture profile.
- Search profiles.
- View a list of all configured profiles.
- Create a custom view.
- Edit a profile.
- Delete a profile.
