# Client settings and managed browser profile: what the SDKs send and decode (zpa.api.client-settings-wire)
Also called: GetClientSettings returns empty; client setting create does nothing; singningCertExpiryInEpochSec; managedBrowserProfile search; client setting type ZAPP_CLIENT

The client setting and managed browser profile calls exist in the SDKs but are not defined in the API document or the Postman collection at the pin, so everything here is SDK behavior [gap:zpa.api.client-settings-wire:client-settings-api-contract]. The Go client setting calls have two argument-order defects, below.

## Go client setting defects

Go GetClientSettings passes its result slice as the request body argument and nil as the response target, so the response is never decoded into the slice and the function returns whatever the slice already held, which is nothing. [zpa.api.client-settings-wire:go-get-never-decodes]

Go client_settings Create passes the settings as the options argument and a freshly allocated empty ClientSettings as the body argument, with a nil response target. Options are encoded into the query string, the body is the empty struct, and nothing is decoded into the returned value, so the settings are not sent as the JSON body and the returned object is empty. [zpa.api.client-settings-wire:go-create-swaps-options-and-body] What the API does with that request is open [gap:zpa.api.client-settings-wire:client-settings-create-effect].

## Calls and names

Go GetClientSettings upper-cases and trims the type filter and rejects any value other than ZAPP_CLIENT, ISOLATION_CLIENT and APP_PROTECTION before sending a request. The Python get_client_settings documents the same three values but sends the filter as given. [zpa.api.client-settings-wire:go-type-allowlist] Both SDKs call GET /clientSetting (with an optional type filter), GET /clientSetting/all with no filter, POST /clientSetting to create and DELETE /clientSetting with no id. Neither SDK has an update call. [zpa.api.client-settings-wire:sdk-client-setting-calls]

Both SDKs spell the signing certificate expiry key singningCertExpiryInEpochSec, with the misspelling, on the client setting model. [zpa.api.client-settings-wire:singning-key-spelling] The Python ClientSettings model reads and writes microtenantId, and the Go ClientSettings type has no microtenant member. [zpa.api.client-settings-wire:python-client-setting-microtenant]

## Managed browser profiles

Both SDKs list managed browser profiles with a GET on the /managedBrowserProfile/search path. The Go GetByName sends no name filter, only the microtenant id, and matches the name client-side with a case-insensitive comparison. [zpa.api.client-settings-wire:managed-browser-search-path]

The all-settings response shape differs between the SDKs [divergence:zpa.api.client-settings-wire:get-all-shape].

Which shape the endpoint returns is open [gap:zpa.api.client-settings-wire:all-endpoint-shape].

What to check:
1. Whether an empty client-settings result came from the Go GetClientSettings, which never decodes its response, before concluding the tenant has none.
2. Whether a client setting was created through Go Create, whose settings go to the query string and not the body.
3. Whether a type filter value is one of the three accepted by the Go allowlist.

Sources disagree (name both sides):
- The Go `GetAllClientSettings` decodes the `/clientSetting/all` response into one object, while the Python `get_all_client_settings` builds a list from the response results. [divergence:zpa.api.client-settings-wire:get-all-shape]
  - sdk-go: Go GetAllClientSettings returns a pointer to a single ClientSettings decoded from the response.
  - sdk-python: Python builds a list of ClientSettings from get_results().
  Impact: A caller moving between SDKs gets an object from one and a list from the other for the same endpoint; neither is checked against a live response.

Not known (open gaps):
- Whether the API defines the client setting and managed browser profile endpoints as the SDKs call them [gap:zpa.api.client-settings-wire:client-settings-api-contract]: settled by lab-test or support-ticket. Blocks: telling whether the SDK spellings and calls reflect the API or only the SDKs
- What the API does with a client setting POST sent by the Go SDK, with an empty body and the settings in the query string [gap:zpa.api.client-settings-wire:client-settings-create-effect]: settled by lab-test. Blocks: telling whether the Go create call fails, creates an empty setting or works through the query parameters
- Whether GET /clientSetting/all returns one object or a list [gap:zpa.api.client-settings-wire:all-endpoint-shape]: settled by lab-test. Blocks: writing a client for the all-settings call

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.api.pagination.md (ZPA list pagination, search syntax and client-side filtering)
- see-also references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
