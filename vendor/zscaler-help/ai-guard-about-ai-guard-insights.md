# About AI Guard Insights

**Source:** https://help.zscaler.com/secure-ai-users/about-ai-guard-insights
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540887, revision 3226313

---

The AI Guard Insights page provides an executive overview of all the users that AI Guard manages. This includes information such as the number of users, number of policy detections, number of AI bot transactions, and category of prompts.
The AI Guard Insights page provides the following benefits and enables you to:
- View general user statistics for AI Guard, such as the number of blocked prompts and responses.
- View data graphs of AI Guard statistics.
- View an infographic of the most common prompt categories.
# About the AI Guard Insights Page
On the AI Guard Insights page (AI Guard > Insights), you can do the following:
- Select the Users tab.
- Select the date range to view the corresponding data. Click Reset to set the date range back to default.
- Refresh your Insights data.
- Export your Insights page to a PDF file.
- View data about AI Guard activities in the following categories:
  - Total Prompts: Total number of prompts users have submitted.
  - Blocked Prompts: Total number of blocked prompts users tried to submit.
  - Prompt Tokens: Approximate number of input tokens consumed by users.
  - Average Prompt Tokens: Average number of tokens per prompt.
  - Average Prompt Detection Latency: Average time for prompt detection in milliseconds.
  - Total Responses: Total number of LLM responses.
  - Blocked Responses: Total number of LLM responses that AI Guard blocked.
  - Response Tokens: Approximate number of output tokens consumed by users.
  - Average Response Token: Average number of tokens per response.
  - Average Response Detection: Average time for response detection in milliseconds.
  - Active Users: Total number of active users.
  - Active LLMs: Total number of LLMs.
- View data presented in the following graphs:
  - Trend Over Time: Daily transaction volume showing Blocked and Total counts. Use this to spot spikes in blocked traffic or unusual activity patterns.
  - Security Posture: Overview of transaction disposition which shows the proportion of Allowed, Blocked, and Passthrough transactions across all AI traffic.
  - Transactions by LLM: Displays the active LLMs and breaks down by color how many of them are Low Risk, High Risk, or Critical Risk.
  - Top Detectors: Displays the detectors that have been triggered the most.
  - Transactions by Users: Displays the total number and percentage of transactions. Hover your mouse over the circle chart to see the number of transactions per user.
  - PII Detections by Users / Groups: Total number of personally identifiable information (PII) detections per user or user group. Clicking on a user bar will open a window with all transactions that contributed to that bar in the chart.
  - PII Categories: Types of PII detected in AI traffic such as credit cards, emails, SSNs, and phone numbers. Clicking on a category bar will open a window with all transactions that contributed to that bar in the chart.
- View the most common prompt categories during the selected date range and the number of transactions for each category.
