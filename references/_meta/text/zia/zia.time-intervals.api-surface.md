# Time interval API operations, updates and activation (zia.time-intervals.api-surface)
Also called: timeIntervals endpoint; time interval put replace; update time interval drops fields; get time interval by name; time interval activation; list time intervals paging

Time intervals have list, add, get, update and delete operations: GET and POST `/timeIntervals`, and GET, PUT and DELETE `/timeIntervals/{Id}`. The specification lists no `/timeIntervals/lite` path. [zia.time-intervals.api-surface:operations] The list takes `search`, `page` and `pageSize` (default 100). [zia.time-intervals.api-surface:list-params] The other object, time windows, is in [Time windows versus time intervals](kb:zia.time-intervals.time-windows). Paging behavior of the Go SDK list calls is in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination). The Go SDK looks up an interval by name by listing every interval and matching case-insensitively. [zia.time-intervals.api-surface:go-name-lookup]

**Updates.** Update is a PUT to `/timeIntervals/{Id}`, and the MCP update tool describes it as a PUT-replace that backfills omitted fields. [zia.time-intervals.api-surface:update-is-put] A caller using the SDK directly gets no such backfill, since the Go update sends the interval object it is given, so it should send the whole object. [zia.time-intervals.api-surface:sdk-caller-sends-whole-object] The API response to a partial PUT is gap `omitted-field-on-put`, the same open question as [How the Go SDK encodes ZIA writes (omitted zero values, empty responses)](kb:zia.sdk-go.write-encoding) raises for rules.

**Activation.** The MCP create and update tools label time interval writes "Activate after", so treat interval changes as staged until activation. [zia.time-intervals.api-surface:activation-needed] ZIA activates pending changes automatically when an API session ends (session timeout of 5 to 20 minutes, default 5) or an admin logs out, so a time interval write staged by the API can go live before it is explicitly activated. [zia.time-intervals.api-surface:session-end-activates] The Terraform provider's own activation behavior is in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation).

What to check:
1. Whether a delay is relied on as a safety boundary, since a session ending activates pending interval writes.

Inferred, not quoted (say so when an answer rests on one):
- [zia.time-intervals.api-surface:sdk-caller-sends-whole-object] Tier B: Advice resting on the MCP tool's PUT-replace description and the Go UpdateWithPut call; whether the API clears an omitted field is gap omitted-field-on-put.

Not known (open gaps):
- Whether a PUT that omits a field clears it on a time interval [gap:zia.time-intervals.api-surface:omitted-field-on-put]: settled by lab-test

Area: zia.time-intervals, its subjects in references/_meta/spine/zia/zia.time-intervals.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- decided-by references/_meta/text/zia/zia.time-intervals.evaluation.md (What a rule does outside its time interval), from zia.time-intervals: A rule with a time interval does not trigger when the resolved time falls outside the interval. [zia.time-intervals.evaluation:outside-window-generalized]
- decided-by references/_meta/text/zia/zia.time-intervals.timezone.md (Which time zone a time interval is evaluated in), from zia.time-intervals: If the user's traffic comes from a known location, a time-bound policy is applied on the time zone configured for that location. [zia.time-intervals.timezone:known-location]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.time-intervals: An out-of-window rule yields no verdict of its own: evaluation continues down the ordered list, so an allow rule limited to business hours stops allowing after hours and the outcome depends on the rules below it, ending at the default rule. [zia.time-intervals.evaluation:falls-through]
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zia/zia.sdk-go.write-encoding.md (How the Go SDK encodes ZIA writes (omitted zero values, empty responses))
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)
- links-to references/_meta/text/zia/zia.time-intervals.time-windows.md (Time windows versus time intervals)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/time-intervals.md (config type)
- see-also references/_meta/text/zia/zia.time-intervals.schema.md (Time interval fields: days, minutes and the single window)
