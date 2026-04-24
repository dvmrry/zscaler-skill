# About Public Service Edges for Internet & SaaS

**Source:** https://help.zscaler.com/zia/about-public-service-edges-internet-saas
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — Service Edges — Public Service Edge — About Public Service Edges for Internet & SaaS

Public Service Edges are full-featured secure internet gateways — inline inspection + policy enforcement. Each has two main modules: a **web module** and a **firewall module**. For full pipeline detail see *Understanding Policy Enforcement* (already vendored).

## Key Facts

- Deployed in Zscaler data centers worldwide; handle **hundreds of thousands of concurrent users with millions of concurrent sessions** each.
- Every inspection engine runs **within the Public Service Edge**, **except sandboxing** (which is offloaded to Sandbox servers — see *understanding-zscaler-cloud-architecture.md*).
- **Active-active** deployment for availability and redundancy.
- **No other component processes customer traffic.** Packet data held in memory only for inspection, then forwarded or dropped per policy.
- **No disk storage.** Log data is compressed + tokenized + exported over secure TLS to Log Routers, which direct logs to the geographically-appropriate Nanolog cluster.

## Public Service Edges and the Central Authority

Public Service Edges maintain a **persistent connection to the CA** to download all policy configurations.

**Per-user flow:**
1. New user connects to a Public Service Edge.
2. Public Service Edge sends a policy request to the CA.
3. CA calculates the policies applicable to that user.
4. CA sends the policy to the Public Service Edge as a **highly compressed bitmap**.
5. Policy is **cached** until a policy change is made in the Admin Console.

**Policy change propagation:**
- On any policy change, **all of the organization's cached policies are purged** cloud-wide.
- Zscaler cloud "heartbeats" every second — all nodes are informed of policy changes.
- Any Public Service Edge then pulls the updated policy on the next request from that organization.
- Effect: users using a new Public Service Edge after a policy change use the new policy on next connect.

## Safe Mode (CA Unreachable)

If a Public Service Edge can't reach or download configuration from the CA, it **immediately switches to Safe mode**:

- Enforces all **cached** policies.
- Logs user access for user and location configurations (cached info is still available).
- Attempts to reconnect to CA every second; exits Safe mode on success.
- **Full security inspection still runs.**
- If a user/location policy isn't in the cache: a **default URL policy applies that blocks access to all URLs in the Legal Liability URL Category** (see *About URL Categories*).
- **No authentication is requested in Safe mode.**

## Related Concepts

- **Global (or Ghost) Public Service Edges** — dummy addresses known by every Public Service Edge, used in no-default-route environments. See *About Global Public Service Edges for Internet & SaaS*.
- For on-prem alternatives, see *Understanding Private Service Edge for Internet & SaaS* and *About Virtual Service Edges for Internet & SaaS*.
