# SSH traffic in ZIA: what is and is not inspected (zia.ssh-control)
Also called: ssh inspection; scan ssh traffic; ssh tunneling; ssh port 22 firewall; audit ssh sessions; ssh dlp; log ssh commands

1. **SSH payload inspection.** No captured ZIA help page describes inspecting SSH payload. The only ZIA setting the captures tie to SSH is Advanced Threat Protection's SSH Tunneling option. [zia.ssh-control:no-ssh-inspection-article] Why ZIA does not decrypt SSH is open [gap:zia.ssh-control:ssh-decryption-reason]. File Type Control acts on files in HTTP, HTTPS and FTP flows ([File Type Control rule criteria](kb:zia.file-type-control.criteria)), not on SSH sessions.
2. **Gating.** Advanced Threat Protection has an SSH Tunneling setting, Allow or Block, which applies to SSH traffic tunneled over HTTP/S. It is under Unauthorized Communication Protection, next to IRC Tunneling and Anonymizers. [zia.ssh-control:atp-ssh-tunneling] A Firewall Filtering rule can match SSH as a network service ([Network services (port criteria)](kb:zia.firewall.network-services), [Firewall Filtering rule criteria](kb:zia.firewall.criteria)). How the service detects SSH and handles a CONNECT to port 22 is open [gap:zia.ssh-control:firewall-ssh-gating].
3. **Oversight.** Privileged Remote Access reaches servers over RDP, SSH or VNC from a browser without Client Connector. A console is assigned a protocol, domain and port number, and the Application Segment's privileged console protocol defaults to port 22 for SSH. [zia.ssh-control:pra-ssh-consoles] Privileged Remote Access records sessions; recordings are managed under Data Explorer > Privileged Remote Access > Recordings, and downloading a recording requires Session Recordings to be set to Full Access in the admin role. [zia.ssh-control:pra-session-recording] For the product overview see the [Privileged Remote Access: what it is and where each question goes](kb:zpa.pra).

What to check:
1. Whether SSH payload inspection is expected from ZIA, since no ZIA help page documents it.
2. Whether a question about who ran what over SSH is answered by Privileged Remote Access session recording.

Inferred, not quoted (say so when an answer rests on one):
- [zia.ssh-control:no-ssh-inspection-article] Tier B: Rests on an absence. Search: `grep -rn -i -w ssh vendor/zscaler-help/*.md` returns SSH mentions only in ZPA, Privileged Remote Access, decoy, App Connector and appliance pages and in the ATP line cited; none in the ZIA Firewall, IPS Control, SSL Inspection, DLP or File Type Control pages. Other hits are the DNS Control record-type table (an SSHFP row, 'DNS type not mapped by ZS firewall') and the Zero Trust Browser, Zero Trust Branch (`ztb-`) and Cloud Connector (`cbc-`) pages, none of which describe ZIA SSH inspection. The captures are a subset of the help site.

Not known (open gaps):
- How Firewall Filtering gates SSH [gap:zia.ssh-control:firewall-ssh-gating]: settled by lab-test or source-read. Blocks: advising how to allow or block SSH with Firewall Filtering
- Why ZIA does not decrypt SSH [gap:zia.ssh-control:ssh-decryption-reason]: settled by support-ticket or source-read. Blocks: stating confidently that SSH decryption is impossible rather than undocumented

Area: zia.ssh-control, its subjects in references/_meta/spine/zia/zia.ssh-control.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.atp.categories.md (ATP detection categories and what each toggle covers): Advanced Threat Protection has an SSH Tunneling setting, Allow or Block, which applies to SSH traffic tunneled over HTTP/S. It is under Unauthorized Communication Protection, next to IRC Tunneling and Anonymizers. [zia.ssh-control:atp-ssh-tunneling]
- links-to references/_meta/text/zia/zia.file-type-control.criteria.md (File Type Control rule criteria)
- links-to references/_meta/text/zia/zia.firewall.criteria.md (Firewall Filtering rule criteria)
- links-to references/_meta/text/zia/zia.firewall.network-services.md (Network services (port criteria))
- links-to references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes)
