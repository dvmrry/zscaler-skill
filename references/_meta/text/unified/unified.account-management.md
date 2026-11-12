# Experience Center account management: organization profile, subscriptions, branding, and Zscaler service in Russia (unified.account-management)
Also called: organization profile; company profile; subscriptions page; branding; Zscaler use in Russia; End User Statement

The Internet & SaaS service automatically creates a profile for the organization, which can be reviewed and updated on the Organization page (Administration > Administration > Organization). [unified.account-management:org-profile] The service automatically assigns the organization a Company ID, which might be asked for when requesting Zscaler Support and is not editable; the organization Name is the one provided, is not editable, and appears in the login form the service displays when users authenticate and in user notifications when policy violations occur. [unified.account-management:company-id-and-name]

**Domains and time zone.** Domains shows the domains provided when the tenant was provisioned; the time zones listed are those within the geographic location of the primary address, and the primary time zone is used when the organization synchronizes user, group and department information from a directory server. [unified.account-management:domains-timezone]

**Logo.** The organization profile's Company Logo is uploaded with Upload, and the service supports JPG, GIF and PNG image files of 10 KB size or smaller; the company logo appears in the login form the service displays when users authenticate to the Zscaler service. [unified.account-management:org-logo] The Branding page gives a different limit [divergence:unified.account-management:logo-size]: On the Branding page the image size should not exceed 70 KB, and the maximum length of a customized email subject line is limited to 70 characters. [unified.account-management:branding-limits] Whether the three logos are one image is open [gap:unified.account-management:logo-identity].

**Contacts.** The primary and secondary Technical Contacts and Billing Contacts are authorized to open Support tickets with the Zscaler service; for Business Contacts the service displays the primary contact information provided, which cannot be edited, and a secondary contact can be entered; contact changes are saved and activated. [unified.account-management:contacts]

**Subscriptions.** Subscriptions define the Internet & SaaS (ZIA) features and levels of functionality available to the organization; the Subscriptions page (Administration > Subscription > Internet & SaaS) lists each subscription with its SKU, Status (Subscribed or Trial, which the table can be filtered by), Usage (the number of users accessing subscription licenses), Licenses, Start Date (when it was enabled) and End Date (when it expires), and the Zscaler Account team is contacted to update subscriptions. [unified.account-management:subscriptions] Other products' subscription pages are open [gap:unified.account-management:subscriptions-scope].

**Branding.** Branding adds the organization's logo and customizes the email users receive to access the Zscaler Admin Console: the custom logo appears on the login, logout and password reset pages (and in emails), the email Zscaler sends is rebranded and sent from the custom email address, and only admins with Full permissions can customize the logo and email address (Administration > Account Management > Branding). [unified.account-management:branding] Under Customize Email Subject the subject line can be changed for One-Time Code for Email Change, One-Time Code for Password Reset, One-Time Code for Account Reset, Email OTP for Authentication, New User Setup Link, One-Time Code for MFA Enrollment, New Service Enabled for Tenant, New Zscaler Service Account Created, End User Migration, SAML Cert Expiry Notification and SAML Cert Expired Notification. [unified.account-management:branding-email-subjects] The image formats Branding accepts are open [gap:unified.account-management:branding-formats].

**The Private Access tenant.** The Private Access tenant's own company profile, logo and favicon are in [Private Access user portals and portal links: what they are, how users reach them, certificates and DNS, links, download links and the acceptable use policy](kb:zpa.user-portal). Linked Services are in [What ZIdentity (Authentication Service) is, and where each part of it is covered](kb:zidentity.overview).

**Russia.** Zscaler provides cybersecurity services in compliance with applicable laws and does not provide services to Russian-owned entities, and requires customers to complete an End User Statement to receive Zscaler services in Russia; the form must be signed by an authorized signatory representing the company or organization, and after Zscaler receives and approves it Zscaler provides instructions on how to continue to use the services in Russia. The form can be downloaded, signed and returned by email to exportcompliance@zscaler.com, and questions about technical deployment go to z-ask-russia@zscaler.com. [unified.account-management:russia] The page gives no technical restrictions [gap:unified.account-management:russia-restrictions].

What to check:
1. Which logo is meant (organization profile, Branding or onboarding) before giving a size limit; the pages differ.

Sources disagree (name both sides):
- The organization profile page and the onboarding logo page give a logo size of 10 KB or smaller; the Branding page, which the onboarding page says is where the logo is edited later, says the image should not exceed 70 KB. [divergence:unified.account-management:logo-size]
  - zscaler-help: The onboarding logo is 10 KB or less, and is edited later at Administration > Account Management > Branding.
  - zscaler-help: The organization profile's Company Logo supports JPG, GIF and PNG image files of 10 KB or smaller.
  - zscaler-help: The Branding image size should not exceed 70 KB.
  Impact: A logo between 10 KB and 70 KB is within the Branding limit and over the onboarding and organization-profile limits; the pages do not say whether the logos are one image or which limit governs.

Not known (open gaps):
- Whether the organization-profile, Branding and onboarding logos are one image [gap:unified.account-management:logo-identity]: settled by lab-test or support-ticket
- Subscription pages for other products [gap:unified.account-management:subscriptions-scope]: settled by source-read
- Which image formats Branding accepts [gap:unified.account-management:branding-formats]: settled by source-read or lab-test
- Technical restrictions on Zscaler service in Russia [gap:unified.account-management:russia-restrictions]: settled by support-ticket

Area: unified.account-management, its subjects in references/_meta/spine/unified/unified.account-management.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
- links-to references/_meta/text/zpa/zpa.user-portal.md (Private Access user portals and portal links: what they are, how users reach them, certificates and DNS, links, download links and the acceptable use policy)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/unified/unified.overview.md (Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated)
- see-also references/_meta/text/unified/unified.onboarding.md (Experience Center guided onboarding: adding users, traffic forwarding, and the security policy steps it walks through)
- see-also references/_meta/text/unified/unified.admin-console.md (Zscaler Admin Console: navigation, home page, search, account settings, tables, supported browsers, read-only maintenance and remote assistance)
