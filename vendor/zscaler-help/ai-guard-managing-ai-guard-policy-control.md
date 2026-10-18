# Managing AI Guard Policy Control

**Source:** https://help.zscaler.com/secure-ai-users/managing-ai-guard-policy-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540883, revision 3242940

---

After you create an AI Guard policy configuration, you can then attach it to an LLM provider, user, or user group by adding policy control. Policies are evaluated from top-to-bottom and the evaluation will stop after matching the first policy. To learn more, see Adding and Managing AI Guard Policies.
# Adding User Policy Control
To create user policy control:
- In the left-side navigation, go to AI Guard > Policy > Controls. The Policy Control page appears.
- See image.
- Click the Users tab.
- Click Add More to open the Create Policy Control window.
- See image.
- Enter the following required information:
  - Rule Name: Enter a name for the policy match.
  - Policy Configuration: From the drop-down menu, select a policy you previously created.
  - Rule Order: Enter a number for the order in which you want the policy match applied.
  - Rule Status: Select whether you want the rule to be enabled or disabled.
  - Match Criteria: At least one match criteria must be defined:
    - LLM Provider & Models: Click Add More.
      - LLM: Select an LLM provider.
      - Models: Select an AI model.
      - Account Type: If Organization Restrictions are enabled, select Enterprise, Personal, or Both. To learn more about Organization Restrictions, see Managing Tenant Settings.
    - Users: Click the drop-down menu and select the users you want to include with the match criteria.
    - User Groups: Click the drop-down to select the groups you want to include in the match criteria.
- Click Submit to return to the Policy Control page. The new policy control appears at the Rule Order number you entered.
# Editing a Policy Control
To edit a policy control:
- Click the Users tab.
- In the Action column, click the Edit icon. The Edit Policy Control window opens.
- See image.
- In the Edit Policy Match window, edit any policy match fields and click Submit when done.
- See image.
# Deleting a Policy Control
To delete a policy control:
- Click the Users tab.
- In the Action column, click the Delete icon. The Delete Policy Control window opens and asks if you would like to delete the policy match.
- See image.
- In the Delete Policy Control window, click OK.
