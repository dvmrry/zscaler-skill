# Verifying Access to Applications

**Source:** https://help.zscaler.com/zscaler-client-connector/verifying-access-applications
**Captured:** 2026-04-23 via Playwright MCP.

---

Zscaler Client Connector Help — End User Guide — Verifying Access to Applications

Your organization can require additional levels of authentication to access specific applications (e.g., your default access requires only a username and password, but an application with sensitive financial information requires multi-factor authentication). If you try to access an application that requires additional authentication, Zscaler Client Connector displays a pop-up notification prompting you to verify your access.

This feature is available for Private Access only with Zscaler Client Connector version 4.6 and later for Windows and for Internet & SaaS (ZIA) only with Zscaler Client Connector version 4.7 and later for Windows. This feature is also available for Private Access and Internet & SaaS with Zscaler Client Connector version 4.7 and later for macOS. Additional authentication requirements are set up by administrators in the Zscaler Admin Console and are available only if you are subscribed to ZIdentity. To use this feature with Internet & SaaS, you must enable Use Zscaler Notification Framework in the app profile and Enable ZIA Notifications in the end user notifications.

To learn more, see Understanding Step-Up Authentication, Configuring Access Policies, and Configuring the URL Filtering Policy.

## To verify access to applications

1. Open Zscaler Client Connector and click Private Access or Internet Security. The pending verification status message appears.
2. Click Verify Now.
3. Based on your organization's authentication requirements, you might be prompted to complete one of the following steps:
   - You might be redirected to your organization's single sign-on (SSO) form. Enter your credentials and log in.
   - You might be directed to a window where you can select the application you want to access (if your organization requires verification for multiple applications). Select the application you want to access and click Verify. You are redirected to your organization's authentication form. Enter your credentials and log in.
