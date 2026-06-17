#!/usr/bin/env python3
"""Build DAV-23 cross-surface synthesis artifacts from DAV-21 reports.

This is intentionally a pure synthesis layer: it reads the committed
<product>-divergences.json files plus their committed contract_json inputs, then
emits a unified field table and an issue-routing worklist. It does not capture
pages, read SDK/provider source, or change the reconciler.
"""

from __future__ import annotations

import json
import os
from collections import defaultdict
from pathlib import Path

from reconcile_contract import (  # reuse the registry only; no source extraction runs
    PRODUCTS as RECONCILE_PRODUCTS,
    _contract_ops,
    _generic_response_placeholder,
)

ROOT = Path(os.environ.get("REPO_ROOT", "."))
SPEC_DIR = ROOT / "vendor/zscaler-api-specs/automate-zscaler"
RECONCILED_PRODUCTS = ("zpa", "zia", "zcc", "zcloudconnector")
THIN_PRODUCTS = {
    "bi": "Business Insights",
    "easm": "EASM",
    "zcell": "Zscaler Cellular",
    "zdx": "ZDX",
    "zid": "Zidentity",
}
SURFACES = ("contract", "go", "python", "tf", "ansible", "mcp")
MARKER_ORDER = ("req", "enum≠", "enum1", "ro", "ro!", "type")
CONTRACT_REPO = "automate.zscaler.com docs"
MANUAL_REVIEW_REPO = "manual-review"

LEGEND = {
    "✓": "field present on the surface",
    "—": "field absent or no mapped field surface",
    "req": "required-flag drift against the contract",
    "enum≠": "enum value conflict",
    "enum1": "one-sided enum constraint",
    "ro": "readonly/computed treatment recorded",
    "ro!": "readonly/computed treatment disagrees",
    "type": "contract-vs-Go primitive type drift",
}


def _read_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def _write_json(path: Path, data: dict) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, sort_keys=True)
        f.write("\n")


def _sorted_dict(dct: dict) -> dict:
    return {k: dct[k] for k in sorted(dct)}


def _repo_name(repo: str | None) -> str | None:
    if not repo:
        return None
    if repo.startswith("zscaler/"):
        return repo
    if repo in {"ziacloud-ansible", "zpacloud-ansible", "zscaler-mcp-server", "zscaler-sdk-python"}:
        return f"zscaler/{repo}"
    return repo


def repo_for_surface(product: str, surface: str, block: dict | None = None) -> str:
    if surface == "contract":
        return CONTRACT_REPO
    if surface == "go":
        return "zscaler/zscaler-sdk-go"
    if surface == "python":
        return _repo_name((block or {}).get("repo")) or "zscaler/zscaler-sdk-python"
    if surface == "tf":
        if product == "zcloudconnector":
            return "zscaler/terraform-provider-ztc"
        return f"zscaler/terraform-provider-{product}"
    if surface == "ansible":
        return _repo_name((block or {}).get("repo")) or "zscaler/ansible"
    if surface == "mcp":
        return _repo_name((block or {}).get("repo")) or "zscaler/zscaler-mcp-server"
    raise ValueError(f"unknown surface: {surface}")


def load_reports(spec_dir: Path = SPEC_DIR) -> dict[str, dict]:
    return {
        product: _read_json(spec_dir / f"{product}-divergences.json")
        for product in RECONCILED_PRODUCTS
    }


def _contract_field_from_schema(field: dict) -> dict:
    rec = {
        "name": field["name"],
        "type": field.get("type"),
        "required": bool(field.get("required")),
        "readonly": bool(field.get("readonly")),
        "enum": field.get("enum"),
    }
    if field.get("description"):
        rec["description"] = field["description"]
    return rec


