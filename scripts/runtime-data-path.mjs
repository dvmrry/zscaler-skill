#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  containedRelative,
  runtimeDataMountSettings,
  toPosix,
} from "./lib.mjs";

function usage(exitCode = 0) {
  const out = exitCode === 0 ? process.stdout : process.stderr;
  out.write(`Usage:
  node scripts/runtime-data-path.mjs [--root <repo>] [--runtime-config <json>] [--config <setup-json>] [--absolute] [--json] [path-segment ...]

Resolves a path under the configured runtime-data mount without reading tenant
contents. Output is repository-relative by default. ZSCALER_SKILL_RUNTIME_CONFIG
and ZSCALER_SKILL_SETUP_CONFIG are honored when explicit config flags are absent.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    absolute: false,
    config: null,
    json: false,
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
    runtimeConfig: null,
    segments: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--absolute") {
      args.absolute = true;
      continue;
    }
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    if (arg === "--root" || arg === "--runtime-config" || arg === "--config") {
      const value = argv[i + 1];
      if (!value) throw new Error(`${arg} requires a value`);
      if (arg === "--root") args.root = path.resolve(value);
      if (arg === "--runtime-config") args.runtimeConfig = value;
      if (arg === "--config") args.config = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("-")) throw new Error(`Unknown argument: ${arg}`);
    args.segments.push(arg);
  }
  if (args.absolute && args.json) {
    throw new Error("--absolute and --json cannot be used together");
  }
  return args;
}

function resolveRuntimeDataOutput(options) {
  const root = path.resolve(options.root);
  const settings = runtimeDataMountSettings(root, {
    runtimeConfigPath: options.runtimeConfig,
    setupConfigPath: options.config,
  });
  const mountRoot = path.resolve(root, settings.mountPath);
  const target = path.resolve(mountRoot, ...(options.segments || []));
  const underMount = containedRelative(mountRoot, target);
  if (underMount === null) {
    throw new Error("runtime data path segments must stay inside the configured mount");
  }
  const relativePath = toPosix(path.relative(root, target));
  return {
    absolutePath: target,
    mountPath: settings.mountPath,
    path: relativePath,
    runtimeConfigPath: settings.runtimeConfigPath,
    runtimeConfigSelectedBy: settings.runtimeConfigSelectedBy,
    setupConfigPath: settings.setupConfigPath,
    setupConfigSelectedBy: settings.setupConfigSelectedBy,
    tracking: settings.tracking,
  };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = resolveRuntimeDataOutput(args);
    if (args.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      process.stdout.write(`${args.absolute ? result.absolutePath : result.path}\n`);
    }
  } catch (error) {
    process.stderr.write(`runtime-data-path: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  resolveRuntimeDataOutput,
};
