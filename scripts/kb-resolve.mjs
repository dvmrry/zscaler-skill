// scripts/kb-resolve.mjs
//
// Resolve an ID or text to one layer-labelled bundle, render subjects as
// Markdown, and load/validate the company overlay. Pure and deterministic: the
// same graph, overlay, and query always produce the same output, and nothing is
// written. Every consumer (skill loader, Medina pack, MCP wrapper) is a thin
// adapter over resolve().
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validate } from "./kb-schema.mjs";
import { runtimeDataMountSettings } from "./lib.mjs";
import {
  ID, META, allEvidence, anchorEvidence, gitlink, idKind, materialDate, normalizeText, qualify, resolvePointer, sha256File,
} from "./kb-lib.mjs";

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
export const BUNDLE_VERSION = 1;

// ---------------------------------------------------------------- overlay

/** Load a company overlay root. Missing overlay is not an error: returns null. */
export function loadOverlay(g, dir) {
  if (!dir) return null;
  const root = path.resolve(dir);
  const cfgFile = path.join(root, "overlay.json");
  if (!fs.existsSync(cfgFile)) throw new Error(`overlay: ${cfgFile} not found`);
  const config = readJson(cfgFile);
  const records = [];
  const kdir = path.join(root, "knowledge");
  if (fs.existsSync(kdir)) {
    for (const scope of fs.readdirSync(kdir, { withFileTypes: true })) {
      if (!scope.isDirectory()) continue;
      for (const name of fs.readdirSync(path.join(kdir, scope.name)).sort()) {
        if (!name.endsWith(".json")) continue;
        const file = path.join(kdir, scope.name, name);
        records.push({ file: path.relative(root, file), data: readJson(file) });
      }
    }
  }
  const ov = { root, config, records };
  return { ...ov, iacRepos: iacRepos(g.root, ov) };
}

/** Validate overlay config and records against public IDs and the relation table. */
export function validateOverlay(g, ov) {
  const errors = [];
  const err = (file, message) => errors.push({ file, message });
  for (const e of validate(g.schemas, "overlay.schema.json", ov.config, { $ref: "#/$defs/overlay" })) err("overlay.json", e);
  const seen = new Set();
  for (const { file, data } of ov.records) {
    for (const e of validate(g.schemas, "overlay.schema.json", data, { $ref: "#/$defs/record" })) err(file, e);
    if (!data?.id) continue;
    if (path.basename(file, ".json") !== data.id) err(file, `file name must equal id (${data.id}.json)`);
    if (seen.has(data.id)) err(file, `duplicate ID ${data.id}`);
    seen.add(data.id);
    const kinds = (data.about || []).map((id) => g.nodes.get(id)?.kind);
    (data.about || []).forEach((id, i) => { if (!kinds[i]) err(file, `about unknown public ID ${id}`); });
    const need = (cond, msg) => { if (!cond) err(file, msg); };
    switch (data.kind) {
      case "claim":
        need(["extends", "narrows", "contradicts"].includes(data.relation), "a claim's relation is extends, narrows, or contradicts");
        need(Boolean(data.statement), "a claim needs a statement");
        need(Boolean(data.confidence), "a claim needs a confidence");
        need(Boolean(data.validated), "a claim needs validated (the day it was last checked)");
        if (data.relation === "narrows" || data.relation === "contradicts") {
          need(kinds.every((k) => k === "claim"), `${data.relation} must target public claims only`);
          need(Boolean(data.scope), `${data.relation} requires scope`);
        }
        if (data.relation === "contradicts") need((data.evidence || []).length > 0, "contradicts requires evidence");
        break;
      case "procedure":
        need(data.relation === "extends", "a procedure's relation is extends");
        need(Boolean(data.validated), "a procedure needs validated (the day it was last checked)");
        need(kinds.every((k) => k === "subject"), "a procedure attaches to subjects");
        break;
      case "mapping":
        need(data.relation === "maps", "a mapping's relation is maps");
        need(kinds.every((k) => k === "type" || k === "field"), "a mapping attaches to types or fields");
        for (const f of [...Object.keys(data.map || {}), ...(data.dropped_fields || [])]) {
          need(g.nodes.get(f)?.kind === "field", `mapping names unknown public field ${f}`);
        }
        break;
      case "iac-coverage": {
        need(data.relation === "extends", "iac-coverage's relation is extends");
        need(kinds.every((k) => k === "type" || k === "field"), "iac-coverage attaches to types or fields");
        need((data.pointers || []).length > 0, "iac-coverage needs pointers into the IaC repo");
        need(Boolean(ov.config.iac?.length), "iac-coverage needs overlay.json iac");
        for (const p of data.pointers || []) {
          const r = resolveOverlayPointer(ov, p);
          // A pointer that does not resolve (a repo not checked out, a moved file) is the IaC's state, not a
          // malformed record: resolve keeps the record and reports the pointer; the contract check fails on it.
          if (r.error) errors.push({ file, message: r.error, pointer: true });
        }
        break;
      }
    }
    if (data.status === "promoted") need(g.nodes.get(data.promoted_to)?.kind === "claim", "promoted records need promoted_to: a public claim ID");
    if (data.status !== "promoted" && data.promoted_to) err(file, "promoted_to is only for promoted records");
  }
  return errors;
}

