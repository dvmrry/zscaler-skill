# Where ZPA Python SDK wrappers raise and where they return errors (zpa.sdk-python.error-handling)
Also called: python sdk exceptions zpa; ValueError unexpected key type; incorrect policy type provided; error returned as string; third tuple element error

ZPA wrappers return (result, response, error) and mostly put failures in the third slot, but a few validation failures are raised and a few errors are plain strings. The ZIA equivalent is [What the Python SDK returns: result, response and error, and why try/except misses API errors](kb:zia.sdk-python.response-shape).

**Returned.** ZPA list wrappers such as emergency access `list_users` and `list_tag_keys` document their return as a tuple of the result, the response and the error. [zpa.sdk-python.error-handling:tuple-shape] [The executor's `execute` catches exceptions from firing the request and from the response error check, and returns them as the error element instead of raising.](kb:shared.sdk-python.errors:errors-returned) `list_provisioning_keys` builds its models inside a try block and returns an exception from model construction in the error slot. [zpa.sdk-python.error-handling:model-error-in-slot] `delete_rule` in the policy controller returns a formatted string, not an exception, in the error slot when it cannot look up the policy set. [zpa.sdk-python.error-handling:string-errors]

**Raised.** [A key type outside the mapped values raises `ValueError`, and `add_provisioning_key` and `update_provisioning_key` also raise `ValueError` when `key_type` is empty.](kb:zpa.sdk-python.provisioning-keys:key-type-raises) `get_policy` raises `ValueError` for a policy type missing from `POLICY_MAP`, and its docstring documents the raise. [zpa.sdk-python.error-handling:raise-policy-type] The App Protection rule builder `_create_rule` raises `TypeError` when the rule is not a dictionary. [zpa.sdk-python.error-handling:raise-rule-typeerror]

What to check:
1. Whether the failing call is one that raises, so it needs a try block, or one that returns the error in the third tuple slot.
2. Whether an error value is an exception or a string before it is formatted or re-raised.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.errors.md (How the Python SDK reports errors: the error slot, exception classes, raiseException)
- links-to references/_meta/text/zia/zia.sdk-python.response-shape.md (What the Python SDK returns: result, response and error, and why try/except misses API errors)
- links-to references/_meta/text/zpa/zpa.sdk-python.provisioning-keys.md (How the Python SDK builds provisioning key calls)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
