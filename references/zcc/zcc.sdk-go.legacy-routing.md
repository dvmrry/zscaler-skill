This is a defect in the Go SDK's legacy-client mode, which matters to code that calls the SDK directly with legacy ZCC credentials. {{generic-legacy-path-targets-zia}} {{zcc-services-use-generic-path}} {{legacy-zcc-reads-fail-or-misroute}}

It normally does not reach the Terraform provider. {{zcc-provider-oneapi-only}} So a ZCC provider failure is not explained by this, and an SDK-based script that fails only for these resources in legacy mode probably is.
