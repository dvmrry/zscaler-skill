# Adding and Managing AI Guard Policy Configurations

**Source:** https://help.zscaler.com/ai-guard/add-and-manage-ai-guard-policies
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Configuration
Adding and Managing AI Guard Policy Configurations
AI Guard
Adding and Managing AI Guard Policy Configurations
Ask Zscaler

AI Guard works by enforcing enterprise policies on prompts and responses between users and public AI apps, such as ChatGPT, Perplexity, Claude, etc., and between private AI apps and foundational Large Language Models (LLMs), such as OpenAI, Anthropic, etc. You set a policy by enabling one or more included detectors on prompts and responses. These detectors are activated on prompts and responses based on the policies you define in the portal. Every policy is a guardrail, and you can set up multiple policies, define and apply a policy per app, apply multiple policies to one app, or apply a policy to multiple apps.

Adding Policy Configurations

To add a new policy to AI Guard:

In the left-side navigation under Policies, click Configurations. The Configurations page opens.

See image.

Click Add More to open the Add New Configuration page.

Under Basic Information, enter:

Policy Name
(Optional) Description

See image.

Click Continue to Detectors. The Prompt Detectors tab opens.
On the Prompt Detectors tab, click on any of the prompt detectors you want to include with your policy. The Configure window appears.

Most prompt detectors share the following configuration options:

Show Details: Gives a description and examples of the detector.
Enabled: Enables the prompt detector and is on by default. Click the checkbox to disable the prompt detector.
Severity: Corresponds to the severity icons in the Prompt Detectors column on the Policies page.
Threshold: The lower the threshold setting, the more strict AI Guard is with activating the policy (i.e., allowing, blocking, or detecting the prompt). Some prompt detectors such as Text and Off Topic don't include this option because those detectors activate with specific keywords, phrases, or topics.

Action: Select what you want the policy to do when activated for specific prompt detectors. Allow allows the prompt to proceed, Block blocks the prompt, and Detect flags the prompt as detected. Some detectors include a Disabled option to ensure what is disabled is not covered under that category's detections.

In the PII detector, the Person's name category is defaulted to Disabled.

See image.

The following prompt detectors include additional configuration options:

Code: Includes a list of Programming Languages where you select for your policy.
Text: Includes a Regex Pattern category where you enter a Name and the regular expression Pattern you want to add.
Competition: Includes a Competitors category where you enter your specific competitor names. Only 10 can be set at a time for a single policy.
Language: Includes a list of Languages where you select for your policy.
Secrets: Includes a list of secret types such as API Keys or Tokens.
Off Topic: Includes a field for adding whatever topic you want to be considered off topic in your policy, such as sports or music.
PII: Includes a list of personally identifiable information types such as Person's name and Location.
Topic: Includes the ability to add multiple custom topics to add to your policy. Enter a Name and Topic Definition for the topic you want to add. Only 10 can be set at a time for a single policy.
Prompt Tags: Includes specific categories to add to your policy, such as News and Media, Shopping and Retail, and Technology.
Intellectual Property: Includes a Sensitive Context field to enter what you want to avoid leaking, such as a project launch date.

See image.

After configuring the prompt detectors, click Save Changes to close the window and click Next on the Prompt Detectors tab. The Response Detectors tab opens.
Configuring response detectors follows similar steps as configuring prompt detectors, so refer back to the earlier steps for more information.

After configuring your response detectors, click Next. The Review tab opens.

See image.

The Review tab shows you a summary of the policy configuration you created. Click Submit Policy if everything looks correct.

After creating a policy, the next step is to create a policy match. For more information on policy matching, see Managing AI Guard Policy Control.

Configuration Actions

To view details of a policy configuration, under Action, click the View Details button. The View Configuration Details window appears and shows you the following information:

ID
Name
Description
Controls
Prompt Detectors
Response Detectors

To edit an AI Guard policy configuration:

Under the Action column, click the Edit Configuration icon. The Edit Policy page opens.

Make any desired changes to the policy. On the Review tab, click Submit Policy when finished.

See image.

To copy a policy configuration:

Under the Action column, click the Copy Configuration icon. The Copy Configuration page opens.
Make any desired changes to the policy. On the Review tab, click Submit Policy when finished.

To delete a policy configuration:

Under the Action column, click the Delete Configuration icon. The Delete Configuration window appears.

See image.

Type Delete into the text field to confirm the deletion of the policy, and then click the Delete button.
