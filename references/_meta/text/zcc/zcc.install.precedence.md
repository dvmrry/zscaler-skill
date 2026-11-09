# Install parameters versus console settings: which wins, and what survives an update (zcc.install.precedence)
Also called: install parameter overrides app profile; app profile overrides install parameter; enableCustomProxyDetection; ENABLECUSTOMPROXYDETECTION; enableAntiTampering; ENABLEANTITAMPERING; override anti tampering install parameter; do install parameters survive upgrade

A few install parameters overlap settings an admin can also change in the console, and the direction of precedence differs by parameter.

**The console replaces the parameter.** The policy that policyToken names applies only until the user enrolls; it is then replaced by the app profile policy that matches the user by group. [zcc.install.precedence:policytoken-replaced] On Windows, enableCustomProxyDetection sets how Client Connector finds the system proxy before the first policy download: enabled, it downloads the PAC file and parses the proxy instead of using the Microsoft APIs. After the first policy download it follows the app profile's Detect External Proxy Using Custom Method, and it returns to the install setting after the user logs out. [zcc.install.precedence:custom-proxy-detection] Its MSI name is ENABLECUSTOMPROXYDETECTION. [zcc.install.precedence:custom-proxy-msi-name] On Windows, enableAntiTampering (MSI `ENABLEANTITAMPERING`) prevents end users from stopping, modifying or deleting Zscaler products and services; the app profile's Override Anti Tampering Install Parameter option can override it. [zcc.install.precedence:anti-tampering]

**The parameter replaces the console.** The LWF driver switch overrides the forwarding profile's driver choice: [useLWFDriver overrides the Tunnel Driver Type selected in forwarding profiles.](kb:zcc.install.windows-driver:uselwf-overrides).

**Across updates.** An app update configured in the Client Connector App Store keeps the installation parameters already set on the device, such as strictEnforcement or policyToken. [zcc.install.precedence:update-retains] The MSI and EXE install-options pages each say that modifying any of the listed install parameters after installation requires reinstalling the app with the new values. [zcc.install.precedence:reinstall-to-change] Whether a parameter can be changed after installation by any other route is open [gap:zcc.install.precedence:change-after-install].

What to check:
1. Before concluding a console change had no effect on Windows, whether the device was installed with useLWFDriver.
2. For a pre-enrollment behavior that changed after login, whether the parameter is one the app profile supersedes after enrollment.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.install.precedence:custom-proxy-msi-name] Tier B: The help capture joins the row's MSI and EXE labels into 'MSI: ENABLECUSTOMPROXYDETECTIONEXE: enableCustomProxyDetection'; this reads it as MSI name plus EXE name, as the page's prose confirms for other rows (ENABLESSO or enableSSO, INSTALLWEBVIEW2 or installWebView2) and its note that MSI and EXE names differ. No source writes this MSI name on its own.

Not known (open gaps):
- Whether an install parameter can be changed without reinstalling [gap:zcc.install.precedence:change-after-install]: settled by lab-test or support-ticket. Blocks: advice on changing a parameter such as cloudName or useLWFDriver across a fleet

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.install.windows-driver.md (Windows filter driver install parameters (LWF))
