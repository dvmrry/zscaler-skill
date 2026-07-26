#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_DATA_MOUNT,
  DATA_REQUIRED_DIRS,
  DATA_SKELETON_FILES,
  gitTryOutput,
  normalizeMountPath,
  normalizeRuntimeDataTracking,
  runtimeMountIgnoreStatus,
  runtimeDataMountSettings,
} from "./lib.mjs";

const KNOWLEDGE_REQUIRED_FIELDS = new Set([
  "title",
  "record-type",
  "status",
  "confidence",
  "scope",
  "last-validated",
  "evidence",
]);
const KNOWLEDGE_OPTIONAL_FIELDS = new Set([
  "conflicts-with",
  "do-not-infer",
  "superseded-by",
]);
const KNOWLEDGE_FIELDS = new Set([
  ...KNOWLEDGE_REQUIRED_FIELDS,
  ...KNOWLEDGE_OPTIONAL_FIELDS,
]);
const KNOWLEDGE_SCALAR_FIELDS = new Set([
  "title",
  "record-type",
  "status",
  "confidence",
  "scope",
  "last-validated",
  "do-not-infer",
  "superseded-by",
]);
const KNOWLEDGE_LIST_FIELDS = new Set(["evidence", "conflicts-with"]);
const KNOWLEDGE_ENUMS = new Map([
  ["record-type", new Set(["claim", "procedure"])],
  ["status", new Set(["active", "promoted", "retired"])],
  ["confidence", new Set(["high", "medium", "low"])],
]);
const EVIDENCE_KINDS = new Set([
  "case",
  "vendor-call",
  "vendor-ticket",
  "vendor-email",
  "public-doc",
]);
const EVIDENCE_REQUIRED_REFS = new Set(["case", "public-doc"]);
const FRONTMATTER_VALUE_UNSUPPORTED = Symbol("unsupported-frontmatter-value");

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/check-data-contract.mjs [--root <repo-root>] [--runtime-config <json>] [--config <setup-json>] [--mount-path <path>] [--tracking ignored|tracked]

Verifies the runtime data mount contract without reading tenant contents.
Defaults to _data unless zscaler-skill-runtime.json, zscaler-skill-setup.json,
or --mount-path says otherwise.
ZSCALER_SKILL_RUNTIME_CONFIG/--runtime-config and
ZSCALER_SKILL_SETUP_CONFIG/--config select alternate downstream config files.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    config: null,
    mountPath: null,
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
    runtimeConfig: null,
    tracking: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--root") {
      args.root = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--config") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--config requires a value");
      }
      args.config = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--runtime-config") {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) {
        throw new Error("--runtime-config requires a value");
      }
      args.runtimeConfig = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--mount-path") {
      args.mountPath = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--tracking") {
      args.tracking = argv[i + 1] || "";
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  const settings = runtimeDataMountSettings(args.root, {
    runtimeConfigPath: args.runtimeConfig || null,
    setupConfigPath: args.config || null,
    mountPath: args.mountPath,
    tracking: args.tracking,
  });

  return {
    root: args.root,
    mountPath: settings.mountPath,
    tracking: settings.tracking,
  };
}

function listUsefulEntries(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries
    .filter((entry) => !DATA_SKELETON_FILES.has(entry.name))
    .map((entry) => entry.name);
}

function gitLsTree(root, targetPath) {
  return gitTryOutput(root, ["ls-tree", "HEAD", targetPath]);
}

function detectDataSubmodule(root, mountPath = DEFAULT_DATA_MOUNT) {
  const mount = normalizeMountPath(mountPath);
  const dataGit = path.join(root, mount, ".git");
  const gitmodules = path.join(root, ".gitmodules");
  const lsTree = gitLsTree(root, mount);

  const gitFileLooksLikeSubmodule = fs.existsSync(dataGit) && fs.statSync(dataGit).isFile();
  const gitmodulesMentionsData = fs.existsSync(gitmodules)
    && fs.readFileSync(gitmodules, "utf8").includes(`path = ${mount}`);
  const escapedMount = mount.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const treeMatch = new RegExp(`^160000 commit ([0-9a-f]{40})\\t${escapedMount}$`, "m").exec(lsTree);

  if (!gitFileLooksLikeSubmodule && !gitmodulesMentionsData && !treeMatch) {
    return { isSubmodule: false };
  }

  return {
    isSubmodule: true,
    pinnedCommit: treeMatch ? treeMatch[1] : null,
  };
}

