# Enrollment and Browser Access certificate API: wire keys, paths and client quirks (zpa.api.certificates-wire)
Also called: enrollment certificate getcName; zrsaencryptedprivatekey; BaCertificate update PUT; clientlessCertificate issued deprecated; enrollment cert csr generate; browser access certificate upload CertBlob
Former IDs: zpa-25

Enrollment (signing) certificates and Browser Access certificates are separate API objects with different quirks. Browser Access certificate use is in [Certificates for Browser Access applications: wildcards, managed and custom](kb:zpa.browser-access.certificates); connector enrollment is in [App Connector enrollment, certificates and re-enrollment](kb:zpa.app-connectors.enrollment).

## Enrollment certificates

In the Go SDK, enrollment certificate single-object reads and all writes use the mgmtconfig v1 path, while the list and the name lookup use the v2 path; the OpenAPI document lists a v1 get by ID and a v2 list. [zpa.api.certificates-wire:enrollment-cert-v1-v2-split] Generating a CSR and generating a self-signed enrollment certificate are POSTs on the v1 enrollmentCert path, at csr/generate and selfsigned/generate. [zpa.api.certificates-wire:enrollment-cert-csr-selfsigned-v1]

**Wire keys.** The Go EnrollmentCert struct tags the canonical-name field `cName`, while the OpenAPI response schema and the Python model use `getcName`. [zpa.api.certificates-wire:enrollment-cert-cname-wire-key] [divergence:zpa.api.certificates-wire:enrollment-cname-key] The private-key and session-key fields of an enrollment certificate use the all-lowercase wire keys `zrsaencryptedprivatekey` and `zrsaencryptedsessionkey`, in the Go struct, the Python model and the OpenAPI schema. [zpa.api.certificates-wire:enrollment-cert-lowercase-keys]

**Lookups and scope.** Enrollment certificate GetByName compares the name with strings.EqualFold, while the BaCertificate GetIssuedByName compares with ==, so a wrong-case name finds an enrollment certificate but not an issued Browser Access certificate. [zpa.api.certificates-wire:name-lookup-case-rules] In the Go enrollment certificate service, Get, Delete and GetAll pass the service's microtenant ID as a filter, while Create and Update pass nil for it. [zpa.api.certificates-wire:enrollment-cert-microtenant-scope] The Go integration test asserts that GetAll returns enrollment certificates named Root, Client, Connector, Service Edge and Isolation Client. [zpa.api.certificates-wire:system-provisioned-names]

**Writes.** The Go EnrollmentCert tags allowSigning with omitempty, so a false value is not sent. [zpa.api.certificates-wire:enrollment-cert-allow-signing-omitempty] When valid_from, valid_to and time_zone are all passed, the Python SDK checks them, rejecting a start more than one hour in the past, a range over 365 days, and a time zone not in the pytz list. The Go SDK's `Create`, `Update` and self-signed generate functions open by passing the certificate struct to `NewRequestDo`, with nothing before the call but allocating the response or building the path. add_enrollment_cert and generate_self_signed send the body as the keyword arguments, so the window goes out as epoch seconds in strings. update_enrollment copies the keyword arguments into a new body before converting, then writes the epoch values into the keyword arguments and removes the raw valid_from, valid_to and time_zone from them, not from the body. [zpa.api.certificates-wire:python-validity-window-checks] update_enrollment sends the raw valid_from, valid_to and time_zone and no epoch values in the request body. [zpa.api.certificates-wire:python-update-enrollment-raw-window] The Go SDK has no such validity-window or time-zone checks: its enrollment certificate writes send whatever the struct holds. [zpa.api.certificates-wire:go-no-validity-checks] The Python enrollment certificate delete sends the dryRun query parameter only when dry_run is truthy, so dry_run=False is the same as omitting it. [zpa.api.certificates-wire:python-delete-dry-run]

**Python model.** The Python EnrollmentCertificate model never reads `description` from a response and does not emit it in request_format, so a caller who serializes a model instance with request_format and sends the result loses the description; the SDK's own add and update methods send their keyword arguments as the body. Its no-config branch also names an attribute `zrsaencryptedprivate_key`, which differs from the `zrsaencryptedprivatekey` that request_format reads. [zpa.api.certificates-wire:python-enrollment-model-gaps] Calling request_format on an EnrollmentCertificate built without a config raises AttributeError. [zpa.api.certificates-wire:python-enrollment-empty-request-format]

## Browser Access certificates

For Browser Access certificates the Go struct, the Python model and the OpenAPI response schema all use the key `cName`. [zpa.api.certificates-wire:ba-cname-key-agrees] The OpenAPI document marks GET clientlessCertificate/issued as deprecated; its whole description is "Gets all issued certificates for the specified customer. This API will be deprecated in a future release.", naming no replacement, and the document also lists GET certificate/issued with the same response schema; the Go SDK and the Python SDK still call the clientlessCertificate/issued path. [zpa.api.certificates-wire:ba-issued-list-deprecated-path]

The Go Browser Access certificate upload test builds CertBlob as a CERTIFICATE PEM block concatenated with an RSA PRIVATE KEY PEM block, and expects an error when CertBlob is empty; the OpenAPI create body carries certBlob, name and description. [zpa.api.certificates-wire:ba-upload-blob] The Go integration test expects a Get of a Browser Access certificate after its deletion to fail with an error containing 400. [zpa.api.certificates-wire:ba-delete-then-get-400]

