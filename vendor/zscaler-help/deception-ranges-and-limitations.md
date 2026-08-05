# Deception Ranges & Limitations — Gen AI and MCP Context

**Source:** https://help.zscaler.com/deception/ranges-and-limitations
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This is a scoped summary of the current rendered ranges-and-limitations article
for the plan and decoy limits relevant to Gen AI and MCP server decoys. The
source article states that values are per organization unless noted otherwise.

## Plan and entitlement boundaries

- The Standard plan includes 20 decoys; the Advanced plan includes 300.
- Gen AI decoys are not supported on the Standard plan and are supported on
  the Advanced plan.
- API Access is not supported on Standard and is supported on Advanced.
- Audit Logs are supported on both plans.
- If a customer changes plans, features outside the active plan are disabled.
- When Deception entitlement is included through an Internet & SaaS (ZIA) or
  Private Access (ZPA) edition, the subscription must contain at least 1,000
  users to claim the entitlement.
- Zscaler directs customers to their Account team or Support to request a
  higher maximum or a plan upgrade.

## Decoy limits

- The number of Decoy Connectors is equal to the number of decoys included in
  the license, subject to system limitations.
- No more than 10 network decoys can have custom services enabled.
- A maximum of five high-interaction containers is allowed per license; those
  containers can be deployed as Threat Intelligence decoys or as network
  decoys using web or custom-Docker services.

## Source boundary

The limits page classifies **Gen AI Decoys** as a plan feature. It does not
publish a separate numeric quota for MCP server decoys or MCP tool calls. API
Access in this table is a Deception plan capability and must not be conflated
with the attacker-facing MCP protocol exposed by a network-decoy service.