/** A file's (or, without one, a repo's) last commit date, YYYY-MM-DD, when the repo is a git checkout. */
function committedDate(repoRoot, file) {
  try {
    const out = execFileSync("git", ["-C", repoRoot, "log", "-1", "--format=%cs", ...(file ? ["--", file] : [])], {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

/**
 * The overlay's IaC repos as a reader needs them: where each is (relative to the skill root, so a read goes there
 * and nowhere else), whether it is checked out, and its last commit date.
 */
function iacRepos(root, ov) {
  return (ov?.config.iac || []).map((r) => {
    const abs = path.resolve(ov.root, r.path);
    const available = fs.existsSync(abs) && fs.statSync(abs).isDirectory() && fs.readdirSync(abs).length > 0;
    const committed = available ? committedDate(abs) : null;
    return { id: r.id, kind: r.kind, path: path.relative(root, abs) || ".", available, ...(committed ? { committed } : {}) };
  });
}

/**
 * Resolve a pointer into the overlay repo it names. An infrawright repo is JSON: the pointer's value is read
 * and returned. A terraform repo is HCL, which is never parsed: the file must exist, and the pointer is a
 * location (file and resource address) for the reader to open.
 */
function resolveOverlayPointer(ov, p) {
  const repo = (ov.config.iac || []).find((r) => r.id === p.repo);
  if (!repo) return { error: `pointer names IaC repo "${p.repo}", which overlay.json iac does not declare` };
  const repoRoot = path.resolve(ov.root, repo.path);
  const file = path.resolve(repoRoot, p.file);
  if (!file.startsWith(repoRoot + path.sep)) return { error: `pointer file escapes the IaC repo: ${p.file}` };
  if (!fs.existsSync(file)) return { error: `IaC file not found: ${p.repo}:${p.file}` };
  if (repo.kind === "terraform") {
    if (p.pointer !== undefined) return { error: `${p.repo} is a terraform repo: name a resource address, not a JSON pointer` };
    return { location: `${p.repo}:${p.file}${p.address ? ` ${p.address}` : ""}` };
  }
  if (p.pointer === undefined) return { error: `${p.repo} is an infrawright repo: the pointer needs a JSON pointer` };
  if (p.address !== undefined) return { error: `${p.repo} is an infrawright repo: address is for terraform repos` };
  const value = resolvePointer(readJson(file), p.pointer);
  if (value === undefined) return { error: `IaC pointer does not resolve: ${p.repo}:${p.file}#${p.pointer}` };
  return { value };
}

// ---------------------------------------------------------------- bundle pieces

export function confidenceOf(claim) {
  if (claim.confidence_override) return claim.confidence_override.value;
  return { A: "high", B: "medium", C: "low", D: "low" }[claim.tier];
}

// Citations point at path and lines by default; quote text is the evidence level, added on request.
function citations(g, evidence, ctx) {
  return evidence.map((ev) => {
    const r = anchorEvidence(g, ev, ctx.cache);
    // The material's own date travels with every citation, so an answer can say "as of" (not "captured on").
    ctx.dates ||= new Map();
    const dated = materialDate(g, ev, ctx.dates);
    const base = {
      source: ev.source, path: `${g.sources.sources[ev.source]?.root}/${ev.path}`, ...(ev.at ? { at: ev.at } : {}),
      ...(dated ? { as_of: dated.as_of, as_of_basis: dated.basis } : {}),
    };
    if (ev.pointer !== undefined) return { ...base, pointer: ev.pointer };
    const cite = ctx.evidence
      ? { quotes: r.anchors.map((a) => ({ text: a.quote, line: a.line })) }
      : { lines: [...new Set(r.anchors.map((a) => a.line))].sort((a, b) => a - b) };
    return { ...base, ...cite, ...(r.ok ? {} : { anchor_errors: r.errors }) };
  });
}

function claimView(g, node, ctx) {
  const d = node.data;
  return {
    id: node.id, statement: d.statement, tier: d.tier, confidence: confidenceOf(d),
    ...(d.conditions ? { conditions: d.conditions } : {}),
    ...(d.binds ? { binds: d.binds } : {}),
    ...(d.gaps ? { gaps: d.gaps.map((x) => qualify(node.subject, x)) } : {}),
    ...(d.derived_from ? { derived_from: d.derived_from.map((x) => qualify(node.subject, x)) } : {}),
    ...(d.status && d.status !== "active" ? { status: d.status } : {}),
    citations: citations(g, d.evidence || [], ctx),
  };
}

function gapView(node) {
  const d = node.data;
  return {
    id: node.id, kind: d.kind, title: d.title, status: d.status,
    ...(d.former_ids ? { former_ids: d.former_ids } : {}),
    ...(d.about ? { about: d.about } : {}),
    ...(d.blocks ? { blocks: d.blocks } : {}),
    ...(d.detail ? { detail: d.detail } : {}),
    ...(d.resolves_with ? { resolves_with: d.resolves_with } : {}),
    ...(d.resolvable_by ? { resolvable_by: d.resolvable_by } : {}),
    ...(d.live_command ? { live_command: d.live_command } : {}),
    ...(d.resolution ? { resolution: d.resolution } : {}),
  };
}

function typeView(g, typeId, onlyFields, ov) {
  const t = g.nodes.get(typeId).data;
  const fields = {};
  for (const [p, f] of Object.entries(t.fields)) {
    if (onlyFields && !onlyFields.has(p)) continue;
    const { evidence, classification, ...rest } = f;
    fields[p] = rest;
  }
  const live = ov?.config.live && t.live ? { ...t.live, available: true } : t.live ? { ...t.live, available: false, note: "needs a company overlay with a live tool and credentials" } : undefined;
  return { id: t.id, kind: t.kind, ...(t.title ? { title: t.title } : {}), ...(t.names ? { names: t.names } : {}), ...(t.iac ? { iac: t.iac } : {}), ...(live ? { live } : {}), fields };
}

function companyFacets(ov, ids) {
  if (!ov) return [];
  const out = [];
  for (const { data } of ov.records) {
    if (data.status !== "active") continue;
    if (!(data.about || []).some((a) => ids.has(a))) continue;
    const facet = {
      layer: "company", id: data.id, kind: data.kind, relation: data.relation, about: data.about, title: data.title,
      ...(data.statement ? { statement: data.statement } : {}),
      ...(data.do_not_infer ? { do_not_infer: data.do_not_infer } : {}),
      ...(data.scope ? { scope: data.scope } : {}),
      ...(data.validated ? { validated: data.validated } : {}),
      ...(data.confidence ? { confidence: data.confidence } : {}),
      ...(data.map ? { map: data.map } : {}),
      ...(data.dropped_fields ? { dropped_fields: data.dropped_fields } : {}),
      ...(data.system ? { system: data.system } : {}),
      ...(data.refresh ? { refresh: data.refresh } : {}),
      ...(data.evidence ? { evidence: data.evidence } : {}),
    };
    if (data.pointers) {
      facet.iac = data.pointers.map((p) => {
        const r = resolveOverlayPointer(ov, p);
        const repo = (ov.config.iac || []).find((x) => x.id === p.repo);
        const committed = !r.error && repo ? committedDate(path.resolve(ov.root, repo.path), p.file) : null;
        const where = p.pointer !== undefined ? { source: `${p.repo}:${p.file}#${p.pointer}` } : { location: `${p.repo}:${p.file}${p.address ? ` ${p.address}` : ""}` };
        if (r.error) return { label: p.label, ...where, error: r.error };
        return r.location
          ? { label: p.label, location: r.location, ...(committed ? { committed } : {}) }
          : { label: p.label, ...where, value: r.value ?? null, ...(committed ? { committed } : {}) };
      });
    }
    out.push(facet);
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

function tiers(ov) {
  const repos = ov?.iacRepos || [];
  return {
    knowledge: { public: true, company: Boolean(ov) },
    iac: { available: repos.some((r) => r.available), ...(repos.length ? { repos } : {}) },
    live: { available: Boolean(ov?.config.live) },
  };
}

// ---------------------------------------------------------------- resolve

export function resolve(g, query, { overlay = null, cases = "summary", evidence = false } = {}) {
  const ctx = { cache: new Map(), cases, evidence };
  const base = { bundle_version: BUNDLE_VERSION, query, tiers: tiers(overlay) };
  let id = query;
  if (!g.nodes.has(id) && g.formerIds.has(id)) id = g.formerIds.get(id);
  // A product's ID always lists its areas; a product alias does only when no subject or type claims it exactly.
  const product = !g.nodes.has(id) && productOf(g, query, g.aliases.has(normalizeText(query)));
  if (product) return { ...base, resolved: { id: product, kind: "product" }, areas: areasOf(g, product) };
  if (!g.nodes.has(id)) {
    let match = "alias";
    let hits = [...(g.aliases.get(normalizeText(query)) || [])].sort();
    if (!hits.length) [match, hits] = ["all-words", containingAllWords(g, query)];
    if (match === "all-words" && hits.length > 1) hits = ranked(g, query, { limit: null, among: hits, overlay });
    // Neither matched (a question in prose, a word no alias carries): rank by the query's words instead. A
    // ranked list is a suggestion, so even one result comes back as a candidate rather than resolved.
    if (!hits.length) [match, hits] = ["ranked", ranked(g, query, { overlay })];
    if (hits.length === 1 && match !== "ranked") id = hits[0];
    else {
      return {
        ...base, resolved: null, match,
        candidates: hits.map((h) => {
          const m = match === "ranked" ? matchedLines(g, h, query, overlay) : {};
          // The public line leads: it says why the subject fits. Company text, when it also fits, rides alongside
          // so it cannot hide the public claim a reader chooses by.
          const matched = m.public || m.company;
          const company = m.public && m.company;
          return { id: h, kind: g.nodes.get(h).kind, title: titleOf(g, h), ...(matched ? { matched } : {}), ...(company ? { matched_company: company } : {}) };
        }),
      };
    }
  }
  const node = g.nodes.get(id);
  if (node.kind === "type" || node.kind === "field") return { ...base, resolved: { id, kind: node.kind }, ...typeBundle(g, node.kind === "type" ? id : node.type, node.kind === "field" ? node.path : null, overlay, ctx) };
  const subjectId = node.kind === "subject" ? id : node.subject;
  return { ...base, resolved: { id, kind: node.kind }, ...(node.kind !== "subject" ? { focus: id } : {}), ...subjectBundle(g, subjectId, overlay, ctx) };
}

const oneLine = (t) => (t.length > 200 ? `${t.slice(0, 197)}...` : t);

/**
 * The compact view of a resolved bundle (--compact): per subject its claims as one-line statements, gap and
 * divergence labels, company facets in full and neighbor IDs, without prose, checks, citations, cases or types.
 * An agent reads several subjects this way in one small call, then resolves in full only the one or two it
 * needs. Company facets stay whole: they are what an overlay answer needs from the resolver, and they are small. Candidate lists and product area lists are already compact and pass through unchanged.
 */
export function compactBundle(g, bundle) {
  if (!bundle.resolved || bundle.resolved.kind === "product") return bundle;
  const { bundle_version, query, tiers: t, resolved, focus } = bundle;
  const base = { bundle_version, query, tiers: t, resolved, ...(focus ? { focus } : {}), view: "compact" };
  const company = bundle.company || [];
  if (bundle.type) {
    return {
      ...base,
      summary: {
        id: bundle.type.id, title: bundle.type.title || bundle.type.id,
        subjects: bundle.subjects.map((x) => ({ id: x.id, title: x.title })),
        gaps: bundle.gaps.map((x) => ({ id: x.id, title: x.title, status: x.status })),
        company,
      },
      hint: "Resolve an ID without --compact for its prose, citations and checks.",
    };
  }
  const sid = bundle.subject.id;
  const matched = query !== resolved.id && query !== sid ? matchedLines(g, sid, query).public : null;
  return {
    ...base,
    ...(matched ? { matched } : {}),
    summary: {
      id: sid, title: bundle.subject.title,
      claims: itemsOf(g, sid, "claim").map((n) => ({ id: n.id, tier: n.data.tier, statement: oneLine(n.data.statement) })),
      gaps: bundle.gaps.map((x) => ({ id: x.id, title: x.title, status: x.status })),
      divergences: bundle.divergences.map((x) => ({ id: x.id, summary: oneLine(x.summary) })),
      company,
      neighbors: bundle.neighbors.map((x) => ({ id: x.id, rel: x.rel })),
      related: bundle.subject.related.map((r) => ({ id: r.to, rel: r.rel })),
    },
    hint: "Resolve an ID without --compact for its prose, citations and checks.",
  };
}

/**
 * The company view of a resolved bundle (--company): only the company facets, for the call that finishes an
 * overlay answer after the subjects were read as files. Candidate lists and product area lists pass through.
 */
export function companyBundle(bundle) {
  if (!bundle.resolved || bundle.resolved.kind === "product") return bundle;
  const { bundle_version, query, tiers: t, resolved, focus } = bundle;
  return { bundle_version, query, tiers: t, resolved, ...(focus ? { focus } : {}), view: "company", company: bundle.company || [] };
}

/** The product (or "shared") a query names by its ID, or by its name or a products.json alias unless idOnly. */
function productOf(g, query, idOnly) {
  const q = normalizeText(query);
  if (q === "shared") return "shared";
  for (const [id, p] of Object.entries(g.products.products)) {
    if (normalizeText(id) === q || (!idOnly && [p.name, ...(p.aliases || [])].some((a) => a && normalizeText(a) === q))) return id;
  }
  return null;
}

/**
 * A product's areas, generated from its subject IDs: one entry per second ID segment, with the area's own
 * subject when there is one and every subject under it. This is the product's table of contents; nothing
 * hand-maintained.
 */
function areasOf(g, product) {
  const areas = new Map();
  for (const n of g.nodes.values()) {
    if (n.kind !== "subject" || n.id.split(".")[0] !== product) continue;
    const area = n.id.split(".").slice(0, 2).join(".");
    if (!areas.has(area)) areas.set(area, []);
    areas.get(area).push(n.id);
  }
  return [...areas.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([area, ids]) => ({
    id: area,
    ...(g.nodes.has(area) ? { title: titleOf(g, area) } : {}),
    subjects: ids.filter((i) => i !== area).sort(),
  }));
}

/**
 * Fallback for text with no exact alias: every subject or type whose alias or
 * title contains all of the query's words. A filter, not a ranking: results are
 * sorted by ID and the caller picks.
 */
function containingAllWords(g, query) {
  // Stop words are dropped, so "what is ZIdentity" needs only "zidentity" in one alias or title.
  const words = normalizeText(query).split(" ").filter((w) => w && !STOP.has(w));
  if (!words.length) return [];
  const out = new Set();
  for (const [text, ids] of g.aliases) {
    const have = new Set(text.split(" "));
    if (!words.every((w) => have.has(w))) continue;
    for (const id of ids) {
      const k = g.nodes.get(id).kind;
      if (k === "subject" || k === "type") out.add(id);
    }
  }
  return [...out].sort();
}

const STOP = new Set(("a an and are as at be but by can do does for from has have how i if in into is it its may "
  + "my not of on or our should so than that the their them then there these they this to was we what when where "
  + "which who why will with would you your yes no any all some only also use used using get set").split(" "));

/** Query and index words: lower case, letters and digits, no stop words, a plural `s` dropped. */
function words(text) {
  return normalizeText(text).split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));
}

/**
 * For each subject and type, the weight of every word in it: 4 in its ID, 3 in its title or aliases, 1 in its prose,
 * claim statements and gap titles. Built once per graph.
 */
function rankIndex(g, overlay = null) {
  // One index per graph and overlay: a company record lifts the public subject it is about.
  const holder = overlay || g;
  if (holder.rankIndex) return holder.rankIndex;
  const docs = new Map();
  // subject -> [text, rank] for `matched`: claim statements and gap titles (rank 0) before prose (rank 1).
  const lines = new Map();
  const line = (id, text, rank) => text && (lines.get(id) || lines.set(id, []).get(id)).push([text, rank]);
  const add = (id, text, w) => {
    const m = docs.get(id) || new Map();
    for (const t of words(text)) m.set(t, Math.max(m.get(t) || 0, w));
    docs.set(id, m);
  };
  for (const n of g.nodes.values()) {
    if (n.kind === "subject" || n.kind === "type") {
      add(n.id, n.id.replace(/[./-]/g, " "), 4);
      add(n.id, `${n.data.title || ""} ${(n.data.aliases || []).join(" ")}`, 3);
      if (n.kind === "subject") {
        add(n.id, JSON.stringify(n.data.prose || []).replace(/\{\{[^}]*\}\}|\[\[[^\]]*\]\]/g, " "), 1);
        for (const b of n.data.prose || []) line(n.id, typeof b.text === "string" ? b.text.replace(/\{\{[^}]*\}\}/g, "").trim() : "", 1);
      }
    } else if ((n.kind === "claim" || n.kind === "gap") && n.subject) {
      add(n.subject, n.data.statement || n.data.title || "", 1);
      line(n.subject, n.data.statement || n.data.title || "", 0);
    }
  }
  // Company records (company vocabulary: internal app, site and rule names) count against the subjects or
  // types they are about, at weight 1, and their statements can be the line a candidate matched.
  for (const { data } of overlay?.records || []) {
    for (const about of data.about || []) {
      const node = g.nodes.get(about);
      const target = node?.kind === "subject" || node?.kind === "type" ? about : node?.subject;
      if (!target || !docs.has(target)) continue;
      add(target, `${data.title || ""} ${data.statement || ""}`, 1);
      if (data.statement || data.title) line(target, `[company] ${data.statement || data.title}`, 0);
    }
  }
  const df = new Map();
  for (const m of docs.values()) for (const t of m.keys()) df.set(t, (df.get(t) || 0) + 1);
  holder.rankIndex = { docs, df, n: docs.size, lines };
  return holder.rankIndex;
}

/**
 * Fallback when no alias matches: subjects and types ranked by the query's words, each word weighted by how
 * rare it is (inverse document frequency) times where it appears. Deterministic: ties go to the shallower, then
 * the lower ID.
 */
function ranked(g, query, { limit = 8, among = null, overlay = null } = {}) {
  const { docs, df, n } = rankIndex(g, overlay);
  const q = [...new Set(words(query))].filter((t) => df.has(t));
  const scored = [];
  for (const [id, m] of among ? among.map((id) => [id, docs.get(id) || new Map()]) : docs) {
    let score = 0;
    for (const t of q) if (m.has(t)) score += m.get(t) * Math.log(n / df.get(t));
    if (score > 0 || among) scored.push([score, id]);
  }
  // Ties: the shallower subject (a hub before its children), then the lower ID.
  const depth = (id) => id.split(/[./]/).length;
  const order = scored.sort((a, b) => b[0] - a[0] || depth(a[1]) - depth(b[1]) || a[1].localeCompare(b[1])).map(([, id]) => id);
  if (limit == null) return order;
  // Subjects hold the reasoning; a type only lists fields, so types follow the subjects and take at most two places.
  const isType = (id) => g.nodes.get(id)?.kind === "type";
  return [...order.filter((id) => !isType(id)).slice(0, limit), ...order.filter(isType).slice(0, 2)];
}

/**
 * The subject's lines that best fit the query, to choose a candidate by: the best public line (claim statement,
 * gap title or prose) and, kept apart, the best company-record line. Each is null when no word of it fits.
 */
function matchedLines(g, id, query, overlay = null) {
  const { lines, df, n } = rankIndex(g, overlay);
  const q = new Set(words(query));
  const best = { public: [null, 0, Infinity], company: [null, 0, Infinity] };
  for (const [text, rank] of lines.get(id) || []) {
    // Score the words a reader sees, not the IDs inside links: a pointer line ("details are in [[a]] and
    // [[b]]") would otherwise collect the query's words from its targets and beat the claim that answers.
    const seen = text.replace(/\[\[[^\]]*\]\]/g, " ");
    let score = 0;
    for (const t of new Set(words(seen))) if (q.has(t) && df.has(t)) score += Math.log(n / df.get(t));
    const slot = best[text.startsWith("[company] ") ? "company" : "public"];
    if (score > slot[1] || (score === slot[1] && score > 0 && rank < slot[2])) [slot[0], slot[1], slot[2]] = [text, score, rank];
  }
  const cut = (t) => t && (t.length > 200 ? `${t.slice(0, 197)}...` : t);
  return { public: cut(best.public[0]), company: cut(best.company[0]) };
}

