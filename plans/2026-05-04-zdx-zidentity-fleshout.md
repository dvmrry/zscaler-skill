# ZDX + ZIdentity Flesh-out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flesh out the two T1 products with thinnest reference coverage (ZDX at 7 files, ZIdentity at 7 files) by adding 11 new citation-backed reference docs grounded in vendor SDK/help-portal/Postman sources.

**Architecture:** For each new ref, run the extract → write → verify pipeline (same as the 2026-05-03 aws-deployment.md citation pass). Three subagent dispatches per ref: Explore extractor (mines vendor sources, produces structured extraction report), z-writer (applies extraction report to a new ref file), Explore verifier (audits writer output against extraction report). One commit per ref.

**Tech Stack:** Subagent dispatches (Agent tool, general-purpose subagent type for extractor/verifier; z-writer subagent for applying extractions); Markdown editing (Edit/Write tools); Bash for git operations and hygiene scripts; existing vendor sources under `vendor/zscaler-sdk-{python,go}/`, `vendor/zscaler-help/`, and Postman collections.

**Source spec:** `plans/2026-05-04-floating-todos.md` § 3.3 (ZDX) + this conversation (ZIdentity, equivalent gap surfaced after the structured review).

**Working directory:** `/Users/dm/src/gh/dvmrry/zscaler-skill/.worktrees/zdx-zidentity-fleshout/` on branch `zdx-zidentity-fleshout`.

---

## File structure — what gets created

| Task | New ref | Source candidates |
|---|---|---|
| 1 | `references/zdx/score.md` | `vendor/zscaler-help/about-zdx-score.md` + SDK `apps.py` (score retrieval methods) + ZDX overview existing |
| 2 | `references/zdx/cloud-architecture.md` | `vendor/zscaler-help/understanding-zdx-cloud-architecture.md` + ZDX overview |
| 3 | `references/zdx/applications.md` | SDK `apps.py` + Go `services/inventory/` + Postman ZDX collection |
| 4 | `references/zdx/devices.md` | SDK `devices.py` + Go `services/inventory/` + Postman ZDX |
| 5 | `references/zdx/reports.md` | SDK `services/reports/` (Go) + Postman ZDX reports endpoints |
| 6 | `references/zdx/administration.md` | SDK `admin.py` + Go `services/administration/` + Postman ZDX admin endpoints |
| 7 | `references/zidentity/admin-rbac.md` | `vendor/zscaler-help/admin-rbac-captures.md` + SDK admin role surface if exists |
| 8 | `references/zidentity/users.md` | SDK `users.py` + Go `services/users/` + Postman ZIdentity |
| 9 | `references/zidentity/groups.md` | SDK `groups.py` + Go `services/groups/` + Postman ZIdentity |
| 10 | `references/zidentity/resource-servers.md` | SDK `resource_servers.py` + Go `services/resource_servers/` + Postman |
| 11 | `references/zidentity/user-entitlements.md` | SDK `user_entitlement.py` + Go `services/user_entitlement/` + Postman |

---

## Per-task pattern (applies to all 11)

Each task follows the same three-subagent pipeline + commit. Bite-sized steps:

- [ ] **Step 1: Dispatch Explore extractor** with prompt: target ref path + source candidates list + "produce structured extraction report (variables, fields, endpoints, behaviors with file:line citations); flag SDK divergences and contradictions vs existing target ref if it exists"
- [ ] **Step 2: Receive extraction report** — surface to chat; if extractor flagged contradictions or gaps, decide whether to escalate to user before proceeding
- [ ] **Step 3: Dispatch z-writer** with prompt containing ONLY the extraction report (verbatim) + target file path + empty Open Items routing list (skill discipline — no conversation context contamination)
- [ ] **Step 4: Receive writer summary** — confirm new file created, structured citations applied
- [ ] **Step 5: Dispatch Explore verifier** with prompt: modified file path + extraction report + spot-check 3 cited file:line refs against actual source
- [ ] **Step 6: Surface verifier punch list** — if 🔴 wrong-citation findings, fix before commit; if 🟡/⚠️/🟢 only, proceed
- [ ] **Step 7: Run hygiene** — `./scripts/check-hygiene.py`, `./scripts/check-citations.sh`, expected zero new errors
- [ ] **Step 8: Commit** with message naming the new ref + extracted source + commit pattern: `<product>: add <topic>.md ref grounded in <primary source>`

---

### Task 1: ZDX Score reference

**Files:**
- Create: `references/zdx/score.md`
- Read: `vendor/zscaler-help/about-zdx-score.md`, `vendor/zscaler-sdk-python/zscaler/zdx/apps.py`, existing `references/zdx/overview.md` (for context, not duplication)

Apply per-task pattern. Target ref topic: how the ZDX Score is computed, score components (Performance / Network Path / Performance + Network Path / etc.), score interpretation (good/fair/poor thresholds), score-related API endpoints.

Frontmatter target: `confidence: high` (Tier-A vendor source for the score model), `source-tier: doc`, `last-verified: 2026-05-04`.

### Task 2: ZDX cloud architecture reference