def contract_fields_for_resource(product: str, resource: dict, contracts: dict) -> dict[str, dict]:
    """Return the same contract field universe reconcile_one uses.

    The DAV-21 divergence report intentionally stores deltas, not every matched
    field. The committed contract JSON plus reconciler registry are therefore the
    source for complete contract rows such as application_segment.segmentGroupId.
    """
    registry = {
        item["name"]: item
        for item in RECONCILE_PRODUCTS.get(product, {}).get("resources", [])
    }
    cfg = registry.get(resource["resource"])
    fields: dict[str, dict] = {}
    if cfg:
        reads, writes = _contract_ops(cfg, contracts, product)
        for op in [*reads, *writes]:
            for field in op.get("response_schema") or []:
                if field.get("name") and not _generic_response_placeholder(field):
                    fields.setdefault(field["name"], _contract_field_from_schema(field))
        if cfg.get("compare_required", True) and cfg.get("create"):
            create_op = writes[0] if writes else None
            for field in (create_op or {}).get("request_body") or []:
                if field.get("name"):
                    fields.setdefault(field["name"], _contract_field_from_schema(field))
        return fields

    # Fallback for future reports if a resource has not yet been added to the
    # local registry: use the operation pinned in the divergence report.
    for op in contracts.values():
        if op.get("method") == resource.get("method") and op.get("path") == resource.get("path"):
            for section in ("response_schema", "request_body"):
                for field in op.get(section) or []:
                    if field.get("name") and not _generic_response_placeholder(field):
                        fields.setdefault(field["name"], _contract_field_from_schema(field))
            return fields
    return fields


def load_contract_fields(reports: dict[str, dict]) -> dict[tuple[str, str], dict[str, dict]]:
    fields = {}
    for product, report in reports.items():
        contracts = _read_json(ROOT / report["contract_json"])
        for resource in report["resources"]:
            fields[(product, resource["resource"])] = contract_fields_for_resource(product, resource, contracts)
    return fields


def _fields_from_items(items: list) -> set[str]:
    fields = set()
    for item in items:
        if isinstance(item, str):
            fields.add(item)
        elif isinstance(item, dict) and item.get("field"):
            fields.add(item["field"])
    return fields


def _enum_fields(enum_block: dict | None) -> set[str]:
    if not enum_block:
        return set()
    return (
        _fields_from_items(enum_block.get("match", []))
        | _fields_from_items(enum_block.get("value_conflict", []))
        | _fields_from_items(enum_block.get("one_sided", []))
    )


def field_universe(resource: dict, contract_fields: dict[str, dict]) -> list[str]:
    fields = set(contract_fields)
    fields |= _fields_from_items(resource.get("type_drift", []))
    fields |= _fields_from_items(resource.get("required_drift", []))
    fields |= _fields_from_items(resource.get("readonly", []))
    fields |= _enum_fields(resource.get("enum"))
    for values in resource.get("presence", {}).values():
        fields |= set(values)
    for surface in ("python", "ansible", "mcp"):
        block = resource.get(surface) or {}
        for values in block.get("presence", {}).values():
            fields |= set(values)
        fields |= _fields_from_items(block.get("required_drift", []))
        fields |= _enum_fields(block.get("enum"))
    return sorted(fields)


def _cell(present: bool = False) -> dict:
    return {"present": present, "markers": [], "cell": "✓" if present else "—"}


def _add_marker(cells: dict, surface: str, marker: str) -> None:
    cell = cells[surface]
    if cell["present"] and marker not in cell["markers"]:
        cell["markers"].append(marker)


def _finalize_cell(cell: dict) -> dict:
    markers = [m for m in MARKER_ORDER if m in cell["markers"]]
    text = "—" if not cell["present"] else " ".join(["✓", *markers])
    return {"present": cell["present"], "markers": markers, "cell": text}


