---
product: zbi
topic: "zbi-api"
title: "ZBI API — split Zero Trust Browser / CBI surface and Business Insights namespace caveat"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: cd24ac6b1f409d6752b5de8092e50dcab7b8c5c0
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 41cac5f54065b1a2264d0ab057eba8d0b35fca25
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
confidence: high
source-tier: code
sources:
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py
  - vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py
  - vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py
  - vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py
  - vendor/zscaler-sdk-python/zscaler/oneapi_client.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_banner.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_certificate.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_region.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_zpa_profile.py
  - vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go
  - vendor/terraform-provider-zia/zia/data_source_zia_cloud_browser_isolation_profile.go
  - vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go
  - vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go
  - vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go
  - vendor/terraform-provider-zia/zia/validator.go
  - vendor/terraform-provider-zpa/zpa/provider.go
  - vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_browser_isolation_external_profile.go
  - vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go
  - vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go
  - vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py
  - vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py
  - vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/get_isolation_profile.py
  - vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py
  - vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json
  - vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json
  - vendor/zscaler-api-specs/oneapi-postman-collection.json
author-status: draft
---

# ZBI API — split Zero Trust Browser / CBI surface and Business Insights namespace caveat

This reference covers the programmable surface for Zero Trust Browser / Cloud Browser Isolation as expressed in the Python SDK, Go SDK, Terraform providers, Ansible collections, MCP tools, and Postman collection. It does not repeat the architectural model or policy-routing layer; see the cross-links below. Its primary purpose is to document concrete field names, endpoint paths, SDK accessor patterns, and places where "ZBI" is a misleading name.

**Naming guardrail:** Python `client.zbi` is **Zscaler Business Insights**, not Zero Trust Browser. The service wrapper says "Zscaler Business Insights (ZBI)" and OneAPI initializes `_zbi` with the comment "Zscaler Business Insights (REST API)" (`vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-24`, `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:230`, `:316-319`). Its custom-app/report endpoints use `/bi/api/v1` (`vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py:28-34`, `:70-74`). Do not cite `client.zbi.*` as browser-isolation policy/profile management.

**Automate contract scope:** Zero Trust Browser / CBI does not have a standalone `zbi-api-reference.json` contract file. The captured operation contract appears under the parent ZIA and ZPA products: ZIA exposes the read-only `GET /zia/api/v1/browserIsolation/profiles` operation with four response fields (`id`, `name`, `url`, `defaultProfile`) (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:11448-11457`, `:11459-11488`), while ZPA exposes the CBI banner, certificate, profile, region, ZPA-profile, and management isolation-profile paths under `/zpa/cbiconfig/...` and `/zpa/mgmtconfig/...` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10056-10060`, `:10439-10444`, `:10573-10578`, `:10641-10646`). Treat the contract as authoritative for documented method/path and field metadata, then use SDK/Terraform/Ansible/MCP sources below for wrapper behavior and client-side constraints.

---

## ZIA / ZPA SDK split

This is the most structurally surprising aspect of the CBI API surface. The HTTP endpoints are split between ZIA `/browserIsolation/profiles`, ZPA `/zpa/cbiconfig/...`, and ZPA `/zpa/mgmtconfig/...`. The Python SDK distributes accessors across `client.zia.*` and `client.zpa.*`; the Go SDK also has both a ZIA read-only package and ZPA CBI packages.

| Capability | Python accessor | Go package |
|---|---|---|
| List profiles (read-only, ZIA-side) | `client.zia.cloud_browser_isolation.list_isolation_profiles()` | `zia/services/browser_isolation` |
| Full CRUD on CBI profiles | `client.zpa.cbi_profile.*` | `cbiprofilecontroller` |
| Banner CRUD | `client.zpa.cbi_banner.*` | `cbibannercontroller` |
| Certificate CRUD | `client.zpa.cbi_certificate.*` | `cbicertificatecontroller` |
| Region list (read-only) | `client.zpa.cbi_region.list_cbi_regions()` | `cbiregions` |
| ZPA-projection profile list | `client.zpa.cbi_zpa_profile.list_cbi_zpa_profiles()` | `cbizpaprofile` |
| Isolation profile list (mgmt API) | `client.zpa.cbi_zpa_profile.list_isolation_profiles()` | `isolationprofile` |

