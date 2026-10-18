// scripts/kb-schema.mjs
//
// Minimal JSON Schema (2020-12 subset) validator for the knowledge-graph record
// contracts in references/_meta/schema/. Zero-dependency. The schema files are
// the contract; this validator enforces exactly the keywords they use, and
// throws on any keyword it does not implement, so a schema can never silently
// claim a rule that is not checked.
import fs from "node:fs";
import path from "node:path";

const SUPPORTED = new Set([
  "$schema", "$id", "$defs", "$ref", "title", "description", "type", "const", "enum",
  "properties", "required", "additionalProperties", "patternProperties", "propertyNames",
  "items", "minItems", "uniqueItems", "minLength", "maxLength", "pattern",
  "minProperties", "anyOf", "oneOf", "minimum",
]);

export function loadSchemas(dir) {
  const schemas = {};
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith(".schema.json")) continue;
    schemas[name] = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
  }
  return schemas;
}

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}

function typeMatches(want, v) {
  const t = typeOf(v);
  return want === t || (want === "number" && t === "integer");
}

function deref(schemas, file, ref) {
  const [target, frag = ""] = ref.split("#");
  const doc = target ? schemas[target] : schemas[file];
  if (!doc) throw new Error(`kb-schema: unknown schema file in $ref ${ref}`);
  let node = doc;
  for (const part of frag.split("/").filter(Boolean)) {
    node = node?.[part];
    if (node === undefined) throw new Error(`kb-schema: unresolvable $ref ${ref}`);
  }
  return { node, file: target || file };
}

/** Validate `value` against schema file `file` (or a sub-schema). Returns error strings. */
export function validate(schemas, file, value, schema = schemas[file], at = "$") {
  if (!schema) throw new Error(`kb-schema: unknown schema ${file}`);
  const errors = [];
  for (const key of Object.keys(schema)) {
    if (!SUPPORTED.has(key)) throw new Error(`kb-schema: unsupported keyword "${key}" in ${file}`);
  }
  if (schema.$ref) {
    const r = deref(schemas, file, schema.$ref);
    errors.push(...validate(schemas, r.file, value, r.node, at));
  }
  if (schema.type !== undefined) {
    const wants = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!wants.some((w) => typeMatches(w, value))) {
      errors.push(`${at}: expected ${wants.join("|")}, got ${typeOf(value)}`);
      return errors;
    }
  }
  if ("const" in schema && value !== schema.const) errors.push(`${at}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${at}: must be one of ${schema.enum.join(", ")}`);
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${at}: shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${at}: longer than ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(value)) errors.push(`${at}: "${value}" does not match ${schema.pattern}`);
  }
  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${at}: below minimum ${schema.minimum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${at}: needs at least ${schema.minItems} items`);
    if (schema.uniqueItems) {
      const seen = new Set(value.map((v) => JSON.stringify(v)));
      if (seen.size !== value.length) errors.push(`${at}: items must be unique`);
    }
    if (schema.items) value.forEach((v, i) => errors.push(...validate(schemas, file, v, schema.items, `${at}[${i}]`)));
  }
  if (typeOf(value) === "object") {
    const keys = Object.keys(value);
    if (schema.minProperties !== undefined && keys.length < schema.minProperties) {
      errors.push(`${at}: needs at least ${schema.minProperties} properties`);
    }
    for (const req of schema.required || []) if (!(req in value)) errors.push(`${at}: missing required "${req}"`);
    for (const key of keys) {
      const child = `${at}.${key}`;
      if (schema.propertyNames) errors.push(...validate(schemas, file, key, schema.propertyNames, `${child} (name)`));
      let matched = false;
      if (schema.properties && key in schema.properties) {
        matched = true;
        errors.push(...validate(schemas, file, value[key], schema.properties[key], child));
      }
      for (const [pat, sub] of Object.entries(schema.patternProperties || {})) {
        if (new RegExp(pat, "u").test(key)) {
          matched = true;
          errors.push(...validate(schemas, file, value[key], sub, child));
        }
      }
      if (!matched && schema.additionalProperties !== undefined) {
        if (schema.additionalProperties === false) errors.push(`${child}: unknown property`);
        else if (typeof schema.additionalProperties === "object") {
          errors.push(...validate(schemas, file, value[key], schema.additionalProperties, child));
        }
      }
    }
  }
  if (schema.anyOf) {
    const results = schema.anyOf.map((s) => validate(schemas, file, value, s, at));
    if (!results.some((r) => r.length === 0)) errors.push(`${at}: matches none of anyOf (${results.map((r) => r[0]).join(" | ")})`);
  }
  if (schema.oneOf) {
    const ok = schema.oneOf.filter((s) => validate(schemas, file, value, s, at).length === 0).length;
    if (ok !== 1) errors.push(`${at}: must match exactly one of oneOf (matched ${ok})`);
  }
  return errors;
}
