#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MCP_SUBMODULE = "vendor/zscaler-mcp-server";
const MAX_BUFFER = 32 * 1024 * 1024;

function mcpPackageRelative(file) {
  for (const prefix of ["src/zscaler_mcp/", "zscaler_mcp/"]) {
    if (file.startsWith(prefix)) return file.slice(prefix.length);
  }
  return null;
}

const MCP_REVIEW_LENSES = [
  {
    name: "Tool capability surface",
    review: "Check additions, removals, names, schemas, annotations, and read/write classification.",
    matches: (file) =>
      mcpPackageRelative(file)?.startsWith("tools/")
      || /(^|\/)(supported-tools|toolsets)(\.|\/)/.test(file)
      || file.startsWith("docsrc/tools/"),
  },
  {
    name: "Prompt surface",
    review: "Check prompt names, arguments, returned instructions, and downstream workflow assumptions.",
    matches: (file) =>
      mcpPackageRelative(file)?.startsWith("prompts/") || file.startsWith("commands/"),
  },
  {
    name: "Authentication, authorization, and safety",
    review: "Check credential flow, entitlements, elicitation, hardening, sanitization, and mutation safeguards.",
    matches: (file) =>
      mcpPackageRelative(file)?.startsWith("security/")
      || /(auth|entitlement|elicitation|hardening|secret|write.operations)/i.test(file),
  },
  {
    name: "Output shaping and token behavior",
    review: "Check truncation, encoding, response views, sanitization, and token-budget behavior.",
    matches: (file) =>
      mcpPackageRelative(file)?.startsWith("shaping/")
      || mcpPackageRelative(file)?.startsWith("encoding/")
      || /(token_(comparison|metrics)|sanitize|jmespath)/i.test(file),
  },
  {
    name: "Registration, discovery, and lifecycle",
    review: "Check tool/prompt discovery, registry wiring, transport startup, and lifecycle compatibility.",
    matches: (file) =>
      mcpPackageRelative(file)?.startsWith("registry/")
      || ["server.py", "lifecycle.py", "__init__.py"].includes(mcpPackageRelative(file))
      || [".mcp.json", "server.json"].includes(file),
  },
  {
    name: "Core client and shared helpers",
    review: "Check SDK client construction, cloud helpers, shared utilities, and product-helper contracts.",
    matches: (file) => {
      const relative = mcpPackageRelative(file);
      return ["client.py", "services.py"].includes(relative)
        || relative?.startsWith("common/")
        || relative?.startsWith("cloud/")
        || relative?.startsWith("utils/");
    },
  },
  {
    name: "Documentation, packaging, and deployment links",
    review: "Check install commands, package paths, release notes, manifests, and every downstream citation or link.",
    matches: (file) =>
      file.startsWith("docs/")
      || file.startsWith("docsrc/")
      || file.startsWith("integrations/")
      || file.startsWith(".github/")
      || file.startsWith(".claude-plugin/")
      || file.startsWith(".cursor-plugin/")
      || /(^|\/)(README|CHANGELOG|pyproject|requirements|Dockerfile|\.env|\.mcpb|\.release)/i.test(file)
      || [".dockerignore", "uv.lock"].includes(file)
      || file.endsWith(".json"),
  },
  {
    name: "Tests and executable examples",
    review: "Check whether tests cover each changed contract and whether examples still describe supported behavior.",
    matches: (file) => file.startsWith("tests/") || file.startsWith("examples/"),
  },
];

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/vendor-impact-summary.mjs --base <ref> [--head <ref> | --worktree] --output <path> [--max-commits <n>] [--strict]

Summarizes changed vendor submodule commits and cited-reference drift. When the
Zscaler MCP submodule changes, also classifies changed paths into semantic
review lenses. --worktree compares the base ref with the current index and
working tree, including an unstaged submodule pointer. --strict exits nonzero
after writing the report when changed-source drift or MCP classification is
incomplete.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    base: null,
    head: "HEAD",
    headExplicit: false,
    maxCommits: 8,
    output: null,
    strict: false,
    worktree: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--worktree") {
      args.worktree = true;
      continue;
    }
    if (arg === "--strict") {
      args.strict = true;
      continue;
    }
    if (["--base", "--head", "--output", "--max-commits"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      if (arg === "--base") args.base = value;
      if (arg === "--head") {
        args.head = value;
        args.headExplicit = true;
      }
      if (arg === "--output") args.output = value;
      if (arg === "--max-commits") {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== value) {
          throw new Error("--max-commits must be a positive integer");
        }
        args.maxCommits = parsed;
      }
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.base) throw new Error("--base is required");
  if (!args.output) throw new Error("--output is required");
  if (args.worktree && args.headExplicit) {
    throw new Error("--head and --worktree are mutually exclusive");
  }
  for (const [label, ref] of [["--base", args.base], ["--head", args.head]]) {
    if (ref.startsWith("-")) throw new Error(`${label} must not begin with '-'`);
  }
  delete args.headExplicit;
  return args;
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || REPO_ROOT,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  });
  if (result.error) throw result.error;
  return result;
}

