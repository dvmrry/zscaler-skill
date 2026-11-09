# Python SDK App Connector group and schedule helpers: unmapped ID lists, version profile and schedule keyword names (zpa.sdk-python.connector-helpers)
Also called: connector_ids server_group_ids python; serverGroupIds connectorIds; version_profile override_version_profile python; add_connector_schedule interval ignored; frequency_interval delete_disabled; update_connector_schedule payload unused; get_connector_schedule customer_id; bulk_delete_connectors ids

These are claims about the Python SDK's App Connector group and schedule helpers. Where the docstring and the code disagree the code decides what is sent.

**Connector groups.** `add_connector_group` and `update_connector_group` send their keyword arguments as the request body without remapping `connector_ids` or `server_group_ids`, which their docstrings list, into ID objects; the executor's camel-casing then sends them under camelCase keys. [zpa.sdk-python.connector-helpers:group-id-lists-unmapped] Those keys therefore go out as `connectorIds` and `serverGroupIds`: neither is in the `FIELD_EXCEPTIONS` table of `to_lower_camel_case`, so the generic split-and-capitalize rule applies. [zpa.sdk-python.connector-helpers:group-id-list-wire-key-names] The API contract does not document those keys, and what the API does with them is open [gap:zpa.sdk-python.connector-helpers:group-id-list-wire-keys]. The `add_connector_group` docstring says that `version_profile` automatically sets `override_version_profile` to true, but the function contains no code that sets it: it sends the keyword arguments as the body, unchanged up to v1.11.1 and, since v1.11.2, changed only to fill in a missing `enrollment_cert_id`. [zpa.sdk-python.connector-helpers:version-profile-no-auto-override] The docstring names three `version_profile` values, `default`, `previous_default` and `new_release`, and `add_connector_group` does not map them to the `versionProfileId` that the App Connector group model carries; the executor sends `version_profile` camel-cased as `versionProfile`, a key the model does not have. [zpa.sdk-python.connector-helpers:version-profile-docstring-diverges]

**Bulk delete.** `bulk_delete_connectors` POSTs `{"ids": connector_ids}` to the connector bulk delete path. [zpa.sdk-python.connector-helpers:bulk-delete-ids-body]

**Schedule.** `add_connector_schedule` builds its payload from the keyword arguments `frequency`, `frequency_interval`, `delete_disabled` and `enabled`, with `delete_disabled` and `enabled` included only when present, and a `customerId` taken only from a `customer_id` keyword or the ZPA_CUSTOMER_ID environment variable, never from the client configuration. When neither is set, `add_connector_schedule` and `update_connector_schedule` return a ValueError in the error slot, so a client that has the tenant ID only as customerId in its configuration cannot add or update a schedule without passing customer_id. [zpa.sdk-python.connector-helpers:schedule-add-keys] The docstring names other keys [divergence:zpa.sdk-python.connector-helpers:schedule-keyword-names]. `update_connector_schedule` builds a `payload` of the same fields but passes `body`, a copy of the caller's keyword arguments, to create_request, so the request carries the caller's own keys camel-cased by the executor and not the payload. [zpa.sdk-python.connector-helpers:schedule-update-raw-body] `get_connector_schedule` accepts a `customer_id` argument that does not change the URL (the path uses the tenant ID fixed at construction). The function itself reads a microtenant only from the ZPA_MICROTENANT_ID environment variable; when that is unset, the request executor adds the client's configured microtenantId, if one is set. [zpa.sdk-python.connector-helpers:schedule-get-env-microtenant]

What to check:
1. Whether a connector group create or update carried its connector and server group IDs in a shape the API reads, by reading the request body back.
2. Whether the version profile took effect, because the SDK does not set override_version_profile for the caller.
3. Whether a schedule change was sent with the keys the code reads (frequency_interval, delete_disabled), not the docstring's interval and disabled.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.sdk-python.connector-helpers:group-id-list-wire-key-names] Tier B: The key names are computed by applying the quoted rule; `grep -rn connectorIds zscaler` in the SDK finds no occurrence, so no exception or model maps them differently.

Sources disagree (name both sides):
- Keyword names for the App Connector schedule helpers: docstring against code [divergence:zpa.sdk-python.connector-helpers:schedule-keyword-names]
  - sdk-python: The add_connector_schedule docstring names the keywords `interval` and `disabled`.
  - sdk-python: The code reads `frequency_interval` and `delete_disabled`, so `interval` and `disabled` are not read for the payload.
  Impact: A caller who follows the docstring sends a schedule with no interval and no delete-disabled flag, and the call can still succeed. Use frequency_interval and delete_disabled, and read the schedule back.

Not known (open gaps):
- Whether the ZPA API accepts connectorIds and serverGroupIds on App Connector group create and update [gap:zpa.sdk-python.connector-helpers:group-id-list-wire-keys]: settled by lab-test. Blocks: telling whether groups made through the Python helpers are linked to their connectors and server groups

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json
