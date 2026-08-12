# Configuring Custom Block Messages

**Source:** https://help.zscaler.com/secure-ai-users/configuring-custom-block-messages
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

AI Guard can replace a blocked prompt or response with an administrator-defined
message. The article says the message can include a link that tells users about
the organization's AI usage policy.

## Configuration

In **AI Guard > Tenant Settings > Security > Custom Block Message**, the
administrator can configure:

- **Custom Prompt Block Message** — shown when the user's prompt is blocked.
- **Custom Response Block Message** — shown when the LLM response is blocked.
- **Delete Conversation on Response Block** — automatically deletes chat
  history for provider response-blocking cases.

The article warns that AI Guard sends the configured block message to the LLM
with an instruction to return it to the user. Some LLMs can interpret that
instruction as malicious, refuse it, or return an unexpected response.
