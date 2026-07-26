---
product: ztw
topic: "upgrade-and-credential-rotation"
title: "Cloud Connector upgrades + zsroot credential rotation — operational cadence"
content-type: reasoning
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/cbc-managing-cloud-branch-connector-upgrades.md"
  - "vendor/zscaler-help/cbc-rotating-zscaler-service-account-passwords.md"
  - "vendor/zscaler-help/cbc-about-cloud-connector-groups.md"
  - "vendor/zscaler-help/cbc-understanding-azure-vmss-deployments.md"
  - "vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-amazon-web-services-auto-scaling-groups.md"
  - "vendor/zscaler-sdk-python/zscaler/ztw/ec_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/models/ec_group_vm.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/admin_users.py"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/decorator.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py"
  - "vendor/zscaler-mcp-server/docs/guides/toolsets.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# Cloud Connector upgrades + zsroot credential rotation — operational cadence

Operational runbook context for operators managing Cloud Connector (CC) and Branch Connector (BC) fleets. Covers two maintenance concerns that interact — upgrade windows and zsroot password rotation — and the sequencing guidance when both are planned together.

> **Fork agents:** if the tenant's CC groups are configured with non-default upgrade windows, check the Admin Console (path below) before advising on timing. This doc reflects Zscaler defaults.

---

## 1. Upgrade cadence

### Trigger and window

- CCs check for a new software version **once per week**.
- Default window: **Sunday at midnight, local time of the deployed CC**. "Local time" means the timezone of the cloud region where the VM runs — not the operator's timezone, not UTC unless the region happens to be UTC.
- All connectors in a CC Group are upgraded within a **2-hour window**. Upgrades within the group are **staggered** — not simultaneous — to preserve HA and avoid a full-group outage.

**On-call implication:** an alert firing at 00:15 Sunday night in a region may be upgrade noise. Know your groups' configured timezones before escalating.

### What gets upgraded

| Component | How it upgrades |
|---|---|
| Zscaler software package | Automatic, weekly, in-place — no re-provisioning required |
| OS image | **Not** in-place. Requires creating a new deployment with the updated image. For Cloud Connector (public cloud VMs), Zscaler posts updated images to the cloud marketplace; the operator must re-deploy. For Branch Connector VMs, updated images are available via Admin Console download. |

An OS-level CVE requires a re-deploy cycle, not just waiting for the next Sunday window.

**Scale-set / auto-scaling deployments are a special case.** Azure VMSS and AWS ASG (and GCP MIG) deployments do not patch members in place — they add and remove VMs from the set as load changes, and replace unhealthy or terminated members from the configured launch template / image (`cbc-understanding-azure-vmss-deployments.md:14`, `:16`; `cbc-understanding-cloud-connector-deployments-amazon-web-services-auto-scaling-groups.md:17`, `:19`). Because a replacement VM is launched from the current image, a scale-out (or a health-driven replacement) yields a current-software instance — effectively a de-facto OS upgrade for the members that turn over. Note the same captures warn that manually stopping or rebooting a scale-set/ASG member from the cloud portal can itself trigger termination (`cbc-understanding-azure-vmss-deployments.md:18`; `cbc-understanding-cloud-connector-deployments-amazon-web-services-auto-scaling-groups.md:21`).

### Behavior during the window

- Active connections are served by the remaining CCs while one CC restarts.
- Upgrades within a group are **staggered to prevent service impact** — the source states the stagger but does not quantify how many members are down at once or name a minimum healthy-member precondition (`cbc-managing-cloud-branch-connector-upgrades.md:21`). See the redundancy gotcha below for why a 2-CC group is still exposed during the window.
- Failed upgrades retry at the next weekly window; they don't block the rest of the group.

