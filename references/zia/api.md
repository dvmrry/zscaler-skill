---
product: zia
topic: "zia-api"
title: "ZIA API surface"
content-type: reference
last-verified: "2026-04-23"
confidence: medium-high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zia/configuring-url-categories-using-api"
  - "vendor/zscaler-help/Configuring_URL_Categories_Using_API.pdf"
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/activate.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py"
  - "vendor/terraform-provider-zia/docs/resources/zia_url_filtering_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_url_categories.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_cloud_app_control_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_activation_status.md"
author-status: draft
---

# ZIA API surface

API reference for the slice of ZIA this skill covers — URL categories, URL filtering rules, Cloud App Control, SSL Inspection, and the activation lifecycle. Derived from the Zscaler Python SDK, the Terraform provider, and the *Configuring URL Categories Using API* help article.

## Authentication — two frameworks

Per `vendor/zscaler-sdk-python/README.md`, Zscaler provides two API frameworks and the SDK supports both:

### OneAPI (current — OAuth 2.0 via ZIdentity)

Unified OAuth2 client covering ZIA, ZPA, ZDX, ZCC, and others with one set of credentials. Preferred for new integrations.

Environment variables (per SDK README):

| Var | Meaning |
|---|---|
| `ZSCALER_CLIENT_ID` | API client ID from ZIdentity |
| `ZSCALER_CLIENT_SECRET` | Client secret (for secret-based auth) |
| `ZSCALER_PRIVATE_KEY` | Private key string (for JWT private-key auth) |
| `ZSCALER_VANITY_DOMAIN` | Your organization's ZIdentity domain (forms `https://<vanity>.zslogin.net/oauth2/v1/token`) |
| `ZSCALER_CLOUD` | Cloud name for the API base URL (`$api.<cloud>.zsapi.net`). Optional; omit for default. |
| `ZSCALER_PARTNER_ID` | Optional partner ID; sets `x-partner-id` header |

OneAPI is not currently supported in Zscaler gov clouds (`zscalergov`, `zscalerten`, ZPA `GOV`, `GOVUS`) per SDK README.

Python client instantiation:

```python
from zscaler import ZscalerClient

client = ZscalerClient({
    "client_id": "...",
    "client_secret": "...",
    "vanity_domain": "..."
})
# or with JWT private-key:
client = ZscalerClient({
    "client_id": "...",
    "private_key": "...",
    "vanity_domain": "..."
})
```

ZIA resources are accessed via `client.zia`. ZPA via `client.zpa`. ZCC via `client.zcc`.

### Legacy (ZIA-specific API keys + obfuscated timestamp)

For tenants not yet migrated to ZIdentity. Uses ZIA's own API-key-plus-username-password flow.

Python client instantiation (per SDK README):

```python
from zscaler.oneapi_client import LegacyZIAClient

with LegacyZIAClient(config) as client:
    users, _, _ = client.user_management.list_users()
```

Legacy mode is supported by Zscaler gov clouds. New deployments should prefer OneAPI.

## SDK response shape

Per SDK README, every SDK method returns a 3-tuple:

```python
result, response, error = client.zia.url_filtering_rules.list_rules()
```

- `result` — parsed Python dict (or list of dicts, or specific model). Field names are snake_case even though the underlying API returns camelCase.
- `response` — the raw HTTP response object. Exposes `has_next()` / `next()` for pagination.
- `error` — `None` on success; populated on failure.

Client-side filtering via JMESPath: `response.search("<expression>")` returns matching subset.

### Why this pattern matters — exceptions are NOT raised by default

The Python SDK does **not** raise on errors; it returns them in the third tuple slot. From upstream `zscaler/zscaler-sdk-python` issue #297 (open as of capture date) — the maintainer's framing:

> Every endpoint repeats `try / except Exception as error: return (None, response, error)` — exceptions can slip by unnoticed unless developers manually check `err` every single time.

This pattern was carried over from the Go SDK's `(val, err)` convention. Implications for callers (and especially scaffold scripts):

- **Don't use `try/except` to handle SDK errors** — they won't fire. Check `err is not None` after every call.
- **Mock testing must emit `(data, response, error)` tuples**, not raise. A mock that raises won't reflect actual SDK behavior.
- **Pattern that fails silently:** `users = client.zia.users.list_users()` — `users` is now a tuple, not a list. Iterating it gives back `(data, response, error)` which is rarely what the caller wanted. Always destructure.
- **Recommended caller wrapper** for terseness:
  ```python
  def call(method, *args, **kwargs):
      data, resp, err = method(*args, **kwargs)
      if err: raise RuntimeError(f"{method.__qualname__} failed: {err}")
      return data
  ```
  This restores Pythonic exception semantics for callers who want them.

