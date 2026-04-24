# Migrating from Z-Tunnel 1.0 to Z-Tunnel 2.0

**Source:** https://help.zscaler.com/zscaler-client-connector/migrating-z-tunnel-1.0-z-tunnel-2.0
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zscaler Client Connector Help 
Forwarding Traffic Management 
Migrating from Z-Tunnel 1.0 to Z-Tunnel 2.0
Client Connector
Migrating from Z-Tunnel 1.0 to Z-Tunnel 2.0
Ask Zscaler

Complete the following phases to ensure a successful migration from Zscaler Tunnel (Z-Tunnel) 1.0 to Z‑Tunnel 2.0 for your organization.

You must have a supported version of Zscaler Client Connector to use Z-Tunnel 2.0.

Phase 1: Identify group of users and configure Z‑Tunnel 2.0 settings

For initial testing, begin by identifying a group of users and configuring Zscaler Tunnel (Z-Tunnel) 2.0 settings.

Step 1: Create a Group

In the Zscaler Admin Console, identify and create a small group of users for testing Z-Tunnel 2.0. Groups you configure in User Management in Internet & SaaS are automatically available for selection in the Advanced Settings tab of Directory Sync & Custom Root Cert in Client Connector. You can also manually sync the groups between Internet & SaaS and Client Connector. To learn more, see Syncing Directory Groups in the Zscaler Admin Console.

Close
Step 2: Create a Forwarding Profile Policy

To prevent confusion, Zscaler recommends creating a new forwarding profile for your Z-Tunnel 2.0 test. The forwarding profile policy determines what traffic Zscaler Client Connector captures from users’ devices. You enable the forwarding mechanism for Z-Tunnel 2.0 in this policy.

To enable Z-Tunnel 2.0, you must configure the following settings in the forwarding profile:

Tunnel Driver Type: Select Packet Filter-Based.
On-Trusted Network: Select Tunnel.
Tunnel version selection: Select Z-Tunnel 2.0.
VPN-Trusted Network and Off-Trusted Network: Select Same as "On-Trusted Network".

For testing purposes, Zscaler recommends that you don’t configure the VPN-Trusted Network and Off-Trusted Network forwarding profile actions. After initial testing, you can change the behavior for all network environments.

For all other settings, keep the default. To learn more, see Configuring Forwarding Profiles for Zscaler Client Connector.

Don’t route Z-Tunnel 2.0 traffic through GRE tunnels. For on-premises environments with existing GRE infrastructure, implement one of the following options to prevent performance issues:

Configure the Zscaler Client Connector forwarding profile to fall back to Z-Tunnel 1.0 when Trusted Network Criteria are met.
Configure a policy-based route to exclude Z-Tunnel 2.0 traffic from the GRE tunnel.
Close
Step 3: Create an App Profile Policy

Create a new app profile policy and associate your test users and the Z-Tunnel 2.0 forwarding profile to it.

To configure Z-Tunnel 2.0, you must configure the following in the app profile:

Under General, select the following:
Rule Order: Select 1 to ensure that your users receive this app profile before other profiles.
Status: Select Enabled.
Forwarding Profile: Select the forwarding profile you created for testing from the drop-down menu.
Enable Install Zscaler SSL Certificate.
Under Groups, select your test users group from the User Groups drop-down menu.
Under Traffic Steering, on the PAC and Proxy tab, leave the Custom PAC URL field empty.
Under Passwords, leave the Logout Password and Disable Password ZIA fields empty.

For all other settings, keep the default. To learn more, see Configuring Zscaler Client Connector App Profiles.

Close
Step 4: Assign a Supported Zscaler Client Connector Version to the Group

You can configure a Zscaler Client Connector Store app update to assign a supported Zscaler Client Connector version to your test users. To learn more, see Configuring an App Update in the Zscaler Client Connector App Store.

Close

Close
Phase 2: Add VPN gateway bypasses to the Z‑Tunnel 2.0 app profile

Add the VPN gateway bypasses from the VPN Gateway Bypass field in your original app profile to the Z‑Tunnel 2.0 app profile you created. Leave all other settings as default.

Close
Phase 3: Add the network address and range bypasses to the Z‑Tunnel 2.0 app profile

Add your network address and range bypasses to the Z‑Tunnel 2.0 app profile:

Gather all the network address and range bypasses in the original app profile PAC file.
In the Z‑Tunnel 2.0 app profile, add the bypasses to the Destination Exclusions list.
Close
Phase 4: Add the URL and domain-based bypasses Z‑Tunnel 2.0 PAC files

Add the URL and domain-based bypasses from your original app profile PAC file to your Z‑Tunnel 2.0 configured forwarding and app profile PAC files.

To add the URL and domain-based bypasses:

Gather the URL and domain-based bypasses from your original app profile PAC file.

Create a new forwarding profile PAC file to route these destinations to the Z‑Tunnel 2.0 bypass gateway. Use the following Z‑Tunnel 2.0 bypass return statement for your domains.

function FindProxyForURL(url, host) {
                                                                                    /* Updates are directly accessible */
                                                                                    if (dnsDomainIs(host, "<domain>"))
                                                                                    return "PROXY ${ZAPP_TUNNEL2_BYPASS}";
                                                                                    /* Default Traffic Forwarding. Return DIRECT to tunnel using Tunnel2 */
                                                                                    return "DIRECT";
                                                                                    }                                 

For <domain>, enter the URL and domain-based bypasses.

Add the new PAC file to the forwarding profile that you created for Z‑Tunnel 2.0. To learn more, see Configuring Forwarding Profiles for Zscaler Client Connector.

Create a new app profile PAC file to send these bypasses directly. Use the following Z‑Tunnel 2.0 return statement for your domains.

function FindProxyForURL(url, host) {
                                                                                    var privateIP = /^(0|10|127|192\.168|172\.1[6789]|172\.2[0-9]|172\.3[01]|169\.254|192\.88\.99)\.[0-9.]+$/;
                                                                                    var resolved_ip = dnsResolve(host);
                                                                                    /* Updates are directly accessible */
                                                                                    if (dnsDomainIs(host, "<domain>"))
                                                                                    return "DIRECT";
                                                                                    /* Default Traffic Forwarding */
                                                                                    return "PROXY ${GATEWAY}:443";
                                                                                    }

For <domain>, enter the URL and domain-based bypasses.

Close
Phase 5: Test the Z‑Tunnel 2.0 configuration

Test your Z‑Tunnel 2.0 configuration to ensure that general user experience is unaffected by these changes:

Identify the top business applications that your organization uses.
Test access to these applications with the test user group.
Get user feedback on any issues they experience.
Close
Phase 6: Roll out Zscaler Client Connector a supported version of Zscaler Client Connector and Z‑Tunnel 2.0

Roll out a supported version of Zscaler Client Connector and Z‑Tunnel 2.0 to the rest of your employees in batches of 100–200 users. Each time you roll out Zscaler Client Connector and Z‑Tunnel 2.0 to a group, you must ensure that your business applications are unaffected.

Close
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Forwarding Profiles
Configuring Forwarding Profiles for Zscaler Client Connector
Searching for a Forwarding Profile
About Trusted Networks
Configuring Trusted Networks for Zscaler Client Connector
Searching for a Trusted Network
About Z-Tunnel 1.0 & Z-Tunnel 2.0
Best Practices for Deploying Z-Tunnel 2.0
Migrating from Z-Tunnel 1.0 to Z-Tunnel 2.0
Configuring Dedicated Proxy Ports
Copying a Forwarding Profile
