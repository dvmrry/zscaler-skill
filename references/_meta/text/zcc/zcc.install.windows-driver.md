# Windows filter driver install parameters (LWF) (zcc.install.windows-driver)
Also called: useLWFDriver; USELWFDRIVER; LWFBootStart; LWFBOOTSTART; installLWFDriver; INSTALLLWFDRIVER; reinstallDriver; REINSTALLDRIVER; lightweight filter driver; tunnel driver type ignored

Four Windows parameters install, enable, start and repair Client Connector's filter driver.

LWFBootStart (MSI `LWFBOOTSTART`) sets the Zscaler Lightweight Filter (LWF) driver's start type to Boot; useLWFDriver (MSI `USELWFDRIVER`) enables the packet filter-based driver; installLWFDriver (MSI `INSTALLLWFDRIVER`) installs a high-performance NDIS 6-based LWF driver; reinstallDriver (MSI `REINSTALLDRIVER`) forces the driver to be reinstalled even when one is installed, for problems with the current driver. All four default to disabled. [zcc.install.windows-driver:driver-switches]

**Install-time choice beats the console.** useLWFDriver overrides the Tunnel Driver Type selected in forwarding profiles. [zcc.install.windows-driver:uselwf-overrides] From 4.8, Client Connector for Windows always uses the packet filter-based driver whatever the profile says: [Client Connector 4.8 and later for Windows does not use the route-based driver: it always uses the packet filter-based driver, whatever the profile says.](kb:zcc.forwarding-profiles.internet-actions:driver-48). Whether the forwarding profile's own driver setting then has any effect, and how the choice is undone, is open [gap:zcc.install.windows-driver:override-reversal]. The forwarding profile side is described in [Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None](kb:zcc.forwarding-profiles.internet-actions).

**Open points.** Whether boot start is what a machine tunnel needs at the Windows login screen is open [gap:zcc.install.windows-driver:boot-start-purpose]. Whether installLWFDriver installs the driver without turning it on is open [gap:zcc.install.windows-driver:install-versus-enable].

What to check:
1. When the Tunnel Driver Type set in a forwarding profile seems ignored on Windows, whether the device was installed with useLWFDriver.

Not known (open gaps):
- How the useLWFDriver override behaves and is undone [gap:zcc.install.windows-driver:override-reversal]: settled by lab-test or support-ticket. Blocks: advice on moving a fleet installed with useLWFDriver to a different driver
- Whether LWF boot start is required for machine tunnels [gap:zcc.install.windows-driver:boot-start-purpose]: settled by lab-test or source-read. Blocks: machine tunnel troubleshooting on devices using the LWF driver
- Whether installLWFDriver installs the driver without activating it [gap:zcc.install.windows-driver:install-versus-enable]: settled by lab-test. Blocks: which LWF switches a deployment needs

Area: zcc.install, its subjects in references/_meta/spine/zcc/zcc.install.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None): useLWFDriver overrides the Tunnel Driver Type selected in forwarding profiles. [zcc.install.windows-driver:uselwf-overrides]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.install.precedence.md (Install parameters versus console settings: which wins, and what survives an update)
- see-also references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)
