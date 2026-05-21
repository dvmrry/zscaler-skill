# Ollama Qwen/Gemma Review Attempt: Investigator Evidence Batching Plan

## Bottom Line

Qwen and Gemma were both tested as possible additional Ollama Cloud reviewers.
Neither produced a review that should be treated as peer-quality input for this
plan.

Qwen was the better theoretical fit because `qwen3-coder:480b-cloud` is the
larger coding/reasoning model. In practice, through Goose it stalled after
reading context and did not write the requested review file. Through direct
`ollama run`, it drifted into generic enterprise architecture prose that did
not reliably engage the actual plan.

Gemma responded faster, but the output was shallow and contained at least one
material contradiction: it recommended naming the helper `add-evidence`, while
the stronger reviews correctly flagged that as a collision with the existing
ledger `actionType`.

## Useful Signal

- The Ollama Cloud path works mechanically for simple prompts.
- Qwen is not currently reliable enough through this harness for nuanced repo
  review without tighter prompt delivery or a different agent wrapper.
- Gemma is quicker, but the review quality was below the bar for architecture
  decisions in this repo.

## Recommendation

Do not fold either Qwen or Gemma output into the plan as reviewer consensus.
For this plan, the useful review set remains:

- Claude Code Opus
- Devin / DeepSeek
- Goose / Ollama DeepSeek
- Codex synthesis

If Ollama Cloud remains part of the reviewer matrix, test a different model
family and wrapper before relying on it. A successful reviewer must read the
plan as written, preserve local terminology, avoid invented platform concerns,
and write a review file without needing screen scraping.