def _surface_present(resource: dict, surface: str, field: str, contract_present: bool) -> bool:
    if surface == "contract":
        return contract_present
    if surface == "go":
        presence = resource.get("presence", {})
        return (
            field in presence.get("go_only_vs_contract", [])
            or contract_present and field not in presence.get("contract_only_vs_go", [])
            or field in _fields_from_items(resource.get("type_drift", []))
        )
    if surface == "tf":
        presence = resource.get("presence", {})
        drift_fields = (
            _fields_from_items(resource.get("required_drift", []))
            | _fields_from_items(resource.get("readonly", []))
            | _enum_fields(resource.get("enum"))
        )
        return (
            field in drift_fields
            or contract_present and field not in presence.get("contract_unmatched_in_tf", [])
        )
    block = resource.get(surface) or {}
    if block.get("surface") != "present":
        return False
    if surface == "mcp" and block.get("field_surface") != "present":
        return field in block.get("presence", {}).get("mcp_only_vs_contract", [])
    presence = block.get("presence", {})
    return (
        field in presence.get(f"{surface}_only_vs_contract", [])
        or contract_present and field not in presence.get(f"contract_unmatched_in_{surface}", [])
        or field in _fields_from_items(block.get("required_drift", []))
        or field in _enum_fields(block.get("enum"))
    )


def cells_for_field(resource: dict, field: str, contract_fields: dict[str, dict]) -> dict[str, dict]:
    contract_present = field in contract_fields
    cells = {
        surface: _cell(_surface_present(resource, surface, field, contract_present))
        for surface in SURFACES
    }

    if field in _fields_from_items(resource.get("type_drift", [])):
        _add_marker(cells, "go", "type")
    if field in _fields_from_items(resource.get("required_drift", [])):
        _add_marker(cells, "tf", "req")
    for item in resource.get("readonly", []):
        if item.get("field") == field:
            _add_marker(cells, "contract", "ro")
            _add_marker(cells, "tf", "ro" if item.get("agree") else "ro!")
    if field in _fields_from_items(resource.get("enum", {}).get("value_conflict", [])):
        _add_marker(cells, "tf", "enum≠")
    if field in _fields_from_items(resource.get("enum", {}).get("one_sided", [])):
        _add_marker(cells, "tf", "enum1")

    for surface in ("ansible",):
        block = resource.get(surface) or {}
        if field in _fields_from_items(block.get("required_drift", [])):
            _add_marker(cells, surface, "req")
        if field in _fields_from_items(block.get("enum", {}).get("value_conflict", [])):
            _add_marker(cells, surface, "enum≠")
        if field in _fields_from_items(block.get("enum", {}).get("one_sided", [])):
            _add_marker(cells, surface, "enum1")

    return {surface: _finalize_cell(cells[surface]) for surface in SURFACES}


def build_rosetta(reports: dict[str, dict], contract_fields: dict[tuple[str, str], dict[str, dict]]) -> dict:
    rows = []
    for product in sorted(reports):
        report = reports[product]
        for resource in sorted(report["resources"], key=lambda item: item["resource"]):
            cfields = contract_fields.get((product, resource["resource"]), {})
            for field in field_universe(resource, cfields):
                cells = cells_for_field(resource, field, cfields)
                row = {
                    "product": product,
                    "resource": resource["resource"],
                    "field": field,
                    "method": resource.get("method"),
                    "path": resource.get("path"),
                    "cells": cells,
                    "columns": {surface: cells[surface]["cell"] for surface in SURFACES},
                }
                if cfields.get(field, {}).get("description"):
                    row["description"] = cfields[field]["description"]
                rows.append(row)
    return {
        "generator": "scripts/automate-capture/rosetta.py",
        "legend": LEGEND,
        "surfaces": list(SURFACES),
        "boundaries": build_boundaries(reports),
        "summary": {
            "products": len(reports),
            "resources": sum(len(report["resources"]) for report in reports.values()),
            "rows": len(rows),
        },
        "rows": rows,
    }


def build_boundaries(reports: dict[str, dict]) -> dict:
    contract_only = []
    for product, display in sorted(THIN_PRODUCTS.items()):
        path = SPEC_DIR / f"{product}-api-reference.json"
        operations = len(_read_json(path)) if path.exists() else 0
        contract_only.append({
            "product": product,
            "display": display,
            "contract_json": str(path.relative_to(ROOT)),
            "operations": operations,
            "reason": "Contract captured, but DAV-21 did not establish a multi-surface reconciliation footprint.",
        })
    return {
        "reconciled_products": sorted(reports),
        "contract_only_products": contract_only,
        "postman": {
            "status": "reference-only",
            "reason": "Postman is example-shaped reference data, not a constraint-bearing reconciliation leg.",
        },
    }


