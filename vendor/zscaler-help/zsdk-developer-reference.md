# Developer Reference

**Source:** https://help.zscaler.com/zsdk/developer-reference
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1511411, revision 3121914

---

The combination of ZSDK classes and notifications allows you to configure ZSDK for your mobile application's secured communication needs.
Zscaler recommends reviewing Best Practices on how to best use classes and notifications.
# Classes
ZSDK uses the following classes:
- ZscalerSDK
- ZscalerSDK is the primary class for calling ZSDK key methods and properties.
- This class provides the following core functionalities:
  - Initialization
  - Tunnel Operations
  - Tunnel Lifecycle Management
  - Platform-Specific Configurations
  - Maintenance Operations
## Initialization
- When you call to initialize a connection between the application and ZSDK, you create an instance of ZSDK.
| Method | Platform | Description |
|---|---|---|
| init(application: Application, zscalerSDKConfiguration: ZscalerSDKConfiguration) | Android | Initializes to establish a connection between the application and ZSDK. This is required before calling other methods. |
| setConfiguration(zscalerSDKConfiguration: ZscalerSDKConfiguration | Both | Update or set the parameters for ZSDK configuration. |
| sharedInstance() | iOS | Returns the shared instance of ZSDK. |
| For Kotlin: ZscalerSDKFor Java: ZscalerSDK.INSTANCE | Android | Returns the shared instance of ZSDK. |
## Tunnel Operations
- You can start two different tunnels and stop tunnel operations to manage your secured communication.
| Method | Description |
|---|---|
| startPreLoginTunnel(appKey: String, deviceUdid: String) | Starts a Prelogin tunnel. Zscaler issues a client certificate that is valid for 180 days. |
| startZeroTrustTunnel(appKey: String, deviceUdid: String, accessToken: String) | Starts a Zero Trust tunnel. Zscaler issues a client certificate that is valid for 7 days.If you use ZSDK version 2.0 or later, the startZeroTrustTunnel() operation can be called even if a Prelogin tunnel is running. ZSDK upgrades the existing tunnel connection to Zero Trust. |
| stopTunnel() | Terminates any active tunnels from use. |
## Tunnel Lifecycle Management
- Managing the lifecycle of ZSDK tunnels is important to remain consistent with operational needs and to maintain resources. You can manage them through the following methods:
| Method | Description |
|---|---|
| suspend() | Suspends ZSDK and stops active tunnels.For iOS, call this method before app suspension.For Android, call this method when the app enters the background and no network operation is pending or in progress. |
| resume() | Resumes ZSDK operations.For iOS, call this method when the app enters the foreground.For Android, call this method when the app is ready to resume network operations (i.e., when the app comes to the foreground). |
| status() | Returns the current ZSDK status as ZscalerSDKTunnelStatus object that comprises:tunnelConnectionState: The string status of the tunnel connection (ON, OFF, CONNECTING).tunnelType: The integer type of tunnel.0: Prelogin1: Zero Trust-1: Unknown |
## Platform-Specific Configurations
- Depending on your platform, you can call upon different configuration methods.
### Android-Specific Configurations
- There are specific methods that you can call if you integrate ZSDK into an Android application.
| Method | Description |
|---|---|
| setUpClient(okHttpClientBuilder: OkHttpClient.Builder?, baseURL: String): Retrofit? | Manually configures and returns a ZscalerSDKRetrofit client to use the proxy and proxy auth (if configured) to route traffic to the baseURL through a ZSDK tunnel. Optionally, you can pass your OkHttpClient.Builder instance to the ZscalerSDKRetrofit client. |
| setUpWebView(): ZscalerSDKWebView? | Manually configures and returns a ZscalerSDKWebView instance to use the proxy and proxy auth (as required) to route its traffic through a ZSDK tunnel. |
### iOS-Specific Configurations
- There are specific methods that you can call if you integrate ZSDK into an iOS application.
| Method | Description |
|---|---|
| setup(sessionConfiguration: URLSessionConfiguration) | Manually configures URL sessions for ZSDK to use. |
| setup(websiteDataStore: WKWebSiteDataStore) | Manually configures WebView data store settings for ZSDK to use. |
## Maintenance Operations
- You can maintain your logs by exporting or clearing them. You can also reset proxy port information when the setup fails.
| Method | Description |
|---|---|
| exportLogs(destination: File Path) | Exports logs in a ZIP file to a specified location. |
| clearLogs() | Clears all logs. |
| resetProxyPortAndRequireSessionRecreation() | Resets proxy port when setup fails. Requires recreation of all HTTPS (e.g., URL sessions) and WebView requests. |
- You can also call on the following properties for more information:
| Property | Description |
|---|---|
| proxyInfo() | Returns the ZscalerProxyInfo if it's available. |
| getClientPublicIp() | Returns the public IP address of the client app as a string that is visible to ZSDK Public Service Edge. |
| For iOS only: configuration | Returns the ZscalerConfiguration instance. |
- ZscalerConfiguration
- ZscalerConfiguration is a configuration object with the following configurable ZSDK properties:
| Property Name | Property Type | Platform | Description |
|---|---|---|---|
| shouldAutomaticallyConfigureRequests | Boolean | iOS | If enabled, ZSDK auto-configures URL sessions. |
| shouldAutomaticallyConfigureWebviews | Boolean | iOS | If enabled, ZSDK auto-configures WebViews. |
| useProxyAuthentication | Boolean | All | If enabled, ZSDK allows proxy authentication. |
| failIfDeviceCompromised | Boolean | All | If enabled, ZSDK prevents Mutual Transport Layer Security tunnels on jailbroken or rooted devices. |
| blockZPAConnectionsOnTunnelFailure | Boolean | All | If enabled, ZSDK blocks ZPA connections when any tunnels fail. |
- ZscalerProxyInfo
- You can call on the following proxy configuration details from the ZscalerProxyInfo class:
| Property Name | Description |
|---|---|
| proxyHost | Returns the proxy server hostname. |
| proxyPort | Returns the proxy server port. |
| username | Returns the proxy authentication username if useProxyAuthentication is enabled. |
| password | Returns the proxy authentication password if useProxyAuthentication is enabled. |
- ZscalerError and ZscalerSDKException
- ZscalerError for iOS and ZscalerSDKException for Android represent the following errors that can occur in ZSDK:
| Code | Error Name | Description |
|---|---|---|
| 9001 | unknown | There is an unknown issue. |
| 9002 | invalidParameter | An incorrect parameter was entered. |
| 9101 | noNetwork | There was an issue connecting to the network. |
| 9102 | timeOut | The request has timed out. |
| 9501 | tunnelError | There is an issue with the tunnel. |
| 9301 | permissionDenied | Permission has not been granted to the user. |
Any text highlighted in red indicates that you must enter the specific details.
# Notifications
ZSDK provides notifications to monitor the state of the tunnel.
| Notification Name | Description | Resolution |  |
|---|---|---|---|
| Android | iOS |  |  |
| ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_CONNECTED | NSNotification.ZscalerSDKTunnelConnected | The tunnel is in a connected state and ready for use for outbound network requests. Your application can send HTTPS and WebView traffic via the tunnel now. | No action required. |
| ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_DISCONNECTED | NSNotification.ZscalerSDKTunnelDisconnected | Describes that the tunnel has stopped operations. | No action required. |
| ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_RECONNECTING | NSNotification.ZscalerSDKTunnelReconnecting | There was an issue establishing a connection to the ZSDK Public Service Edge. ZSDK continues to connect and sends a Tunnel Connected notification if the connection is successfully established. | Check your network connection. If the error persists, contact Zscaler Support. |
| ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_AUTHENTICATION_REQUIRED | NSNotification.ZscalerSDKTunnelAuthenticationRequired | Either the client certificate and proof of authentication or authorization have expired. | Call the startZeroTrustTunnel() method to add a new, valid access token to re-authenticate the session. |
| ZscalerSDKNotificationEnum.ZSCALERSDK_TUNNEL_RESOURCE_BLOCKED | NSNotification.ZscalerSDKTunnelResourceBlocked | Access to the application is blocked as per the associated access policy. | Ensure the application segment is configured in the ZSDK Admin Portal. |
| ZscalerSDKNotificationEnum.ZSCALERSDK_PROXY_START_FAILED | NSNotification.ZscalerSDKProxyStartFailed | Proxy initialization has failed. | Call resetProxyPortAndRequireSessionRecreation() to retry the setup.For Android, check the string ZDK_TUNNEL_PROXT_START_FAILED in the notification message. For example, if(intent.getStringExtra(ZscalerSDK.NOTIFICATION_MESSAGE).equals("ZDK_TUNNEL_PROXY_START_FAILED"). |
