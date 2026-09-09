URL: https://help.zscaler.com/secure-ai-apps-infra/about-ai-guard-dashboard
**Captured:** 2026-09-09T16:24:47Z
Capture method: Codex CUA browser; Playwright main article innerText from rendered page (browser page title: About AI Guard Dashboard | Zscaler)

--- Rendered main article text ---
Secure AI Apps & Infrastructure Help
AI Guard for Apps
Monitoring
About AI Guard Dashboard
Secure AI Apps & Infrastructure
About AI Guard Dashboard
Ask Zscaler

The AI Guard dashboard provides a high-level overview of all AI applications AI Guard manages. This includes information such as the number of apps, number of policy detections, and number of AI bot transactions.

The AI Guard Dashboard page provides the following benefits and enables you to:

View general statistics of your apps, LLMs, and policy detections.
View information on individual policy transactions.
Search by specific policy names or filters.
About the AI Guard Dashboard Page

On the AI Guard Dashboard page (AI Guard > Dashboard), you can do the following:

Select the AI Applications tab.
Select the date range (up to 90 days) for your data.
Search by a specific policy name.
Filter your data based on criteria such as Policy Name, Severity, and Prompt Detections.
Refresh will update your dashboard with the most current data.
Export a PDF copy of your dashboard for the selected date range.
View the following information:
Number of Apps: The total number of applications.
Number of LLMs: The total number of LLMs.
Number of Detections: The total number of policy detections.
Number of Transactions: The total number of transactions.

View dashboard entries as individual prompt transactions, or view multi-prompt AI interactions as a single, connected conversation thread.

With Conversations selected, you will see a message icon next to a transaction's date, indicating the number of transactions in that conversation thread. Expand the entry to view details of the individual transactions.

See image.

Clicking a conversation opens the Transaction Details page. View prompt details by clicking Reveal Prompt, which shows a full back-and-forth, chat-style layout.

See image.

Conversation grouping respects existing session boundary logic.

View a list of all transactions. On the Transaction Details page, you can see the following:
Date and Time: The date and time of the transaction.
App: The name of the app.
Policy Name: The name of the policy associated with this transaction.
Severity: The level of severity of the transaction. The severity can be Info, Low, Medium, High, and Critical.
Prompt Detections: The specific prompt detectors that the policy triggered.
Response Detections: The specific response detectors that the policy triggered.
LLM: The LLM used for this transaction.
Prompt Action: Displays whether the AI Guard policy transaction resulted in the prompt being Allowed or Blocked.
Response Action: Displays whether the AI Guard policy transaction resulted in the response being Allowed or Blocked.

Details: Clicking the Details icon opens a window showing detailed information in the following sections: Overview, Detection Summary, Performance & Network Stats, Custom Request Headers, and Prompt Details.

See image.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About AI Guard Dashboard
About AI Guard Detection Summary
About AI Guard Insights
About AI Guard Token Usage
About AI Apps & LLM Provider Topology
AI Guard Audit Log
