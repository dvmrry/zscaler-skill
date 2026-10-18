// scripts/kb-lib.mjs
//
// The knowledge graph: load records, index them by ID, validate them, anchor
// citations, and resolve IDs or text to bundles. Zero-dependency. The design is
// docs/superpowers/specs/2026-10-17-kb-graph-model-design.md; record contracts are
// references/_meta/schema/*.schema.json (enforced by kb-schema.mjs).
//
// Node kinds: subject, item (claim | case | divergence | gap), type, field.
// IDs: '.' hierarchy, ':' item inside a subject, '/' type, '#' field.
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { loadSchemas, validate } from "./kb-schema.mjs";

export const META = "references/_meta";
export const SCHEMA_DIR = `${META}/schema`;
export const ITEM_KINDS = ["claims", "cases", "divergences", "gaps"];
const ITEM_KIND_NAME = { claims: "claim", cases: "case", divergences: "divergence", gaps: "gap" };

const SEG = "[a-z0-9]+(?:-[a-z0-9]+)*";
export const ID = {
  subject: new RegExp(`^${SEG}(?:\\.${SEG})+$`),
  item: new RegExp(`^(${SEG}(?:\\.${SEG})+):(${SEG})$`),
  type: new RegExp(`^${SEG}/${SEG}$`),
  field: new RegExp(`^(${SEG}/${SEG})#([A-Za-z_][A-Za-z0-9_]*(?:\\[\\])?(?:\\.[A-Za-z_][A-Za-z0-9_]*(?:\\[\\])?)*)$`),
  local: new RegExp(`^${SEG}$`),
};

/** Classify an ID string by grammar alone: subject | item | type | field | null. */
export function idKind(id) {
  if (ID.item.test(id)) return "item";
  if (ID.field.test(id)) return "field";
  if (ID.type.test(id)) return "type";
  if (ID.subject.test(id)) return "subject";
  return null;
}

/** Qualify a local item name against its subject; qualified IDs pass through. */
export function qualify(subjectId, ref) {
  return ID.local.test(ref) ? `${subjectId}:${ref}` : ref;
}

/** A legacy-checker exclusion: a .md file with a sibling .json of the same stem is KB prose. */
export function isKbProse(file) {
  return file.endsWith(".md") && fs.existsSync(file.slice(0, -3) + ".json");
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const rel = (root, file) => path.relative(root, file).split(path.sep).join("/");

// ---------------------------------------------------------------- loading

/** Load every public record under `root`. Returns { files, problems } without validating references. */
export function loadPublic(root) {
  const files = { subjects: [], logTypes: [], generatedTypes: [] };
  const problems = [];
  const refs = path.join(root, "references");
  for (const scope of fs.readdirSync(refs, { withFileTypes: true })) {
    if (!scope.isDirectory() || scope.name.startsWith("_")) continue;
    const dir = path.join(refs, scope.name);
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".json")) continue;
      const stem = name.slice(0, -5);
      if (!ID.subject.test(stem)) continue; // legacy JSON (e.g. *-api-reference.json) is not a subject
      const file = path.join(dir, name);
      try {
        files.subjects.push({ file: rel(root, file), scope: scope.name, data: readJson(file) });
      } catch (err) {
        problems.push({ file: rel(root, file), message: `unparseable JSON: ${err.message}` });
      }
    }
    const typesDir = path.join(dir, "types");
    if (fs.existsSync(typesDir)) {
      for (const name of fs.readdirSync(typesDir).sort()) {
        if (!name.endsWith(".json")) continue;
        const file = path.join(typesDir, name);
        files.logTypes.push({ file: rel(root, file), scope: scope.name, data: readJson(file) });
      }
    }
  }
  const genDir = path.join(root, META, "types");
  if (fs.existsSync(genDir)) {
    for (const name of fs.readdirSync(genDir).sort()) {
      if (name.endsWith(".json")) files.generatedTypes.push({ file: rel(root, path.join(genDir, name)), data: readJson(path.join(genDir, name)) });
    }
  }
  return {
    root,
    schemas: loadSchemas(path.join(root, SCHEMA_DIR)),
    products: readJson(path.join(root, META, "products.json")),
    sources: readJson(path.join(root, META, "sources.json")),
    manifest: fs.existsSync(path.join(root, META, "capture-manifest.json"))
      ? readJson(path.join(root, META, "capture-manifest.json"))
      : { schema_version: 1, files: {} },
    files,
    problems,
  };
}

