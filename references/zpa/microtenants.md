---
product: zpa
topic: "microtenants"
title: "ZPA Microtenants — multi-org isolation within a single tenant"
content-type: reasoning
last-verified: "2026-04-26"
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

A Microtenant is a **logical isolation boundary** inside a single ZPA tenant. It is not a separate ZPA account or a separate tenant ID — it is a delegated administrative scope within one parent tenant. Multiple subsidiaries, business units, or operating companies can each get their own Microtenant, their own admin accounts, their own policy namespace, and their own resource visibility, while sharing the parent tenant's IdP trust, App Connectors, billing, and Zscaler infrastructure.

This is distinct from full multi-tenancy: Microtenants share a `customerId` and API base URL. There is no per-Microtenant ZPA portal login URL — Microtenant admins authenticate to the same console but are scoped to their Microtenant's resources.

Microtenants require enablement by Zscaler Support before they appear in the Admin Console.

## Why use Microtenants

- **RBAC scoping** — Microtenant admins see and manage only their own resources. They cannot view or edit resources belonging to the default tenant or other Microtenants.
- **Independent policy management** — each Microtenant has its own App Segments, Segment Groups, Server Groups, and access policies. A Microtenant admin can configure applications and access rules without affecting other org units.
- **Dashboard and log isolation** — dashboards and access logs are scoped to the Microtenant's end users and resources.
- **Shared infrastructure** — App Connectors, App Connector Groups, billing, and IdP configuration remain at the default tenant level. Microtenants don't need to provision their own connector infrastructure unless explicitly scoped.
- **Authentication domain mapping** — end users are mapped to a Microtenant by their authentication domain. Private Access evaluates Microtenant authentication domain assignments top-to-bottom in list order; the first match wins.

## Mechanics

### Microtenant ID propagation

Every resource that belongs to a Microtenant carries `microtenantId` / `microtenantName` on its API model. Confirmed from SDK models (Tier A):

| Resource | `microtenantId` | `microtenantName` | Notes |
|---|---|---|---|
| App Segment (`ApplicationSegments`) | yes | yes | `models/application_segment.py:69` |
| Segment Group (`SegmentGroup`) | yes | yes | `models/segment_group.py:38–39` |
| Server Group (`ServerGroup`) | yes | yes | `models/server_group.py:44–45` |
| App Connector Group (`AppConnectorGroup`) | yes | yes | `models/app_connector_groups.py:64–65` |
| Service Edge Group | yes | yes | `models/service_edge_groups.py` |
| PRA Apps sub-model | yes | yes | `models/application_segment.py:475–476` |
| Inspection Apps sub-model | yes | yes | `models/application_segment.py:416–417` |

When reading snapshot JSON, `microtenantId` being absent or `null` means the resource belongs to the default tenant. A non-null `microtenantId` scopes the resource to that Microtenant's admin domain.

### Governance flags co-present with microtenantId

App Segments, Server Groups, and Connector Groups also carry:
- `readOnly` — resource is view-only to the requesting admin (may be a cross-Microtenant shared resource).
- `restrictionType` — further microtenant-scope restriction indicator.
- `zscalerManaged` — Zscaler owns this resource; edit/delete unavailable.

These are write-protection signals, not Microtenant membership signals. An object with `microtenantId` set can still be `readOnly` if it was shared into the current Microtenant from another.

### Cross-Microtenant sharing and move

App Segments can be shared across Microtenant boundaries or moved to a different Microtenant. The SDK model `SharedMicrotenantDetails` (on `ApplicationSegments`) tracks this:

- `sharedFromMicrotenant` — `{id, name}` of the source Microtenant that shared this segment in.
- `sharedToMicrotenants` — list of Microtenants this segment has been shared out to.

A shared-in segment appears in the receiving Microtenant as `readOnly`. The Go SDK exposes explicit operations (`AppSegmentMicrotenantMove` / `AppSegmentMicrotenantShare`); the Python SDK has no equivalent — move/share requires the Go SDK or direct HTTP.

## Configuration

### Creating a Microtenant

Admin Console path: **Administration > Admin Management > Role Based Access Control > Private App Microtenants > Add**.

Required fields:
- **Name** — alphanumeric, periods, hyphens, underscores only; no other special characters.
- **Authentication Domain** — one or more authentication domains whose end users map to this Microtenant. Mapping order across Microtenants is list-position-dependent (top wins).
- **Status** — disabled by default. Must be explicitly enabled.

Optional:
- **Privileged Approvals** — disabled by default. Enables approval-based access for users without an Authentication Domain. Required to use Privileged Remote Access (PRA) workflows within the Microtenant.

SDK equivalent (`add_microtenant`):