/**
 * Where a subject sits: its parent, its children and its siblings (same parent prefix), with titles, so a reader
 * at a hub or a leaf sees the subject next to it that may hold the answer. An area subject (two segments) lists
 * no siblings; `resolve <product>` lists the areas.
 */
function neighborsOf(g, subjectId) {
  const parts = subjectId.split(".");
  const parent = parts.slice(0, -1).join(".");
  const out = [];
  if (parts.length > 2 && g.nodes.get(parent)?.kind === "subject") out.push({ id: parent, title: titleOf(g, parent), rel: "parent" });
  for (const node of g.nodes.values()) {
    if (node.kind !== "subject" || node.id === subjectId) continue;
    const p = node.id.split(".");
    if (p.length === parts.length + 1 && node.id.startsWith(`${subjectId}.`)) out.push({ id: node.id, title: titleOf(g, node.id), rel: "child" });
    else if (parts.length > 2 && p.length === parts.length && node.id.startsWith(`${parent}.`)) out.push({ id: node.id, title: titleOf(g, node.id), rel: "sibling" });
  }
  const order = { parent: 0, child: 1, sibling: 2 };
  return out.sort((a, b) => order[a.rel] - order[b.rel] || a.id.localeCompare(b.id));
}

function titleOf(g, id) {
  const n = g.nodes.get(id);
  return n?.data?.title || n?.data?.statement || id;
}

