# Adding and Managing AI Applications for AI Guard

**Source:** https://help.zscaler.com/ai-guard/add-and-manage-ai-applications-ai-guard
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Configuration
Adding and Managing AI Applications for AI Guard
AI Guard
Adding and Managing AI Applications for AI Guard
Ask Zscaler

Adding an AI application (such as a chatbot) needs to be done while configuring AI Guard. Once added, an AI Guard policy can be configured and applied to it.

AI Guard comes in two modes that have different methods for adding an AI Application: Detection as a Service (DaaS) and Proxy. With the Proxy mode, AI Guard is placed between the AI application and the Large Language Model (LLM) provider. With the DaaS mode, AI Guard acts as an API endpoint the enterprise AI application or chatbot can access. In DaaS mode, the AI application must make an API call to AI Guard for every prompt that you make and for every response you receive in the AI application.

Adding an AI Application

To add an AI application and credentials:

Detection as a Service (DaaS)
Proxy
Managing an AI Application

To make changes to an AI application:

In the left-side navigation, under Private AI Apps, click Applications. The AI Applications page appears.

See image.

If you want to edit your AI application, in the Action column, click the Edit button to open the Edit Application window.

Click Update when you finish making changes.

See image.

Adding and Managing Application Groups

To group your AI applications together:

In the left-side navigation, under Private AI Apps, click Application Groups. The Application Groups page appears.

See image.

To add a group, click Add Group. The Add AI Application Group window opens.

See image.

Enter the following information:
Group Name: Enter a name for the group.
Description: (Optional) Enter a description for the group.
Applications: From the drop-down menu, select the applications you want to group together.
Click Submit. You return to the Application Groups page.

To delete a group:

From the Application Groups page, in the Action column, click the Delete icon. The Delete AI Application window opens.
Click OK to delete the group.
Managing AI Application API Keys or Identity Brokers

To add or make changes to a DaaS mode AI application's API key:

If you want to delete an AI application API key, click the Delete button and then click OK on the window that appears.

See image.

If you want to edit your AI application API key, click the Edit button to open Edit App Credentials window.

Click Update when you finish making changes.

See image.

To make changes to a Proxy mode AI application's identity broker:

If you want to delete an AI application, click the Delete button and then click OK on the window that appears.

See image.

If you want to edit your AI application, click the Edit button to open Edit App Credentials window.

See image.

Click Update when you finish making changes.
