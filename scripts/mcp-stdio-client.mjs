/**
 * mcp-stdio-client.mjs
 *
 * Shared JSON-RPC-over-stdio client for driving the role MCP servers from tests
 * and the conformance gate.
 *
 * Spawns a stdio MCP server as a child process, frames newline-delimited
 * JSON-RPC, matches responses to requests by id, and exposes
 * call / sendNotification / close (plus the raw child for crash-path checks).
 *
 * Extracted from the byte-for-byte copies that previously lived in
 * investigator/auditor/soc-mcp-server.test.mjs and check-mcp-conformance.mjs —
 * a fix to the transport now lands in one place instead of four.
 *
 * NOTE: this filename deliberately does NOT end in `.test.mjs`. check-fast.mjs
 * auto-discovers `scripts/*.test.mjs` as runnable suites; this is a helper that
 * those suites import, not a suite itself.
 *
 * Zero-dependency: Node stdlib only.
 */
import { spawn } from "node:child_process";
import process from "node:process";

export const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

/**
 * Spawn an MCP stdio server and return a client bound to it.
 *
 * @param {string} serverScript  Absolute path to the server `.mjs` to spawn.
 * @param {{ requestTimeoutMs?: number }} [opts]
 * @returns {{
 *   call: (request: object) => Promise<object>,
 *   sendNotification: (notification: object) => void,
 *   close: () => void,
 *   child: import("node:child_process").ChildProcess,
 * }}
 */
export function spawnMcpServer(serverScript, opts = {}) {
  const requestTimeoutMs = opts.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;

  const child = spawn(process.execPath, [serverScript], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdoutBuffer = "";
  const pending = new Map(); // id -> { resolve, reject, timer }

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    let newlineIndex = stdoutBuffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = stdoutBuffer.slice(0, newlineIndex).trim();
      stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);
      if (line.length > 0) {
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          // Skip unparseable lines (e.g. stray stdout that is not JSON-RPC).
          newlineIndex = stdoutBuffer.indexOf("\n");
          continue;
        }
        const entry = pending.get(msg.id);
        if (entry) {
          clearTimeout(entry.timer);
          pending.delete(msg.id);
          entry.resolve(msg);
        }
      }
      newlineIndex = stdoutBuffer.indexOf("\n");
    }
  });

  child.stderr.setEncoding("utf8");
  // Discard stderr (server logs go there).

  let nextId = 1;

  function call(request) {
    return new Promise((resolve, reject) => {
      const id = request.id !== undefined ? request.id : nextId++;
      const fullRequest = { ...request, id };
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timeout waiting for response to method: ${request.method}`));
      }, requestTimeoutMs);
      pending.set(id, { resolve, reject, timer });
      child.stdin.write(`${JSON.stringify(fullRequest)}\n`);
    });
  }

  function sendNotification(notification) {
    child.stdin.write(`${JSON.stringify(notification)}\n`);
  }

  function close() {
    child.stdin.end();
  }

  return { call, sendNotification, close, child };
}
