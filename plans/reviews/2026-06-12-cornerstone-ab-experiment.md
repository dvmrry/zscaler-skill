# Cornerstone A/B experiment — does tier-matched identity beat generic grounding?

**Date:** 2026-06-12
**Status:** complete
**Method:** 193-agent workflow run (144 task runs + 48 blind judgings + inventory). 3 models (Haiku 4.5, Sonnet 4.6, Opus 4.8) x 4 prompt conditions x 6 tasks x 2 reps. Eval tasks (#2, #19, #4, #18 from `references/_meta/evals/evals.json`) scored mechanically against their assertion substrings and must-cite files; two deliberately under-specified troubleshooting framings scored by a blind Sonnet judge (fabrications, unsupported definitive claims, groundedness 0-5, honesty 0-5). The judge never saw which model or condition produced an answer. Raw rows live in the session workflow output (not committed; ask the maintainer).

**Conditions:**

- **bare** — task only.
- **generic** — one-size grounding paragraph ("read references/ first, cite paths, acknowledge uncertainty"), identical for all tiers.
- **cornerstone** — tier-matched: Haiku got a 4-step procedure with an exact-string fallback ("not found in references"); Sonnet got a purpose line + 5 ranked biases including premise-challenge and disagreement-presentation; Opus got judgment-proxy values + non-goals + license to challenge framing.
- **persona** — a confident "Archivist" identity narrative with no grounding discipline (cosplay control), identical for all tiers.

## Aggregate results

Eval metrics over 8 runs/cell; judged metrics over 4 runs/cell. Directional, not statistically powered.

| Model / condition | assertRate | citeRate | fabrications | unsupported claims | groundedness | honesty |
|---|---|---|---|---|---|---|
| haiku / bare | 0.80 | 0.88 | 1.25 | 1.25 | 3.25 | 2.0 |
| haiku / generic | 0.71 | 0.88 | **0.25** | **0.25** | **4.5** | **4.5** |
| haiku / cornerstone | 0.70 | 0.81 | 0.75 | 0.25 | 4.5 | 4.75 |
| haiku / persona | **0.83** | 0.88 | **2.5** | **2.25** | 3.25 | **1.5** |
| sonnet / bare | 0.78 | 0.88 | 0.5 | 0.25 | 4.25 | 4.5 |
| sonnet / generic | 0.80 | 0.88 | 0 | 0 | 5 | 5 |
| sonnet / cornerstone | 0.75 | 0.81 | 0 | 0 | 2.0* | 5 |
| sonnet / persona | 0.75 | 0.88 | 0 | 0 | 5 | 5 |
| opus / bare | 0.77 | 0.81 | 0 | 0 | 5 | 5 |
| opus / generic | 0.77 | 0.88 | 0 | 0 | 5 | 5 |
| opus / cornerstone | 0.70 | 0.94 | 0 | 0.25 | 5 | 5 |
| opus / persona | 0.73 | 0.94 | 0 | 0 | 5 | 5 |

\* rubric artifact — see finding 3.

## Findings

1. **The cosplay hypothesis is confirmed, and it is tier-dependent.** The confident persona doubled Haiku's fabrication rate vs bare (2.5 vs 1.25) and produced 10x the fabrications of generic grounding, while scoring the *best* eval assertRate of any Haiku cell (0.83). Identity prose makes a weak model confident whether or not the knowledge exists: it performs authority on covered questions and invents tenant state ("has a disrupted M-Tunnel control channel") on uncovered ones. The same persona was completely harmless on Sonnet and Opus (perfect judge scores). Never give a weak model a confident identity.

2. **Any grounding instruction is the big win on Haiku — generic is enough.** Bare-to-generic moved fabrications 1.25 -> 0.25 and honesty 2.0 -> 4.5. The tier-matched procedure added nothing over the boilerplate paragraph on these metrics. Cost: roughly 10 points of eval assertRate (0.80 -> 0.70-0.71) — grounded answers are more conservative and miss assertion keywords. That trade (recall for honesty) is usually correct for dispatch work, but it is a trade.

3. **The Sonnet cornerstone's "groundedness 2.0" is the experiment's best result wearing a bad score.** The raw rows show why: cornerstone-Sonnet *refused the false premise* of the ambiguous tasks ("I cannot write up a root cause for this incident... grounding a root cause in that statement would be fabrication") — exactly the premise-challenge bias firing (adherence marker 1.0), and exactly the behavior the investigator harness institutionalizes ("first response is a plan, not a diagnosis"). The judge's groundedness rubric rewards reference-cited claims, and a correct refusal contains few claims to cite — the metric punishes the right behavior. No other condition produced premise refusals; generic-Sonnet produced clean qualified triage plans instead. **The premise-challenge line is the one demonstrably active ingredient that tier-matching contributed anywhere in this experiment.**

4. **Opus is condition-insensitive on these tasks.** All four arms: zero fabrications, perfect groundedness/honesty. The cornerstone's "do not pad" non-goal measurably tersened output (assertRate 0.77 -> 0.70, citeRate 0.81 -> 0.94) — preambles shape Opus's form, not its honesty. Spend Opus preamble words only when output shape matters.

5. **A grounded answer can still be a wrong answer.** One bare-Haiku run answered "ZPA is broken" by blaming the Go SDK bugs in the just-merged `references/zpa/api-divergences.md` for a user's outage — fully cited, completely irrelevant (judge honesty: 0). Retrieval discipline is not relevance discipline.

## Methodology caveats

- n=2 reps per cell; judged metrics rest on 4 rows/cell. Directional only.
- The adherence marker for Haiku was mis-designed: "not found in references" is conditional on encountering uncovered content, so eval tasks (fully covered) could never trigger it. The 0.0 adherence cell conflates "not needed" with "not followed" — though the ambiguous tasks *should* have triggered it and did not.
- The groundedness rubric needs a refusal branch before this harness is reused (finding 3).
- Assertion scoring is substring matching — conservative phrasing loses points without losing correctness.

## What this does and does not say about the role cornerstones (#91 / #49)

This experiment tested *orchestration subagents* (Claude-family models answering one-shot tasks), not the skill's role workflows on Cascade-class runtimes. It does not validate or invalidate #91's role cornerstones. It does inform them: #91's cornerstones are bias orderings, not personas — the safe pattern; and the premise-challenge bias is the ingredient with demonstrated effect, worth keeping prominent in any role's ordering.

## Resulting dispatch practice (replaces the planned "tier-matched cornerstone convention")

The data does not support a tier-matched cornerstone convention. It supports four cheaper rules:

1. Every dispatch prompt gets a 1-2 sentence grounding line; generic boilerplate is sufficient. Biggest measured effect, lowest cost.
2. Never give Haiku-tier agents a confident identity. Personas are only safe where they are also useless.
3. For Sonnet-tier judgment work (verification, review, RCA) where the task may embed a false premise, add the premise-challenge line explicitly: "if the question presumes a fact you cannot verify, say so plainly instead of building on the presumption."
4. Skip Opus preambles for honesty; use values/non-goals only to shape output form deliberately.
