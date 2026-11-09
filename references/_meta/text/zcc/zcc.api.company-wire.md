# ZCC company info and password management calls: who may read, and which clients can write (zcc.api.company-wire)
Also called: getCompanyInfo; setCompanyInfo; managePass; zcc company info 403; manage pass python; supportEnabled fetchLogsForAdminsEnabled

Company info holds tenant-wide flags such as support access and logging controls, and `managePass` sets app profile passwords in bulk. The Terraform provider exposes company info only as the `zcc_company_info` data source; it has no company-info resource. [zcc.api.company-wire:terraform-data-source-only] The Python SDK writes neither, as the sections below show.

**Reading company info.** The contract and the Python docstring say `getCompanyInfo` is allowed when the caller is a OneAPI customer or the token has admin or read-only admin privileges. [zcc.api.company-wire:company-read-access] The Python call returns a list: [`get_company_info` returns a list of `CompanyInfo` objects, each built again from a result the executor already wrapped as a `CompanyInfo`; a single-object response becomes a one-item list.](kb:zcc.sdk-python.return-shapes:company-info-list).

**Writing company info.** The Go SDK writes company info with `PUT /setCompanyInfo`, treats any `success` other than "true" as a rejection, and on success re-reads the configuration with `getCompanyInfo` and returns that. [zcc.api.company-wire:set-company-info-go] The captured contract has `getCompanyInfo` but no `setCompanyInfo` operation. The Python SDK's `CompanyInfoAPI` defines `get_company_info`, which sends a GET. [zcc.api.company-wire:set-company-info-undocumented] The Python SDK has only the company-info read: `CompanyInfoAPI` has no write method. [zcc.api.company-wire:python-company-read-only] The Go `CompanyInfo` type mixes encodings on purpose, because the payload does: some flags are numeric strings such as "0" and "1" (for example `proxyEnabled`), others integers (for example `supportEnabled`, `fetchLogsForAdminsEnabled`, `supportTicketEnabled`, `disableLoggingControls`). [zcc.api.company-wire:company-info-mixed-types]

**Password management.** The contract defines `POST /managePass` with a body naming a company, a device type, a policy name and the exit, logout, uninstall and per-service disable passwords, and a 200 response with an `errorMessage` property. [zcc.api.company-wire:manage-pass-contract] The Python SDK ships a `ManagePass` model but no service method that sends it. [zcc.api.company-wire:manage-pass-python-model-only] The Go SDK's call sends an empty object instead of the payload: [`NewZccRequestDo` JSON-marshals its `body` argument unconditionally on the OneAPI (non-legacy) path, and four SDK methods (admin-user update, both entitlement updates, manage-pass update) pass it a `bytes.NewBuffer` of bytes they have already marshaled. A `*bytes.Buffer` has no exported fields, so it marshals as `{}`, and the request carries an empty object instead of the payload.](kb:shared.sdk-go.request-handling:zcc-request-do-double-marshals). Legacy mode does the same: [The Go legacy ZCC client also JSON-encodes whatever body it is given, so the four methods that pass an already-marshaled `bytes.Buffer` (admin-user update, both entitlement updates, manage-pass update) send an empty object in legacy mode as well as on the OneAPI path.](kb:zcc.sdk-go.paging-and-requests:legacy-body-encoded-again).

What to check:
1. Whether a manage-pass write went through the Go SDK, whose body is an empty object, or was built by hand against the contract.
2. Whether a company-info update relied on `setCompanyInfo`, which only the Go SDK documents.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.api.company-wire:python-company-read-only] Tier B: Rests on reading the whole of zscaler/zcc/company.py at the pin (a constructor and get_company_info only) and a search of the SDK for company_info and CompanyInfo, which finds only that module, the model and the two accessors; a quote cannot pin the absence.

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/zcc/zcc.sdk-go.paging-and-requests.md (How the Go SDK sends ZCC requests and pages v1 and v2 lists)
- links-to references/_meta/text/zcc/zcc.sdk-python.return-shapes.md (What the Python SDK's ZCC methods return, and the ones that break the tuple convention)
