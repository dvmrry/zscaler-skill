#!/usr/bin/env node
// check-release-state.mjs — VERSION, pyproject.toml and uv.lock name one version, the newest release notes file
// (docs/releases/vX.Y.Z.md) is that version, and no tag is newer. A release PR adds the next notes file and bumps
// the three version surfaces together; scripts/release-version.sh decides which version a change releases.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const NOTES_RE = /^v((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))\.md$/;
export const NOTES_DIR = "docs/releases";

function parseSemver(value) {
  const match = SEMVER_RE.exec(value);
  return match ? match.slice(1).map(Number) : null;
}

function compareSemver(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

export function validateReleaseFiles({ versionText, pyprojectText, uvLockText, notes = [] }) {
  const errors = [];
  const version = versionText.trim();
  if (!parseSemver(version)) {
    errors.push(`VERSION is not a plain semantic version: ${JSON.stringify(version)}`);
    return { version, errors };
  }

  const pyprojectMatch = /^version\s*=\s*"([^"]+)"/m.exec(pyprojectText);
  if (!pyprojectMatch) {
    errors.push("pyproject.toml has no project version");
  } else if (pyprojectMatch[1] !== version) {
    errors.push(`pyproject.toml has ${pyprojectMatch[1]}; expected ${version}`);
  }

  const uvLockMatch = /\[\[package\]\]\s+name\s*=\s*"zscaler-skill"\s+version\s*=\s*"([^"]+)"/m.exec(uvLockText);
  if (!uvLockMatch) {
    errors.push("uv.lock has no zscaler-skill package version");
  } else if (uvLockMatch[1] !== version) {
    errors.push(`uv.lock has ${uvLockMatch[1]}; expected ${version}`);
  }

  const released = [];
  for (const name of notes) {
    const match = NOTES_RE.exec(name);
    if (match) released.push(match[1]);
    else errors.push(`${NOTES_DIR}/${name} is not named vMAJOR.MINOR.PATCH.md`);
  }
  const newest = released.sort((a, b) => compareSemver(parseSemver(a), parseSemver(b))).at(-1);
  if (newest && newest !== version) {
    errors.push(`the newest release notes are ${NOTES_DIR}/v${newest}.md; expected v${version}.md`);
  }

  return { version, errors };
}

function latestVersionTag(root) {
  const result = spawnSync("git", ["tag", "--list", "v[0-9]*.[0-9]*.[0-9]*"], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return { error: result.stderr.trim() || "git tag failed" };
  }

  const tags = result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((tag) => ({ tag, parts: parseSemver(tag.slice(1)) }))
    .filter((entry) => entry.parts)
    .sort((left, right) => compareSemver(left.parts, right.parts));
  return { tag: tags.at(-1)?.tag };
}

export function validateReleaseState(root) {
  const notesDir = path.join(root, NOTES_DIR);
  const inputs = {
    versionText: fs.readFileSync(path.join(root, "VERSION"), "utf8"),
    pyprojectText: fs.readFileSync(path.join(root, "pyproject.toml"), "utf8"),
    uvLockText: fs.readFileSync(path.join(root, "uv.lock"), "utf8"),
    notes: fs.existsSync(notesDir) ? fs.readdirSync(notesDir).filter((name) => !name.startsWith(".")) : [],
  };
  const state = validateReleaseFiles(inputs);
  const latest = latestVersionTag(root);
  if (latest.error) {
    state.errors.push(`could not inspect release tags: ${latest.error}`);
  } else if (latest.tag) {
    const latestParts = parseSemver(latest.tag.slice(1));
    const versionParts = parseSemver(state.version);
    if (versionParts && compareSemver(latestParts, versionParts) > 0) {
      state.errors.push(`latest tag ${latest.tag} is newer than VERSION ${state.version}`);
    }
  }
  return { ...state, latestTag: latest.tag };
}

function main() {
  const root = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const state = validateReleaseState(root);
  if (state.errors.length > 0) {
    console.error("Release state check failed:");
    for (const error of state.errors) console.error(`- ${error}`);
    return 1;
  }
  console.log(`Release state OK: ${state.version} (latest tag: ${state.latestTag || "none"})`);
  return 0;
}

if (import.meta.main) {
  process.exit(main());
}