def _surface_block(resource: dict, surface: str) -> dict:
    return resource if surface in {"go", "tf", "contract"} else resource.get(surface, {})


def _surface_evidence(product: str, resource: dict, surface: str) -> dict:
    block = _surface_block(resource, surface)
    evidence = {
        "method": resource.get("method"),
        "path": resource.get("path"),
        "source_repo": repo_for_surface(product, surface, block),
    }
    if surface == "tf":
        evidence["repo"] = repo_for_surface(product, "tf")
    elif isinstance(block, dict):
        for key in ("path", "paths", "sdk_calls", "methods", "tools"):
            if block.get(key):
                evidence[key] = block[key]
    return evidence


def _contract_evidence(resource: dict) -> dict:
    return {"method": resource.get("method"), "path": resource.get("path")}


def _confidence_for_contract_gap(surface: str, readonly: bool) -> str:
    if surface == "mcp" or readonly:
        return "LOW"
    return "MEDIUM"


def _enum_target(product: str, surface: str, item: dict, block: dict | None = None) -> tuple[str, str, str]:
    contract_values = set(item.get("contract") or [])
    surface_values = set(item.get(surface) or [])
    if surface_values and surface_values < contract_values:
        return (
            repo_for_surface(product, surface, block),
            "client enum is a strict subset of the contract; update the client constraint or document why it lags.",
            "HIGH",
        )
    if contract_values and contract_values < surface_values:
        return (
            CONTRACT_REPO,
            "surface enum contains values the contract omits; ask vendor docs/support to clarify the valid values.",
            "HIGH",
        )
    return (
        MANUAL_REVIEW_REPO,
        "enum sets differ without a strict subset direction; manually decide whether docs or client should change.",
        "MEDIUM",
    )


def _append_row(rows: list[dict], **kwargs) -> None:
    evidence = kwargs.pop("evidence", {})
    rows.append({
        "product": kwargs.pop("product"),
        "resource": kwargs.pop("resource"),
        "field": kwargs.pop("field"),
        "divergence_type": kwargs.pop("divergence_type"),
        "direction": kwargs.pop("direction"),
        "target_repo": kwargs.pop("target_repo"),
        "suggested_action": kwargs.pop("suggested_action"),
        "confidence": kwargs.pop("confidence"),
        "source_surface": kwargs.pop("source_surface", None),
        "source_repo": kwargs.pop("source_repo", None),
        "evidence": _sorted_dict(evidence),
    })


