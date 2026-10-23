import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { handlerPackages, joinTerraform } from "./kb-types.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("zscalerctl readers name the Go SDK packages they read", () => {
  const pkgs = handlerPackages(ROOT);
  assert.deepEqual(pkgs["zia/locations"], ["zia/location/locationmanagement"]);
  assert.ok(Object.keys(pkgs).length > 150);
});

test("a type joins the one provider resource that shares its SDK package and a name word", () => {
  const res = (name, ...sdk_go) => ({ name, kind: "resource", sdk_go });
  const resources = [
    res("zia_location_management", "location/locationmanagement"),
    res("zia_location_groups", "location/locationgroups"),
    res("zia_activation_status", "activation"),
    res("zia_url_filtering_rules", "urlfilteringpolicies", "location/locationmanagement"),
  ];
  assert.equal(joinTerraform("zia/locations", ["zia/location/locationmanagement"], resources), "zia_location_management");
  // Sharing the package without a shared word is not a join.
  assert.equal(joinTerraform("zia/static-ips", ["zia/location/locationmanagement"], resources), undefined);
  // A reviewed exclusion wins over a package and word match.
  assert.equal(joinTerraform("zia/eusa-status", ["zia/activation"], resources), undefined);
  // A reviewed pick wins when several resources fit.
  assert.equal(joinTerraform("zpa/application-segments", [], []), "zpa_application_segment");
  // Data sources join separately, with their own reviewed table.
  const ds = [{ name: "zia_location_management", kind: "data-source", sdk_go: ["location/locationmanagement"] }];
  assert.equal(joinTerraform("zia/locations", ["zia/location/locationmanagement"], [...resources, ...ds], "data-source"), "zia_location_management");
  assert.equal(joinTerraform("zia/locations", ["zia/location/locationmanagement"], ds), undefined, "a data source is not a resource");
});