function relativeDisplay(root, target) {
  return path.relative(root, target).split(path.sep).join("/") || ".";
}

function parseFlatScalar(token, owner, errors, lineNumber) {
  if (token === "|" || token === ">" || /^[|>][+-]?$/.test(token)) {
    errors.push(`${owner}:${lineNumber}: block scalar values are not supported`);
    return FRONTMATTER_VALUE_UNSUPPORTED;
  }
  if (/^[\[{]/.test(token)) {
    errors.push(`${owner}:${lineNumber}: inline collections are not supported`);
    return FRONTMATTER_VALUE_UNSUPPORTED;
  }

  if (token.startsWith("\"")) {
    try {
      const parsed = JSON.parse(token);
      if (typeof parsed !== "string") throw new Error("not a string");
      return parsed;
    } catch {
      errors.push(`${owner}:${lineNumber}: malformed quoted scalar`);
      return FRONTMATTER_VALUE_UNSUPPORTED;
    }
  }
  if (token.startsWith("'")) {
    if (!token.endsWith("'") || token.length < 2) {
      errors.push(`${owner}:${lineNumber}: malformed quoted scalar`);
      return FRONTMATTER_VALUE_UNSUPPORTED;
    }
    const inner = token.slice(1, -1);
    for (let index = 0; index < inner.length; index += 1) {
      if (inner[index] !== "'") continue;
      if (inner[index + 1] !== "'") {
        errors.push(`${owner}:${lineNumber}: malformed quoted scalar`);
        return FRONTMATTER_VALUE_UNSUPPORTED;
      }
      index += 1;
    }
    return inner.replaceAll("''", "'");
  }
  if (token.endsWith("\"") || token.endsWith("'")) {
    errors.push(`${owner}:${lineNumber}: malformed quoted scalar`);
    return FRONTMATTER_VALUE_UNSUPPORTED;
  }

  if (/^(?:null|~)$/i.test(token)) return null;
  if (/^(?:true|false)$/i.test(token)) return token.toLowerCase() === "true";
  if (/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(token)) return Number(token);
  return token;
}

function parseKnowledgeFrontmatter(filePath, root, errors) {
  const owner = relativeDisplay(root, filePath);
  const text = fs.readFileSync(filePath, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) {
    errors.push(`${owner}: missing flat YAML frontmatter`);
    return null;
  }

  const data = {};
  let currentList = null;
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const lineNumber = index + 2;
    if (!rawLine.trim()) continue;

    const listMatch = /^\s+-\s+(.+)$/.exec(rawLine);
    if (listMatch) {
      if (!currentList) {
        errors.push(`${owner}:${lineNumber}: list item without a list field`);
        continue;
      }
      const token = listMatch[1].trim();
      data[currentList].push(parseFlatScalar(token, owner, errors, lineNumber));
      continue;
    }

    const fieldMatch = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(rawLine);
    if (!fieldMatch) {
      errors.push(`${owner}:${lineNumber}: unsupported frontmatter line: ${rawLine.trim()}`);
      currentList = null;
      continue;
    }

    const key = fieldMatch[1];
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      errors.push(`${owner}:${lineNumber}: duplicate frontmatter field: ${key}`);
      currentList = null;
      continue;
    }

    const token = (fieldMatch[2] ?? "").trim();
    if (token === "") {
      data[key] = [];
      currentList = key;
    } else {
      data[key] = parseFlatScalar(token, owner, errors, lineNumber);
      currentList = null;
    }
  }
  return data;
}

function portablePathParts(value) {
  return value.split(/[\\/]+/).filter((part) => part !== "");
}

function validateRelativePath(value, owner, field, errors) {
  if (typeof value !== "string" || value === "") {
    errors.push(`${owner}: ${field} must be a non-empty relative path`);
    return null;
  }
  if (value.includes("\0")) {
    errors.push(`${owner}: ${field} contains a NUL byte`);
    return null;
  }
  if (path.posix.isAbsolute(value) || path.win32.isAbsolute(value)) {
    errors.push(`${owner}: ${field} must be relative: ${value}`);
    return null;
  }
  const parts = portablePathParts(value);
  if (parts.includes("..")) {
    errors.push(`${owner}: ${field} must not contain '..': ${value}`);
    return null;
  }
  if (parts.length === 0 || parts.includes(".")) {
    errors.push(`${owner}: ${field} is not a normalized relative path: ${value}`);
    return null;
  }
  return parts;
}

