# Configuring ZSDK: registered apps and app keys, segments and access policy (shared.zsdk.configuration)
Also called: zsdk app key; zsdk registered app; zsdk trust binding; zsdk publish app key; zsdk revoke app key; zsdk access policy; zsdk segment group; zsdk token validator; zsdk setup order

The ZSDK configuration guide orders setup in seven steps: 1 register the app to obtain an app key, 2 configure a JSON Web Token validator, 3 add App Connectors, 4 deploy them (install and enroll each to obtain its TLS client certificate), 5 define application segments, 6 add access policy, 7 integrate ZSDK into the app. [shared.zsdk.configuration:setup-order]

## Registered apps and app keys

The mobile app must be registered to obtain an app key before ZSDK is implemented; a registered app provisions a unique app key for each mobile app or environment. [shared.zsdk.configuration:app-key-first] Registering an app takes a name, a description, an Authentication Type that is always One Identity (the identity provider that validates the app's access tokens), and a Trust Binding that sets device re-enrollment frequency: Strong requires more frequent re-enrollment, Loose allows longer intervals. [shared.zsdk.configuration:registration-settings] A new app key is activated by publishing it. Before publishing it can be edited or deleted; after publishing the only action is Revoke, which deactivates the key so it can no longer be used. [shared.zsdk.configuration:key-lifecycle] What a revoke does to tunnels that are already up is open [gap:shared.zsdk.configuration:revoke-live-tunnels], and whether the SDK can reach anything with an unpublished key is open [gap:shared.zsdk.configuration:unpublished-key-tunnels]; the ZSDK API error codes for unpublished and revoked apps are in [ZSDK error codes: SDK errors 9001-9505 and ZSDK API errors 2001-2999](kb:shared.zsdk.error-codes).

## Application segments and segment groups

An application segment defines the applications (back-end services, APIs) to protect with ZSDK; an application is an FQDN, local domain name or IP address defined on a standard set of ports. [shared.zsdk.configuration:application-definition] Each application segment must be placed in a segment group, which lets access policy be configured by segment group. [shared.zsdk.configuration:segment-in-group]

## Access policy

By default, Zscaler blocks users' access to applications and segment groups until policy rules explicitly allow it. [shared.zsdk.configuration:default-block] An access policy rule names the applications or segment groups that client groups can access: a rule with application segments is the documented way to give individual applications different policies, and a rule with segment groups to give a set of applications a similar level of access. [shared.zsdk.configuration:policy-targets] A request must match all the conditions of a rule. The criteria are Applications, Client Types (Prelogin Tunnel or Zero Trust Tunnel), Country Code and Device Profiles. [shared.zsdk.configuration:criteria] Access policy rules use only AND and OR operators. Several application segments in a rule are joined by an implicit OR, as are several segment groups, and application segment and segment group criteria are joined by an explicit OR. [shared.zsdk.configuration:operators] A rule's action is Allow Access, Block Access or Require Approval. [shared.zsdk.configuration:actions] Each rule has a Rule Order number, its policy evaluation order, and ZSDK applies policy rules in the order they are listed. [shared.zsdk.configuration:rule-order] ZSDK uses a first-match principle when evaluating access policies, so in the article's scenario of blocking some users while allowing all others, the block rule must be listed before the allow rule. [shared.zsdk.configuration:first-match-evaluation] How often the token is checked once a tunnel is up is open [gap:shared.zsdk.configuration:token-check-frequency].

In the Add Access Policy window the Rule Action is Allow Access or Block Access, with an optional message to users with blocked access. [shared.zsdk.configuration:rule-action-allow-or-block] The Require Approval action has no configuration field in the captured pages [gap:shared.zsdk.configuration:require-approval-field]. The access policy Client Types are Prelogin Tunnel (certificate valid for 7 days), Zero Trust Tunnel (certificate valid for 6 months) and Web Browser. [shared.zsdk.configuration:client-types-and-certificates] The certificate lifetimes per tunnel type are in dispute [divergence:shared.zsdk.configuration:client-certificate-validity], as is the set of client types [divergence:shared.zsdk.configuration:client-type-set].

Within one criterion type of an access policy rule, multiple application segments, segment groups, client types, country codes or device profiles are joined by an OR Boolean operator. [shared.zsdk.configuration:criteria-or-within-type] An access policy rule name cannot contain special characters other than periods, hyphens and underscores, and the Add Criteria menu only offers criteria types the rule does not already use. [shared.zsdk.configuration:policy-name-and-criteria-menu] The access policy criteria menus say there is no limit to the number of application segments or segment groups that can be selected, while the same article says there are limits to the number of application segments applied to a rule and defers to Ranges & Limitations. [shared.zsdk.configuration:no-limit-on-selectable-segments] Traffic Steering uses an App Connector Selection Method of all App Connector groups for the application or specific App Connector groups or server groups; if all are selected and more than 48 exist, only 48 are used. [shared.zsdk.configuration:traffic-steering] The SAML attribute criterion is not in the criteria list [gap:shared.zsdk.configuration:saml-attribute-criterion].

Application segments, segment groups, servers and device profiles are in [ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs](kb:shared.zsdk.applications); the validators and certificates are in [ZSDK token validators, browser token validators and web server certificates](kb:shared.zsdk.authentication); the Web Browser client type is also in [ZSDK Browser Access: availability, prerequisites, unsupported features and DNS](kb:shared.zsdk.browser-access).

What to check:
1. Whether the app key in the app is published and not revoked.
2. Whether an access policy rule explicitly allows the application segment or its segment group, since access is blocked until one does.
3. Whether the rule's criteria (client type, country code, device profile) all match the request.

Sources disagree (name both sides):
- Which client types (tunnel types) ZSDK has. [divergence:shared.zsdk.configuration:client-type-set]
  - zscaler-help: The About Access Policy article lists two client types, Prelogin Tunnel and Zero Trust Tunnel.
  - zscaler-help: The Managing Access Policies article lists three client types, Prelogin Tunnel, Zero Trust Tunnel and Web Browser.
  - zscaler-help: The April 15, 2025 Platform 2.0 release notes list merging the Prelogin tunnel and Zero Trust tunnel into a User tunnel, which neither access policy article nor the developer reference's tunnel operations mention.
  Impact: A rule review cannot tell from one page which client types exist or whether a User tunnel replaces the Prelogin and Zero Trust tunnel types, so the certificate lifetimes per type may not apply to current releases.
- How long the client certificate issued for a Prelogin tunnel and a Zero Trust tunnel is valid. [divergence:shared.zsdk.configuration:client-certificate-validity]
  - zscaler-help: The developer reference says a Prelogin tunnel's client certificate is valid for 180 days and a Zero Trust tunnel's for 7 days.
  - zscaler-help: The access policy article says a Prelogin Tunnel client certificate is valid for 7 days and a Zero Trust Tunnel's for 6 months.
  Impact: An answer about how long a tunnel's client certificate lasts depends on which page is followed; neither lifetime is confirmed by observed behavior.

Not known (open gaps):
- What revoking an app key does to tunnels already established [gap:shared.zsdk.configuration:revoke-live-tunnels]: settled by lab-test or support-ticket. Blocks: whether revoking a key is an immediate cut-off for running app sessions
- Whether the SDK can start any tunnel with an unpublished app key [gap:shared.zsdk.configuration:unpublished-key-tunnels]: settled by lab-test or source-read. Blocks: diagnosing an app that cannot start tunnels
- Where the Require Approval rule action is configured [gap:shared.zsdk.configuration:require-approval-field]: settled by source-read or lab-test
- Whether SAML attributes are an access policy criterion [gap:shared.zsdk.configuration:saml-attribute-criterion]: settled by source-read or lab-test
- Whether the access token is re-verified at every tunnel establishment [gap:shared.zsdk.configuration:token-check-frequency]: settled by source-read or lab-test. Blocks: reasoning about token expiry and revocation during a session

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.zsdk.applications.md (ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs)
- links-to references/_meta/text/shared/shared.zsdk.authentication.md (ZSDK token validators, browser token validators and web server certificates)
- links-to references/_meta/text/shared/shared.zsdk.browser-access.md (ZSDK Browser Access: availability, prerequisites, unsupported features and DNS)
- links-to references/_meta/text/shared/shared.zsdk.error-codes.md (ZSDK error codes: SDK errors 9001-9505 and ZSDK API errors 2001-2999)
