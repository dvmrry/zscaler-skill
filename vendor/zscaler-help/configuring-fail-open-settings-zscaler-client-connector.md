# Configuring Failover Settings for Zscaler Client Connector

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-fail-open-settings-zscaler-client-connector
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Zscaler Client Connector Support Settings 
App Fail Open 
Configuring Failover Settings for Zscaler Client Connector
Client Connector
Configuring Failover Settings for Zscaler Client Connector
Ask Zscaler

There can be situations in which Zscaler Client Connector must automatically disable its Internet Security service and allow users to bypass the app and access the internet directly:

Your users might try to access the internet from an airport or a cafe where a captive portal configured on the network requires users to pay or accept an acceptable use policy on the business's website before connecting. You can configure your app failover settings so that when Zscaler Client Connector detects a captive portal, it automatically disables its services for a specified period, allowing users first to complete the steps necessary to access the network.
Zscaler Client Connector might run into issues reaching Zscaler Internet Access (ZIA) Public Service Edges. If so, you can allow users to bypass the app and access the internet directly or, if you prefer, disable users' access to the internet altogether.
Zscaler Client Connector might run into issues properly setting up its Zscaler Tunnel (Z-Tunnel) (the lightweight tunnel it uses to forward traffic to ZIA Public Service Edges). If so, you can allow users to bypass the app and access the internet directly or, if you prefer, disable users' access to the internet altogether.

To configure failover settings:

When configuring failover settings, Zscaler recommends setting the captive portal detection to a value that gives users a reasonable amount of time measured from the network change detection to the time they complete entering information requested by the portal.

In the Zscaler Client Connector Portal, go to Administration.
In the left-side navigation, go to Client Connector Support.
On the App Fail Over Settings tab:

If Captive Portal Detected, Then Disable Web Security for: Select from the following options:

To enable captive portal detection, enter the number of minutes the app must keep its services disabled after detecting a captive portal. You can enter any value between 1 and 60. After the specified period, the app enables its services automatically and traffic is forwarded to the Zscaler service.

To disable the captive portal detection, enter 0 (zero). The app does not perform captive portal detection and does not fail over directly.

If you use Zscaler Client Connector version 4.5 and later for Windows, captive portal detection is set up on the app profile. To learn more, see Configuring Zscaler Client Connector App Profiles.

The app continues to attempt to reach the ZIA Public Service Edge in the background and automatically re-enables itself after it successfully reaches the Public Service Edge.

Contact Zscaler Support to enable this feature.

ZIA Cloud Not Reachable: Select one of the following options:
Direct Internet Access: Users are allowed to bypass the app and access the internet directly.
Disable Internet Access: Blocks HTTP/HTTPS traffic. All other traffic is allowed.

Z-Tunnel Failover: Select one of the following options:

Direct Internet Access: Users are allowed to bypass the app and access the internet directly.
Disable Internet Access: Blocks HTTP/HTTPS traffic. All other traffic is allowed.

If you use Zscaler Client Connector version 4.6 and later for Windows or Zscaler Client Connector version 4.8 and later for macOS, you can set up failover settings on the app profile that take precedence over these settings.

The app continues to attempt to establish the tunnel in the background and automatically re-enables itself after it's successful.

Notify End User: Enable this option to display a notification message to users who attempt to access the internet before logging in if Zscaler Client Connector was installed in Strict Enforcement mode. Applies only to Zscaler Client Connector version 4.6 and later for Windows.
Rate Limit Strict Enforcement Notification: Enter the number of minutes before Zscaler Client Connector displays the notification message again. The default value is 2 minutes.
Strict Enforcement Notification: Enter the message that displays to users. The maximum number of characters is 200.
Click Save.

To learn more about other Zscaler Client Connector Support features, see About Zscaler Client Connector Support.

Was this article helpful? Click an icon below to submit feedback.
Related Article
 
Configuring Failover Settings for Zscaler Client Connector
