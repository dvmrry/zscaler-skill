"Can we scan SSH traffic for sensitive data, or log what users type?" has a short answer built from three facts, one of them an absence.

1. **There is no documented SSH payload inspection in ZIA.** {{no-ssh-inspection-article}} Why that is so, and the stronger claim that it cannot be done, are not sourced: see gap `ssh-decryption-reason`. File Type Control acts on files in HTTP, HTTPS and FTP flows ([[zia.file-type-control.criteria]]), not on SSH sessions.
2. **What ZIA does offer is gating.** {{atp-ssh-tunneling}} For SSH on its own port, a Firewall Filtering rule can match SSH as a network service ([[zia.firewall.network-services]], [[zia.firewall.criteria]]). How the service is detected and how a CONNECT to port 22 is handled are open: see gap `firewall-ssh-gating`.
3. **Oversight of SSH sessions is a ZPA Privileged Remote Access feature.** {{pra-ssh-consoles}} {{pra-session-recording}} For the product overview see `references/zpa/privileged-remote-access.md`.

When the question is "who ran what over SSH", the answer is Privileged Remote Access, not a ZIA inspection setting.
