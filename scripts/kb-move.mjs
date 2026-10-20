// scripts/kb-move.mjs — move a claim to another subject and rewrite every reference to it.
//
// A claim's ID is `<subject>:<local>`, so moving it renames it. moveClaim:
//   - removes the claim from its subject and adds it to the target under the new local name, qualifying the
//     claim's own local references (derived_from, gaps, superseded_by) so they still point at the old subject;
//   - in the old subject, turns `{{local}}` and `{{local|ref}}` into a `[[new-id]]` link and repoints local
//     derived_from, superseded_by and checks[].uses entries;
//   - rewrites the qualified old ID everywhere else (subjects, SKILL.md, agents, evals, docs) by exact match;
//   - inlines the claim at the end of the target's prose, for the author to place.
// With merge, the target claim already states the same thing: the old claim is dropped (its evidence too) and
// every reference to it is rewritten to the target.
// Only files git sees (tracked or untracked, not ignored) are rewritten, never vendor/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ITEM = /^([a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+):([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const LOCAL = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ITEM_KINDS = ["claims", "cases", "divergences", "gaps"];

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function subjectFile(root, id) {
  const file = path.join(root, "references", id.split(".")[0], `${id}.json`);
  if (!fs.existsSync(file)) throw new Error(`no subject ${id} (${path.relative(root, file)})`);
  return file;
}

/** Replace exact local references in the reference-bearing fields of one subject's items and checks. */
function repointLocal(data, local, to) {
  for (const kind of ITEM_KINDS) {
    for (const item of Object.values(data[kind] || {})) {
      if (Array.isArray(item.derived_from)) item.derived_from = item.derived_from.map((r) => (r === local ? to : r));
      if (item.superseded_by === local) item.superseded_by = to;
    }
  }
  for (const check of data.checks || []) check.uses = check.uses.map((u) => (u === local ? to : u));
}

/** Replace inline markers of a claim in every prose block (text and label) with a link. */
function relinkProse(data, local, to) {
  const marker = new RegExp(`\\{\\{${escapeRegex(local)}(?:\\|ref)?\\}\\}`, "g");
  const walk = (v) => {
    if (typeof v === "string") return v.replace(marker, `[[${to}]]`);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  data.prose = walk(data.prose);
}

export function moveClaim(root, from, to, { merge = false } = {}) {
  const f = ITEM.exec(from);
  const t = ITEM.exec(to);
  if (!f || !t) throw new Error("move-claim needs two qualified claim IDs: <subject>:<claim> <subject>:<claim>");
  const [, fromSubject, fromLocal] = f;
  const [, toSubject, toLocal] = t;
  if (fromSubject === toSubject) throw new Error("the target is the same subject; rename the claim by hand");

  const fromFile = subjectFile(root, fromSubject);
  const toFile = subjectFile(root, toSubject);
  const source = readJson(fromFile);
  const target = readJson(toFile);
  const claim = source.claims?.[fromLocal];
  if (!claim) throw new Error(`${from} is not a claim`);
  if (merge) {
    if (!target.claims?.[toLocal]) throw new Error(`--merge needs an existing claim at ${to}`);
  } else {
    for (const kind of ITEM_KINDS) if (Object.hasOwn(target[kind] || {}, toLocal)) throw new Error(`${to} is taken (a ${kind.slice(0, -1)})`);
  }

  // The moved claim's own local references point at items that stay in the old subject.
  const q = (r) => (LOCAL.test(r) ? `${fromSubject}:${r}` : r);
  if (claim.derived_from) claim.derived_from = claim.derived_from.map(q);
  if (claim.gaps) claim.gaps = claim.gaps.map(q);
  if (claim.superseded_by) claim.superseded_by = q(claim.superseded_by);

  delete source.claims[fromLocal];
  if (!Object.keys(source.claims).length) delete source.claims;
  repointLocal(source, fromLocal, to);
  relinkProse(source, fromLocal, to);
  writeJson(fromFile, source);

  if (!merge) {
    target.claims = { ...(target.claims || {}), [toLocal]: claim };
    target.prose = [...(target.prose || []), { text: `{{${toLocal}}}` }];
    writeJson(toFile, target);
  }

  // Every other mention of the qualified ID, by exact match (not a prefix of a longer ID).
  const exact = new RegExp(`${escapeRegex(from)}(?![a-z0-9-])`, "g");
  const tracked = execFileSync("git", ["-C", root, "ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "references", "agents", "docs", "SKILL.md", "AGENTS.md", "scripts"], { encoding: "utf8" })
    .split("\0")
    .filter((p) => p && /\.(json|md|mjs|py)$/.test(p) && !p.startsWith("vendor/"));
  const rewritten = [];
  for (const rel of tracked) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!exact.test(text)) continue;
    exact.lastIndex = 0;
    fs.writeFileSync(file, text.replace(exact, to));
    rewritten.push(rel);
  }
  return { from, to, rewritten };
}
