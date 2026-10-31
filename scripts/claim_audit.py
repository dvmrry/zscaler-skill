#!/usr/bin/env python3
"""The claim audit: does each Tier A claim's evidence state every material part of its statement?

`kb.mjs validate` proves a quote is in its source; it cannot tell whether the quotes say what the statement says.
This asks a model, with the rubric in references/_meta/evals/claim-audit/rubric.md: Haiku judges every claim, then
Opus re-judges every "covered" verdict and every low-confidence flag. A claim is `overreach` when either model
flags it with high confidence, `borderline` when the only flags are low-confidence (a person decides), else
`covered`. On the 282-claim calibration set beside the rubric (2026-10-31): 1 of 176 overreach verdicts was wrong,
1 of 191 overreach claims came out covered, and 32 claims were borderline, about half of them real. Each quote is
shown with the headings or enclosing function above it, as a reader of the source would see it.

Verdicts are kept in references/_meta/claim-audit.json, keyed by a hash of the statement and evidence, so a claim
is audited again only when it changes. Runs go through the `claude` CLI on your Claude plan quota; nothing here runs
in CI. Run from the repo root; write run directories outside the checkout.

  python3 scripts/claim_audit.py build --base <git ref> --out <dir>   Tier A claims new or changed since the ref
  python3 scripts/claim_audit.py build --ids <file> --out <dir>       the claims named in the file, one ID per line
  python3 scripts/claim_audit.py build --unaudited --out <dir>        claims with no current verdict [--limit N]
  python3 scripts/claim_audit.py build --calibration --out <dir>      the calibration set
  python3 scripts/claim_audit.py run --out <dir> [--jobs 4] [--batch 20]
  python3 scripts/claim_audit.py grade --out <dir>                    a calibration run against its labels
  python3 scripts/claim_audit.py record --out <dir>                   write the run's verdicts into the record
  python3 scripts/claim_audit.py status                               audited, stale and unaudited counts
"""
from __future__ import annotations

import collections
import datetime
import hashlib
import json
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BENCH = ROOT / "references/_meta/evals/claim-audit"
RECORD = ROOT / "references/_meta/claim-audit.json"
SOURCES = json.loads((ROOT / "references/_meta/sources.json").read_text())["sources"]
FIRST, SECOND = "claude-haiku-5-5", "claude-opus-5-5"


# ------------------------------------------------------------------ evidence as a reader sees it

_texts: dict = {}


def source_text(src: str, path: str, ref: str) -> str | None:
    key = (src, path, ref)
    if key not in _texts:
        s = SOURCES.get(src, {})
        t = None
        if src == "zscaler-help" and path.endswith(".json"):
            t = subprocess.run([sys.executable, str(ROOT / "scripts/help_capture.py"), "text", str(ROOT / "vendor/zscaler-help" / path)],
                               capture_output=True, text=True).stdout
        elif s.get("kind") == "submodule":
            r = subprocess.run(["git", "-C", str(ROOT / s["root"]), "show", f"{ref}:{path}"], capture_output=True, text=True)
            t = r.stdout if r.returncode == 0 else None
        else:
            f = ROOT / s.get("root", "") / path
            t = f.read_text(errors="ignore") if f.is_file() else None
        _texts[key] = t
    return _texts[key]


def _norm_lines(text: str) -> tuple[str, list[int]]:
    """Whitespace-collapsed text plus, per normalized offset, the line it came from."""
    out, line_of = [], []
    for i, line in enumerate(text.split("\n")):
        n = re.sub(r"\s+", " ", line.replace("**", "")).strip()
        if not n:
            continue
        if out:
            out.append(" ")
            line_of.append(i)
        out.append(n)
        line_of.extend([i] * len(n))
    return "".join(out), line_of


SECTION = re.compile(r"^(To add a new\b|.*window appears)", re.I)
HEAD = re.compile(r"^(#{1,6} .+|func .+|def .+|\s{0,8}def \w.+|type \w+ struct.*|class \w.+|\s*\"\w+\": \{$)")


