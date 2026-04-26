---
product: ztw
topic: "upgrade-and-credential-rotation"
title: "Cloud Connector upgrades + zsroot credential rotation — operational cadence"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-managing-cloud-branch-connector-upgrades.md"
  - "vendor/zscaler-help/cbc-rotating-zscaler-service-account-passwords.md"
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

### Behavior during the window

- Active connections are served by the remaining CCs while one CC restarts.
- Staggering means **at most one CC per group is down at a time** — provided ≥2 healthy members exist before the window opens.
- Failed upgrades retry at the next weekly window; they don't block the rest of the group.
- `Update Status` in Admin Console (Infrastructure → Connectors → Cloud) reflects per-CC state: Scheduled / Success / Failure.

> **Gotcha:** a group with exactly 2 CCs has no redundancy margin during the upgrade of the first CC. Zscaler's documented production minimum is 2 CCs per AZ across 2 AZs (4 total). A 2-CC group passes the weekly window with zero redundancy for the duration of one CC's restart.

### Configuring upgrade windows

Navigate: **Admin Console → Infrastructure → Connectors → Cloud → [select group] → Edit**. The upgrade schedule field accepts a day-of-week and time. Equivalent paths for Branch Connector: Virtual Branch Devices and Physical Branch Devices pages (per Zscaler docs).

The schedule is group-scoped — no per-CC override. Shift groups away from the Sunday midnight default to avoid overlap with tenant maintenance blackouts.

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

Rotation is **per-device** — there is no tenant-wide or group-wide rotation API documented. Each CC VM must be rotated individually.

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

## 4. Source-citation gaps

The captured sources (`cbc-managing-cloud-branch-connector-upgrades.md`, `cbc-rotating-zscaler-service-account-passwords.md`) are brief. The following are not confirmed by captures:

- **Whether the 2-hour CC window and any ZPA App Connector window interact** — ZPA App Connector uses a 4-hour window (per `understanding-connector-software-updates.md`, which covers ZPA, not ZTW). Do not conflate them.
- **Behavior if a CC is mid-upgrade when zsroot rotation is attempted** — likely fine (rotation is local), but not explicitly confirmed.
- **Whether VMSS-deployed CCs** (Azure Flex Orchestration) pick up upgrades the same way as static-instance CCs, or whether the VMSS instance replacement model bypasses the weekly check. Likely the latter — a new VMSS instance launched from a fresh image already has current software. Treat VMSS scale-out as a de-facto OS upgrade.
- **Specific failure-recovery procedure** if a CC fails its upgrade (the docs say retry next week; whether manual intervention is possible before that is not captured).
- **Default zsroot password** for freshly-provisioned CCs — not documented in captures. Cloud Connector VMs on Azure/AWS may use a cloud-provider-generated credential or a Zscaler-set default. Verify at first-deploy.

---

## Cross-links

- Architecture and HA model: [`./overview.md`](./overview.md)
- Azure deployment specifics (VMSS, upgrade window reference in HA table): [`./azure-deployment.md`](./azure-deployment.md)
- AWS deployment: [`./aws-deployment.md`](./aws-deployment.md) (in flight)
- Traffic forwarding and failover behavior: [`./forwarding.md`](./forwarding.md)
