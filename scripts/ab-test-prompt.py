#!/usr/bin/env python3
"""
A/B test scaffold for prompt/context changes using Claude subagents.

Spawns two agents per question — one with the baseline context, one with the
variant — and compares outputs against expected signals. No API key needed;
uses the Claude Code agent infrastructure.

Usage:
  Configure CONDITION_A, CONDITION_B, and TEST_CASES below, then run:
    python3 scripts/ab-test-prompt.py

  The agents read files directly, so conditions point at files on disk.
  To test a variant: write the variant file, point CONDITION_B at it,
  then delete it when done.
"""

import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path


# ---------------------------------------------------------------------------
# Configuration — edit these for each experiment
# ---------------------------------------------------------------------------

CONDITION_A = Path("SKILL.md")          # baseline context file
CONDITION_B = Path("/tmp/SKILL_variant.md")  # variant context file

# Each case has a question, expected signals to find in the response,
# and a note describing what the test is checking.
@dataclass
class Case:
    question: str
    expected: list[str]     # strings that should appear in a passing response
    note: str
    check: str = "any"      # "any" = at least one expected; "all" = all expected


TEST_CASES: list[Case] = [
    Case(
        question="Replace this with your first test question.",
        expected=["signal-a", "signal-b"],
        note="What this case is testing.",
    ),
    Case(
        question="Replace this with a control question.",
        expected=[],
        note="Control — no expected signals, baseline for noise measurement.",
    ),
]

# System prompt given to each agent. {context_file} is substituted at runtime.
AGENT_PROMPT_TMPL = """\
You are answering a question using the following skill definition.
Read it from {context_file} and follow its instructions exactly.
You have no other context.

Question: {question}

After your answer, on a new line write:
SIGNALS_FOUND: comma-separated list of any of these terms you cited: {expected}
Or SIGNALS_FOUND: NONE if you cited none."""


# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------

def run_agent(context_file: Path, question: str, expected: list[str]) -> str:
    """Run a single agent via Claude Code CLI and return its output."""
    prompt = AGENT_PROMPT_TMPL.format(
        context_file=context_file,
        question=question,
        expected=", ".join(expected) if expected else "(none)",
    )
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True, text=True,
    )
    return result.stdout.strip()


def extract_signals(text: str, expected: list[str]) -> list[str]:
    found = []
    for signal in expected:
        if re.search(re.escape(signal), text, re.IGNORECASE):
            found.append(signal)
    return found


def hit(found: list[str], expected: list[str], check: str) -> bool | None:
    if not expected:
        return None
    if check == "all":
        return all(e in found for e in expected)
    return any(e in found for e in expected)


def run_tests() -> list[dict]:
    results = []
    for i, case in enumerate(TEST_CASES, 1):
        print(f"[{i}/{len(TEST_CASES)}] {case.question[:60]}...", flush=True)

        print(f"  A (baseline)...", flush=True)
        ans_a = run_agent(CONDITION_A, case.question, case.expected)
        found_a = extract_signals(ans_a, case.expected)

        print(f"  B (variant) ...", flush=True)
        ans_b = run_agent(CONDITION_B, case.question, case.expected)
        found_b = extract_signals(ans_b, case.expected)

        results.append({
            "question": case.question,
            "note": case.note,
            "expected": case.expected,
            "a": {"answer": ans_a, "found": found_a, "hit": hit(found_a, case.expected, case.check)},
            "b": {"answer": ans_b, "found": found_b, "hit": hit(found_b, case.expected, case.check)},
        })

    return results


def report(results: list[dict]) -> None:
    W = 72
    print("\n" + "=" * W)
    print("A/B RESULTS")
    print("=" * W)

    for r in results:
        ha, hb = r["a"]["hit"], r["b"]["hit"]

        if ha is None:
            delta = "control"
        elif ha == hb:
            delta = "NO DIFFERENCE"
        elif hb and not ha:
            delta = "B BETTER  (+)"
        else:
            delta = "B WORSE   (-)"

        print(f"\nQ   : {r['question']}")
        print(f"note: {r['note']}")
        print(f"A   : found={r['a']['found'] or '(none)'}  hit={ha}")
        print(f"B   : found={r['b']['found'] or '(none)'}  hit={hb}")
        print(f"  → {delta}")

    print("\n" + "=" * W)


if __name__ == "__main__":
    for path, label in [(CONDITION_A, "A"), (CONDITION_B, "B")]:
        if not path.exists():
            print(f"Error: condition {label} file not found: {path}", file=sys.stderr)
            sys.exit(1)

    print(f"Condition A: {CONDITION_A}")
    print(f"Condition B: {CONDITION_B}")
    print(f"Cases: {len(TEST_CASES)}\n")

    results = run_tests()
    report(results)
