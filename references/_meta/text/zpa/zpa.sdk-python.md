# The Zscaler Python SDK against ZPA: where its behavior is described (zpa.sdk-python)
Also called: zpa python sdk; zscaler-sdk-python zpa; zpa sdk

Method tables are generated: run `node scripts/kb.mjs surface <query>` for a module's methods and the endpoints they call. These subjects hold the client behavior around them; the API contract itself is in [The ZPA API from a client's side: paths, authentication, paging, limits and wire notes](kb:zpa.api).

**Client.** Credentials, tenant ID and environment variables are in [Python SDK settings for ZPA: credentials, tenant ID, microtenant, environment variables and the legacy client](kb:zpa.sdk-python.client-configuration), and the microtenant parameter in [How the Python SDK sends the microtenant ID on ZPA calls](kb:zpa.sdk-python.microtenant-scoping). Which base path each method uses is in [Which ZPA base path each Python SDK method uses](kb:zpa.sdk-python.endpoint-versions). Return values are in [What Python SDK ZPA calls return: model objects, snake_case dictionaries, bare values and raised errors](kb:zpa.sdk-python.return-shapes), errors in [Where ZPA Python SDK wrappers raise and where they return errors](kb:zpa.sdk-python.error-handling), paging in [Paging through ZPA lists with the Python SDK](kb:zpa.sdk-python.pagination), and retries in [How the Python SDK retries: budget, statuses, waits, re-authentication](kb:shared.sdk-python.retries).

**Helpers.** How ID lists become nested objects is in [How the Python SDK turns ID lists into nested ZPA objects](kb:zpa.sdk-python.id-list-reformatting). Application segments: [Python SDK application segment, Browser Access and by-type helpers: ID remapping, delete, export and update lookups](kb:zpa.sdk-python.application-segment-helpers) and [The two Python Browser Access segment modules and the by-type helper](kb:zpa.sdk-python.browser-access-modules). App Connector groups and schedules: [Python SDK App Connector group and schedule helpers: unmapped ID lists, version profile and schedule keyword names](kb:zpa.sdk-python.connector-helpers). Provisioning keys: [How the Python SDK builds provisioning key calls](kb:zpa.sdk-python.provisioning-keys). Policy: [Python SDK policy rule helpers: policy types, write lock, condition tuples and rule builders](kb:zpa.sdk-python.policy-helpers) and [Python SDK policy group, rule and set controllers](kb:zpa.sdk-python.policy-groups). Log receivers: [Python SDK Log Streaming helpers: client types, log formats and status codes](kb:zpa.sdk-python.lss-helpers). Client-side validation: [Python SDK client-side checks that raise: PRA credentials and approval times, and custom control rules](kb:zpa.sdk-python.validation-helpers). Controllers whose names mislead: [Python SDK controllers whose verbs or names are not what they look like](kb:zpa.sdk-python.small-controllers).

**Go SDK.** Go SDK service functions that return partial results, send wrong keys or reject valid input are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects).

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
- links-to references/_meta/text/zpa/zpa.api.md (The ZPA API from a client's side: paths, authentication, paging, limits and wire notes)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.sdk-python.application-segment-helpers.md (Python SDK application segment, Browser Access and by-type helpers: ID remapping, delete, export and update lookups)
- links-to references/_meta/text/zpa/zpa.sdk-python.browser-access-modules.md (The two Python Browser Access segment modules and the by-type helper)
- links-to references/_meta/text/zpa/zpa.sdk-python.client-configuration.md (Python SDK settings for ZPA: credentials, tenant ID, microtenant, environment variables and the legacy client)
- links-to references/_meta/text/zpa/zpa.sdk-python.connector-helpers.md (Python SDK App Connector group and schedule helpers: unmapped ID lists, version profile and schedule keyword names)
- links-to references/_meta/text/zpa/zpa.sdk-python.endpoint-versions.md (Which ZPA base path each Python SDK method uses)
- links-to references/_meta/text/zpa/zpa.sdk-python.error-handling.md (Where ZPA Python SDK wrappers raise and where they return errors)
- links-to references/_meta/text/zpa/zpa.sdk-python.id-list-reformatting.md (How the Python SDK turns ID lists into nested ZPA objects)
- links-to references/_meta/text/zpa/zpa.sdk-python.lss-helpers.md (Python SDK Log Streaming helpers: client types, log formats and status codes)
- links-to references/_meta/text/zpa/zpa.sdk-python.microtenant-scoping.md (How the Python SDK sends the microtenant ID on ZPA calls)
- links-to references/_meta/text/zpa/zpa.sdk-python.pagination.md (Paging through ZPA lists with the Python SDK)
- links-to references/_meta/text/zpa/zpa.sdk-python.policy-groups.md (Python SDK policy group, rule and set controllers)
- links-to references/_meta/text/zpa/zpa.sdk-python.policy-helpers.md (Python SDK policy rule helpers: policy types, write lock, condition tuples and rule builders)
- links-to references/_meta/text/zpa/zpa.sdk-python.provisioning-keys.md (How the Python SDK builds provisioning key calls)
- links-to references/_meta/text/zpa/zpa.sdk-python.return-shapes.md (What Python SDK ZPA calls return: model objects, snake_case dictionaries, bare values and raised errors)
- links-to references/_meta/text/zpa/zpa.sdk-python.small-controllers.md (Python SDK controllers whose verbs or names are not what they look like)
- links-to references/_meta/text/zpa/zpa.sdk-python.validation-helpers.md (Python SDK client-side checks that raise: PRA credentials and approval times, and custom control rules)
