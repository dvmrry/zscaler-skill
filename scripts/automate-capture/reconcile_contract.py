#!/usr/bin/env python3
"""reconcile_contract.py — diff the captured automate.zscaler.com contract against
the Go SDK struct and the Terraform provider schema, and report real divergences.

This is the DAV-21 payoff: the rendered contract is the vendor's actual per-operation
schema (required/readonly/enum). Diffing it against the client-side sources surfaces
where they disagree — numeric-vs-string fields, required/readonly drift, enum drift,
and coverage gaps.

Inputs:
  - normalized contract  : vendor/zscaler-api-specs/automate-zscaler/<product>-api-reference.json
  - Go SDK struct        : vendor/zscaler-sdk-go/... (json tags + Go type)
  - Terraform schema     : vendor/terraform-provider-*... (Required/Optional/Computed + enum)

High-signal axes (conservative — exact names; TF snake_case→camelCase is the only
alias, derived from the TF key itself; anything unmatched is reported, never guessed):
  - presence        : field in one source but not the other
  - type drift      : contract numeric vs Go string (and vice versa)
  - required drift  : contract (request-body required) vs TF Required
  - readonly        : the contract's readonly fields vs TF Computed (narrowed — TF's
                      Optional+Computed server-defaults are NOT treated as readonly)
  - enum            : match / value-conflict (both list values, they differ) /
                      one-sided (only one side constrains)

Extractors take source TEXT (pure, unit-tested in test_reconcile_contract.py); thin
file wrappers read from disk. Run from the repo root:
  python3 scripts/automate-capture/reconcile_contract.py
"""
import json
import os
import re

ROOT = os.environ.get("REPO_ROOT", ".")

# ---- Go SDK struct extraction ---------------------------------------------

_GO_NUM = {"int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16",
           "uint32", "uint64", "float32", "float64"}


def go_category(t):
    t = t.lstrip("*")
    if t.startswith("[]"):
        return "array"
    if t.startswith("map["):
        return "object"
    if t in _GO_NUM:
        return "number"
    if t == "bool":
        return "boolean"
    if t == "string":
        return "string"
    return "object"


def extract_go_struct_fields(src, struct_name):
    """Top-level fields of a Go struct -> {json_name: {go_type, category}}.
    Brace-aware so nested anonymous structs don't leak. Pure (takes source text)."""
    m = re.search(r"type\s+" + re.escape(struct_name) + r"\s+struct\s*\{", src)
    if not m:
        return {}
    i = m.end()
    depth = 1
    start = i
    while i < len(src) and depth:
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
        i += 1
    body = src[start:i - 1]
    fields = {}
    # Only depth-1 lines: Name  Type  `json:"name,..."`. Skip lines inside nested
    # struct{...} blocks by tracking braces on the field-type position.
    bdepth = 0
    fre = re.compile(r"^\s*([A-Z]\w*)\s+([^\s`]+)\s+`[^`]*json:\"([^\",]+)")
    for line in body.split("\n"):
        if bdepth == 0:
            fm = fre.match(line)
            if fm:
                _, go_type, json_name = fm.groups()
                if json_name != "-":
                    fields[json_name] = {"go_type": go_type, "category": go_category(go_type)}
        bdepth += line.count("{") - line.count("}")
    return fields


# ---- Terraform schema extraction ------------------------------------------

def snake_to_camel(s):
    parts = s.split("_")
    return parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])


def _scan_blocks_depth1(src, open_marker):
    """Yield (key, block_text) for "key": { ... } at depth 1 inside open_marker.
    Brace-aware; skips strings and // comments."""
    mi = src.find(open_marker)
    if mi == -1:
        return
    i = mi + len(open_marker)
    depth = 1
    n = len(src)
    cur_key = None
    block_start = None
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if c == '"':
            i += 1
            while i < n and src[i] != '"':
                if src[i] == "\\":
                    i += 1
                i += 1
            i += 1
            continue
        if c == "`":
            i += 1
            while i < n and src[i] != "`":
                i += 1
            i += 1
            continue
        if c == "{":
            if depth == 1:
                pre = src[max(0, i - 80):i]
                km = re.search(r'"([a-z0-9_]+)"\s*:\s*$', pre)
                if km:
                    cur_key = km.group(1)
                    block_start = i + 1
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 1 and cur_key is not None:
                yield cur_key, src[block_start:i]
                cur_key = None
        i += 1


def _strip_go_comments(s):
    """Drop /* */ and // comments so commented-out attributes (Computed,
    ValidateFunc, ...) are never read as live schema. Adequate for schema blocks:
    the flags and StringInSlice values we read never appear inside string literals."""
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    s = re.sub(r"//[^\n]*", "", s)
    return s


_TF_MARKER = "Schema: map[string]*schema.Schema{"
_RESOURCE_FUNC_RE = re.compile(r"func\s+resource\w+\s*\(\)\s*\*schema\.Resource\s*\{")


