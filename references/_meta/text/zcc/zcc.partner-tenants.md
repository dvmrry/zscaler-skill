# Private Access partner logins: who may log in to whose tenant, and what the user does and sees (zcc.partner-tenants)
Also called: partner login; Partner Login; partner tenant; Add Partner Tenant; B2B Exchange partner login; Allow Partner Login to This Tenant; Restrict Old Zscaler Client Connector Versions to Connect to this Tenant

A partner is a separate entity or company that owns a Private Access tenant. An organization can give partner organizations access to its tenant and allow its users to access a partner organization's tenant; the partner must configure the same settings for its own tenant for users of both to reach each other's tenants. Partner login is configured under Private Access > Client Connector > Partner Login. [zcc.partner-tenants:what-a-partner-is]

**Letting partners in.** Allow Partner Login to This Tenant offers the choices No Access, Specific Tenants and All Tenants. No Access disallows access to the tenant to any partner organization. Specific Tenants takes a Primary Tenant Domain, a fully qualified domain name for the partner tenant, and if no cloud name is entered a user on the partner domain on any cloud name can access the tenant; Specific Tenants applies only to Client Connector 4.7 and later for Windows and 5.0 and later for macOS. All Tenants gives access to all partner organizations. [zcc.partner-tenants:inbound-options] Under Specific Tenants, Restrict Old Zscaler Client Connector Versions to Connect to this Tenant, when enabled, allows only partner tenant devices using Client Connector 4.7 and later for Windows and 5.0 and later for macOS to log in to the tenant. [zcc.partner-tenants:restrict-old-versions] What happens to existing macOS partner tenants when the version restriction is enabled is worded two ways [divergence:zcc.partner-tenants:macos-unenrollment].

**Letting users out.** Allow Users of This Tenant to Log in to Other Tenants lets the organization's users access a partner's tenant and is disabled by default. On Client Connector 4.6 and later for Windows or 5.0 and later for macOS, access to a partner's tenant can be configured on the app profile, and partner login settings enabled on the app profile override these settings. [zcc.partner-tenants:outbound-login]

**What the user does.** A user can add a partner tenant to the app to access the partner's internal resources without logging out of and back in to Client Connector, once the organization and the partner organization have enabled Private Access partner logins, which can be enabled even when only Internet & SaaS is used. On Windows, if the organization does not use Private Access, the Private Access window shows only the Add Partner Tenant link and information about the partner tenant. Based on the partner tenant settings, the user is prompted to complete one of the steps the page lists, one of which is selecting the partner tenant and clicking Connect, and the identity provider page for the partner organization then appears. [zcc.partner-tenants:user-adds-tenant] In the Windows steps of the Classic UI page, after the user logs in to the partner organization Client Connector automatically turns off Private Access access to the user's own organization, and clicking Turn On for the main tenant enables it and turns off access to the partner organization. The partner tenant remains in the window, and Turn On for it enables Private Access access to the partner organization. [zcc.partner-tenants:one-tenant-at-a-time] The ZPA page on Client Connector support for multiple tenants says it allows changing between the primary tenant and one or more partner tenants without logging out and back in to Client Connector, but supports only a single active tunnel at a time, so Private Access users can switch between the primary and partner tunnels but cannot connect to both simultaneously. In its example Customer 1's Private Access tenant is automatically disconnected when the connection is made to Customer 2. Support is configured in Client Connector and the Admin Console, and an access policy can also be configured using a new client type. [zcc.partner-tenants:single-active-tunnel] The tunnels the page's first sentence refers to, and the client type, are open [gap:zcc.partner-tenants:multi-tenant-page-unclear].

**Pop-ups.** Client Connector shows Partner Private Access is Connected and Partner Private Access is Disconnected as Service Status pop-ups for Private Access, and duplicates of each that display within a 1-minute interval are suppressed. The pop-up list applies to Client Connector 4.4 and later for Windows and 4.3 and later for macOS. [zcc.partner-tenants:partner-pop-ups] The pop-up list and its other suppression intervals are in [Client Connector pop-up messages: type, meaning, user action and duplicate suppression](kb:zcc.notifications.pop-ups).

**Open questions.** How partner login relates to application federation is not stated by the partner login pages [gap:zcc.partner-tenants:b2b-federation-relation]; the federation feature is [ZPA Business-to-Business Federation](kb:zpa.b2b-federation). The app profile's partner login settings are not described in these pages [gap:zcc.partner-tenants:app-profile-partner-settings].

What to check:
1. Whether both organizations enabled partner login, since each must configure the same settings for users to reach each other's tenants.
2. For a partner user who is unenrolled after Restrict Old Client Connector Versions is enabled, the device's OS and Client Connector version against both statements of who is unenrolled.
3. Whether an app profile with partner login enabled overrides the tenant setting for the user.

Sources disagree (name both sides):
- One option on the partner login page says only partner devices on Client Connector 5.0 and later for macOS may log in, and in the next sentence says enabling it unenrolls existing partner tenants using Client Connector for macOS without a version bound. [divergence:zcc.partner-tenants:macos-unenrollment]
  - zscaler-help: With the option enabled, partner devices on 4.7 and later for Windows and 5.0 and later for macOS can log in.
  - zscaler-help: With the option enabled, existing partner tenants using Client Connector for macOS (no version given) or 4.6 and earlier for Windows are unenrolled.
  Impact: Read literally, the second sentence unenrolls every macOS partner tenant, including those on 5.0 and later that the first sentence allows; the page does not say which governs.

Not known (open gaps):
- What the multi-tenant page's two Z-Tunnels are and which client type it means [gap:zcc.partner-tenants:multi-tenant-page-unclear]: settled by source-read or lab-test
- How partner login relates to B2B application federation [gap:zcc.partner-tenants:b2b-federation-relation]: settled by source-read or lab-test
- The app profile's partner login settings [gap:zcc.partner-tenants:app-profile-partner-settings]: settled by source-read

Area: zcc.partner-tenants, its subjects in references/_meta/spine/zcc/zcc.partner-tenants.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.notifications.pop-ups.md (Client Connector pop-up messages: type, meaning, user action and duplicate suppression)
- links-to references/_meta/text/zpa/zpa.b2b-federation.md (ZPA Business-to-Business Federation)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.end-user.md (The Client Connector app as users see it: Classic UI and Modern UI menus, status, enrollment and notifications, by OS where the pages cover it)
- see-also references/_meta/text/zcc/zcc.install.enrollment.md (Install parameters that identify the tenant and user at enrollment)
