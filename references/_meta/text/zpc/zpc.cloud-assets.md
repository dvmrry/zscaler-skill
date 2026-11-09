# ZPC cloud assets: asset types, categories and asset details (zpc.cloud-assets)
Also called: Posture Control cloud assets

**Types and categories.** Asset types are cloud-service-provider-defined services, while asset categories are ZPC-specific aggregations of similar asset types across all providers (VMs and EC2 instances belong to the Compute category); each category includes multiple asset types. [zpc.cloud-assets:assets-vs-categories] The Cloud Asset Types and Asset Categories page says ZPC provides an inventory of asset types on Microsoft Azure, AWS, Google Cloud Platform and Kubernetes Security Posture Management (KSPM). [zpc.cloud-assets:asset-inventory-clouds] Public exposure protection is supported for a listed subset of asset types per provider, including AWS EC2::SecurityGroup and ApiGatewayV2::APIs and Azure PublicIPAddresses. [zpc.cloud-assets:public-exposure-asset-types] Resources managed by Databricks are not listed in ZPC assets. [zpc.cloud-assets:databricks-not-listed]

**Asset list.** Azure asset IDs are displayed in lowercase regardless of the case in which they were created. [zpc.cloud-assets:azure-id-lowercase] ZPC shows per asset the first-discovery time (Discovered On), Publicly Exposed and Trusted IP flags and vulnerability count, and for Kubernetes assets the Cluster and Namespace where applicable. [zpc.cloud-assets:asset-list-fields] Cloud asset details can be exported as an Excel file. [zpc.cloud-assets:asset-export-excel]

**Asset details.** The asset Timeline tab shows data for up to 6 months, and for AWS also the account ID and request parameters during resource state creation or update. [zpc.cloud-assets:asset-timeline-retention] On the asset Alerts tab the alert status is Open, Closed, Resolved or Ignored, and Alert Age is measured in days from the last time the status was set to Open; the Compliance Policies tab shows policy status Passed or Failed. [zpc.cloud-assets:asset-alert-status-values] When an asset is publicly exposed and associated with a trusted IP list, the publicly exposed attribute links to that list on the Trusted IP Management page. [zpc.cloud-assets:asset-trusted-ip-link] The asset Vulnerabilities tab covers assets within containers, lists packages with the highest CVE count and severity first, and exports the vulnerability data to a CSV file. [zpc.cloud-assets:asset-vuln-tab] Package vulnerability details show severity (Low, Medium, High or Critical), age of CVE and fix version, and all packages are displayed by default when the data is first viewed. [zpc.cloud-assets:package-cve-fields]

[gap:zpc.cloud-assets:asset-type-lists] [gap:zpc.cloud-assets:service-status]

Not known (open gaps):
- Which asset types map to which asset categories [gap:zpc.cloud-assets:asset-type-lists]: settled by source-read
- Whether the ZPC features these pages describe are still available [gap:zpc.cloud-assets:service-status]: settled by source-read

Area: zpc.cloud-assets, its subjects in references/_meta/spine/zpc/zpc.cloud-assets.json
