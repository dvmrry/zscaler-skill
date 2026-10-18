# Configuring Custom Block Messages

**Source:** https://help.zscaler.com/secure-ai-users/configuring-custom-block-messages
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1541915, revision 3226257

---

Whenever a prompt or response is blocked by an AI Guard policy, a custom message can be shown in its place. This custom block message can be used to provide a link to the user to notify them about AI usage policy of your organization.
To create a custom block message:
- Go to AI Guard > Tenant Settings.
- Go to the Security tab.
- In the Custom Block Message section you will find the following:
  - Custom Prompt Block Message: Enter a message that users will see when their prompt is blocked.
  - Custom Response Block Message: Enter a message that users will see when their LLM response is blocked.
  - Delete Conversation on Response Block: Select if you want to automatically delete chat history of response blocking cases for providers.
- When configuring a custom block message, the message will be sent to the LLM asking it to return the block message to the user. Certain LLMs may misinterpret the instructions as malicious and either refuse to answer or provide an unexpected response.
- See image.
- Click Save.
