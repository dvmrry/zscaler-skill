# Developer Reference

**Source:** https://help.zscaler.com/zsdk/developer-reference
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Zscaler SDK Developer Guide 
Developer Reference
Zscaler SDK for Mobile Apps
Developer Reference
Ask Zscaler

The combination of ZSDK classes and notifications allows you to configure ZSDK for your mobile application's secured communication needs.

Zscaler recommends reviewing Best Practices on how to best use classes and notifications.

Classes

ZSDK uses the following classes:

ZscalerSDK
ZscalerConfiguration
ZscalerProxyInfo
ZscalerError and ZscalerSDKException

Any text highlighted in red indicates that you must enter the specific details.

Notifications

ZSDK provides notifications to monitor the state of the tunnel.

Notification Name	Description	Resolution
Android	iOS
ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_CONNECTED	NSNotification.ZscalerSDKTunnelConnected	The tunnel is in a connected state and ready for use for outbound network requests. Your application can send HTTPS and WebView traffic via the tunnel now.	No action required.
ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_DISCONNECTED	NSNotification.ZscalerSDKTunnelDisconnected	Describes that the tunnel has stopped operations.	No action required.
ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_RECONNECTING	NSNotification.ZscalerSDKTunnelReconnecting	There was an issue establishing a connection to the ZSDK Public Service Edge. ZSDK continues to connect and sends a Tunnel Connected notification if the connection is successfully established.	Check your network connection. If the error persists, contact Zscaler Support.
ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_AUTHENTICATION_REQUIRED	NSNotification.ZscalerSDKTunnelAuthenticationRequired	Either the client certificate and proof of authentication or authorization have expired.	Call the startZeroTrustTunnel() method to add a new, valid access token to re-authenticate the session.
ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_RESOURCE_BLOCKED	NSNotification.ZscalerSDKTunnelResourceBlocked	Access to the application is blocked as per the associated access policy.	Ensure the application segment is configured in the ZSDK Admin Portal.
ZscalerSDKNotificationEnum.ZSCALERSDK_PROXY_START_FAILED	NSNotification.ZscalerSDKProxyStartFailed	Proxy initialization has failed.	Call resetProxyPortAndRequireSessionRecreation() to retry the setup. For Android, check the string ZDK_TUNNEL_PROXT_START_FAILED in the notification message.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding ZSDK Error Codes
Developer Reference
Best Practices
