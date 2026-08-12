import dataclasses
import pathlib
import re

import pytest


ROOT = pathlib.Path(__file__).resolve().parents[2]
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)


@dataclasses.dataclass(frozen=True)
class AnchorCase:
    reference_path: str
    context: str
    citation: str
    target_path: str
    start: int
    end: int
    needles: tuple[str, ...]


CASES = [
    AnchorCase(
        "references/zia/api-divergences.md",
        "Use the rosetta table as the field-level index",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md:683-692",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md",
        683,
        692,
        ("### `admin_role`", "POST /zia/api/v1/adminRoles", "dashboardAccess"),
    ),
    AnchorCase(
        "references/zpa/api-divergences.md",
        "Use the rosetta table as the field-level index",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md:2198-2206",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md",
        2198,
        2206,
        ("### `app_connector_group`", "GET /zpa/mgmtconfig", "connectorGroupType"),
    ),
    AnchorCase(
        "references/zscaler-cellular/api.md",
        "The captured Automate contract contains **36 ZCell operations**",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md:190",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md",
        190,
        190,
        ("`zcell`", "36 captured operations"),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "**No standalone OpenAPI/Swagger spec is published.**",
        "scripts/automate-capture/README.md:13-30",
        "scripts/automate-capture/README.md",
        13,
        30,
        ("Docusaurus route table", "reconstructed/<product>", "Contract Change Radar"),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "**The Postman collection remains useful",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md:181-183",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md",
        181,
        183,
        ("## Boundaries", "Postman", "reference-only"),
    ),
    AnchorCase(
        "references/zpa/api-divergences.md",
        "The Rosetta field table currently records only cross-surface presence",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md:2269",
        "vendor/zscaler-api-specs/automate-zscaler/rosetta.md",
        2269,
        2269,
        ("bypassOnReauth",),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "**ZPA now has a reconstructed Automate contract in this repo.**",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:7-20",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md",
        7,
        20,
        ("| `zpa` | 208 | 137 | 0 |",),
    ),
    AnchorCase(
        "references/zia/content-inspection-extras.md",
        "The Automate contract now provides a static captured file-type vocabulary",
        "vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:5378",
        "vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json",
        5378,
        5378,
        ('"tf": null',),
    ),
    AnchorCase(
        "references/ai-security/_claims-ledger.md",
        "The current Automate snapshot exposes 11 read-only AI Security",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json",
        42816,
        42826,
        ("AI Red Teaming Service", "/aisecurity/airt", "/aisecurity/aispm"),
    ),
    AnchorCase(
        "references/ai-security/_claims-ledger.md",
        "The current Automate snapshot adds 97 structured AI Red Teaming",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json",
        42816,
        42826,
        ("AI Red Teaming Service", "/aisecurity/airt", "/aisecurity/aispm"),
    ),
    AnchorCase(
        "references/ai-security/asset-management-api.md",
        "The refresh renamed all 11 asset-operation route keys",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:177-193",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md",
        177,
        193,
        ("identities-list-identities", "query_params` removed: `id`", "data[].path"),
    ),
    AnchorCase(
        "references/zdx/api-divergences.md",
        "**Snapshot is Python-only**",
        "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:153-154",
        "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md",
        153,
        154,
        ('"path": "/snapshot/alert"', '"path": "/snapshot/user"'),
    ),
    AnchorCase(
        "references/zdx/api-divergences.md",
        "The current Automate comparison surfaces a schema-publication delta",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:194-306",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md",
        194,
        306,
        (
            "application-resource-create-application-monitor",
            "discriminator mappings +WEB",
            "monitor-resource-update-monitor",
        ),
    ),
    AnchorCase(
        "references/cloud-connector/forwarding.md",
        "The Automate contract now gives a third source",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.json:2455-2458",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.json",
        2455,
        2458,
        (
            '"resource": "traffic_forwarding_rule"',
            '"method": "POST"',
            '"path": "/ztw/api/v1/ecRules/ecRdr"',
        ),
    ),
    AnchorCase(
        "references/cloud-connector/forwarding.md",
        "The Automate contract now gives a third source",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.json:2540-2562",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.json",
        2540,
        2562,
        ('"field": "forwardMethod"', '"ENATDEDIP"', '"GEOIP"', '"LOCAL_SWITCH"'),
    ),
    AnchorCase(
        "references/zidentity/users.md",
        "The reconstructed Automate snapshot independently carries",
        "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:19",
        "vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md",
        19,
        19,
        ("| `zid` | 31 | 18 | 0 |",),
    ),
    AnchorCase(
        "references/zcc/api-divergences.md",
        "The generated report also records the ZCC boundary conditions",
        "vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:32-35",
        "vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md",
        32,
        35,
        (
            "## Scope Notes",
            "v2 trusted-network API",
            "no matching captured Automate contract operations",
        ),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 live-fetch data point**",
        "vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:35",
        "vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md",
        35,
        35,
        ("no matching captured Automate contract operations",),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "A live ZIA `web_dlp_rules` GET returns",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:116456-116468",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        116456,
        116468,
        ("web-dlp-rule-resource-add-rule", '"method": "POST"', '"path": "/webDlpRules"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "A live ZIA `web_dlp_rules` GET returns",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:125032-125069",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        125032,
        125069,
        ('"name": "notificationTemplate"', '"type": "object"', '"name": "notificationTemplate.id"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-21 snapshot check**",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:147831-147872",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        147831,
        147872,
        ('"name": "notificationTemplate"', '"name": "notificationTemplate.id"', '"response_status": "200"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-21 snapshot check**",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:182270-182307",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        182270,
        182307,
        ('"name": "notificationTemplate"', '"name": "notificationTemplate.id"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "Upstream issue [zscaler/terraform-provider-ztc#46]",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:88559-88571",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json",
        88559,
        88571,
        ("ec-rule-z-resource-create-rdr-rule", '"method": "POST"', '"path": "/ecRules/ecRdr"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "Upstream issue [zscaler/terraform-provider-ztc#46]",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:90749-90756",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json",
        90749,
        90756,
        ('"name": "labels"', "Not applicable to Cloud & Branch Connector"),
    ),
    AnchorCase(
        "references/cloud-connector/terraform.md",
        "Rule labels are an unresolved provider-coverage and documentation conflict",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:88559-88571",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json",
        88559,
        88571,
        ("ec-rule-z-resource-create-rdr-rule", '"method": "POST"', '"path": "/ecRules/ecRdr"'),
    ),
    AnchorCase(
        "references/cloud-connector/terraform.md",
        "Rule labels are an unresolved provider-coverage and documentation conflict",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:90749-90756",
        "vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json",
        90749,
        90756,
        ('"name": "labels"', "Not applicable to Cloud & Branch Connector"),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 narrowing**: the Automate contract confirms both paths",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82965-82977",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82965,
        82977,
        ("get-all-zpa-profiles", '"method": "GET"', '"path": "/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 narrowing**: the Automate contract confirms both paths",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:83034-83046",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        83034,
        83046,
        ("get-profiles-for-customer", '"method": "GET"', '"path": "/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:29190-29253",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        29190,
        29253,
        ('"method": "GET"', '"path": "/browserIsolation/profiles"', '"name": "[].defaultProfile"', '"name": "[].url"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82132-82144",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82132,
        82144,
        ("isolation-banner-management", '"path": "/cbiconfig/cbi/api/customers/{customerId}/banner"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82425-82437",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82425,
        82437,
        ("isolation-certificate-management", '"path": "/cbiconfig/cbi/api/customers/{customerId}/certificate"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82718-82730",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82718,
        82730,
        ("add-zpa-profile-using-post", '"path": "/cbiconfig/cbi/api/customers/{customerId}/profiles"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82913-82925",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82913,
        82925,
        ("get-all-regions-using-get", '"path": "/cbiconfig/cbi/api/customers/{customerId}/regions"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82965-82977",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82965,
        82977,
        ("get-all-zpa-profiles", '"path": "/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "**Automate contract scope:**",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:83034-83046",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        83034,
        83046,
        ("get-profiles-for-customer", '"path": "/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles"'),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "The Automate contract corroborates both ZPA profile-list paths",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82965-82977",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82965,
        82977,
        ("get-all-zpa-profiles", '"method": "GET"', "zpaprofiles"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "The Automate contract corroborates both ZPA profile-list paths",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:83034-83046",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        83034,
        83046,
        ("get-profiles-for-customer", '"method": "GET"', "isolation/profiles"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "`cbizpaprofile` vs `isolationprofile` preferred endpoint",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:82965-82977",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        82965,
        82977,
        ("get-all-zpa-profiles", '"method": "GET"', "zpaprofiles"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "`cbizpaprofile` vs `isolationprofile` preferred endpoint",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:83034-83046",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        83034,
        83046,
        ("get-profiles-for-customer", '"method": "GET"', "isolation/profiles"),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 narrowing**: the ZIA Automate contract",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:29190-29219",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        29190,
        29219,
        ('"path": "/browserIsolation/profiles"', '"name": "[].defaultProfile"', "Zscaler sets this field"),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 narrowing**: the ZIA Automate contract",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:1808",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json",
        1808,
        1808,
        ("isDefault=true", "copyPaste=none", "uploadDownload=none"),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 narrowing**: the reconstructed ZPA OpenAPI",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:1808",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json",
        1808,
        1808,
        ("copyPaste=none", "uploadDownload=none"),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-18 narrowing**: the reconstructed ZPA OpenAPI",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:2572",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json",
        2572,
        2572,
        ("copyPaste=all", "uploadDownload=all"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "The Automate contract corroborates both ZPA profile-list paths",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:29190-29219",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        29190,
        29219,
        ('"path": "/browserIsolation/profiles"', '"name": "[].defaultProfile"', "Zscaler sets this field"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "Auto-created default profile lifecycle",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:29190-29219",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        29190,
        29219,
        ('"path": "/browserIsolation/profiles"', '"name": "[].defaultProfile"', "Zscaler sets this field"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "Auto-created default profile lifecycle",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:1808",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json",
        1808,
        1808,
        ("isDefault=true",),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "`copyPaste` and `uploadDownload` enum values",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:1808",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json",
        1808,
        1808,
        ("copyPaste=none", "uploadDownload=none"),
    ),
    AnchorCase(
        "references/zbi/api.md",
        "`copyPaste` and `uploadDownload` enum values",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:2572",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json",
        2572,
        2572,
        ("copyPaste=all", "uploadDownload=all"),
    ),
    AnchorCase(
        "references/zia/dlp.md",
        "`dlp_content_locations_scopes`",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:124071-124083",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        124071,
        124083,
        ('"name": "dlpContentLocationsScopes"', '"HTTP_BODY"', "content locations"),
    ),
    AnchorCase(
        "references/zia/dlp.md",
        "`dlp_content_locations_scopes`",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:146797-146810",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        146797,
        146810,
        ('"name": "dlpContentLocationsScopes"', '"FILE_CONTENT"'),
    ),
    AnchorCase(
        "references/zia/dlp.md",
        "`dlp_content_locations_scopes`",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:181309-181321",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        181309,
        181321,
        ('"name": "dlpContentLocationsScopes"', '"FILENAME"', "content locations"),
    ),
    AnchorCase(
        "references/shared/secret-bearing-api-surfaces.md",
        "The App Connector / Service Edge enrollment key is returned",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103046-103058",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        103046,
        103058,
        ("all-configured-provisioning-keys", '"method": "GET"', '"path": "/mgmtconfig/v1/admin/customers/{customerId}/associationType/{associationType}/provisioningKey"'),
    ),
    AnchorCase(
        "references/shared/secret-bearing-api-surfaces.md",
        "The App Connector / Service Edge enrollment key is returned",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103268-103280",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        103268,
        103280,
        ("provisioning-key-for-the-specified-id", '"method": "GET"', "provisioningKey/{provisioningKeyId}"),
    ),
    AnchorCase(
        "references/shared/secret-bearing-api-surfaces.md",
        "The App Connector / Service Edge enrollment key is returned",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103195-103204",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        103195,
        103204,
        ('"name": "list[].nonceValue"', '"readonly": false', '"response_status": "200"'),
    ),
    AnchorCase(
        "references/shared/secret-bearing-api-surfaces.md",
        "The App Connector / Service Edge enrollment key is returned",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:103390-103399",
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        103390,
        103399,
        ('"name": "nonceValue"', '"readonly": false', '"response_status": "200"'),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "The current structured Automate publication combines",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md:7-20",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/openapi-validation-report.md",
        7,
        20,
        ("| `ai-security` | 108 | 99 | 0 |",),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "The current structured Automate publication combines",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:49",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md",
        49,
        49,
        ("| `ai-security` | 11 | 97 | 0 |",),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "The current structured Automate publication combines",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:69-165",
        "vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md",
        69,
        165,
        ("ai-security/airedteaming", "trigger-resource-trigger-prompt-hardening"),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "The current structured Automate publication combines",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json:42816-42826",
        "vendor/zscaler-api-specs/automate-zscaler/openapi/ai-security.openapi.json",
        42816,
        42826,
        ("AI Red Teaming Service", "/aisecurity/airt", "/aisecurity/aispm"),
    ),
    AnchorCase(
        "references/shared/oneapi.md",
        "The current structured Automate publication combines",
        "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json:2-701",
        "vendor/zscaler-api-specs/automate-zscaler/ai-security-api-reference.json",
        2,
        701,
        ("create-ai-app", '"method": "POST"', '"path": "/api/v2/ai-apps/create"'),
    ),
]


def uncommented(text: str) -> str:
    return HTML_COMMENT_RE.sub("", text)


def context_block(text: str, context: str) -> str:
    active = uncommented(text)
    assert active.count(context) == 1, f"expected one active context: {context!r}"
    context_line = next(line for line in active.splitlines() if context in line)
    if context_line.lstrip().startswith("|"):
        return context_line
    for block in re.split(r"\n\s*\n", active):
        if context in block:
            return block
    raise AssertionError(f"context not found in an active paragraph: {context!r}")


def assert_citation_in_context(text: str, context: str, citation: str) -> None:
    block = context_block(text, context)
    assert f"`{citation}`" in block, (
        f"citation {citation!r} is absent from the paragraph containing {context!r}"
    )


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.context[:48])
def test_regenerated_artifact_citation_content(case: AnchorCase):
    assert case.citation.startswith(f"{case.target_path}:")
    reference = (ROOT / case.reference_path).read_text(encoding="utf-8")
    assert_citation_in_context(reference, case.context, case.citation)

    lines = (ROOT / case.target_path).read_text(encoding="utf-8").splitlines()
    assert 1 <= case.start <= case.end <= len(lines)
    excerpt = "\n".join(lines[case.start - 1 : case.end])
    for needle in case.needles:
        assert needle in excerpt


def test_each_tested_citation_occurrence_has_its_own_context_case():
    grouped: dict[tuple[str, str], list[AnchorCase]] = {}
    for case in CASES:
        grouped.setdefault((case.reference_path, case.citation), []).append(case)

    for (reference_path, citation), cases in grouped.items():
        active = uncommented((ROOT / reference_path).read_text(encoding="utf-8"))
        assert active.count(f"`{citation}`") == len(cases)
        assert len({case.context for case in cases}) == len(cases)


def test_comment_only_citation_does_not_satisfy_context_check():
    text = "Claim paragraph.\n\n<!-- Claim paragraph. `vendor/example.json:10` -->"
    with pytest.raises(AssertionError):
        assert_citation_in_context(text, "Claim paragraph.", "vendor/example.json:10")


def test_shorthand_after_wrong_path_does_not_satisfy_fully_qualified_citation():
    text = "Claim paragraph (`vendor/wrong.json:10`, `:20`)."
    with pytest.raises(AssertionError):
        assert_citation_in_context(text, "Claim paragraph", "vendor/intended.json:20")


def test_each_of_two_occurrences_is_bound_to_its_intended_context():
    citation = "vendor/example.json:10"
    text = (
        f"First claim (`{citation}`).\n\n"
        f"Second claim (`{citation}`)."
    )
    assert_citation_in_context(text, "First claim", citation)
    assert_citation_in_context(text, "Second claim", citation)

    missing_second = text.replace(f"Second claim (`{citation}`).", "Second claim.")
    assert_citation_in_context(missing_second, "First claim", citation)
    with pytest.raises(AssertionError):
        assert_citation_in_context(missing_second, "Second claim", citation)


def test_same_count_table_row_move_does_not_satisfy_second_context():
    citation = "vendor/example.json:10"
    baseline = (
        "| Claim | Evidence |\n"
        "|---|---|\n"
        f"| First claim | `{citation}` |\n"
        f"| Second claim | `{citation}` |"
    )
    assert_citation_in_context(baseline, "First claim", citation)
    assert_citation_in_context(baseline, "Second claim", citation)

    moved = baseline.replace(
        f"| First claim | `{citation}` |",
        f"| First claim | `{citation}`; `{citation}` |",
    ).replace(f"| Second claim | `{citation}` |", "| Second claim | none |")
    assert moved.count(f"`{citation}`") == baseline.count(f"`{citation}`")
    assert_citation_in_context(moved, "First claim", citation)
    with pytest.raises(AssertionError):
        assert_citation_in_context(moved, "Second claim", citation)
