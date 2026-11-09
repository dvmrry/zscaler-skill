# The Python SDK against Cloud and Branch Connector (ZTW): where its behavior is described (cloud-connector.sdk-python)
Also called: ztw python sdk; zscaler-sdk-python ztw; client.ztw; cloud connector python sdk

Module and method tables are generated: run `node scripts/kb.mjs surface ztw` and read the `sdk_python` entries. These subjects hold the client behavior around them; the API itself is in [The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes](kb:cloud-connector.api).

**Client.** How `client.ztw` picks OneAPI or the legacy helper is in [Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds](kb:cloud-connector.api.authentication); the legacy helper's ZTW_* settings and the logout that activates staged changes in [The Python SDK against Cloud and Branch Connector: legacy client settings and session logout on exit](kb:cloud-connector.sdk-python.client-configuration); legacy retry handling in [Cloud Connector API rate limits and how the Go and Python clients back off and retry](kb:cloud-connector.api.rate-limits).

**Coverage.** Destination workload groups, workload groups and the discovery service are in [What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop](kb:cloud-connector.sdk-python.coverage); the IP pool module's missing methods and the 2.0 beta's scope in [Which clients cover which parts of the Cloud Connector API: Python v1 and v2, Go, Terraform](kb:cloud-connector.api.client-coverage); the activate call in [Cloud Connector activation on the wire: activate, forced activate, and what the clients send](kb:cloud-connector.api.activation-wire).

Area: cloud-connector.sdk-python, its subjects in references/_meta/spine/cloud-connector/cloud-connector.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.activation-wire.md (Cloud Connector activation on the wire: activate, forced activate, and what the clients send)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.authentication.md (Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.client-coverage.md (Which clients cover which parts of the Cloud Connector API: Python v1 and v2, Go, Terraform)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.rate-limits.md (Cloud Connector API rate limits and how the Go and Python clients back off and retry)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.client-configuration.md (The Python SDK against Cloud and Branch Connector: legacy client settings and session logout on exit)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.coverage.md (What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop)