Issue #297 proposes restructuring the SDK to raise; not yet implemented as of v2.0.0.

### Pagination has had recurring bugs — handle defensively

From upstream issues #197, #272, and #477 (all closed), pagination has had **three separate** "doesn't return all data" bugs over time — the most recent (#477, closed 2026-04 era) was a regression from pre-1.0 versions where `list_users` / `list_groups` returned `N-1` records instead of `N` and `has_next()` returned `False` prematurely. The pattern of recurring pagination bugs is itself a signal: **don't trust pagination silently; always verify total counts on bulk operations against tenant-known sizes when possible.** Pattern to use, as of v2.0.0:

```python
records, resp, err = client.zia.url_categories.list_categories()
if err: raise ...
all_records = list(records)
while resp.has_next():
    next_records, resp, err = resp.next()
    if err: raise ...
    all_records.extend(next_records)
```

`scripts/snapshot-refresh.py` uses this pattern. Custom callers should not assume the first call returns the full collection; always check `resp.has_next()` even if you expect a small dataset.

## Activation lifecycle

From `vendor/zscaler-sdk-python/zscaler/zia/activate.py` and *Configuring URL Categories Using API* p.1:

> After making any configuration changes, ensure that you activate them by sending a POST request to `/status`.

Config changes are **saved but not live** until activation. The SDK's `ActivationAPI` class exposes:

- `GET /zia/api/v1/status` — returns current activation status (e.g., `ACTIVE`, `PENDING`).
- `POST /zia/api/v1/status/activate` — activates pending configuration changes.

Terraform has a corresponding `zia_activation_status` resource that runs the activation. Per `vendor/terraform-provider-zia/docs/resources/zia_activation_status.md` (see local file for full schema), it triggers the activation endpoint during a Terraform apply.

## Endpoints relevant to this skill

Paths on the OneAPI framework are prefixed `/zia/api/v1`. On legacy, just `/api/v1`.

### URL Categories

From *Configuring URL Categories Using API* (vendored PDF):

| Method | Path | Purpose |
|---|---|---|
| GET | `/urlCategories` | List all categories |
| GET | `/urlCategories?customOnly=true` | Only custom categories |
| GET | `/urlCategories?type=TLD_CATEGORY` | Only TLD categories |
| GET | `/urlCategories/lite` | Lite version — IDs and names only |
| GET | `/urlCategories/urlQuota` | Custom URL quota status |
| POST | `/urlCategories` | Create custom URL or TLD category |
| PUT | `/urlCategories/{id}` | Full update |
| PUT | `/urlCategories/{id}?action=ADD_TO_LIST` | Incremental add of URLs/IPs/keywords |
| PUT | `/urlCategories/{id}?action=REMOVE_FROM_LIST` | Incremental remove |
| DELETE | `/urlCategories/{id}` | Delete custom category (predefined cannot be deleted). Fails if category is referenced by any URL policy or NSS feed. |
| POST | `/urlLookup` | Look up the category for up to 100 URLs per request. URL max 1024 chars. |

Quotas — authoritative from *Ranges & Limitations § URL Filtering & Cloud App Control* (`vendor/zscaler-help/ranges-limitations-zia.md`):

- 25,000 custom URLs/TLDs across all categories (default; subscription-expandable +50K up to 5× tranches)
- 64 custom categories (→ 1,024 via Zscaler Support)
- **256 keywords per category, 2,048 across all categories**
- 2,048 keywords-retaining-parent-category per category, 2,048 across all categories
- 2,048 custom IP ranges

**Stale PDF warning:** *Configuring URL Categories Using API* p.12 lists the older "30 per category / 1,000 total" for keywords. Trust Ranges & Limitations.

`POST /urlLookup` returns a `SecurityAlert` field with values like `OTHER_THREAT`, `PHISHING`, `BOTNET`, `MALWARE_SITE`, `P2P`, `UNAUTHORIZED_COMMUNICATION`, `XSS`, `BROWSER_EXPLOIT`, `SUSPICIOUS_DESTINATION`, `SPYWARE_OR_ADWARE`, `WEB_SPAM`, `PAGE_RISK_INDEX`. Custom URL classifications are **not** returned by urlLookup — only predefined categories.

**SDK-level findings** (`zscaler/zia/models/urlcategory.py`):

