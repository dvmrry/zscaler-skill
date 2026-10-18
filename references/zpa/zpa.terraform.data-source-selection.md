A ZPA data source is a lookup, and its result is whatever object the provider happens to select. In the cases below the read finishes without an error but the object is not the one the configuration identified. Downstream resources then take that object's ID, so the mistake surfaces as a wrong reference, not as a failed apply. How much that matters depends on what the ID is attached to (a policy or an application segment, for example); the code shows only that the wrong object is selected.

## Two selectors, one result

Most ZPA data sources accept both `id` and `name` and do not forbid setting both. A few do the opposite (the CBI certificate, SCIM group and location summary data sources let the ID win and silently ignore the name). {{id-and-name-both-run-name-wins}} {{overwrite-pattern-is-widespread}} When a configuration supplies both, check that they identify the same object, or set only one.

The opposite shape also exists, where the ID is tried first and the name is a fallback for an ID that matches nothing. {{invalid-id-falls-back-to-name-region}} {{invalid-id-falls-back-to-name-isolation-profile}} {{id-fallback-only-two-sites}}

## Selectors that select nothing, and first-of-many

{{app-connector-schedule-selectors-ignored}} {{service-edge-schedule-selectors-ignored}} Both are singleton settings, so the data returned is the tenant's one schedule, but a typo in an ID is never reported.

{{by-type-takes-first-element}} {{browser-protection-no-name-takes-first}} {{by-type-result-depends-on-api-order}}

Across all of these: {{success-shaped-wrong-object}}

## Microtenant scope

Selecting a microtenant is the point of a scoped lookup, so a data source that cannot be scoped, or silently loses its scope, is the more serious form of the same problem.

{{microtenant-input-computed-only-pra-approval}} {{microtenant-input-unavailable-pattern}} {{managed-browser-profile-never-scoped}} {{reads-run-unscoped-wrong-microtenant}}

The SDK decides the microtenant of a request in one place, and its order of precedence is not the one an operator would guess. {{inject-precedence-env-over-config}} {{inject-numeric-zero-overrides-config}}

The SDK's microtenant-name resolver, used when a caller supplies a name instead of an ID, fails in both directions. {{sdk-microtenant-name-success-returns-nothing}} {{sdk-microtenant-name-failure-falls-through-unscoped}} {{sdk-microtenant-name-resolver-has-no-active-callers}}

## What to check

- For every data source that sets both `id` and `name`, confirm the returned ID is the one you meant.
- For a microtenant-scoped lookup, confirm the data source declares `microtenant_id` as an input, and compare the returned `microtenant_id` with the one you intended. Check the process environment for `ZPA_MICROTENANT_ID`. It applies only when the request has no explicit `microtenantId` query parameter.
- Treat a by-type or no-name lookup as returning "some match", and pin the ID once it is known.
