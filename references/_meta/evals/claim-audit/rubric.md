You audit one claim from a knowledge base about Zscaler products. Each claim has a STATEMENT and its EVIDENCE:
exact quotes copied from vendor sources (help pages, SDK or provider code, docs), or JSON pointers into a vendor
API specification showing members the object at that path has ("has") or lacks ("lacks"). A quote marked "after"
was found after that line (for example, inside the named function). "context" lists the page headings, section
opener or enclosing function above a quote, so you know where it sits.

Decide whether the evidence supports EVERY part of the statement.
- "covered": each clause of the statement is stated by the evidence, or follows directly from it (for code: what
  the quoted lines plainly do; for a pointer: the members it has or lacks).
- "overreach": some part of the statement is not supported: an added qualifier, scope, number, version, platform,
  default, cause, consequence or comparison that no evidence item states, or a claim that is broader than the
  evidence ("always", "every", "only" when the evidence shows one case).
What counts. MATERIAL parts must be stated by the evidence (or follow directly from quoted code or a pointer):
values (numbers, sizes, limits, counts), versions and version ranges, defaults, value or enum lists, platform /
OS / product / client scope, quantifiers (only, never, always, every, all), comparisons and contrasts with another
source, product or SDK, absences ("has no", "does not"), causes and consequences, and behavior (what the product
or code does). LOCATORS may come from the evidence's context instead of its quoted words: which page section,
platform tab, window, function or struct a quote sits in (its "context" lines, its "after" line, its file path,
its pointer path), a field or function name that the pointer path, "after" line or file path shows, and framing
words that add no fact ("see", "in the console", "separately", "this setting"). Judge material parts strictly;
do not flag a locator the context supplies. A paraphrase is fine.
Some claims also give CONDITIONS: the author's note of what the claim rests on. An absence in the statement ("has
no", "declares no", "only these") is supported when the conditions record a search that would have found what is
said to be missing: the command, what it searched (the file, package or page) and what it returned. Judge whether
that search covers the absence as the statement words it (the right place, the right term, the stated release).
Conditions support nothing else: every other part still needs the evidence.
Judge only against the evidence given. Do not use outside knowledge to fill a gap; do not reject a clause just
because it is phrased differently from the quote. Ignore Markdown backticks and quoting style.

If "overreach", list in "uncovered" each unsupported part, copied from the statement (a few words to one clause).
If "covered", "uncovered" is empty.

Also give "confidence": "high" when the verdict is clear, "low" when it turns on a judgment call (whether a
part is material or a locator, whether a paraphrase still says the same thing, whether code plainly does what
the statement says).

You get a batch of claims, one JSON object per line ("id", "statement", "evidence", and "conditions" when the claim
has them). Judge each claim on its own,
against its own evidence only. Reply with one line of JSON per claim, in input order, and nothing else:
{"id": "<the claim's id>", "verdict": "covered" | "overreach", "uncovered": ["..."], "confidence": "high" | "low"}
