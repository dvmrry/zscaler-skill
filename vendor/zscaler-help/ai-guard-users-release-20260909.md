URL: https://help.zscaler.com/secure-ai-users/release-upgrade-summary-2026
**Captured:** 2026-09-09T16:28:54Z
Capture method: Codex CUA browser; Playwright main article innerText from rendered page after the page's release sections had rendered/expanded (browser page title: Release Upgrade Summary (2026) | Zscaler)

--- Rendered main article text ---
Secure Access to AI Apps Help
Release Notes
Release Upgrade Summary (2026)
Secure Access to AI Apps
Release Upgrade Summary (2026)

This article provides a summary of all new features and enhancements for Secure Access to AI Apps.

Select your Zscaler cloud:
Secure Access to AI Apps
Select a deployment date:
All
September 02, 2026
August 26, 2026
August 12, 2026
August 10, 2026
August 07, 2026
July 31, 2026
July 10, 2026
June 29, 2026
June 15, 2026
May 30, 2026
May 15, 2026
May 01, 2026
April 24, 2026
April 10, 2026
March 27, 2026
March 18, 2026
February 27, 2026

The following service updates were deployed to Secure Access to AI Apps on the following dates.

September 02, 2026
Feature Available
AI Guard for Users 09/02/2026
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
AI Guard for Users 08/26/2026
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
August 12, 2026
Feature Available
AI Guard for Users 08/12/2026
Expanded Microsoft 365 Copilot Support

AI Guard now supports Copilot.com, offering data protection for direct web browser interactions with Copilot. Request and response blocking are both supported, along with custom messages, providing granular control and clear user communication.

To ensure proper connectivity and policy enforcement, the following ZIA configuration URL is required:

www.copilot.com

To learn more, see Integrating ZIA with AI Guard.

August 10, 2026
Feature Available
AI Guard for Users 08/10/2026
Expanded Microsoft 365 Copilot Support

AI Guard now supports Copilot in Excel, offering robust data protection for spreadsheet interactions. Request and response blocking are both supported, along with custom messages, providing granular control and clear user communication.

To ensure proper connectivity and policy enforcement, the following ZIA configuration URL is required:

augloop.office.com

To learn more, see Integrating ZIA with AI Guard.

August 07, 2026
Feature Available
AI Guard for Users 08/07/2026
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
AI Guard for Users 07/31/2026
Secrets Detector Update

In the Secrets detector, the US Government ID category has been updated to support only Detect and Disable options.

Policies currently configured with BLOCK or ALLOW for this category will automatically transition to Disabled mode when any Secrets policy configuration updates are applied. All newly created policies will have the US Government ID category set to Disabled by default.

See image.

To learn more, see Adding and Managing AI Guard Policy Configurations.

July 10, 2026
Feature Available
AI Guard 07/10/2026
Tenant Restriction

AI Guard for User's tenancy restriction feature allows you to restrict user traffic access either to personal accounts, enterprise accounts, or both, and apply different access-control rules to each. This feature is currently available for Anthropic and OpenAI.

See image.

To learn more about account-type policy control, see Managing Tenant Settings.

Expanded Microsoft 365 Copilot Support

AI Guard now supports streaming responses for Microsoft 365 Copilot, ensuring that real-time AI interactions are inspected and protected as they are generated.

The following Microsoft 365 apps are currently supported by AI Guard:

M365 Web Experience (Web Browser)
M365 Desktop App (Windows and Mac)
Copilot in Word (Desktop App and Web Browser)
Copilot in Outlook (Web Browser)

To learn more, see Integrating ZIA with AI Guard.


Capture excerpt ends here; later release sections are outside this refresh.