function failureDetail(label, result) {
  return (result.stderr || result.stdout || `${label} exited ${result.status}`).trim();
}

function isZeroSha(value) {
  return /^0+$/.test(value);
}

function parseRawSubmoduleDiff(raw) {
  const changes = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line) continue;
    const match = /^:(\d{6}) (\d{6}) ([0-9a-f]+) ([0-9a-f]+) ([A-Z][0-9]*)\t(.+)$/.exec(line);
    if (!match) continue;
    const [, oldMode, newMode, oldSha, newSha, status, file] = match;
    if (oldMode === "160000" || newMode === "160000") {
      changes.push({ path: file, oldSha, newSha, status });
    }
  }
  return changes;
}

function changedSubmodules(options) {
  const runner = options.runner || runCommand;
  const args = ["diff", "--raw", "--no-abbrev", "--no-renames", options.base];
  if (!options.worktree) args.push(options.head || "HEAD");
  args.push("--", "vendor");
  const result = runner("git", args, { cwd: options.root || REPO_ROOT });
  if (result.status !== 0) throw new Error(failureDetail("git diff", result));

  const changes = parseRawSubmoduleDiff(result.stdout);
  if (!options.worktree) return changes;

  return changes.map((change) => {
    if (!isZeroSha(change.newSha) || change.status.startsWith("D")) return change;
    const resolved = runner("git", ["-C", change.path, "rev-parse", "HEAD"], {
      cwd: options.root || REPO_ROOT,
    });
    if (resolved.status !== 0) {
      throw new Error(
        `${change.path} is not initialized; initialize submodules before generating impact`,
      );
    }
    const dirty = runner("git", ["-C", change.path, "status", "--porcelain"], {
      cwd: options.root || REPO_ROOT,
    });
    if (dirty.status !== 0) {
      throw new Error(failureDetail(`git status ${change.path}`, dirty));
    }
    if (dirty.stdout.trim()) {
      throw new Error(
        `${change.path} has uncommitted content that a commit-range impact report cannot classify`,
      );
    }
    return { ...change, newSha: resolved.stdout.trim() };
  });
}

function shortSha(sha) {
  return isZeroSha(sha) ? "(none)" : sha.slice(0, 7);
}

function submoduleLogs(changes, maxCommits, options = {}) {
  const runner = options.runner || runCommand;
  const root = options.root || REPO_ROOT;
  if (changes.length === 0) return ["No vendor submodule pointer changes detected.", ""];

  const lines = [];
  for (const change of changes) {
    lines.push(`### \`${change.path}\``, "");
    lines.push(`\`${shortSha(change.oldSha)}\` -> \`${shortSha(change.newSha)}\``, "");
    if (isZeroSha(change.oldSha) || isZeroSha(change.newSha)) {
      lines.push("- Commit log is unavailable for an added, deleted, or unresolved submodule pointer.", "");
      continue;
    }
    const log = runner(
      "git",
      ["-C", change.path, "log", "--oneline", "--decorate", "--no-merges", `${change.oldSha}..${change.newSha}`],
      { cwd: root },
    );
    const commits = log.status === 0 ? log.stdout.trim().split(/\r?\n/).filter(Boolean) : [];
    if (commits.length === 0) {
      lines.push("- No commit log available locally.");
    } else {
      for (const commit of commits.slice(0, maxCommits)) lines.push(`- ${commit}`);
      if (commits.length > maxCommits) {
        lines.push(`- ... and ${commits.length - maxCommits} more`);
      }
    }
    lines.push("");
  }
  return lines;
}

function driftReport(changes, options = {}) {
  const changedPaths = new Set(changes.map((change) => change.path));
  if (changedPaths.size === 0) {
    return {
      blockingReasons: [],
      lines: ["No vendor submodule pointer changes detected, so vendor drift impact was skipped.", ""],
    };
  }

  const runner = options.runner || runCommand;
  const root = options.root || REPO_ROOT;
  const result = runner(path.join(root, "scripts/check-vendor-drift.py"), ["--json"], { cwd: root });
  let data;
  try {
    data = JSON.parse(result.stdout);
  } catch {
    const detail = failureDetail("vendor drift", result);
    return {
      blockingReasons: [`vendor drift analysis failed: ${detail}`],
      lines: [`Could not parse \`check-vendor-drift.py --json\` output: ${detail}`, ""],
    };
  }

  const filtered = (key) => (data[key] || []).filter((item) => changedPaths.has(item.submodule));
  const high = filtered("drifted_high_priority");
  const low = filtered("drifted_low_priority");
  const unverified = filtered("unverified");
  const lines = [
    `- High-priority cited-file drift: **${high.length}**`,
    `- Low-priority unchanged cited-file bumps: **${low.length}**`,
    `- Unverified vendor-citing ref/submodule pairs on changed submodules: **${unverified.length}**`,
    "",
  ];
  if (high.length > 0) {
    lines.push("High-priority items:");
    for (const item of high.slice(0, 20)) {
      lines.push(`- \`${item.ref}\` — \`${item.submodule}\`; changed: ${(item.touched_files || []).slice(0, 3).join(", ")}`);
    }
    if (high.length > 20) lines.push(`- ... and ${high.length - 20} more`);
    lines.push("");
  }
  return {
    blockingReasons: high.length > 0
      ? [`${high.length} high-priority cited-file drift finding(s) remain`]
      : [],
    lines,
  };
}