The Go SDK has no Update for BaCertificate, and the OpenAPI document lists only get and delete on certificate/{certificateId}; the Python SDK's update_certificate sends a PUT to certificate/{certificate_id}. [zpa.api.certificates-wire:ba-update-asymmetry] Whether the Python PUT works is open [gap:zpa.api.certificates-wire:ba-certificate-put-valid].

The client certificate types are four in the contract and two in the Python docstring [divergence:zpa.api.certificates-wire:client-cert-type-values].

Whether the two values are synonyms is open [gap:zpa.api.certificates-wire:client-cert-type-synonyms].

The validity timestamps are integers in the contract and strings in the SDKs [divergence:zpa.api.certificates-wire:validity-epoch-types].

Whether the first match is the only match is open [gap:zpa.api.certificates-wire:enrollment-name-duplicates].

What to check:
1. Whether a Go-side read of an enrollment certificate shows an empty canonical name because of the key mismatch.
2. Whether a wrong-case certificate name explains a failed lookup, by lookup kind.
3. Whether a Browser Access certificate update is attempted through Python, since the Go SDK and the API document have no such operation.
4. Whether the issued-certificate list uses the deprecated path.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.certificates-wire:python-enrollment-empty-request-format] Tier B: Rests on Python attribute semantics: the no-config branch assigns `zrsaencryptedprivate_key` and request_format reads `self.zrsaencryptedprivatekey`, which that branch never assigns (`grep -n 'zrsaencryptedprivate' zscaler/zpa/models/enrollment_certificates.py` at Python SDK commit 4f8f54d (one commit after v1.11.3) finds the config-branch assignment, this no-config assignment and the request_format read). No source states the error and the call was not run.
- [zpa.api.certificates-wire:go-no-validity-checks] Tier B: Rests on the three Go write functions opening with the NewRequestDo call and on a read of the whole enrollmentcert package at the pin, which converts and validates nothing; a quote cannot pin the absence.
- [zpa.api.certificates-wire:python-update-enrollment-raw-window] Tier B: Rests on the order of the code: `body` is filled from the keyword arguments before the conversion writes the epoch values into `kwargs` and before the loop pops the raw keys from `kwargs`, so the body keeps the raw keys and never gets the epoch keys. No source states the outcome and the call was not run.

Sources disagree (name both sides):
- The enrollment certificate canonical-name key differs between the Go SDK and the OpenAPI document with the Python model. [divergence:zpa.api.certificates-wire:enrollment-cname-key]
  - sdk-go: The Go EnrollmentCert tags the field `cName`.
  - api-specs: The OpenAPI response schema names the property `getcName`, and the Python model reads and writes `getcName`.
  Impact: A Go caller does not read the canonical name from a response that carries `getcName`, so the value stays empty. Which key the server accepts on write is not shown. Read the raw response before relying on the Go field.
- The OpenAPI enrollment certificate `clientCertType` has four values, while the Python create docstring lists two. [divergence:zpa.api.certificates-wire:client-cert-type-values]
  - api-specs: The contract enum is ZAPP_CLIENT, ISOLATION_CLIENT, NONE and APP_PROTECTION, and the contract describes clientCertType as read-only: applicable only for GET calls and ignored in PUT and POST calls.
  - sdk-python: The Python create docstring lists ZAPP_CLIENT and ISOLATION_CLIENT.
  Impact: The contract has both ISOLATION_CLIENT and APP_PROTECTION, so neither the Python list nor an example showing APP_PROTECTION is the full set; whether the two are synonyms is not shown. Because the contract says the server ignores clientCertType on PUT and POST, the value the Python docstring offers for create may have no effect; read the type back rather than trusting what was sent.
- The OpenAPI document types `validFromInEpochSec` and `validToInEpochSec` as int64 integers, while the Go SDK types them as strings and the Python SDK sends them as strings. [divergence:zpa.api.certificates-wire:validity-epoch-types]
  - api-specs: The contract enrollment certificate response has validFromInEpochSec as an int64.
  - sdk-go: The Go EnrollmentCert declares both validity fields as strings.
  - sdk-python: The Python create converts the validity window to epoch strings.
  Impact: Go code that treats the value as an int64 fails; raw-HTTP callers follow the contract and read numbers. The contract has no enrollment certificate create or request body, so the Python position shows what is sent, not a disagreement with a contract request type.

Not known (open gaps):
- Whether the server accepts PUT on certificate/{certificateId} [gap:zpa.api.certificates-wire:ba-certificate-put-valid]: settled by lab-test. Blocks: telling whether Python-side Browser Access certificate updates can work
- Whether ISOLATION_CLIENT and APP_PROTECTION are the same client certificate type [gap:zpa.api.certificates-wire:client-cert-type-synonyms]: settled by tenant-data. Blocks: choosing a client certificate type for AppProtection
- Whether enrollment certificate names are unique and the lookup order is stable [gap:zpa.api.certificates-wire:enrollment-name-duplicates]: settled by lab-test. Blocks: trusting a name lookup of an enrollment certificate

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment)
- links-to references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom)