// ---------------------------------------------------------------- indexing

/** Build the ID index. Every node is { kind, id, ... }; duplicates are reported. */
export function buildGraph(loaded) {
  const g = {
    ...loaded,
    nodes: new Map(),
    aliases: new Map(), // normalized text -> Set(id)
    formerIds: new Map(), // former id -> current id
    bindsTo: new Map(), // type or field id -> Set(subject or item id) that bind it
    problems: [...loaded.problems],
  };
  const add = (node, file) => {
    if (g.nodes.has(node.id)) g.problems.push({ file, message: `duplicate ID ${node.id}` });
    else g.nodes.set(node.id, { ...node, file });
  };
  const alias = (text, id) => {
    const key = normalizeText(text);
    if (!g.aliases.has(key)) g.aliases.set(key, new Set());
    g.aliases.get(key).add(id);
  };
  const former = (old, id, file) => {
    if (g.formerIds.has(old) && g.formerIds.get(old) !== id) g.problems.push({ file, message: `former_id ${old} claimed by both ${g.formerIds.get(old)} and ${id}` });
    g.formerIds.set(old, id);
  };

  for (const { file, scope, data } of loaded.files.subjects) {
    if (!data || typeof data.id !== "string") continue;
    add({ kind: "subject", id: data.id, scope, data }, file);
    alias(data.id, data.id);
    alias(data.title || "", data.id);
    for (const a of data.aliases || []) alias(a, data.id);
    for (const old of data.former_ids || []) former(old, data.id, file);
    for (const kind of ITEM_KINDS) {
      for (const [local, item] of Object.entries(data[kind] || {})) {
        const id = `${data.id}:${local}`;
        add({ kind: ITEM_KIND_NAME[kind], id, subject: data.id, local, data: item }, file);
        alias(id, id);
        for (const old of item.former_ids || []) {
          former(old, id, file);
          alias(old, id);
        }
      }
    }
  }
  const addType = (t, file, authored) => {
    add({ kind: "type", id: t.id, authored, data: t }, file);
    alias(t.id, t.id);
    if (t.title) alias(t.title, t.id);
    for (const n of Object.values(t.names || {})) alias(n, t.id);
    for (const a of t.aliases || []) alias(a, t.id);
    for (const [fpath, f] of Object.entries(t.fields || {})) {
      add({ kind: "field", id: `${t.id}#${fpath}`, type: t.id, path: fpath, data: f }, file);
      if (f.label) alias(f.label, `${t.id}#${fpath}`);
    }
  };
  for (const { file, data } of loaded.files.generatedTypes) for (const t of Object.values(data.types || {})) addType(t, file, false);
  for (const { file, data } of loaded.files.logTypes) if (data && data.id) addType(data, file, true);

  // Reverse index: which subjects and claims bind each type/field.
  const bind = (target, from) => {
    for (const key of [target, target.split("#")[0]]) {
      if (!g.bindsTo.has(key)) g.bindsTo.set(key, new Set());
      g.bindsTo.get(key).add(from);
    }
  };
  for (const node of g.nodes.values()) {
    if (node.kind === "subject") for (const b of node.data.binds || []) bind(b, node.id);
    if (node.kind === "claim") for (const b of node.data.binds || []) bind(b, node.id);
    if (node.kind === "gap") for (const b of node.data.about || []) if (idKind(b) === "type" || idKind(b) === "field") bind(b, node.id);
  }
  return g;
}

