# Requiring authentication per location and sublocation (zia.authentication.location-enforcement)
Also called: auth_required; Enforce Authentication; basic_auth_enabled; digest_auth_enabled; kerberos_auth; location authentication; guest sublocation no auth; enforce authentication

Authentication is demanded where the traffic enters, not tenant-wide. Enforce Authentication (auth_required in Terraform) makes users from that location authenticate. The provider describes it as required when ports are enabled, IP Surrogate is enabled, or Kerberos authentication is enabled. [zia.authentication.location-enforcement:enforce-authentication]

**Sublocations.** Sublocations let authentication be enforced on one network and disabled on another: for example, one sublocation for the internal corporate network enforces it and another for the guest network disables it, even when both go through the same tunnel. [zia.authentication.location-enforcement:sublocation-split] Whether an unset sublocation inherits the parent's value is open [gap:zia.authentication.location-enforcement:sublocation-inheritance]; one setting that is explicitly not inherited is IP Surrogate, in [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip).

**Extra methods at the location.** With Enforce Authentication on, a location can additionally enforce Digest, Basic or Kerberos authentication on all web traffic explicitly forwarded from the location and its dedicated ports, or Proxy JWT authentication on all workload traffic explicitly forwarded from them. The provider's switches are basic_auth_enabled, digest_auth_enabled and kerberos_auth. [zia.authentication.location-enforcement:method-switches] Basic authentication needs the Cloud Service API Security feature, the Hosted DB user repository with form-based authentication, hosted users created or imported from CSV, and users enrolled through the authenticatedSession and users/<userid>/enroll APIs. Credentials travel in clear text, so forward over an IPSec or encrypted tunnel on the public internet. [zia.authentication.location-enforcement:basic-auth-caveats] Enrolling users for Basic has its own provider defects, covered in [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes) rather than here.

**Without enforcement.** When Enforce Authentication is off, a location can instead show unauthenticated users a caution notification or require acceptance of an Acceptable Use Policy. [zia.authentication.location-enforcement:unauth-options] What such traffic is judged as is in [What happens to traffic with no user identity](kb:zia.authentication.unauthenticated-traffic).

Location definitions are in [ZIA locations, sublocations and location groups](kb:zia.locations) and [Sublocations: what they are, the auto-created other sublocations, naming and limits](kb:zia.locations.sublocations).

What to check:
1. The effective Enforce Authentication value on the sublocation the traffic maps to, not only the parent.
2. Whether the traffic is explicitly forwarded, since the per-method switches apply to explicitly forwarded traffic.

Not known (open gaps):
- Whether a sublocation inherits the parent's authentication setting and which value wins [gap:zia.authentication.location-enforcement:sublocation-inheritance]: settled by lab-test. Blocks: predicting auth behavior for a sublocation whose auth_required was never set
- What an unauthenticated browser sees at an auth-required location [gap:zia.authentication.location-enforcement:http-redirect-behavior]: settled by lab-test. Blocks: explaining a login loop or error page on HTTPS

Area: zia.authentication, its subjects in references/_meta/spine/zia/zia.authentication.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity): When Enforce Authentication is off, a location can instead show unauthenticated users a caution notification or require acceptance of an Acceptable Use Policy. [zia.authentication.location-enforcement:unauth-options]
- scoped-by references/_meta/text/zia/zia.locations.sublocations.md (Sublocations: what they are, the auto-created other sublocations, naming and limits): Sublocations let authentication be enforced on one network and disabled on another: for example, one sublocation for the internal corporate network enforces it and another for the guest network disables it, even when both go through the same tunnel. [zia.authentication.location-enforcement:sublocation-split]
- depends-on references/_meta/text/zia/zia.ad-integration.provisioning-methods.md (ZIA provisioning methods and which authentication each allows), from zia.authentication: Each provisioning method allows only some authentication methods. SCIM: SAML only. Hosted User Database: passwords (default), Kerberos, one-time link, one-time token. Directory server synchronization: LDAP BIND, one-time link, one-time token. ZAB: Hosted User Database, SAML, LDAP BIND, one-time link, one-time token. [zia.ad-integration.provisioning-methods:auth-pairing]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work): Kerberos is supported only for traffic forwarded in explicit mode (a PAC file points the browser at the service). It is not supported for transparent forwarding through a GRE or IPSec tunnel when the browser is not using a PAC file, and users must already be provisioned: Kerberos authenticates, it does not provision. [zia.authentication.methods:kerberos-explicit-only]
- scoped-by references/_meta/text/zia/zia.locations.inheritance.md (Which location settings a sublocation has of its own and which it takes from the parent): Enforce Authentication is a per-sublocation setting, which is what lets a corporate sublocation authenticate while a guest sublocation under the same tunnel does not. [zia.locations.inheritance:sublocation-auth-per-sublocation]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.authentication: Authentication is enforced by the location's own setting (`authRequired`, Enforce Authentication), which the service checks when traffic arrives from a known location. [zia.locations.rule-scoping:authentication-is-a-location-setting]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.authentication: A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- links-to references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user)
- links-to references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/types/zia/sublocations.md (config type)
- see-also references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity)