function itemsOf(g, subjectId, kind) {
  return [...g.nodes.values()].filter((n) => n.kind === kind && n.subject === subjectId);
}

/** The types and fields a subject and its claims bind (`<type>` or `<type>#<field>`). */
function bindsOf(g, subjectId) {
  return [...(g.nodes.get(subjectId).data.binds || []), ...itemsOf(g, subjectId, "claim").flatMap((n) => n.data.binds || [])];
}

/** What company records about a subject can be about: the subject, its claims, and the types and fields they bind. */
function aboutIds(g, subjectId) {
  return new Set([subjectId, ...itemsOf(g, subjectId, "claim").map((n) => n.id), ...bindsOf(g, subjectId)]);
}

function subjectBundle(g, subjectId, ov, ctx) {
  const s = g.nodes.get(subjectId).data;
  const prose = renderProse(g, subjectId, { footnotes: false });
  // A claim inlined in the prose is not repeated: its statement is already there.
  const claims = itemsOf(g, subjectId, "claim").map((n) => {
    const v = claimView(g, n, ctx);
    if (!prose.order.includes(n.local)) return v;
    const { statement, ...rest } = v;
    return { ...rest, in_prose: true };
  });
  const boundFields = new Map(); // type -> Set(field path) | null (whole type)
  const bindAll = bindsOf(g, subjectId);
  for (const b of bindAll) {
    const [t, f] = b.split("#");
    if (!g.nodes.has(t)) continue;
    if (!boundFields.has(t)) boundFields.set(t, new Set());
    if (f) boundFields.get(t).add(f);
  }
  const ids = aboutIds(g, subjectId);
  return {
    subject: {
      id: subjectId, title: s.title,
      ...(s.aliases ? { aliases: s.aliases } : {}),
      related: (s.related || []).map((r) => ({ ...r, title: titleOf(g, r.to) })),
      ...(s.checks ? { checks: s.checks.map((c) => ({ do: c.do, uses: c.uses.map((u) => (g.nodes.has(u) ? u : `${subjectId}:${u}`)) })) } : {}),
      prose,
    },
    neighbors: neighborsOf(g, subjectId),
    claims,
    gaps: itemsOf(g, subjectId, "gap").map(gapView),
    divergences: itemsOf(g, subjectId, "divergence").map((n) => ({
      id: n.id, summary: n.data.summary, impact: n.data.impact,
      positions: n.data.positions.map((p) => ({ says: p.says, citation: citations(g, [p.evidence], ctx)[0] })),
      ...(n.data.resolution ? { resolution: { ...n.data.resolution, by: qualify(subjectId, n.data.resolution.by) } } : {}),
    })),
    // Cases default to their request and expectation; --cases adds the synthetic configs.
    cases: itemsOf(g, subjectId, "case").map((n) => {
      const { config, ...rest } = n.data;
      return {
        id: n.id, ...rest, ...(ctx.cases === "full" ? { config } : {}),
        claims: n.data.claims.map((c) => qualify(subjectId, c)),
        expect: { ...n.data.expect, ...(n.data.expect.gap ? { gap: qualify(subjectId, n.data.expect.gap) } : {}) },
      };
    }),
    types: [...boundFields.entries()].sort().map(([t, fs_]) => typeView(g, t, fs_.size ? fs_ : null, ov)),
    company: companyFacets(ov, ids),
  };
}

function typeBundle(g, typeId, focusField, ov, ctx) {
  const bound = [...(g.bindsTo.get(focusField ? `${typeId}#${focusField}` : typeId) || [])].sort();
  const subjects = new Map();
  const gaps = [];
  for (const id of bound) {
    const n = g.nodes.get(id);
    if (n.kind === "gap") { gaps.push(gapView(n)); continue; }
    const sid = n.kind === "subject" ? n.id : n.subject;
    if (!subjects.has(sid)) subjects.set(sid, { id: sid, title: titleOf(g, sid), claims: [] });
    if (n.kind === "claim") subjects.get(sid).claims.push({ id: n.id, statement: n.data.statement, tier: n.data.tier, confidence: confidenceOf(n.data), ...(n.data.binds ? { binds: n.data.binds } : {}) });
  }
  const fieldIds = Object.keys(g.nodes.get(typeId).data.fields).map((f) => `${typeId}#${f}`);
  return {
    type: typeView(g, typeId, focusField ? new Set([focusField]) : null, ov),
    subjects: [...subjects.values()],
    gaps,
    company: companyFacets(ov, new Set([typeId, ...fieldIds])),
    hint: "Resolve a subject ID for its full reasoning and citations.",
  };
}

// ---------------------------------------------------------------- render