export function normalizeText(s) {
  return String(s).toLowerCase().replace(/[`*_"'“”‘’?.,!:;()]/g, " ").replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------- citations

// PDF-converted captures carry private-use icon glyphs and zero-width characters
// inside sentences; anchoring treats them as whitespace on both sides.
// U+200D (zero-width joiner) stays outside the class: inside one it can join characters.
const IGNORABLE = /\s|\u200D|[\u200B\u200C\u2060\uFEFF\uE000-\uF8FF]/;

export function normalizeWs(s) {
  return s.replace(/(?:\s|\u200D|[\u200B\u200C\u2060\uFEFF\uE000-\uF8FF])+/g, " ").trim();
}

function sourceFile(g, ev) {
  const src = g.sources.sources[ev.source];
  if (!src) return { error: `unknown source "${ev.source}"` };
  const rootDir = path.join(g.root, src.root);
  if (!fs.existsSync(rootDir) || fs.readdirSync(rootDir).length === 0) {
    return { error: `source "${ev.source}" is not initialized (${src.root}); run git submodule update --init ${src.root}` };
  }
  const full = path.join(rootDir, ev.path);
  if (!full.startsWith(rootDir + path.sep)) return { error: `path escapes source root: ${ev.path}` };
  if (ev.at && src.kind !== "submodule") return { error: `"at" is only for submodule sources; ${ev.source} is a ${src.kind}` };
  return { src, rootDir, full, repoPath: `${src.root}/${ev.path}` };
}

/** The file's text at a ref: "HEAD" is the checked-out pin; anything else is read from the submodule's git. */
function textAt(f, ref, cache) {
  const key = `${f.full}@${ref}`;
  if (!cache.has(key)) {
    let text = null;
    if (ref === "HEAD") text = fs.existsSync(f.full) ? fs.readFileSync(f.full, "utf8") : null;
    else {
      try {
        text = execFileSync("git", ["-C", f.rootDir, "show", `${ref}:${path.relative(f.rootDir, f.full).split(path.sep).join("/")}`], {
          encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20,
        });
      } catch { text = null; }
    }
    cache.set(key, text);
  }
  return cache.get(key);
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

/**
 * Anchor quotes or a pointer in one text. Returns { errors, anchors }. With `emphasis`, `**`
 * markers are ignored on both sides: help captures keep the vendor's bold (it can mark the
 * recommended value in a table) and a quote need not reproduce it.
 */
function anchorIn(text, ev, label, { emphasis = false } = {}) {
  const errors = [];
  const anchors = [];
  if (ev.pointer !== undefined) {
    let doc;
    try { doc = JSON.parse(text); } catch { errors.push(`${label} is not JSON; a pointer needs a JSON source`); }
    const value = doc === undefined ? undefined : resolvePointer(doc, ev.pointer);
    // A step into an array is positional and shifts when the source is regenerated; cite a keyed path.
    if (doc !== undefined && pointerHasIndex(doc, ev.pointer)) {
      errors.push(`${label}: pointer ${ev.pointer} steps into an array by index; select the element by a key, e.g. /parameters/[name=id], or cite a keyed document`);
    }
    if (doc !== undefined && value === undefined) errors.push(`${label}: pointer ${ev.pointer} does not resolve`);
    // A pointer proves only that a path exists; `expect` pins the members the claim rests on.
    for (const [k, want] of Object.entries(ev.expect || {})) {
      const got = value !== null && typeof value === "object" ? value[k] : undefined;
      if (value !== undefined && JSON.stringify(got) !== JSON.stringify(want)) {
        errors.push(`${label}: pointer ${ev.pointer} member ${k} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
      }
    }
    anchors.push({ pointer: ev.pointer });
  }
  if (ev.quotes) {
    // Map normalized offsets back to raw offsets so line numbers are exact.
    const map = [];
    let norm = "";
    let inWs = false;
    for (let i = 0; i < text.length; i++) {
      if (emphasis && text[i] === "*" && text[i + 1] === "*") {
        i++;
        continue;
      }
      if (IGNORABLE.test(text[i])) {
        if (!inWs && norm.length) { norm += " "; map.push(i); }
        inWs = true;
      } else {
        norm += text[i];
        map.push(i);
        inWs = false;
      }
    }
    // With `after`, the context anchor must be unique and each quote resolves to
    // its first occurrence after it; without it, each quote must be unique.
    let from = 0;
    if (ev.after !== undefined) {
      const na = normalizeWs(emphasis ? ev.after.replaceAll("**", "") : ev.after);
      const at = norm.indexOf(na);
      if (at === -1) errors.push(`${label}: after-anchor not found: "${ev.after.slice(0, 80)}"`);
      else if (norm.indexOf(na, at + 1) !== -1) errors.push(`${label}: after-anchor is ambiguous: "${ev.after.slice(0, 80)}"`);
      else from = at + na.length;
    }
    for (const q of ev.quotes) {
      const nq = normalizeWs(emphasis ? q.replaceAll("**", "") : q);
      const first = norm.indexOf(nq, from);
      if (first === -1) { errors.push(`${label}: quote not found${ev.after ? " after its anchor" : ""}: "${q.slice(0, 80)}"`); continue; }
      if (ev.after === undefined && norm.indexOf(nq, first + 1) !== -1) {
        errors.push(`${label}: quote is ambiguous (occurs more than once; lengthen it or add an "after" anchor): "${q.slice(0, 80)}"`);
        continue;
      }
      anchors.push({ quote: q, line: lineOf(text, map[first]) });
    }
  }
  return { errors, anchors };
}

