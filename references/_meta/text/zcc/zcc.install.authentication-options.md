# Install parameters for how users sign in to Client Connector (zcc.install.authentication-options)
Also called: externalRedirect; EXTERNALREDIRECT; enableSSO; ENABLESSO; installWebView2; INSTALLWEBVIEW2; enableImprivataIntegration; ENABLEIMPRIVATAINTEGRATION; browser-based authentication zcc; imprivata onesign zcc

These parameters change where and how a user authenticates when Client Connector enrolls them.

**Browser instead of the app.** externalRedirect (MSI `EXTERNALREDIRECT`) enables browser-based authentication on Windows. On macOS it redirects authentication to the organization's SAML IdP through the default browser and Safari; the first time, users must select Remember Me on the IdP login screen, after which the browser logs them in automatically. It defaults to disabled. [zcc.install.authentication-options:external-redirect]

**Windows primary account and WebView2.** On Windows, enableSSO (MSI `ENABLESSO`) enables SSO with the Windows primary account in an Azure Active Directory environment: 2, the default, follows policy; 1 enables; 0 disables. [zcc.install.authentication-options:enable-sso] installWebView2 (MSI `INSTALLWEBVIEW2`) installs the WebView2 framework, and is meant only for testing WebView2-based functionality on a single device; testing SSO with WebView2 also needs enableSSO. [zcc.install.authentication-options:install-webview2]

**Imprivata.** On Windows from Client Connector 4.4, enableImprivataIntegration integrates with Imprivata OneSign: Client Connector silently logs the Imprivata OneSign user in, applies security policies and logs the user's activity. [zcc.install.authentication-options:imprivata] Its MSI name is ENABLEIMPRIVATAINTEGRATION. [zcc.install.authentication-options:imprivata-msi-name] The Imprivata integration is available only for Client Connector 4.4 and later for Windows and is useful if users authenticate on shared devices: it silently logs Imprivata users in to and out of Client Connector, applies different security policies on the same device based on the user, and logs activity for each user. [zcc.install.authentication-options:imprivata-purpose] The Client Connector system tray icon does not display when Imprivata users are logged in, and they can access Client Connector from the Start menu. Updates to Client Connector or Admin Console changes that result in temporary downtime of the app do not affect the Imprivata login. [zcc.install.authentication-options:imprivata-ui] The Imprivata page's best-practice recommendations are disabling the Zscaler Notification Framework to prevent pop-up messages and setting Private Access policies to expire at the same time. Its steps to use the integration are deploying Client Connector with a customized install option and enabling Integrated Windows Authentication (IWA). (Optional): if WebView2 authentication is used, additional domains are entered when the user login domain differs from the IdP domain. The Registered Device Details page shows the type of user (Windows or Imprivata) accessing a device. [zcc.install.authentication-options:imprivata-practices]

**Machine tunnel.** Requiring IdP authentication before a machine tunnel starts is also an install parameter on Windows: [On Windows the same requirement is an install parameter, MTAUTHREQUIRED for MSI and mtAuthRequired for EXE.](kb:zpa.machine-tunnels.requirements:machine-auth-install-parameter).

Inferred, not quoted (say so when an answer rests on one):
- [zcc.install.authentication-options:imprivata-msi-name] Tier B: The help capture joins the row's MSI and EXE labels into 'MSI: ENABLEIMPRIVATAINTEGRATIONEXE: enableImprivataIntegration'; this reads it as MSI name plus EXE name, as the page's prose confirms for other rows (ENABLESSO or enableSSO, INSTALLWEBVIEW2 or installWebView2) and its note that MSI and EXE names differ. No source writes this MSI name on its own.

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.install.enrollment.md (Install parameters that identify the tenant and user at enrollment)