def route_presence_only(
    product: str,
    resource: dict,
    contract_fields: dict[str, dict],
    rows: list[dict],
) -> None:
    # Client-only fields are grouped per field so cross-surface corroboration can
    # raise confidence instead of creating duplicate docs tickets.
    client_only: dict[str, list[str]] = defaultdict(list)
    for field in resource.get("presence", {}).get("go_only_vs_contract", []):
        client_only[field].append("go")
    for surface in ("python", "ansible", "mcp"):
        block = resource.get(surface) or {}
        for field in block.get("presence", {}).get(f"{surface}_only_vs_contract", []):
            client_only[field].append(surface)

    for field, surfaces in sorted(client_only.items()):
        evidence = {
            "surfaces": sorted(surfaces),
            "contract": _contract_evidence(resource),
            "surface_evidence": {
                surface: _surface_evidence(product, resource, surface)
                for surface in sorted(surfaces)
            },
        }
        _append_row(
            rows,
            product=product,
            resource=resource["resource"],
            field=field,
            divergence_type="surface_only_vs_contract",
            direction="docs_likely_stale",
            target_repo=CONTRACT_REPO,
            suggested_action="Ask vendor support/docs to confirm whether the contract should include this field.",
            confidence="HIGH" if len(surfaces) >= 2 else "MEDIUM",
            source_surface=",".join(sorted(surfaces)),
            source_repo=",".join(
                sorted({repo_for_surface(product, surface, resource.get(surface, {})) for surface in surfaces})
            ),
            evidence=evidence,
        )

    contract_gaps = [
        ("go", resource.get("presence", {}).get("contract_only_vs_go", [])),
        ("tf", resource.get("presence", {}).get("contract_unmatched_in_tf", [])),
    ]
    for surface in ("python", "ansible", "mcp"):
        block = resource.get(surface) or {}
        contract_gaps.append((surface, block.get("presence", {}).get(f"contract_unmatched_in_{surface}", [])))

    for surface, fields in contract_gaps:
        for field in sorted(fields):
            readonly = bool(contract_fields.get(field, {}).get("readonly"))
            block = resource.get(surface, {}) if surface not in {"go", "tf"} else {}
            _append_row(
                rows,
                product=product,
                resource=resource["resource"],
                field=field,
                divergence_type=f"contract_unmatched_in_{surface}",
                direction="client_missing_documented_field",
                target_repo=repo_for_surface(product, surface, block),
                suggested_action="Add client support or document why this contract field is intentionally omitted.",
                confidence=_confidence_for_contract_gap(surface, readonly),
                source_surface=surface,
                source_repo=repo_for_surface(product, surface, block),
                evidence={
                    "readonly": readonly,
                    "contract": _contract_evidence(resource),
                    "surface": _surface_evidence(product, resource, surface),
                },
            )


def route_required(product: str, resource: dict, rows: list[dict]) -> None:
    for item in resource.get("required_drift", []):
        _append_row(
            rows,
            product=product,
            resource=resource["resource"],
            field=item["field"],
            divergence_type="required_drift",
            direction=item["direction"],
            target_repo=repo_for_surface(product, "tf"),
            suggested_action="Align Terraform required handling with the contract or document conditional requirements.",
            confidence="MEDIUM",
            source_surface="tf",
            source_repo=repo_for_surface(product, "tf"),
            evidence={"drift": item, "surface": _surface_evidence(product, resource, "tf")},
        )
    ansible = resource.get("ansible") or {}
    for item in ansible.get("required_drift", []):
        repo = repo_for_surface(product, "ansible", ansible)
        _append_row(
            rows,
            product=product,
            resource=resource["resource"],
            field=item["field"],
            divergence_type="ansible_required_drift",
            direction=item["direction"],
            target_repo=repo,
            suggested_action="Align Ansible required handling with the contract or document conditional requirements.",
            confidence="MEDIUM",
            source_surface="ansible",
            source_repo=repo,
            evidence={"drift": item, "surface": _surface_evidence(product, resource, "ansible")},
        )


def route_enums(product: str, resource: dict, rows: list[dict]) -> None:
    for surface in ("tf", "ansible"):
        block = resource.get(surface) if surface == "ansible" else {}
        enum_block = resource.get("enum") if surface == "tf" else (block or {}).get("enum", {})
        for item in enum_block.get("value_conflict", []):
            target_repo, suggested_action, confidence = _enum_target(product, surface, item, block)
            source_repo = repo_for_surface(product, surface, block)
            _append_row(
                rows,
                product=product,
                resource=resource["resource"],
                field=item["field"],
                divergence_type=f"{surface}_enum_value_conflict",
                direction="value_conflict",
                target_repo=target_repo,
                suggested_action=suggested_action,
                confidence=confidence,
                source_surface=surface,
                source_repo=source_repo,
                evidence={
                    "contract_values": item.get("contract") or [],
                    f"{surface}_values": item.get(surface) or [],
                    "surface": _surface_evidence(product, resource, surface),
                },
            )