- **Regex patterns supported** in custom categories via `regexPatterns` and `regexPatternsRetainingParentCategory` writeable fields. Help docs focus on URL/keyword/IP inputs; regex capability is not surfaced in the console walkthrough but is API-available. The TF provider exposes `url_type` as a string enum: `EXACT` or `REGEX` (`terraform-provider-zia/zia/resource_zia_url_categories.go:154-157`). Picking `REGEX` switches interpretation of that entry from string match to regex.
- **Category `type` enum has three values**: `URL_CATEGORY`, `TLD_CATEGORY`, `ALL` (`resource_zia_url_categories.go:144-148`). `TLD_CATEGORY` is for TLD-scoped categories (e.g., block all of `.ru`); `ALL` is a wildcard type filter used on lookups.
- **Category `scopes[].scope_type` enum**: `ORGANIZATION`, `DEPARTMENT`, `LOCATION`, `LOCATION_GROUP` (`resource_zia_url_categories.go:125-130`). Defines who can manage a custom category — ties into RBAC.
- **Server-assigned fields** (not writable): `val` (numeric internal ID — incrementing on creation; see `zia-02` clarification), `editable` (built-in categories are `editable=False`), `custom_category` (true for customer-created), `url_keyword_counts` nested object with four sub-counts. These are echoed back on PUT to keep the SDK tolerant, but the API ignores them on write.
- `customOnly=true` filtering is the easiest way to enumerate just tenant-authored categories via API.

### URL Filtering rules

Endpoints follow the standard REST pattern. From `vendor/zscaler-sdk-python/zscaler/zia/url_filtering.py` (`URLFilteringAPI` class):

| Method | Path | Purpose |
|---|---|---|
| GET | `/urlFilteringRules` | List rules in rule order |
| GET | `/urlFilteringRules/{id}` | Get a specific rule |
| POST | `/urlFilteringRules` | Create rule |
| PUT | `/urlFilteringRules/{id}` | Update rule |
| DELETE | `/urlFilteringRules/{id}` | Delete rule |

The SDK handles a set of camelCase ↔ snake_case field renames via its `reformat_params` list:

```
cbi_profile ↔ cbiProfile
departments ↔ departments
devices ↔ devices
device_groups ↔ deviceGroups
groups ↔ groups
labels ↔ labels
locations ↔ locations
location_groups ↔ locationGroups
override_users ↔ overrideUsers
override_groups ↔ overrideGroups
time_windows ↔ timeWindows
workload_groups ↔ workloadGroups
users ↔ users
```

TF equivalent: `zia_url_filtering_rules` resource. See `vendor/terraform-provider-zia/docs/resources/zia_url_filtering_rules.md` for the full field schema.

**SDK-level findings** (`zscaler/zia/url_filtering.py`, `zscaler/zia/models/url_filtering_rules.py`):

- **`urlCategories` and `urlCategories2` are ANDed, not ORed.** A rule fires only if the request matches a category from BOTH lists. Docs list both fields without stating the operator — an operator who expects OR will get surprisingly narrow matches. (`url_filtering.py:204-205`)
- **Full `action` enum**: `ANY`, `NONE`, `BLOCK`, `CAUTION`, `ALLOW`, `ICAP_RESPONSE`. Docs surface ALLOW / BLOCK / CAUTION publicly; `ICAP_RESPONSE` (hand off to ICAP for external processing) and the `ANY` / `NONE` sentinels are SDK-visible. (`url_filtering.py:166`)
- **`block_override` + `override_users` / `override_groups` are conditional.** Override lists are silently ignored unless `block_override=True` AND `action=BLOCK`. (`url_filtering.py:191-194`)
- **`ciparule` is a per-rule boolean** distinct from the tenant-wide `enableCIPACompliance` toggle in Advanced Policy Settings — two independent mechanisms; easy to conflate.
- **Enumerated `request_methods`**: `CONNECT`, `DELETE`, `GET`, `HEAD`, `OPTIONS`, `OTHER`, `POST`, `PUT`, `TRACE`. (`url_filtering.py:196-199`)
- **`user_agent_types` includes `MSCHREDGE`** (Microsoft Chromium-based Edge, likely distinct from `MSEDGE` legacy Edge). (`url_filtering.py:198`)
- **`last_modified_time` / `last_modified_by` are server-assigned but tolerated on PUT** — the SDK echoes them; don't trust them as input.

**TF-level findings** (`terraform-provider-zia/zia/resource_zia_url_filtering_rules.go`):

