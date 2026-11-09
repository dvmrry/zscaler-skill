# ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs (shared.zsdk.applications)
Also called: zsdk application segment; zsdk segment group; zsdk server group; zsdk dynamic server discovery; zsdk device profile; zsdk health reporting; zsdk configuration graph

Double encryption and health reporting are configured per application segment, which groups defined applications based upon access type or user privileges. [shared.zsdk.applications:segment-features-per-segment]

## Application segments

To enable application discovery, an application can be defined as an FQDN in wildcard format or as an IP subnet. [shared.zsdk.applications:application-discovery-format] An application entry can be an FQDN, IP address, local domain or wildcard domain, but not a hyphenated IP address range; a lone wildcard (*) should be the only application in its segment and cannot be defined that way unless approved by Zscaler. [shared.zsdk.applications:application-entry-rules] Names of application segments, segment groups, servers and server groups cannot contain special characters other than periods, hyphens and underscores. [shared.zsdk.applications:object-name-characters] An application segment takes TCP and UDP port ranges (a single port is entered as the same number in From and To), and Zscaler recommends excluding DNS traffic (port 53) from them. [shared.zsdk.applications:segment-ports]

The segment definition steps say to leave Source IP Anchor, Double Encryption, ICMP Access and Bypass during Reauthentication as Disabled and TCP Keepalive blank; the limitations list says that fields recommended to be left at their default setting (e.g., deselected, disabled) do not impact application segments at this time. [shared.zsdk.applications:segment-fields-left-default] Whether Double Encryption affects segments is in dispute [divergence:shared.zsdk.applications:double-encryption-impact]. The Bypass setting of an application segment should have Use Client Forwarding Policy selected, which is the default; the segment list shows whether users can bypass ZSDK to access applications. [shared.zsdk.applications:segment-bypass-default] In the segment list, Double Encryption is disabled by default if a Browser Access-enabled application was defined. [shared.zsdk.applications:segment-double-encryption-default]

Health reporting for an application segment is Continuous, On Access (the default) or None; Continuous cannot be chosen for applications configured with more than 10 ports or for a wildcard-only application, and an application with client hostname validation enabled is not shown on the Health dashboard. [shared.zsdk.applications:health-reporting] In the App Connector Selection Method description, the limit for the number of targets that check the health of the defined applications at the App Connector is 6,000; beyond it, Health Reporting is set to None and a random selection of App Connectors is chosen. [shared.zsdk.applications:health-check-target-limit] The Client Connector can receive CNAME setting is enabled by default, so Zscaler Client Connector receives CNAME DNS records from the App Connector; disabling it means App Connectors do not send CNAME DNS records. [shared.zsdk.applications:cname-resolution] The client named in that setting is not confirmed [gap:shared.zsdk.applications:client-connector-wording]. The App Connector Selection Method defaults to Closer to User; Closer to Application selects the App Connector with the shortest round-trip time towards the requested application, supports only TCP applications, and cannot be enabled when Health Reporting is None. [shared.zsdk.applications:connector-selection-method]

The delete action is unavailable for an application segment that is referenced in a segment group and has a policy configured; an admin must remove the link to the policy first. [shared.zsdk.applications:segment-delete-blocked] When multiple server groups are selected while editing an application segment, only one is saved, because multiple server groups mapped to the same application segment can cause the console to disconnect. [shared.zsdk.applications:multiple-server-groups-edit]

## Segment groups

An application segment can belong to only one segment group; the Clear All button is hidden when more than 500 application segments are attached to a segment group. [shared.zsdk.applications:segment-group-membership] The maximum number of segment groups is in [ZSDK ranges and limitations per organization](kb:shared.zsdk.limits).

## Servers and server groups

Server groups map applications, via application segments, to servers hosting them, and connect to users via App Connector groups; Zscaler recommends grouping servers that can host the same applications. [shared.zsdk.applications:server-group-purpose] Explicitly defined servers cover explicit server management, load balancers in front of multiple applications, and no-default-route or no-external-DNS environments with a transparent proxy. [shared.zsdk.applications:server-explicit-use-cases] A server group with Dynamic Server Discovery enabled lets ZSDK discover the appropriate servers for applications as users request them, so it is created empty and the Servers step is skipped when it is selected for an application segment. [shared.zsdk.applications:dynamic-server-discovery] If a server is disabled, it cannot be found. [shared.zsdk.applications:disabled-server]

## Device profiles

A device profile is a set of criteria evaluated when devices access mobile applications; ZSDK evaluates it on every access request, re-evaluates existing connections when the profile is updated, and builds new connections on the updated profile. [shared.zsdk.applications:device-profile-evaluation] The device profile management article says device profiles are evaluated when ZSDK Private Service Edges receive access requests to application segments. [shared.zsdk.applications:device-profile-evaluator] Where evaluation runs is in dispute [divergence:shared.zsdk.applications:device-profile-evaluation-location]. A device profile criterion is UUID (selected by default), Hardware Identifier, Hardware Model or OS Version, and the same criterion can be entered several times with different values. [shared.zsdk.applications:device-profile-criteria] The value formats a criterion accepts are open [gap:shared.zsdk.applications:device-profile-value-format].

## Configuration graphs

A configuration graph shows a segment group, application segment, server group, App Connector group and App Connector. [shared.zsdk.applications:configuration-graph]

What to check:
1. Whether an application entry is an FQDN, IP address, local domain or wildcard domain rather than a hyphenated IP range, and whether a lone wildcard has Zscaler's approval.
2. Whether the segment's Health Reporting setting is compatible with its ports and wildcard entries, and with the App Connector Selection Method.
3. Whether the application segment is referenced in a segment group and has a policy configured when its delete action is unavailable.

Sources disagree (name both sides):
- Whether Double Encryption affects application segments. [divergence:shared.zsdk.applications:double-encryption-impact]
  - zscaler-help: The application segment article lists Double Encryption among the fields to leave as Disabled and says these fields do not impact application segments at this time.
  - zscaler-help: The App Connector throughput article says double encryption changes throughput and the number of App Connectors needed (2 to 3 without it, 4 to 6 with it, for a 1 Gbps connection).
  Impact: A sizing or segment review cannot treat Double Encryption as inert, or as a per-segment feature that changes capacity, from one page alone.
- Where a device profile is evaluated. [divergence:shared.zsdk.applications:device-profile-evaluation-location]
  - zscaler-help: The About Device Profile article says the criteria are evaluated on devices when they access mobile applications.
  - zscaler-help: The Managing Device Profiles article says the criteria are evaluated when ZSDK Private Service Edges receive access requests to application segments.
  Impact: A device profile check cannot say whether the evaluation runs on the device or on a Private Service Edge from one page alone.

Not known (open gaps):
- Which client the Zscaler Client Connector wording on the CNAME setting refers to [gap:shared.zsdk.applications:client-connector-wording]: settled by source-read or lab-test
- What values the Hardware Identifier, Hardware Model and OS Version criteria accept [gap:shared.zsdk.applications:device-profile-value-format]: settled by lab-test or source-read

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.zsdk.limits.md (ZSDK ranges and limitations per organization)
