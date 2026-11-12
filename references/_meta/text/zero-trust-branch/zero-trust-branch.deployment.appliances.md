# Which Zero Trust Branch appliance models exist, how they mount and what their ports do (zero-trust-branch.deployment.appliances)
Also called: ZT400; ZT600; ZT800; ZT8010; ztb physical port mapping

Mounting options: ZT400 rack posts via rack mount kit (by request only); ZT600 rack posts via rack mount kit; ZT800 rack posts via rack mount kit or wall via wall mount kit (wall kit by request only); ZT8010 rack posts via ear brackets. [zero-trust-branch.deployment.appliances:mount-options] In the ZT400, ZT600 and ZT800 rack-mount procedures, Zscaler recommends installing a shelf in the rack to support the appliance. [zero-trust-branch.deployment.appliances:shelf-recommendation] The deployment hub is [How a Zero Trust Branch appliance is deployed: activation, ZTP, virtual machines, mainland China, upgrades and admin roles](kb:zero-trust-branch.deployment).

**Specifications.** Appliances list operating temperature 32 to 104°F (0 to 40°C), non-operating -4 to 150°F (-20 to 65°C), relative humidity 5 to 90% operating and 5 to 95% non-operating, and altitude 5,000 feet operating and 50,000 feet non-operating. [zero-trust-branch.deployment.appliances:environmental-specs] Typical power: ZT400 12W idle/20W full load, ZT600 21W/29W, ZT800 24W/43W, ZT8010 107.8W/225.5W. [zero-trust-branch.deployment.appliances:power-specs] The ZT8010 has several ports, including 10x 1GbE RJ45 ports and 8x 10G SFP+ ports, and supports redundant PSUs. [zero-trust-branch.deployment.appliances:zt8010-ports] On the ZT8010, a continuous beep indicates the second power source is unplugged or faulty; pressing the round button near the power supplies silences it, as does connecting the second power source. [zero-trust-branch.deployment.appliances:zt8010-psu-alarm] Which model has the redundant power supply and fan cannot be read from the merged table cells [gap:zero-trust-branch.deployment.appliances:specs-table-merged-cells].

**Physical ports.** ZT400: port 1 GE1 Management, port 2 GE2 LAN or WAN, port 3 GE3 WAN, port 4 GE4 LAN or HA (when running in a cluster). [zero-trust-branch.deployment.appliances:zt400-ports] ZT600: GE1 Management, GE2 and GE3 LAN, GE4 LAN or HA (in a cluster), GE5 and GE6 WAN. [zero-trust-branch.deployment.appliances:zt600-ports] ZT800: GE1 1G SFP LAN, GE2 1G SFP WAN, GE3 Management, GE4 LAN or HA (in a cluster), GE5 and GE6 LAN, GE7 and GE8 WAN. [zero-trust-branch.deployment.appliances:zt800-ports] ZT8010: GE1 Management, GE2 WAN, GE3 LAN, GE4 LAN or HA (in a cluster), GE5 and GE6 LAN, XE7 to XE10 10G SFP+ WAN, GE11 to GE14 LAN, XE15 to XE18 10G SFP+ LAN. [zero-trust-branch.deployment.appliances:zt8010-port-map]

**Interfaces in HA.** The deployment page's table of interfaces used in an HA deployment lists Management as GE1* on ZT400, ZT600 and ZT8010 and GE3* on ZT800, HA as GE4* on all four models, and WAN as GE3* on ZT400, where an asterisk marks a fixed interface. [zero-trust-branch.deployment.appliances:interface-roles-by-model] The deployment page's interface table names some ports differently from the port mapping [gap:zero-trust-branch.deployment.appliances:deployment-table-vs-port-mapping].

What to check:
1. Which appliance model is deployed, since the mounting options, WAN, LAN and management ports differ by model.

Not known (open gaps):
- Which models other than the ZT8010 have the redundant power supply and fan, and the maximum power of the ZT400 and ZT600 [gap:zero-trust-branch.deployment.appliances:specs-table-merged-cells]: settled by source-read
- Why the deployment page's interface table and the port mapping name some ports differently [gap:zero-trust-branch.deployment.appliances:deployment-table-vs-port-mapping]: settled by source-read or lab-test

Area: zero-trust-branch.deployment, its subjects in references/_meta/spine/zero-trust-branch/zero-trust-branch.deployment.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.deployment.md (How a Zero Trust Branch appliance is deployed: activation, ZTP, virtual machines, mainland China, upgrades and admin roles)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zero-trust-branch/zero-trust-branch.overview.md (Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed)
- see-also references/_meta/text/zero-trust-branch/zero-trust-branch.deployment.high-availability.md (How Zero Trust Branch high availability works: standard HA, Enhanced WAN Edge HA, VRRP and ebond bonding interfaces)
