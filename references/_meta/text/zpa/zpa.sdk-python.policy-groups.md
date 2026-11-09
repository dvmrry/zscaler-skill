# Python SDK policy group, rule and set controllers (zpa.sdk-python.policy-groups)
Also called: policy_group python sdk; policy_group_set; policy_group_rule; legacy client policy group missing; policy group reorder put post changelog

The Python SDK has three policy-group controllers whose routes its own changelog describes differently from the code. The Go comparison is in [B2B Federation SDK coverage and contract differences](kb:zpa.b2b-federation.sdk-contract).

**Reach.** The unified `ZPAService` defines `policy_group`, `policy_group_rule` and `policy_group_set` properties, while the same properties in the legacy ZPA client are commented out. [zpa.sdk-python.policy-groups:unified-only]

**Routes.** `add_group` sends POST to `/policyGroupSet/{group_set_id}/group` and `reorder_group` sends PUT to `/policyGroupSet/{group_set_id}/group/{group_id}/reorder/{new_order}`. [zpa.sdk-python.policy-groups:group-add-reorder-code] Its changelog says otherwise: [divergence:zpa.sdk-python.policy-groups:python-changelog-routes] The Go package uses other routes again, and the Go changelog repeats the same add route: [zpa.b2b-federation.sdk-contract:policy-group-routes](kb:zpa.b2b-federation.sdk-contract:policy-group-routes).

**Examples.** The Python `search_groups` method requires `group_set_id`, but its embedded example calls it with only `filter_and_sort_dto`, so copying the example raises an argument error before any request. [zpa.sdk-python.policy-groups:python-search-groups-example-omits-set-id]

What to check:
1. Whether the code uses the unified ZPAService client, since the legacy client has no policy group properties.
2. Whether a policy group add or reorder was made against the route in the code, not the one in the changelog.

Sources disagree (name both sides):
- The Python changelog describes the policy group add and reorder routes with different HTTP methods from the code. [divergence:zpa.sdk-python.policy-groups:python-changelog-routes]
  - sdk-python: The changelog lists GET on `.../group` as the add route and POST on the group reorder route.
  - sdk-python: The code adds with POST.
  - sdk-python: The code reorders with PUT.
  Impact: A caller following the changelog would use the wrong method for group add and reorder; the specification has no policyGroupSet route to settle it.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.b2b-federation.sdk-contract.md (B2B Federation SDK coverage and contract differences)
