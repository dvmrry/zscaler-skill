# Best Practices

**Source:** https://help.zscaler.com/zsdk/best-practices
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1514896, revision 3121919

---

Zscaler recommends the following when you are configuring ZSDK:
- Always use the shared instance of the ZscalerZSDK class for consistency across your applications.
- Use ZscalerConfiguration prior to starting any tunnels.
- Implement proper error handling using ZscalerError for iOS or ZscalerSDKException for Android, and their associated error codes. To learn more, see Developer Reference.
- To manage your app's ZSDK lifecycle:
  - Call suspend() when the app enters the background for Android or before app suspension for iOS.
  - Call resume() when the app returns to the foreground.
  - Ensure network operations are complete before suspension.
- Subscribe to ZscalerSDK notifications to monitor changes in the tunnel state by using platform-specific notification settings (e.g., BroadcastReceiver for Android, NSNotification for iOS).
- Export and clear logs as needed for debugging and maintenance.
