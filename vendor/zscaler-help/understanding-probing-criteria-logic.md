# Understanding Probing Criteria Logic

**Source:** https://help.zscaler.com/zdx/understanding-probing-criteria-logic
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1486366, revision 3218188

---

When you configure a probe for an application, the inclusion and exclusion configuration fields use different logic based on what you select. You can create a combination of the inclusion and exclusion criteria to be specific towards your probing data needs.
# Simple Probing Criteria
In the following scenarios, we are considering separate Probing and Exclusion Criteria and multiple items selection. These are helpful in analyzing a broader use case for a user, department, or location.
- Probing Criteria
- When you want to include criteria for a probe, the probe uses the AND logic.
- For example, you create a probe to include a user named John Doe in Group B and in the Finance Department.
  - User: John Doe
  - User Group: Group B
  - Department: Finance
- Expression: John Doe AND Group B AND Finance
- Exclusion Criteria
- When you want to exclude criteria for a probe, the probe uses the OR logic. The Exclusion Criteria avoids gathering probing data for the selected criteria. This helps avoid gathering data for non-impacted users.
- For example, you create a probe to exclude multiple users in Group C or in Finance.
- Exclusion Criteria:
  - User Group: Group C
  - Department: Finance
- Expression: NOT (Group C OR Finance)
- Multiple Items Selection
- You can select multiple items within the field criteria that uses the OR Logic. This is applicable to both the Probing and Exclusion Criteria. You can select multiple items to expand your selection criteria (e.g., multiple locations, user groups, departments).
- Probing Criteria
- Scenario: You want a probe for multiple locations and user groups.
  - Location:
    - San Jose
    - Los Angeles
  - User Group:
    - Group B
    - Group C
- Expression: (San Jose OR Los Angeles) AND (Group B OR Group C)
- Exclusion Criteria
- Scenario: You want a probe to exclude selected locations and departments.
  - Location:
    - Sacramento
    - San Francisco
  - Department:
    - Engineering
    - Finance
- Expression: NOT (Sacramento OR San Francisco) AND NOT (Engineering OR Finance)
See image.
The OS selection is supported for end user probe configurations.
# Complex Probing Criteria Logic
You can combine the Probing Criteria and Exclusion Criteria for more specific cases.
The Exclusion Criteria is evaluated first and then the Probing Criteria.
For example, you create a probe to include a specific user groups in a location, but want to exclude specific departments or a location so that you can isolate to only users of interest.
- Probing Criteria:
  - User Group: Group B
  - Location: California
- Exclusion Criteria:
  - Department: Finance
  - Location: San Jose
Expression: NOT (Finance OR San Jose) AND (Group B AND California)
# Using Criteria Effectively
In order to use criteria effectively, consider the following:
- Using OR can expand your results.
- Using AND reduces your results.
- Combining inclusion and exclusion criteria decreases the amount of your probe results.
If you do not find any results, Zscaler recommends reducing the amount of criteria.