def route_type_drift(product: str, resource: dict, rows: list[dict]) -> None:
    for item in resource.get("type_drift", []):
        _append_row(
            rows,
            product=product,
            resource=resource["resource"],
            field=item["field"],
            divergence_type="type_drift",
            direction="contract_vs_go_type",
            target_repo=repo_for_surface(product, "go"),
            suggested_action="Review whether Go SDK serialization type should be clarified or changed.",
            confidence="LOW",
            source_surface="go",
            source_repo=repo_for_surface(product, "go"),
            evidence={"drift": item, "surface": _surface_evidence(product, resource, "go")},
        )


def route_readonly(product: str, resource: dict, rows: list[dict]) -> None:
    for item in resource.get("readonly", []):
        if item.get("agree"):
            continue
        _append_row(
            rows,
            product=product,
            resource=resource["resource"],
            field=item["field"],
            divergence_type="readonly_drift",
            direction="tf_readonly_disagree",
            target_repo=repo_for_surface(product, "tf"),
            suggested_action="Align Terraform computed treatment with the contract readonly field.",
            confidence="MEDIUM",
            source_surface="tf",
            source_repo=repo_for_surface(product, "tf"),
            evidence={"drift": item, "surface": _surface_evidence(product, resource, "tf")},
        )


def build_issue_routing(
    reports: dict[str, dict],
    contract_fields: dict[tuple[str, str], dict[str, dict]],
) -> dict:
    rows = []
    for product in sorted(reports):
        for resource in sorted(reports[product]["resources"], key=lambda item: item["resource"]):
            cfields = contract_fields.get((product, resource["resource"]), {})
            route_presence_only(product, resource, cfields, rows)
            route_required(product, resource, rows)
            route_enums(product, resource, rows)
            route_type_drift(product, resource, rows)
            route_readonly(product, resource, rows)
    rows.sort(key=lambda item: (
        item["target_repo"],
        item["product"],
        item["resource"],
        item["field"],
        item["divergence_type"],
    ))
    by_repo = defaultdict(int)
    for row in rows:
        by_repo[row["target_repo"]] += 1
    return {
        "generator": "scripts/automate-capture/rosetta.py",
        "summary": {
            "rows": len(rows),
            "target_repos": _sorted_dict(dict(by_repo)),
        },
        "boundaries": build_boundaries(reports),
        "rows": rows,
    }


def _md_escape(value: object) -> str:
    text = str(value if value is not None else "")
    return text.replace("|", "\\|").replace("\n", " ")


def _md_cell(row: dict, surface: str) -> str:
    cell = row["cells"][surface]["cell"]
    if surface != "contract" and cell != "✓":
        return f"**{_md_escape(cell)}**"
    if surface == "contract" and cell == "—":
        return f"**{_md_escape(cell)}**"
    return _md_escape(cell)


def render_rosetta_markdown(rosetta: dict) -> str:
    out = [
        "---",
        'title: "DAV-23 rosetta stone — automate.zscaler.com cross-surface synthesis"',
        "status: generated",
        'generator: "scripts/automate-capture/rosetta.py"',
        "---",
        "",
        "# DAV-23 rosetta stone",
        "",
        "> Generated by `scripts/automate-capture/rosetta.py`. Do not edit by hand.",
        "",
        "## Legend",
        "",
    ]
    for marker, meaning in rosetta["legend"].items():
        out.append(f"- `{marker}` — {meaning}")
    out.extend(["", "## Boundaries", ""])
    out.append("- Postman: reference-only; not a constraint-bearing reconciliation leg.")
    out.append("- Contract-only products:")
    for item in rosetta["boundaries"]["contract_only_products"]:
        out.append(
            f"  - `{item['product']}` ({item['display']}): {item['operations']} captured operations; {item['reason']}"
        )
    rows_by_product: dict[str, list[dict]] = defaultdict(list)
    for row in rosetta["rows"]:
        rows_by_product[row["product"]].append(row)
    for product in sorted(rows_by_product):
        out.extend(["", f"## {product.upper()}", ""])
        by_resource: dict[str, list[dict]] = defaultdict(list)
        for row in rows_by_product[product]:
            by_resource[row["resource"]].append(row)
        for resource in sorted(by_resource):
            rows = by_resource[resource]
            first = rows[0]
            out.extend(["", f"### `{resource}`", ""])
            out.append(f"`{first['method']} {first['path']}`")
            out.append("")
            has_description = any(row.get("description") for row in rows)
            header = ["field"]
            if has_description:
                header.append("description")
            header.extend(SURFACES)
            out.append("| " + " | ".join(header) + " |")
            out.append("| " + " | ".join("---" for _ in header) + " |")
            for row in rows:
                cells = [f"`{_md_escape(row['field'])}`"]
                if has_description:
                    cells.append(_md_escape(row.get("description", "")))
                cells.extend(_md_cell(row, surface) for surface in SURFACES)
                out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out).rstrip() + "\n"


