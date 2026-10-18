A ZPA data source is a lookup, and its result is whatever object the provider happens to select. In the cases below the read finishes without an error but the object is not the one the configuration identified.

## Two selectors, one result

{{id-and-name-both-run-name-wins}} {{overwrite-pattern-is-widespread}} {{id-wins-name-ignored}}

**Name as fallback.** {{invalid-id-falls-back-to-name-region}} {{invalid-id-falls-back-to-name-isolation-profile}} {{id-fallback-only-two-sites}}

## Selectors that select nothing, and first-of-many

{{app-connector-schedule-selectors-ignored}} {{service-edge-schedule-selectors-ignored}}

{{by-type-takes-first-element}} {{browser-protection-no-name-takes-first}} {{by-type-result-depends-on-api-order}} Search matching and result order of the list endpoints are open {{gap:api-list-order-and-search-match}}.

Across all of these: {{success-shaped-wrong-object}}

## Microtenant scope

{{microtenant-input-computed-only-pra-approval}} {{microtenant-input-unavailable-pattern}} {{managed-browser-profile-never-scoped}} {{reads-run-unscoped-wrong-microtenant}} What a read with no microtenant returns is open {{gap:api-unscoped-read-scope}}.

**Request microtenant precedence.** {{inject-precedence-env-over-config}} {{inject-numeric-zero-overrides-config}} How the API treats `microtenantId=0` is open {{gap:api-microtenant-zero}}.

**Microtenant name resolver.** {{sdk-microtenant-name-success-returns-nothing}} {{sdk-microtenant-name-failure-falls-through-unscoped}} {{sdk-microtenant-name-resolver-has-no-active-callers}}