/**
 * Anchor one evidence entry at each of its refs (`at`, default the pin). Each
 * quote must occur exactly once after whitespace normalization. Line numbers come
 * from the pin when it is listed, otherwise from the first ref.
 */
export function anchorEvidence(g, ev, cache = new Map()) {
  const f = sourceFile(g, ev);
  if (f.error) return { ok: false, errors: [f.error], anchors: [] };
  const refs = ev.at || ["HEAD"];
  const errors = [];
  let anchors = [];
  for (const ref of refs) {
    const text = textAt(f, ref, cache);
    const label = ref === "HEAD" ? f.repoPath : `${f.repoPath}@${ref}`;
    if (text === null) { errors.push(`${label} does not exist`); continue; }
    const r = anchorIn(text, ev, label, { emphasis: f.src.kind === "capture" });
    errors.push(...r.errors);
    if (ref === "HEAD" || !anchors.length) anchors = r.anchors;
  }
  return { ok: errors.length === 0, errors, anchors, repoPath: f.repoPath, kind: f.src.kind };
}

/** True when any step of the pointer indexes into an array. */
function pointerHasIndex(doc, pointer) {
  const steps = pointer.split("/").slice(1);
  for (let i = 0; i < steps.length; i++) {
    const parent = resolvePointer(doc, `/${steps.slice(0, i).join("/")}`.replace(/^\/$/, ""));
    if (Array.isArray(parent) && !SELECT.test(steps[i].replace(/~1/g, "/").replace(/~0/g, "~"))) return true;
  }
  return false;
}

/** `[member=value]` selects the one array element whose member equals value (a keyed step). */
const SELECT = /^\[([^=\]]+)=(.*)\]$/;

export function resolvePointer(doc, pointer) {
  if (pointer === "") return doc;
  let node = doc;
  for (const raw of pointer.split("/").slice(1)) {
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    const sel = Array.isArray(node) ? SELECT.exec(key) : null;
    if (sel) {
      const hits = node.filter((el) => el && typeof el === "object" && String(el[sel[1]]) === sel[2]);
      if (hits.length !== 1) return undefined;
      node = hits[0];
      continue;
    }
    if (node === null || typeof node !== "object" || !(key in node)) return undefined;
    node = node[key];
  }
  return node;
}

export function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

// ---------------------------------------------------------------- prose

