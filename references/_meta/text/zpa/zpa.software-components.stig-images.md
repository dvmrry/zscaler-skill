# STIG-hardened ZPA images: password rules and the 2024 password-expiration issue (zpa.software-components.stig-images)
Also called: stig images; stig password requirements; zsiversion 2024.11; chage -M -1; admin password expired connector; difok

STIG-hardened Private Access images are among the image forms in [App Connector deployment, redundancy and limits](kb:zpa.app-connectors.deployment); their password rules and one expiry issue are here.

**Password rules.** For STIG compliance the page requires passwords to be a minimum of 15 characters, with a minimum change of 8 characters and of 4 character classes (uppercase, lowercase, numbers, special characters are its examples) from the previous password. Its limits are that repeating consecutive characters must not exceed 3 and repeating characters of the same character class must not exceed 4; its table names these settings Maximum Consecutive Repeated Characters (max repeat), Maximum Consecutive Characters of Same Type (max class repeat) and Difference From Previous Password (difok). [zpa.software-components.stig-images:password-rules] The password requirements are relevant for VM platforms (such as VMWare and Nutanix AHV) and hyperscalers (AWS, Azure and GCP) when deploying Private Access components including App Connectors, Private Service Edges, Private Cloud Controllers and Network Connectors. [zpa.software-components.stig-images:password-rules-scope] The page's examples for the two repeat limits do not match the limits [divergence:zpa.software-components.stig-images:repeat-examples].

**The 2024 expiry issue.** STIG images released on November 24, 2024 (AWS and GCP) and December 12, 2024 (Azure and VMware) automatically expire passwords every 60 days for AWS, GCP and Azure, or 95 days (60 days plus a 35-day grace period) for VMware. STIG images released after these dates are not affected. [zpa.software-components.stig-images:expiry-issue] If the password expires without being changed or disabled, admin access to an App Connector or Private Service Edge is no longer available, and the only recovery method is to deploy a new App Connector or Private Service Edge. [zpa.software-components.stig-images:expiry-consequence] An image is affected if ZSIVersion 2024.11 or 2024.12 appears under Host Platform, or under Private Service Edge Host Platform for a Private Service Edge. The page gives two fixes: disable expiry with sudo chage -M -1 followed by the admin username (its example is admin), or set a password with passwd on a new instance and renew it every 60 days; a second instruction on the page says to renew it every 60 or 95 days. [zpa.software-components.stig-images:identify-and-fix] Whether Private Cloud Controller and Network Connector images were affected is open [gap:zpa.software-components.stig-images:pcc-nc-affected].

The hub is [ZPA software components: Manager software, OAuth enrollment, network settings and STIG images](kb:zpa.software-components).

What to check:
1. Whether the image was released on the affected dates and shows ZSIVersion 2024.11 or 2024.12 before its admin password expires.
2. Whether admin access is already lost, in which case a new App Connector or Private Service Edge must be deployed.
3. Which repeat limit applies to a rejected password, since the page's examples and limits differ.
4. Whether a Private Cloud Controller or Network Connector image was affected by the expiry, which no source states.

Sources disagree (name both sides):
- On the STIG password page, the examples given as restricted sit at the stated limit rather than past it, and a further sentence allows the limit's value. [divergence:zpa.software-components.stig-images:repeat-examples]
  - zscaler-help: Repeating consecutive characters must not exceed 3, and aaa (3 repeats) is given as restricted.
  - zscaler-help: Repeating characters of the same character class must not exceed 4, and abcd (4 characters of one class) is given as restricted.
  - zscaler-help: The same character cannot appear more than 3 times consecutively.
  Impact: Whether a password with exactly 3 repeated characters or exactly 4 same-class characters is accepted is not settled by the page.

Not known (open gaps):
- Whether Private Cloud Controller and Network Connector STIG images were affected by the 2024 expiry [gap:zpa.software-components.stig-images:pcc-nc-affected]: settled by support-ticket or lab-test

Area: zpa.software-components, its subjects in references/_meta/spine/zpa/zpa.software-components.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.deployment.md (App Connector deployment, redundancy and limits)
- links-to references/_meta/text/zpa/zpa.software-components.md (ZPA software components: Manager software, OAuth enrollment, network settings and STIG images)
