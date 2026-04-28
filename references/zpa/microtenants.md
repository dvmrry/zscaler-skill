---
product: zpa
topic: "microtenants"
title: "ZPA Microtenants — multi-org isolation within a single tenant"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-microtenants.md"
  - "vendor/zscaler-help/configuring-microtenants.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/microtenants.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/segment_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/server_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/app_connector_groups.py"
author-status: draft
---

# ZPA Microtenants — multi-org isolation within a single tenant

A Microtenant is a **logical isolation boundary** inside a single ZPA tenant. It is not a separate ZPA account or a separate `customerId` — it is a delegated administrative scope within one parent tenant. Multiple subsidiaries, business units, or operating companies can each get their own Microtenant with their own admin accounts, policy namespace, and resource visibility, while sharing the parent tenant's IdP trust, App Connectors, billing, and Zscaler infrastructure.

Microtenants require enablement by Zscaler Support before they appear in the Admin Console. (Tier A — vendor doc, `about-microtenants.md`.)

---

## 1. Architecture — parent/child relationship

### 1.1 Tenant structure

```
Default Tenant (parent)
├── Shared: App Connectors, App Connector Groups, billing, IdP config
├── Default Microtenant — resources visible to all end users
├── Microtenant A (Subsidiary-1)
│   ├── Own: App Segments, Segment Groups, Server Groups, access policies
│   ├── Own: Admin accounts (scoped)
│   └── Auth domain: subsidiary1.example.com
└── Microtenant B (Subsidiary-2)
    ├── Own: App Segments, Segment Groups, Server Groups, access policies
    ├── Own: Admin accounts (scoped)
    └── Auth domain: subsidiary2.example.com
```

**Key principle:** there is one `customerId` and one ZPA API base URL. Microtenant admins authenticate to the same console and same API — they are scoped to their Microtenant's resources by the `microtenantId` parameter on all requests.

### 1.2 What is isolated between Microtenants

Isolated (each Microtenant owns independently):

- Application Segments
- Segment Groups
- Server Groups
- Access Policy rules
- App Connector Group assignments (can be scoped per Microtenant)
- Dashboard and log views (scoped to Microtenant end users and resources)
- Admin accounts and their permissions

**Shared at the default tenant level** (not isolated):

