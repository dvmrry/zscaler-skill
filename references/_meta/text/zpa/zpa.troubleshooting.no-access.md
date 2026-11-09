# A user cannot reach a private application at all (zpa.troubleshooting.no-access)
Also called: cant reach app; user cannot access private application; zpa no access; zpa request never reaches; zpa connection closed policy; zpa no log record for user

The first question is whether the request ever entered ZPA, and the second is what the record says.

**Before ZPA.** Zscaler Client Connector recognizes the internal applications that are available via Private Access (access to them is defined in Private Access policies), intercepts the user requests for them and forwards those requests to the Zero Trust Exchange. [zpa.troubleshooting.no-access:zcc-intercepts-defined-apps] Zscaler Client Connector forwards traffic for internal applications to Private Access and other traffic goes to Internet & SaaS. [zpa.troubleshooting.no-access:other-traffic-elsewhere] A destination that no application segment covers is not forwarded to Private Access. [zpa.troubleshooting.no-access:unmatched-not-forwarded] The client state is not sourced [gap:zpa.troubleshooting.no-access:zcc-active-state].

**Segment match.** Which segment wins, port misses and carve-outs are in [Which application segment a destination maps to when several overlap](kb:zpa.app-segments.matching), and Bypass in [The application segment Bypass setting and how it ranks](kb:zpa.app-segments.bypass). A port miss is described both as a bypass and as a drop [Which application segment a destination maps to when several overlap](kb:zpa.app-segments.matching).

**No record.** A request dropped at the client is [Segment matching and policy search with and without Multimatch](kb:zpa.policy.multimatch); that the absence of a record always means this is not sourced [gap:zpa.troubleshooting.no-access:no-record-means-client-side].

**A record that closed.** The fields are in [What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes](kb:zpa.troubleshooting.log-fields); reading Close together with the Policy field is not sourced [gap:zpa.troubleshooting.no-access:reading-close-and-policy].

**Policy.** Order, first match and the default are in [Evaluation order across ZPA policy types](kb:zpa.policy.evaluation-order). A forwarding bypass that leaves no record, and an empty Policy field on a blocked session, are not sourced [gap:zpa.troubleshooting.no-access:bypass-leaves-no-record].

What to check:
1. Whether the destination host and port are covered by an application segment at all, since traffic outside any segment is not forwarded to Private Access.
2. Which segment is the most granular match and whether the destination port is in it, or whether the request was bypassed or dropped at the client.
3. Whether a more specific segment for the host carved it out of the wildcard segment, and whether the missing port or Multimatch fixes it.
4. Whether any segment for the same FQDN has Bypass set to Always, which then takes precedence.
5. Whether a client forwarding rule bypasses the traffic before access policy is evaluated.
6. Whether a User Activity record exists, then its Policy, ConnectionStatus and Connector fields, noting that the absence of a record is not shown to mean a client-side drop.
7. Which access rule matched first, and that no matching rule means the request is blocked.
8. Whether the connector ID is zero or empty and which session status code accompanies it.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.troubleshooting.no-access:unmatched-not-forwarded] Tier B: Inference: the client intercepts requests for applications defined in Private Access and sends other traffic elsewhere, so a destination outside every segment is not an application defined in Private Access. The sources do not use the phrase 'not in any segment'.

Not known (open gaps):
- Client enrollment and tunnel state [gap:zpa.troubleshooting.no-access:zcc-active-state]: settled by operator-experience
- No log record means a client-side drop [gap:zpa.troubleshooting.no-access:no-record-means-client-side]: settled by lab-test
- Reading a Close record with a Policy value or an empty one [gap:zpa.troubleshooting.no-access:reading-close-and-policy]: settled by lab-test or tenant-data
- Bypass leaves no record; an empty Policy field on a blocked session [gap:zpa.troubleshooting.no-access:bypass-leaves-no-record]: settled by lab-test or tenant-data

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap): A destination that no application segment covers is not forwarded to Private Access. [zpa.troubleshooting.no-access:unmatched-not-forwarded]
- interacts-with references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks): The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- links-to references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types)
- links-to references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch)
- links-to references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
