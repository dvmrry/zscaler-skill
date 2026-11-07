import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** A subject's file text, or null when the ID (or a claim ID's subject) names no subject. */
function subjectText(id) {
  const subject = id.split(":")[0];
  const file = path.join(ROOT, "references", subject.split(".")[0], `${subject}.json`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").toLowerCase() : null;
}

// SKILL.md's Traps send an agent to a subject for each point answers most often get wrong. A trap may say only what
// that subject holds: every code term it quotes (a setting, an accessor, a value) appears in a subject it names.
test("each SKILL.md trap names a subject, and its quoted terms appear in a subject it names", () => {
  const skill = fs.readFileSync(path.join(ROOT, "SKILL.md"), "utf8");
  const start = skill.indexOf("\n## Traps\n");
  const section = skill.slice(start, skill.indexOf("\n## ", start + 1));
  const traps = section.split("\n- ").slice(1).map((b) => b.split("\n\n")[0]);
  assert.ok(traps.length > 10, "the Traps section lists its traps as bullets");
  for (const trap of traps) {
    const label = trap.match(/^\*\*(.+?)\*\*/)?.[1] ?? trap.slice(0, 40);
    const tokens = [...trap.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const named = tokens.map(subjectText).filter(Boolean);
    assert.ok(named.length, `${label}: names no subject`);
    // A subject-ID pattern (`zbi.*`) names a family, not a term.
    for (const term of tokens.filter((t) => !subjectText(t) && !t.endsWith(".*"))) {
      assert.ok(named.some((text) => text.includes(term.toLowerCase())), `${label}: \`${term}\` is in none of the subjects it names`);
    }
  }
});
