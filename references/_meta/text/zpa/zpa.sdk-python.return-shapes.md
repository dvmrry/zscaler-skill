# What Python SDK ZPA calls return: model objects, snake_case dictionaries, bare values and raised errors (zpa.sdk-python.return-shapes)
Also called: as_dict snake_case; zpa result is not a dict; get_policy ValueError; returns None on error python zpa; ZscalerObject item access; unsupported policy type python

These are claims about the shape of what a ZPA call hands back. The three-element tuple and the error slot are in [What the Python SDK returns: result, response and error, and why try/except misses API errors](kb:zia.sdk-python.response-shape).

**Results are model objects.** The Python ZPA result models, for example ApplicationSegments, subclass the SDK's ZscalerObject base class, which defines `__getitem__` and `get` by attribute name, so a result is not a plain dictionary. [zpa.sdk-python.return-shapes:result-models-subclass] A ZPA call returns model objects, not plain dictionaries; callers can use item access and get on them but dictionary methods are not guaranteed, and as_dict is the way to a dictionary. [zpa.sdk-python.return-shapes:result-model-objects] [A model's as_dict returns snake_case keys and omits attributes whose value is None, while its request_format method is the camelCase form the API expects.](kb:shared.sdk-python.response-handling:as-dict) An update that the API answers with 204 returns a placeholder object, not the updated resource: Python SDK issue #582 asked about the object a ZPA update returns when the API answers 204 No Content, which carries model defaults such as `enabled=True`; it was closed as completed on 2026-10-06 with a reply from a member of the repository's organization, signed Zscaler DevRel, that the placeholder is intentional, that its other attributes are model defaults and not API data, and that callers use `response.get_status()` to detect the 204 and a matching get call to read the updated resource; v1.11.1 documents this in the README. [zpa.sdk-python.return-shapes:update-placeholder-intended]

**Where errors are raised instead of returned.** [The Go `GetByApplicationType` and `DeleteByApplicationType` reject any application type other than BROWSER_ACCESS, INSPECT or SECURE_REMOTE_ACCESS before sending a request, while the Python `get_segments_by_type` only requires a non-empty type and `delete_segments_by_type` does not check it; the API documents `applicationType` as a required string without an enum.](kb:zpa.api.app-segments-wire:application-type-validation) The other raises (unknown policy type, provisioning key type, App Protection rule) are in [Where ZPA Python SDK wrappers raise and where they return errors](kb:zpa.sdk-python.error-handling).

What to check:
1. Whether the code treats a result as a dictionary, because it is a model object that offers item access and get but is not a dict.
2. Whether the keys read from as_dict are snake_case, which is what the SDK emits, and not the API's camelCase.
3. Whether the caller wraps calls that can raise ValueError (empty application type, among others) as well as testing the error slot.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.sdk-python.return-shapes:result-model-objects] Tier B: Holds for the models that subclass ZscalerObject; calls that return a bare dict, such as the LSS helpers, are the exception (zpa.sdk-python.lss-helpers).

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.response-handling.md (What the Python SDK does with a response: key casing, models, the response object)
- links-to references/_meta/text/zia/zia.sdk-python.response-shape.md (What the Python SDK returns: result, response and error, and why try/except misses API errors)
- links-to references/_meta/text/zpa/zpa.api.app-segments-wire.md (Application segment wire behavior: what each SDK sends, drops and matches across the four segment kinds)
- links-to references/_meta/text/zpa/zpa.sdk-python.error-handling.md (Where ZPA Python SDK wrappers raise and where they return errors)
