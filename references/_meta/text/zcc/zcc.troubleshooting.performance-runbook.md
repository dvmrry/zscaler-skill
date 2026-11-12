# How the Client Connector performance troubleshooting runbook classifies slowness by pattern and routes it to its pages (zcc.troubleshooting.performance-runbook)
Also called: Zscaler Client Connector Performance Support Troubleshooting Runbook; client connector performance runbook

**Symptom classes.** In its section on checking UDP throttling and MTU, which is marked Only Z-Tunnel 2.0, the Client Connector performance runbook addresses slowness from ISP throttling of UDP packets and from MTU mismatch reported by users on Z-Tunnel 2.0, and says an MTR trace alone does not identify these. [zcc.troubleshooting.performance-runbook:symptom-classes] ISP UDP throttling is in [Client Connector performance runbook: ISP UDP throttling and moving a user to TLS or the hybrid profile](kb:zcc.troubleshooting.performance-runbook.udp-throttling) and MTU is in [Client Connector performance runbook: MTU, Path MTU Discovery and the temporary Z-Tunnel 1.0 fallback](kb:zcc.troubleshooting.performance-runbook.path-mtu). The Internet & SaaS side is in [How the Internet & SaaS performance troubleshooting runbook scopes a slowness case and routes it to its pages](kb:zia.troubleshooting.performance-runbook).

**Patterns.** For slowness on a particular OS type, the runbook asks about an OS upgrade (test on the previous OS), a newly installed or updated third-party security or VPN app (disable its services), the Client Connector process allowlist, and high CPU utilization. [zcc.troubleshooting.performance-runbook:os-pattern] When all users of an organization are slow after a Client Connector upgrade, the runbook reverts a few workstations to the previously known working version and monitors performance; after a security patch or new software push it reverts that change on a few workstations. [zcc.troubleshooting.performance-runbook:all-users-pattern] For slowness at a particular time of day or day of the week, the runbook lists scheduled big data uploads or downloads and scheduled antivirus scans as possible causes. [zcc.troubleshooting.performance-runbook:time-pattern] For slowness at one office location that is normal on a mobile hotspot or elsewhere, the runbook lists a Zscaler data center issue or maintenance and path congestion (collect Client Connector logs, escalate), and office router, switch or firewall issues (check CPU, memory, throttling policies and monitoring). [zcc.troubleshooting.performance-runbook:office-pattern]

Not known (open gaps):
- What CPU utilization the runbook counts as high [gap:zcc.troubleshooting.performance-runbook:high-cpu-threshold]: settled by source-read or lab-test

Area: zcc.troubleshooting, its subjects in references/_meta/spine/zcc/zcc.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.troubleshooting.performance-runbook.path-mtu.md (Client Connector performance runbook: MTU, Path MTU Discovery and the temporary Z-Tunnel 1.0 fallback)
- links-to references/_meta/text/zcc/zcc.troubleshooting.performance-runbook.udp-throttling.md (Client Connector performance runbook: ISP UDP throttling and moving a user to TLS or the hybrid profile)
- links-to references/_meta/text/zia/zia.troubleshooting.performance-runbook.md (How the Internet & SaaS performance troubleshooting runbook scopes a slowness case and routes it to its pages)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.troubleshooting.md (Troubleshooting Client Connector: from symptom to the subject that holds the answer)