- App Connectors and App Connector Groups (default-tenant-managed; Microtenants reference but don't own)
- IdP configuration and authentication domain trust
- Billing and subscription
- Zscaler infrastructure (Service Edges, CA network)

### 1.3 End-user resource visibility

End users in a Microtenant can access applications from **both the Default Microtenant and their own Microtenant**. Cross-Microtenant access (between two non-default Microtenants) is blocked by default unless the segment is explicitly shared. (Tier A — vendor doc, `about-microtenants.md`.)

---

## 2. Use cases

- **MSP multi-tenant:** a managed service provider manages multiple customers under one ZPA parent tenant, each in a separate Microtenant. Each customer's admin sees only their own resources.
- **Geographic isolation:** a global organization delegates admin to regional teams (EMEA, APAC, Americas), each with their own Microtenant.
- **Subsidiary isolation:** an organization with independent operating companies (legal entities, acquired companies) delegates ZPA admin to each without cross-visibility.
- **Department isolation:** within a single org, security-sensitive departments (Finance, Legal) get their own Microtenant so their app segment configuration is not visible to other department admins.

---

## 3. Admin scope and cross-tenant visibility rules

Microtenant admins have **delegated admin responsibility** — they manage configuration for their Microtenant's country, department, and operating company scope. (Tier A — vendor doc, `about-microtenants.md`.)

Rules:
- A Microtenant admin **cannot** view or edit resources belonging to the Default Tenant or other Microtenants.
- A Default Tenant admin **can** view and manage all Microtenant resources.
- A segment **shared into** a Microtenant from another Microtenant appears as `readOnly` in the receiving Microtenant — it cannot be edited there.

**Admin ID shown once:** after creating a Microtenant, the console displays an Admin ID and Password. This is the initial credential for the Microtenant's admin account. It is only available at creation time — it is not accessible from the admin console after the window is closed. Store it immediately in a secrets manager. (Tier A — vendor doc, `configuring-microtenants.md`.)

---

## 4. Authentication domain mapping

End users are mapped to a Microtenant by their **authentication domain** — the domain portion of their identity after successful ZPA authentication. The mapping is list-order-dependent: Private Access evaluates Microtenant authentication domain assignments top-to-bottom; the first match wins.

**Configuration risk:** if a user's domain matches multiple Microtenants, the first Microtenant in the list claims them. Misconfigured ordering silently routes users to the wrong Microtenant — they see the wrong resource set. Verify list order carefully when adding a new Microtenant with an overlapping authentication domain.

---

## 5. Limits

Zscaler documents ranges and limitations in a "Ranges & Limitations" article (linked from `configuring-microtenants.md`). Specific numeric limits (max Microtenants per tenant, resource quotas per Microtenant) are not captured in available vendor source. Consult Zscaler Support or the Ranges & Limitations article for current limits before designing a large Microtenant deployment.

---

## 6. API behavior in a Microtenant context

### 6.1 `microtenantId` query parameter

Every API operation scoped to a Microtenant passes `microtenantId` as a query parameter. In the Python SDK, `microtenant_id` is accepted as a keyword argument or within `query_params` on most methods; it is translated to the `microtenantId` query parameter before the HTTP request is sent. For POST/PUT operations it is sent as a query parameter, not in the request body.

SDK client construction example with microtenant scope:

```python
from zscaler import ZscalerClient

config = {
    "clientId": "...",
    "clientSecret": "...",
    "vanityDomain": "acme",
    "customerId": "...",
    "microtenantId": "...",   # scopes all calls to this Microtenant
}
with ZscalerClient(config) as client:
    segments, _, err = client.zpa.application_segment.list_segments()
```

When `microtenantId` is set in the client config, it is propagated automatically to all requests. It can also be overridden per-call by passing `microtenant_id` as a kwarg.

### 6.2 Resource-level `microtenantId` fields

Every resource that belongs to a Microtenant carries `microtenantId` and `microtenantName` on its API model. (Tier A — SDK models):

| Resource | `microtenantId` | `microtenantName` |
|---|---|---|
| App Segment (`ApplicationSegments`) | yes | yes |
| Segment Group (`SegmentGroup`) | yes | yes |
| Server Group (`ServerGroup`) | yes | yes |
| App Connector Group (`AppConnectorGroup`) | yes | yes |
| Service Edge Group | yes | yes |
| PRA Apps sub-model | yes | yes |
| Inspection Apps sub-model | yes | yes |

When reading API responses, `microtenantId` being absent or `null` means the resource belongs to the Default Tenant.

### 6.3 Governance flags co-present with `microtenantId`

App Segments, Server Groups, and Connector Groups also carry:

- `readOnly` — resource is view-only to the requesting admin. Set when a resource is shared into the current Microtenant from another.
- `restrictionType` — further Microtenant-scope restriction indicator.
- `zscalerManaged` — Zscaler owns this resource; edit/delete unavailable.

These are write-protection signals, not Microtenant membership signals.

### 6.4 Cross-Microtenant sharing and move

App Segments can be shared across Microtenant boundaries or moved to a different Microtenant. The SDK model `SharedMicrotenantDetails` (on `ApplicationSegments`) tracks this:

- `sharedFromMicrotenant` — `{id, name}` of the source Microtenant that shared this segment in.
- `sharedToMicrotenants` — list of Microtenants this segment has been shared out to.

A shared-in segment appears in the receiving Microtenant as `readOnly`. **The Go SDK exposes explicit operations** (`AppSegmentMicrotenantMove` / `AppSegmentMicrotenantShare`). The Python SDK has no equivalent — move/share requires Go SDK or direct HTTP (`POST .../application/{id}/move`).

---

## 7. SDK and Terraform surface

### 7.1 Python SDK — `MicrotenantsAPI`

| Property | `client.zpa.microtenants` |
|---|---|
| Class | `MicrotenantsAPI` |
| File | `zscaler/zpa/microtenants.py` |
| Go parity | `microtenants/` |

**Methods:**

| Method | Signature | Notes |
|---|---|---|
| `list_microtenants` | `(query_params=None)` | `include_roles` query param supported |
| `get_microtenant` | `(microtenant_id, query_params=None)` | |
| `add_microtenant` | `(**kwargs)` | Required: `name`, `criteria_attribute`, `criteria_attribute_values` |
| `update_microtenant` | `(microtenant_id, **kwargs)` | |
| `delete_microtenant` | `(microtenant_id)` | |
| `get_microtenant_summary` | `(query_params=None)` | Name/ID summary only |

**`add_microtenant` example:**

```python
microtenant, _, err = client.zpa.microtenants.add_microtenant(
    name="Subsidiary-1",
    criteria_attribute="AuthDomain",
    criteria_attribute_values=["subsidiary1.example.com"],
    enabled=True,
)
```

**`Microtenant` model fields:** `id`, `name`, `description`, `enabled`, `criteria_attribute`, `criteria_attribute_values`, `privileged_approvals_enabled`, `operator`.

### 7.2 Terraform

The Terraform provider exposes a `zpa_microtenant` resource. Fields mirror the SDK model. Microtenant-scoped resources use the `microtenant_id` argument to associate the resource with a specific Microtenant. Destroying a `zpa_microtenant` resource in Terraform will attempt to delete the Microtenant — move or reassign resources first.

---

## 8. Lifecycle operations and their effects

### 8.1 Disabling a Microtenant

Setting `enabled = false` has immediate effects (Tier A — vendor doc, `configuring-microtenants.md`):

- **Active sessions for the Microtenant are terminated.**
- **Users mapped to the Microtenant are reassigned to the Default Microtenant** — they lose access to Microtenant-scoped resources and gain access only to Default Tenant resources until the Microtenant is re-enabled.
- **Users on Private Service Edges reauthenticate.**

Disabling is not a safe "pause." Plan disable operations for maintenance windows. Coordinate with affected users.

### 8.2 Deleting a Microtenant

SDK: `delete_microtenant(microtenant_id)`. Behavior of scoped resources (App Segments, Server Groups, etc.) on deletion is not documented in available vendor source — treat as unconfirmed. **Operationally: move or reassign all resources before deleting a Microtenant** to avoid orphaned objects. The SDK does not enforce pre-deletion cleanup.

---

## 9. Emergency Access interaction

The Emergency Access and Emergency Access Users pages are **not visible** for Microtenants with Privileged Approvals disabled. (Tier A — vendor doc, `about-microtenants.md`.) This is not a permissions gap — the pages are not surfaced in the UI when Privileged Approvals is off. To expose Emergency Access within a Microtenant, enable Privileged Approvals and configure a privileged approval for that Microtenant.

Privileged Approvals is per-Microtenant, not global. A Microtenant without `privileged_approvals_enabled = true` cannot support PRA workflows scoped to it, regardless of PRA configuration on App Segments.

---

## 10. Gotchas

**1. Admin password shown once.** One chance to copy it at creation time; no recovery via the creation UI. Store immediately in a secrets manager.

**2. Disable terminates sessions.** Not a soft pause. Users reauthenticate and are remapped to the Default Tenant until the Microtenant is re-enabled.

**3. Authentication domain order determines user mapping.** Misconfigured ordering silently routes users to the wrong Microtenant — they see the wrong resource set.

**4. Shared-in segments are read-only.** Edits must happen in the owning Microtenant. Callers scripting against shared segments must check `readOnly` before attempting updates.

**5. Move/Share requires Go SDK or direct HTTP.** The Python SDK has no `AppSegmentMicrotenantMove` or `AppSegmentMicrotenantShare` methods. Use Go SDK or construct HTTP directly (`POST .../application/{id}/move`).

**6. Default Tenant resources are visible to Microtenant end users.** End users in a Microtenant can access applications from both the Default Microtenant and their own Microtenant. Cross-Microtenant access (between two non-default Microtenants) is blocked by default unless explicitly shared.

**7. `microtenantId` not in POST/PUT body — only as a query param.** This is the SDK behavior: for POST/PUT operations, `microtenantId` is sent as a query parameter, not in the request body. Direct HTTP callers must follow the same convention.

---

## Cross-links

- App Segments (`microtenantId`, `readOnly`, `sharedMicrotenantDetails`, move/share operations) — [`./app-segments.md`](./app-segments.md)
- Segment Groups and Server Groups (`microtenantId` on both models) — [`./segment-server-groups.md`](./segment-server-groups.md)
- Access policy rules (policy isolation is per-Microtenant namespace) — [`./policy-precedence.md`](./policy-precedence.md)
- App Connectors and Connector Groups (shared at default-tenant level) — [`./app-connector.md`](./app-connector.md)
- SDK MicrotenantsAPI method catalog — [`./sdk.md §2.21 MicrotenantsAPI`](./sdk.md)
