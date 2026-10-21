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
  return { root, config, records };
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
        if (data.relation === "narrows" || data.relation === "contradicts") {
          need(kinds.every((k) => k === "claim"), `${data.relation} must target public claims only`);
          need(Boolean(data.scope), `${data.relation} requires scope`);
        }
        if (data.relation === "contradicts") need((data.evidence || []).length > 0, "contradicts requires evidence");
        break;
      case "procedure":
        need(data.relation === "extends", "a procedure's relation is extends");
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
        need(Boolean(ov.config.iac), "iac-coverage needs overlay.json iac");
        for (const p of data.pointers || []) {
          const r = resolveOverlayPointer(ov, p);
          if (r.error) err(file, r.error);
        }
        break;
      }
    }
    if (data.status === "promoted") need(g.nodes.get(data.promoted_to)?.kind === "claim", "promoted records need promoted_to: a public claim ID");
    if (data.status !== "promoted" && data.promoted_to) err(file, "promoted_to is only for promoted records");
  }
  return errors;
}

function resolveOverlayPointer(ov, p) {
  if (!ov.config.iac) return { error: "no iac repo configured in overlay.json" };
  const repoRoot = path.resolve(ov.root, ov.config.iac.path);
  const file = path.resolve(repoRoot, p.file);
  if (!file.startsWith(repoRoot + path.sep)) return { error: `pointer file escapes the IaC repo: ${p.file}` };
  if (!fs.existsSync(file)) return { error: `IaC file not found: ${p.file}` };
  const value = resolvePointer(readJson(file), p.pointer);
  if (value === undefined) return { error: `IaC pointer does not resolve: ${p.file}#${p.pointer}` };
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
      ...(data.scope ? { scope: data.scope } : {}),
      ...(data.confidence ? { confidence: data.confidence } : {}),
      ...(data.map ? { map: data.map } : {}),
      ...(data.dropped_fields ? { dropped_fields: data.dropped_fields } : {}),
      ...(data.refresh ? { refresh: data.refresh } : {}),
      ...(data.evidence ? { evidence: data.evidence } : {}),
    };
    if (data.pointers) {
      facet.iac = data.pointers.map((p) => ({ label: p.label, source: `${p.file}#${p.pointer}`, value: resolveOverlayPointer(ov, p).value ?? null }));
    }
    out.push(facet);
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

function tiers(ov) {
  return {
    knowledge: { public: true, company: Boolean(ov) },
    iac: { available: Boolean(ov?.config.iac) },
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
          const matched = match === "ranked" ? matchedLine(g, h, query, overlay) : null;
          return { id: h, kind: g.nodes.get(h).kind, title: titleOf(g, h), ...(matched ? { matched } : {}) };
        }),
      };
    }
  }
  const node = g.nodes.get(id);
  if (node.kind === "type" || node.kind === "field") return { ...base, resolved: { id, kind: node.kind }, ...typeBundle(g, node.kind === "type" ? id : node.type, node.kind === "field" ? node.path : null, overlay, ctx) };
  const subjectId = node.kind === "subject" ? id : node.subject;
  return { ...base, resolved: { id, kind: node.kind }, ...(node.kind !== "subject" ? { focus: id } : {}), ...subjectBundle(g, subjectId, overlay, ctx) };
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

/** The subject's line (claim statement, gap title or prose) that best fits the query, to choose a candidate by. */
function matchedLine(g, id, query, overlay = null) {
  const { lines, df, n } = rankIndex(g, overlay);
  const q = new Set(words(query));
  let best = null;
  let bestScore = 0;
  let bestRank = Infinity;
  for (const [text, rank] of lines.get(id) || []) {
    // Score the words a reader sees, not the IDs inside links: a pointer line ("details are in [[a]] and
    // [[b]]") would otherwise collect the query's words from its targets and beat the claim that answers.
    const seen = text.replace(/\[\[[^\]]*\]\]/g, " ");
    let score = 0;
    for (const t of new Set(words(seen))) if (q.has(t) && df.has(t)) score += Math.log(n / df.get(t));
    if (score > bestScore || (score === bestScore && score > 0 && rank < bestRank)) [best, bestScore, bestRank] = [text, score, rank];
  }
  return best && (best.length > 200 ? `${best.slice(0, 197)}...` : best);
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
  const bindAll = [...(s.binds || []), ...claims.flatMap((c) => c.binds || [])];
  for (const b of bindAll) {
    const [t, f] = b.split("#");
    if (!g.nodes.has(t)) continue;
    if (!boundFields.has(t)) boundFields.set(t, new Set());
    if (f) boundFields.get(t).add(f);
  }
  const ids = new Set([subjectId, ...claims.map((c) => c.id), ...bindAll]);
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
export function renderProse(g, subjectId, { footnotes = true } = {}) {
  const node = g.nodes.get(subjectId);
  const text = proseText(node.data.prose);
  const order = [];
  const num = (local) => {
    if (!order.includes(local)) order.push(local);
    return order.indexOf(local) + 1;
  };
  let out = text.replace(/\{\{([a-z0-9]+(?:-[a-z0-9]+)*)(\|ref)?\}\}/g, (_, local, ref) => {
    const claim = node.data.claims?.[local];
    if (!claim) return `{{${local}}}`;
    const n = num(local);
    const mark = footnotes ? `[^${n}]` : `[${local}]`;
    return ref ? mark : `${claim.statement} ${mark}`;
  });
  // A gap or divergence is listed with the subject; the prose points at it.
  out = out.replace(/\{\{(gap|divergence):([a-z0-9]+(?:-[a-z0-9]+)*)\}\}/g, (_, kind, local) => {
    const item = node.data[`${kind}s`]?.[local];
    if (!item) return `{{${kind}:${local}}}`;
    if (!footnotes) return `[${kind}:${local}]`;
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
      (doc?.kind === "help-article" ? doc.source.url : null) ||
      head.match(/^URL:\s*(\S+)/m)?.[1] ||
      head.match(/^\*{0,2}Source:\*{0,2}\s*(https?:\/\/\S+)/m)?.[1] ||
      prev?.captured_from ||
      null;
    if (prev?.sha256 === sha && prev.captured_from === url) continue;
    const captured =
      (doc?.kind === "help-article" ? doc.captured_at : null) ||
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

export async function runCommand(root, g, cmd, args, { option, usage }) {
  const overlayDir = args.includes("--no-overlay") ? null : option(args, "--overlay") ?? process.env.ZSCALER_KB_OVERLAY ?? defaultOverlay(root);
  const ov = overlayDir ? loadOverlay(g, overlayDir) : null;
  if (ov) {
    const errors = validateOverlay(g, ov);
    if (errors.length) {
      for (const e of errors) console.error(`overlay error: ${e.file}: ${e.message}`);
      return 1;
    }
  }
  if (cmd === "resolve") {
    // Compact JSON by default: indentation costs agents about a quarter of a bundle's tokens.
    const pretty = args.includes("--pretty");
    const cases = args.includes("--cases") ? "full" : "summary";
    const evidence = args.includes("--evidence");
    const query = args.filter((a) => !["--pretty", "--cases", "--evidence"].includes(a)).join(" ").trim();
    if (!query) usage("resolve needs an ID or text");
    process.stdout.write(JSON.stringify(resolve(g, query, { overlay: ov, cases, evidence }), null, pretty ? 2 : 0) + "\n");
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
