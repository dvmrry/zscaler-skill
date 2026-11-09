# Custom IPS signature rules: export, validate and import wire behavior in the legacy API (zia.api.legacy-ips-signature-wire)
Also called: ipsSignatureRules export; ipsSignatureRules import; validateRuleText; custom ips signature csv; ips signature import 415; ips signature multipart
Former IDs: zia-52

The legacy custom IPS signature endpoints have wire rules that the SDK source records only in comments. Export and validate work as described below; import is disabled in the SDK and unconfirmed.

**Export.** The Go export function documents that the request must not advertise Content-Type text/csv: the OneAPI gateway rejects that with HTTP 415 on this body-less GET, and only application/json, the SDK default for GET, is accepted on the request side. [zia.api.legacy-ips-signature-wire:export-request-no-csv-type] The export response is streamed as application/octet-stream with an attachment disposition, and the Go function returns the raw CSV bytes undecoded. [zia.api.legacy-ips-signature-wire:export-response-raw-csv]

**Validate.** The validate endpoint takes a JSON object with a ruleText key; the Go SDK states the API rejects a raw string payload. [zia.api.legacy-ips-signature-wire:validate-body-wrapped] Validation is signalled at the HTTP level: per the Go SDK comment a well-formed rule returns HTTP 200 with status 0 and empty error fields, and an invalid rule returns HTTP 400 with a standard error envelope (INVALID_INPUT_ARGUMENT and the diagnostic in message), which the SDK surfaces as an error rather than a populated struct. [zia.api.legacy-ips-signature-wire:validate-http-signaling]

**Import.** The Go SDK ships the CSV import and import-status functions commented out, with a note that the export and import endpoints are currently broken upstream, kept as reference for when the backend is fixed. [zia.api.legacy-ips-signature-wire:import-disabled] The doc comment of `ImportIPSSignatureRules` documents the CSV as plus rows with five columns (rule name, rule text, category name, description and enable flag) and minus rows that carry only a rule name (the sample's `rule-name-to-delete`); it says inner double quotes in the rule text must be doubled per RFC 4180 because the portal's parser rejects backslash-escaped quotes with 'Double quotes not terminated'. [zia.api.legacy-ips-signature-wire:import-csv-format] The commented-out `ImportIPSSignatureRules` sends the CSV as a multipart/form-data file part named file because raw text/csv and raw application/json bodies both produce HTTP 415; the comment lists csvFile, import and uploadFile as alternates to try if the API rejects file, and says to capture the portal's request to confirm the field name. [zia.api.legacy-ips-signature-wire:import-multipart-guess] Whether it works today is open [gap:zia.api.legacy-ips-signature-wire:import-wire-unconfirmed]. The same file also describes export as broken and as live [divergence:zia.api.legacy-ips-signature-wire:export-broken-note-vs-live-function].

**Python.** The Python `add_ips_signature_rule` validates the supplied `rule_text` through the validate endpoint before it sends the create, and on a failure returns `(None, None, ValueError(...))` without making the create call. [zia.api.legacy-ips-signature-wire:python-create-preflight] The Python `update_ips_signature_rule` does not validate `rule_text` first. Its docstring says the validate endpoint flags any signature whose `sid` already exists on the tenant as a duplicate, which on an update is the rule being changed, so a pre-flight check would reject every legitimate update. [zia.api.legacy-ips-signature-wire:python-update-no-preflight]

**Categories.** The Go IPS categories read pages through ReadAllPages, whereas the Python list_categories sends one request carrying the caller's page and page_size parameters. [zia.api.legacy-ips-signature-wire:categories-go-all-pages-python-one-page]

Custom signatures versus IPS policy rules: [IPS Control](kb:zia.firewall.ips).

What to check:
1. Whether an export call sends no CSV content type on the request, since the gateway answers 415 to it.
2. Whether validation posts an object with a ruleText key, and whether a failure is read from the HTTP status and error envelope rather than a result body.
3. Whether anything depends on the CSV import path, which the Go SDK ships disabled and whose wire behavior is unconfirmed.
4. Whether a category list read is complete, by checking which SDK read it.
5. Whether a Python create was stopped by the pre-flight validation, which returns an error value without calling create, and that an update is not validated first.

Sources disagree (name both sides):
- One Go source file says the export and import endpoints are broken upstream, yet ships the export function live with detailed working-response handling. [divergence:zia.api.legacy-ips-signature-wire:export-broken-note-vs-live-function]
  - sdk-go: Both export and import endpoints are broken upstream.
  - sdk-go: The export function is live and describes the CSV it streams and the request header it must avoid.
  Impact: An agent cannot tell from the SDK whether export works on a current tenant; only the import path is tracked as open.

Not known (open gaps):
- Whether CSV import works on current tenants and which multipart field name it expects [gap:zia.api.legacy-ips-signature-wire:import-wire-unconfirmed]: settled by lab-test. Blocks: Whether bulk import of custom IPS signatures can be offered or scripted.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.firewall.ips.md (IPS Control)
