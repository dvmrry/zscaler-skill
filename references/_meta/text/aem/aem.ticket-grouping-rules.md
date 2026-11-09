# AEM grouping rule sets: how policy violations are aggregated into violation tickets (aem.ticket-grouping-rules)
Also called: aem grouping rules; grouping rule set; default fallback rule; smart text ticket title

A default grouping rule set based on policy name and policy assignee is created during initial setup; an account can hold several rule sets but only one is active at a time, and activating a new one deactivates the existing one. [aem.ticket-grouping-rules:default-and-active]

**Rules.** Every grouping rule set has a default fallback rule for policy violations that match no condition; it can be edited but not removed or deleted, and every new rule set must include at least one rule besides it. [aem.ticket-grouping-rules:fallback-rule] A rule condition picks a field, an operator (Contains, Is Not Empty, Is Empty or Equals, varying by field type) and a value, and AND/OR can combine conditions: AND aggregates only violations meeting all conditions, OR those meeting any. [aem.ticket-grouping-rules:rule-conditions] A grouping rule needs at least one Group By field, and all policy violations that meet the conditions with the same value in the selected fields are merged into a single violation ticket. [aem.ticket-grouping-rules:group-by] A rule's violation ticket title can be set with Smart Text (free text plus field names as tokens in double curly brackets, with the display name translating to the system name, e.g. Application Name to application.name) or with an Expression applying custom value transformations. [aem.ticket-grouping-rules:title-smart-text] Rules in a grouping rule set run sequentially in order of appearance; a policy violation is aggregated by the first rule that applies, otherwise by the default fallback rule, and order is changed by dragging then clicking Save. [aem.ticket-grouping-rules:rule-order] Rule and rule set limits are open [gap:aem.ticket-grouping-rules:rule-limits].

**Saving and testing.** Clicking Save on a grouping rule set does not reaggregate violation tickets; an active rule set takes effect on Run or at the next data processing in the account, and an inactive one changes nothing until activated and run. [aem.ticket-grouping-rules:save-activate-run] When Save & Activate takes effect is disputed [divergence:aem.ticket-grouping-rules:activate-timing]. The rule Preview lists policy violations that match the rule; if none match, the rule's filters may need adjusting or an earlier rule may already apply, since grouping depends on rule order. [aem.ticket-grouping-rules:preview]

**Managing.** Grouping rule sets can be activated, cloned, edited and deleted, and individual rules can be cloned, edited and deleted; the management page describes the grouped items as findings, with the default fallback rule as the standard grouping method for unmatched findings. [aem.ticket-grouping-rules:managing-actions] The tickets these rules produce are in [AEM violation tickets: the Violation Tickets page, drawer, split and merge, comments and activity log](kb:aem.violation-tickets).

Sources disagree (name both sides):
- The grouping rule configuring page says Save & Activate immediately applies the rules, and also that a rule set that is only activated, not run, runs on the next data ingestion. [divergence:aem.ticket-grouping-rules:activate-timing]
  - zscaler-help: Save & Activate saves the rule set and immediately applies the rules to the account's data.
  - zscaler-help: Activating without running does not apply the rules until the next data ingestion; the page does not say whether Save & Activate counts as running.
  Impact: Whether an account's tickets regroup at once after Save & Activate, or only at the next data ingestion, is not settled by the page; UVM's grouping page carries the same line, so uvm.tickets should be checked.

Not known (open gaps):
- How many rules a grouping rule set can hold, and how many rule sets an account can hold [gap:aem.ticket-grouping-rules:rule-limits]: settled by support-ticket or lab-test

Area: aem.ticket-grouping-rules, its subjects in references/_meta/spine/aem/aem.ticket-grouping-rules.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/aem/aem.violation-tickets.md (AEM violation tickets: the Violation Tickets page, drawer, split and merge, comments and activity log)