/** Prose blocks as reading text (markers still in place). This is output only; the JSON is the source. */
export function proseText(blocks = []) {
  const entry = (e) => (e.label ? `**${e.label}** ${e.text}` : e.text);
  return blocks
    .map((b) => {
      if (b.heading) return `## ${b.heading}`;
      const intro = b.label ? `**${b.label}**\n` : "";
      if (b.steps) return intro + b.steps.map((e, i) => `${i + 1}. ${entry(e)}`).join("\n");
      if (b.items) return intro + b.items.map((e) => `- ${entry(e)}`).join("\n");
      if (b.table) {
        const row = (cells) => `| ${cells.join(" | ")} |`;
        return [row(b.table.columns), row(b.table.columns.map(() => "---")), ...b.table.rows.map(row)].join("\n");
      }
      return entry(b);
    })
    .join("\n\n");
}

/** Render a subject's prose with claims inlined. With footnotes, citations are appended. */
export function renderProse(g, subjectId, { footnotes = true, qualified = false } = {}) {
  const node = g.nodes.get(subjectId);
  const text = proseText(node.data.prose);
  const order = [];
  const num = (local) => {
    if (!order.includes(local)) order.push(local);
    return order.indexOf(local) + 1;
  };
  // qualified: marks carry the full citable ID (`[subject:local]`), for text read outside the subject.
  const at = (local) => (qualified ? `${subjectId}:${local}` : local);
  let out = text.replace(/\{\{([a-z0-9]+(?:-[a-z0-9]+)*)(\|ref)?\}\}/g, (_, local, ref) => {
    const claim = node.data.claims?.[local];
    if (!claim) return `{{${local}}}`;
    const n = num(local);
    const mark = footnotes ? `[^${n}]` : `[${at(local)}]`;
    return ref ? mark : `${claim.statement} ${mark}`;
  });
  // A gap or divergence is listed with the subject; the prose points at it.
  out = out.replace(/\{\{(gap|divergence):([a-z0-9]+(?:-[a-z0-9]+)*)\}\}/g, (_, kind, local) => {
    const item = node.data[`${kind}s`]?.[local];
    if (!item) return `{{${kind}:${local}}}`;
    if (!footnotes) return `[${kind}:${at(local)}]`;
    // Say what state the item is in: a resolved gap or divergence is not an open question.
    if (kind === "gap") return `(${item.status || "open"} gap \`${local}\`)`;
    return `(${item.resolution ? "resolved divergence" : "divergence"} \`${local}\`)`;
  });
  out = out.replace(/\[\[doc:([^\]\s]+)\]\]/g, (_, doc) => `\`${doc}\``);
  out = out.replace(/\[\[([^\]\s]+)\]\]/g, (_, id) => (g.nodes.has(id) ? `[${titleOf(g, id)}](kb:${id})` : `[[${id}]]`));
  return { text: out, order };
}

export function renderSubject(g, subjectId) {
  const node = g.nodes.get(subjectId);
  const s = node.data;
  const cache = new Map();
  const { text, order } = renderProse(g, subjectId, { footnotes: true });
  const parts = [`# ${s.title}`, "", `\`${subjectId}\``, ""];
  if (text) parts.push(text, "");
  if (s.checks) {
    parts.push("## What to check", "");
    s.checks.forEach((c, i) => parts.push(`${i + 1}. ${c.do} (${c.uses.map((u) => `\`${u}\``).join(", ")})`));
    parts.push("");
  }
  const claims = Object.keys(s.claims || {});
  const further = claims.filter((c) => !order.includes(c));
  if (further.length) {
    parts.push("## Further facts", "");
    for (const c of further) parts.push(`- ${s.claims[c].statement} [^${order.push(c)}]`);
    parts.push("");
  }
  const divs = Object.entries(s.divergences || {});
  if (divs.length) {
    parts.push("## Divergences", "");
    for (const [id, d] of divs) {
      parts.push(`### ${id}`, "", d.summary, "");
      for (const p of d.positions) parts.push(`- **${p.evidence.source}:** ${p.says} (${citeLine(g, p.evidence, cache)})`);
      parts.push("", `Impact: ${d.impact}`, "");
    }
  }
  const gaps = Object.entries(s.gaps || {}).filter(([, gp]) => gp.status !== "resolved");
  if (gaps.length) {
    parts.push("## Open gaps", "");
    for (const [id, gp] of gaps) {
      const extra = gp.kind === "data" ? ` Resolvable by: ${(gp.resolvable_by || []).join(", ")}.${gp.live_command ? ` Live: \`${gp.live_command}\`.` : ""}` : "";
      parts.push(`- **${gp.title}** (\`${subjectId}:${id}\`, ${gp.kind}, ${gp.status}${gp.former_ids ? `; formerly ${gp.former_ids.join(", ")}` : ""}).${gp.blocks ? ` Blocks ${gp.blocks}.` : ""}${extra}`);
    }
    parts.push("");
  }
  const cases = Object.entries(s.cases || {});
  if (cases.length) {
    parts.push("## Cases", "");
    for (const [id, c] of cases) parts.push(`- \`${id}\`: ${JSON.stringify(c.request)} → ${JSON.stringify(c.expect)}${c.note ? ` (${c.note})` : ""}`);
    parts.push("");
  }
  if (order.length) {
    parts.push("## Sources", "");
    order.forEach((c, i) => {
      const claim = s.claims[c];
      const cites = (claim.evidence || []).map((ev) => {
        const dated = materialDate(g, ev, cache);
        return citeLine(g, ev, cache) + (dated ? `, as of ${dated.as_of} (${dated.basis})` : "");
      });
      if (claim.derived_from?.length) cites.push(`derived from ${claim.derived_from.map((d) => `\`${d}\``).join(", ")}`);
      parts.push(`[^${i + 1}]: Tier ${claim.tier}. ${cites.join("; ")}`);
    });
    parts.push("");
  }
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

// ---------------------------------------------------------------- map + read (the agent's retrieval path)

/** The typed edges a spine lists: what decides, scopes, reaches, interacts with, depends on or logs a subject. */
export const TYPED_EDGES = ["decided-by", "scoped-by", "reached-via", "interacts-with", "depends-on", "logged-in"];

/** The subject's opening claim: the first claim its prose inlines, else its first claim; one sentence, clipped. */
function leadOf(s) {
  const first = JSON.stringify(s.prose || []).match(/\{\{([a-z0-9]+(?:-[a-z0-9]+)*)\}\}/)?.[1];
  const claim = s.claims?.[first] || Object.values(s.claims || {})[0];
  if (!claim) return undefined;
  const sentence = claim.statement.replace(/\s+/g, " ").match(/^.+?[.!?](?=\s|$)/)?.[0] || claim.statement;
  return sentence.length > 160 ? `${sentence.slice(0, 157)}...` : sentence;
}

// A type (`zia/web-log`) is its own target; a subject belongs to the area its first two segments name.
export const areaOf = (id) => (id.includes("/") ? id : id.split(".").slice(0, 2).join("."));

/** The spine: per product, every area with its subjects, their leads and typed edges (scripts/gen-spine.mjs writes it). */
export function spines(g) {
  const products = new Map();
  const subjects = [...g.nodes.values()].filter((n) => n.kind === "subject").sort((a, b) => a.id.localeCompare(b.id));
  for (const n of subjects) {
    const product = n.id.split(".")[0];
    const area = areaOf(n.id);
    if (!products.has(product)) products.set(product, new Map());
    const areas = products.get(product);
    if (!areas.has(area)) areas.set(area, []);
    const s = n.data;
    const edges = {};
    for (const e of s.related || []) {
      if (!TYPED_EDGES.includes(e.rel)) continue;
      edges[e.rel] ||= [];
      edges[e.rel].push(e.to);
    }
    const lead = leadOf(s);
    areas.get(area).push({ id: n.id, title: s.title, ...(lead ? { lead } : {}), ...(Object.keys(edges).length ? { edges } : {}) });
  }
  const out = {};
  for (const [product, areas] of products) {
    out[product] = {
      product,
      generated_by: "scripts/gen-spine.mjs",
      read_with: "node scripts/kb.mjs read <area | subject | type> ...",
      areas: [...areas].map(([id, subs]) => ({ id, ...(g.nodes.get(id)?.kind === "subject" ? { title: g.nodes.get(id).data.title } : {}), subjects: subs })),
    };
  }
  return out;
}

const subjectsOf = (g) => [...g.nodes.values()].filter((n) => n.kind === "subject").sort((a, b) => a.id.localeCompare(b.id));

/**
 * The spine as reading text: every subject by area with its title, its opening fact and its typed edges, and the log,
 * API and config types. The same content as references/_meta/spine/<product>.json (scripts/gen-spine.mjs). An agent
 * reads it for the products a question involves, works out which mechanisms and evidence matter, and picks subjects
 * by their facts and edges, not by matching the question's words.
 */
export function subjectMap(g, prefixes = []) {
  const want = (id) => !prefixes.length || prefixes.some((p) => id === p || id.startsWith(`${p}.`) || id.startsWith(`${p}/`));
  const out = [];
  for (const spine of Object.values(spines(g))) {
    for (const area of spine.areas) {
      const subs = area.subjects.filter((x) => want(x.id));
      if (!subs.length) continue;
      const tokens = subs.reduce((sum, x) => sum + readSubject(g, x.id).length, 0) / 4;
      out.push(`## ${area.id} (${subs.length} subject${subs.length > 1 ? "s" : ""}, ~${Math.max(1, Math.round(tokens / 1000))}k tokens)`);
      for (const x of subs) {
        const edges = Object.entries(x.edges || {}).map(([rel, to]) => `${rel}: ${to.join(", ")}`).join("; ");
        out.push(`${x.id === area.id ? area.id : x.id.slice(area.id.length)} — ${x.title}${x.lead ? ` | ${x.lead}` : ""}${edges ? ` | ${edges}` : ""}`);
      }
    }
  }
  const types = [...g.nodes.values()].filter((n) => n.kind === "type" && want(n.id)).sort((x, y) => x.id.localeCompare(y.id));
  if (types.length) {
    out.push("## Types (fields of logs, API objects and config; read one by ID)");
    for (const t of types) out.push(`${t.id}${t.data.title ? ` — ${t.data.title}` : ""}`);
  }
  return `${out.join("\n")}\n`;
}