def _go_block_end(src, open_idx):
    """Return the matching brace index for a Go block, skipping comments/strings."""
    i = open_idx + 1
    depth = 1
    n = len(src)
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j + 1
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i)
            i = n if j == -1 else j + 2
            continue
        if c == '"':
            i += 1
            while i < n and src[i] != '"':
                if src[i] == "\\":
                    i += 1
                i += 1
            i += 1
            continue
        if c == "`":
            i += 1
            while i < n and src[i] != "`":
                i += 1
            i += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return n


def _tf_resource_func_source(src):
    """Prefer the actual Terraform resource function over helper schemas in the file."""
    m = _RESOURCE_FUNC_RE.search(src)
    if not m:
        return src
    open_idx = src.find("{", m.start(), m.end())
    if open_idx == -1:
        return src
    return src[open_idx + 1:_go_block_end(src, open_idx)]


def _drop_nested_schema_maps(src):
    """Remove nested schema maps from a top-level field block before flag/enum reads."""
    out = []
    i = 0
    while True:
        mi = src.find(_TF_MARKER, i)
        if mi == -1:
            out.append(src[i:])
            break
        out.append(src[i:mi])
        open_idx = mi + len(_TF_MARKER) - 1
        i = _go_block_end(src, open_idx) + 1
    return "".join(out)


def _tf_top_level_keys(src):
    """Every depth-1 key in the top-level Schema map — including helper-valued keys
    (`"k": resourceFooSchema()`), which inline-block scanning misses. String/comment
    aware so braces and colons in literals/comments don't confuse depth or key
    detection."""
    mi = src.find(_TF_MARKER)
    if mi == -1:
        return []
    i = mi + len(_TF_MARKER)
    n = len(src)
    depth = 1
    keys = []
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i)
            i = n if j == -1 else j + 2
            continue
        if c == "`":
            j = src.find("`", i + 1)
            i = n if j == -1 else j + 1
            continue
        if c == '"':
            k = i + 1
            while k < n and src[k] != '"':
                if src[k] == "\\":
                    k += 1
                k += 1
            token = src[i + 1:k]
            j = k + 1
            while j < n and src[j] in " \t":
                j += 1
            if depth == 1 and j < n and src[j] == ":" and re.fullmatch(r"[a-z0-9_]+", token):
                keys.append(token)
            i = k + 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1
    return keys


def extract_tf_schema_fields(src):
    """Top-level TF schema keys -> {camel_key: {tf_key, inline, required, optional,
    computed, enum}}. Pure (takes source text). Helper-valued keys are recorded as
    present (inline=False) with unknown flags (None) — we don't resolve helper bodies,
    so we never claim a flag/enum divergence we can't see. Comments are stripped
    before flag/enum reads so commented-out attributes don't count."""
    src = _tf_resource_func_source(src)
    blocks = dict(_scan_blocks_depth1(src, _TF_MARKER))
    out = {}
    for key in _tf_top_level_keys(src):
        block = blocks.get(key)
        if block is None:
            out[snake_to_camel(key)] = {"tf_key": key, "inline": False, "required": None,
                                        "optional": None, "computed": None, "enum": None}
            continue
        cb = _strip_go_comments(_drop_nested_schema_maps(block))
        enum = None
        em = re.search(r"StringInSlice\(\s*\[\]string\{([^}]*)\}", cb)
        if em:
            enum = re.findall(r'"([^"]+)"', em.group(1))
        out[snake_to_camel(key)] = {
            "tf_key": key, "inline": True,
            "required": bool(re.search(r"\bRequired:\s*true", cb)),
            "optional": bool(re.search(r"\bOptional:\s*true", cb)),
            "computed": bool(re.search(r"\bComputed:\s*true", cb)),
            "enum": enum,
        }
    return out


# ---- contract type category ------------------------------------------------

def contract_category(t):
    if t is None:
        return None
    arr = t.endswith("[]")
    base = t[:-2] if arr else t
    alias = re.fullmatch(
        r"[A-Z][A-Za-z0-9_]* \((string|boolean|number|integer|int32|int64|object|float|double|long|byte|date|date-time)\)",
        base,
    )
    if alias:
        base = alias.group(1)
    if arr:
        return "array"
    if base in ("int32", "int64", "integer", "number", "float", "double", "long", "byte"):
        return "number"
    if base == "boolean":
        return "boolean"
    if base in ("string", "date", "date-time"):
        return "string"
    return "object"


# ---- registry --------------------------------------------------------------

