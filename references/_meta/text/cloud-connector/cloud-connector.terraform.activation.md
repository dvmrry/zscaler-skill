# Activating ZTC changes from Terraform: the activation resource and the ztcActivator CLI (cloud-connector.terraform.activation)
Also called: ztcActivator; ztc activator; ztc terraform activate; ztc_activation_status apply; ZTW_USERNAME; ztc changes not activated after apply

Cloud and Branch Connector stages every change until it is activated, and the ZTC provider offers two ways to do that from a Terraform workflow. The provider documentation says the ZTC platform requires every configuration to be activated, and offers an out-of-band CLI (ztcActivator) or the `ztc_activation_status` resource for it. [cloud-connector.terraform.activation:two-ways]

**The resource.** What `ztc_activation_status` sends and why it never forces activation is in [Cloud Connector activation on the wire: activate, forced activate, and what the clients send](kb:cloud-connector.api.activation-wire) and [Reading Cloud & Branch Connector activation status](kb:shared.activation.cbc). Because the resource activates only in its create function and every settable argument forces replacement, an apply activates only when `ztc_activation_status` is created or replaced. Once it is in state, a later apply that changes other ZTC resources does not activate unless the status read back from the API differs from the configured arguments and forces a replacement. [cloud-connector.terraform.activation:resource-activates-only-on-create] In legacy mode its read fails: [Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects](kb:cloud-connector.sdk-go.service-defects).

**The CLI.** The ztcActivator CLI is built from the provider repository with `make ztcActivator`, which installs the binary in /usr/local/bin (C:\Windows\System32 on Windows); the guide shows it run after `terraform apply`. [cloud-connector.terraform.activation:cli-build] The CLI chooses legacy mode when `ZSCALER_USE_LEGACY_CLIENT` is `true`. In legacy mode it exits unless `ZTW_USERNAME`, `ZTW_PASSWORD`, `ZTW_API_KEY` and `ZTW_CLOUD` are set; otherwise it requires `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` and `ZSCALER_VANITY_DOMAIN`, with `ZSCALER_CLOUD` optional. It then calls the normal `UpdateActivationStatus`. [cloud-connector.terraform.activation:cli-env-vars] Provider release 0.1.9 made `ZSCALER_CLOUD` optional for `ztcActivator`'s OneAPI startup; unset, it uses the default production cloud. [cloud-connector.terraform.activation:cli-cloud-optional-0-1-9] The CLI's OneAPI mode authenticates only with a client secret: it never reads `ZSCALER_PRIVATE_KEY`, so a deployment that authenticates the provider with a private key cannot run the CLI with the same credentials. [cloud-connector.terraform.activation:cli-no-private-key] The CLI's legacy variables are named ZTW_* while the provider's legacy mode reads ZTC_*, so an environment prepared for the provider's legacy mode does not satisfy the CLI. [cloud-connector.terraform.activation:cli-env-names-differ] The guide describes credential sources the code does not read [divergence:cloud-connector.terraform.activation:cli-credential-sources].

What to check:
1. Whether the activation resource was created or replaced in this apply; if it was already in state and unchanged, the apply did not activate.
2. For the CLI in legacy mode, that ZTW_USERNAME, ZTW_PASSWORD, ZTW_API_KEY and ZTW_CLOUD are set, not only the ZTC_* variables the provider reads.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.terraform.activation:resource-activates-only-on-create] Tier B: Follows from the resource's lifecycle functions and ForceNew arguments; not run. Which status values the API reports after an apply, and therefore whether a replacement is planned, is not shown by any source.
- [cloud-connector.terraform.activation:cli-no-private-key] Tier B: Absence: cli/ztcActivator.go was read in full at the pin; it reads no private-key variable and sets no private-key option.
- [cloud-connector.terraform.activation:cli-env-names-differ] Tier B: Comparison of the variable names in cli/ztcActivator.go and ztc/config.go at the pin; not run.

Sources disagree (name both sides):
- The activator guide says credentials can come from CLI arguments (highest priority) or environment variables; the CLI code reads only environment variables. [divergence:cloud-connector.terraform.activation:cli-credential-sources]
  - tf-ztc: Credentials can be given as CLI arguments or environment variables, with CLI arguments taking priority.
  - tf-ztc: Every credential is read from an environment variable, and a missing required one ends the program; the file parses no command-line arguments.
  Impact: Passing credentials as flags, as the guide suggests, has no effect; the CLI still exits for a missing environment variable.
  Resolved (source-rank) by cloud-connector.terraform.activation:cli-env-vars: The CLI source is what runs.

Area: cloud-connector.terraform, its subjects in references/_meta/spine/cloud-connector/cloud-connector.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.api.activation-wire.md (Cloud Connector activation on the wire: activate, forced activate, and what the clients send): The ZTC provider's `ztc_activation_status` resource activates in its create function (calling `UpdateActivationStatus`), has no update function, and its delete is a no-op; its three settable arguments are ForceNew, and its fourth, `admin_status_map`, is computed only. [cloud-connector.api.activation-wire:tf-create-only]
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/shared/shared.activation.cbc.md (Reading Cloud & Branch Connector activation status)
