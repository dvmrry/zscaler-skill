#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

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

export function validateReleaseFiles({ versionText, manifestText, pyprojectText, uvLockText, changelogText }) {
  const errors = [];
  const version = versionText.trim();
  if (!parseSemver(version)) {
    errors.push(`VERSION is not a plain semantic version: ${JSON.stringify(version)}`);
    return { version, errors };
  }

  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    errors.push(`.release-please-manifest.json is invalid JSON: ${error.message}`);
  }

  if (manifest !== undefined) {
    if (manifest === null || typeof manifest !== "object" || Array.isArray(manifest)) {
      errors.push("release manifest must be a JSON object");
    } else if (!Object.hasOwn(manifest, ".")) {
      errors.push('release manifest has no own "." version');
    } else {
      const manifestVersion = manifest["."];
      if (typeof manifestVersion !== "string" || !parseSemver(manifestVersion)) {
        errors.push(
          `release manifest "." is not a plain semantic version: ${JSON.stringify(manifestVersion)}`,
        );
      } else if (manifestVersion !== version) {
        errors.push(`release manifest has ${JSON.stringify(manifestVersion)}; expected ${version}`);
      }
    }
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

  const changelogMatch = /^## \[([^\]]+)\]/m.exec(changelogText);
  if (!changelogMatch) {
    errors.push("CHANGELOG.md has no version heading");
  } else if (changelogMatch[1] !== version) {
    errors.push(`CHANGELOG.md starts at ${changelogMatch[1]}; expected ${version}`);
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

function versionAtCommit(root, commit) {
  const result = spawnSync("git", ["show", `${commit}:VERSION`], {
    cwd: root,
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : undefined;
}

export function findReleaseCommit(root, version) {
  const history = spawnSync("git", ["rev-list", "--first-parent", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  });
  if (history.status !== 0) {
    return { error: history.stderr.trim() || "git rev-list failed" };
  }

  for (const commit of history.stdout.split(/\r?\n/).filter(Boolean)) {
    if (versionAtCommit(root, commit) !== version) continue;

    const parent = spawnSync("git", ["rev-parse", `${commit}^1`], {
      cwd: root,
      encoding: "utf8",
    });
    const parentVersion =
      parent.status === 0 ? versionAtCommit(root, parent.stdout.trim()) : undefined;
    if (parentVersion !== version) return { commit };
  }

  return { error: `no first-parent commit introduces VERSION ${version}` };
}

export function validateReleaseState(root) {
  const inputs = {
    versionText: fs.readFileSync(path.join(root, "VERSION"), "utf8"),
    manifestText: fs.readFileSync(path.join(root, ".release-please-manifest.json"), "utf8"),
    pyprojectText: fs.readFileSync(path.join(root, "pyproject.toml"), "utf8"),
    uvLockText: fs.readFileSync(path.join(root, "uv.lock"), "utf8"),
    changelogText: fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8"),
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
  const releaseCommitOnly = process.argv[2] === "--release-commit";
  const rootArgument = process.argv[releaseCommitOnly ? 3 : 2];
  const root = rootArgument
    ? path.resolve(rootArgument)
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

  if (releaseCommitOnly) {
    const version = fs.readFileSync(path.join(root, "VERSION"), "utf8").trim();
    if (!parseSemver(version)) {
      console.error(`VERSION is not a plain semantic version: ${JSON.stringify(version)}`);
      return 1;
    }
    const release = findReleaseCommit(root, version);
    if (release.error) {
      console.error(`Could not derive release commit: ${release.error}`);
      return 1;
    }
    console.log(release.commit);
    return 0;
  }

  const state = validateReleaseState(root);
  if (state.errors.length > 0) {
    console.error("Release state check failed:");
    for (const error of state.errors) console.error(`- ${error}`);
    return 1;
  }
  console.log(`Release state OK: ${state.version} (latest tag: ${state.latestTag || "none"})`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