function isRealpathContained(baseRealpath, targetRealpath) {
  const relative = path.relative(baseRealpath, targetRealpath);
  return relative === ""
    || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function symlinkComponents(basePath, parts) {
  const links = [];
  let cursor = basePath;
  for (const part of parts) {
    cursor = path.join(cursor, part);
    try {
      if (fs.lstatSync(cursor).isSymbolicLink()) links.push(cursor);
    } catch {
      break;
    }
  }
  return links;
}

function validateMountReference(value, owner, field, mountDir, errors) {
  const parts = validateRelativePath(value, owner, field, errors);
  if (!parts) return;
  const target = path.join(mountDir, ...parts);
  const links = symlinkComponents(mountDir, parts);
  for (const link of links) {
    errors.push(`${owner}: ${field} must not traverse a symlink: ${relativeDisplay(mountDir, link)}`);
  }
  if (!fs.existsSync(target)) {
    errors.push(`${owner}: ${field} does not resolve under the runtime mount: ${value}`);
    return;
  }

  const mountRealpath = fs.realpathSync(mountDir);
  const targetRealpath = fs.realpathSync(target);
  if (!isRealpathContained(mountRealpath, targetRealpath)) {
    errors.push(`${owner}: ${field} resolves outside the runtime mount: ${value}`);
  }
}

function validateReferencePath(value, owner, field, root, errors) {
  const parts = validateRelativePath(value, owner, field, errors);
  if (!parts) return;
  if (parts[0] !== "references" || parts.length < 2) {
    errors.push(`${owner}: ${field} must resolve under references/: ${value}`);
    return;
  }

  const referencesDir = path.join(root, "references");
  const target = path.join(root, ...parts);
  if (!fs.existsSync(target)) {
    errors.push(`${owner}: ${field} does not resolve: ${value}`);
    return;
  }
  if (!fs.existsSync(referencesDir)) {
    errors.push(`${owner}: references/ directory is missing`);
    return;
  }

  const referencesRealpath = fs.realpathSync(referencesDir);
  const targetRealpath = fs.realpathSync(target);
  if (!isRealpathContained(referencesRealpath, targetRealpath)) {
    errors.push(`${owner}: ${field} resolves outside references/: ${value}`);
  }
}

function validatePublicDoc(value, owner, errors) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname === "" || url.username !== "" || url.password !== "") {
      throw new Error("not a public HTTPS URL");
    }
  } catch {
    errors.push(`${owner}: public-doc evidence ref must be a public https:// URL: ${value}`);
  }
}

function validateEvidence(entry, owner, mountDir, errors) {
  if (typeof entry !== "string") {
    errors.push(`${owner}: every evidence item must be a string scalar`);
    return;
  }
  const separator = entry.indexOf(":");
  const kind = (separator === -1 ? entry : entry.slice(0, separator)).trim();
  const ref = separator === -1 ? null : entry.slice(separator + 1).trim();

  if (!EVIDENCE_KINDS.has(kind)) {
    errors.push(`${owner}: unknown evidence kind: ${kind || "(empty)"}`);
    return;
  }
  if (ref === "") {
    errors.push(`${owner}: evidence ref must not be empty: ${entry}`);
    return;
  }
  if (EVIDENCE_REQUIRED_REFS.has(kind) && ref === null) {
    errors.push(`${owner}: ${kind} evidence requires a ref`);
    return;
  }
  if (ref === null) return;

  if (kind === "public-doc") {
    validatePublicDoc(ref, owner, errors);
  } else {
    validateMountReference(ref, owner, `${kind} evidence ref`, mountDir, errors);
  }
}

function knownKnowledgeProducts(root) {
  const referencesDir = path.join(root, "references");
  if (!fs.existsSync(referencesDir) || !fs.statSync(referencesDir).isDirectory()) return null;
  const products = new Set(
    fs.readdirSync(referencesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== "_meta")
      .map((entry) => entry.name),
  );
  return products.size === 0 ? null : products;
}