const CLAIM_MARKER = /\{\{([a-z0-9]+(?:-[a-z0-9]+)*)(\|ref)?\}\}/g;
const ITEM_MARKER = /\{\{(gap|divergence):([a-z0-9]+(?:-[a-z0-9]+)*)\}\}/g;
const LINK_MARKER = /\[\[([^\]\s]+)\]\]/g;
// A Markdown link to a repo doc that is not yet converted (or to a kb: ID) also anchors a sentence;
// `kb.mjs migrate-links` retargets it when that doc converts.
const HAS_MARKER = /\{\{(?:(?:gap|divergence):)?[a-z0-9]+(?:-[a-z0-9]+)*(?:\|ref)?\}\}|\[\[[^\]\s]+\]\]|\]\((?:kb:[^)\s]+|[^)\s:]+\.md(?:#[\w-]+)?)\)/;
const ANY_MARKER = new RegExp(HAS_MARKER.source, "g");
// A run-in label such as "**Maximum is a standing cap.**" introduces the sentences after it.
const LABEL = /^\*\*[^*]+\*\*$/;
const WHAT_TO_CHECK = /^(\*\*)?what to check\b/i;
// The lead (first paragraph) may frame the subject in this many sentences without a marker.
export const LEAD_SENTENCES = 2;

/**
 * Split a paragraph into sentences; each list item is one or more sentences of its own. An inlined
 * claim renders as a whole sentence, so a claim marker ends one too.
 */
function sentencesOf(paragraph) {
  return paragraph
    .split(/\n(?=\s*(?:[-*]|\d+\.) )/)
    .flatMap((item) => item.replace(/^\s*(?:[-*]|\d+\.) /, "").split(/(?<=[.!?]|\}\})\s+(?=[A-Z*`"\[({])/))
    .map((t) => t.trim())
    .filter(Boolean);
}

/** A sentence stands on its own: it carries no marker and is more than a label or punctuation. */
function isUnanchored(sentence) {
  if (HAS_MARKER.test(sentence)) return false;
  const bare = sentence.replace(ANY_MARKER, "").trim();
  return /[A-Za-z]{3}/.test(bare) && !LABEL.test(bare);
}

/**
 * Parse a subject's prose: marker uses, links, and the sentences that rest on nothing. Every
 * sentence carries a claim, gap, divergence or link marker, except headings, run-in labels and
 * up to LEAD_SENTENCES framing sentences in the first paragraph; guidance belongs in `checks`.
 */
export function parseProse(text) {
  const inlined = new Map();
  const refs = new Set();
  const links = new Set();
  const items = { gap: new Set(), divergence: new Set() };
  for (const m of text.matchAll(CLAIM_MARKER)) {
    if (m[2]) refs.add(m[1]);
    else inlined.set(m[1], (inlined.get(m[1]) || 0) + 1);
  }
  for (const m of text.matchAll(ITEM_MARKER)) items[m[1]].add(m[2]);
  for (const m of text.matchAll(LINK_MARKER)) links.add(m[1]);
  for (const m of text.matchAll(/\]\(kb:([^)\s#]+)\)/g)) links.add(m[1]);
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith("#"));
  const unanchored = [];
  let whatToCheck = 0;
  paragraphs.forEach((p, i) => {
    if (WHAT_TO_CHECK.test(p)) whatToCheck++;
    const loose = sentencesOf(p).filter(isUnanchored);
    unanchored.push(...(i === 0 ? loose.slice(LEAD_SENTENCES) : loose));
  });
  return { inlined, refs, links, items, paragraphs: paragraphs.length, unanchored, whatToCheck };
}

// ---------------------------------------------------------------- validation

/**
 * Validate the whole public graph. Returns { errors: [{file, message}], warnings, stats }.
 * Citations are anchored here; pass { citations: false } to skip the (slower) quote checks.
 */
export function validateGraph(g, { citations = true } = {}) {
  const errors = [...g.problems];
  const warnings = [];
  const err = (file, message) => errors.push({ file, message });
  const S = g.schemas;
  const scopes = new Set(["shared", ...Object.keys(g.products.products)]);
  const typeScopes = new Set(Object.entries(g.products.products).map(([id, p]) => p.type_scope || id));

  for (const [msg, value, def] of [
    ["products.json", g.products, "products"],
    ["sources.json", g.sources, "sources"],
    ["capture-manifest.json", g.manifest, "capture-manifest"],
  ]) {
    for (const e of validate(S, "registry.schema.json", value, { $ref: `#/$defs/${def}` })) err(`${META}/${msg}`, e);
  }
  for (const [id, src] of Object.entries(g.sources.sources)) {
    if (!fs.existsSync(path.join(g.root, src.root))) err(`${META}/sources.json`, `source ${id}: ${src.root} does not exist`);
  }

  for (const { file, scope, data } of g.files.subjects) {
    for (const e of validate(S, "subject.schema.json", data)) err(file, e);
    if (!data || typeof data.id !== "string") continue;
    if (path.basename(file, ".json") !== data.id) err(file, `file name must equal id (${data.id}.json)`);
    const idScope = data.id.split(".")[0];
    if (!scopes.has(idScope)) err(file, `unknown scope "${idScope}" (not a product in products.json, nor "shared")`);
    if (idScope !== scope) err(file, `subject ${data.id} must live under references/${idScope}/`);
  }
  for (const { file, data } of [...g.files.logTypes, ...g.files.generatedTypes]) {
    for (const e of validate(S, "type.schema.json", data)) err(file, e);
  }
  for (const node of g.nodes.values()) {
    if (node.kind === "type" && !typeScopes.has(node.id.split("/")[0])) err(node.file, `type ${node.id}: unknown type scope`);
  }

  // Reference integrity.
  const exists = (id) => g.nodes.has(id);
  const expectKind = (file, from, id, kinds) => {
    const node = g.nodes.get(id);
    if (!node) {
      const moved = g.formerIds.get(id);
      err(file, `${from}: unknown ID ${id}${moved ? ` (renamed to ${moved})` : ""}`);
    } else if (!kinds.includes(node.kind)) err(file, `${from}: ${id} is a ${node.kind}, expected ${kinds.join(" or ")}`);
  };
  for (const node of g.nodes.values()) {
    if (node.kind === "subject") {
      const d = node.data;
      for (const b of d.binds || []) expectKind(node.file, node.id, b, ["type", "field"]);
      for (const r of d.related || []) expectKind(node.file, node.id, r.to, ["subject"]);
      for (const s of d.into || []) expectKind(node.file, node.id, s, ["subject"]);
      if (d.status === "split" && !(d.into || []).length) err(node.file, `${node.id}: a split subject needs "into"`);
      checkProse(g, node, err, warnings);
    } else if (node.kind === "claim") {
      const d = node.data;
      for (const b of d.binds || []) expectKind(node.file, node.id, b, ["type", "field"]);
      for (const gp of d.gaps || []) expectKind(node.file, node.id, qualify(node.subject, gp), ["gap"]);
      if (d.superseded_by) expectKind(node.file, node.id, qualify(node.subject, d.superseded_by), ["claim"]);
      if (d.status === "superseded" && !d.superseded_by) err(node.file, `${node.id}: superseded claims need superseded_by`);
      for (const c of d.derived_from || []) expectKind(node.file, node.id, qualify(node.subject, c), ["claim"]);
      if (d.tier === "A" && !(d.evidence || []).length) err(node.file, `${node.id}: a Tier A claim needs its own evidence; derived claims are Tier B or lower`);
    } else if (node.kind === "case") {
      for (const c of node.data.claims) expectKind(node.file, node.id, qualify(node.subject, c), ["claim"]);
      if (node.data.expect.gap) expectKind(node.file, node.id, qualify(node.subject, node.data.expect.gap), ["gap"]);
      if (node.data.expect.verdict === "ambiguous" && !node.data.expect.gap) err(node.file, `${node.id}: an ambiguous expectation must name its gap`);
    } else if (node.kind === "divergence") {
      const r = node.data.resolution;
      if (r) {
        const by = g.nodes.get(qualify(node.subject, r.by));
        if (!by || by.kind !== "claim") err(node.file, `${node.id}: resolution.by must name a claim`);
        else if (r.rule.startsWith("observed-") && by.data.tier !== "B") {
          err(node.file, `${node.id}: ${r.rule} needs an observed (Tier B) claim; ${by.id} is Tier ${by.data.tier}`);
        }
      }
    } else if (node.kind === "gap") {
      const d = node.data;
      for (const a of d.about || []) {
        if (!exists(a)) err(node.file, `${node.id}: about unknown ID ${a}`);
      }
      if (d.kind === "data" && !(d.resolvable_by || []).length) err(node.file, `${node.id}: a data gap must say resolvable_by`);
      if (d.kind === "semantic" && d.resolvable_by) err(node.file, `${node.id}: resolvable_by is for data gaps; semantic gaps use resolves_with`);
      if ((d.resolvable_by || []).includes("live") && !d.live_command) err(node.file, `${node.id}: resolvable live needs live_command`);
      if (d.status === "resolved" && !d.resolution) err(node.file, `${node.id}: a resolved gap needs resolution`);
    } else if (node.kind === "field") {
      for (const t of node.data.references || []) expectKind(node.file, node.id, t, ["type"]);
    }
  }

  // Live commands must exist in the pinned zscalerctl command list.
  const commands = loadZscalerctlCommands(g.root);
  for (const node of g.nodes.values()) {
    const cmd = node.kind === "gap" ? node.data.live_command : node.kind === "type" ? node.data.live?.command : null;
    if (cmd && commands && !commandExists(commands, cmd)) err(node.file, `${node.id}: "${cmd}" is not a command in the pinned zscalerctl`);
  }

  // Citations.
  let quotes = 0;
  const citedCaptures = new Set();
  if (citations) {
    const cache = new Map();
    for (const { node, ev, where } of allEvidence(g)) {
      const r = anchorEvidence(g, ev, cache);
      quotes += (ev.quotes || []).length;
      for (const e of r.errors) err(node.file, `${where}: ${e}`);
      if (r.kind === "capture") citedCaptures.add(r.repoPath);
    }
    for (const file of citedCaptures) {
      const entry = g.manifest.files[file];
      if (!entry) err(`${META}/capture-manifest.json`, `cited capture ${file} has no manifest entry`);
      else if (entry.sha256 !== sha256File(path.join(g.root, file))) {
        err(`${META}/capture-manifest.json`, `${file} changed since it was recorded; re-check its quotes and update the manifest (kb.mjs manifest)`);
      }
    }
  }

  const count = (k) => [...g.nodes.values()].filter((n) => n.kind === k).length;
  const stats = {
    subjects: count("subject"), claims: count("claim"), cases: count("case"),
    divergences: count("divergence"), gaps: count("gap"), types: count("type"), fields: count("field"), quotes,
  };
  return { errors, warnings, stats };
}

/** Every evidence entry in the graph, with the node it belongs to. */
export function* allEvidence(g) {
  for (const node of g.nodes.values()) {
    if (node.kind === "claim") for (const [i, ev] of (node.data.evidence || []).entries()) yield { node, ev, where: `${node.id} evidence[${i}]` };
    if (node.kind === "gap") for (const [i, ev] of (node.data.evidence || []).entries()) yield { node, ev, where: `${node.id} evidence[${i}]` };
    if (node.kind === "divergence") for (const [i, p] of node.data.positions.entries()) yield { node, ev: p.evidence, where: `${node.id} positions[${i}]` };
    if (node.kind === "type" && node.authored) for (const [i, ev] of (node.data.evidence || []).entries()) yield { node, ev, where: `${node.id} evidence[${i}]` };
    if (node.kind === "field") for (const [i, ev] of (node.data.evidence || []).entries()) yield { node, ev, where: `${node.id} evidence[${i}]` };
  }
}

function checkProse(g, node, err, warnings) {
  const md = path.join(g.root, node.file.replace(/\.json$/, ".md"));
  const claims = Object.keys(node.data.claims || {});
  if (!fs.existsSync(md)) {
    if (claims.length) warnings.push({ file: node.file, message: `${node.id}: no prose file; all claims render as "Further facts"` });
    return;
  }
  const text = fs.readFileSync(md, "utf8");
  const mdRel = node.file.replace(/\.json$/, ".md");
  if (text.startsWith("---")) err(mdRel, "prose has no frontmatter; metadata lives in the subject JSON");
  const p = parseProse(text);
  for (const [local, n] of p.inlined) {
    if (!claims.includes(local)) err(mdRel, `{{${local}}} is not a claim of ${node.id}`);
    if (n > 1) err(mdRel, `{{${local}}} is inlined ${n} times; inline once and use {{${local}|ref}} afterwards`);
  }
  // Every claim is inlined once: the prose is where an agent reads it in order.
  for (const local of claims) if (!p.inlined.has(local)) err(mdRel, `claim ${local} is never inlined; place {{${local}}} where it belongs`);
  for (const local of p.refs) {
    if (!claims.includes(local)) err(mdRel, `{{${local}|ref}} is not a claim of ${node.id}`);
    else if (!p.inlined.has(local)) err(mdRel, `{{${local}|ref}} refers back to a claim that is never inlined`);
  }
  for (const id of p.links) {
    if (!g.nodes.has(id)) err(mdRel, `[[${id}]] does not resolve`);
  }
  for (const kind of ["gap", "divergence"]) {
    const own = Object.keys(node.data[`${kind}s`] || {});
    for (const local of p.items[kind]) if (!own.includes(local)) err(mdRel, `{{${kind}:${local}}} is not a ${kind} of ${node.id}`);
  }
  if (p.whatToCheck) err(mdRel, "a What-to-check paragraph belongs in the subject's `checks`, not the prose");
  for (const sentence of p.unanchored) {
    err(mdRel, `sentence rests on no claim, gap, divergence or link; anchor it, move guidance to \`checks\`, or cut it: "${sentence.slice(0, 100)}"`);
  }
  for (const [i, c] of (node.data.checks || []).entries()) {
    for (const u of c.uses) {
      if (!resolvesFrom(g, node, u)) err(node.file, `checks[${i}] uses ${u}, which is not a claim, gap or divergence of ${node.id} nor a kb ID`);
    }
  }
}

/** A reference from a subject: one of its own claims, gaps or divergences, or any kb ID. */
export function resolvesFrom(g, node, ref) {
  if (g.nodes.has(ref)) return true;
  return ["claims", "gaps", "divergences"].some((k) => Object.hasOwn(node.data[k] || {}, ref));
}

const commandsCache = new Map(); // root -> Set(command path) | null
export function loadZscalerctlCommands(root) {
  if (!commandsCache.has(root)) {
    const file = path.join(root, META, "imports", "zscalerctl.json");
    commandsCache.set(root, fs.existsSync(file) ? new Set(readJson(file).commands) : null);
  }
  return commandsCache.get(root);
}

function commandExists(commands, cmd) {
  const words = cmd.replace(/^zscalerctl\s+/, "").split(/\s+/).filter((w) => !w.startsWith("<") && !w.startsWith("-"));
  for (let n = words.length; n > 0; n--) if (commands.has(words.slice(0, n).join(" "))) return true;
  return false;
}

// ---------------------------------------------------------------- git pins

/** The gitlink SHA recorded for a submodule path in the index, or null. */
export function gitlink(root, subPath) {
  try {
    const out = execFileSync("git", ["-C", root, "ls-files", "-s", "--", subPath], { encoding: "utf8" }).trim();
    const m = out.match(/^160000 ([0-9a-f]{40}) /);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}
