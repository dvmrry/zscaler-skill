# AI Guard Policy Testing

**Source:** https://help.zscaler.com/ai-guard/ai-guard-policy-testing
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Configuration
AI Guard Policy Testing
AI Guard
AI Guard Policy Testing
Ask Zscaler

After adding a large language model (LLM) provider, LLM provider credentials, and a policy to AI Guard, you can test your policy to make sure it is working to your satisfaction. To learn more, see Adding and Managing AI Guard Policies and Managing AI Guard Policy Control.

To test an AI Guard policy:

In the AI Guard left-side navigation, click Policy Testing. The Policy Testing page appears.

See image.

Enter the following information:
Provider Credential: From the drop-down menu, select an LLM credential.
Policy: From the drop-down menu, select a policy you want to test.
LLM Model: From the drop-down menu, select the LLM model you want to use.
Prompt: Enter a prompt that you want to test.

Click Send to test the policy. Results appear below the prompt.

As an example, you could test a policy that blocks Spanish in both the prompts and the responses. If a user enters, How do I say "what is the weather" in Spanish?, the prompt is allowed because the prompt is in English, but the policy blocks the response because the answer is in Spanish. In addition to the policy test showing you what is allowed or blocked, it also shows you the prompt and response without guardrails.

See image.
