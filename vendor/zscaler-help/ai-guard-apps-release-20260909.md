URL: https://help.zscaler.com/secure-ai-apps-infra/release-upgrade-summary-2026
**Captured:** 2026-09-09T16:26:54Z
Capture method: Codex CUA browser; Playwright main article innerText from rendered page after the page's release sections had rendered/expanded (browser page title: Release Upgrade Summary (2026) | Zscaler)

--- Rendered main article text ---
Secure AI Apps & Infrastructure Help
Release Notes
Release Upgrade Summary (2026)
Secure AI Apps & Infrastructure
Release Upgrade Summary (2026)

This article provides a summary of all new features and enhancements for Secure AI Apps & Infrastructure.

Select your Zscaler cloud:
Secure AI Apps & Infrastructure
Select a deployment date:
All
September 02, 2026
August 26, 2026
August 07, 2026
July 31, 2026
July 03, 2026
June 08, 2026

The following service updates were deployed to Secure AI Apps & Infrastructure on the following dates.

September 02, 2026
Feature Available
AI Guard for Apps 09/02/2026
Conversation View for Proxy Mode Transactions

Multi-turn conversations can now be viewed directly in the AI Guard dashboard in Proxy mode. Instead of reviewing individual transactions in isolation, admins can now see the full conversation thread, making it easier to follow the context behind a flagged or logged interaction.

See image.

Anthropic Connection Test for Webhook

From the Anthropic console, admins can now test the webhook connection with AI Guard.

See image.

To learn more, see Managing Tenant Settings.

Enhancements & Bug Fixes
Policy Control Name Column for Events: Policy Control Name is a new column added to the dashboard's events view. This gives admins clear visibility into exactly which policy control was matched for a given event, making it faster to trace and investigate policy matches.
Resizable Dashboard Columns: All columns are now resizable on the dashboard.
August 26, 2026
Feature Available
AI Guard for Apps 08/26/2026
Additional CrowdStrike Log Export Option

AI Guard now supports a new log export destination, CrowdStrike SIEM Direct Export, alongside the existing S3-dependent CrowdStrike option. You can now choose between exporting directly to the CrowdStrike HEC endpoint or routing event content through an intermediary AWS S3 bucket, depending on your existing setup.

See image.

To learn more, see Managing AI Guard Log Exports.

New CrowdStrike Parser for AI Guard

CrowdStrike has updated their portal to include a new parser for AI Guard under the Generic bender connection type as zscaler-aiguard. This allows CrowdStrike users to select the AI Guard-specific parser when configuring a new data connector, rather than relying on the generic template parser.

See image.

Enhancements & Bug Fixes
Increased Topic Definition Character Limit: The character limit for Topic definitions in policy configuration has been increased from its previous limit to 1000 characters, giving admins more room to write detailed, precise topic definitions when building Topic policies.
Expanded LLM Provider Match Criteria Limit: The LLM Provider field used for match criteria in Policy control now supports up to 100 entries, up from the previous limit of 10. This allows admins to define broader and more granular policies across a wider range of LLM providers without hitting capacity constraints.
Policy Configuration Version Information: Detectors now include version information in the Policy Configuration UI in AI Guard, giving admins and security teams clearer visibility into which version of a detector is in use.
Base64 Support for Detectors: All detectors now support base64.
August 07, 2026
Feature Available
AI Guard for Apps 08/07/2026
Event Log Export Tools Field Filter

Log exports can now be configured to filter out the Tools fields from exported event logs. This field is enabled by default for new and existing exports.

See image.

To learn more, see Managing AI Guard Log Exports.

Claude Inference Hook Integration

AI Guard can now integrate with Anthropic Claude's inference hooks to inspect and evaluate prompts against a tenant's detection policy in real time. AI Guard responds with an Allow or Deny verdict, which determines whether Claude proceeds to generate a response or the prompt is blocked.

See image.

To learn more, see Managing Tenant Settings.

Enhancements & Bug Fixes
Malicious URL Detection in Prompt Policies: Malicious URLs can now be configured as a detection category within prompt detection policies on the policy configuration page. This expands your ability to identify and control URL-based threats embedded in user prompts.
Pattern Detector Configuration Limit Increased: The Text (Pattern) detector now supports up to 100 regex patterns per policy, increased from the previous limit of 10.
Regex Pattern Length Limit for Text Detector: Individual regex patterns in the Text (Pattern) detector can now be up to 3,000 characters in length, increased from the previous limit.
CSV Export for Dashboard Events: Dashboard event tables now support CSV export in addition to the existing PDF export option. This provides greater flexibility when sharing, analyzing, or archiving flagged interactions.
July 31, 2026
Feature Available
AI Guard for Apps 07/31/2026
Dashboard Transaction Conversation Stitching

In AI Guard's DAS/API mode, you can now view multi-turn conversations as a single, connected thread instead of piecing together individual messages one at a time. This enhancement provides better context and visibility into flagged interactions by presenting the entire conversation flow in one unified view. All underlying data and policies remain unchanged.

See image.

To learn more, see About AI Guard Dashboard.

Secrets Detector Update

In the Secrets detector, the US Government ID category has been updated to support only Detect and Disable options.

Policies currently configured with BLOCK or ALLOW for this category will automatically transition to Disabled mode when any Secrets policy configuration updates are applied. All newly created policies will have the US Government ID category set to Disabled by default.

See image.

To learn more, see Adding and Managing AI Guard Policy Configurations.

July 03, 2026
Feature Available
AI Red Teaming Broker Support for Private Applications in AI Security Admin Portal

Zscaler AI Security introduces AI Red Teaming (AIRT) Broker, a more secure way to connect AIRT to customer applications without requiring firewall changes.

Previously, customers needed to whitelist AIRT source IP addresses on their firewall to allow red teaming access, a process that introduced both operational overhead and security risk. AIRT Broker eliminates this requirement by establishing inside-out connectivity, removing the need to allow any inbound access on the firewall.

Broker configuration is now manageable directly from the AI Security Admin Portal. Security teams can create and manage brokers, then assign them to specific application targets enabling AI Red Teaming to securely reach internally hosted AI applications without firewall modifications.

You can access the Brokers page from Administration > Red Teaming > Brokers.

See image.

To learn more, see Understanding the AI Security Broker, About AI Red Teaming Brokers, Connect an Asset, Registering a Broker, and Configuring a Broker Target,

Feature Available
Detection Level Setting for Probes

AI Red Teaming introduces the Detection Level setting in probe configuration, giving security teams control over how aggressively a probe flags model responses as failures.

Three detection levels are available:

Strict: Flags a wider range of potentially problematic outputs, including borderline cases.
Moderate: Balances sensitivity between strict and permissive thresholds.
Permissive: Flags only high-severity violations.

Feature Available
Import Zscaler Policy

AI Red Teaming now includes an AI Guard Tenant ID field in the Import Policy pop-up, streamlining integration with Zscaler AI Guard. Users can specify their tenant ID directly during the policy import process, eliminating the need for additional configuration steps.

See image.

Feature Available
Rerun Action for Test Runs

AI Red Teaming adds a Rerun action at the test run level, consistent with the existing probe-level rerun behavior.

The Rerun action is available when at least one probe run is incomplete or has ended with errors. When triggered, the current vulnerability assessment resumes by rerunning all incomplete and failed probes without requiring a full test run restart. No additional units are charged for reruns, though results may vary if the test run configuration or probe versions have changed since the original run.


Capture excerpt ends here; later release sections are outside this refresh.
