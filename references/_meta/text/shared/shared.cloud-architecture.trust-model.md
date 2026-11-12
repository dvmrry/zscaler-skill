# Private Access certificate trust: tenant CAs, Zscaler PKI, pinning and key custody (shared.cloud-architecture.trust-model)
Also called: zpa pki; zpa certificate model; mutually pinned tls; tenant certificate authority; certificate pinning zpa; cross-tenant isolation

Private Access authenticates both ends of every connection with certificates from two different authorities. [Zscaler Client Connector and App Connectors authenticate with the organization's public key infrastructure (PKI); Public Service Edges and Private Service Edges authenticate with Zscaler's PKI. The Z-Tunnel is further authenticated using SAML 2.0.](kb:zpa.private-service-edges.data-path:pki-roles)

**Who accepts whom.** Private Access accepts Zscaler Client Connector connections only with a client certificate signed by a CA associated with the tenant, and Client Connector and App Connector connect only to Private Access components that present a certificate signed by the Private Access infrastructure PKI. [shared.cloud-architecture.trust-model:mutual-acceptance] The same rule for App Connectors: [Private Access accepts App Connector connections only when the client certificate is signed by a CA associated with the tenant.](kb:zpa.app-connectors.enrollment:cert-signed-by-tenant-ca). [Because client and server use pinned certificates, it is cryptographically impossible for Private Access to experience a Man-in-the-Middle (MITM) attack: client certificates are verified against the organization's CA and server certificates against Zscaler's CA.](kb:zpa.private-service-edges.data-path:no-mitm-pinning) [Public and Private Service Edges use only public keys to authenticate remote systems and clients; no private key is stored or used except the Service Edge's own identity.](kb:zpa.private-service-edges.data-path:identity-key-only)

**Key custody.** [All Zscaler certificates are signed through an offline-only, air-gapped, signing ceremony.](kb:zpa.app-connectors.enrollment:offline-signing) [Private keys for certificates used in the Private Access infrastructure, including organization-operated systems, never leave the physical device where they were generated.](kb:zpa.app-connectors.enrollment:private-keys-stay-on-device) The private keys for each organization's CA, which the article expands as Central Authority, are stored in encrypted format (AES256-GCM). [shared.cloud-architecture.trust-model:tenant-ca-keys-encrypted]

**What follows.** Because client certificates are verified against a CA associated with the tenant, a Client Connector or App Connector certificate issued for one tenant is not expected to authenticate to another tenant's Private Access. [shared.cloud-architecture.trust-model:per-tenant-isolation] A connection whose certificate does not verify is rejected before any request crosses it, so such a failure points to the certificate chain, an interception device or the clock rather than to access policy. [shared.cloud-architecture.trust-model:chain-before-policy]

**Expiry and clocks.** How long a connector certificate lasts and how it renews is open: [Connector certificate validity and renewal](kb:zpa.app-connectors.enrollment:certificate-validity-window). A wrong connector clock delays enrollment: [If the connector's clock does not match the Private Access back-end, the certificate can be not yet valid, delaying enrollment; the fix is a correct, maintained time on the connector.](kb:zpa.app-connectors.enrollment:clock-skew-delays-cert). An SSL-intercepting device in the path breaks the pinned connection: [Private Access does not support SSL interception: a device that intercepts SSL between the Private Service Edge and the Zscaler cloud makes the connection fail. The Private Access domains or IP addresses must be allowlisted on the interception device so that the Private Service Edge and Zscaler URLs are bypassed.](kb:zpa.private-service-edges.data-path:ssl-interception-unsupported).

What to check:
1. When a connector or client cannot connect, check certificate trust (interception device, clock, enrollment) before access policy.

Inferred, not quoted (say so when an answer rests on one):
- [shared.cloud-architecture.trust-model:per-tenant-isolation] Tier B: Inference from the per-tenant signing scope; no source states the cross-tenant case.
- [shared.cloud-architecture.trust-model:chain-before-policy] Tier B: Inference: all component traffic runs inside the mutually verified TLS connection, so policy cannot be reached without it. No source describes the failure sequence.

Area: shared.cloud-architecture, its subjects in references/_meta/spine/shared/shared.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment)
- links-to references/_meta/text/zpa/zpa.private-service-edges.data-path.md (Tunnels, certificates and firewall requirements on the Private Service Edge path)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.cloud-architecture.tunnels.md (Z-Tunnel and Microtunnel: the two tunnel layers of Private Access)
