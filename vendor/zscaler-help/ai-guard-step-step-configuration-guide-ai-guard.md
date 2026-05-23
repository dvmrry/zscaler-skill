# Step-by-Step Configuration Guide for AI Guard | Zscaler

**Source:** https://help.zscaler.com/ai-guard/step-step-configuration-guide-ai-guard
**Captured:** 2026-05-22 via Codex Browser.

---

This guide takes you through the configuration steps you need to complete to begin using AI Guard for your organization.

Before you begin configuring AI Guard, Zscaler recommends reading the following articles:

About the AI Guard Dashboard

About AI Guard Insights

About AI Guard Usage

Configuring AI Guard

To configure AI Guard, complete the following steps:

Step 1: Provision Your End Users

Link your Zscaler Internet Access (ZIA) account with AI Guard to automatically add your users and groups. To learn more, see Managing AI Guard Tenant Settings.

Step 2: Configure LLM Providers

When using Proxy mode, ensure that you add Large Language Model (LLM) providers and their credentials. To learn more, see Managing LLM Providers for AI Guard and Managing LLM Provider Credentials for AI Guard.

Step 3: Configure AI Applications

Add your AI applications to AI Guard. To learn more, see Adding and Managing AI Applications for AI Guard.

Step 4: Configure Policies

AI Guard works by enforcing enterprise policies on prompts and responses between users and public AI apps, such as ChatGPT and Perplexity, and between private AI apps and foundational LLMs, such as OpenAI and Anthropic. You set a policy by enabling one or more included detectors on prompts and responses. To learn more, see Adding and Managing AI Guard Policy Configurations, Managing Policy Control, and Testing a Policy.

Step 5: (Optional) Configure Log Exports

Manage and configure third-party log exports to export incident data. To learn more, see Managing AI Guard Log Exports.

Step 6: (Optional) Configure Tenant Settings

Configure your tenant-wide settings and preferences. To learn more, see Managing AI Guard Tenant Settings.
