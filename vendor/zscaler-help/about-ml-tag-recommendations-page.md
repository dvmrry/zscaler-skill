# About the ML Tag Recommendations Page

**Source:** https://help.zscaler.com/zpa/about-ml-tag-recommendations-page
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This is a scoped summary of the current rendered Help article.

The ML Tag Recommendations page shows which applications from the Application
Catalog were detected on managed resources. Administrators can review the
recommended application tags and decide whether to keep or ignore the tag
information for later configuration.

## Portal surface

The page is under **Policies > Access Control > Segmentation > ML Tag
Recommendations**. It can:

- display a message about the availability of flow data;
- show or hide ignored recommendations;
- refresh the current results;
- show or hide columns and filters;
- filter by Application Name and Application Category;
- show Application Name, Application Category, and Member Count for each
  recommendation;
- open a recommendation for review and allow it to be accepted, edited, or
  ignored;
- delete a recommendation;
- show when the previous recommendation check ran and when the next check is
  scheduled; and
- show instructions for asking Zscaler Support to enable or disable ML tag
  recommendations for the organization.

When an administrator accepts a recommendation, resources that are not
selected are treated as ignored. Previously ignored recommendations can be
revisited from the ignored list.

## Source boundary

This article documents portal behavior. It does not publish the underlying
GraphQL operations, enum values, pagination contract, or an SDK model for the
accept, edit, ignore, delete, or scheduling actions.