Per-VM upgrade state is **read** from the ZTW EC-group API, not surfaced as a single Admin Console "status" field. `GET /ecgroup/{id}/vm/{vmId}` returns each VM's `buildVersion`, `lastUpgradeTime`, `upgradeStatus`, `upgradeStartTime`, `upgradeEndTime`, and `upgradeDayOfWeek` (`vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:111-116`; `vendor/zscaler-sdk-python/zscaler/ztw/models/ec_group_vm.py:48-53`). Note `upgradeStatus` is an integer enum in the model (`common.go:113` types it `int`), not a "Scheduled / Success / Failure" string label — alongside it the VM exposes `operationalStatus` (string) and `status` (string list) (`common.go:104-105`; `ec_group_vm.py:41-42`). See [API / SDK observability](#api-sdk-observability) below for how to read this programmatically.

> **Gotcha:** a group with exactly 2 CCs has no redundancy margin during the upgrade of the first CC. Zscaler's documented production minimum is 2 CCs per AZ across 2 AZs (4 total). A 2-CC group passes the weekly window with zero redundancy for the duration of one CC's restart.

### Configuring upgrade windows

CC Groups live at **Infrastructure > Connectors > Cloud > Management > Cloud Connector Groups** (`cbc-about-cloud-connector-groups.md:27`). To change the upgrade schedule, the upgrade source points to the per-device edit flows rather than naming a single field: "see Editing Cloud Connectors, Editing Virtual Branch Devices, and Editing Physical Branch Devices" (`cbc-managing-cloud-branch-connector-upgrades.md:21`). Branch Connector schedules are edited from the Virtual Branch Devices and Physical Branch Devices pages (same source).

The product surfaces the schedule at group scope. In the SDK the read field lives on the per-VM model: `upgradeDayOfWeek` is a field of `ECGroupVM` (Python) / `ECVMs` (Go) — the per-VM record returned by `GET /ecgroup/{id}/vm/{vmId}` (`vendor/zscaler-sdk-python/zscaler/ztw/models/ec_group_vm.py:53`; `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:116`). That same per-VM record also carries the VM's `id`, `name`, `natIp`, and `buildVersion` (Python `:39`, `:40`, `:45`, `:48`; Go `:102`, `:103`, `:108`, `:111`). Because the schedule is group-scoped in the product, all VMs in a group share the same day. Shift groups away from the Sunday midnight default to avoid overlap with tenant maintenance blackouts.

### API / SDK observability

The weekly upgrade window is **observable but not triggerable** through the ZTW EC-group API. Every method in the EC-group service is a read except one delete — there is no create, update, or upgrade-trigger:

| Operation | Endpoint | SDK method |
|---|---|---|
| List EC groups | `GET /ecgroup` | `list_ec_groups` (`ec_groups.py:39`) |
| List EC groups (lite) | `GET /ecgroup/lite` | `list_ec_group_lite` (`ec_groups.py:149`) |
| List EC instances (lite) | `GET /ecInstance/lite` | `list_ec_instance_lite` (`ec_groups.py:207`) |
| Get one EC group | `GET /ecgroup/{id}` | `get_ec_group` (`ec_groups.py:97`) |
| Get one VM in a group | `GET /ecgroup/{id}/vm/{vmId}` | `get_ec_group_vm` (`ec_groups.py:263`) |
| Delete one VM in a group | `DELETE /ecgroup/{id}/vm/{vmId}` | `delete_ec_group_vm` (`ec_groups.py:304`) |

Endpoints confirmed in `vendor/zscaler-api-specs/oneapi-postman-collection.json` (`/ecgroup`, `/ecgroup/lite`, `/ecgroup/{id}`, `/ecgroup/{id}/vm/{vmId}`, and `/ecInstance/lite`); SDK methods in `vendor/zscaler-sdk-python/zscaler/ztw/ec_groups.py`. There is **no create, update, or upgrade-trigger method** in the EC-group service — which independently confirms that operators cannot initiate an individual CC's upgrade via API; they can only read its state and (destructively) delete the VM so the scale set or group re-provisions it.

To confirm or monitor the window programmatically, read `GET /ecgroup/{id}/vm/{vmId}` and inspect `buildVersion`, `lastUpgradeTime`, `upgradeStatus`, `upgradeStartTime`, `upgradeEndTime`, `upgradeDayOfWeek` (`vendor/zscaler-sdk-python/zscaler/ztw/models/ec_group_vm.py:48-53`; `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:111-116`).

