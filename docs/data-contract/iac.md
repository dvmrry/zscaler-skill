# `_data/iac/` — production IaC for this fork

**Empty in the public upstream skill.** Populate in your fork with your org's production Infrastructure-as-Code for Zscaler resources.

## Why this exists

The skill ships with Zscaler Terraform provider source under `vendor/terraform-provider-zia/`, `vendor/terraform-provider-zpa/`, `vendor/terraform-provider-zcc/`, and `vendor/terraform-provider-ztc/`. Those repositories are useful for understanding resource schemas, validation rules, and provider coverage. Deployment examples or modules, when vendored, live separately under `vendor/terraform-*-modules/`. Provider source and example modules are reference material, not production truth.

When your fork's `_data/iac/` is populated, agents will treat it as **production truth** for "how is X actually deployed in our environment" questions. Vendored providers and modules stay useful for "what's possible" and field-level shape questions. Where the two diverge, your `_data/iac/` wins for env-specific answers.

## Routing precedence (post-fork)

| Question shape | Authority |
|---|---|
| "How does our X get deployed?" | `_data/iac/` (production truth) |
| "What fields does the API accept for X?" | `vendor/zscaler-sdk-python/` + `vendor/terraform-provider-*` (API contract) |
| "What's the recommended way to deploy X?" | `vendor/terraform-*-modules/` when present + `vendor/zscaler-help/` (Zscaler guidance) |
| "Why doesn't our X work?" | `_data/iac/` first (compare to deployed state), then reference for "how Zscaler intends it" |

## Suggested structure

The upstream skill scaffolds **`terraform/` only** — Terraform is the default IaC tool here, matching how Zscaler publishes their reference modules. If your fork uses other tools (CloudFormation, Pulumi, Ansible, OpenTofu, etc.), add directories as needed:

```
_data/iac/
├── terraform/         ← TF modules + configs (no .tfstate; manage state separately)
├── cloudformation/    ← if you use CFN for AWS deployments — fork-add as needed
├── pulumi/            ← fork-add if applicable
└── INDEX.md           ← optional: point agents at your structure
```

If your IaC is **bundled by Zscaler product** rather than by tool (e.g., all-ZIA together regardless of TF vs anything else), organize that way and ignore the per-tool directories:

```
_data/iac/
├── zia/
│   └── terraform/
├── zpa/
│   └── terraform/
├── cloud-connector/
│   └── terraform/
└── ...
```

Whichever pattern fits your repo wins. Agents will discover the structure via `ls` + any `INDEX.md` you provide.

## Sanitization

Before committing anything to a fork that may eventually be made public:

- Strip secrets, API keys, private keys (`git-secrets` or equivalent + manual review)
- Strip account IDs, subscription IDs, ARNs that map to your tenant
- Generic-ize hostnames and domain names
- Strip any IP ranges that identify your network footprint

If your fork is private-only and will never be made public, sanitization is optional — but the routine is good practice in case the policy changes.

## Why this lives outside `references/`

`references/` is the skill's reasoning content — how Zscaler products work, sourced from public docs + vendored SDK + vendored help captures. It's the same for every fork.

`_data/iac/` is your env's deployment content — how you actually run those products. It's per-fork. They serve different audiences:

- `references/` answers any user of the skill
- `_data/iac/` answers users of *your fork specifically*

The split also keeps your production patterns from leaking back into the public upstream if you ever sync a fork with the upstream main branch.

## Cross-link from agents

When an agent reads a `references/cloud-connector/azure-deployment.md` claim like "Zscaler's reference TF deploys CC with two NICs," it should also check `_data/iac/terraform/cloud-connector/` (or wherever your CC IaC lives) to see how *your* deployment is actually configured. The reference doc tells the agent what's possible; `_data/iac/` tells it what's deployed.