ZPA_RESOURCES = [
    {"name": "app_connector_group", "group": "app-connector-group-management",
     "create": "adds-a-new-app-connector-group-for-the-specified-customer",
     "get": "gets-the-app-connector-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go", "AppConnectorGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go"},
    {"name": "application_server", "group": "server-management",
     "create": "adds-a-new-server-for-the-specified-customer",
     "get": "gets-the-server-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/appservercontroller/zpa_app_server_controller.go", "ApplicationServer"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_app_server_controller.go"},
    {"name": "application_segment", "group": "application-segment-management",
     "create": "adds-a-new-application-segment-for-the-specified-customer",
     "get": "gets-the-application-segment-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go", "ApplicationSegmentResource"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment.go"},
    {"name": "ba_certificate", "group": "certificate-management",
     "create": "adds-a-certificate-with-a-private-key-for-the-specified-customer",
     "get": "gets-the-certificate-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/bacertificate/zpa_ba_certificate.go", "BaCertificate"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_ba_certificate.go"},
    {"name": "emergency_access", "group": "emergency-access-management",
     "create": "add-emergency-access-user",
     "get": "get-emergency-access-user",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/emergencyaccess/emergencyaccess.go", "EmergencyAccess"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_emergency_access.go"},
    {"name": "inspection_custom_control", "group": "appprotection-control-management",
     "create": "create-custom-control",
     "get": "get-custom-control-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_custom_controls/zpa_inspection_custom_controls.go", "InspectionCustomControl"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_inspection_custom_controls.go"},
    {"name": "inspection_profile", "group": "appprotection-profile-management",
     "create": "add-inspection-profile",
     "get": "get-inspection-profile",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/inspectioncontrol/inspection_profile/zpa_inspection_profile.go", "InspectionProfile"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_inspection_profile.go"},
    {"name": "lss_config", "group": "log-streaming-service-lss-configuration",
     "create": "add-a-new-lss-configuration-for-the-specified-customer",
     "get": "gets-the-lss-configuration-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller.go", "LSSResource"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go"},
    {"name": "pra_approval", "group": "privileged-approval-management",
     "create": "add-privileged-approval",
     "get": "get-privileged-approval",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praapproval/praapproval.go", "PrivilegedApproval"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_approval.go"},
    {"name": "pra_console", "group": "privileged-console-management",
     "create": "add-pra-console",
     "get": "get-pra-console",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praconsole/praconsole.go", "PRAConsole"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_console_controller.go"},
    {"name": "pra_credential", "group": "privileged-credential-management",
     "create": "add-credential",
     "get": "get-credential",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go", "Credential"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_credential_controller.go"},
    {"name": "pra_portal", "group": "privileged-portal-management",
     "create": "add",
     "get": "get-pra-portal",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/praportal/praportal.go", "PRAPortal"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_pra_portal_controller.go"},
    {"name": "server_group", "group": "server-group-management",
     "create": "add-a-new-server-group",
     "get": "gets-the-server-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go", "ServerGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_server_group.go"},
    {"name": "segment_group", "group": "segment-group-management",
     "create": "adds-a-new-segment-group-for-the-specified-customer",
     "get": "gets-the-segment-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/segmentgroup/zpa_segment_group.go", "SegmentGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_segment_group.go"},
    {"name": "provisioning_key", "group": "provisioning-key-management",
     "create": "adds-a-new-provisioning-key-for-the-specified-customer",
     "get": "gets-details-of-the-provisioning-key-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go", "ProvisioningKey"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go"},
    {"name": "service_edge_group", "group": "private-service-edge-group-management",
     "create": "add-private-broker-group",
     "get": "get-private-broker-group",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgegroup/zpa_service_edge_group.go", "ServiceEdgeGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go"},
]

ZIA_RESOURCES = [
    {"name": "advanced_settings", "group": "advanced-settings",
     "update": "advanced-settings-resource-update-advanced-settings",
     "get": "advanced-settings-resource-get-advanced-settings",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advanced_settings/advanced_settings.go", "AdvancedSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_advanced_settings.go"},
    {"name": "advanced_threat_settings", "group": "advanced-threat-protection-policy",
     "update": "cyber-threat-protection-resource-update-config",
     "get": "cyber-threat-protection-resource-get-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go", "AdvancedThreatSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_settings.go"},
    {"name": "admin_role", "group": "admin-role-management",
     "create": "admin-role-resource-add-role",
     "get": "admin-role-resource-get-role",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/adminuserrolemgmt/roles/adminroles.go", "AdminRoles"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_admin_roles.go"},
    {"name": "alerts", "group": "alerts",
     "create": "alert-subscription-resource-add-alert-subscription",
     "get": "alert-subscription-resource-get-alert-subscription",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/alerts/alerts.go", "AlertSubscriptions"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_alerts.go"},
    {"name": "atp_malicious_urls", "group": "advanced-threat-protection-policy",
     "update": "cyber-threat-protection-resource-update-malicious-urls",
     "get": "cyber-threat-protection-resource-get-malicious-urls",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go", "MaliciousURLs"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malicious_urls.go"},
    {"name": "atp_malware_inspection", "group": "malware-protection-policy",
     "update": "cyber-threat-protection-resource-update-atp-malware-inspection-config",
     "get": "cyber-threat-protection-resource-get-atp-malware-inspection-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "ATPMalwareInspection"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_inspection.go"},
    {"name": "atp_malware_policy", "group": "malware-protection-policy",
     "update": "cyber-threat-protection-resource-update-malware-policy-config",
     "get": "cyber-threat-protection-resource-get-malware-policy-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "MalwarePolicy"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_policy.go"},
    {"name": "atp_malware_protocols", "group": "malware-protection-policy",
     "update": "cyber-threat-protection-resource-update-atp-malware-protocols-config",
     "get": "cyber-threat-protection-resource-get-atp-malware-protocols-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "ATPMalwareProtocols"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_protocols.go"},
    {"name": "atp_malware_settings", "group": "malware-protection-policy",
     "get": "cyber-threat-protection-resource-get-malware-settings-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/malware_protection/malware_protection.go", "MalwareSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_malware_settings.go"},
    {"name": "atp_security_exceptions", "group": "advanced-threat-protection-policy",
     "update": "cyber-threat-protection-resource-update-security-exceptions",
     "get": "cyber-threat-protection-resource-get-security-exceptions",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go", "SecurityExceptions"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_atp_security_exceptions.go"},
    {"name": "auth_settings_urls", "group": "user-authentication-settings",
     "update": "update-auth-exempted-urls",
     "get": "get-auth-exempted-urls",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/user_authentication_settings/user_authentication_settings.go", "ExemptedUrls"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_auth_settings_urls.go"},
    {"name": "bandwidth_class", "group": "bandwidth-control-classes",
     "create": "bandwidth-class-resource-add-bandwidth-class",
     "get": "bandwidth-class-resource-get-bandwidth-class",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/bandwidth_control/bandwidth_classes/bandwidth_classes.go", "BandwidthClasses"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_bandwidth_classes.go"},
    {"name": "bandwidth_control_rule", "group": "bandwidth-control-classes",
     "create": "bandwidth-control-rule-resource-add-rule",
     "get": "bandwidth-control-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/bandwidth_control/bandwidth_control_rules/bandwidth_control_rules.go", "BandwidthControlRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_bandwidth_control_rules.go"},
    {"name": "casb_dlp_rule", "group": "saas-security-api",
     "create": "casb-dlp-rule-resource-add-rule",
     "get": "casb-dlp-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/casb_dlp_rules/casb_dlp_rules.go", "CasbDLPRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_casb_dlp_rules.go"},
    {"name": "casb_malware_rule", "group": "saas-security-api",
     "create": "casb-malware-rule-resource-add-rule",
     "get": "casb-malware-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/casb_malware_rules/casb_malware_rules.go", "CasbMalwareRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_casb_malware_rules.go"},
    {"name": "cloud_app_control_rule", "group": "cloud-app-control-policy",
     "create": "web-application-rule-resource-add-rule",
     "get": "web-application-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/cloudappcontrol/cloudappcontrol.go", "WebApplicationRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_cloud_app_control_rules.go"},
    {"name": "browser_control_policy", "group": "browser-control-policy",
     "update": "browser-control-settings-resource-update-config",
     "get": "browser-control-settings-resource-get-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/browser_control_settings/browser_control_settings.go", "BrowserControlSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go"},
    {"name": "custom_file_type", "group": "file-type-control-policy",
     "create": "custom-file-type-resource-create-custom-file-type",
     "get": "custom-file-type-resource-get-custom-file-type-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/filetypecontrol/custom_file_types/custom_file_types.go", "CustomFileTypes"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_custom_file_types.go"},
    {"name": "dc_exclusion", "group": "traffic-forwarding",
     "create": "tenant-dc-exclusion-resource-create-datacenter-exclusions",
     "get": "tenant-dc-exclusion-resource-get-datacenter-exclusions",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/dc_exclusions/dc_exclusions.go", "DCExclusions"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dc_exclusions.go"},
    {"name": "dlp_dictionary", "group": "data-loss-prevention",
     "create": "dlp-dictionary-resource-add-custom-dlp-dictionary",
     "get": "dlp-dictionary-resource-get-dlp-dictionary-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlpdictionaries/dlpdictionaries.go", "DlpDictionary"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dlp_dictionaries.go"},
    {"name": "dlp_engine", "group": "data-loss-prevention",
     "create": "dlp-engine-resource-add-custom-dlp-engine",
     "get": "dlp-engine-resource-get-dlp-engine-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_engines/dlp_engines.go", "DLPEngines"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dlp_engines.go"},
    {"name": "dlp_notification_template", "group": "data-loss-prevention",
     "create": "dlp-notification-template-resource-addtemplate",
     "get": "dlp-notification-template-resource-get-template-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_notification_templates/dlp_notification_templates.go", "DlpNotificationTemplates"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_dlp_notification_templates.go"},
    {"name": "end_user_notification", "group": "end-user-notifications",
     "update": "end-user-notification-resource-update-eun-details",
     "get": "end-user-notification-resource-get-eun-details",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/end_user_notification/end_user_notification.go", "UserNotificationSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_end_user_notification.go"},
    {"name": "extranet", "group": "traffic-forwarding",
     "create": "extranet-resource-add-extranet",
     "get": "extranet-resource-get-extranet-with-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/extranet/extranet.go", "Extranet"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_extranet.go"},
    {"name": "file_type_rule", "group": "file-type-control-policy",
     "create": "file-type-rule-resource-add-rule",
     "get": "file-type-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/filetypecontrol/filetypecontrol.go", "FileTypeRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_file_type_control_rules.go"},
    {"name": "firewall_dns_rule", "group": "dns-control-policy",
     "create": "firewall-dns-rules-resource-create-firewall-dns-rule",
     "get": "firewall-dns-rules-resource-get-firewall-dns-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go", "FirewallDNSRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go"},
    {"name": "firewall_filtering_rule", "group": "firewall-policies",
     "create": "firewall-filtering-rules-resource-create-firewall-filtering-rule",
     "get": "firewall-filtering-rules-resource-get-firewall-filtering-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/filteringrules/filteringrules.go", "FirewallFilteringRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go"},
    {"name": "firewall_ips_rule", "group": "ips-control-policy",
     "create": "firewall-ips-rules-resource-create-firewall-ips-rule",
     "get": "firewall-ips-rules-resource-get-firewall-ips-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_policies/ips_policies.go", "FirewallIPSRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_firewall_ips_rules.go"},
    {"name": "forwarding_rule", "group": "forwarding-control-policy",
     "create": "forwarding-rules-resource-create-forwarding-rule",
     "get": "forwarding-rules-resource-get-forwarding-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/forwarding_control_policy/forwarding_rules/forwarding_rules.go", "ForwardingRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_rule.go"},
    {"name": "ftp_control_policy", "group": "ftp-control-policy",
     "update": "ftp-settings-resource-update-ftp-settings",
     "get": "ftp-settings-resource-get-ftp-settings",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/ftp_control_policy/ftp_control_policy.go", "FTPControlPolicy"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_ftp_control_policy.go"},
    {"name": "gre_tunnel", "group": "traffic-forwarding",
     "create": "gre-tunnel-resource-add-gre-tunnel",
     "get": "gre-tunnel-resource-get-gre-tunel-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/gretunnels/gretunnels.go", "GreTunnels"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_gre_tunnels.go"},
    {"name": "ip_destination_group", "group": "firewall-policies",
     "create": "ip-destination-group-resource-add-destination-ip-group",
     "get": "ip-destination-group-resource-get-destination-ip-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipdestinationgroups/ipdestinationgroups.go", "IPDestinationGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_ip_destination_groups.go"},
    {"name": "ip_source_group", "group": "firewall-policies",
     "create": "ip-source-group-resource-add-source-ip-group",
     "get": "ip-source-group-resource-get-source-ip-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/ipsourcegroups/ipsourcegroups.go", "IPSourceGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_ip_source_groups.go"},
    {"name": "location", "group": "location-management",
     "create": "add-location",
     "get": "get-location",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/location/locationmanagement/locationmanagement.go", "Locations"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_location_management.go"},
    {"name": "network_application_group", "group": "firewall-policies",
     "create": "network-application-group-resource-create-network-application-group",
     "get": "network-application-group-resource-get-network-application-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkapplicationgroups/networkapplicationgroups.go", "NetworkApplicationGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_network_application_groups.go"},
    {"name": "network_service", "group": "firewall-policies",
     "create": "network-service-resource-add-custom-network-service",
     "get": "network-service-resource-get-network-service-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservices/networkservices.go", "NetworkServices"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_network_services.go"},
    {"name": "network_service_group", "group": "firewall-policies",
     "create": "network-service-group-resource-add-custom-network-service-group",
     "get": "network-service-group-resource-get-network-service-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/firewallpolicies/networkservicegroups/networkservicegroups.go", "NetworkServiceGroups"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_fw_filtering_network_services_groups.go"},
    {"name": "nat_control_rule", "group": "nat-control-policy",
     "create": "dnat-rule-resource-add-rule",
     "get": "dnat-rule-resource-update-rule",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/nat_control_policies/nat_control_policies.go", "NatControlPolicies"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_nat_control_rules.go"},
    {"name": "mobile_malware_protection_policy", "group": "mobile-malware-protection-policy",
     "update": "mobile-malware-protection-resource-update-mobile-malware-protection-config",
     "get": "mobile-malware-protection-resource-get-mobile-malware-protection-config",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/mobile_threat_settings/mobile_threat_settings.go", "MobileAdvanceThreatSettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_mobile_malware_protection_policy.go"},
    {"name": "nss_server", "group": "cloud-nanolog-streaming-service-nss",
     "create": "nss-resource-add-nss-server",
     "get": "nss-resource-get-nss-server",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/cloudnss/nss_servers/nss_servers.go", "NSSServers"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_nss_server.go"},
    {"name": "proxy", "group": "forwarding-control-policy",
     "create": "proxy-resource-add-proxy",
     "get": "proxy-resource-get-proxy-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/forwarding_control_policy/proxies/proxies.go", "Proxies"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_proxies.go"},
    {"name": "risk_profile", "group": "cloud-applications",
     "create": "cloud-application-risk-profile-resource-add-risk-profile",
     "get": "cloud-application-risk-profile-resource-get-risk-profile-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/cloudapplications/risk_profiles/risk_profiles.go", "RiskProfiles"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_risk_profiles.go"},
    {"name": "rule_label", "group": "rule-labels",
     "create": "rule-label-resource-add-rule-label",
     "get": "rule-label-resource-get-rule-label-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/rule_labels/rule_labels.go", "RuleLabels"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_rule_labels.go"},
    {"name": "sandbox_rule", "group": "sandbox-policy-settings",
     "create": "ba-rule-resource-add-rule",
     "get": "ba-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_rules/sandbox_rules.go", "SandboxRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_sandbox_rules.go"},
    {"name": "security_policy_settings", "group": "security-policy-settings",
     "update": "create-whitelist",
     "extra_updates": ["manage-blacklist"],
     "get": "get-config",
     "extra_gets": ["get-advanced-policy"],
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/security_policy_settings/security_policy_settings.go", "ListUrls"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_security_policy_settings.go"},
    {"name": "ssl_inspection_rule", "group": "ssl-inspection-policy",
     "create": "ssl-inspection-rule-resource-add-ssl-inspection-rule",
     "get": "ssl-inspection-rule-resource-get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/sslinspection/sslinspection.go", "SSLInspectionRules"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_ssl_inspection_rules.go"},
    {"name": "static_ip", "group": "traffic-forwarding",
     "create": "static-ip-resource-add-static-ip",
     "get": "static-ip-resource-get-static-ip-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/staticips/staticips.go", "StaticIP"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_static_ips.go"},
    {"name": "url_category", "group": "url-categories",
     "create": "add-custom-category",
     "get": "get-url-categories",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/urlcategories/urlcategories.go", "URLCategory"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_url_categories.go"},
    {"name": "url_filtering_and_cloud_app_settings", "group": "url-cloud-app-control-policy-settings",
     "update": "advanced-url-filtering-cloud-app-resource-update-advanced-url-filt-options",
     "get": "advanced-url-filtering-cloud-app-resource-get-advanced-url-filt-options",
     "compare_required": False,
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go", "URLAdvancedPolicySettings"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_and_cloud_app_settings.go"},
    {"name": "user", "group": "user-management",
     "create": "add-user",
     "get": "get-user",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/usermanagement/users/users.go", "Users"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_user_management_users.go"},
    {"name": "url_filtering_rule", "group": "url-filtering-policy",
     "create": "add-rule",
     "get": "get-rule-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/urlfilteringpolicies/urlfilteringpolicies.go", "URLFilteringRule"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go"},
    {"name": "vpn_credential", "group": "traffic-forwarding",
     "create": "add-vpn-credential",
     "get": "get-vpn-credential",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/trafficforwarding/vpncredentials/vpncredentials.go", "VPNCredentials"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_traffic_forwarding_vpn_credentials.go"},
    {"name": "workload_group", "group": "workload-groups",
     "create": "workload-group-resource-add-workload-group",
     "get": "workload-group-resource-get-workload-group-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go", "WorkloadGroup"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_workload_groups.go"},
    {"name": "zpa_gateway", "group": "forwarding-control-policy",
     "create": "zpa-gateway-resource-add-zpa-gateway",
     "get": "zpa-gateway-resource-get-zpa-gateway-by-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zia/services/forwarding_control_policy/zpa_gateways/zpa_gateways.go", "ZPAGateways"),
     "tf": "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_zpa_gateway.go"},
]

ZIA_CONTRACT_ONLY_GROUPS = [
    "api-authentication",
    "authentication-settings",
    "event-logs",
    "intermediate-ca-certificates",
    "iot-report",
    "organization-details",
    "pac-files",
    "policy-export",
    "remote-assistance-support",
    "service-edges",
    "shadow-it-report",
    "system-audit-report",
    "time",
    "time-intervals",
]

PRODUCTS = {
    "zpa": {
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json",
        "resources": ZPA_RESOURCES,
    },
    "zia": {
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        "resources": ZIA_RESOURCES,
        "contract_only_groups": ZIA_CONTRACT_ONLY_GROUPS,
    },
}


def _read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def _contract_ops(res, contracts, product):
    read_slugs = [res["get"], *res.get("extra_gets", [])]
    write_slugs = [x for x in (res.get("create"), res.get("update"), *res.get("extra_updates", [])) if x]
    op_keys = [(slug, f"{product}/{res['group']}/{slug}") for slug in read_slugs + write_slugs]
    missing = [key for _, key in op_keys if key not in contracts]
    if missing:
        raise KeyError(f"missing contract operation(s) for {res['name']}: {', '.join(missing)}")
    reads = [contracts[f"{product}/{res['group']}/{slug}"] for slug in read_slugs]
    writes = [contracts[f"{product}/{res['group']}/{slug}"] for slug in write_slugs]
    return reads, writes


def reconcile_one(res, contracts, product="zpa"):
    reads, writes = _contract_ops(res, contracts, product)
    operation = writes[0] if writes else reads[0]
    # field universe = response schema (fullest); required comes from create bodies
    # only. Update-only singletons often reuse PUT/POST request bodies with product
    # semantics that are not creation requirements, so they opt out via
    # compare_required=False and still get type/presence/readonly/enum coverage.
    cfields = {}
    for op in [*reads, *writes]:
        for f in op.get("response_schema") or []:
            cfields.setdefault(f["name"], dict(f))
    creq = {}
    if res.get("compare_required", True) and res.get("create"):
        create_op = contracts[f"{product}/{res['group']}/{res['create']}"]
        creq = {f["name"]: f for f in create_op.get("request_body", [])}
        for name, f in creq.items():
            cfields.setdefault(name, dict(f))
    required_names = {n for n, f in creq.items() if f["required"]}

    go_path, struct = res["go"]
    go = extract_go_struct_fields(_read(go_path), struct)
    tf = extract_tf_schema_fields(_read(res["tf"]))

    # Case-insensitive TF lookup recovers the acronym casing the snake->camel alias
    # loses (extranet_dto -> extranetDto vs the contract's extranetDTO). Go json tags
    # are the wire names, so Go is matched exactly — a Go casing mismatch is a real
    # divergence we want to keep surfacing.
    tf_ci = {}
    for k, v in tf.items():
        tf_ci.setdefault(k.lower(), v)

    def tf_get(name):
        return tf.get(name) or tf_ci.get(name.lower())

    cset, goset = set(cfields), set(go)
    matched_tf = {name for name in cset if tf_get(name)}
    rep = {
        "resource": res["name"],
        "method": operation.get("method"),
        "path": operation.get("path"),
        "counts": {"contract": len(cset), "go": len(goset), "tf": len(tf)},
        "presence": {
            "contract_only_vs_go": sorted(cset - goset),
            "go_only_vs_contract": sorted(goset - cset),
            # contract fields not matched to a TF key by conservative naming — this is
            # "unmatched", NOT proof of absence (a helper schema or an unmapped alias).
            "contract_unmatched_in_tf": sorted(cset - matched_tf),
        },
        "type_drift": [],
        "required_drift": [],
        "readonly": [],
        "enum": {"match": [], "value_conflict": [], "one_sided": []},
    }

    for name in sorted(cset & goset):
        cc = contract_category(cfields[name].get("type"))
        gc = go[name]["category"]
        if cc and cc != gc and {cc, gc} <= {"number", "string", "boolean"}:
            rep["type_drift"].append({"field": name, "contract": cfields[name]["type"], "go": go[name]["go_type"]})

    # required / readonly / enum: only where the matched TF key is an inline block, so
    # its flags are actually readable. Helper-valued keys are present but their flags
    # are unresolved -> we never claim a divergence we cannot see.
    for name in sorted(matched_tf):
        tff = tf_get(name)
        if not tff["inline"]:
            continue
        creq_flag = name in required_names
        if creq_flag != tff["required"]:
            rep["required_drift"].append({
                "field": name, "contract_required": creq_flag, "tf_required": tff["required"],
                "direction": "tf_stricter" if tff["required"] and not creq_flag else "contract_stricter",
            })

    # readonly NARROWED: only fields the contract marks readonly; report TF treatment
    for name in sorted(matched_tf):
        tff = tf_get(name)
        if cfields[name].get("readonly") and tff["inline"]:
            rep["readonly"].append({"field": name, "tf_computed": tff["computed"],
                                    "agree": tff["computed"]})

    for name in sorted(matched_tf):
        tff = tf_get(name)
        if not tff["inline"]:
            continue
        ce, te = cfields[name].get("enum"), tff["enum"]
        if not ce and not te:
            continue
        if ce and te:
            (rep["enum"]["match"] if set(ce) == set(te) else rep["enum"]["value_conflict"]).append(
                name if set(ce) == set(te) else {"field": name, "contract": ce, "tf": te})
        else:
            rep["enum"]["one_sided"].append({"field": name, "contract": ce, "tf": te})
    return rep


def build_report(contracts, product="zpa"):
    resources = PRODUCTS[product]["resources"]
    reports = [reconcile_one(r, contracts, product) for r in resources]
    totals = {
        "type_drift": sum(len(r["type_drift"]) for r in reports),
        "required_drift": sum(len(r["required_drift"]) for r in reports),
        "enum_match": sum(len(r["enum"]["match"]) for r in reports),
        "enum_value_conflict": sum(len(r["enum"]["value_conflict"]) for r in reports),
        "enum_one_sided": sum(len(r["enum"]["one_sided"]) for r in reports),
        "readonly_fields": sum(len(r["readonly"]) for r in reports),
        "readonly_disagree": sum(1 for r in reports for x in r["readonly"] if not x["agree"]),
    }
    report = {
        "product": product,
        "contract_json": PRODUCTS[product]["contract_json"],
        "resources": reports,
        "totals": totals,
    }
    if PRODUCTS[product].get("contract_only_groups"):
        report["contract_only_groups"] = PRODUCTS[product]["contract_only_groups"]
    return report


# ---- markdown rendering ----------------------------------------------------

def render_markdown(report):
    t = report["totals"]
    product = report["product"]
    product_upper = product.upper()
    out = []
    out.append("---")
    out.append(f'title: "DAV-21 automate.zscaler.com contract reconciliation — {product_upper}"')
    out.append("status: generated")
    out.append('generator: "scripts/automate-capture/reconcile_contract.py"')
    out.append("---\n")
    out.append(f"# automate.zscaler.com contract vs Go SDK / Terraform — {product_upper}\n")
    out.append("> Generated by `scripts/automate-capture/reconcile_contract.py`. Do not edit by hand; "
               "re-run after re-capturing the contract or bumping the vendor submodules.\n")
    out.append("Diffs the rendered per-operation contract "
               f"(`{report['contract_json']}`) against the Go SDK struct and the Terraform provider schema "
               "for each resource.\n")
    out.append("## Totals\n")
    out.append(f"- Type drift (contract numeric vs Go string): **{t['type_drift']}**")
    out.append(f"- Required drift (contract vs TF): **{t['required_drift']}**")
    out.append(f"- Enum: **{t['enum_match']}** match / **{t['enum_value_conflict']}** value-conflict / "
               f"**{t['enum_one_sided']}** one-sided")
    out.append(f"- Contract readonly fields checked: **{t['readonly_fields']}** "
               f"(TF disagreement: {t['readonly_disagree']})\n")
    if report.get("contract_only_groups"):
        out.append("## Contract Groups Outside Terraform Scope\n")
        out.append("Captured contract groups with no Terraform resource mapping in this report:\n")
        for group in report["contract_only_groups"]:
            out.append(f"- `{group}`")
        out.append("")
    for r in report["resources"]:
        out.append(f"## {r['resource']}\n")
        out.append(f"`{r['method']} {r['path']}` — "
                   f"contract {r['counts']['contract']} / Go {r['counts']['go']} / TF {r['counts']['tf']} fields\n")
        if r["type_drift"]:
            out.append("**Type drift** — contract says numeric, Go SDK declares string "
                       "(the API serializes these as JSON strings):\n")
            for d in r["type_drift"]:
                out.append(f"- `{d['field']}`: contract `{d['contract']}` vs Go `{d['go']}`")
            out.append("")
        if r["required_drift"]:
            out.append("**Required drift:**\n")
            for d in r["required_drift"]:
                note = "TF stricter than API" if d["direction"] == "tf_stricter" else "contract stricter than TF"
                out.append(f"- `{d['field']}`: contract required={d['contract_required']}, "
                           f"TF required={d['tf_required']} ({note})")
            out.append("")
        if r["enum"]["value_conflict"]:
            out.append("**Enum value conflicts:**\n")
            for d in r["enum"]["value_conflict"]:
                out.append(f"- `{d['field']}`: contract {d['contract']} vs TF {d['tf']}")
            out.append("")
        if r["presence"]["contract_only_vs_go"]:
            out.append(f"**Contract fields absent from the Go SDK struct:** "
                       f"{', '.join('`%s`' % x for x in r['presence']['contract_only_vs_go'])}\n")
        if r["presence"]["go_only_vs_contract"]:
            out.append(f"**Go SDK fields absent from the contract:** "
                       f"{', '.join('`%s`' % x for x in r['presence']['go_only_vs_contract'])}\n")
    out.append("## Scope\n")
    out.append("Reconciles the contract against the Go SDK and Terraform provider (the sources that carry "
               "type, required, readonly, and enum signal). Python SDK and Postman cross-checks are a "
               "documented next step. Field matching is conservative: exact names, with TF snake_case→camelCase "
               "derived from the TF key; unmatched fields are reported as presence differences, never guessed.\n")
    return "\n".join(out)


def main():
    out_dir = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler")
    for product, cfg in PRODUCTS.items():
        contracts = json.load(open(os.path.join(ROOT, cfg["contract_json"]), encoding="utf-8"))
        report = build_report(contracts, product)
        json_out = os.path.join(out_dir, f"{product}-divergences.json")
        md_out = os.path.join(out_dir, f"{product}-divergences.md")
        with open(json_out, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
            f.write("\n")
        with open(md_out, "w", encoding="utf-8") as f:
            # exactly one trailing newline (sections already embed their own blank lines)
            f.write(render_markdown(report).rstrip("\n") + "\n")
        t = report["totals"]
        print(f"reconciled {product}: {len(report['resources'])} resources")
        print(f"  type_drift={t['type_drift']} required_drift={t['required_drift']} "
              f"enum(match/conflict/one-sided)={t['enum_match']}/{t['enum_value_conflict']}/{t['enum_one_sided']} "
              f"readonly={t['readonly_fields']}(disagree {t['readonly_disagree']})")
        print(f"  -> {json_out}")
        print(f"  -> {md_out}")


if __name__ == "__main__":
    main()
