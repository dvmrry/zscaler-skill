# Isolation banner themes: fields, limits and the default theme (zbi.banner-notifications)
Also called: isolation banner; isolation end user notification; banner theme; Show Welcome Notification; Persist Browser Isolation Banner

Isolation banner notifications are assigned per isolation profile, for both Internet & SaaS and Private Access, and appear in the web browser when a user enters an isolated session. [zbi.banner-notifications:per-profile-assignment] The Default banner theme is applied to all isolation profiles unless a profile is edited to use a different theme; it cannot be deleted but can be edited (stated in both the Internet & SaaS and Private Access articles). [zbi.banner-notifications:default-theme]

**Custom themes.** Admins can create and edit as many custom banner themes as they want and can delete any theme that is not the default. [zbi.banner-notifications:custom-themes-unlimited] Any banner theme except the Default can be deleted, in both products. [zbi.banner-notifications:delete-not-default]

**Theme fields.** A banner theme has a Theme Name, Logo Image, Primary Color shown on the banner background, Text Color, Notification Title and Notification Text. [zbi.banner-notifications:theme-fields] A banner theme logo image must be .jpeg or .png and at most 100 KB, in both products. [zbi.banner-notifications:logo-image-limit] Enabling Persist Browser Isolation Banner keeps the banner for the whole isolation session without it disappearing after 15 seconds, in both products. [zbi.banner-notifications:persist-banner-15-seconds] Turning off the show toggle means the end-user notification does not appear for any profile using that banner theme; the toggle is labelled Show isolation banner in Internet & SaaS and Show Welcome Notification in Private Access. [zbi.banner-notifications:show-toggle] In mobile isolation, links added to the banner Notification Text are disabled by default. [zbi.banner-notifications:mobile-links-disabled]

Whether banner themes can be managed through an API, SDK or Terraform is open [gap:zbi.banner-notifications:automation-surfaces].

What to check:
1. Whether the banner theme the profile uses has the show toggle turned off.

Not known (open gaps):
- Whether Internet & SaaS banner themes can be managed through the API, SDKs or Terraform [gap:zbi.banner-notifications:automation-surfaces]: settled by source-read. Blocks: answering how to manage Internet & SaaS isolation banner themes as code

Area: zbi.banner-notifications, its subjects in references/_meta/spine/zbi/zbi.banner-notifications.json