def context(src: str, path: str, ref: str, quote: str, after: str | None = None, max_lines: int = 3) -> list[str] | None:
    """What sits above a quote: a help page's headings and enclosing list items, or code's enclosing function."""
    text = source_text(src, path, ref)
    if not text:
        return None
    norm, line_of = _norm_lines(text)
    nq = re.sub(r"\s+", " ", quote.replace("**", "")).strip()
    start = 0
    if after:
        a = norm.find(re.sub(r"\s+", " ", after.replace("**", "")).strip())
        start = max(a, 0)
    i = norm.find(nq, start)
    if i < 0:
        return None
    lines = text.split("\n")
    qline = line_of[i]
    indent = lambda line: len(line) - len(line.lstrip())  # noqa: E731
    found: list[str] = []
    if src == "zscaler-help" or path.endswith(".md"):
        cur = qind = indent(lines[qline])
        level, intros = 7, 0
        for j in range(qline - 1, -1, -1):
            line = lines[j]
            if not line.strip() or line.lstrip().startswith("|"):
                continue
            m = re.match(r"^(#{1,6}) ", line)
            if m:
                if len(m.group(1)) < level:
                    found.append(line.strip()[:200])
                    level = len(m.group(1))
                    if level == 1:
                        break
                continue
            if level < 7:
                continue
            if indent(line) < cur:
                found.append(line.strip()[:200])
                cur = indent(line)
            elif indent(line) <= qind and (line.rstrip().endswith(":") or "window appears" in line):
                body = re.sub(r"^[-\d.\s]+", "", line.strip())
                if SECTION.match(body):
                    found.append(line.strip()[:200])
                    break
                if intros < 1:
                    found.append(line.strip()[:200])
                    intros += 1
            if len(found) >= max_lines + 2:
                break
    else:
        for j in range(qline - 1, -1, -1):
            if HEAD.match(lines[j]):
                found.append(lines[j].strip()[:160])
                break
    return list(reversed(found)) or None


def render_evidence(evidence: list[dict]) -> list[dict]:
    """A claim's evidence as items to judge: each quote with its context and `after` line, each pointer with what
    the JSON there has or lacks."""
    out = []
    for e in evidence:
        src = e["source"]
        kind = SOURCES.get(src, {}).get("kind", "")
        where = f"{src}:{e['path']}" + (f" at {','.join(e['at'])}" if e.get("at") else "")
        label = "vendor help page" if src == "zscaler-help" else ("vendor code/docs" if kind == "submodule" else "vendor file")
        if "pointer" in e:
            item = {"source": where, "kind": "json-pointer", "pointer": e["pointer"]}
            if e.get("expect"):
                item["has"] = e["expect"]
            if e.get("expect_absent"):
                item["lacks"] = e["expect_absent"]
            out.append(item)
        for q in e.get("quotes", []):
            item = {"source": where, "kind": label, "quote": q}
            if e.get("after"):
                item["after"] = e["after"]
            ctx = context(src, e["path"], (e.get("at") or ["HEAD"])[0], q, e.get("after"))
            if ctx:
                item["context"] = ctx
            out.append(item)
    return out


def fingerprint(claim: dict) -> str:
    """What a verdict is about: the statement and the evidence, so any change to either asks for a new one."""
    return hashlib.sha256(json.dumps([claim["statement"], claim.get("evidence") or []], sort_keys=True).encode()).hexdigest()[:16]


def task(cid: str, claim: dict) -> dict:
    return {"id": cid, "sha": fingerprint(claim), "statement": claim["statement"], "evidence": render_evidence(claim.get("evidence") or [])}


# ------------------------------------------------------------------ which claims

def subjects(ref: str | None = None):
    """Every subject file, as committed at `ref` or in the working tree."""
    for f in sorted((ROOT / "references").glob("*/*.json")):
        rel = f.relative_to(ROOT).as_posix()
        if ref:
            r = subprocess.run(["git", "-C", str(ROOT), "show", f"{ref}:{rel}"], capture_output=True, text=True)
            if r.returncode != 0:
                continue
            d = json.loads(r.stdout)
        else:
            d = json.loads(f.read_text())
        if isinstance(d, dict) and "claims" in d and "id" in d:
            yield d


def tier_a(d: dict):
    for local, c in (d.get("claims") or {}).items():
        if c.get("tier") == "A" and c.get("evidence"):
            yield f"{d['id']}:{local}", c


def record() -> dict:
    return json.loads(RECORD.read_text()) if RECORD.exists() else {"schema_version": 1, "rubric_sha": "", "claims": {}}


def rubric_sha() -> str:
    return hashlib.sha256((BENCH / "rubric.md").read_bytes()).hexdigest()[:16]


def build(out: Path, base: str | None, ids: Path | None, unaudited: bool, calibration: bool, limit: int | None) -> int:
    out.mkdir(parents=True, exist_ok=True)
    tasks = []
    if calibration:
        tasks = [json.loads(line) for line in (BENCH / "calibration-tasks.jsonl").read_text().splitlines() if line.strip()]
    else:
        now = {cid: c for d in subjects() for cid, c in tier_a(d)}
        if base:
            # A claim moved to another subject unchanged keeps its verdict's worth: only new content is audited.
            seen = {fingerprint(c) for d in subjects(base) for _, c in tier_a(d)}
            want = [cid for cid, c in now.items() if fingerprint(c) not in seen]
        elif ids:
            want = [line.strip() for line in ids.read_text().splitlines() if line.strip()]
            missing = [cid for cid in want if cid not in now]
            if missing:
                raise SystemExit(f"not Tier A claims with evidence: {', '.join(missing[:5])}")
        else:
            rec = record()["claims"]
            want = [cid for cid, c in now.items() if rec.get(cid, {}).get("sha") != fingerprint(c)] if unaudited else list(now)
            # Claims that changed since their audit first: they were checked once, and the change is the risk.
            want.sort(key=lambda cid: cid not in rec)
        tasks = [task(cid, now[cid]) for cid in want[:limit]]
    with (out / "tasks.jsonl").open("w") as f:
        for t in tasks:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")
    (out / "meta.json").write_text(json.dumps({"rubric_sha": rubric_sha(), "calibration": calibration, "models": [FIRST, SECOND]}, indent=2) + "\n")
    print(f"{len(tasks)} claims -> {out / 'tasks.jsonl'}")
    return 0


