---
product: shared
topic: "runbooks"
title: "Runbooks — actionable patterns and troubleshooting flows"
content-type: reasoning
last-verified: "2026-04-25"
confidence: high
source-tier: mixed
sources:
  - "references/shared/oneapi.md"
  - "references/_verification-protocol.md"
  - "vendor/zscaler-sdk-python/zscaler/utils.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/legacy.py"
author-status: draft
---

# Runbooks — actionable patterns and troubleshooting flows

The rest of the skill is **reference**: how things work, what fields mean, why behaviors differ. This doc is **runbook**: what to do when faced with a specific operational task or failure. It exists because reference docs alone leave too much decision-making to the caller — an agent or operator needs deterministic next steps, not just background.

If you find yourself reading a reference doc to figure out which steps to take, the runbook for that case is missing — open a clarification or PR to add it here.

## Table of contents

1. [Authentication selection](#authentication-selection-decision-tree) — pick the right auth mechanism for a tenant
2. [Diagnostic procedures](#diagnostic-procedures) — figure out what kind of tenant / cloud / migration state you have
3. [Troubleshooting flows](#troubleshooting-flows) — concrete diagnostic chains for common failure modes
4. [Credential lifecycle](#credential-lifecycle) — rotation, fallback, coexistence patterns

---

## Authentication selection (decision tree)

Use this when starting a new automation, or when an inherited script is failing on auth and you need to confirm it's using the right mechanism.

### Step 1 — Identify the cloud

Run the [cloud detection](#diagnostic-1-which-cloud-is-this-tenant-on) procedure. Outcomes:

- **Commercial cloud** (`zscaler.net`, `zscalertwo.net`, `zscalerthree.net`, `zscloud.net`, `zscalerbeta.net`, `zscalerone.net`): OneAPI eligible if tenant has migrated to ZIdentity.
- **Gov cloud** (`zscalergov`, `zscalerten`, ZPA `GOV` / `GOVUS`): **Cannot use OneAPI** — must use the product-specific legacy path.
- **Sub-cloud** (custom CONUS or tenant-specific subcloud): same OneAPI-vs-legacy logic as the parent commercial cloud.

### Step 2 — Identify the product set

What products does this script touch?

- **ZDX** in scope → ZDX always uses **ZDX legacy** auth (SHA256-signed timestamp). ZDX has not migrated to OneAPI as of 2026-04 capture date. Even on ZIdentity-migrated tenants, ZDX retains its own auth.
- **Only ZCC** in scope → can use either **OneAPI** (if ZIdentity-configured) or **ZCC legacy** (apiKey + secretKey). OneAPI preferred for new code.
- **ZIA, ZPA, ZIdentity, ZTW (Cloud Connector), or BI** in scope → eligible for OneAPI on commercial clouds; must use product-specific legacy on gov clouds.

### Step 3 — Confirm OneAPI is actually configured

Even on a commercial cloud, OneAPI requires a ZIdentity API client to be created. Run [OneAPI availability detection](#diagnostic-2-is-oneapi-configured-for-this-tenant). If the API client exists, use OneAPI. If not, fall back to legacy until ZIdentity onboarding is complete.

### Decision matrix

| Tenant cloud | Products | Recommended auth |
|---|---|---|
| Commercial, ZIdentity-configured | ZIA / ZPA / ZIdentity / ZCC / ZTW / BI | **OneAPI OAuth 2.0** |
| Commercial, ZIdentity-configured | ZDX (any subset) | **ZDX legacy** for ZDX calls; OneAPI for everything else |
| Commercial, NOT ZIdentity-configured | ZIA | **ZIA legacy** (obfuscated timestamp) |
| Commercial, NOT ZIdentity-configured | ZPA | **ZPA legacy** (Client ID + Customer ID) |
| Commercial, NOT ZIdentity-configured | ZCC | **ZCC legacy** (apiKey + secretKey) |
| Commercial, NOT ZIdentity-configured | ZDX | **ZDX legacy** |
| Gov cloud | ZIA | **ZIA legacy** (no OneAPI) |
| Gov cloud | ZPA | **ZPA legacy** (`GOV` / `GOVUS` clouds) |
| Gov cloud | ZCC | **ZCC legacy** |
| Gov cloud | ZDX | **ZDX legacy** |

**Multi-product scripts on gov clouds:** must implement multiple legacy auth paths. There is no unified gov-cloud auth.

**Multi-product scripts touching ZDX:** must always implement ZDX-legacy alongside whatever else, since ZDX never migrated.

See [`./shared/oneapi.md § Authentication mechanisms`](./shared/oneapi.md) for the full per-mechanism details, including the obfuscation algorithm for ZIA legacy and the SHA256 flow for ZDX legacy.

---

## Diagnostic procedures

### Diagnostic 1 — Which cloud is this tenant on?

**Why you need this:** the cloud determines auth eligibility (gov → no OneAPI), API base URLs, and which subcloud-routing rules apply.

**Procedure:**

1. **Check the admin portal URL** — the easiest signal:
   - `admin.zscaler.net` → cloud is `zscaler.net` (commercial default)
   - `admin.zscalertwo.net` → cloud is `zscalertwo.net`
   - `admin.zscloud.net` → cloud is `zscloud.net`
   - `admin.zscalergov.net` → cloud is `zscalergov` (US Gov cloud — **forced legacy**)
   - `admin.zscalerten.net` → cloud is `zscalerten` (US Gov 10 — **forced legacy**)
   - For ZPA: `admin.zpacloud.com` (commercial), `admin.zpagov.net` (`GOV`), `admin.zpagov-us.net` (`GOVUS`)
2. **Check the env var** if set: `ZSCALER_CLOUD=...` will name the cloud explicitly. **Note (per `tf-zia#552`):** for production commercial-cloud tenants, this var should be **unset** — the SDK defaults to commercial. Setting it is for gov / beta / non-default commercial only.
3. **Failing both:** call the SDK's `LegacyZIAClient` config to read `cloud` (or the OneAPI vanity domain detection routine) — but if you're at this point, the tenant is undocumented and a TAM ticket is warranted before scripting against it.

**Output of this step:** one of `commercial / gov / unknown`. If gov → skip OneAPI consideration entirely.

### Diagnostic 2 — Is OneAPI configured for this tenant?

**Why you need this:** even on a commercial cloud, OneAPI requires the tenant admin to have created a ZIdentity API client. The migration is opt-in.

**Procedure:**

1. **Check for ZIdentity admin URL access:** `https://admin.<vanity>.zslogin.net`. If this resolves and an admin account exists, ZIdentity is set up. The vanity domain is the prefix (e.g., `acme` from `admin.acme.zslogin.net`).
2. **Check for an existing API client:** ZIdentity Admin Portal → Integrations → API Clients. If clients exist, OneAPI is configured. If empty, OneAPI is set up but no integrations exist yet.
3. **Confirm via env vars:** if the tenant's automation already uses `ZSCALER_CLIENT_ID` + `ZSCALER_CLIENT_SECRET` + `ZSCALER_VANITY_DOMAIN`, OneAPI is in active use.
4. **Failing all of these:** OneAPI is not configured. Fall back to legacy until the tenant admin runs ZIdentity onboarding.

**Output:** `oneapi-configured / oneapi-available-not-configured / not-set-up`. The middle state means the tenant CAN use OneAPI but you'll need to create an API client first.

### Diagnostic 3 — Which auth path is an existing script using?

**Why you need this:** when inheriting automation, you may not know whether it's running OneAPI or legacy. Different rotation/fallback patterns apply.

**Procedure:**

1. **Look for ZSCALER_USE_LEGACY=true** in env or scripts. If set → legacy. If unset → OneAPI is the assumed default.
2. **Check the SDK class instantiation:**
   - `ZscalerClient(...)` → OneAPI
   - `LegacyZIAClient(...)` / `LegacyZPAClient(...)` / `LegacyZDXClient(...)` / `LegacyZCCClient(...)` → corresponding legacy
3. **Check the env-var pattern:**
   - `ZSCALER_CLIENT_ID` + `ZSCALER_VANITY_DOMAIN` → OneAPI
   - `ZIA_USERNAME` + `ZIA_API_KEY` + `ZIA_CLOUD` → ZIA legacy
   - `ZPA_CLIENT_ID` + `ZPA_CUSTOMER_ID` → ZPA legacy

### Diagnostic 4 — Is my snapshot data current?

**Why you need this:** scripts derive answers from `snapshot/` JSON. If snapshot is stale or empty, answers can be wrong.

**Procedure:**

1. `ls snapshot/zia/ snapshot/zpa/ snapshot/zcc/` — if directories are empty (only `.gitkeep`), no snapshot exists.
2. `cat snapshot/_manifest.json` — inspect timestamps. Fields older than the last tenant config change are stale.
3. Re-run `./scripts/snapshot-refresh.py` to update.

If snapshot is empty (upstream skill default), the skill should DECLINE tenant-specific questions per the SKILL.md "When to decline" rules. This is a feature, not a bug — it prevents the skill from confabulating tenant data.

---

## Troubleshooting flows

### TS-1 — "401 Unauthorized" with credentials I'm sure are valid

```
Start
├─ Did the token request succeed (200) but the API call return 401?
│  └─ YES → Most likely missing `audience=https://api.zscaler.com` in the
│           token request. See oneapi.md § OneAPI OAuth 2.0 — the audience parameter is REQUIRED.
│  └─ NO (token request itself returns 401) → continue ↓
│
├─ Are you using OneAPI on a gov cloud?
│  └─ YES → Gov clouds don't support OneAPI. Switch to legacy auth.
│           See decision matrix above.
│  └─ NO → continue ↓
│
├─ Is the tenant on ZIdentity?
│  └─ NO → OneAPI requires ZIdentity. Use legacy until ZIdentity onboarding completes.
│  └─ YES → continue ↓
│
├─ Has the API client's client_secret been rotated recently?
│  └─ YES → New secret may not have propagated. Wait 5 minutes and retry.
│  └─ NO → continue ↓
│
├─ Are the env vars set correctly? (ZSCALER_CLIENT_ID + _SECRET + _VANITY_DOMAIN)
│  └─ MAYBE → Diagnose env-var pattern (see Diagnostic 3 above).
│
└─ Last resort → Rotate the API client secret in ZIdentity portal; update env vars; retry.
```

### TS-2 — "I changed a ZIA rule and it's not taking effect"

```
Start
├─ Is the change committed via API/Terraform but not yet activated?
│  └─ YES → ZIA changes are saved-but-not-live until activation.
│           See references/shared/activation.md.
│           Run: client.zia.activation.activate()  or  POST /zia/api/v1/status/activate
│  └─ NO (you ran activate already) → continue ↓
│
├─ Is there an EDIT_LOCK_NOT_AVAILABLE 409 lurking?
│  └─ YES → Concurrent admin or automation has a write lock.
│           Wait or coordinate; activation can't complete with a held lock.
│  └─ NO → continue ↓
│
├─ Is the rule disabled but holding its order slot?
│  └─ YES → Per the disabled-rule-holds-its-slot rule. See references/zia/url-filtering.md.
│           Disabled rules don't fire but DO occupy their order slot.
│           A higher-order disabled rule can prevent a lower-order rule from being matched.
│  └─ NO → continue ↓
│
├─ Is rule order set correctly?
│  └─ Check the rule's order attribute. Sandbox default rule = 127 (NOT -1) per BUG-208047.
│           See references/zia/sandbox.md if dealing with sandbox rules.
│
├─ Is the URL falling into a different category than expected?
│  └─ Use scripts/url-lookup.py to verify category resolution.
│           Specificity-wins-across-custom-categories may route the request to a different rule.
│
└─ Still not behaving → Check Web Insights logs for "Blocked Policy Type"; the answer is in the data.
```

### TS-3 — "Snapshot script returned no data" or "scripts/snapshot-refresh.py errored"

```
Start
├─ Are submodules initialized?
│  └─ Run: git submodule update --init --recursive
│
├─ Is uv installed and on PATH?
│  └─ Run: which uv  (install via curl -LsSf https://astral.sh/uv/install.sh | sh)
│
├─ Are credentials set?
│  └─ Check: env | grep ZSCALER  (or ZIA_/ZPA_/ZCC_ for legacy)
│
├─ Did the SDK instantiate cleanly?
│  └─ Run: python3 -c "from zscaler import ZscalerClient; ZscalerClient({'client_id': '...', ...})"
│
├─ 429 rate-limited?
│  └─ See TS-5 below.
│
└─ Per-resource failures (some succeed, some don't)?
   └─ Look at logs/snapshot-refresh.log; failures prefixed with `!`.
      `-` prefix = SDK doesn't expose that resource (e.g., older SDK version).
```

### TS-4 — "Activation is stuck or returning 409"

```
Start
├─ Status: STATE_PROCESSING_QUEUE_DEPTH_NOT_ZERO?
│  └─ Other admin or automation has changes in queue. Wait.
│
├─ Status: STATE_INVALID?
│  └─ A pending change has a config error. Use the admin console to find the offending change.
│           Activation will not complete until the bad change is reverted or fixed.
│
├─ Status: 409 EDIT_LOCK_NOT_AVAILABLE?
│  └─ Concurrent writer holds the lock. Retry with backoff; if persistent, check
│           who else has admin/automation access and coordinate.
│
├─ Status: STATE_READONLY?
│  └─ Tenant is in scheduled-maintenance read-only mode. Cannot activate during this window.
│           Header: x-zscaler-mode: read-only is the explicit signal.
│           See oneapi.md § Read-only mode.
│
├─ Cloud Connector activation needs a force?
│  └─ POST /ztw/api/v1/ecAdminActivateStatus/forceActivate — but treat this as last-resort.
│           See references/cloud-connector/api.md § Activation.
│           ZIA only has /activate (no forceActivate) — that's a CBC-specific escape hatch.
│
└─ Activation just slow → typical complete time is 1-3 minutes. Don't poll faster than every 30s.
```

### TS-5 — "429 Rate Limit exceeded"

```
Start
├─ Which product?
│  ├─ ZIA → Weight-based (Heavy DELETE / Medium POST,PUT / Light GET).
│  │      x-ratelimit-* headers indicate remaining budget. Backoff strategy is product-specific;
│  │      see oneapi.md § Rate limits — different model per product.
│  ├─ ZPA → Per-IP rate limit. RateLimit-* headers (different naming!).
│  ├─ ZDX → Tier-based by license count. RateLimit-* headers.
│  ├─ ZCC → Flat tenant-wide. X-Rate-Limit-* headers (note the dashes — different again!).
│  └─ ZTW (Cloud Connector) → Same as ZIA weight model.
│
├─ Are you running concurrent jobs?
│  └─ Each product has its own limit; concurrent jobs across one product double-count
│           against the same budget. Serialize when possible.
│
├─ Is your Retry-After header populated?
│  └─ Honor it. The default backoff in most SDKs honors Retry-After but custom code may not.
│
└─ Persistent 429 across windows → Tenant may need a rate-limit increase.
   Open a TAM / support case with traffic patterns documented.
```

### TS-6 — "I'm trying to round-trip a config (read → mutate → write) and it fails"

```
Start
├─ Which product/resource?
│
├─ Did you OMIT a key entirely or PASS it as None?
│  └─ For ZPA Application Segments: clientless_app_ids = None triggers BROWSER_ACCESS lookup
│     (key-presence vs truthiness). Omit the key if not setting clientless apps.
│     See references/zpa/app-segments.md § Edge cases.
│
├─ Read returns a value but write rejects the same value?
│  └─ Check api.md § Read/write shape asymmetries for that product.
│           Known gotchas: ZIA Location tz prefix, Sandbox default rule order=127,
│           URL Filter description whitespace normalization.
│
├─ Did the API echo back fields you tried to round-trip but they aren't write-fields?
│  └─ Server-assigned fields like id, creationTime, modifiedTime are echoed but ignored on write.
│           Stripping them is fine but not required.
│
├─ Got DUPLICATE_ITEM 400?
│  └─ Trying to create a default rule that already exists (Sandbox Default BA Rule, etc.)?
│           Don't manage default rules via TF/API — use terraform import or skip.
│
└─ Still failing → Check the SDK source for that resource. Some have read-only fields
   that the API will reject on write (e.g., ZIA SSL Inspection default_rule, predefined).
```

---

## Credential lifecycle

### Credential rotation pattern

**OneAPI client secret rotation (recommended cadence: every 90 days):**

1. In ZIdentity Admin Portal: Integrations → API Clients → [your client] → Generate new client secret.
2. The old secret remains valid for 24 hours (grace window) — both work concurrently.
3. Update env vars / secret manager with the new value.
4. Restart automation that picks up the env vars.
5. Verify the new secret works (any successful API call confirms).
6. **Optional but recommended:** before the 24-hour grace window expires, rotate again or revoke the old explicitly so a leaked credential doesn't outlast its expected lifetime.

**JWT key rotation (recommended cadence: yearly):**

1. Generate a new key pair (RS256).
2. Upload public key (or update JWKS URL) in ZIdentity API Client config — both keys remain valid.
3. Update private key in secret manager.
4. Verify tokens issued with the new key are accepted.
5. Remove the old public key (or update JWKS to drop the old `kid`).

### Fallback pattern (OneAPI → legacy on outage)

If a script needs OneAPI for normal operation but you want resilience for ZIdentity outages or transitional periods:

```python
def authenticate_zia(config):
    # Try OneAPI first
    if config.get("client_id") and config.get("vanity_domain"):
        try:
            from zscaler import ZscalerClient
            client = ZscalerClient(config)
            # Smoke test — if this fails, fall through to legacy
            _ = client.zia.advanced_settings.get_advanced_settings()
            return client
        except Exception as e:
            print(f"OneAPI auth failed: {e}; falling back to legacy", file=sys.stderr)
    # Legacy path — requires legacy creds in env
    if config.get("zia_username") and config.get("zia_api_key"):
        from zscaler.oneapi_client import LegacyZIAClient
        return LegacyZIAClient(config)
    raise RuntimeError("No usable auth path — set OneAPI or legacy creds")
```

**This pattern is for resilience, not for normal operation** — the legacy path may not be configured for your tenant, and if it isn't, the fallback fails too. Use only if you have both paths configured intentionally during a migration window.

### Coexistence pattern (OneAPI and legacy on the same tenant)

During a ZIdentity migration, both paths may be live. **Be explicit about which you're using** — running with stale legacy creds against a ZIdentity-enabled tenant works silently and may produce different results than the modern OneAPI flow against the same data (e.g., RBAC may differ between admin systems).

Audit-script discipline:

```python
import os
auth_path = "OneAPI" if os.environ.get("ZSCALER_CLIENT_ID") else "legacy"
print(f"Using auth path: {auth_path}", file=sys.stderr)  # Log explicitly for audit trail
```

### Gov-cloud forced-legacy pattern

A tenant on a gov cloud cannot use OneAPI. The tooling needs to recognize this and select legacy automatically:

```python
def is_gov_cloud(cloud_name):
    return cloud_name in ("zscalergov", "zscalerten", "GOV", "GOVUS")

cloud = os.environ.get("ZSCALER_CLOUD") or os.environ.get("ZIA_CLOUD") or "zscaler.net"
if is_gov_cloud(cloud):
    # Forced legacy — OneAPI not available
    from zscaler.oneapi_client import LegacyZIAClient
    client = LegacyZIAClient({"username": ..., "api_key": ..., "cloud": cloud, ...})
else:
    # Commercial — use OneAPI if creds available, else legacy
    ...  # See fallback pattern above
```

### Service account hygiene

- **Use dedicated automation accounts**, not personal admin accounts. Personal accounts get rotated when admins leave; automation breaks silently.
- **Scope each API client to least privilege.** ZIdentity API clients can be scoped per-product (ZIA-only, ZPA-only, etc.) and per-permission. A snapshot-refresh client doesn't need write scopes.
- **Tag clients with what consumes them.** ZIdentity API client name should identify the consuming script/system (e.g., `zscaler-skill-snapshot-refresh-PROD`). Untagged clients become un-rotatable.
- **Document the rotation schedule** alongside the client. Without a rotation cadence, secrets age silently into security incidents.

---

## Rollback / safe-change patterns

Reversibility differs sharply by product. Pick the right pattern for the product and resource you're changing.

### Reversibility per product

| Product | Reversibility model | Rollback window | Pattern |
|---|---|---|---|
| **ZIA** | **Staged via activation gate** (changes are saved-but-not-live until activate) | Until you call `/zia/api/v1/status/activate` | Make changes, snapshot, **revert before activating** if needed. The activation gate IS the rollback window. |
| **ZTW (Cloud Connector)** | Staged (ZIA-style activation gate, plus `forceActivate` escape hatch) | Until `activate` (or `forceActivate`) | Same as ZIA. `forceActivate` is last-resort and bypasses validation — see [`../cloud-connector/api.md § Activation`](./cloud-connector/api.md). |
| **ZPA** | **Propagate on write** (no activation gate; changes are live immediately) | None — change is live as soon as the API returns 200 | **Snapshot-before-change**, manual revert. Atomic operations only safe at the per-resource level. |
| **ZCC** | Propagate on write (web policy / forwarding profile changes apply on next ZCC agent check-in, but the API write is immediate) | None for the API; agent re-pulls on next check-in (Forwarding Profile / Trusted Network changes) or logout/restart (App Profile / Web Policy changes) | Snapshot-before-change. Plan for grace window before agents notice. |
| **ZBI** | Propagate on write | None | Snapshot-before-change. |
| **ZIdentity** | Propagate on write | None | Snapshot-before-change. RBAC changes are particularly sensitive. |
| **ZWA** | Propagate on write (workflow runs on next DLP incident) | None for config; in-flight incidents continue with their original workflow | Snapshot-before-change for config. |
| **Deception / Risk360 / AI Security / ZMS** | Portal-only — no programmatic rollback | N/A | Manual revert via portal. |

### Pattern: ZIA staged-and-revert (the activation-gate workflow)

ZIA's activation gate is a **rollback window built into the platform**. Use it deliberately.

```python
# 1. Snapshot before the change so you have a known-good baseline
import json, subprocess
subprocess.run(["./scripts/snapshot-refresh.py", "--zia-only"], check=True)

# 2. Confirm activation status is clean before starting
status, _, err = client.zia.activation.get_status()
if err: raise RuntimeError(f"get_status: {err}")
if status.status != "ACTIVE":
    raise RuntimeError(f"Cannot start change — activation status is {status.status}")

# 3. Make the change (any number of writes — they all stage)
rule_dict = current_rule.as_dict()
rule_dict["action"] = "BLOCK"
_, _, err = client.zia.url_filtering_rules.update_rule(rule_id=42, **rule_dict)
if err: raise RuntimeError(f"update_rule: {err}")

# 4. Sanity-check before activating (e.g., re-read and verify, run policy_simulator
#    against representative URLs, etc.)
verified, _, err = client.zia.url_filtering_rules.get_rule(rule_id=42)
if verified.action != "BLOCK":
    # Revert: re-write with the original
    _, _, err = client.zia.url_filtering_rules.update_rule(rule_id=42, **original_rule.as_dict())
    raise RuntimeError("Sanity check failed; reverted before activation")

# 5. Activate (or NOT — if you abort here, the staged changes are still pending
#    and will activate on the NEXT person's apply. Be explicit.)
_, _, err = client.zia.activation.activate()
if err: raise RuntimeError(f"activate: {err}")
```

**Important** — staging is not isolation. **Anyone with admin access can activate your pending changes**, including a different automation script or a human admin. If you want to abort cleanly, you must revert the staged changes (re-PUT the original values) before walking away. There's no "drop my pending changes without activating" API.

### Pattern: snapshot-before-change for propagate-on-write products

For ZPA / ZCC / ZBI / ZIdentity, the only rollback path is to capture state before the change and re-write it after if you need to revert.

```python
# 1. Snapshot the specific resource(s) you're touching
original = client.zpa.application_segment.get_segment(segment_id=42)
backup = original.as_dict()  # in-memory snapshot

# Optionally persist for audit:
import json, datetime
backup_path = f"/tmp/zpa-segment-42-{datetime.datetime.utcnow().isoformat()}.json"
with open(backup_path, "w") as f:
    json.dump(backup, f, indent=2)

# 2. Apply the change
update = {**backup, "enabled": False}
update.pop("clientless_app_ids", None)  # required for standard segments — see app-segments.md
updated, _, err = client.zpa.application_segment.update_segment(segment_id=42, **update)
if err:
    # Write itself failed; original state intact
    raise RuntimeError(f"update_segment: {err}")

# 3. Verify (optional — write succeeded but did it apply correctly?)
verified, _, err = client.zpa.application_segment.get_segment(segment_id=42)
if verified.enabled is not False:
    # Revert by re-PUTting the backup
    _, _, err = client.zpa.application_segment.update_segment(segment_id=42, **backup)
    raise RuntimeError("Change didn't apply as expected; reverted to backup")
```

This is **best-effort**, not transactional — between step 2 and 3, the change is live and traffic is affected. Plan for a maintenance window if the change is risky.

### What's NOT reversible

Some changes can't be rolled back even with the patterns above:

- **Deleted resources** can't be restored without recreation. The snapshot has the data but recreating yields a NEW resource ID. Anything that referenced the old ID (rules, segment groups, server groups, dependencies) needs manual re-wiring.
- **LSS log data once streamed** is gone — the receiving SIEM has it; Zscaler doesn't retain a duplicate.
- **Provisioning keys at max-utilization** can't be reused. Generate a new key.
- **App Connector enrollment certificates** expire on a schedule (yearly per docs). Pre-emptive rotation matters; a missed rotation requires re-enrollment.
- **Activation that succeeded** — once committed, ZIA changes can't be "un-activated." You can apply a counter-change (e.g., rule revert) and re-activate, but the original change's effect during the window between activations is permanent.
- **DLP-blocked content** — once blocked, the content didn't reach the destination. Reverting the rule doesn't deliver back-dated traffic.

### Operational guidance

- **Always snapshot before risky changes.** `./scripts/snapshot-refresh.py` is cheap; running it pre-change costs ~30 seconds and gives you a known-good baseline.
- **Use ZIA's activation gate deliberately.** Stage all related changes together, then activate as one atomic step. Don't activate one change at a time when they're related.
- **Coordinate concurrent admins.** ZIA's edit lock + activation gate mean concurrent automation can step on each other — see `EDIT_LOCK_NOT_AVAILABLE` in [§ Troubleshooting flows § TS-4](#ts-4-activation-is-stuck-or-returning-409).
- **Test on a non-production tenant first if available.** A dev / sandbox tenant lets you exercise the activation gate without production-impact risk.
- **For ZPA, plan the maintenance window.** Propagate-on-write means risky changes affect users immediately. Schedule them.

For the simulator-based pattern of "validate the change before applying," see [`./_policy-simulation.md § Change validation`](./_policy-simulation.md).

## Cross-links

- Authentication mechanisms (full reference, not runbook): [`./shared/oneapi.md § Authentication mechanisms`](./shared/oneapi.md)
- Read/write asymmetries (referenced from TS-6): [`./zia/api.md § Read/write shape asymmetries`](./zia/api.md), [`./zpa/api.md § Read/write shape asymmetries`](./zpa/api.md)
- Activation gate: [`./shared/activation.md`](./shared/activation.md)
- Verification protocol (when adding new runbooks here): [`./_verification-protocol.md`](./_verification-protocol.md)
- Tier model (where this doc fits — meta level alongside the protocol): [`./_layering-model.md`](./_layering-model.md)
