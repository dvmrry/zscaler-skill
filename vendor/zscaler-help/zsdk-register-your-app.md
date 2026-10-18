# Register Your App

**Source:** https://help.zscaler.com/zsdk/register-your-app
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1506966, revision 3222127

---

Register your mobile app to create a unique app key where it contains security configurations.
To register your app:
- Go to **Configuration & Control** > **Apps** > **Registered Apps** > **Add**.
- The **Add New App** window appears.
- In the **Add New App** window:
  - **Name**: Enter the name of the mobile app.
  - **Description**: Enter a description of the mobile app.
  - **Authentication Type**: **One Identity** is selected as the default.
  - **Trust Binding**: Select a trust binding level (**Strong** or **Loose**) that determines device re-enrollment frequency. Admins can choose the appropriate binding mode based on their organization's security requirements and user needs.
    - **Strong**: Requires more frequent device re-enrollment for heightened security.
    - **Loose**: Allows longer intervals between device re-enrollments.
- See image.
- Click **Save**.
- To activate your new key on the **Registered Apps** page, click the **Publish** () icon.
After publishing your app key, you can configure token validation settings for your app. To learn more, see Managing Token Validators.
To use Firebase in your Apple app, you need to register your app with your Firebase project. Registering your app is often referred to as adding your app to your project.