function knowledgeRecordFiles(knowledgeDir, root, errors) {
  const files = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) {
        errors.push(`${relativeDisplay(root, target)}: knowledge records and directories must not be symlinks`);
        continue;
      }
      if (entry.isDirectory()) {
        visit(target);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(target);
      }
    }
  }
  visit(knowledgeDir);
  return files.sort();
}

function validateKnowledgeRecord(filePath, root, mountDir, knowledgeDir, products, errors) {
  const owner = relativeDisplay(root, filePath);
  const relativeRecord = path.relative(knowledgeDir, filePath);
  const parts = relativeRecord.split(path.sep);
  if (parts.length !== 2) {
    errors.push(`${owner}: knowledge record path must be knowledge/<product>/<slug>.md`);
  }
  if (products && !products.has(parts[0])) {
    errors.push(`${owner}: first knowledge path component must be a known references/ product or shared`);
  }

  const data = parseKnowledgeFrontmatter(filePath, root, errors);
  if (!data) return;

  for (const field of Object.keys(data)) {
    if (!KNOWLEDGE_FIELDS.has(field)) errors.push(`${owner}: unknown frontmatter field: ${field}`);
  }
  for (const field of KNOWLEDGE_REQUIRED_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(data, field)) {
      errors.push(`${owner}: missing required frontmatter field: ${field}`);
    }
  }
  for (const field of KNOWLEDGE_SCALAR_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(data, field) && typeof data[field] !== "string") {
      errors.push(`${owner}: ${field} must be a string scalar`);
    }
  }
  for (const field of ["title", "scope"]) {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errors.push(`${owner}: ${field} must be a non-empty string scalar`);
    }
  }
  for (const field of KNOWLEDGE_LIST_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(data, field) && !Array.isArray(data[field])) {
      errors.push(`${owner}: ${field} must be a scalar list`);
    }
  }

  for (const [field, values] of KNOWLEDGE_ENUMS) {
    if (typeof data[field] === "string" && !values.has(data[field])) {
      errors.push(`${owner}: ${field} must be one of: ${[...values].join(", ")}`);
    }
  }
  if (typeof data["last-validated"] === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(data["last-validated"])) {
    errors.push(`${owner}: last-validated must match YYYY-MM-DD`);
  }

  if (Array.isArray(data.evidence)) {
    if (data.evidence.length === 0) errors.push(`${owner}: evidence must be a non-empty scalar list`);
    for (const entry of data.evidence) validateEvidence(entry, owner, mountDir, errors);
  }
  if (Array.isArray(data["conflicts-with"])) {
    for (const target of data["conflicts-with"]) {
      if (typeof target !== "string") {
        errors.push(`${owner}: every conflicts-with item must be a string scalar`);
      } else {
        validateReferencePath(target, owner, "conflicts-with", root, errors);
      }
    }
  }

  const hasSupersededBy = Object.prototype.hasOwnProperty.call(data, "superseded-by");
  if (data.status === "promoted" && !hasSupersededBy) {
    errors.push(`${owner}: promoted records require superseded-by`);
  }
  if (
    data.status === "promoted"
    && Array.isArray(data.evidence)
    && !data.evidence.some(
      (entry) => typeof entry === "string" && entry.split(":", 1)[0].trim() === "public-doc",
    )
  ) {
    errors.push(`${owner}: promoted records require public-doc evidence`);
  }
  if (data.status === "active" && hasSupersededBy) {
    errors.push(`${owner}: active records must not have superseded-by`);
  }
  if (data["record-type"] === "procedure" && data.status === "promoted") {
    errors.push(`${owner}: procedure records may not be promoted`);
  }
  if (hasSupersededBy && typeof data["superseded-by"] === "string") {
    validateReferencePath(data["superseded-by"], owner, "superseded-by", root, errors);
  }
}

