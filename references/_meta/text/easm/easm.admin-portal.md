# EASM Admin Portal access: sign-in and MFA, session limits, roles, navigation and PPTX reports (easm.admin-portal)

When an EASM tenant is provisioned, a user account with the super admin role is created, with access to all functionality in the Admin Portal. [easm.admin-portal:super-admin] Account registration must be completed within the time stated in the Zscaler email. [easm.admin-portal:registration-window] Administrators must accept the EUSA the first time they log in to the Admin Portal. [easm.admin-portal:eusa]

## Sign-in and MFA

At registration the second factor is chosen from Security Key or Biometric, Google Authenticator, Phone OTP and Email OTP. [easm.admin-portal:mfa-methods] The SMS OTP is valid for two minutes during setup, and the SMS OTP option is only supported for phone numbers from India and the USA. [easm.admin-portal:sms-otp-limits] At sign-in, a phone OTP and an email OTP each expire after two minutes. [easm.admin-portal:signin-otp-expiry] MFA enrollment can be skipped for a period if the Authentication Service configuration allows it, and enrolled later with the Enroll Second Factor button; Zscaler recommends enrolling all accounts. [easm.admin-portal:mfa-skip] Other Sign-in Options with Email OTP is a temporary alternative way to sign in without entering a password or second-factor details, and is supported only if MFA is configured. [easm.admin-portal:email-otp-signin] Having trouble signing in? > Reset Password sends a password reset email, Having trouble signing in? > Reset Second Factor sends an email with instructions to reset the second method of authentication, and the reset link in the email expires after 5 minutes. [easm.admin-portal:reset-link-expiry] Users are automatically logged out of the EASM Admin Portal after 1 hour of inactivity. [easm.admin-portal:idle-logout]

## Navigation

The portal navigation page lists a Dashboard menu (Insights Overview, Assets Overview), an Insights menu (Findings, Lookalike Domains), Assets and an Administration menu. [easm.admin-portal:navigation] Where the Findings Impact page sits differs between pages [divergence:easm.admin-portal:findings-impact-location].

## Roles

EASM roles carry a Name, Permissions (Full Access or View Only), the custom organizations in scope and a Description. [easm.admin-portal:rbac-roles] Role management is in the EASM Admin Portal, but role assignment to users takes place in ZIdentity. [easm.admin-portal:role-assignment] With view-only permission to an organization, a View icon appears on the Role Management page instead of the action to edit or delete configured administrator roles. [easm.admin-portal:view-only-icon]

## Reports

EASM generates reports for individual organizations in PPTX format, and admins need full permission to the organization to generate one. [easm.admin-portal:report-format] Report data varies by organization depending on available discoveries, and key metrics include known vulnerabilities, exposed servers and public cloud instances, outdated SSL/TLS, domain expiration and registered lookalike domains. [easm.admin-portal:report-contents] A report is generated with Generate Report on the organization page under Administration > Organization, and downloads as a PPTX file. [easm.admin-portal:report-generation]

The permissions a Full Access or View Only role carries beyond the cited pages are open [gap:easm.admin-portal:role-permission-detail], and whether any report content shows a business or financial impact figure is open [gap:easm.admin-portal:report-impact-calculation].

What to check:
1. Whether the user's role has Full Access or View Only on the organization before asking why a report or Role Management edit action is unavailable.
2. Whether the registration email's time window has passed before asking why account setup cannot be completed.

Sources disagree (name both sides):
- The portal navigation page says the Insights menu selects between Findings and Lookalike Domains; the Findings Impact page gives its location as Insights > Findings Impact. [divergence:easm.admin-portal:findings-impact-location]
  - zscaler-help: The Insights drop-down menu selects between Findings and Lookalike Domains.
  - zscaler-help: The Findings Impact page is at Insights > Findings Impact.
  Impact: The navigation list is not the full Insights menu; look for Findings Impact under Insights as well.

Not known (open gaps):
- What Full Access and View Only permit beyond the cited pages [gap:easm.admin-portal:role-permission-detail]: settled by source-read or lab-test
- Whether any report content shows a business or financial impact figure [gap:easm.admin-portal:report-impact-calculation]: settled by source-read or tenant-data

Area: easm.admin-portal, its subjects in references/_meta/spine/easm/easm.admin-portal.json