- **`rank` range is `0–7`** (validated by `IntBetween(0, 7)` at `:220`). Admin rank 0 is highest; 7 is lowest. Any value outside this range is rejected at plan time. Confirms the `zia-05` resolved clarification and publishes a numeric ceiling help docs omit.
- **`time_quota` range: `15–600` minutes** (`IntBetween(15, 600)` at `:235`). "Leave blank = no quota" is true but values below 15 or above 600 are rejected — easy to hit when migrating old configs.
- **`size_quota` range: `10–100,000` KB** (`IntBetween(10, 100000)` at `:241`). Same rejection pattern as `time_quota`.
- **TF action enum** (4 values): `BLOCK`, `CAUTION`, `ALLOW`, `ISOLATE` (`:270-275`). Note this is narrower than the SDK enum (which also lists `ANY`, `NONE`, `ICAP_RESPONSE`) — the TF provider restricts to user-configurable values.
- **`description` max length: 10,240 characters** (`StringLenBetween(0, 10240)` at `:197`).
- **`description` diffs suppressed via `noChangeInMultiLineText`** — the API normalizes whitespace / line endings. A plan-time diff in `description` that "looks right" is probably a whitespace-only delta the server rewrote. See [`../terraform.md § Schema patterns worth knowing`](../terraform.md#schema-patterns-worth-knowing).

### Cloud App Control rules

TF resource: `zia_cloud_app_control_rule`. Note: rule type (URL_FILTERING / CLOUD_APP_CONTROL / etc.) is part of the resource identity — you can't change rule type without recreating the rule.

SDK module: `vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py`.

**SDK-level findings** (`zscaler/zia/models/cloudappcontrol.py`):

- **Per-cloud-app lifecycle flags** on the nested `Application` object: `deprecated`, `misc`, `app_not_ready`, `under_migration`, `app_cat_modified`. An app with `under_migration=True` may behave differently under policy; these flags don't surface in the console UI but are visible in API responses. When auditing "why was this app caught by rule X", always check these lifecycle flags.
- **`val` is a numeric server-assigned identifier** on each `Application` entry, distinct from the string `id` on rules. SDK `request_format()` echoes `val` when specifying apps in rules.
- **Two separate EUN fields** on CAC rules: `eun_template_id` (web-based EUN) and `browser_eun_template_id` (browser-specific EUN). Both default to `None`.
- **`predefined=True` marks built-in non-deletable rules** — analogous to `default_rule` on SSL inspection. The IoT predefined rules described in *Adding Rules to the Cloud App Control Policy* use this flag.
- **`cascading_enabled`** (default `False`) — the per-rule cascade-to-URL-filtering toggle surfaced in the console when the global Advanced-Settings cascading is disabled.
- **Tenancy restriction integration** is first-class on CAC rules via `tenancy_profile_ids`, `sharing_domain_profiles`, `form_sharing_domain_profiles` — all `ResourceReference` lists. Tenant Profiles aren't a separate rule type; they attach to existing CAC rules.

### SSL Inspection rules

SDK module: `vendor/zscaler-sdk-python/zscaler/zia/ssl_inspection_rules.py`.

TF: `zia_ssl_inspection_rules`.

**SDK-level findings** (`zscaler/zia/models/ssl_inspection_rules.py`):

- **`action` is a nested object, not a string.** Structure: `{ type: DECRYPT | DO_NOT_DECRYPT | ... }` plus one of two conditional sub-objects:
  - `decryptSubActions` when `type=DECRYPT` — contains `minClientTLSVersion`, `minServerTLSVersion` (independent per-direction TLS floors), `http2_enabled` (HTTP/2 inspection), `block_undecrypt` (block traffic that fails decryption).
  - `doNotDecryptSubActions` when `type=DO_NOT_DECRYPT` — contains `minTLSVersion` (single TLS floor for bypass traffic).
  - **Sending the wrong sub-object for a given type is NOT client-validated** — it'll silently pass through; API-side behavior unstated.
- **`platforms` enum** (OS-level match, SSL-inspection-specific): `SCAN_IOS`, `SCAN_ANDROID`, `SCAN_MACOS`, `SCAN_WINDOWS`, `SCAN_LINUX`, `NO_CLIENT_CONNECTOR`.
- **`road_warrior_for_kerberos`** (bool) — SSL-inspection-only field; when True, the rule applies to remote PAC users authenticating via Kerberos. Not available on URL Filtering or CAC rules.
- **`zpa_app_segments`** (list) — ZPA Source-IP-Anchoring-enabled segments, a cross-product reference from ZIA to ZPA. Enables routing decrypted ZPA-bound traffic through ZIA inspection.
- **`default_rule=True`** and **`predefined=True`** mark built-in rules (e.g., the IoT bypass rule we saw in *About the SSL/TLS Inspection Policy Page*). These echo back on PUT; don't strip them.

### Advanced Policy Settings

SDK module: `zscaler/zia/advanced_settings.py`. Single-resource endpoint wrapping the *Configuring Advanced Policy Settings* page.

**SDK-level findings** (`zscaler/zia/models/advanced_settings.py`):

- **20+ boolean toggles** covering CIPA Compliance, Suspicious New Domains Lookup, 3rd-Party URL Category Lookup, AI/ML Content Categorization, Embedded Sites Categorization, Enforce SafeSearch, Creative Commons Search, Identity-Based Block Override, One-Click Office 365, plus UCaaS one-click configs.
- **Per-auth-method bypass lists** — `auth_bypass_urls/apps/url_categories`, `kerberos_bypass_*`, `basic_bypass_*`, `digest_auth_bypass_*`. Each auth method has independent bypass lists defaulting to `[]`.
- **`enable_evaluate_policy_on_global_ssl_bypass`** (default `False`) — critical security toggle. When True, URL filtering policy is evaluated even for traffic on the global SSL bypass list. Docs barely mention this; it's the answer to "why wasn't a URL rule enforced on SSL-bypassed traffic?"
- **`prefer_sni_over_conn_host`** + `block_connect_host_sni_mismatch` — separate SNI-vs-CONNECT handling toggles with their own per-app override lists (`prefer_sni_over_conn_host_apps`, `block_domain_fronting_apps`). Reveals that SNI handling + domain-fronting posture are configurable at per-app granularity, not just tenant-wide.

### Advanced URL Filter & Cloud App Settings

Separate resource from Advanced Policy Settings (the console page is different too).

**SDK-level findings** (`zscaler/zia/models/url_filter_cloud_app_settings.py`):

- **UCaaS one-click toggles**: `enable_zoom`, `enable_logmein`, `enable_ringcentral`, `enable_webex`, `enable_talkdesk`. These are distinct from the Microsoft O365 toggles (`enable_office365`, `enable_msft_o365`).
- **Per-product AI prompt logging**: `enable_chat_gpt_prompt`, `enable_microsoft_copilot_prompt`, `enable_gemini_prompt`, `enable_poe_prompt`, `enable_meta_prompt`, `enable_perplexity_prompt`. All separate booleans, all default `False`.
- **Client-enforced mutual exclusion** (`url_filtering.py:515-527`): when `enable_cipa_compliance=True`, these four settings **must be False** or the SDK raises `ValueError`:
  - `enable_newly_registered_domains`
  - `consider_embedded_sites`
  - `enforce_safe_search`
  - `enable_dynamic_content_cat`

  This is a concrete API-level constraint that *Configuring Advanced Policy Settings* documents only as a warning banner. CIPA deployments must run without these four enrichments.

### Cloud NSS feeds

SDK module: `zscaler/zia/cloud_nss.py`. Corresponds to the per-log-type Cloud NSS feed creation.

**SDK-level findings** (`zscaler/zia/models/cloud_nss.py`):

- **Native OAuth2 support** as first-class fields — not custom headers: `client_id`, `client_secret`, `authentication_url`, `grant_type`, `scope`. Toggled by `oauth_authentication` (default `False`). This is how Cloud NSS authenticates to SIEMs that expose OAuth2-protected log-ingestion endpoints.
- **Unified feed model** covers all log types — firewall, DNS, web, DLP, CASB, tunnel, audit, email DLP, endpoint DLP. Log type selected via `nss_log_type` / `nss_feed_type` fields; unused filter fields are simply omitted. There is no per-log-type model.
- **Server-assigned feed-status fields**: `last_success_full_test`, `test_connectivity_code`. The related `NSSTestConnectivity` object (`zscaler/zia/models/cloud_nss.py:535-559`) is a separate resource for triggering and reading test results.

**TF-level enum enrichment** (`terraform-provider-zia/zia/resource_zia_cloud_nss_server.go`):

- **`nss_log_type` — 21 values** (`:69-91`): `ADMIN_AUDIT`, `WEBLOG`, `ALERT`, `FWLOG`, `DNSLOG`, `MULTIFEEDLOG`, `CASB_FILELOG`, `CASB_MAILLOG`, `ECLOG`, `EC_DNSLOG`, `CASB_ITSM`, `CASB_CRM`, `CASB_CODE_REPO`, `CASB_COLLAB`, `CASB_PCS`, `USER_ACT_REP`, `USER_COUNT_ALERT`, `USER_IMP_TRAVEL_ALERT`, `ENDPOINT_DLP`, `EC_EVENTLOG`, `EMAIL_DLP`. Help-site tables list roughly 8; TF validator is the authoritative enumeration.
- **`nss_feed_type`** includes SIEM formats plus `ZBRIDGE` and `SYMANTEC_MSS` variants (`:97-112`) — both absent from help-site NSS docs.
- **`siem_type` enum (6 values)**: `SPLUNK`, `SUMO_LOGIC`, `DEVO`, `OTHER`, `AZURE_SENTINEL`, `S3` (`:147-154`). **S3 bucket as a SIEM destination** is not called out in NSS help articles.
- **`web_log_type` enum**: `SESSION` / `AGGREGATE` / `ALL` (`:291-295`). Controls per-session vs aggregated web log emission.
- **`email_dlp_policy_action` enum**: `ALLOW` / `CUSTOMHEADERINSERTION` / `BLOCK` (`:345-349`). `CUSTOMHEADERINSERTION` is an undocumented action type for email DLP.
- **Feed URL must use HTTPS**: both `url` and `oauth_url` validate via `IsURLWithHTTPS` (`:165, 216`). HTTP endpoints are rejected at the provider layer.

### Tenancy Restriction Profiles

SDK module: `zscaler/zia/tenancy_restriction_profile.py`. Corresponds to the *Tenant Profiles* feature; see `vendor/zscaler-help/about-tenant-profiles.md` and clarification `zia-08`.

**SDK-level findings** (`zscaler/zia/tenancy_restriction_profile.py`, `zscaler/zia/models/tenancy_restriction_profile.py`):

- **Full `app_type` enum — 15 values** (help article *Adding Tenant Profiles* lists 13; SDK reveals 2 additional):
  - `YOUTUBE`, `GOOGLE`, `MSLOGINSERVICES`, `SLACK`, `BOX`, `FACEBOOK`, `AWS`, `DROPBOX`, `WEBEX_LOGIN_SERVICES`, `AMAZON_S3`, `ZOHO_LOGIN_SERVICES`, `GOOGLE_CLOUD_PLATFORM`, `ZOOM`, `IBMSMARTCLOUD`, `GITHUB`, `CHATGPT_AI`
  - Help article omits `BOX`, `FACEBOOK`, `AMAZON_S3`. Clarification `zia-08` should be updated with the SDK-authoritative list.
- **`ms_login_services_tr_v2`** (bool) — selects between Microsoft Login Services v1 and v2 tenant-restriction protocols. Not a metadata flag; it changes the protocol spoken.
- **`allow_gcp_cloud_storage_read`** — GCP-specific; controls whether GCS reads are permitted within a GCP tenant profile. Defaults to `None` (server-side default unspecified in SDK).
- **YouTube `item_value`** — 31 YouTube category tokens (e.g. `TENANT_RESTRICTION_FILM_AND_ANIMATION`, `TENANT_RESTRICTION_GAMING`). Only meaningful when `app_type=YOUTUBE`.

### Other resources with notable TF schema constraints

Not core to the skill's reasoning layer but worth knowing when reading tenant HCL or snapshots.

- **VPN credentials (traffic forwarding)** — `type`, `fqdn`, `ip_address`, `pre_shared_key` are **all `ForceNew`** (`resource_zia_traffic_forwarding_vpn_credentials.go:77, 87, 93, 99`). Rotating a pre-shared key or migrating between IP and UFQDN requires **destroying and recreating** the credential — a tenant-visible disruption. The PSK is also `Sensitive` (masked in state/plan). `type` accepts only `IP` or `UFQDN` — `CN` / `DN` types that appear in some reference material are not in the TF validator.
- **DLP Dictionaries** — `phrases` max 256 (`MaxItems`), `patterns` max 8, `phrase_count` threshold `0–10000` (`resource_zia_dlp_dictionaries.go:101, 135, 270`).
- **Security Policy Settings** — `whitelist_urls` max 255, `blacklist_urls` max **275,000** (`resource_zia_security_policy_settings.go:51, 61`). The 275K blacklist ceiling is a much larger budget than the URL-category custom-URLs quota (25K).
- **Auth Settings URLs** — max 25,000 (`resource_zia_auth_settings_urls.go:46`).
- **DLP Web Rules** — `min_size` range `0–96,000` KB (~93 MB) (`resource_zia_dlp_web_rules.go:189`).
- **File Type Control Rules** — `min_size` and `max_size` both `0–409,600` KB (400 MB) (`resource_zia_file_type_control_rules.go:168, 175`).

## Go-SDK-only surfaces (cross-SDK audit 2026-04-24)

Cross-check against `vendor/zscaler-sdk-go/zscaler/zia/services/` surfaced services the Python SDK at `vendor/zscaler-sdk-python/zscaler/zia/` doesn't expose. These are real ZIA API surfaces — tooling that needs them must use the Go SDK or direct HTTP calls:

- **`scim_api`** (Go: `zia/services/scim_api/scim_user_api.go`, `scim_group_api.go`) — full SCIM CRUD for ZIA users and groups via a distinct `ScimZIAService` client. Python has no ZIA SCIM module at all; user management in Python is limited to the older `user_management` surface.
- **`email_profiles`** (Go: `zia/services/email_profiles/email_profiles.go`) — DLP email profile CRUD with `GetAll` / `GetAllLite` / filter options. Python has no equivalent; closest is `end_user_notification.py` which serves a different purpose.
- **`eventlogentryreport`** (Go) — event-log entry report CRUD (`GetAll`, `Create`, `Delete`). Python's `audit_logs` covers ZIA admin-action audit; this is a distinct report surface.
- **`devicegroups`** (Go) — device-group CRUD. Python's `device_management` doesn't expose group-level CRUD.
- **Naming note: `advancedthreatsettings` (Go) == `atp_policy` (Python).** Same API surface (`GetAdvancedThreatSettings` / `GetMaliciousURLs` / `GetSecurityExceptions`) under different module names. `references/zia/malware-and-atp.md` uses the Python "ATP" naming; a Go-SDK-using reader will find it under `advancedthreatsettings`.

Python-only modules the Go SDK doesn't carry (mostly newer features or SDK-lag not yet ported): `casb_dlp_rules`, `casb_malware_rules`, `cloud_browser_isolation`, `risk_profiles`, `sub_clouds`, `proxies`, `dns_gateways`, `dedicated_ip_gateways`.

## Read/write shape asymmetries

Cross-cutting hub for fields where `GET` and `POST`/`PUT` disagree on shape, value, or presence semantics. Detail lives in topical docs; this section is the discovery point for "API round-trip will bite me, where?" questions.

| Asymmetry | Topical home | Severity |
|---|---|---|
| **Sandbox default rule `order` is `127` on read; cannot be written as `127` (collides with default → `DUPLICATE_ITEM`).** Other ZIA rule types use `-1` as the default sentinel; sandbox is the outlier. Engineering tracks as `BUG-208047`. | [`./sandbox.md § Default rule order is 127, NOT -1`](./sandbox.md) | High — silently breaks rule-ordering math |
| **Location Management `tz` and `country` fields — read returns unprefixed; write-side current state TF-version-dependent.** ZIA API recently changed to return `NETHERLANDS_EUROPE_AMSTERDAM` (was `THE_NETHERLANDS_EUROPE_AMSTERDAM`). Confirmed by tf-zia#562 + v4.7.18 changelog ("align with recent API changes"). v4.7.18+ removes TF schema validation; whether the API accepts both forms or only one on write is not source-verified — three scenarios remain plausible. See [`../_verification-protocol.md § Worked example`](../_verification-protocol.md) for full evolution. | [`./locations.md § Edge cases (tz prefix)`](./locations.md) | High pre-v4.7.18; uncertain post-v4.7.18 (API behavior unverified) |
| **URL Filter rule `description` whitespace and line endings normalized server-side.** What you `PUT` is not what `GET` returns; naive equality checks on round-trip falsely report drift. | [`#sdk-response-shape`](#sdk-response-shape) (this doc, in pattern callout) | Low — cosmetic but confuses diffs |
| **User Management `auth_methods` — TF resource validator stricter than Go SDK / API.** TF data source `data_source_zia_user_management_users.go:98–99` accepts `[BASIC, DIGEST]`; TF resource `resource_zia_user_management_users.go:86` accepts only `[BASIC]`. Go SDK at `zscaler-sdk-go/zscaler/zia/services/usermanagement/users/users.go:105` validates `BASIC`-or-`DIGEST` (matching the API). DIGEST users created via portal or legacy API are readable via the data source but cannot be created or updated via the TF resource. **TF provider bug, not an API asymmetry.** Surfaced by `scripts/find-asymmetries.py` Pass 1 (intra-provider). | (TF-provider-level; no topical doc) | Medium — TF-only constraint; bypass via Go SDK or direct HTTP |

**Adding entries here:** when a new asymmetry is documented in a topical doc, add a one-line cross-link row above. Do not duplicate the detail.

## Pagination

Per SDK README:

> Built-in with `resp.has_next()` and `resp.next()`.

Idiom:

```python
result, resp, error = client.zia.url_filtering_rules.list_rules()
while resp.has_next():
    more, resp, error = resp.next()
    result.extend(more)
```

## Rate limits, retries, and error handling

Per SDK README, the SDK has a "custom HTTP executor with retries, caching, etc." — backoff and retry are handled internally. Explicit rate-limit values are not documented in the vendored SDK material; see Ranges & Limitations article for specifics (not vendored yet).

## Related SDK modules

Complete list of ZIA submodules available at `vendor/zscaler-sdk-python/zscaler/zia/` — relevant to this skill:

- `activate.py` — activation status / POST activate
- `url_filters.py` — URL filtering rules
- `cloudappcontrol.py` — Cloud App Control
- `cloud_firewall.py`, `cloud_firewall_rules.py`, `cloud_firewall_dns.py`, `cloud_firewall_ips.py` — firewall module rules
- `casb_dlp_rules.py`, `casb_malware_rules.py` — CASB
- `browser_control_settings.py` — Browser Control (evaluated in web module after URL filtering)
- `atp_policy.py` — Advanced Threat Protection
- `advanced_settings.py` — the "Advanced Policy Settings" page (controls cascading, AI/ML categorization, SafeSearch, etc. — see `references/zia/url-filtering.md`)
- `dlp_dictionary.py`, `dlp_engine.py` — DLP
- `bandwidth_classes.py`, `bandwidth_control_rules.py` — bandwidth classes and rules
- `cloud_nss.py` — Cloud NSS feed configuration (log streaming)
- `audit_logs.py` — admin audit logs

## Terraform resource map

Notable ZIA resources at `vendor/terraform-provider-zia/docs/resources/`:

- `zia_activation_status` — activation trigger
- `zia_url_categories`, `zia_url_filtering_rules` — URL filtering
- `zia_cloud_app_control_rule` — CAC rules
- `zia_ssl_inspection_rules` (or similar; verify exact name)
- `zia_advanced_settings`, `zia_advanced_threat_settings` — policy settings pages
- `zia_dlp_web_rules`, `zia_dlp_dictionaries`, `zia_dlp_engines` — DLP
- `zia_cloud_nss_feed` — NSS feed config

Data sources mirror many of these (see `vendor/terraform-provider-zia/docs/data-sources/`).

## Scripts in this repo that use these endpoints

Both scripts use `zscaler-sdk-python` via a `uv run`–style self-contained shebang. Env-var setup per this doc's **Authentication** section.

- **`scripts/url-lookup.py <url>`** — implements the `investigate-url` workflow (adapted from `vendor/zscaler-mcp-server/commands/investigate-url.md`). Calls `client.zia.url_categories.lookup([url])` to classify the URL, then `client.zia.url_filtering.list_rules()` to enumerate rules referencing the resulting category. Reports rule order, action, scope, and enabled state.
- **`scripts/snapshot-refresh.py [--zia-only | --zpa-only]`** — bulk-dumps ZIA `url_categories.list_categories`, `url_filtering.list_rules`, `cloudappcontrol.list_rules`, `advanced_settings.get_advanced_settings` to `snapshot/zia/*.json`, plus ZPA equivalents to `snapshot/zpa/*.json`. Writes `snapshot/_manifest.json` with fetch timestamps and per-resource counts. Handles SDK pagination via `resp.has_next()` / `resp.next()`.

These scripts are the authored implementation of the stubs referenced by the skill's *Check for a snapshot first* section in `SKILL.md`.

## Open questions

None specific to the API. See `zia/url-filtering.md`, `zia/ssl-inspection.md` for behavior-level clarifications.

## Cross-links

- URL filtering behavior — [`./url-filtering.md`](./url-filtering.md)
- Cloud App Control behavior — [`./cloud-app-control.md`](./cloud-app-control.md)
- SSL inspection behavior — [`./ssl-inspection.md`](./ssl-inspection.md)
- Log stream config via Cloud NSS — [`./logs/web-log-schema.md`](./logs/web-log-schema.md)