# ------------------------------------------------------------------ judging

def ask(model: str, batch: list[dict], cwd: Path) -> list[dict]:
    """One model call on a batch: the rubric, then the claims as JSON lines; verdicts parsed from its reply. It runs
    from the run directory, outside the checkout, so no project instructions enter the judgement."""
    claims = "\n".join(json.dumps({k: t[k] for k in ("id", "statement", "evidence")}, ensure_ascii=False) for t in batch)
    prompt = f"{(BENCH / 'rubric.md').read_text()}\nCLAIMS:\n{claims}\n"
    r = subprocess.run(["claude", "-p", prompt, "--model", model, "--output-format", "json", "--no-session-persistence", "--tools", ""],
                       capture_output=True, text=True, timeout=1800, cwd=cwd)
    try:
        reply = json.loads(r.stdout).get("result", "")
    except ValueError:
        return []
    wanted = {t["id"] for t in batch}
    out = []
    for line in reply.splitlines():
        m = re.search(r"\{.*\}", line)
        if not m:
            continue
        try:
            v = json.loads(m.group(0))
        except ValueError:
            continue
        if v.get("id") in wanted and v.get("verdict") in ("covered", "overreach"):
            out.append({"id": v["id"], "verdict": v["verdict"], "uncovered": v.get("uncovered") or [], "confidence": v.get("confidence", "high")})
    return out