function driftSection(changes, options = {}) {
  return driftReport(changes, options).lines;
}

function classifyMcpFiles(files) {
  const matched = new Set();
  const lenses = MCP_REVIEW_LENSES.map((lens) => {
    const lensFiles = files.filter((file) => lens.matches(file));
    for (const file of lensFiles) matched.add(file);
    return { name: lens.name, review: lens.review, files: lensFiles };
  });
  return {
    lenses,
    unclassified: files.filter((file) => !matched.has(file)),
  };
}

function fileExamples(files, limit = 5) {
  const examples = files.slice(0, limit).map((file) => `\`${file}\``).join(", ");
  return files.length > limit ? `${examples}, and ${files.length - limit} more` : examples;
}

function mcpSemanticReport(changes, options = {}) {
  const change = changes.find((item) => item.path === MCP_SUBMODULE);
  if (!change) {
    return {
      blockingReasons: [],
      lines: ["No Zscaler MCP submodule pointer change detected.", ""],
    };
  }
  if (isZeroSha(change.oldSha) || isZeroSha(change.newSha)) {
    return {
      blockingReasons: ["MCP submodule pointer is unresolved"],
      lines: ["The MCP submodule pointer is unresolved; semantic path classification could not run.", ""],
    };
  }

  const runner = options.runner || runCommand;
  const root = options.root || REPO_ROOT;
  const result = runner(
    "git",
    ["-C", change.path, "diff", "--name-only", `${change.oldSha}..${change.newSha}`, "--"],
    { cwd: root },
  );
  if (result.status !== 0) {
    const detail = failureDetail("MCP diff", result);
    return {
      blockingReasons: [`MCP change enumeration failed: ${detail}`],
      lines: [`Could not enumerate MCP changes: ${detail}`, ""],
    };
  }

  const files = result.stdout.split(/\r?\n/).filter(Boolean);
  const classification = classifyMcpFiles(files);
  const lines = [
    `Changed MCP paths classified: **${files.length}**`,
    "",
    "These lenses are a review queue, not evidence that changed behavior is safe or fully documented.",
    "",
  ];
  for (const lens of classification.lenses.filter((item) => item.files.length > 0)) {
    lines.push(`- [ ] **${lens.name}** — ${lens.files.length} file(s). ${lens.review}`);
    lines.push(`  Examples: ${fileExamples(lens.files)}`);
  }
  if (classification.unclassified.length > 0) {
    lines.push(`- [ ] **Unclassified paths** — ${classification.unclassified.length} file(s). Review manually and extend the classifier if this is a recurring surface.`);
    lines.push(`  Examples: ${fileExamples(classification.unclassified)}`);
  } else {
    lines.push("- Unclassified changed paths: **0**");
  }
  lines.push("");
  return {
    blockingReasons: classification.unclassified.length > 0
      ? [`${classification.unclassified.length} MCP path(s) remain unclassified`]
      : [],
    lines,
  };
}

function mcpSemanticSection(changes, options = {}) {
  return mcpSemanticReport(changes, options).lines;
}

function buildSummaryReport(args, options = {}) {
  const changes = changedSubmodules({ ...args, ...options });
  const drift = driftReport(changes, options);
  const mcp = mcpSemanticReport(changes, options);
  const mode = args.worktree
    ? "Generated from the base ref through the current index and working tree."
    : "Generated automatically for a PR touching `vendor/**`.";
  const content = [
    "## Vendor Impact Summary",
    "",
    mode,
    "",
    "## Submodule Commit Logs",
    "",
    ...submoduleLogs(changes, args.maxCommits, options),
    "## Reference Drift",
    "",
    ...drift.lines,
    "## MCP Semantic Review Lenses",
    "",
    ...mcp.lines,
    "## Asymmetry Candidates",
    "",
    "`scripts/find-asymmetries.py` runs in CI and uploads the runtime-data asymmetry report as an artifact when present.",
    "",
  ].join("\n");
  return {
    blockingReasons: [...drift.blockingReasons, ...mcp.blockingReasons],
    content,
  };
}

function buildSummary(args, options = {}) {
  return buildSummaryReport(args, options).content;
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const output = path.isAbsolute(args.output) ? args.output : path.join(REPO_ROOT, args.output);
    const report = buildSummaryReport(args);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, report.content, "utf8");
    process.stdout.write(`${output}\n`);
    if (args.strict && report.blockingReasons.length > 0) {
      process.stderr.write("vendor impact strict mode blocked:\n");
      for (const reason of report.blockingReasons) process.stderr.write(`- ${reason}\n`);
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`vendor-impact-summary: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

export {
  buildSummary,
  buildSummaryReport,
  changedSubmodules,
  classifyMcpFiles,
  driftReport,
  mcpSemanticSection,
  mcpSemanticReport,
  parseArgs,
  parseRawSubmoduleDiff,
};
