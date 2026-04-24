# Best Practices for Deploying Z-Tunnel 2.0

**Source:** https://help.zscaler.com/zscaler-client-connector/best-practices-deploying-z-tunnel-2.0
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zscaler Client Connector Help 
Forwarding Traffic Management 
Best Practices for Deploying Z-Tunnel 2.0
Client Connector
Best Practices for Deploying Z-Tunnel 2.0
Ask Zscaler

Following the best practices in this article can ensure successful deployment of Zscaler Tunnel (Z-Tunnel) 2.0 for your organization.

You must have a supported version of Zscaler Client Connector to use Z-Tunnel 2.0.
Based on your organization’s needs, your settings for the phase 5 rollout to all users might be different than the recommended test settings described in phases 1 through 4.
Phase 1: Identify a Group of Users and Configure Z-Tunnel 2.0 Settings

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
Phase 2: Block ICMP Traffic to Perform Initial Testing

To perform initial testing, begin by ensuring that ICMP traffic is blocked.

To block ICMP traffic:

Ping google.com.
Verify that ICMP traffic is seen on file for all logs.
Create a firewall rule to block ICMP traffic.
Ping google.com to test this rule.
Verify that ICMP traffic is blocked on all logs.
Close
Phase 3: Exclude Internal Network Ranges from Z-Tunnel 2.0

To exclude these ranges, you must add them to the IPv4 Exclusion or IPv6 Exclusion list in the app profile you created for testing. To learn more, see VPN Gateway Bypasses.

To learn more, see Configuring Zscaler Client Connector App Profiles.

Close
Phase 4: Continue to Test the Group for One to Two Weeks

Continue to test this group of test users for one to two weeks.

To test your Z-Tunnel 2.0 configuration:

Identify the top business applications that your organization uses.
Test access to these applications with the test user group.
Get user feedback on any issues they experience.
Close
Phase 5: Roll Out a Supported Version of Zscaler Client Connector and Z-Tunnel 2.0

Roll out a supported version of Zscaler Client Connector and Z-Tunnel 2.0 to the rest of your employees in batches of 100 to 200 users. Each time you roll out Zscaler Client Connector and Z-Tunnel 2.0 to a group, you must ensure that your business applications are unaffected.

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