def judge_all(model: str, tasks: list[dict], jobs: int, size: int, raw: Path) -> dict[str, dict]:
    """Every task judged once by `model`, resuming from `raw`; a batch that fails is retried claim by claim later."""
    done = {v["id"]: v for v in map(json.loads, raw.read_text().splitlines())} if raw.exists() else {}
    for attempt in range(3):
        todo = [t for t in tasks if t["id"] not in done]
        if not todo:
            break
        batches = [todo[i:i + size] for i in range(0, len(todo), size if attempt == 0 else max(1, size // 4))]
        with ThreadPoolExecutor(jobs) as ex, raw.open("a") as f:
            for got in ex.map(lambda b: ask(model, b, raw.parent), batches):
                for v in got:
                    if v["id"] not in done:
                        done[v["id"]] = v
                        f.write(json.dumps(v, ensure_ascii=False) + "\n")
                f.flush()
        print(f"{model}: {len(done)}/{len(tasks)} judged", file=sys.stderr)
    return done


def combine(first: dict, second: dict | None) -> str:
    """The verdict from both passes. Low-confidence flags are where the models disagree with a careful reader most,
    so those are `borderline`, for a person; a high-confidence flag from either model is `overreach`."""
    flags = [v for v in (first, second) if v and v["verdict"] == "overreach"]
    return "overreach" if any(v["confidence"] == "high" for v in flags) else "borderline" if flags else "covered"


def run(out: Path, jobs: int, size: int) -> int:
    tasks = [json.loads(line) for line in (out / "tasks.jsonl").read_text().splitlines() if line.strip()]
    first = judge_all(FIRST, tasks, jobs, size, out / "first.jsonl")
    # Haiku's misses are almost all "covered" verdicts: Opus looks at those, and at flags it was unsure of.
    second_tasks = [t for t in tasks if t["id"] in first and (first[t["id"]]["verdict"] == "covered" or first[t["id"]]["confidence"] == "low")]
    rejudged = {t["id"] for t in second_tasks}
    second = judge_all(SECOND, second_tasks, jobs, size, out / "second.jsonl")
    n = collections.Counter()
    with (out / "verdicts.jsonl").open("w") as f:
        for t in tasks:
            a, b = first.get(t["id"]), second.get(t["id"])
            if not a or (t["id"] in rejudged and not b):
                n["unjudged"] += 1
                continue
            flags = [v for v in (a, b) if v and v["verdict"] == "overreach"]
            verdict = {"id": t["id"], "sha": t.get("sha"), "verdict": combine(a, b),
                       "uncovered": sorted({u for v in flags for u in v["uncovered"]}), "models": [FIRST] + ([SECOND] if b else [])}
            n[verdict["verdict"]] += 1
            f.write(json.dumps(verdict, ensure_ascii=False) + "\n")
    print(f"{dict(n)} -> {out / 'verdicts.jsonl'} (Opus re-judged {len(second_tasks)} of {len(tasks)})")
    return 1 if n["unjudged"] else 0


def grade(out: Path) -> int:
    """Each verdict against the calibration labels, per origin: an overreach verdict on a covered claim is a false
    flag, a covered verdict on an overreach claim is silent, and borderline is counted apart."""
    words = lambda s: set(re.findall(r"[a-z0-9_]+", s.lower()))  # noqa: E731
    pred = {v["id"]: v for v in map(json.loads, (out / "verdicts.jsonl").read_text().splitlines())}
    exp = {e["id"]: e for e in map(json.loads, (BENCH / "calibration-expected.jsonl").read_text().splitlines())}
    by: dict[str, collections.Counter] = collections.defaultdict(collections.Counter)
    for i, e in exp.items():
        c = by[e.get("origin", "?")]
        c["items"] += 1
        p = pred.get(i)
        if not p:
            c["no_prediction"] += 1
        elif p["verdict"] == "borderline":
            c[f"borderline_{e['label']}"] += 1
        elif e["label"] == "overreach":
            if p["verdict"] == "overreach":
                c["caught"] += 1
                want = words(" ".join(e.get("uncovered") or []))
                if want and len(want & words(" ".join(p["uncovered"]))) >= len(want) / 2:
                    c["clause_found"] += 1
            else:
                c["silent"] += 1
        else:
            c["correct_covered" if p["verdict"] == "covered" else "false_flag"] += 1
    total: collections.Counter = collections.Counter()
    for origin, c in sorted(by.items()):
        total.update(c)
        print(origin, dict(c))
    over = sum(1 for e in exp.values() if e["label"] == "overreach")
    print(json.dumps({"silent_rate": round(total["silent"] / over, 3), "false_flag_rate": round(total["false_flag"] / (len(exp) - over), 3),
                      "borderline": total["borderline_overreach"] + total["borderline_covered"], "borderline_real": total["borderline_overreach"]}))
    return 0


def write_record(out: Path) -> int:
    meta = json.loads((out / "meta.json").read_text())
    if meta.get("calibration"):
        raise SystemExit("a calibration run is not about committed claims; nothing to record")
    if meta["rubric_sha"] != rubric_sha():
        raise SystemExit("the rubric changed since this run; run it again")
    rec = record()
    if rec["rubric_sha"] and rec["rubric_sha"] != meta["rubric_sha"]:
        rec["claims"] = {}
    rec["rubric_sha"] = meta["rubric_sha"]
    today = datetime.date.today().isoformat()
    n = 0
    for v in map(json.loads, (out / "verdicts.jsonl").read_text().splitlines()):
        rec["claims"][v["id"]] = {"sha": v["sha"], "verdict": v["verdict"], **({"uncovered": v["uncovered"]} if v["uncovered"] else {}), "models": v["models"], "audited": today}
        n += 1
    rec["claims"] = dict(sorted(rec["claims"].items()))
    RECORD.write_text(json.dumps(rec, indent=1, ensure_ascii=False) + "\n")
    print(f"recorded {n} verdicts in {RECORD.relative_to(ROOT)}")
    return 0


def status() -> int:
    rec = record()
    now = {cid: c for d in subjects() for cid, c in tier_a(d)}
    n = collections.Counter()
    for cid, c in now.items():
        v = rec["claims"].get(cid)
        n["unaudited" if not v else "stale" if v["sha"] != fingerprint(c) else v["verdict"]] += 1
    print(f"{len(now)} Tier A claims: {n['covered']} covered, {n['overreach']} overreach, {n['borderline']} borderline, {n['stale']} changed since audited, {n['unaudited']} never audited")
    return 0


def main(argv: list[str]) -> int:
    def opt(name: str):
        return argv[argv.index(name) + 1] if name in argv else None
    cmd = argv[0] if argv else ""
    out = Path(opt("--out")).resolve() if opt("--out") else None
    if out and (out == ROOT or ROOT in out.parents):
        raise SystemExit(f"--out must be outside the checkout: {out}")
    if cmd == "build" and out:
        return build(out, opt("--base"), Path(opt("--ids")) if opt("--ids") else None, "--unaudited" in argv, "--calibration" in argv,
                     int(opt("--limit")) if opt("--limit") else None)
    if cmd == "run" and out:
        return run(out, int(opt("--jobs") or 4), int(opt("--batch") or 20))
    if cmd == "grade" and out:
        return grade(out)
    if cmd == "record" and out:
        return write_record(out)
    if cmd == "status":
        return status()
    print(__doc__, file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
