#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LINK_RE = /\[[^\]]*]\(([^)]+)\)/g;
const INFERENCE_RE =
  /operationally significant|most common cause|most common (root )?cause|in roughly all|in nearly all|in nearly every|almost never|we observed|we have observed|operators (consistently )?(report|see)\s|the lever for|by far the/;
const CITATION_RE =
  /vendor\/[a-zA-Z0-9_.-]+\/|[a-zA-Z0-9_-]+\.(py|go|sh|md):[0-9]+|Tier [A-D]\b|clarification [a-zA-Z]+-[0-9]+|\(line[s]? [0-9]+|see (also )?[`[]/;

function parseArgs(argv) {
  const options = {
    root: DEFAULT_ROOT,
    checkUrls: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--check-urls") {
      options.checkUrls = true;
    } else if (arg === "--root") {
      i += 1;
      if (!argv[i]) throw new Error("--root requires a path");
      options.root = path.resolve(argv[i]);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function walkMarkdown(root, subdirs = ["references", "agents"]) {
  const files = [];
  for (const subdir of subdirs) {
    const start = path.join(root, subdir);
    if (!fs.existsSync(start)) continue;
    walk(start, files);
  }
  return files.sort();
}

function walk(current, files) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
}

function rel(root, filePath) {
  return path.relative(root, filePath) || ".";
}

function stripCode(text) {
  let inFence = false;
  const lines = [];
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      lines.push("");
      continue;
    }
    lines.push(inFence ? "" : line.replace(/`[^`]*`/g, ""));
  }
  return lines.join("\n");
}

function normalizeTarget(rawTarget) {
  let target = rawTarget.trim();
  target = target.split(/\s+"[^"]*"|\s+'[^']*'/, 1)[0];
  return target;
}

function targetPath(target) {
  return target.split("#", 1)[0].split("?", 1)[0];
}

async function checkUrl(url) {
  if (await fetchOk(url, "HEAD")) return true;
  return fetchOk(url, "GET");
}

async function fetchOk(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const headers = method === "GET" ? { Range: "bytes=0-1023" } : {};
    const response = await fetch(url, {
      method,
      redirect: "follow",
      headers,
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkLinks(root, files, checkUrls) {
  const brokenPaths = [];
  const brokenUrls = [];
  let totalPaths = 0;
  let totalUrls = 0;

  for (const file of files) {
    const relFile = rel(root, file);
    const fileDir = path.dirname(file);
    const cleaned = stripCode(fs.readFileSync(file, "utf8"));
    for (const match of cleaned.matchAll(LINK_RE)) {
      const target = normalizeTarget(match[1]);
      if (!target) continue;

      if (target.startsWith("http://") || target.startsWith("https://")) {
        if (!checkUrls) continue;
        totalUrls += 1;
        if (!(await checkUrl(target))) {
          brokenUrls.push(`${relFile} -> ${target}`);
        }
      } else if (target.startsWith("mailto:") || target.startsWith("#")) {
        continue;
      } else {
        totalPaths += 1;
        const relativePath = targetPath(target);
        if (!relativePath) continue;
        const resolved = path.normalize(path.resolve(fileDir, relativePath));
        if (!fs.existsSync(resolved)) {
          brokenPaths.push(`${relFile} -> ${target}`);
        }
      }
    }
  }

  return { brokenPaths, brokenUrls, totalPaths, totalUrls };
}

function shouldSkipInference(root, file) {
  const relFile = rel(root, file);
  if (relFile.endsWith("/index.md") || relFile.endsWith("/README.md")) return true;
  if (relFile.startsWith("references/_meta/primer/")) return true;
  if (relFile.startsWith("agents/_meta/")) return true;
  return /^agents\/[^/]+\/(prompt|methodology)\.md$/.test(relFile)
    || /^agents\/[^/]+\/diagnostics\/template\.md$/.test(relFile)
    || /^agents\/[^/]+\/grounding\/template\.md$/.test(relFile);
}

function checkInference(root, files) {
  const hits = [];
  for (const file of files) {
    if (shouldSkipInference(root, file)) continue;
    hits.push(...checkInferenceFile(root, file));
  }
  return hits;
}

function checkInferenceFile(root, file) {
  const hits = [];
  const relFile = rel(root, file);
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let paragraph = "";
  let paragraphStart = 0;
  let inFrontmatter = false;
  let inCode = false;
  let inOpenSection = false;

  function flush() {
    if (!paragraph) return;
    const lower = paragraph.toLowerCase();
    if (INFERENCE_RE.test(lower) && !CITATION_RE.test(paragraph)) {
      let snippet = paragraph.trimStart();
      if (snippet.length > 140) snippet = `${snippet.slice(0, 140)}...`;
      hits.push(`${relFile}:${paragraphStart}:${snippet}`);
    }
    paragraph = "";
    paragraphStart = 0;
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line === "---") {
      if (lineNumber === 1) {
        inFrontmatter = true;
        return;
      }
      if (inFrontmatter) {
        inFrontmatter = false;
        return;
      }
    }
    if (inFrontmatter) return;
    if (line.startsWith("```")) {
      inCode = !inCode;
      return;
    }
    if (inCode) return;
    if (line.startsWith("## ")) {
      flush();
      inOpenSection = /open questions|open items/i.test(line);
      return;
    }
    if (inOpenSection) return;
    if (/^\s*$/.test(line)) {
      flush();
      return;
    }
    if (paragraphStart === 0) paragraphStart = lineNumber;
    paragraph += ` ${line}`;
  });
  flush();
  return hits;
}

export async function run(options) {
  const files = walkMarkdown(options.root);
  const linkResult = await checkLinks(options.root, files, options.checkUrls);
  const inferenceHits = checkInference(options.root, files);
  return { files, ...linkResult, inferenceHits };
}

function printResults(options, result) {
  console.log("Checking citations in references/**/*.md and agents/**/*.md");
  if (!options.checkUrls) {
    console.log("(URL checks disabled - re-run with --check-urls to enable)");
  }
  console.log("");
  console.log(`Paths checked: ${result.totalPaths}`);
  if (options.checkUrls) console.log(`URLs checked:  ${result.totalUrls}`);
  console.log("");

  if (result.brokenPaths.length > 0) {
    console.log(`✗ Broken paths (${result.brokenPaths.length}):`);
    for (const item of result.brokenPaths) console.log(`  ${item}`);
    console.log("");
  }
  if (result.brokenUrls.length > 0) {
    console.log(`✗ Broken URLs (${result.brokenUrls.length}):`);
    for (const item of result.brokenUrls) console.log(`  ${item}`);
    console.log("");
  }
  if (result.brokenPaths.length === 0 && result.brokenUrls.length === 0) {
    console.log("✓ All citations resolve.");
  }

  console.log("");
  console.log("Checking for inference-without-citation in references/**/*.md and agents/**/*.md");
  if (result.inferenceHits.length > 0) {
    console.log(`✗ Inference-without-citation (${result.inferenceHits.length}):`);
    for (const item of result.inferenceHits) console.log(`  ${item}`);
    console.log("");
  } else {
    console.log("✓ No inference-without-citation paragraphs.");
  }
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || "")) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = await run(options);
    printResults(options, result);
    process.exit(
      result.brokenPaths.length > 0 || result.brokenUrls.length > 0 || result.inferenceHits.length > 0
        ? 1
        : 0,
    );
  } catch (error) {
    console.error(`check-citations: ${error.message}`);
    process.exit(2);
  }
}
