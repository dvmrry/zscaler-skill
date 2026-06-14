/**
 * mcp-server-lib.mjs
 *
 * Shared, role-agnostic primitives for the stdio MCP role servers (investigator,
 * auditor, SOC): the JSON-RPC envelope builders, repo-root resolution, the
 * VERSION reader, and the temp-file helpers. These were byte-for-byte identical
 * across the three servers; a protocol-shape fix now lands in one place.
 *
 * Deliberately NOT here (these diverge per role and stay in each server):
 * the tool set and dispatch, RESOURCE_TEMPLATES and resources/list, the URI
 * scheme parsers, and the prompts/list + prompts/get handlers. This library is
 * the invariant plumbing only — it does not know what any tool does.
 *
 * Zero-dependency: Node stdlib only.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// ── JSON-RPC envelope ─────────────────────────────────────────────────────────

export function makeResponse(id, result) {
  return { jsonrpc: "2.0", id, result };
}

export function makeError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: "2.0", id, error };
}

// ── Repo root ───────────────────────────────────────────────────────────────

export function resolveRepoRoot(rootArg) {
  if (!rootArg) throw new Error("root is required");
  const root = path.resolve(rootArg);
  const stat = fs.statSync(root, { throwIfNoEntry: false });
  if (!stat || !stat.isDirectory()) {
    throw new Error(`repo root does not exist or is not a directory: ${root}`);
  }
  return root;
}

// ── Server version ────────────────────────────────────────────────────────────

/**
 * Read the repository VERSION file (sibling `../VERSION` relative to the calling
 * server module). Pass `import.meta.url` from the server. Returns "unknown" if
 * the file is missing or unreadable.
 */
export function readServerVersion(importMetaUrl) {
  try {
    const versionFile = new URL("../VERSION", importMetaUrl);
    return fs.readFileSync(versionFile, "utf8").trim();
  } catch {
    return "unknown";
  }
}

// ── Temp-file helpers ─────────────────────────────────────────────────────────
// `prefix` identifies the owning server in the temp dir name (e.g. "aud-mcp-").

export function writeTmpJson(value, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const filePath = path.join(dir, "content.json");
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return { dir, filePath };
}

export function writeTmpFile(content, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const filePath = path.join(dir, "content");
  fs.writeFileSync(filePath, content, "utf8");
  return { dir, filePath };
}

export function cleanupTmp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup.
  }
}