**Where this surface lives matters operationally.** zscaler-mcp-server v0.13.4 discovers self-registering `@tool` declarations by walking the tools package rather than maintaining a central `services.py` catalog (`vendor/zscaler-mcp-server/src/zscaler_mcp/registry/decorator.py:1-7`, `:33-45`, `:65-85`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/discovery.py:1-6`, `:20-35`). Its complete generated ZTW inventory covers discovery settings, admins and roles, IP groups, network services and groups, and public-account/cloud information, but no EC-group operation (`vendor/zscaler-mcp-server/docs/guides/toolsets.md:99-103`). These EC-group endpoints therefore remain an SDK + REST API surface rather than an MCP tool surface.

### Branch Connector differences

- Virtual BC (software VM): same weekly check, same window model, same stagger behavior.
- Physical BC (hardware appliance): same window model, but OS upgrades are delivered differently — firmware/image updates come via Admin Console download, not cloud marketplace re-deploy. The physical device can't simply be re-provisioned the way a cloud VM can.

---

## 2. zsroot credential rotation

### What zsroot is

Every CC and BC virtual device has a **privileged local service account** named `zsroot`. It is used for administrative SSH access and internal device management. It is **not** the account used for control-plane registration or cloud-provider API calls — it is a local OS-level account.

### Access path

- **Cloud Connector (public cloud VM):** Login is normally via the **SSH key** provided by the cloud provider at VM creation. The zsroot *password* is not required for SSH login in this model. However, the password exists and should be rotated as a security baseline.
- **Branch Connector (virtual):** Login is via console/management interface. SSH to the internal management address (`169.254.2.2`) as `zsroot`.

### Rotation procedure

**Cloud Connector:**
```
ssh <cc-host>   # using cloud-provider SSH key
passwd zsroot   # follow prompts: current password → new password
```

**Branch Connector (virtual):**
```
# Via console/management interface as zsroot:
ssh zsroot@169.254.2.2
passwd zsroot
```

Rotation of **`zsroot`** is **per-device** — there is no tenant-wide or group-wide `zsroot` rotation API. Each CC/BC VM must be rotated individually via SSH `passwd zsroot`.

> **Two different credentials, two different mechanisms.** The "no rotation API" statement above is scoped to `zsroot` — the privileged OS account on each device. The ZTW *admin-console* admin user is a separate credential class that **does** have an API rotation path: `POST /passwordChange`, exposed by the SDK as `ztw.admin.change_password(username, old_password, new_password)` (`vendor/zscaler-sdk-python/zscaler/ztw/admin_users.py:37`). Don't read "no rotation API" as "no Zscaler credential is API-rotatable" — it applies only to the device OS account, not the console admin user.

### Cadence

Zscaler mandates no specific interval — "periodically" is the documented guidance. Align to the tenant's compliance framework; 90-day cycles are common for privileged accounts.

### Failure modes

The captured source is thin on failure modes. Structural inferences (Tier D — not explicitly documented):

- **Mid-rotation connectivity loss:** If a CC loses connectivity to the control plane mid-session, the `passwd` command itself is local — it will complete if the SSH session holds. The risk is losing the SSH session before the password change commits, leaving the account in an indeterminate state. Work from a stable bastion, not a VPN with session-flap risk.
- **Password lockout:** Entering the wrong current password in `passwd` prompts does not lock the account immediately, but repeated failed attempts may. If the current password is unknown (e.g., after a re-deploy where default wasn't changed), recovery requires cloud-provider console access (Azure Serial Console, AWS EC2 Instance Connect, etc.).
- **SSH-key-only access:** For Cloud Connector VMs where SSH key is the only login path, the zsroot password is effectively dormant for normal operations. Still rotate it — it is the fallback if key access is lost, and it is a security audit surface.

### Branch Connector vs Cloud Connector

| Aspect | Cloud Connector | Branch Connector (virtual) |
|---|---|---|
| Normal login method | Cloud-provider SSH key | Console / management interface |
| Password required for SSH? | No (key-based) | Yes |
| Rotation access path | SSH → `passwd zsroot` | Console SSH to `169.254.2.2` → `passwd zsroot` |
| OS image re-deploy resets password? | Yes — re-provisioning creates a new VM; password state does not persist unless baked into the image | No — persistent device, password persists across software upgrades |

**Practical implication for Cloud Connector:** if the tenant re-deploys CCs to pick up an OS image upgrade (see §1), the zsroot password is reset with the new VM. Rotation records should note the re-deploy date; the rotation clock restarts.

---

## 3. Combined operational guidance

### Sequencing: upgrade then rotate, or rotate then upgrade?

**Recommended sequence: rotate first, then let the upgrade window proceed.**

Rationale:
1. Rotation is a local, per-VM operation that does not require a restart. It is low-blast-radius.
2. An OS image upgrade (re-deploy) resets the VM — any rotation performed before the re-deploy is wiped. Rotate *after* re-deploys, not before.
3. For in-place package upgrades (the weekly automatic cycle), rotation order doesn't matter operationally — but doing it before the window closes the "stale credential during upgrade" window.

**For OS image re-deploys specifically:**
1. Plan the re-deploy (new CC VMs up, traffic migrated, old VMs terminated).
2. Rotate zsroot on new VMs post-provisioning before the group goes into production.

### Tenant-wide vs per-group changes

- **Upgrade windows** are group-scoped. A tenant with multiple CC Groups across regions will have each group firing at its own local midnight. There is no single tenant-wide upgrade toggle.
- **zsroot rotation** is per-device. A tenant-wide rotation sweep requires scripted SSH iteration across all CCs — there is no Admin Console bulk-rotate.
- For large fleets, stagger rotation across groups to avoid simultaneous SSH load on a shared bastion.

### Change management

- Upgrade windows are Zscaler-triggered; operators configure the schedule but don't initiate individual upgrades. Brief weekend on-call on per-group window times.
- zsroot rotation is operator-initiated — track it as a change record (CC hostname, date, operator). zsroot qualifies for privileged-credential audit scope; include it in the credential inventory.

---

## 4. Open questions

The following are not confirmed by current captures or SDK/API source. Each is held here rather than asserted in the body:

- **Whether the 2-hour CC window and any ZPA App Connector window interact** — ZPA App Connector uses a 4-hour window (per `understanding-connector-software-updates.md`, which covers ZPA, not ZTW). Do not conflate them.
- **Behavior if a CC is mid-upgrade when zsroot rotation is attempted** — likely fine (rotation is local), but not explicitly confirmed.
- **Whether the weekly upgrade check still runs on long-lived scale-set / ASG members.** The replacement-from-launch-template behavior is now a cited fact (see §1 "What gets upgraded") — a scale-out yields current-software instances. What remains uncaptured is whether a member VM that stays up for many weeks *also* receives the in-place weekly package upgrade like a static instance, or only ever refreshes its software when it is replaced. The captures describe scale-set lifecycle (add/remove/replace) but do not state the upgrade path for a persistent member.
- **Specific failure-recovery procedure** if a CC fails its upgrade (the docs say retry next week; whether manual intervention is possible before that is not captured).
- **Default zsroot password** for freshly-provisioned CCs — not documented in captures. Cloud Connector VMs on Azure/AWS may use a cloud-provider-generated credential or a Zscaler-set default. Verify at first-deploy.

---

## Cross-links

- Architecture and HA model: [`./overview.md`](./overview.md)
- Azure deployment specifics (VMSS, upgrade window reference in HA table): [`./azure-deployment.md`](./azure-deployment.md)
- AWS deployment: [`./aws-deployment.md`](./aws-deployment.md) (in flight)
- Traffic forwarding and failover behavior: [`./forwarding.md`](./forwarding.md)
