# IaC repositories

**Empty in the public upstream skill.** A company declares its own Infrastructure-as-Code repositories for
Zscaler objects; agents then treat them as production truth for "how is X deployed here" questions.

## Where they live

Check each repository out under `<mount>/iac/<repo>/` (`<mount>` is the runtime-data mount, `_data` by
default) and declare it in the overlay's `overlay.json`, with its path relative to the overlay root:

```json
{
  "schema_version": 1,
  "iac": [
    { "id": "zia-terraform", "path": "../iac/zia-terraform", "kind": "terraform" },
    { "id": "zpa-terraform", "path": "../iac/zpa-terraform", "kind": "terraform" },
    { "id": "infrawright", "path": "../iac/infrawright", "kind": "infrawright" }
  ]
}
```

Any number of repositories may be declared; `id` is how records point at one.

| `kind` | Holds | A pointer names |
|---|---|---|
| `infrawright` | infrawright's JSON | a file and a JSON Pointer into it; the resolver reads the value and merges it into the answer |
| `terraform` | Terraform HCL | a file and, optionally, a resource address (`zia_url_filtering_rules.block_gambling`); HCL is never parsed, so the resolver reports the location for the reader to open |

An `iac-coverage` company record ([`knowledge.md`](knowledge.md)) attaches pointers to the public types they
cover:

```json
{ "repo": "zia-terraform", "file": "url_filtering.tf", "address": "zia_url_filtering_rules.block_gambling",
  "label": "the rule as our Terraform declares it" }
```

`scripts/check-data-contract.mjs` checks that every pointer's repository is declared, its file exists inside the
repository, and an infrawright pointer resolves.

## Why this exists

The skill ships the Zscaler Terraform providers (`vendor/terraform-provider-*`) and, where vendored, their
deployment modules (`vendor/terraform-*-modules/`). Those say what is possible and what the reference
deployment looks like; they are not how a company runs its tenant. Where they diverge, the company's IaC wins
for questions about its environment.

| Question shape | Authority |
|---|---|
| "How does our X get deployed?" | the company's IaC |
| "What fields does the API accept for X?" | the generated surface (`node scripts/kb.mjs surface <name>`) and the providers |
| "What's the recommended way to deploy X?" | the graph's subjects (`node scripts/kb.mjs resolve <words>`), from Zscaler's help and modules |
| "Why doesn't our X work?" | the company's IaC first (what is deployed), then the graph (how Zscaler intends it) |

## Sanitization

Before committing IaC to anything that may become public: strip secrets, API keys and private keys; strip
account, subscription and tenant identifiers; generic-ize hostnames, domains and IP ranges. A private-only repo
can skip this, but the habit is cheap.

## Why it lives outside `references/`

`references/` is the same for every installation: how Zscaler products work, from public sources. IaC is how
one company runs them. Keeping them apart keeps a company's deployment out of the public upstream.
