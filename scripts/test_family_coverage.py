"""Regression tests for the graph-based vendor family coverage check."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
_spec = importlib.util.spec_from_file_location("check_family_coverage", SCRIPTS / "check-family-coverage.py")
fc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fc)


def _subject(root: Path, sid: str, **body) -> None:
    path = root / "references" / sid.split(".")[0] / f"{sid}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"schema_version": 1, "id": sid, "title": sid, **body}))


def _repo(tmp_path: Path, monkeypatch) -> Path:
    (tmp_path / "references/_meta").mkdir(parents=True)
    (tmp_path / "references/_meta/sources.json").write_text(json.dumps({"schema_version": 1, "sources": {
        "sdk-go": {"kind": "submodule", "root": "vendor/zscaler-sdk-go", "rank": 1, "title": "Go"},
        "api-specs": {"kind": "capture", "root": "vendor/zscaler-api-specs", "rank": 3, "title": "Specs"},
        "tf-zpa": {"kind": "submodule", "root": "vendor/terraform-provider-zpa", "rank": 4, "title": "TF"},
        "ansible-zpa": {"kind": "submodule", "root": "vendor/zpacloud-ansible", "rank": 4, "title": "Ansible"},
    }}))
    monkeypatch.setattr(fc.l1, "ROOT", str(tmp_path))
    return tmp_path


def _claim(source: str, path: str) -> dict:
    return {"statement": "s", "tier": "A", "evidence": [{"source": source, "path": path, "quotes": ["q"]}]}


def test_evidence_in_the_area_and_one_linked_hop_counts(tmp_path, monkeypatch):
    root = _repo(tmp_path, monkeypatch)
    _subject(root, "zbi.api",
             prose=[{"text": "See [[zpa.cbi:profiles]]."}],
             related=[{"rel": "see-also", "to": "zpa.cbi-related"}],
             claims={"own": _claim("api-specs", "automate-zscaler/openapi/zpa.openapi.json")})
    _subject(root, "zpa.cbi", claims={"profiles": _claim("sdk-go", "zscaler/zpa/services/cbi/cbi.go")},
             prose=[{"text": "See [[zpa.two-hops]]."}])
    _subject(root, "zpa.cbi-related", claims={"tf": _claim("tf-zpa", "zpa/resource_zpa_cbi.go")})
    _subject(root, "zpa.two-hops", claims={"ansible": _claim("ansible-zpa", "plugins/modules/cbi.py")})
    assert fc.documented_families("zbi") == {"automate-contract", "go-sdk", "terraform"}


def test_a_mention_without_evidence_does_not_count(tmp_path, monkeypatch):
    root = _repo(tmp_path, monkeypatch)
    _subject(root, "zbi.api", aliases=["vendor/zpacloud-ansible"],
             prose=[{"text": "The Ansible collection `vendor/zpacloud-ansible` has CBI modules."}])
    assert fc.documented_families("zbi") == set()


def test_every_product_with_a_contract_or_postman_folder_inventories_it():
    # Contract and Postman paths carry no product prefix, so a path-stem filter once emptied both families
    # for every product but browser isolation, and the coverage check could not see them.
    l1 = fc.l1
    for product, cfg in l1.PRODUCTS.items():
        inv = l1.get_inventory(product)
        products = cfg.get("contract_products", cfg.get("parents", []))
        products = [products] if isinstance(products, str) else products
        root = Path(l1.V) / "zscaler-api-specs" / "automate-zscaler"
        if any((root / f"{p}-api-reference.json").exists() for p in products):
            assert any(inv["automate-contract"].values()), product
        if cfg.get("postman_base"):
            assert any(inv["postman"].values()), product
