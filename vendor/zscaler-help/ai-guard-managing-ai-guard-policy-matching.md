# Managing AI Guard Policy Control

**Source:** https://help.zscaler.com/ai-guard/managing-ai-guard-policy-matching
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Configuration
Managing AI Guard Policy Control
AI Guard
Managing AI Guard Policy Control
Ask Zscaler

After you create an AI Guard policy configuration, you can then attach it to an application by adding policy control. To learn more, see Adding and Managing AI Guard Policies.

Adding User Policy Control

To create user policy control:

In the AI Guard left-side navigation under Policies, click Controls. The Policy Control page appears.

See image.

Click the Users tab.

Click Add More to open the Create Policy Control window.

See image.

Enter the following required information:
Rule Name: Enter a name for the policy match.
Policy Configuration: From the drop-down menu, select a policy you previously created.
Rule Order: Enter a number for the order in which you want the policy match applied.
Rule Status: Select whether you want the rule to be enabled or disabled.
Match Criteria: At least one match criteria must be defined:
LLM Provider & Models: Click Add More and click the drop-down menus to select at least one LLM and Model.
Users: Click the drop-down menu and select the users you want to include with the match criteria.
User Groups: Click the drop-down to select the groups you want to include in the match criteria.
Click Submit to return to the Policy Control page. The new policy control appears at the Rule Order number you entered.
Adding AI Application Policy Control

To create an AI application policy control:

In the AI Guard left-side navigation under Policies, click Controls. The Policy Control page appears.

See image.

Click the AI Applications tab.

Click Add More to open the Create Policy Match window.

See image.

Enter the following required information:
Policy: From the drop-down menu, select a policy you previously created.
Rule Name: Enter a name for the policy match.
Rule Order: Enter a number for the order in which you want the policy match applied.
Rule Status: Select whether you want the rule to be enabled or disabled.
Match Criteria: At least one match criteria must be defined. Click Add More under any of the following drop-down menus to add more.
LLM & Models: From the drop-down menus, select the LLM and Models you want to use.
Applications & Credentials: From the drop-down menus, select an Application and Credentials.
Application Groups: From the drop-down menu, select an application group.
Custom Request Headers: From the drop-down menu, select a Header and enter a Value.
Source IPs: In the drop-down menu, enter the desired IP addresses.
Click Submit to return to the Policy Control page. The new policy control appears at the Rule Order number you entered.
Editing a Policy Match

To edit a policy control:

Click the Users or AI Applications tab.

In the Action column, click the Edit icon. The Edit Policy Match window opens.

See image.

In the Edit Policy Match window, edit any policy match fields and click Submit when done.

See image.

Deleting a Policy Match

To delete a policy control:

Click the Users or AI Applications tab.

In the Action column, click the Delete icon. The Delete Policy Match window opens and asks if you would like to delete the policy match.

See image.

In the Delete Policy Match window, click OK.

See image.
