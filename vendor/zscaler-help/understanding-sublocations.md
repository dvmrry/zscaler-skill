# Understanding Sublocations

**Source:** https://help.zscaler.com/zia/understanding-sublocations
**Captured:** 2026-04-24 via Playwright MCP.

---

Sublocations enable an organization to create new locations that reference IP addresses that are encapsulated within a GRE or IPSec tunnel, or that are passed to the Zscaler service through X-Forwarded-For (XFF) headers.

For example, an organization can define one sublocation for its corporate network and another sublocation for its guest network, even if their traffic goes through the same GRE or IPSec tunnel. The organization can then use these sublocations to:

- Implement different policies based on IP addresses.
- Enforce authentication on the internal corporate network, while disabling it for the guest network.
- Enforce bandwidth control for sublocations while ensuring that unused bandwidth remains available at the parent location.
- Provide reporting information for different internal networks or offices when they share the same egress IP address.

## Key considerations

- Sublocations **cannot have overlapping IP addresses** within a location.
- Sublocations can reference IP address ranges (e.g., `10.10.20.2-10.10.20.250`).

## The `other` sublocation

After you add a sublocation, the Zscaler service automatically creates a sublocation named `other` on the Locations page. The `other` sublocation catches IP addresses sent to the cloud from a location that is not already defined in the sublocation. You can rename `other` if desired.

If the **Enable IPv6** option is enabled for your location, the Zscaler service automatically creates a sublocation named `other6` in addition to `other`. You can rename `other6` if desired.

Although IP addresses within a single location cannot overlap, **the same IP address can exist in multiple locations**.