```python
microtenant, _, err = client.zpa.microtenants.add_microtenant(
    name="Subsidiary-1",
    criteria_attribute="AuthDomain",
    criteria_attribute_values=["subsidiary1.example.com"],
    enabled=True,
)
```

The `Microtenant` model fields: `id`, `name`, `description`, `enabled`, `criteria_attribute`, `criteria_attribute_values`, `privileged_approvals_enabled`, `operator` (SDK field — appears in API responses).

### Admin password shown once

After saving, the console displays an **Admin ID and Password**. This is the initial credential for the Microtenant's admin account.

> The Admin ID and Password are only available when adding a Microtenant. It is not available to access in the Zscaler Admin Console after you close the window, so store it in a secure location. — *configuring-microtenants.md*, step 5

**This is a one-way operation.** There is no "show password again" or reset flow via the console creation dialog. Store it in a secrets manager at creation time. If lost before storing, the Microtenant admin account credential must be reset through a separate admin password reset flow.

### Disabling a Microtenant

Setting `enabled = False` on a Microtenant has immediate effects (source: *configuring-microtenants.md* and *about-microtenants.md*):

- **Active sessions for the Microtenant are terminated.**
- **Users mapped to the Microtenant reauthenticate** — specifically, users on Private Service Edges reauthenticate when the Microtenant is disabled.
- **Mapped users are reassigned to the Default Microtenant** — they lose access to Microtenant-scoped resources and gain access only to default-tenant resources until the Microtenant is re-enabled.

Plan disable operations for maintenance windows. Disabling a Microtenant is not a safe "pause" — it terminates sessions.

### Deleting a Microtenant

SDK: `delete_microtenant(microtenant_id)`. The help docs do not specify what happens to scoped resources (App Segments, Server Groups, etc.) on deletion — treat this as unconfirmed behavior (Tier D). Operationally: move or reassign resources before deleting a Microtenant to avoid orphaned objects.

## Emergency Access interaction

The **Emergency Access** and **Emergency Access Users** pages are hidden for Microtenants with **Privileged Approvals disabled** (source: *about-microtenants.md*, Privileged Approvals field description). This is not a permissions gap — the pages are simply not surfaced in the UI when Privileged Approvals is off. To expose Emergency Access within a Microtenant, enable Privileged Approvals and configure a privileged approval for that Microtenant.

## Gotchas

**1. Admin password shown once.** Detailed above. One chance to copy it; no recovery via the creation UI. Store immediately in a secrets manager.

**2. Disable terminates sessions.** Not a soft pause. Users reauthenticate and are remapped to the default tenant until the Microtenant is re-enabled. Coordinate with affected users before disabling.

**3. Authentication domain order determines user mapping.** If a user's domain matches multiple Microtenants, the first Microtenant in the list claims them. Misconfigured ordering silently routes users to the wrong Microtenant — they'll see the wrong resource set. Verify list order when adding a new Microtenant with an overlapping authentication domain.

**4. Shared-in segments are read-only.** A segment shared from another Microtenant appears in the receiving Microtenant but cannot be modified there. Edits must happen in the owning Microtenant. Callers scripting against shared segments must check `readOnly` before attempting updates.

**5. Move/Share requires Go SDK or direct HTTP.** The Python SDK has no `AppSegmentMicrotenantMove` or `AppSegmentMicrotenantShare` methods. Attempting to move a segment across Microtenants via Python SDK requires constructing the HTTP request directly (`POST .../application/{id}/move`).

**6. Privileged Approvals is per-Microtenant, not global.** The flag is on the Microtenant object itself (`privileged_approvals_enabled`). A Microtenant without Privileged Approvals enabled cannot support PRA workflows scoped to it, regardless of the PRA configuration on the App Segments.

**7. Default Microtenant resources are visible to Microtenant end users.** End users in a Microtenant can access applications from both the default tenant and their own Microtenant. Cross-Microtenant access (between two non-default Microtenants) is blocked by default unless the segment is explicitly shared.

## Cross-links

- App Segments (`microtenantId`, `readOnly`, `sharedMicrotenantDetails`, move/share operations) — [`./app-segments.md`](./app-segments.md)
- Segment Groups and Server Groups (`microtenantId` on both models) — [`./segment-server-groups.md`](./segment-server-groups.md)
- Access policy rules that reference Segment Groups (policy isolation is per-Microtenant namespace) — [`./policy-precedence.md`](./policy-precedence.md)
- App Connectors and Connector Groups (shared at default-tenant level; carry `microtenantId` in model but typically managed from default) — [`./app-connector.md`](./app-connector.md)
- Portfolio gap reference (Microtenants as a coverage area) — [`../_portfolio-map.md`](../_portfolio-map.md)
