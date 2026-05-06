---
product: zbi
topic: "zbi-api"
title: "ZBI API — isolation profiles, banners, certificates, regions across the ZIA + ZPA SDK split"
content-type: reference
last-verified: "2026-05-05"
confidence: high
source-tier: code
sources:
  - vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py
  - vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_banner.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_certificate.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_region.py
  - vendor/zscaler-sdk-python/zscaler/zpa/cbi_zpa_profile.py
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go
  - vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go
  - vendor/zscaler-api-specs/oneapi-postman-collection.json
author-status: draft
---

# ZBI API — isolation profiles, banners, certificates, regions across the ZIA + ZPA SDK split

This reference covers the API surface for ZBI (Zero Trust Browser Isolation / Cloud Browser Isolation) as expressed in the Python and Go SDKs. It does not repeat the architectural model (ephemeral containers, double-PSE traversal) or the policy-routing layer; see the cross-links below. Its primary purpose is to document the concrete field names, endpoint paths, and SDK accessor patterns needed to create and configure isolation profiles programmatically.

---

## ZIA / ZPA SDK split

This is the most structurally surprising aspect of the CBI API surface. The HTTP endpoints all live under `/zpa/cbiconfig/...` or `/zpa/mgmtconfig/...`, but the Python SDK distributes the accessor methods across both `client.zia.*` and `client.zpa.*`. The Go SDK places everything under the ZPA service namespace with no ZIA accessor at all.

| Capability | Python accessor | Go package |
|---|---|---|
| List profiles (read-only, ZIA-side) | `client.zia.cloud_browser_isolation.list_isolation_profiles()` | not exposed |
| Full CRUD on CBI profiles | `client.zpa.cbi_profile.*` | `cbiprofilecontroller` |
| Banner CRUD | `client.zpa.cbi_banner.*` | `cbibannercontroller` |
| Certificate CRUD | `client.zpa.cbi_certificate.*` | `cbicertificatecontroller` |
| Region list (read-only) | `client.zpa.cbi_region.list_cbi_regions()` | `cbiregions` |
| ZPA-projection profile list | `client.zpa.cbi_zpa_profile.list_cbi_zpa_profiles()` | `cbizpaprofile` |
| Isolation profile list (mgmt API) | `client.zpa.cbi_zpa_profile.list_isolation_profiles()` | `isolationprofile` |

The HTTP endpoints reached are identical in both SDKs; only the Python accessor surface is split. The ZIA-side Python method (`list_isolation_profiles` under `client.zia`) hits `/zia/api/v1/browserIsolation/profiles` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:56-60`). All ZPA-side methods hit `/zpa/cbiconfig/...` or `/zpa/mgmtconfig/...` regardless of which Python accessor is used.

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
| `GET` | `/zia/api/v1/browserIsolation/profiles` | `client.zia.cloud_browser_isolation.list_isolation_profiles()` | not exposed |

Source: `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:56-60`. Returns `CBIProfile` objects with only `id`, `name`, `url`, `defaultProfile` (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py:29-38`).

---

## Open questions

- **`cbizpaprofile` vs `isolationprofile` preferred endpoint** — Two read-only controllers serve what appear to be overlapping datasets via different ZPA base paths (cbiconfig vs mgmtconfig), with different response struct shapes. Which endpoint the ZPA admin console uses, whether their contents differ at runtime, and which one should be preferred for lookups in policy workflows is unresolved. Requires vendor documentation or tenant-side API comparison — *unverified, requires vendor clarification or lab test.*

- **Auto-created default profile lifecycle** — `policy-integration.md` states "default profiles are auto-created per organization at first ZBI login," but neither SDK exposes a method to detect or manage this auto-creation step. Whether `isDefault: true` can be set or cleared via the profile CRUD endpoints, or whether it is purely server-managed, is not stated in the SDK source — *unverified, requires vendor documentation or tenant-side test.*

- **`copyPaste` and `uploadDownload` enum values** — The SecurityControls struct declares these as `string` type but the SDK source only documents `all` and `none` as example values in the Python docstring. Whether other valid enum values exist (e.g., directional copy/paste options) is not enumerated in the SDK source — *unverified, requires vendor API documentation or Postman collection response inspection.*

---

## Cross-links

- `references/zbi/overview.md` — Ephemeral container model, double-PSE traversal, Turbo Mode rendering architecture.
- `references/zbi/policy-integration.md` — ZIA URL Filter `Isolate` action, ZPA Isolation Policy structure, and the subscription-tier model. The configurable knobs table in this file bridges that doc's feature list to the concrete API field names.
- `references/zia/sdk.md` — Lists `cloud_browser_isolation.py` as a ZIA SDK service; this file is the deeper dive on what that method actually hits and how it relates to the ZPA-side profile model.
