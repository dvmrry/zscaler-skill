# Breach Predictor portal: licensing, ZIA prerequisite, sign-in, profile and theme (breach-predictor.portal)

Breach Predictor is a standalone product that is licensed separately from other parts of the Zscaler ecosystem. [breach-predictor.portal:license] For ZIA logs to be available to Breach Predictor, ZIA must be fully configured; an organization that already uses ZIA needs no extra configuration for Breach Predictor to access ZIA logs. [breach-predictor.portal:zia-prereq]

## Signing in

Portal sign-in goes through the Authentication Service, using the method set by the organization's authentication preference: Password, Email One-Time Password (OTP), or Security Key or Biometric; the Breach Predictor tile then opens the portal. [breach-predictor.portal:signin-methods] In the Password sign-in steps, after the password is entered, whether 2FA is required depends on the organization's MFA policy. [breach-predictor.portal:mfa] An email OTP sign-in is available to accounts configured with MFA; the OTP expires after 15 minutes, and Resend issues another OTP after 60 seconds. [breach-predictor.portal:email-otp] From Having trouble signing in?, Reset Password, Reset Second Factor and Reset Security Key or Biometric each send a reset link to the user's email, and the link expires after 15 minutes. [breach-predictor.portal:reset-links]

## Profile and navigation

Profile shows the username, license, the Zscaler cloud Breach Predictor is connected to, the organization ID of the organization's ZIA instance, and the available integrations (for example Jira, CrowdStrike Next-Gen SIEM and Splunk). [breach-predictor.portal:profile-contents] The My Profile page has a User Detail tab (basic user and organizational information) and an Integration tab (the applications available for integration, which can be configured there). [breach-predictor.portal:profile-tabs] A Theme toggle in the navigation sets the UI to dark mode or light mode. [breach-predictor.portal:theme]

## Working with the portal

Under Understanding Maintenance and Upgrades, the navigation page says Breach Predictor does not require configuration for new data visibility (for example new logs or data sources), so an organization automatically benefits from added functionality; release notes track enhancements. [breach-predictor.portal:no-config-upgrades] See [The Zscaler Sandbox integration takes a Secret Key, provided by the account team, that lets Breach Predictor access the organization's Sandbox tenant.](kb:breach-predictor.overview:sandbox) and [The navigation page advises that, when working with Findings data, you should always work from right to left in the MITRE ATT&CK matrix; as a threat moves further to the right in the matrix, the organization is at a higher risk of a data breach.](kb:breach-predictor.findings:right-to-left).

Area: breach-predictor.portal, its subjects in references/_meta/spine/breach-predictor/breach-predictor.portal.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/breach-predictor/breach-predictor.findings.md (Breach Predictor Findings: the MITRE ATT&CK Mapping page, the Threat page, severity scores and attack stages)
- links-to references/_meta/text/breach-predictor/breach-predictor.overview.md (Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/breach-predictor/breach-predictor.dashboard.md (Breach Predictor Dashboard views and the Threat Landscape page)
- see-also references/_meta/text/breach-predictor/breach-predictor.tickets.md (Breach Predictor Request and Support tickets: how they are created and what the Tickets page lists)