/**
 * One subject as reading text: prose with every claim inlined and marked with its citable ID, the claims the prose
 * does not carry, and the open gaps. No evidence quotes: they are for verifying a claim, not for answering.
 */
function readSubject(g, id) {
  const s = g.nodes.get(id).data;
  const { text, order } = renderProse(g, id, { footnotes: false, qualified: true });
  const parts = [`# ${s.title} (${id})`, text];
  if (s.checks) parts.push(`What to check:\n${s.checks.map((c, i) => `${i + 1}. ${c.do}`).join("\n")}`);
  const further = Object.entries(s.claims || {}).filter(([local]) => !order.includes(local));
  if (further.length) parts.push(`Further facts:\n${further.map(([local, c]) => `- ${c.statement} [${id}:${local}]`).join("\n")}`);
  // What an answer must say about the claims it rests on: an inference names its conditions.
  const inferred = Object.entries(s.claims || {}).filter(([, c]) => c.tier !== "A");
  if (inferred.length) parts.push(`Inferred, not quoted (say so when an answer rests on one):\n${inferred.map(([local, c]) => `- [${id}:${local}] Tier ${c.tier}${c.conditions ? `: ${c.conditions}` : ""}`).join("\n")}`);
  const divs = Object.entries(s.divergences || {});
  if (divs.length) {
    parts.push(`Sources disagree (name both sides):\n${divs.map(([local, d]) => [
      `- ${d.summary} [divergence:${id}:${local}]`,
      ...d.positions.map((x) => `  - ${x.evidence.source}: ${x.says}`),
      ...(d.impact ? [`  Impact: ${d.impact}`] : []),
      ...(d.resolution ? [`  Resolved (${d.resolution.rule}) by ${qualify(id, d.resolution.by)}${d.resolution.note ? `: ${d.resolution.note}` : ""}`] : []),
    ].join("\n")).join("\n")}`);
  }
  const gaps = Object.entries(s.gaps || {}).filter(([, gp]) => gp.status !== "resolved");
  // A data gap names the tier that can fill it; any gap names what would settle it.
  const fill = (gp) => [
    gp.resolvable_by && `filled by ${gp.resolvable_by.join(" or ")}`,
    gp.live_command && `run \`${gp.live_command}\``,
    gp.resolves_with && `settled by ${gp.resolves_with.join(" or ")}`,
  ].filter(Boolean).join("; ");
  if (gaps.length) parts.push(`Not known (open gaps):\n${gaps.map(([local, gp]) => `- ${gp.title} [gap:${id}:${local}]${gp.kind === "data" ? " (data gap)" : ""}${fill(gp) ? `: ${fill(gp)}` : ""}${gp.blocks ? `. Blocks: ${gp.blocks}` : ""}`).join("\n")}`);
  return parts.filter(Boolean).join("\n\n");
}

/** A type as reading text: one line per field, or per field in `paths`. */
function readType(g, id, paths = null) {
  const t = g.nodes.get(id).data;
  const lines = Object.entries(t.fields).filter(([p]) => !paths || paths.includes(p)).map(([p, f]) => `- ${p}${f.label ? ` (${f.label})` : ""}${f.type ? ` ${f.type}` : ""}${f.description ? `: ${f.description}` : ""}`);
  return [`# ${t.title || id} (${id})`, ...lines].join("\n");
}

/**
 * Company records about the given IDs, as reading text: what each says, where it holds (scope), how sure and how
 * recent it is, and its field map or IaC locations. A map keeps only the fields asked about when any are.
 */
function readCompany(ov, ids, shown = new Set()) {
  return companyFacets(ov, ids).filter((f) => !shown.has(f.id) && shown.add(f.id)).map((f) => {
    const head = `- [${f.id}] ${f.kind}, ${f.relation} ${f.about.join(", ")}: ${f.title}${f.statement ? `. ${f.statement}` : ""}`;
    const scope = f.scope ? Object.entries(f.scope).map(([k, v]) => `${k} ${v}`).join("; ") : "";
    const sure = [f.confidence && `confidence ${f.confidence}`, f.validated && `validated ${f.validated}`, f.refresh && `refreshed every ${f.refresh}`].filter(Boolean).join(", ");
    const entries = Object.entries(f.map || {});
    const asked = entries.filter(([k]) => ids.has(k));
    const map = (asked.length ? asked : entries).map(([k, v]) => `  - ${k} is ${v}`);
    const dropped = (f.dropped_fields || []).filter((d) => !asked.length || ids.has(d));
    const iac = (f.iac || []).map((p) => `  - IaC ${p.label ? `${p.label}: ` : ""}${p.location || p.source}${p.value !== undefined ? ` = ${JSON.stringify(p.value)}` : ""}${p.committed ? ` (committed ${p.committed})` : ""}${p.error ? ` (unresolved: ${p.error})` : ""}`);
    return [
      head,
      ...(scope ? [`  Scope: ${scope}`] : []),
      ...(sure ? [`  ${sure[0].toUpperCase()}${sure.slice(1)}`] : []),
      ...(f.system ? [`  Stored in: ${f.system}`] : []),
      ...map,
      ...(dropped.length ? [`  Not stored: ${dropped.join(", ")}`] : []),
      ...(f.do_not_infer ? [`  Do not infer: ${f.do_not_infer}`] : []),
      ...iac,
    ].join("\n");
  }).join("\n");
}

// How strongly `read` follows each edge type: the mechanisms that settle an outcome first, prose links next.
// see-also and configured-via are listed by title, not read; so is any type (a log's field list is long).
const FOLLOW = { "decided-by": 3, "scoped-by": 3, "interacts-with": 3, "depends-on": 3, "reached-via": 3, "logged-in": 3, "links-to": 2, "configured-via": 0, "see-also": 0 };

