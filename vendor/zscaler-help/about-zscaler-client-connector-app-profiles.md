# About Zscaler Client Connector App Profiles

**Source:** https://help.zscaler.com/zscaler-client-connector/about-zscaler-client-connector-app-profiles
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1317636, revision 3243854

---

In the Zscaler Admin Console, you can configure app profiles by adding policy rules to each profile. You can select the order of precedence among the rules and to whom each rule applies (all users or different groups of users). When a user enrolls the app with the Zscaler service, the app uses the order of precedence and identity of the user to download an app profile with the appropriate policy rule. To learn more, see Zscaler Client Connector Profile Rule Example.
The app checks for profile updates and downloads any changes whenever users log out and back into the app or restart their computers.
App profiles provide the following benefits and allow you to:
- Control whether users must enter an admin-provided password to log out of, disable, exit, or uninstall the app.
- Select the forwarding profile for Internet & SaaS and Private Access services.
- Determine whether the app can install the Zscaler SSL certificate on users' devices to allow SSL inspection of traffic forwarded by the app for the Internet & SaaS service.
- Control how the app generates logs and the maximum size of its log files for the Internet & SaaS service.
- Quickly locate an app profile using the search feature.
- Easily view, edit, copy, and delete app profiles.
# About the App Profiles Page
On the App Profiles page (Infrastructure > Client Connector > OS Name), you can do the following:
- Configure a new app profile rule.
- Search for an app profile.
- View a list of all configured app profile rules.
- Copy an existing profile that you can customize to create a new profile.
- Edit items in the Zscaler Admin Console or view the policy token for an app profile rule.
- Delete items in the Zscaler Admin Console.
- View the default policy.
