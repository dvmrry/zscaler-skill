# About AI Guard Dashboard — Apps & Infrastructure

**Source:** https://help.zscaler.com/secure-ai-apps-infra/about-ai-guard-dashboard
**Captured:** 2026-08-04 via the official Help Center article payload.

---

This is the current Apps & Infrastructure dashboard article. It is distinct
from the AI Guard for Users dashboard article.

## Dashboard scope

- The dashboard gives a high-level view of AI applications managed by AI
  Guard, including application, LLM, policy-detection, and AI bot transaction
  counts.
- The dashboard uses the **AI Applications** tab.
- Administrators can select a date range of up to 90 days, search by policy
  name, filter by Policy Name, Severity, and Prompt Detections, refresh the
  data, and export a PDF for the selected period.
- Summary values include Number of Apps, Number of LLMs, Number of Detections,
  and Number of Transactions.

## Transactions and conversations

- Entries can be viewed as individual prompt transactions or as connected,
  multi-prompt conversation threads.
- Conversation-thread viewing is exclusive to DAS/API mode and does not appear
  in Proxy mode.
- In the Conversations view, a message icon shows the number of transactions
  in a thread, and the entry can be expanded to inspect the individual
  transactions.
- Transaction rows expose date and time, app, policy name, severity, prompt and
  response detections, LLM, and prompt and response actions.
- Transaction details are organized into Overview, Detection Summary,
  Performance & Network Stats, Custom Request Headers, and Prompt Details.

This article describes the Apps & Infrastructure surface. Its separation from
the Users article does not imply that AI Guard no longer manages or reports on
users.
