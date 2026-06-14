/**
 * artifacts-source-lib.mjs
 *
 * Shared finding-source resolution primitives for the register-shaped roles
 * (auditor, SOC). These classify the role-agnostic source forms — file:line,
 * cross-file, and bare-file-path — so the correctness-critical logic (notably
 * the trailing-newline / off-by-one EOF line count) lives in ONE place instead
 * of being copy-pasted per role. A fix here now fixes every role at once.
 *
 * What stays per-role (deliberately NOT here): the auditor `check:<name>` form,
 * the SOC `evidence:<name>` form, the SOC framework-not-evidence guard, and each
 * role's "unrecognized format" error string. Each role's resolveSource() keeps
 * those branches and composes the primitives below in its own order.
 *
 * Contract: each resolve* primitive returns a result object
 *   { type, resolves: boolean, error?: string }
 * when the input matches its form, or `null` when it does not — so the caller
 * falls through to the next form.
 *
 * Zero-dependency: Node stdlib only.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * Resolve a repo-relative path safely, rejecting absolute paths, NUL bytes, and
 * any path that normalizes to an escape above `root`. Identical across the
 * register-shaped artifact generators; single-sourced here.
 */
export function safeRepoPath(root, relativePath) {
  if (!relativePath || path.isAbsolute(relativePath) || relativePath.includes("\0")) {
    throw new Error(`unsafe relative path: ${relativePath}`);
  }
  const normalized = path.normalize(relativePath);
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return path.join(root, normalized);
}

/**
 * (b) cross-file: source contains a comma or " + " separating 2+ paths.
 * Resolves if every listed file exists under root. Returns null if the source
 * is not cross-file-shaped (no separator, or fewer than 2 parts).
 */
export function resolveCrossFileSource(root, source) {
  const s = String(source || "").trim();
  const crossFileSep = /,|\s\+\s/;
  if (!crossFileSep.test(s)) return null;

  const rawParts = s.split(/,|\s\+\s/).map((p) => p.trim()).filter(Boolean);
  if (rawParts.length < 2) return null;

  const missing = [];
  for (const part of rawParts) {
    // Strip optional :linespec suffix for cross-file form.
    const filePart = part.replace(/:\d[\d-]*$/, "").trim();
    try {
      const abs = safeRepoPath(root, filePart);
      if (!fs.existsSync(abs)) missing.push(filePart);
    } catch {
      missing.push(filePart);
    }
  }
  if (missing.length > 0) {
    return {
      type: "cross-file",
      resolves: false,
      error: `cross-file source references files that do not exist: ${missing.join(", ")}`,
    };
  }
  return { type: "cross-file", resolves: true };
}

/**
 * (a) file:line — "path/to/file.md:42" or "path:10-20".
 * Resolves if the file exists under root AND the cited line(s) are within the
 * file. Returns null if the source is not file:line-shaped.
 */
export function resolveFileLineSource(root, source) {
  const s = String(source || "").trim();
  // Split on the LAST colon that is followed by a digit.
  const fileLineMatch = /^(.+):(\d+)(?:-(\d+))?$/.exec(s);
  if (!fileLineMatch) return null;

  const filePart = fileLineMatch[1].trim();
  const lineStart = parseInt(fileLineMatch[2], 10);
  // lineEnd defaults to lineStart if not given.
  const lineEnd = fileLineMatch[3] !== undefined ? parseInt(fileLineMatch[3], 10) : lineStart;
  if (lineStart < 1) {
    return { type: "file-line", resolves: false, error: "line number must be >= 1 (lines are 1-indexed)" };
  }
  if (lineEnd < lineStart) {
    return { type: "file-line", resolves: false, error: `line range end (${lineEnd}) < start (${lineStart})` };
  }
  let abs;
  try {
    abs = safeRepoPath(root, filePart);
  } catch (err) {
    return { type: "file-line", resolves: false, error: err.message };
  }
  if (!fs.existsSync(abs)) {
    return { type: "file-line", resolves: false, error: `file does not exist: ${filePart}` };
  }
  const content = fs.readFileSync(abs, "utf8");
  // Strip the trailing empty element produced by a trailing newline so that
  // "N visible lines + trailing newline" is counted as N, not N+1. Without this
  // correction, citing line N+1 on a standard newline-terminated file would pass
  // the gate even though that line has no content.
  const splitLines = content.split(/\r?\n/);
  const lineCount =
    splitLines.length > 0 && splitLines[splitLines.length - 1] === ""
      ? splitLines.length - 1
      : splitLines.length;
  if (lineEnd > lineCount) {
    return {
      type: "file-line",
      resolves: false,
      error: `line ${lineEnd} beyond EOF (file has ${lineCount} lines): ${filePart}`,
    };
  }
  return { type: "file-line", resolves: true };
}

/**
 * Bare file path (no line reference): if `source` is an existing file under
 * root, return an actionable "needs a line reference" error (type "unknown",
 * resolves:false). Returns null if it is not an existing file path, so the
 * caller can fall through to its own unrecognized-format error.
 */
export function resolveBareFilePath(root, source) {
  const s = String(source || "").trim();
  try {
    const abs = safeRepoPath(root, s);
    if (fs.existsSync(abs)) {
      return {
        type: "unknown",
        resolves: false,
        error: `source "${s}" is a bare file path without a line reference. Use path:line format (e.g. ${s}:1).`,
      };
    }
  } catch {
    // Not a file path — fall through.
  }
  return null;
}
