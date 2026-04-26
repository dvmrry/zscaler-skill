# About Registered Apps

**Source:** https://help.zscaler.com/zsdk/about-registered-apps
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Getting Started 
Provisioning 
About Registered Apps
Zscaler SDK for Mobile Apps
About Registered Apps
Ask Zscaler

You must register your mobile app to obtain an app key before implementing Zscaler SDK for Mobile Apps. This registration process configures essential security settings for your app.

Registered apps provide the following benefits and enable you to:

Provision and manage unique app keys for each mobile app or environment.
Configure trust binding levels to match your security requirements.
About the Registered Apps Page

On the Registered Apps page (Configuration & Control > Apps > Registered Apps), you can do the following:

Select the filter's Name, Authentication Type, Published, Revoked, or Trust Binding. Name is selected as the default.
Indicates whether there are selected filters.
Show or hide the filters bar.
Add an app to register.
Expand all the rows or expand one row to see the registered app's details.
View a list of all registered apps. For each registered app, you can see:
Name: The name of the registered app key.
Authentication Type: The identity provider for validating access tokens for your app. This is always set to One Identity.
Trust Binding: The device's re-enrollment frequency. The value is one of the following:
Strong: Requires more frequent device re-enrollment for heightened security.
Loose: Allows longer intervals between device re-enrollments.
Published: The app key's published state. The values are true or false.
Raw Config: The raw configuration of the app key.
App Key: The assigned app key to the registered app. You can copy the app key to your clipboard for use.
Revoked: The app key's revoked status. The values are true or false.
Configure your table settings for display.
Copy your app key.

Select an action for the registered key:

Revoke: Deactivate your app key so that it can no longer be used.
Edit: Edit your unpublished app key prior to use.
Publish: Activate your app key for use.
Delete: Delete your unpublished app key.

After a registered app key is published, you can then revoke the key as an action. The edit, publish, and delete actions are unavailable after a registered app key is published.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Registered Apps
Register Your App
About Token Validators
Managing Token Validators
