# About Device Posture Profiles

**Source:** https://help.zscaler.com/zscaler-client-connector/about-device-posture-profiles
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Device Posture Profiles 
About Device Posture Profiles
Client Connector
About Device Posture Profiles
Ask Zscaler

Watch a video on Device Posture Profiles.

The Device Posture profile is a set of criteria evaluated on devices. You can configure policies in both Internet & SaaS and Private Access based on the outcome of this evaluation. For example, if you specify a file path in a device posture profile, the user has access to the application if the user's system has the file specified in the posture profile.

Device posture profiles provide the following benefits and allow you to:

Determine access to corporate resources and public applications based on the device posture you set.
Ensure a minimum security level is present on the device before allowing access.

You can define posture profiles in the Device Posture section. You must configure these device posture profiles in the Zscaler Admin Console. You can use posture profiles when configuring access policies and when adding posture profile trust levels for Internet & SaaS.

Each posture profile has its own set criteria. To learn more about each posture type, see Configuring Device Posture Profiles.

Device Posture Evaluation

Zscaler Client Connector evaluates device posture profiles every 15 minutes. New connections are established based on updated security postures. Existing connections are not affected by updates to security postures.

For Zscaler Client Connector version 4.4 and later for Windows, you can configure how often Zscaler Client Connector evaluates the device posture profile. To learn more, see Configuring Device Posture Profiles.

The following network changes can trigger a device posture evaluation:

The Zscaler service restarts
A device:
Reboots
Joins a network
Comes out of hibernation
Moves from non-domain joined to domain-joined
Moves from a Wi-Fi connection to an Ethernet connection
Changes Wi-Fi networks
About the Device Posture Page

On the Device Posture page (Policies > Common Configuration > Resources > Device Posture), you can do the following:

Add a device posture profile.
Search for a device posture profile.
View a list of all configured device posture profiles.
Create a custom view of the Device Posture page.
Edit a device posture profile.
Delete a device posture profile.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Device Posture Profiles
Configuring Device Posture Profiles
Configuring the Client Certificate Posture Check for Linux
Searching for a Device Posture Profile
About Internet & SaaS Posture Profiles
Adding Internet & SaaS Posture Profiles
Searching for an Internet & SaaS Posture Profile
