# Red Teaming test runs: units, new runs, scheduling and history (ai-security.ai-red-teaming.test-runs)
Also called: test run; red teaming test run; new test run; schedule test run; scheduled test runs; test run history; test run units; consumption units

A Test Run is a group of executed probes performed at a specific point in time against an AI app in Zscaler AI Security; in each test run the user chooses which vulnerabilities to test by selecting one or more pre-configured probes. [ai-security.ai-red-teaming.test-runs:definition] The prerequisites are in [AI Red Teaming: adversarial testing of AI apps, the Overview page, and where each part is documented](kb:ai-security.ai-red-teaming) and the probes in [Red Teaming probes: categories, custom probes and datasets, risk priority, coverage and attack strategies](kb:ai-security.ai-red-teaming.probes).

**Starting a run.** A new test run takes a Business Unit, an AI app, a Test Run Name and a Probe Selection; with the Receive email notification option enabled, the user who initiated the run receives an email with the test run details and the generated PDF report attached after it completes, and Schedule for Later schedules it for later. [ai-security.ai-red-teaming.test-runs:new-run-fields] The New Test Run window header shows the Current Units, the Test Run Cost and the Remaining Units; units are the organization's consumption credits for running AI Security evaluations (eg, red teaming, test runs), starting a test run deducts the required units from the available balance, and if not enough units remain the Zscaler Account team is to be contacted. [ai-security.ai-red-teaming.test-runs:units] Run cost and how units are obtained are open [gap:ai-security.ai-red-teaming.test-runs:units-cost].

**Scheduling.** The scheduler sets up recurring or single-run executions that run in the background, with a Schedule Date, Schedule Time and Frequency (Single Run, Daily, Weekly, or Monthly); a scheduled test run is listed in the AI Infrastructure > AI Red Teaming - Test Runs > Scheduled tab, where Edit edits a test run and Delete deletes it entirely, and deleting requires typing CONFIRM. [ai-security.ai-red-teaming.test-runs:scheduler] What the Scheduled tab's Last Run and Next Run columns hold is not established [divergence:ai-security.ai-red-teaming.test-runs:scheduled-columns]. The schedule's time zone and result retention are open [gap:ai-security.ai-red-teaming.test-runs:schedule-details].

**History.** The Test Run History tab lists all test runs associated with a single AI app, including those in progress, sorted chronologically with the most recent at the top by default; Status filters by Running, Error, Finished, or Canceled, and each run shows who launched it, its timestamp, status, probes, and the total number of passed, failed and error test cases across all probes. [ai-security.ai-red-teaming.test-runs:history] The family's packaging gap is in [The AI Security family: AI Access Security, AI Guard (AI Guardrails), AI Red Teaming and the AI asset inventory](kb:ai-security.family).

What to check:
1. Before reading a Scheduled tab column as the last or next execution, that the page's column text is a copy of the History tab's, so what Last Run and Next Run show is not established.
2. That the account has units remaining before expecting a run to start.

Sources disagree (name both sides):
- On the About Test Runs page the Scheduled tab's Last Run and Next Run columns carry the History tab's Launched By and Timestamp text word for word. [divergence:ai-security.ai-red-teaming.test-runs:scheduled-columns]
  - zscaler-help: The Scheduled tab's Last Run column is described as a user name and its Next Run column as an execution date and time.
  - zscaler-help: The History tab's Launched By column carries the same user-name text and its Timestamp column the same date-and-time text.
  Impact: A column named Last Run described as a user name, and Next Run as an execution time, reads as text copied from the History tab; what the two columns hold is not established, so neither is claimed.

Not known (open gaps):
- A run's unit cost, how units are bought, and AI Guard's accounting [gap:ai-security.ai-red-teaming.test-runs:units-cost] (data gap): filled by operator; settled by tenant-data or support-ticket
- The schedule's time zone, result retention and PDF report contents [gap:ai-security.ai-red-teaming.test-runs:schedule-details]: settled by source-read or lab-test

Area: ai-security.ai-red-teaming, its subjects in references/_meta/spine/ai-security/ai-security.ai-red-teaming.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/ai-security/ai-security.ai-red-teaming.md (AI Red Teaming: adversarial testing of AI apps, the Overview page, and where each part is documented)
- links-to references/_meta/text/ai-security/ai-security.ai-red-teaming.probes.md (Red Teaming probes: categories, custom probes and datasets, risk priority, coverage and attack strategies)
- links-to references/_meta/text/ai-security/ai-security.family.md (The AI Security family: AI Access Security, AI Guard (AI Guardrails), AI Red Teaming and the AI asset inventory)
