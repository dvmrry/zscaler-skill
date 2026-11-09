# Performance runbook: collecting and reading a WinMTR (zia.troubleshooting.performance-runbook.mtr)
Also called: WinMTR; MTR to the proxy IP

**Collecting.** The runbook collects a forward MTR with WinMTR, targeting the Proxy IP address taken from the ip.zscaler.com output (first line), with Resolves name unchecked so all hop IPs show. [zia.troubleshooting.performance-runbook.mtr:winmtr-collection] For Z-Tunnel 2.0 the runbook collects the MTR after logging out of Client Connector; for IPSec and GRE it either exempts ICMP at the edge device or exempts one system from the tunnel configuration so its traffic goes directly over the internet. [zia.troubleshooting.performance-runbook.mtr:mtr-forwarding-method] The runbook says to keep the MTR running for at least 300 packets, 300 being the minimum, then save with Export Text. [zia.troubleshooting.performance-runbook.mtr:mtr-minimum-packets]

**Reading.** When analysing MTR latency the runbook says ICMP rate limiting can look like latency and to consider the latency to the final hop. [zia.troubleshooting.performance-runbook.mtr:mtr-latency-analysis] When analysing MTR packet loss the runbook says the loss reported between hops 1 and 2 is likely rate limiting on the second hop, says loss continuing over more than one hop is possibly packet loss or routing issues, says to trust later hops when loss differs, and notes return-route problems can also explain loss. [zia.troubleshooting.performance-runbook.mtr:mtr-loss-analysis] [gap:zia.troubleshooting.performance-runbook.mtr:mtr-screenshots]

Not known (open gaps):
- What the runbook's MTR and Cloud Performance Test output images show [gap:zia.troubleshooting.performance-runbook.mtr:mtr-screenshots]: settled by source-read

Area: zia.troubleshooting, its subjects in references/_meta/spine/zia/zia.troubleshooting.json
