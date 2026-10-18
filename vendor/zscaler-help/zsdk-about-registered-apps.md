# About Registered Apps

**Source:** https://help.zscaler.com/zsdk/about-registered-apps
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1507521, revision 3222128

---

You must register your mobile app to obtain an app key before implementing Zscaler SDK for Mobile Apps. This registration process configures essential security settings for your app.
Registered apps provide the following benefits and enable you to:
- Provision and manage unique app keys for each mobile app or environment.
- Configure trust binding levels to match your security requirements.
# About the Registered Apps Page
On the Registered Apps page (Configuration & Control > Apps > Registered Apps), you can do the following:
- Filter by Name, Authentication Type, Trust Binding, Published, or Revoked to display registered apps.
- Indicates whether there are selected filters.
- Show or hide the filters bar.
- Add an app to register.
- Expand all the rows or expand one row to see the registered app's details.
- View a list of all registered apps. For each registered app, you can see:
  - Name: The name of the registered app key.
  - Authentication Type: The identity provider for validating access tokens for your app. This is always set to One Identity.
  - Trust Binding: The device's re-enrollment frequency. The value is one of the following:
    - Strong: Requires more frequent device re-enrollment for heightened security.
    - Loose: Allows longer intervals between device re-enrollments.
  - Published: The app key's published state. The value is Yes or No.
  - Raw Config: The raw configuration of the app key.
  - App Key: The app key assigned to the registered app. You can copy the app key to your clipboard for use.
  - Revoked: The app key's revoked status. The value is Yes or No.
- Configure your table settings for display.
- Copy your app key.
- Select an action for the registered key:
  - Revoke: Deactivate your app key so that it can no longer be used.
  - Edit: Edit your unpublished app key prior to use.
  - Publish: Activate your app key for use.
  - Delete: Delete your unpublished app key.
- After a registered app key is published, you can then revoke the key as an action. The Edit, Publish, and Delete actions are unavailable after a registered app key is published.
- Go to the Device Profile page to configure a set of criteria that evaluates a device.
