# Cellular deployment depends on Cloud & Branch Connector super admin credentials (zscaler-cellular.deployment-credentials)
Also called: cellular deployment credentials; cellular branch connector api key; cellular configuration page; cellular connectivity after password change; cellular super admin

Cellular Edge deployment runs on Cloud & Branch Connector, so it holds a copy of that product's admin credentials.

**What is stored.** Zscaler needs the organization's Cloud & Branch Connector credentials to deploy the Cellular service across regions. [zscaler-cellular.deployment-credentials:cbc-credentials-required] The Cellular Configuration page takes the username and password of the Cloud & Branch Connector Admin Portal super admin and the Cloud & Branch Connector API key, copied from the Cloud & Branch Connector API page. [zscaler-cellular.deployment-credentials:config-fields]

**Rotation.** If the Cloud & Branch Connector super admin credentials change, they must be updated on the Cellular Configuration page; not doing so can disrupt service and the connectivity of cellular devices using Zscaler SIMs. [zscaler-cellular.deployment-credentials:stale-credentials] Whether anything other than super admin credentials works is open [gap:zscaler-cellular.deployment-credentials:credential-model].

**Related.** The Cloud & Branch Connector API key and sign-in are described in [Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds](kb:cloud-connector.api.authentication).

What to check:
1. Whether the Cloud & Branch Connector super admin password was changed without updating the Cellular Configuration page, when SIM devices lose connectivity.

Not known (open gaps):
- Whether the super-admin credential requirement has an alternative [gap:zscaler-cellular.deployment-credentials:credential-model]: settled by source-read or support-ticket. Blocks: advising on rotating or scoping the credentials Cellular deployment uses

Area: zscaler-cellular.deployment-credentials, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.deployment-credentials.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.api.authentication.md (Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds): Zscaler needs the organization's Cloud & Branch Connector credentials to deploy the Cellular service across regions. [zscaler-cellular.deployment-credentials:cbc-credentials-required]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zscaler-cellular/zscaler-cellular.overview.md (Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy)
