---
product: zbi
topic: "zbi-claims-ledger"
title: "ZBI claims ledger - Tier 3 first-pass refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-is-zero-trust-browser.md"
  - "vendor/zscaler-help/understanding-turbo-mode-isolation.md"
  - "vendor/zscaler-help/configuring-smart-browser-isolation-policy.md"
  - "vendor/zscaler-help/zpa-about-isolation-policy.md"
  - "vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/cbi_banner.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/cbi_certificate.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/cbi_region.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/cbi_zpa_profile.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go"
  - "vendor/terraform-provider-zia/zia/data_source_zia_cloud_browser_isolation_profile.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go"
  - "vendor/terraform-provider-zia/zia/validator.go"
  - "vendor/terraform-provider-zpa/zpa/provider.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_browser_isolation_external_profile.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go"
  - "vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/get_isolation_profile.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZBI claims ledger

This ledger covers the Zero Trust Browser / Cloud Browser Isolation claims changed or explicitly guarded in the Tier 3 first-pass ZBI refresh. Rows either point to exact source lines or mark the item as an open question / audit-scoped absence.

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Zero Trust Browser loads the requested page on a remote browser in Zscaler data centers and streams rendered content to the user's native browser. | `index.md`, `overview.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:14` |
| HTML, CSS, JavaScript, and other active content do not reach the user's machine or corporate network in the isolation model. | `index.md`, `overview.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:18` |
| Zero Trust Browser is integrated with ZIA and ZPA; traffic egressing the isolation browser is passed through Public Service Edges before reaching the internet page. | `index.md`, `overview.md`, `policy-integration.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:22` |
| A ZIA URL Filtering policy with `Isolate` redirects the HTTP/HTTPS request to the isolation profile URL with the original URL in the query string. | `overview.md`, `policy-integration.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:28` |
| After redirect, Zero Trust Browser assigns a temporary remote browser; the remote browser connects to the original URL through the nearest Public Service Edges and is evaluated against Internet & SaaS policies. | `overview.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:30` |
| Default profiles are automatically created for organizations with Zero Trust Browser, and admins can manually create multiple profiles for both Internet & SaaS and Private Access. | `index.md`, `policy-integration.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:32` |
| Each redirected user receives an endpoint container; subsequent requests hitting the same profile use the same container, and containers are destroyed on manual logout or after the default 10-minute idle timeout. | `overview.md` | `vendor/zscaler-help/what-is-zero-trust-browser.md:38` |
| Turbo Mode transfers rendered information as an instruction set rather than pixel streaming, with web content processed on Isolation containers and no code executed locally. | `overview.md` | `vendor/zscaler-help/understanding-turbo-mode-isolation.md:15`, `:17` |
| Turbo Mode requires hardware acceleration with WebGL/WebGL2 and is not supported for Internet Explorer 11. | `overview.md` | `vendor/zscaler-help/understanding-turbo-mode-isolation.md:19`, `:27` |
| Smart Browser Isolation automatically isolates suspicious websites using AI/ML models, decrypts them using SSL/TLS Inspection, and presents a remote-browser rendition using Zero Trust Browser. | `policy-integration.md`, `overview.md` | `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:16` |
| Smart Isolation requires Malware Protection Inspect Inbound and Inspect Outbound toggles. | `policy-integration.md` | `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:18` |
| Enabling Smart Isolation creates an editable SSL/TLS Inspection rule; the policy also requires an available Browser Isolation Profile. | `policy-integration.md`, `overview.md` | `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:24`, `:32`, `:34` |
| ZPA Isolation Policy requires Isolation enabled and an isolation profile before creating a rule; an access policy is also required for the application to be accessible from within the isolation environment. | `policy-integration.md` | `vendor/zscaler-help/zpa-about-isolation-policy.md:16`, `:26` |
| ZPA Isolation Policy timeout uses the minimum timeout across configured timeout policies. | `overview.md`, `policy-integration.md` | `vendor/zscaler-help/zpa-about-isolation-policy.md:24` |
| ZPA Isolation Policy criteria require all conditions in the rule, use only AND/OR operators, and the default rule cannot be edited. | `policy-integration.md` | `vendor/zscaler-help/zpa-about-isolation-policy.md:32`, `:33`, `:43` |
| The Miscellaneous & Unknown subscription may only allow isolating that URL category; it creates a distinct preconfigured profile and auto-created URL filtering rule with different default-enabled behavior for new vs existing tenants. | `policy-integration.md` | `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md:15`, `:17` |
| The Miscellaneous & Unknown preconfigured profile has fixed and editable settings, including Turbo Mode enabled, copy/paste/file transfer/print disabled, read-only enabled, and editable Turbo Mode, Debug Mode, Root Certificate, Read-Only Isolation, and Region Selection. | `policy-integration.md` | `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md:19`, `:21-48` |
| Python `client.zbi` is Zscaler Business Insights, not Zero Trust Browser / Cloud Browser Isolation. | `index.md`, `overview.md`, `api.md`, `policy-integration.md` | `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-51`, `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:331-335` |
| The Business Insights `client.zbi.custom_apps` surface uses `/bi/api/v1/customapps`, confirming it is not a browser-isolation policy/profile endpoint. | `api.md`, `policy-integration.md` | `vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py:28-34`, `:70-74`, `:169-173`, `:222-227` |
| ZIA Cloud Browser Isolation profile lookup exists in both Python and Go and is read-only in the inspected SDK functions. | `api.md`, `overview.md`, `policy-integration.md` | `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:37-60`, `vendor/zscaler-sdk-python/zscaler/zia/models/cloud_browser_isolation.py:29-39`, `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:13`, `:30-48` |
| ZPA CBI profile management has create/read/update/delete surfaces in Python and Go. | `api.md`, `overview.md`, `policy-integration.md` | `vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:37`, `:86`, `:124`, `:248`, `:351`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:102`, `:137`, `:146`, `:155`, `:164` |
| ZPA CBI profile create requires at least two `region_ids` and a list of `certificate_ids`; update requires `regions`, `certificates`, and `banner.id` objects in the Python SDK. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:226-231`, `:321-329` |
| ZPA CBI banner and certificate controllers use singular POST endpoints but plural list/get/update/delete endpoints. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zpa/cbi_banner.py:61-65`, `:147-151`, `:195-199`, `:243-247`; `vendor/zscaler-sdk-python/zscaler/zpa/cbi_certificate.py:61-65`, `:142-146`, `:188-192`, `:236-240`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go:13-15`, `:66-68`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go:13-15`, `:70-72` |
| ZPA CBI region, CBI ZPA profile, and mgmtconfig isolation-profile surfaces are read/list surfaces in the inspected SDK code. | `api.md` | `vendor/zscaler-sdk-python/zscaler/zpa/cbi_region.py:37-78`, `vendor/zscaler-sdk-python/zscaler/zpa/cbi_zpa_profile.py:38-86`, `:88-136`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go:22-44`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go:30-70`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go:31-59` |
| Terraform ZIA exposes a CBI profile data source and Smart Isolation fields on `zia_browser_control_policy`. | `api.md`, `policy-integration.md` | `vendor/terraform-provider-zia/zia/data_source_zia_cloud_browser_isolation_profile.go:13-37`, `:45-63`; `vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go:116-126`, `:170-177`, `:297-317`, `:351-379` |
| Terraform ZIA URL Filtering rules require `cbi_profile` when action is `ISOLATE`, and Cloud App Control rules carry `cbi_profile` for isolate action families. | `api.md`, `policy-integration.md` | `vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go:52-63`, `:288-305`; `vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go:198-210`, `:698-705`; `vendor/terraform-provider-zia/zia/validator.go:650-667` |
| Terraform ZPA registers CBI banner, certificate, external profile, v1/v2 isolation-rule resources, and CBI/isolation-profile data sources; the external-profile and v1 isolation-rule resources call create/update/delete paths. | `api.md`, `policy-integration.md` | `vendor/terraform-provider-zpa/zpa/provider.go:157-159`, `:169`, `:172`, `:226-232`; `vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_browser_isolation_external_profile.go:262-278`, `:344-365`, `:372-378`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go:11`, `:14-19`, `:27-34`, `:81-84`, `:113-118`, `:191-199`, `:228-230`, `:242-249` |
| Terraform ZPA has a separate v2 isolation-rule resource that wraps `policysetcontrollerv2`, supports `ISOLATE`/`BYPASS_ISOLATE`, validates a v2 object-type set including `CHROME_ENTERPRISE` and `CHROME_POSTURE_PROFILE`, and calls v2 create/update/delete paths. | `api.md`, `policy-integration.md` | `vendor/terraform-provider-zpa/zpa/provider.go:172`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go:11`, `:14-19`, `:43-46`, `:97-109`, `:171`, `:258`, `:282`, `:289-304` |
| Ansible has one ZIA read-only Cloud Browser Isolation profile-info module plus eight ZPA browser-isolation modules for banner/certificate CRUD and `_info`, CBI profile info, isolation-profile info, and v1/v2 isolation-rule management. | `api.md`, `policy-integration.md` | `vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py:31`, `:121-140`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner.py:31`, `:203-225`, `:231-233`, `:253`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_banner_info.py:31`, `:158`, `:168`, `:179`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate.py:31`, `:175-193`, `:202-204`, `:219`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_certificate_info.py:31`, `:130-142`, `:153`; `vendor/zpacloud-ansible/plugins/modules/zpa_cloud_browser_isolation_profile_info.py:31`, `:230`, `:240`, `:251`; `vendor/zpacloud-ansible/plugins/modules/zpa_isolation_profile_info.py:31`, `:153-154`; `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule.py:31`, `:275-287`, `:378-399`, `:407-409`; `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py:31`, `:278-290`, `:379-399`, `:409-411` |
| MCP returns full SDK-modeled ZPA CBI profile dictionaries in a list, optionally narrowed by exact name while retaining the list shape; isolation-policy list/get likewise return full records, and create rejects `isolate` without `zpn_isolation_profile_id`. | `api.md`, `policy-integration.md` | `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/get_isolation_profile.py:27-46`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py:64-117`, `:120-161`; `vendor/zscaler-mcp-server/src/zscaler_mcp/registry/spec.py:43-56`; `vendor/zscaler-mcp-server/src/zscaler_mcp/shaping/helpers.py:50-113` |
| The Postman collection includes ZIA Browser Isolation profile lookup, ZPA CBI banner/profile controller endpoints, and the separate ZPA mgmtconfig isolation-profile read path. | `api.md` | `vendor/zscaler-api-specs/oneapi-postman-collection.json:774-777`, `:823-829`, `:15801-15817`, `:17106-17133`, `:19193-19209`, `:21046-21059`, `:21392-21397`, `:61255` |
| Manual URL Filtering `Isolate` SSL/TLS Inspection prerequisite and exact failure mode are not established by the captured sources; Smart Isolation decrypt behavior is source-backed separately. | `overview.md`, `policy-integration.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zbi-01-manual-url-filter-isolate-ssl-inspection-prerequisite` |
| Preferred usage relationship between ZPA `cbizpaprofile` and `isolationprofile` read endpoints is unresolved by SDK/Postman source alone. | `api.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zbi-02-cbizpaprofile-vs-isolationprofile-preferred-endpoint` |
| Auto-created default profile lifecycle and `isDefault` mutability are not resolved by the inspected sources. | `api.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zbi-03-auto-created-default-profile-lifecycle-and-isdefault-mutability` |
| Complete enum sets for `securityControls.copyPaste` and `securityControls.uploadDownload` are not enumerated by the inspected SDK source. | `api.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zbi-04-copypaste-and-uploaddownload-enum-completeness` |
| Behavior when deleting an isolation profile still referenced by a rule is not documented in the captured sources. | `policy-integration.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zbi-05-deleting-a-referenced-isolation-profile` |
| Propagation behavior for profile changes into already-running isolated sessions is not documented in the captured sources. | `policy-integration.md`, `clarifications.md` | `OPEN QUESTION -> references/_meta/clarifications.md#zbi-06-profile-update-propagation-to-active-isolated-sessions` |
