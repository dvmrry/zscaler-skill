# Understanding Sublocations

**Source:** https://help.zscaler.com/zia/understanding-sublocations
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399271, revision 3244484

---

Sublocations enable an organization to create new locations that reference IP addresses that are encapsulated within a GRE or IPSec tunnel, or that are passed to the Zscaler service through X-Forwarded-For (XFF) headers.
For example, an organization can define one sublocation for its corporate network and another sublocation for its guest network, even if their traffic goes through the same GRE or IPSec tunnel. The organization can then use these sublocations to do the following:
- Implement different policies based on IP addresses.
- Enforce authentication on the internal corporate network, while disabling it for the guest network.
- Enforce bandwidth control for sublocations while ensuring that unused bandwidth remains available at the parent location.
- Provide reporting information for different internal networks or offices when they share the same egress IP address.
Key considerations while using sublocations:
- Sublocations cannot have overlapping IP addresses within a location.
- Sublocations can reference IP address ranges (e.g., 10.10.20.2 to 10.10.20.250).
- After you add a sublocation, the Zscaler service automatically creates a sublocation named **other** on the Locations page. The **other** sublocation is created, by default, for IP addresses that are sent to the cloud from a location that is not already defined in the sublocation. You can rename the **other** sublocation if desired.
- If the **Enable IPv6** option is enabled for your location, the Zscaler service automatically creates a sublocation named **other6** in addition to the **other** sublocation. You can rename the **other6** sublocation if desired.
- See image.
- After you add a sublocation to a location created in the Zscaler Admin Console, the **Workload traffic type** and **Workload Traffic Group** are applied as the default location type and the location group for the sublocation, respectively.
- When you add a sublocation to an **Extranet**-type location, the **Extranet** location type is applied automatically. The extranet sublocation uses the DNS server and traffic selector of the extranet location it was created for. To learn more, see Configuring an Extranet.
- You can use a previously deleted sublocation name when you create a new sublocation, but you cannot use a deleted name when you edit an existing one. To learn more, see Naming Locations & Sublocations.
- Although IP addresses within a location cannot overlap, the same IP address can exist in multiple locations.
To learn more, see Viewing Sublocations and Configuring Sublocations.