function validateKnowledge(root, mountDir, errors) {
  const knowledgeDir = path.join(mountDir, "knowledge");
  let knowledgeStat;
  try {
    knowledgeStat = fs.lstatSync(knowledgeDir);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  if (knowledgeStat.isSymbolicLink()) {
    errors.push(`${relativeDisplay(root, knowledgeDir)}/ must not be a symlink`);
    return;
  }
  if (!knowledgeStat.isDirectory()) {
    errors.push(`${relativeDisplay(root, knowledgeDir)}/ must be a directory when present`);
    return;
  }

  const files = knowledgeRecordFiles(knowledgeDir, root, errors);
  if (files.length === 0) return;

  const products = knownKnowledgeProducts(root);
  if (!products) {
    errors.push(
      `${relativeDisplay(root, knowledgeDir)}: product taxonomy unavailable; references/ has no product directories`,
    );
  }
  for (const filePath of files) {
    validateKnowledgeRecord(filePath, root, mountDir, knowledgeDir, products, errors);
  }
}

function checkDataContract(root, mountPath = DEFAULT_DATA_MOUNT, options = {}) {
  const mount = normalizeMountPath(mountPath);
  const tracking = normalizeRuntimeDataTracking(options.tracking);
  const dataDir = path.join(root, mount);
  const errors = [];
  const warnings = [];
  const info = [];

  if (!fs.existsSync(dataDir) || !fs.statSync(dataDir).isDirectory()) {
    errors.push(`${mount}/ directory is missing`);
    return { errors, warnings, info };
  }

  validateKnowledge(root, dataDir, errors);

  const readmePath = path.join(dataDir, "README.md");
  if (!fs.existsSync(readmePath) || !fs.statSync(readmePath).isFile()) {
    warnings.push(`${mount}/README.md is missing`);
  }

  for (const dirname of DATA_REQUIRED_DIRS) {
    const dir = path.join(dataDir, dirname);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      errors.push(`${mount}/${dirname}/ directory is missing`);
      continue;
    }
    const usefulEntries = listUsefulEntries(dir);
    if (usefulEntries.length === 0) {
      warnings.push(`${mount}/${dirname}/ contains only skeleton files`);
    }
  }

  const submodule = detectDataSubmodule(root, mount);
  if (submodule.isSubmodule) {
    if (submodule.pinnedCommit) {
      info.push(`${mount} appears to be a git submodule pinned at ${submodule.pinnedCommit}`);
    } else {
      info.push(`${mount} appears to be a git submodule; pinned commit unavailable from current HEAD`);
    }
  } else {
    info.push(`${mount} appears to be an ordinary directory`);
    const ignoreStatus = runtimeMountIgnoreStatus(root, mount);
    if (tracking === "tracked") {
      info.push(`${mount} is configured as tracked runtime data`);
      if (ignoreStatus.isGitRepo && ignoreStatus.ignored) {
        warnings.push(
          `${mount}/ is configured as tracked runtime data but is ignored by git; remove the ignore rule before committing work-mirror data`,
        );
      }
    } else if (ignoreStatus.isGitRepo && !ignoreStatus.ignored) {
      const subject = mount === DEFAULT_DATA_MOUNT
        ? `${mount}/ is configured for ignored runtime data`
        : `${mount}/ is a custom runtime-data mount`;
      warnings.push(
        `${subject} but is not ignored by git; run setup-data-mount.mjs or add ${ignoreStatus.pattern} to .git/info/exclude`,
      );
    }
  }

  if (warnings.some((warning) => warning.includes(`${mount}/snapshot/`))) {
    warnings.push(`no ${mount}/snapshot content: snapshot-backed reasoning unavailable`);
  }
  if (warnings.some((warning) => warning.includes(`${mount}/schemas/`))) {
    warnings.push(`no ${mount}/schemas content: tenant schema hints unavailable`);
  }

  return { errors, warnings, info };
}

function printReport(report) {
  process.stdout.write("Data contract report\n");
  process.stdout.write("====================\n");
  for (const line of report.info) process.stdout.write(`INFO: ${line}\n`);
  for (const line of report.warnings) process.stdout.write(`WARN: ${line}\n`);
  for (const line of report.errors) process.stdout.write(`ERROR: ${line}\n`);
  process.stdout.write(`Errors: ${report.errors.length}\n`);
  process.stdout.write(`Warnings: ${report.warnings.length}\n`);
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const report = checkDataContract(args.root, args.mountPath, { tracking: args.tracking });
    printReport(report);
    process.exit(report.errors.length === 0 ? 0 : 1);
  } catch (error) {
    process.stderr.write(`check-data-contract: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  checkDataContract,
  detectDataSubmodule,
};
