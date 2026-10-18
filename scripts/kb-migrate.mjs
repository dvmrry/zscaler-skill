// scripts/kb-migrate.mjs
//
// Transition helper: rewrite Markdown links that point into converted legacy docs
// (or into clarification-ledger entries that became gaps) as `kb:<id>` links.
// Each converted doc declares its anchor -> node table here, reviewed with the
// conversion; ledger anchors resolve through gaps' former_ids. `kb.mjs validate`
// checks every kb: link, so a rewritten link can never point at nothing.
import fs from "node:fs";
import path from "node:path";

/** Converted docs: file -> { default node, anchor-prefix -> node }. First matching prefix wins. */
export const MOVES = {
  "references/zia/url-filtering.md": {
    default: "zia.url-filtering",
    anchors: [
      ["rule-order", "zia.url-filtering.rule-order"],
      ["the-specificity-rule", "zia.url-categories.membership"],
      ["implication-for", "zia.url-categories.membership"],
      ["worked-example", "zia.url-categories.membership"],
      ["cloud-app-control", "zia.cloud-app-control.precedence"],
      ["url-filtering-evaluates-twice", "zia.ssl-inspection.pipeline"],
      ["rule-criteria", "zia.url-filtering.criteria"],
      ["actions", "zia.url-filtering.actions"],
      ["conditional-field", "zia.url-filtering.actions"],
      ["list-pagination", "zia.url-filtering.list-pagination"],
      ["custom-category-regex", "zia.url-categories.entry-format"],
      ["edge-cases", "zia.url-filtering.advanced-settings"],
    ],
  },
  "references/zia/wildcard-semantics.md": {
    default: "zia.url-categories.entry-matching",
    anchors: [["url-format-rules", "zia.url-categories.entry-format"]],
  },
};

const LEDGER = "references/_meta/clarifications.md";
const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;
const SCAN_DIRS = ["references", "agents", "docs", ".agents", ".claude", ".devin"];
const SCAN_FILES = ["SKILL.md", "README.md", "PLAN.md", "AGENTS.md", "zscaler"];

function* markdownFiles(root) {
  for (const f of SCAN_FILES) if (fs.existsSync(path.join(root, f))) yield f;
  const walk = function* (dir) {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) { if (e.name !== "worktrees" && e.name !== "archive") yield* walk(rel); }
      else if (e.name.endsWith(".md")) yield rel;
    }
  };
  for (const d of SCAN_DIRS) if (fs.existsSync(path.join(root, d))) yield* walk(d);
}

/** Map a link target (relative to `fromFile`) to a kb ID, or null if it does not move. */
export function targetFor(root, g, fromFile, target) {
  if (/^[a-z]+:/i.test(target)) return null;
  const [p, anchor = ""] = target.split("#");
  const abs = p ? path.resolve(root, path.dirname(fromFile), p) : path.resolve(root, fromFile);
  const rel = path.relative(root, abs).split(path.sep).join("/");
  if (MOVES[rel]) {
    const hit = MOVES[rel].anchors.find(([prefix]) => anchor.startsWith(prefix));
    return hit ? hit[1] : MOVES[rel].default;
  }
  if (rel === LEDGER) {
    const id = anchor.match(/^([a-z][a-z-]*?-\d+)-/)?.[1];
    return id && g.formerIds.has(id) ? g.formerIds.get(id) : null;
  }
  return null;
}

export function migrateLinks(root, g, args) {
  const dry = args.includes("--dry-run");
  const movedNames = Object.keys(MOVES).map((f) => path.basename(f));
  let files = 0;
  let links = 0;
  for (const file of markdownFiles(root)) {
    if (MOVES[file]) continue;
    const full = path.join(root, file);
    const text = fs.readFileSync(full, "utf8");
    let n = 0;
    const out = text.replace(LINK, (m, label, target) => {
      // A label that names a converted file is stale once the link moves.
      const relabel = (id) => (movedNames.some((name) => label.includes(name)) ? `\`${id}\`` : label);
      if (target.startsWith("kb:")) {
        const id = target.slice(3);
        const fixed = relabel(id);
        if (fixed === label) return m;
        n++;
        return `[${fixed}](${target})`;
      }
      const id = targetFor(root, g, file, target);
      if (!id) return m;
      n++;
      return `[${relabel(id)}](kb:${id})`;
    });
    if (n) {
      files++;
      links += n;
      console.log(`${dry ? "would rewrite" : "rewrote"} ${n} link(s) in ${file}`);
      if (!dry) fs.writeFileSync(full, out);
    }
  }
  console.log(`${links} links in ${files} files`);
  return 0;
}

/** Every `kb:` link in legacy Markdown, for validation. */
export function kbLinks(root) {
  const found = [];
  for (const file of markdownFiles(root)) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const m of text.matchAll(/\]\(kb:([^)\s]+)\)/g)) found.push({ file, id: m[1] });
  }
  return found;
}