**Files:**
- Create: `references/zdx/cloud-architecture.md`
- Read: `vendor/zscaler-help/understanding-zdx-cloud-architecture.md`, existing `references/zdx/overview.md`

Apply per-task pattern. Topic: ZDX-side architecture — Service Edges that participate in probes, data flow from ZCC to ZDX cloud, dashboard pipeline, telemetry architecture.

Frontmatter: `confidence: high`, `source-tier: doc`, `last-verified: 2026-05-04`.

### Task 3: ZDX applications reference

**Files:**
- Create: `references/zdx/applications.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zdx/apps.py`, Go `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/`, Postman ZDX collection (find via `find vendor/zscaler-api-specs -iname "*zdx*"`)

Apply per-task pattern. Topic: configuring monitored applications, application classes (web / SaaS / private), pre-defined vs custom apps, app-level metrics.

Frontmatter: `confidence: high`, `source-tier: code` (SDK is primary), `last-verified: 2026-05-04`.

### Task 4: ZDX devices reference

**Files:**
- Create: `references/zdx/devices.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zdx/devices.py`, Go `vendor/zscaler-sdk-go/zscaler/zdx/services/inventory/`, Postman ZDX

Apply per-task pattern. Topic: per-device monitoring config, device inventory API, device geolocation, device-level events.

### Task 5: ZDX reports reference

**Files:**
- Create: `references/zdx/reports.md`
- Read: Go SDK `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/`, Postman ZDX reports endpoints

Apply per-task pattern. Topic: reports API surface — what reports can be generated, scheduling, output formats.

### Task 6: ZDX administration reference

**Files:**
- Create: `references/zdx/administration.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zdx/admin.py`, Go `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/`, Postman ZDX admin endpoints

Apply per-task pattern. Topic: administrative APIs (probably user/probe configuration, admin user management).

### Task 7: ZIdentity admin RBAC reference

**Files:**
- Create: `references/zidentity/admin-rbac.md`
- Read: `vendor/zscaler-help/admin-rbac-captures.md`, any admin-related SDK surface

Apply per-task pattern. Topic: admin role model, role-to-permission mapping, RBAC scoping, role assignment API.

Frontmatter: `confidence: high`, `source-tier: doc`, `last-verified: 2026-05-04`.

### Task 8: ZIdentity users reference

**Files:**
- Create: `references/zidentity/users.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zid/users.py`, Go `vendor/zscaler-sdk-go/zscaler/zid/services/users/`, Postman ZIdentity users endpoints

Apply per-task pattern. Topic: user management API, user lifecycle, user attributes, search/filter operations.

### Task 9: ZIdentity groups reference

**Files:**
- Create: `references/zidentity/groups.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zid/groups.py`, Go `vendor/zscaler-sdk-go/zscaler/zid/services/groups/`, Postman ZIdentity groups endpoints

Apply per-task pattern. Topic: group management, group-membership semantics, group-based policy keys (since ZIA/ZPA policies key off ZIdentity groups).

### Task 10: ZIdentity resource servers reference

**Files:**
- Create: `references/zidentity/resource-servers.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`, Go `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/`, Postman

Apply per-task pattern. Topic: resource server registration, OAuth scope definitions, how OneAPI clients map to scopes.

### Task 11: ZIdentity user entitlements reference

**Files:**
- Create: `references/zidentity/user-entitlements.md`
- Read: SDK `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py`, Go `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/`, Postman

Apply per-task pattern. Topic: per-user entitlement model, entitlement-to-product mapping (which Zscaler products a user is entitled to access).

---

## After all 11 tasks: Final pass

- [ ] **Update `references/zdx/index.md`** to enumerate the 6 new ZDX refs in the topic listing
- [ ] **Update `references/zidentity/index.md`** to enumerate the 5 new ZIdentity refs
- [ ] **Run full hygiene sweep** — `check-hygiene.py`, `check-citations.sh`, `check-doc-links.py`, `check-orphans.py`, `check-vendor-drift.py`, `check-scrape-freshness.py`. Expected: 0 errors. Eval-coverage warning count may increase by ~11 (new high-confidence refs without eval coverage — out of scope for this plan).
- [ ] **Verify product coverage counts** — ZDX should now have 13 refs, ZIdentity should have 12 refs.
- [ ] **Update IMPROVEMENTS.md** to note ZDX/ZIdentity flesh-out done and link to commits.
- [ ] **Final commit if any cleanup edits surface.**
- [ ] **Merge prep** — branch is ready for `git merge --ff-only` back to main.

## Self-review (apply before declaring plan done)

- [ ] All 11 task entries reference concrete vendor sources (not vague "look around")
- [ ] Each task target file path is unambiguous
- [ ] Per-task pattern is consistent (same 8-step pipeline for each)
- [ ] No placeholders / TBD / "fill in later"

## Execution mode

Subagent-driven. Each task = 3 subagent dispatches (extract / write / verify) + commit. Visible chat status before/after every dispatch. If any task BLOCKS or has 🔴 verifier findings, halt and surface to user before proceeding.

Estimated total: ~3-4 hours of subagent work across 11 tasks. Realistic order: ZDX first (Tasks 1-6), ZIdentity second (Tasks 7-11), since ZDX has more refs and any pipeline issues should surface early.