/**
 * A subject's outgoing edges: its typed `related` entries, the typed edges of the hubs above it (a child shares what
 * decides, scopes and logs its parent), then the subjects its prose links to.
 */
function edgesOf(g, id) {
  const n = g.nodes.get(id);
  const out = (n.data.related || []).map((e) => ({ to: e.to, rel: e.rel, because: e.because }));
  const parts = id.split(".");
  for (let i = parts.length - 1; i >= 2; i--) {
    const hub = g.nodes.get(parts.slice(0, i).join("."));
    if (hub?.kind !== "subject") continue;
    for (const e of hub.data.related || []) if (FOLLOW[e.rel] >= 3 && e.to !== id) out.push({ to: e.to, rel: e.rel, because: e.because, via: hub.id });
  }
  for (const m of JSON.stringify(n.data.prose || []).matchAll(/\[\[([^\]:#|]+)/g)) {
    const to = g.nodes.get(m[1])?.kind === "subject" ? m[1] : g.nodes.get(m[1])?.subject;
    if (to && to !== id) out.push({ to, rel: "links-to" });
  }
  return out.filter((e) => ["subject", "type"].includes(g.nodes.get(e.to)?.kind));
}

/**
 * Read areas, subjects, types and fields as text, then walk the graph one hop. An argument is a field ID
 * (`zia/web-log#ssldecrypted`), a type ID, or a subject, area or product ID (`zia.ssl-inspection.actions`,
 * `zia.ssl-inspection`, `zpa`), which reads that subject and every subject under it. The subjects those point to are
 * read next, the ones most of the reading set points to first, until `budget` tokens; every other neighbour prints as
 * one line with the claim that establishes its edge. With an overlay, each subject is followed by the company records
 * about it.
 *
 * Output can run past what a runtime shows inline; runtimes save it to a file the reader opens. Measured on the
 * proxy questions, capping it lost more facts than the read-back costs.
 */
export function readText(g, args, ov = null, { hops = 1, budget = 15000 } = {}) {
  const out = [];
  // IaC locations name a repo by ID; say where each repo is, so the reader can open the files.
  const repos = (ov?.iacRepos || []).filter((r) => r.available);
  if (repos.length) out.push(`IaC repos: ${repos.map((r) => `${r.id} = ${r.path}/${r.committed ? ` (last commit ${r.committed})` : ""}`).join("; ")}`);
  const seen = new Set();
  const shown = new Set(); // company records already printed in this read
  const emit = (id) => {
    seen.add(id);
    const n = g.nodes.get(id);
    const text = n.kind === "type" ? readType(g, id) : readSubject(g, id);
    out.push(text);
    const company = ov ? readCompany(ov, n.kind === "type" ? new Set([id, ...Object.keys(n.data.fields).map((f) => `${id}#${f}`)]) : aboutIds(g, id), shown) : "";
    if (company) out.push(`Company records:\n${company}`);
    return text.length / 4;
  };
  const fields = new Map();
  for (const arg of args) {
    const node = g.nodes.get(arg);
    if (node?.kind === "field") {
      fields.set(node.type, [...(fields.get(node.type) || []), node.path]);
      continue;
    }
    // A subject reads with everything under it, so an area's ID (also its hub subject) reads the whole area.
    const ids = node?.kind === "type" ? [arg]
      : subjectsOf(g).map((n) => n.id).filter((id) => id === arg || id.startsWith(`${arg}.`));
    if (!ids.length) out.push(`# ${arg}: no subject, type, field or area has this ID; check the spine`);
    for (const id of ids) if (!seen.has(id)) emit(id);
  }
  for (const [type, paths] of fields) {
    out.push(readType(g, type, paths));
    const company = ov ? readCompany(ov, new Set([type, ...paths.map((p) => `${type}#${p}`)]), shown) : "";
    if (company) out.push(`Company records:\n${company}`);
  }
  for (let hop = 0; hop < hops; hop++) {
    // Neighbours of everything read so far, ranked by the weight of the edges pointing at them.
    const votes = new Map();
    for (const id of seen) {
      if (g.nodes.get(id).kind !== "subject") continue;
      for (const e of edgesOf(g, id)) {
        if (seen.has(e.to) || !FOLLOW[e.rel]) continue;
        const v = votes.get(e.to) || { w: 0, edges: [] };
        v.w += FOLLOW[e.rel];
        v.edges.push({ ...e, from: e.via || id });
        votes.set(e.to, v);
      }
    }
    const ranked = [...votes.entries()].sort((a, b) => b[1].w - a[1].w || a[0].localeCompare(b[0]));
    if (!ranked.length) break;
    out.push(`## Linked subjects (one hop from what was read)`);
    let spent = 0;
    const listed = [];
    for (const [id, v] of ranked) {
      const cost = g.nodes.get(id).kind === "subject" ? readSubject(g, id).length / 4 : Infinity;
      if (spent + cost <= budget) {
        spent += emit(id);
        continue;
      }
      // The edge and the claim that establishes it.
      const e = v.edges.find((x) => x.because) || v.edges[0];
      const because = e.because && g.nodes.get(e.because)?.data?.statement;
      listed.push(`- ${e.rel} ${id} (${titleOf(g, id)}), from ${e.from}${because ? `: ${because} [${e.because}]` : ""}`);
    }
    if (listed.length) out.push(fit("Linked, not read here (each with the claim that links it; read one by ID for the rest):", listed, 12000, "linked subjects"));
  }
  return `${out.join("\n\n")}\n`;
}

/** A heading and as many lines as fit in `room` characters, then a count of the rest. */
function fit(head, lines, room, what) {
  const kept = [];
  let size = head.length;
  for (const l of lines) {
    if (size + l.length + 1 > room) break;
    kept.push(l);
    size += l.length + 1;
  }
  const more = lines.length - kept.length;
  return [head, ...kept, ...(more ? [`- and ${more} more ${what}`] : [])].join("\n");
}

function citeLine(g, ev, cache) {
  const root = g.sources.sources[ev.source]?.root;
  if (ev.pointer !== undefined) return `\`${root}/${ev.path}\` at \`${ev.pointer}\``;
  const r = anchorEvidence(g, ev, cache);
  const lines = r.anchors.map((a) => a.line).filter(Boolean);
  const where = lines.length ? `:${[...new Set(lines)].join(",")}` : "";
  // Lines come from the pin when listed, otherwise from the first ref; say which.
  const refs = ev.at ? ` (at ${ev.at.join(", ")}; lines from ${ev.at.includes("HEAD") ? "HEAD" : ev.at[0]})` : "";
  return `\`${root}/${ev.path}${where}\`${refs} — "${ev.quotes.map((q) => q.trim()).join(" … ")}"`;
}

// ---------------------------------------------------------------- manifest + verified

/** Add or refresh capture-manifest entries for every cited capture file. */
export function updateManifest(g) {
  const files = { ...g.manifest.files };
  const cited = new Set();
  for (const { ev } of allEvidence(g)) {
    const src = g.sources.sources[ev.source];
    if (src?.kind === "capture") cited.add(`${src.root}/${ev.path}`);
  }
  let changed = 0;
  // A renamed or deleted capture leaves no file behind; its entry goes too.
  for (const file of Object.keys(files)) {
    if (!fs.existsSync(path.join(g.root, file))) {
      delete files[file];
      changed++;
    }
  }
  for (const file of [...cited].sort()) {
    const full = path.join(g.root, file);
    if (!fs.existsSync(full)) continue;
    const sha = sha256File(full);
    const prev = files[file];
    // A help capture carries its own provenance; older text captures name it in a header.
    const doc = file.endsWith(".json") ? readJson(full) : null;
    const head = doc ? "" : fs.readFileSync(full, "utf8").slice(0, 600);
    const url =
      (doc?.kind === "help-article" || doc?.kind === "github-issue" ? doc.source.url : null) ||
      head.match(/^URL:\s*(\S+)/m)?.[1] ||
      head.match(/^\*{0,2}Source:\*{0,2}\s*(https?:\/\/\S+)/m)?.[1] ||
      prev?.captured_from ||
      null;
    if (prev?.sha256 === sha && prev.captured_from === url) continue;
    const captured =
      (doc?.kind === "help-article" || doc?.kind === "github-issue" ? doc.captured_at : null) ||
      head.match(/Captured:\*{0,2}\s*(\d{4}-\d{2}-\d{2})/)?.[1] ||
      gitDate(g.root, file);
    // The material date survives a refresh; a first-seen date moves to today when the content changed.
    const material = prev?.updated
      ? prev.updated_basis === "first-seen" && prev.sha256 !== sha
        ? { updated: new Date().toISOString().slice(0, 10), updated_basis: "first-seen" }
        : { updated: prev.updated, updated_basis: prev.updated_basis }
      : doc?.source?.updated
        ? { updated: doc.source.updated, updated_basis: doc.source.updated_basis }
        : {};
    files[file] = { captured_from: url, captured_at: captured, sha256: sha, ...material };
    changed++;
  }
  const sorted = Object.fromEntries(Object.entries(files).sort());
  fs.writeFileSync(path.join(g.root, META, "capture-manifest.json"), JSON.stringify({ schema_version: 1, files: sorted }, null, 2) + "\n");
  return changed;
}

function gitDate(root, file) {
  try {
    const out = execFileSync("git", ["-C", root, "log", "-1", "--format=%cs", "--", file], { encoding: "utf8" }).trim();
    return out || new Date().toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Regenerate verified.json: per source, its pin and the result of the last check.
 * checked_at only moves when the pin or the result changes, so the file churns
 * only on real change.
 */
export function updateVerified(g, today = new Date().toISOString().slice(0, 10)) {
  const file = path.join(g.root, META, "verified.json");
  const prev = fs.existsSync(file) ? readJson(file).sources : {};
  const results = {};
  const cache = new Map();
  for (const { ev } of allEvidence(g)) {
    const r = anchorEvidence(g, ev, cache);
    if (!results[ev.source]) results[ev.source] = { citations: 0, failing: 0 };
    const s = results[ev.source];
    s.citations++;
    if (!r.ok) s.failing++;
  }
  const sources = {};
  for (const id of Object.keys(results).sort()) {
    const src = g.sources.sources[id];
    const pin = src.kind === "submodule"
      ? gitlink(g.root, src.root)
      : `manifest:${sha256OfManifest(g, src.root)}`;
    const entry = { kind: src.kind, pin, ...results[id] };
    const old = prev[id];
    entry.checked_at = old && old.pin === entry.pin && old.citations === entry.citations && old.failing === entry.failing ? old.checked_at : today;
    sources[id] = entry;
  }
  fs.writeFileSync(file, JSON.stringify({ schema_version: 1, generated_by: "node scripts/kb.mjs verified", sources }, null, 2) + "\n");
  return sources;
}

function sha256OfManifest(g, root) {
  const entries = Object.entries(g.manifest.files).filter(([f]) => f.startsWith(root + "/")).sort();
  return entries.length ? sha256String(JSON.stringify(entries)).slice(0, 16) : "empty";
}
function sha256String(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

// ---------------------------------------------------------------- CLI glue

/** The company overlay at `<runtime-data mount>/overlay`, when that directory has an overlay.json. */
function defaultOverlay(root) {
  const dir = path.resolve(root, runtimeDataMountSettings(root).mountPath, "overlay");
  return fs.existsSync(path.join(dir, "overlay.json")) ? dir : null;
}

/**
 * The overlay as resolve uses it: a record that fails validation is dropped with a warning on stderr, so one bad
 * record or a repo that is not checked out never fails a resolve. A pointer that does not resolve keeps its record
 * (its facet entry carries the error). `scripts/check-data-contract.mjs` is the strict check.
 */
export function usableOverlay(g, ov) {
  const errors = validateOverlay(g, ov);
  const bad = new Set();
  for (const e of errors) {
    console.error(e.pointer ? `overlay pointer unresolved (record kept): ${e.file}: ${e.message}` : `overlay record skipped: ${e.file}: ${e.message}`);
    if (!e.pointer) bad.add(e.file);
  }
  return { ...ov, records: ov.records.filter((r) => !bad.has(r.file)) };
}

export async function runCommand(root, g, cmd, args, { option, usage }) {
  const overlayDir = args.includes("--no-overlay") ? null : option(args, "--overlay") ?? process.env.ZSCALER_KB_OVERLAY ?? defaultOverlay(root);
  const ov = overlayDir ? usableOverlay(g, loadOverlay(g, overlayDir)) : null;
  if (cmd === "resolve") {
    // Compact JSON by default: indentation costs agents about a quarter of a bundle's tokens.
    const pretty = args.includes("--pretty");
    const cases = args.includes("--cases") ? "full" : "summary";
    const evidence = args.includes("--evidence");
    // --compact: one-line claims and labels only (compactBundle), for scanning several subjects cheaply.
    // --company: company facets only, for the finishing call of an overlay answer.
    const view = args.includes("--company") ? companyBundle : args.includes("--compact") ? (b) => compactBundle(g, b) : (b) => b;
    const words = args.filter((a) => !["--pretty", "--cases", "--evidence", "--each", "--no-overlay", "--compact", "--company"].includes(a));
    // An unknown flag (--help, a typo) would otherwise become search text and return unrelated candidates.
    const unknown = words.find((a) => a.startsWith("--"));
    if (unknown) usage(`resolve: unknown option ${unknown}; resolve <id | text> [--each] [--compact | --company] [--overlay <dir> | --no-overlay] [--evidence] [--cases] [--pretty]`);
    // --each: every argument is its own query (an ID, or quoted text), returned as one JSON array, so an agent
    // reads several subjects in one call instead of one round trip each.
    if (args.includes("--each")) {
      if (!words.length) usage("resolve --each needs one or more IDs");
      const bundles = words.map((q) => view(resolve(g, q, { overlay: ov, cases, evidence })));
      process.stdout.write(JSON.stringify(bundles, null, pretty ? 2 : 0) + "\n");
      return 0;
    }
    const query = words.join(" ").trim();
    if (!query) usage("resolve needs an ID or text");
    process.stdout.write(JSON.stringify(view(resolve(g, query, { overlay: ov, cases, evidence })), null, pretty ? 2 : 0) + "\n");
    return 0;
  }
  if (cmd === "map") {
    process.stdout.write(subjectMap(g, args.filter((a) => !a.startsWith("--"))));
    return 0;
  }
  if (cmd === "read") {
    const ids = args.filter((a) => !a.startsWith("--"));
    const unknown = args.find((a) => a.startsWith("--") && !["--no-links", "--no-overlay"].includes(a));
    if (unknown) usage(`read: unknown option ${unknown}; read <subject | area | type | field> ... [--no-links] [--overlay <dir> | --no-overlay]`);
    if (!ids.length) usage("read needs one or more area, subject or type IDs");
    process.stdout.write(readText(g, ids, ov, { hops: args.includes("--no-links") ? 0 : 1 }));
    return 0;
  }
  if (cmd === "render") {
    const id = args[0];
    if (!id || g.nodes.get(id)?.kind !== "subject") usage("render needs a subject ID");
    process.stdout.write(renderSubject(g, id));
    return 0;
  }
  if (cmd === "manifest") {
    console.log(`capture manifest: ${updateManifest(g)} entries added or refreshed`);
    return 0;
  }
  if (cmd === "verified") {
    const s = updateVerified(g);
    for (const [id, v] of Object.entries(s)) console.log(`${id}: ${v.citations} citations, ${v.failing} failing, pin ${v.pin}`);
    return Object.values(s).some((v) => v.failing) ? 1 : 0;
  }
  if (cmd === "migrate-links") {
    const { migrateLinks } = await import("./kb-migrate.mjs");
    return migrateLinks(root, g, args);
  }
  usage(`unknown command ${cmd}`);
  return 2;
}

export { ID, idKind };
