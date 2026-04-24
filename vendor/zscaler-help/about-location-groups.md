# About Location Groups

**Source:** https://help.zscaler.com/zia/about-location-groups
**Captured:** 2026-04-24 via Playwright MCP.

---

If you have many locations and associated sublocations within your organization, consider using location groups. You can create manual location groups or dynamic location groups:

- **Manual Location Groups** — manually assign any number of locations or sublocations to the group.
- **Dynamic Location Groups** — select the location attributes that locations or sublocations must match to be assigned to the group. A dynamic group automatically updates to include any matching locations or sublocations.

A location or sublocation must match **all** of a dynamic group's location attributes — even when only some of a location's attributes match. For example: a dynamic group with the attributes "name starts with NYC" and "Enable SSL Inspection = on" will include a location named "NYC Office 1" that has Enable SSL Inspection and Enforce Firewall Control enabled.

## Conditions for manual or dynamic groups

- A location can join a location group independently of its sublocations, and a sublocation independently of its parent location.
- A location or sublocation can be a member of **multiple** manual and dynamic location groups.
- Location groups can be used to define the scope of a new or existing admin.
