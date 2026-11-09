# Who a ZDX probe runs for: probing and exclusion criteria (zdx.probes.criteria)
Also called: probing criteria; exclusion criteria; zdx probe criteria; probe and or logic; probe targeting; zdx probe no data; onUsers; excludedUsers

A probe runs only for the users its criteria select, and the two criteria sets use opposite logic. Probing (inclusion) criteria use AND logic across fields: a probe for user John Doe, user group Group B and department Finance has the expression John Doe AND Group B AND Finance. [zdx.probes.criteria:inclusion-and] Exclusion criteria use OR logic and stop probing data from being gathered for what they select: excluding user group Group C and department Finance gives NOT (Group C OR Finance). [zdx.probes.criteria:exclusion-or]

**Several items in one field.** Several items selected within one field combine with OR, in both probing and exclusion criteria: locations San Jose and Los Angeles with user groups Group B and Group C give (San Jose OR Los Angeles) AND (Group B OR Group C), and excluding locations Sacramento and San Francisco and departments Engineering and Finance gives NOT (Sacramento OR San Francisco) AND NOT (Engineering OR Finance). [zdx.probes.criteria:multi-item-or]

**Both sets together.** When probing and exclusion criteria are combined, the exclusion criteria are evaluated first and then the probing criteria: probing Group B in California while excluding Finance and San Jose gives NOT (Finance OR San Jose) AND (Group B AND California). [zdx.probes.criteria:exclusion-first] Under that combined example, a Group B user in California in the Finance department is not probed, a Group B user in San Jose is not probed, and a Group B user elsewhere in California outside Finance is probed. [zdx.probes.criteria:worked-example]

**Operating system.** OS selection is supported for end user probe configurations. [zdx.probes.criteria:os-selection]

**Narrowing and widening.** OR expands results, AND reduces them, and combining inclusion with exclusion criteria decreases probe results; if no results are found, Zscaler recommends reducing the amount of criteria. [zdx.probes.criteria:using-criteria]

**Defaults in the console.** By default the criteria of a probe configured in the console apply all user groups, users, Zscaler locations, location groups, departments and devices in Internet & SaaS, with the maximum number of each selection at 100, and none are excluded. [zdx.probes.criteria:criteria-defaults] If Zscaler location-based inclusion or exclusion criteria are configured, ZDX must be able to determine the device's Zscaler location (location ID), and if the device location can't be determined the probe is skipped. [zdx.probes.criteria:location-unknown-skips] When configuring Web probes for internal applications through Private Access, Configuring a Probe advises probing only the users, user groups and departments that use the application. [zdx.probes.criteria:private-access-advice]

**Collections.** Any application under a collection follows the collection's probing criteria instead of its own probing criteria. [zdx.probes.criteria:collection-overrides] The collections themselves are in [ZDX collections: default collections, membership, ranking, criteria, deletion and limits](kb:zdx.probes.collections).

**In the configuration API.** In the API contract a monitor carries inclusion lists `onUsers`, `onGroups`, `onDepartments`, `onLocations`, `onLocationGroups`, `onGeolocations` and `onDevices`, and matching exclusion lists `excludedUsers`, `excludedGroups`, `excludedDepartments`, `excludedLocations`, `excludedLocationGroups`, `excludedGeolocations` and `excludedDevices`, each an array of at most 100 items. [zdx.probes.criteria:contract-criteria-fields]

What to check:
1. Whether the exclusion criteria, evaluated first, remove the users the probe was meant for when a probe returns no data.
2. Whether every populated inclusion field matches the user, since inclusion fields combine with AND.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.probes.criteria:worked-example] Tier B: Applies the help's expression NOT (Finance OR San Jose) AND (Group B AND California); assumes, as the example implies, that the California location contains San Jose. The help does not walk through individual users.

Area: zdx.probes, its subjects in references/_meta/spine/zdx/zdx.probes.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection), from zdx.probes: The organization's SSL policies do not apply to ZDX synthetic Web probes, while all other policies applicable to regular traffic do; the exception enables caching of responses, without which destination servers would see an excessive surge of probe requests. [zdx.probes:ssl-exempt]
- links-to references/_meta/text/zdx/zdx.probes.collections.md (ZDX collections: default collections, membership, ranking, criteria, deletion and limits)
