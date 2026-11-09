# OAuth 2.0 enrollment for ZPA software components and its troubleshooting (zpa.software-components.oauth-enrollment)
Also called: oauth enrollment; oauth enrollment token; oauth_enroll_disable; oauth_enrollment_stats; zpa-oauth.private.zscaler.com; no oauth token on vm

OAuth enrollment is one of two ways to enroll a software component on a Private Access VM image.

**Choosing it.** Software components on Private Access VM images can be enrolled using either OAuth 2.0 tokens or provisioning keys. Zscaler recommends OAuth because it provides better security, with enrollment tokens that expire after two hours and cannot be reused, and ease of deployment. [zpa.software-components.oauth-enrollment:recommended] Private Access VM images automatically have OAuth 2.0 enabled, with the exception of Kubernetes, OpenShift and Docker on supported software component platforms. When started, the image attempts to use OAuth enrollment tokens by default but applies a provisioning key first if one is available, and an updated software component uses a provisioning key if one exists. For existing components that use provisioning keys and should use OAuth, the page says to deploy new Private Access VM images. [zpa.software-components.oauth-enrollment:image-defaults] Unlike provisioning keys, there is no restriction on adding software components to a software component group when OAuth is used for enrollment. [zpa.software-components.oauth-enrollment:no-count-limit]

**Network needs.** The OAuth server only supports IPv4-based communication, so a software component with only an IPv6 address cannot access it. To use OAuth 2.0 the OAuth server FQDN zpa-oauth.private.zscaler.com must be allowlisted and user devices must be allowed to make an outbound connection to it; the IP addresses to allowlist are at config.zscaler.com/private.zscaler.com/zpa for the private.zscaler.com cloud or config.zscaler.com/zpatwo.net/zpa for the zpatwo.net cloud. [zpa.software-components.oauth-enrollment:network]

**When a component does not enroll.** In the OAuth enrollment troubleshooting article, a VM that gets no token is resolved by adding an outbound rule to reach the OAuth service at zpa-oauth.private.zscaler.com. An App Connector or Private Service Edge with only an IPv6 address cannot access the OAuth server and needs an IPv4 address. For a response without a token, the article says requests are most likely timing out and to check whether the request to fetch the OAuth token is blocked. [zpa.software-components.oauth-enrollment:no-token] OAuth enrollment is not activated if a provisioning key is detected on the VM; the article's fix is to remove the provisioning key and restart the zpa-connector, zpa-service-edge, pcc-controller or np-connector service. [zpa.software-components.oauth-enrollment:key-blocks-oauth] The Private Cloud Controller service is named differently from the Manager article's [divergence:zpa.software-components.oauth-enrollment:pcc-service-name]. When the Manager software shows that provisioning details were retrieved successfully but the App Connector is still looking for a provisioning key, the article's fix is to enable the config override flag and remove .oauth_enroll_disable from /opt/zscaler/var. [zpa.software-components.oauth-enrollment:config-override] The flag and the restart command are not described [gap:zpa.software-components.oauth-enrollment:override-flag-and-restart]. OAuth enrollment is not initiated for App Connectors upgrading from version 25.46 and earlier, or Private Service Edge 25.47 or earlier. The article says this is by design, because previous versions of software components are already enrolled and bring their provisioning keys with them when upgrading. [zpa.software-components.oauth-enrollment:upgrade-keeps-key] After 5 unsuccessful enrollment attempts using the OAuth service, the Manager software process waits for 6 hours before trying again, and the article's fix is to manually restart the OAuth service. OAuth enrollment is permanently stopped after 500 consecutive failures, and the article's fix is to delete the oauth_enrollment_stats file from the /opt/zscaler/var directory. [zpa.software-components.oauth-enrollment:retry-limits]

Per-component enrollment is in [App Connector enrollment, certificates and re-enrollment](kb:zpa.app-connectors.enrollment), [Enrolling a Private Service Edge](kb:zpa.private-service-edges.enrollment) and [Network Connector enrollment: OAuth 2.0 tokens and provisioning keys](kb:zpa.vpn.network-connectors.enrollment); the Manager software is in [The Manager software and its updates on ZPA software components](kb:zpa.software-components.manager).

What to check:
1. Whether a provisioning key exists on the VM, since a detected key keeps OAuth enrollment from activating.
2. Whether the component can reach the OAuth server over IPv4 and the FQDN is allowlisted.
3. Whether the enrollment is in the 5-attempt wait or the 500-failure stop, and whether the component was upgraded from a version that keeps its key.
4. Which service name is meant for a Private Cloud Controller, since the pages differ.

Sources disagree (name both sides):
- The Manager software article names the Private Cloud Controller service zpa-pcc, while the OAuth enrollment troubleshooting article lists pcc-controller among the services to restart. [divergence:zpa.software-components.oauth-enrollment:pcc-service-name]
  - zscaler-help: The Private Cloud Controller service is zpa-pcc.
  - zscaler-help: The services to restart are zpa-connector, zpa-service-edge, pcc-controller or np-connector.
  Impact: The pages do not say whether pcc-controller is the same service as zpa-pcc, so the service to restart on a Private Cloud Controller is not settled.

Not known (open gaps):
- The config override flag and the command that restarts the OAuth service [gap:zpa.software-components.oauth-enrollment:override-flag-and-restart]: settled by lab-test or support-ticket

Area: zpa.software-components, its subjects in references/_meta/spine/zpa/zpa.software-components.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment)
- links-to references/_meta/text/zpa/zpa.private-service-edges.enrollment.md (Enrolling a Private Service Edge)
- links-to references/_meta/text/zpa/zpa.software-components.manager.md (The Manager software and its updates on ZPA software components)
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.enrollment.md (Network Connector enrollment: OAuth 2.0 tokens and provisioning keys)
