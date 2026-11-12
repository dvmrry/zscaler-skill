# ZDX administration API: department and location lookups (zdx.administration)
Also called: zdx administration; zdx admin api; zdx departments; zdx locations; list_departments; list_locations; GetDepartments; GetLocations; zdx config departments; zdx admin users
Former IDs: zdx-09, zdx-10

Despite its name, the ZDX administration API is a lookup of departments and locations used to filter other reads. The help lists it that way, [The ZDX API gives programmatic access to administration (active locations and departments), alerts, software inventory, reports (ZDX Scores for applications and device health metrics and events) and troubleshooting (deep tracing on a user's device).](kb:shared.log-export.zdx:api-scope).

**The two lookups.** The departments lookup gets the configured departments. [zdx.administration:departments-op] The locations lookup gets Zscaler locations, returning all configured locations when no search filter is given. [zdx.administration:locations-op] In the contract both lookups take optional query parameters `from` and `to` (int64 integers) and `q`. [zdx.administration:q-param]

**What the IDs are for.** The department and location IDs these lookups return are the values the report reads take as `dept` and `loc` filters. [zdx.administration:ids-as-filters]

**Not administrator management.** The contract's Administration operations are all reads of departments and locations (and of a department's users); none creates, changes or manages administrator accounts. [zdx.administration:administration-reads-only]

**The configuration area's lookups.** The configuration area has its own directory reads: departments and locations filtered by a search query (other filters are ignored when an `id` is given), a summarized department list of only ID and name, and location groups. [zdx.administration:config-lookups] No SDK calls them, [Neither SDK calls any /v1/config path: the configuration, monitor, collection and directory operations of the contract are reachable only by direct API calls.](kb:zdx.applications:config-no-sdk).

**In the SDKs.** The Python `list_departments` docstring says it 'Returns the list of Admin Users enrolled in the Client Connector Portal', although the method reads `/administration/departments` and the same docstring says it returns configured departments. [zdx.administration:python-departments-docstring] Both SDKs read each department and location as an ID and a name: the Python lookups build the `Administration` model (`id`, `name`) and the Go `Department` and `Location` structs hold `ID` and `Name`, while the contract's department record also carries `comments`, `deleted`, `idpId`, `isForUnauthenticatedUser` and `isNonEditable`. The Python `Departments` and `Locations` models in `common.py`, which also read `num_devices`, are used by the alert models, not by these lookups. [zdx.administration:sdk-records-id-name] The SDKs do not send the same search parameter [divergence:zdx.administration:search-param]. The Python hours shorthand applies to these lookups too, [A `since` value is a number of hours: the decorator sets `to` to the current Unix time and `from` to that time minus the hours times 3,600, unless the caller already set `from` or `to`.](kb:zdx.sdk-python.request-shaping:since-to-epoch).

**Open.** What the time range means for a list of departments or locations is not stated [gap:zdx.administration:time-filter-semantics], and how the search parameters match is open [gap:zdx.administration:q-vs-search].

What to check:
1. Whether a department or location filter uses an ID the lookup returned, rather than a name.
2. Whether a name search sends `q`, the parameter the contract defines, when results look unfiltered.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.administration:ids-as-filters] Tier B: Inferred from matching names and integer ID types: the lookups return objects with integer `id`, and the report operations (for example the application list) take `dept` and `loc` as integer arrays. The contract does not state the link.
- [zdx.administration:administration-reads-only] Tier B: Rests on the eight operations tagged Administration in the captured contract at the pin, all GET: the two lookups above and /v1/config/departments, its summary, a department by ID, a department's users, /v1/config/locations and a location by ID.

Sources disagree (name both sides):
- The lookups' search parameter: the contract defines `q`; the Go departments filter sends `search` (the locations filter has both `search` and `q`); the Python decorator sends a `search` argument as `q`. [divergence:zdx.administration:search-param]
  - api-specs: Both lookups take `q`.
  - sdk-go: The Go departments filter sends `search` and has no `q`.
  - sdk-python: The Python decorator renames `search` to `q`.
  Impact: If the server honors only `q`, a Go department search returns every department rather than the match, while the same search through Python is filtered.

Not known (open gaps):
- What a time range means on the department and location lookups [gap:zdx.administration:time-filter-semantics]: settled by lab-test or source-read. Blocks: complete department and location lists for filters
- How the lookups' search parameters match, and whether `search` is honored [gap:zdx.administration:q-vs-search]: settled by lab-test. Blocks: filtering departments and locations by name

Area: zdx.administration, its subjects in references/_meta/spine/zdx/zdx.administration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.sdk-python.request-shaping.md (How the Python SDK turns ZDX arguments into query parameters and bodies)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.reports.md (Reading ZDX report data: time ranges, paging, users and what the reads return)