def _compact_evidence(evidence: dict) -> str:
    parts = []
    if evidence.get("path"):
        parts.append(f"path `{evidence['path']}`")
    if evidence.get("surface", {}).get("path"):
        parts.append(f"source `{evidence['surface']['path']}`")
    if evidence.get("surface", {}).get("paths"):
        parts.append("sources " + ", ".join(f"`{p}`" for p in evidence["surface"]["paths"]))
    if evidence.get("surface", {}).get("sdk_calls"):
        parts.append("SDK " + ", ".join(f"`{c}`" for c in evidence["surface"]["sdk_calls"][:4]))
    if evidence.get("contract_values") is not None:
        parts.append(f"contract={evidence['contract_values']}")
    for key, value in evidence.items():
        if key.endswith("_values") and key != "contract_values":
            parts.append(f"{key}={value}")
    return "; ".join(parts) if parts else json.dumps(evidence, sort_keys=True)


def render_issue_markdown(worklist: dict) -> str:
    out = [
        "---",
        'title: "DAV-23 issue routing — automate.zscaler.com divergences"',
        "status: generated",
        'generator: "scripts/automate-capture/rosetta.py"',
        "---",
        "",
        "# DAV-23 issue routing worklist",
        "",
        "> Generated by `scripts/automate-capture/rosetta.py`. Do not edit by hand.",
        "",
        "Rows are grouped by `target_repo`; `source_repo` identifies the surface that proved the divergence.",
        "",
    ]
    by_repo: dict[str, list[dict]] = defaultdict(list)
    for row in worklist["rows"]:
        by_repo[row["target_repo"]].append(row)
    for repo in sorted(by_repo):
        rows = by_repo[repo]
        out.extend(["", f"## {repo} ({len(rows)})", ""])
        for row in rows:
            out.append(
                "- [ ] "
                f"`{row['product']}.{row['resource']}.{row['field']}` "
                f"**{row['divergence_type']}** ({row['direction']}, {row['confidence']}) — "
                f"{row['suggested_action']} "
                f"Source: `{row['source_repo']}`. Evidence: {_compact_evidence(row['evidence'])}"
            )
    return "\n".join(out).rstrip() + "\n"


def build_all() -> tuple[dict, dict]:
    reports = load_reports()
    contract_fields = load_contract_fields(reports)
    return build_rosetta(reports, contract_fields), build_issue_routing(reports, contract_fields)


def main() -> None:
    rosetta, worklist = build_all()
    outputs = {
        SPEC_DIR / "rosetta.json": rosetta,
        SPEC_DIR / "issue-routing.json": worklist,
    }
    for path, data in outputs.items():
        _write_json(path, data)
    (SPEC_DIR / "rosetta.md").write_text(render_rosetta_markdown(rosetta), encoding="utf-8")
    (SPEC_DIR / "issue-routing.md").write_text(render_issue_markdown(worklist), encoding="utf-8")
    print(f"rosetta rows={rosetta['summary']['rows']} -> {SPEC_DIR / 'rosetta.json'}")
    print(f"issue rows={worklist['summary']['rows']} -> {SPEC_DIR / 'issue-routing.json'}")


if __name__ == "__main__":
    main()
