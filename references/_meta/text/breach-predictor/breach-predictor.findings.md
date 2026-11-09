# Breach Predictor Findings: the MITRE ATT&CK Mapping page, the Threat page, severity scores and attack stages (breach-predictor.findings)

The MITRE ATT&CK Mapping page can be filtered by attack stage (for example Discover Attack, Compromise, Lateral Movement and Data Loss), and by search for malware families or users; its table lists each malware family with a Threat column and a Severity Score column. [breach-predictor.findings:mapping-page] In the MITRE ATT&CK Mapping table, the Severity Score is a threat score (0 to 10) assigned to each malware family by Zscaler ThreatLabz; the higher the score, the more damage the family can cause. [breach-predictor.findings:severity-0-10] The Findings triage guidance says the severity score for each malware family ranges from 1 to 10 and is assigned by Zscaler ThreatLabz to indicate how much harm a malware family can do. [breach-predictor.findings:severity-1-10] The two severity ranges differ [divergence:breach-predictor.findings:severity-range]. What particular scores mean is open [gap:breach-predictor.findings:severity-scale-meaning].

## The Threat page

Clicking a malware family on the MITRE ATT&CK Mapping page opens its Threat page, where the Attack path tab includes a generative AI summary of the family and an Update Policy button for creating a Jira ticket. [breach-predictor.findings:threat-page] The Events tab on the Threat page shows nearly the same data as the Events page but focuses on a single threat, while the Events page covers multiple threats; the Events tab also provides more information about why particular policy updates are recommended, and Analyzing Findings describes it as the events for a particular time frame for a single threat as it relates to a single user. [breach-predictor.findings:events-tab-vs-page] On the Threat page's Users tab, the Users view shows the most advanced MITRE ATT&CK technique either predicted or achieved by the malware family for each affected user; actual MITRE ATT&CK data is found in the attack path. [breach-predictor.findings:users-tab]

On the Attack path tab, the Event key shows whether the threat's advancement to a technique is, for example, Observed, Possible or Predicted, and clicking Observed events shows specific information such as which URLs exposed users. [breach-predictor.findings:event-key] Some events are identified as "possible", meaning they might have happened but were not captured as part of Breach Predictor's threat detection. [breach-predictor.findings:possible-events] The meaning of Predicted is open [gap:breach-predictor.findings:predicted-undefined].

On the Attack path tab, for stages the threat family has achieved, the source of the threat data is shown by logo; the page's examples are the CrowdStrike logo for threats identified from CrowdStrike logs and the Zscaler logo for threats identified from Zscaler logs, and its list is open-ended ("e.g.", "etc."). [breach-predictor.findings:source-icons]

## Triage

The Analyzing Findings guidance for triaging malware families is: set a time period (starting small, then expanding), look for families at the far right of the matrix especially in Lateral Movement and Data Loss, start with higher severity scores, then work to reduce the total number of families. [breach-predictor.findings:triage-order] As threats move to the Lateral Movement and Data Loss stages, quick action becomes more essential; an organization identified in the Data Loss stage is in danger of a data breach and must take action immediately. [breach-predictor.findings:stage-urgency]

## What each stage indicates

- **Discover Attack.** Placement in the Discover Attack stage indicates that threat actors are surveilling the system by gathering information, scanning systems and developing resources to infiltrate the network. [breach-predictor.findings:stage-discover]
- **Compromise.** Placement in the Compromise stage indicates that threat actors have gained an initial foothold in the network and can execute code, persist, gain root access and evade detection. [breach-predictor.findings:stage-compromise] The article's worked example places Initial Access in Discover Attack [divergence:breach-predictor.findings:evaluating-example-stage].
- **Lateral Movement.** Placement in the Lateral Movement stage indicates that a threat actor is trying to gain account names and passwords, performing discovery on the network, and has begun to collect data; the organization is described as dangerously close to a full data breach. [breach-predictor.findings:stage-lateral]
- **Data Loss.** In the Data Loss stage, threat actors are trying to communicate with compromised systems, steal data, and control or destroy systems and data. [breach-predictor.findings:stage-data-loss]

The navigation page advises that, when working with Findings data, you should always work from right to left in the MITRE ATT&CK matrix; as a threat moves further to the right in the matrix, the organization is at a higher risk of a data breach. [breach-predictor.findings:right-to-left] The navigation page's Findings and Users entries are crossed [divergence:breach-predictor.findings:accessing-entries-crossed]. See [From the Threat section of Findings, Jira tickets can be created so that Zscaler Support can make policy updates to remediate threats.](kb:breach-predictor.tickets:jira-policy-tickets) and [On the Attack path tab, clicking AI Assist gives generative AI information about the threat; the threat summary has general ThreatLabz information and Breach Predictor's analysis of the threats at each attack stage, including the log source.](kb:breach-predictor.ai-assist:threat-summary).

What to check:
1. When a severity score range or a score of 0 matters to an answer, give both ranges, 0 to 10 and 1 to 10, with the article for each, not one lower bound.

Sources disagree (name both sides):
- The About Findings article (its MITRE ATT&CK Mapping Page section) gives the severity score range as 0 to 10, while the Analyzing Findings article gives it as 1 to 10. [divergence:breach-predictor.findings:severity-range]
  - zscaler-help: The Severity Score is a threat score from 0 to 10.
  - zscaler-help: The severity score ranges from 1 to 10.
  Impact: Whether a score of 0 is possible is unclear; do not state the lower bound of the severity scale as settled.
- On the Accessing and Navigating page, the Findings entry ends with a pointer to About Users and the Users entry ends with a pointer to About Findings; the right-to-left Findings guidance sits under the Users entry. [divergence:breach-predictor.findings:accessing-entries-crossed]
  - zscaler-help: The Findings entry describes the Findings page, then points to About Users.
  - zscaler-help: The Users entry describes the User Threat Profile page and carries the Findings guidance, then points to About Findings.
  Impact: Read the entries' text rather than their pointers or headings to tell which page is described; the right-to-left rule is Findings guidance either way.
- The Evaluating a Security Issue example places the Initial Access technique in the Discover Attack stage, while the same article's stage lists place Initial Access in Compromise. [divergence:breach-predictor.findings:evaluating-example-stage]
  - zscaler-help: In the example, the smashbrowser family shows activity at Initial Access in the Discover Attack stage.
  - zscaler-help: The Compromise stage includes Initial Access.
  Impact: Use the stage lists, not the example's wording, to place a technique in a stage.

Not known (open gaps):
- What the Predicted event status means [gap:breach-predictor.findings:predicted-undefined]: settled by source-read or support-ticket
- What specific severity score values mean [gap:breach-predictor.findings:severity-scale-meaning]: settled by source-read

Area: breach-predictor.findings, its subjects in references/_meta/spine/breach-predictor/breach-predictor.findings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/breach-predictor/breach-predictor.ai-assist.md (Breach Predictor AI Assist dashboard and its AI agents)
- links-to references/_meta/text/breach-predictor/breach-predictor.tickets.md (Breach Predictor Request and Support tickets: how they are created and what the Tickets page lists)
