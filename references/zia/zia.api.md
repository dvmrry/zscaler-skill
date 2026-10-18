Endpoint lists, field tables and Terraform resource maps are generated from the OpenAPI specification, the provider schemas and the SDKs; this subject family holds only the behavior around them.

Making a change live is in [[zia.api.activation]], and limits and retries are in [[zia.api.rate-limits]]. Where reads and writes disagree is in [[zia.api.read-write-asymmetries]], and which services each SDK covers is in [[zia.api.sdk-coverage]].

How the Python SDK signs in is in [[zia.sdk-python.authentication]], what it returns in [[zia.sdk-python.response-shape]], how it pages in [[zia.sdk-python.pagination]], and how it reports errors and names its accessors in [[zia.sdk-python.client-errors-and-accessors]].

Field-level notes are in [[zia.api.url-categories-wire]], [[zia.api.url-filtering-wire]], [[zia.api.ssl-inspection-wire]], [[zia.api.advanced-settings-wire]], [[zia.api.legacy-ips-signature-wire]] and [[zia.api.cloud-nss-feeds]]. The Cloud App Control rule type and identity in the provider are in [[zia.terraform.cloud-app-control-rule]].