The ZIA-side Python method (`list_isolation_profiles` under `client.zia`) hits `/zia/api/v1/browserIsolation/profiles` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:57-60`), and the Go ZIA package uses the same endpoint constant (`vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:13`). ZPA-side methods hit `/zpa/cbiconfig/...` or `/zpa/mgmtconfig/...` depending on the controller (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:13-15`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go:14-15`).

**ZIA model vs ZPA model.** The Python ZIA-side `CBIProfile` model has exactly four fields: `id`, `name`, `url`, `default_profile` (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py:29-38`). It is a read-only reference stub. The ZPA-side model (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py`) carries all nested objects — SecurityControls, UserExperience, Banner, Regions, Certificates, etc. Use the ZPA-side for any write operation or for reading configurable fields.

---

## Controller categories

Six distinct entity scopes exist across the SDK:

| Controller / package | Entity type | CRUD | Purpose |
|---|---|---|---|
| `cbiprofilecontroller` (Go) / `cbi_profile` (Python) | `IsolationProfile` | Full | Central writable CBI profile — owns SecurityControls, UserExperience, Banner, Regions, Certificates |
| `cbibannercontroller` (Go) / `cbi_banner` (Python) | `CBIBannerController` | Full | UI banners shown during isolated sessions |
| `cbicertificatecontroller` (Go) / `cbi_certificate` (Python) | `CBICertificate` | Full | SSL/TLS certificates used by the cloud browser |
| `cbiregions` (Go) / `cbi_region` (Python) | `CBIRegions` | Read-only | Available regions where containers run |
| `cbizpaprofile` (Go) / `cbi_zpa_profile.list_cbi_zpa_profiles()` (Python) | `ZPAProfiles` | Read-only | ZPA-scoped minimal projection of CBI profiles via the cbiconfig path |
| `isolationprofile` (Go) / `cbi_zpa_profile.list_isolation_profiles()` (Python) | `IsolationProfile` | Read-only | Alternate read endpoint via the mgmtconfig path — different URL, different struct shape |

---

## 1. CBI Profile (full CRUD)

### Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/profiles` | List all profiles |
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/profiles/{profileId}` | Get by ID |
| `POST` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/profiles` | Create |
| `PUT` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/profiles/{profileId}` | Update |
| `DELETE` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/profiles/{profileId}` | Delete |

Base constant: `cbiConfig = "/zpa/cbiconfig/cbi/api/customers/"`, endpoint: `cbiProfileEndpoint = "/profiles"` (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:13-15`).

### Go SDK functions (`cbiprofilecontroller`)

| Function | Signature | Lines |
|---|---|---|
| `Get` | `(ctx, service, profileID string) (*IsolationProfile, *http.Response, error)` | `:102-111` |
| `GetByNameOrID` | `(ctx, service, identifier string) (*IsolationProfile, *http.Response, error)` | `:113-135` |
| `Create` | `(ctx, service, *IsolationProfile) (*IsolationProfile, *http.Response, error)` | `:137-144` |
| `Update` | `(ctx, service, profileID string, *IsolationProfile) (*http.Response, error)` | `:146-153` |
| `Delete` | `(ctx, service, profileID string) (*http.Response, error)` | `:155-162` |
| `GetAll` | `(ctx, service) ([]IsolationProfile, *http.Response, error)` | `:164-172` |

All lines are in `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go`.

### Python SDK methods (`client.zpa.cbi_profile`)

| Method | HTTP | Endpoint | Lines |
|---|---|---|---|
| `list_cbi_profiles()` | GET | `/profiles` | `cbi_profile.py:36-83` |
| `get_cbi_profile(profile_id)` | GET | `/profiles/{profileId}` | `cbi_profile.py:85-121` |
| `add_cbi_profile(**kwargs)` | POST | `/profiles` | `cbi_profile.py:123-245` |
| `update_cbi_profile(profile_id, **kwargs)` | PUT | `/profiles/{profileId}` | `cbi_profile.py:247-348` |
| `delete_cbi_profile(profile_id)` | DELETE | `/profiles/{profileId}` | `cbi_profile.py:350-383` |

All lines are in `vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py`.

**Create validation** (`cbi_profile.py:226-230`): `region_ids` is required and must contain at least 2 IDs; `certificate_ids` is required and must be a list.

**Update validation** (`cbi_profile.py:321-328`): `regions` is required and must be a list of region objects (≥ 2 items); `certificates` must be a list of certificate objects; `banner` must be a dict with an `id` key. This is a schema mismatch relative to create — see Bugs section below.

---

## 2. CBI Banner (full CRUD)

### Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/banners` | List all banners |
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/banners/{bannerId}` | Get by ID |
| `POST` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/banner` | Create — **singular path** |
| `PUT` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/banners/{bannerId}` | Update |
| `DELETE` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/banners/{bannerId}` | Delete |

Endpoint constants: `cbiBannerEndpoint = "/banner"` (POST, singular), `cbiBannersEndpoint = "/banners"` (GET/PUT/DELETE, plural) (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go:14-15`).

### Go SDK functions (`cbibannercontroller`)

`Get`, `GetByNameOrID`, `Create`, `Update`, `Delete`, `GetAll` — all at `cbibannercontroller.go:31-101`. `Create` posts to the singular `/banner` endpoint (`cbibannercontroller.go:68`).

### `CBIBannerController` struct fields

Defined at `cbibannercontroller.go:18-29`:

| Go field | Wire key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `PrimaryColor` | `primaryColor` | `string` |
| `TextColor` | `textColor` | `string` |
| `NotificationTitle` | `notificationTitle` | `string` |
| `NotificationText` | `notificationText` | `string` |
| `Logo` | `logo` | `string` |
| `Banner` | `banner` | `bool` |
| `IsDefault` | `isDefault` | `bool` |
| `Persist` | `persist` | `bool` |

---

## 3. CBI Certificate (full CRUD)

### Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/certificates` | List all |
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/certificates/{certificateId}` | Get by ID |
| `POST` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/certificate` | Create — **singular path** |
| `PUT` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/certificates/{certificateId}` | Update |
| `DELETE` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/certificates/{certificateId}` | Delete |

Endpoint constants: `cbiCertificateEndpoint = "/certificate"` (POST), `cbiCertificatesEndpoint = "/certificates"` (`cbicertificatecontroller.go:14-15`).

### Go SDK functions (`cbicertificatecontroller`)

`Get`, `GetByName`, `GetByNameOrID`, `Create`, `Update`, `Delete`, `GetAll` at `cbicertificatecontroller.go:25-105`. `Create` posts to the singular `/certificate` endpoint (`cbicertificatecontroller.go:72`).

### `CBICertificate` struct fields

Defined at `cbicertificatecontroller.go:18-23`:

| Go field | Wire key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `PEM` | `pem` | `string` |
| `IsDefault` | `isDefault` | `bool` |

---

## 4. CBI Regions (read-only)

### Endpoints

| Method | Path |
|---|---|
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/regions` |

Endpoint constant: `cbiRegionsEndpoint = "/regions"` (`cbiregions.go:14`).

### Go SDK functions (`cbiregions`)

| Function | Lines |
|---|---|
| `GetByName(ctx, service, name)` | `cbiregions.go:23-34` |
| `GetAll(ctx, service)` | `cbiregions.go:36-44` |

**Client-side iteration quirk.** `GetByName` fetches all regions and filters locally. The comment at `cbiregions.go:22` states: "The current API does not seem to support search by Name."

### `CBIRegions` struct fields

Defined at `cbiregions.go:17-20`: `ID` (`id`, string), `Name` (`name`, string).

---

## 5. CBI ZPA Profile (read-only)

### Endpoints

| Method | Path |
|---|---|
| `GET` | `/zpa/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles` |

Endpoint constant: `zpaProfileEndpoint = "/zpaprofiles"` (`cbizpaprofile.go:14`).

### Go SDK functions (`cbizpaprofile`)

| Function | Lines |
|---|---|
| `Get(ctx, service, profileID)` | `cbizpaprofile.go:31-46` |
| `GetByName(ctx, service, profileName)` | `cbizpaprofile.go:49-60` |
| `GetAll(ctx, service)` | `cbizpaprofile.go:62-70` |

**Client-side iteration quirk.** `Get` by ID fetches all profiles and filters locally. The comment at `cbizpaprofile.go:30` states: "The current API does not seem to support search by ID."

### `ZPAProfiles` struct fields

Defined at `cbizpaprofile.go:17-28`:

| Go field | Wire key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `Description` | `description` | `string` |
| `Enabled` | `enabled` | `bool` |
| `CreationTime` | `creationTime` | `string` |
| `ModifiedBy` | `modifiedBy` | `string` |
| `ModifiedTime` | `modifiedTime` | `string` |
| `CBITenantID` | `cbiTenantId` | `string` |
| `CBIProfileID` | `cbiProfileId` | `string` |
| `CBIURL` | `cbiUrl` | `string` |

Note: this is a minimal projection. It lacks the SecurityControls, UserExperience, and nested config fields present in the full `IsolationProfile` struct from `cbiprofilecontroller`.

---

## 6. Isolation Profile via mgmtconfig (read-only)

### Endpoints

| Method | Path |
|---|---|
| `GET` | `/zpa/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles` |

Endpoint constants: `mgmtConfig = "/zpa/mgmtconfig/v1/admin/customers/"`, `isolationProfileEndpoint = "/isolation/profiles"` (`isolationprofile.go:14-15`). This is a **different base path** from the `cbiconfig`-based endpoints used by all other CBI controllers.

### Go SDK functions (`isolationprofile`)

| Function | Lines | Pagination |
|---|---|---|
| `GetByName(ctx, service, profileName)` | `isolationprofile.go:31-50` | `common.GetAllPagesGenericWithCustomFilters` |
| `GetAll(ctx, service)` | `isolationprofile.go:52-59` | `common.GetAllPagesGeneric` |

### `IsolationProfile` struct fields (isolationprofile package)

Defined at `isolationprofile.go:18-29`:

| Go field | Wire key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `Description` | `description` | `string` |
| `Enabled` | `enabled` | `bool` |
| `CreationTime` | `creationTime` | `string` |
| `ModifiedBy` | `modifiedBy` | `string` |
| `ModifiedTime` | `modifiedTime` | `string` |
| `IsolationProfileID` | `isolationProfileId` | `string` |
| `IsolationTenantID` | `isolationTenantId` | `string` |
| `IsolationURL` | `isolationUrl` | `string` |

This struct is distinct from the `IsolationProfile` in `cbiprofilecontroller` — same Go type name, different package, different fields. The `isolationprofile` variant has `IsolationProfileID`/`IsolationTenantID`/`IsolationURL` instead of `CBIProfileID`/`CBITenantID`/`CBIURL`, and carries no nested SecurityControls or UserExperience.

**`cbizpaprofile` vs `isolationprofile` — disambiguation note.** Two distinct read-only packages each list isolation profiles via different ZPA paths: `cbizpaprofile` uses `/zpa/cbiconfig/...` and returns `ZPAProfiles`; `isolationprofile` uses `/zpa/mgmtconfig/...` and returns a different `IsolationProfile` struct. Which one should be used in a given context is not resolved in the SDK source — see Open questions.

---

## IsolationProfile model — full field reference

This is the writable profile struct from `cbiprofilecontroller`. This is the API bridge from the feature knobs described in `policy-integration.md` to their actual wire field names.

### Top-level fields

Defined at `cbiprofilecontroller.go:17-39`:

| Go field | Wire key | Type |
|---|---|---|
| `ID` | `id` | `string` |
| `Name` | `name` | `string` |
| `Description` | `description` | `string` |
| `Enabled` | `enabled` | `bool` |
| `CreationTime` | `creationTime` | `string` |
| `ModifiedBy` | `modifiedBy` | `string` |
| `ModifiedTime` | `modifiedTime` | `string` |
| `CBITenantID` | `cbiTenantId` | `string` |
| `CBIProfileID` | `cbiProfileId` | `string` |
| `CBIURL` | `cbiUrl` | `string` |
| `BannerID` | `bannerId` | `string` |
| `SecurityControls` | `securityControls` | `*SecurityControls` |
| `IsDefault` | `isDefault` | `bool` |
| `Regions` | `regions` | `[]Regions` |
| `RegionIDs` | `regionIds` | `[]string` |
| `Href` | `href` | `string` |
| `UserExperience` | `userExperience` | `*UserExperience` |
| `Certificates` | `certificates` | `[]Certificates` |
| `CertificateIDs` | `certificateIds` | `[]string` |
| `Banner` | `banner` | `*Banner` |
| `DebugMode` | `debugMode` | `*DebugMode` |

### SecurityControls nested object

Defined at `cbiprofilecontroller.go:75-85`:

| Go field | Wire key | Type | Notes |
|---|---|---|---|
| `DocumentViewer` | `documentViewer` | `bool` | DOCX/XLSX/PDF in-isolation viewing |
| `AllowPrinting` | `allowPrinting` | `bool` | Print enable/disable |
| `Watermark` | `watermark` | `*Watermark` | See Watermark below |
| `FlattenedPdf` | `flattenedPdf` | `bool` | Flatten PDFs before rendering |
| `UploadDownload` | `uploadDownload` | `string` | `all` / `none` / specific |
| `RestrictKeystrokes` | `restrictKeystrokes` | `bool` | Restrict keystrokes in session |
| `CopyPaste` | `copyPaste` | `string` | `all` / `none` / directional config |
| `LocalRender` | `localRender` | `bool` | Local rendering of web content |
| `DeepLink` | `deepLink` | `*DeepLink` | See DeepLink below |

### UserExperience nested object

Defined at `cbiprofilecontroller.go:51-58`:

| Go field | Wire key | Type | Notes |
|---|---|---|---|
| `SessionPersistence` | `sessionPersistence` | `bool` | Persist session across browser restarts |
| `BrowserInBrowser` | `browserInBrowser` | `bool` | Browser-in-browser mode |
| `PersistIsolationBar` | `persistIsolationBar` | `bool` | Keep isolation bar visible |
| `Translate` | `translate` | `bool` | Enable translation feature |
| `ZGPU` | `zgpu` | `bool` | GPU acceleration (Turbo Mode requirement) |
| `ForwardToZia` | `forwardToZia` | `*ForwardToZia` | See ForwardToZia below |

### ForwardToZia nested object

Defined at `cbiprofilecontroller.go:60-65`:

| Go field | Wire key | Type |
|---|---|---|
| `Enabled` | `enabled` | `bool` |
| `OrganizationID` | `organizationId` | `string` |
| `CloudName` | `cloudName` | `string` |
| `PacFileUrl` | `pacFileUrl` | `string` |

### Watermark nested object

Defined at `cbiprofilecontroller.go:67-73`:

| Go field | Wire key | Type |
|---|---|---|
| `Enabled` | `enabled` | `bool` |
| `ShowUserID` | `showUserId` | `bool` |
| `ShowTimestamp` | `showTimestamp` | `bool` |
| `ShowMessage` | `showMessage` | `bool` |
| `Message` | `message` | `string` |

### DeepLink nested object

Defined at `cbiprofilecontroller.go:87-90`:

| Go field | Wire key | Type | Notes |
|---|---|---|---|
| `Enabled` | `enabled` | `bool` | |
| `Applications` | `applications` | `[]string` | Allowed URI schemes, e.g. `mailto:`, `ms-teams:` |

### DebugMode nested object

Defined at `cbiprofilecontroller.go:97-100`:

| Go field | Wire key | Type |
|---|---|---|
| `Allowed` | `allowed` | `bool` |
| `FilePassword` | `filePassword` | `string` |

---

## Configurable knobs — field cross-reference

The following table maps the feature knobs described in `policy-integration.md` to their concrete API field paths. This is the bridge between the policy-configuration description and the SDK model.

| Feature | API field path | Type / values | Source |
|---|---|---|---|
| GPU acceleration (Turbo Mode) | `userExperience.zgpu` | bool | `cbiprofilecontroller.go:56` |
| Copy/paste | `securityControls.copyPaste` | `all` / `none` / directional | `cbiprofilecontroller.go:82` |
| File transfer | `securityControls.uploadDownload` | `all` / `none` / specific | `cbiprofilecontroller.go:80` |
| Print | `securityControls.allowPrinting` | bool | `cbiprofilecontroller.go:77` |
| Restrict keystrokes | `securityControls.restrictKeystrokes` | bool | `cbiprofilecontroller.go:81` |
| Region selection | `regionIds` (create) / `regions` (update) | list, ≥ 2 required | `cbiprofilecontroller.go:31-32`, `cbi_profile.py:226` |
| Session persistence | `userExperience.sessionPersistence` | bool | `cbiprofilecontroller.go:52` |
| PAC file | `userExperience.forwardToZia.pacFileUrl` | URL string | `cbiprofilecontroller.go:64` |
| Watermarking | `securityControls.watermark.*` | nested — see Watermark table | `cbiprofilecontroller.go:67-73` |
| Document viewer | `securityControls.documentViewer` | bool | `cbiprofilecontroller.go:76` |
| Local rendering | `securityControls.localRender` | bool | `cbiprofilecontroller.go:83` |
| Translation | `userExperience.translate` | bool | `cbiprofilecontroller.go:55` |
| Browser-in-browser | `userExperience.browserInBrowser` | bool | `cbiprofilecontroller.go:53` |
| Persist isolation bar | `userExperience.persistIsolationBar` | bool | `cbiprofilecontroller.go:54` |
| Deep linking | `securityControls.deepLink.*` | nested — see DeepLink table | `cbiprofilecontroller.go:87-90` |
| Debug mode | `debugMode.*` | nested — see DebugMode table | `cbiprofilecontroller.go:38` |
| ZIA forwarding config | `userExperience.forwardToZia.*` | nested — see ForwardToZia table | `cbiprofilecontroller.go:60-65` |

---

## Bugs and quirks

### 1. Singular-vs-plural endpoint inconsistency (banners and certificates)

POST operations for banners and certificates use a **singular** path segment; all other operations use the plural. This is visible in both the Go SDK constants and the Postman collection.

- Banners: `POST /banner` vs `GET|PUT|DELETE /banners/{id}` (`cbibannercontroller.go:14-15`)
- Certificates: `POST /certificate` vs `GET|PUT|DELETE /certificates/{id}` (`cbicertificatecontroller.go:14-15`)

### 2. Python create vs update body schema mismatch (CBI Profile)

`add_cbi_profile()` takes `region_ids` (a list of string IDs) but `update_cbi_profile()` requires `regions` (a list of region objects) (`cbi_profile.py:226` vs `cbi_profile.py:321`). Similarly, `add_cbi_profile()` takes `certificate_ids` but `update_cbi_profile()` requires `certificates` (objects) (`cbi_profile.py:229` vs `cbi_profile.py:324`). Additionally, `update_cbi_profile()` requires `banner` as a dict with an `id` key (`cbi_profile.py:327`), which has no equivalent requirement in `add_cbi_profile()`.

### 3. `cbizpaprofile.Get()` — client-side ID lookup

The API does not support server-side lookup by profile ID. `cbizpaprofile.Get()` calls `GetAll()` and iterates locally. Comment at `cbizpaprofile.go:30`: "The current API does not seem to support search by ID."

### 4. `cbiregions.GetByName()` — client-side name lookup

The API does not support server-side lookup by region name. `cbiregions.GetByName()` calls `GetAll()` and iterates locally. Comment at `cbiregions.go:22`: "The current API does not seem to support search by Name."

### 5. `cbizpaprofile` vs `isolationprofile` — two endpoints, two shapes

Two read-only controllers each enumerate isolation profiles via different ZPA base paths:

- `cbizpaprofile`: `/zpa/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles` → `ZPAProfiles` struct (10 fields, no security/UX config)
- `isolationprofile`: `/zpa/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles` → `IsolationProfile` struct (10 fields, different field names: `IsolationProfileID`/`IsolationTenantID`/`IsolationURL`)

Neither is the same as the writable `IsolationProfile` in `cbiprofilecontroller`. The relationship between these three types bearing the name "IsolationProfile" is not clarified in the SDK source.

---

## ZIA-side read endpoint

| Method | Path | Python accessor | Go equivalent |
|---|---|---|---|
| `GET` | `/zia/api/v1/browserIsolation/profiles` | `client.zia.cloud_browser_isolation.list_isolation_profiles()` | `browser_isolation.GetAll()` / `GetByName()` |

Source: `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:57-60`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:13`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:30-48`. Returns `CBIProfile` objects with only `id`; `name`; `url`; `defaultProfile` (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py:29-39`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:16-26`).

---

## Terraform, Ansible, MCP, and Postman surface

### Terraform

Terraform is not absent for browser isolation:

- ZIA has a `zia_cloud_browser_isolation_profile` data source backed by the Go ZIA Browser Isolation service and returns `id`, `name`, `url`, and `default_profile` (`vendor/terraform-provider-zia/zia/data_source_zia_cloud_browser_isolation_profile.go:13-37`, `:45-63`).
- ZIA `zia_browser_control_policy` has Smart Isolation fields and sends Smart Isolation-specific settings through a separate update path when configured (`vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go:116-126`, `:170-177`, `:297-317`).
- ZIA URL Filtering rules require a `cbi_profile` block when action is `ISOLATE`, and Cloud App Control rules carry a `cbi_profile` block for isolate action families (`vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go:52-63`, `:288-305`; `vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go:198-210`, `:698-705`; `vendor/terraform-provider-zia/zia/validator.go:650-667`).
- ZPA registers CBI banner, certificate, external-profile, and both v1 and v2 isolation-rule resources plus CBI/isolation profile data sources (`vendor/terraform-provider-zpa/zpa/provider.go:157-159`, `:169`, `:172`, `:226-232`).
- The ZPA external-profile resource validates at least two regions on create/update and calls the Go SDK CBI profile `Create`, `Get`, `Update`, and `Delete` functions (`vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_browser_isolation_external_profile.go:262-278`, `:287-292`, `:344-365`, `:372-378`).
- The ZPA v1 isolation-rule resource supports `ISOLATE` and `BYPASS_ISOLATE`, carries `zpn_isolation_profile_id`, and calls the `policysetcontroller` create/update/delete paths (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go:11`, `:14-19`, `:27-34`, `:81-84`, `:113-118`, `:191-199`, `:228-230`, `:242-249`).
- The ZPA v2 isolation-rule resource is separate: provider name `zpa_policy_isolation_rule_v2`, `policysetcontrollerv2` import, same two actions, a v2 condition object-type validation slice that includes `APP`, `APP_GROUP`, `CLIENT_TYPE`, `EDGE_CONNECTOR_GROUP`, `PLATFORM`, `IDP`, `SAML`, `SCIM`, `SCIM_GROUP`, `CHROME_ENTERPRISE`, and `CHROME_POSTURE_PROFILE`, and `policysetcontrollerv2` create/update/delete calls (`vendor/terraform-provider-zpa/zpa/provider.go:172`, `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go:11`, `:14-19`, `:43-46`, `:97-109`, `:171`, `:258`, `:282`, `:289-304`).

### Ansible

Ansible is also present for browser isolation; do not mark it absent:

- ZIA has one read-only module, `zia_cloud_browser_isolation_profile_info`, which calls `client.cloud_browser_isolation.list_isolation_profiles()` and filters by ID or name in memory (`vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py:31`, `:121-140`).
- ZPA has eight modules: `zpa_cloud_browser_isolation_banner` and `_info`; `zpa_cloud_browser_isolation_certificate` and `_info`; `zpa_cloud_browser_isolation_profile_info`; `zpa_isolation_profile_info`; `zpa_policy_access_isolation_rule`; and `zpa_policy_access_isolation_rule_v2` (`vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py:31`, `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py:31`).
- The ZPA banner and certificate modules are stateful (`present`/`absent`) and call the corresponding Python SDK create/update/delete helpers; their `_info` modules are read-only (`vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py:203-225`, `:231-233`, `:253`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py:158`, `:168`, `:179`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py:175-193`, `:202-204`, `:219`, `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py:130-142`, `:153`).
- The two ZPA profile-info modules are read surfaces: one calls `client.cbi_profile.get_cbi_profile()` / `list_cbi_profiles()`, and the other calls `client.cbi_zpa_profile.list_isolation_profiles()` (`vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py:230`, `:240`, `:251`, `vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py:153-154`).
- The ZPA isolation-rule modules are stateful wrappers over `client.policies.*`: v1 uses `update_isolation_rule` / `add_isolation_rule` plus `delete_rule`; v2 uses `update_isolation_rule_v2` / `add_isolation_rule_v2` plus `delete_rule` (`vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py:275-287`, `:378-399`, `:407-409`, `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py:278-290`, `:379-399`, `:409-411`).

### MCP

MCP exposes ZPA isolation profile and policy-rule tooling:

- `get_zpa_isolation_profile` is read-only and returns a curated list of CBI profiles, optionally narrowed by an exact-name filter; even an exact-name lookup retains the list return shape (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/get_isolation_profile.py:20-48`).
- The isolation-policy tools can list, get, create, update, and delete ZPA isolation policy rules. The create tool rejects `action_type="isolate"` when `zpn_isolation_profile_id` is absent; that validation is specific to create rather than a blanket invariant asserted for every operation (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py:66-89`, `:92-122`, `:125-150`, `:153-163`).

### Postman / API specs

The Postman collection mirrors the split surface:

- ZIA Browser Isolation has a `GET {{ZIABase}}/browserIsolation/profiles` request (`vendor/zscaler-api-specs/oneapi-postman-collection.json:774-777`, `:823-829`).
- ZPA CBI controllers include banner, certificate, and profile controller sections under `{{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/...` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:15801-15817`, `:17106-17133`, `:19193-19209`, `:21046-21059`, `:21392-21397`).
- The separate ZPA mgmtconfig isolation-profile read path is also present at `{{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/isolation/profiles` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:61255`).

The Automate contract corroborates both ZPA profile-list paths as documented GET operations: `/zpa/cbiconfig/cbi/api/customers/:customerId/zpaprofiles` for `get-all-zpa-profiles` and `/zpa/mgmtconfig/v1/admin/customers/:customerId/isolation/profiles` for `get-profiles-for-customer` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10602-10608`, `:10640-10646`). It also confirms that the ZIA-side `defaultProfile` flag is server-set: the field description says "Zscaler sets this field" (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:11483-11488`).

---

## Open questions

- **`cbizpaprofile` vs `isolationprofile` preferred endpoint** — Both paths are now confirmed in the Automate contract, not just SDK/Postman artifacts (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10602-10608`, `:10640-10646`). Which endpoint the ZPA admin console uses, whether their contents differ at runtime, and which one should be preferred for lookups in policy workflows remains unresolved. See [clarification `zbi-02`](../_meta/clarifications.md#zbi-02-cbizpaprofile-vs-isolationprofile-preferred-endpoint).

- **Auto-created default profile lifecycle** — ZIA-side `defaultProfile` is documented as set by Zscaler (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:11483-11488`). The remaining open piece is ZPA-side `isDefault`: whether it can be set or cleared via profile CRUD, and exactly how default profile creation is triggered, still needs vendor documentation or a tenant-side test. See [clarification `zbi-03`](../_meta/clarifications.md#zbi-03-auto-created-default-profile-lifecycle-and-isdefault-mutability).

- **`copyPaste` and `uploadDownload` enum values** — The SecurityControls struct declares these as `string` type; SDK and Automate examples corroborate `all` and `none` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10760-10766`, `:10805-10812`). Whether other valid enum values exist (e.g., directional copy/paste options) is not formally enumerated in the captured contract. See [clarification `zbi-04`](../_meta/clarifications.md#zbi-04-copypaste-and-uploaddownload-enum-completeness).

---

## Cross-links

- `references/zbi/overview.md` — Ephemeral container model, double-PSE traversal, Turbo Mode rendering architecture.
- `references/zbi/policy-integration.md` — ZIA URL Filter `Isolate` action, ZPA Isolation Policy structure, and the subscription-tier model. The configurable knobs table in this file bridges that doc's feature list to the concrete API field names.
- `references/zbi/_claims-ledger.md` — Claim-by-claim source map for this refresh.
- `references/zia/sdk.md` — Lists `cloud_browser_isolation.py` as a ZIA SDK service; this file is the deeper dive on what that method actually hits and how it relates to the ZPA-side profile model.
