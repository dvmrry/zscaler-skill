# How the AD and Entra ID issue, object and change detection safelists work (identity-protection.safelists)
Also called: itdr safelist; issue safelist; object safelist; change detection safelist

Adding an AD issue to the Active Directory Issue Safelist removes it from the Detailed Findings and Recommendations page and vulnerability report for the selected AD domain only, impacts the unified risk score, and is not applied when a different scanned AD domain is selected. [identity-protection.safelists:issue-safelist-ad] Where the Active Directory Issue Safelist page is in the menu differs between pages [divergence:identity-protection.safelists:ad-issue-safelist-menu-path].

Adding an Entra ID issue to the Entra ID Issue Safelist removes it from the Detailed Findings and Recommendations page and vulnerability report for the selected tenant only, impacts the unified risk score, and is not applied when a different scanned tenant is selected. [identity-protection.safelists:issue-safelist-entra] Adding an issue or object to an AD or Entra ID safelist asks for a reason and an expiration date that is set if needed. [identity-protection.safelists:safelist-reason-and-expiry]

## Object safelists

The AD Object Safelist holds AD users and computers; an object added from an issue's Who is affected? section disappears for that particular issue only (not other issues in the same domain), several objects added together share one reason and expiration date, and adding objects impacts the unified risk score. [identity-protection.safelists:object-safelist-ad] The Entra ID Object Safelist holds users and service principals; an object added from an issue's Who is affected? section disappears for that particular issue only (not other issues in the same tenant), several objects added together share one reason and expiration date, and adding objects impacts the unified risk score. [identity-protection.safelists:object-safelist-entra]

**Removing.** Removing an issue or object from the AD or Entra ID issue and object safelists returns it to the Focus Area page and to the new and previous vulnerability reports. [identity-protection.safelists:removal-restores] Which default expiry applies is open [gap:identity-protection.safelists:safelist-expiry-default].

## Change detection safelists

**AD.** Safelisting an AD change detection issue such as Privileged Accounts removes all issues related to it from the Change Detection page for the selected AD domain; removing it from the AD Change Detection Issue Safelist returns it to the Change Detection dashboard for that domain. [identity-protection.safelists:cd-issue-safelist-ad] The AD Change Detection Object Safelist lists each object's Name, Associated Issue, Created On, Created By, Reason and Expiry (the date the object is deleted from the safelist); the Reason or Expiry can be edited, and removing an object returns it to the AD Change Detection dashboard. [identity-protection.safelists:cd-object-safelist-ad] Where the AD change detection page is reached from differs between pages [divergence:identity-protection.safelists:ad-change-detection-dashboard-path].

**Wording on the AD pages.** The AD Change Detection Object Safelist edit steps say "Select a tenant from the Result for drop-down menu.", while the Active Directory Issue Safelist deletion steps say "Select an AD domain from the Result for drop-down menu." [identity-protection.safelists:cd-object-result-for-wording]

**Entra ID.** Safelisting an Entra ID change detection issue such as Privileged Accounts removes all issues related to it from the Entra ID Change Detection page for the selected tenant; removing it from the Entra ID Change Detection Issue Safelist returns it to the Entra ID Change Detection dashboard. [identity-protection.safelists:cd-issue-safelist-entra] The Entra ID Change Detection Issue Safelist lists each issue's Name, Created On, Created By and Reason. [identity-protection.safelists:cd-issue-safelist-entra-fields] An Entra ID change can be moved to the Entra ID Change Detection Object Safelist only if a principal_id is associated with it; the list shows an Expiry (the date the object is deleted from the safelist), Reason or Expiry can be edited, and removing an object returns it to the Entra ID Change Detection dashboard. [identity-protection.safelists:cd-object-safelist-entra]

**Custom change detections.** The AD change detection issue and object safelist pages and the Entra ID change detection issue and object safelist pages each say the safelist option is not supported for custom change detections. [identity-protection.safelists:cd-safelist-custom-unsupported]

## Related subjects

[Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview) [Active Directory posture in Identity Protection: dashboard, issues, roadmap, reports, remediation, privileged account tracking and password analysis](kb:identity-protection.ad-posture) [Entra ID posture in Identity Protection: dashboard, issues, roadmap, reports and remediation](kb:identity-protection.entra-posture) [Endpoint Credential Exposure in Identity Protection: dashboard, scan types, cleanup and reports](kb:identity-protection.credential-exposure) [Active Directory and Entra ID change detection in Identity Protection: monitored issues, cycle, Impact values and remediation](kb:identity-protection.change-detection) [Scan setup and results: the AD posture scan, AD Privileged Account Tracking and the endpoint credential exposure scan](kb:identity-protection.posture-scans) [How an Entra ID tenant is connected to ITDR: deployment script, permissions, certificates and scan setup](kb:identity-protection.entra-connection) [How ITDR threat detection policies, custom change detection policies and email notifications are configured](kb:identity-protection.detection-policies)

What to check:
1. Which menu path the page being read gives for a safelist page, and which dashboard path it gives for reaching the AD change detection data, before stating where to click.
2. Whether the change detection is a custom change detection, which the safelist pages say the safelist option does not support.
3. Whether an Entra ID change has a principal_id associated with it before adding it to the Entra ID Change Detection Object Safelist.

Sources disagree (name both sides):
- Two pages give different menu paths to the Active Directory Issue Safelist page. [divergence:identity-protection.safelists:ad-issue-safelist-menu-path]
  - zscaler-help: The page is at ITDR > Settings > Active Directory Issue Safelist.
  - zscaler-help: The page is at Settings > ITDR Safelist > Active Directory Issue Safelist.
  Impact: An operator following one page's path may not find the page where another page says it is; the pages do not say which is current.
- AD change detection pages give different dashboard paths for the AD change detection data. [divergence:identity-protection.safelists:ad-change-detection-dashboard-path]
  - zscaler-help: The AD change detection data is reached at ITDR > Dashboard > Change Detection > Default.
  - zscaler-help: The AD change detection data is reached at ITDR > Dashboard > Entra ID Change Detection > Default.
  - zscaler-help: The AD change detection data is reached at ITDR > Dashboard > Active Directory Change Detection > Default.
  Impact: The AD object safelist page names the Entra ID Change Detection dashboard in its path while selecting an AD domain; the pages do not say whether it is a copy error or a different dashboard.

Not known (open gaps):
- What expiry applies when none is set on a safelist entry [gap:identity-protection.safelists:safelist-expiry-default]: settled by source-read or lab-test

Area: identity-protection.safelists, its subjects in references/_meta/spine/identity-protection/identity-protection.safelists.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/identity-protection/identity-protection.ad-posture.md (Active Directory posture in Identity Protection: dashboard, issues, roadmap, reports, remediation, privileged account tracking and password analysis)
- links-to references/_meta/text/identity-protection/identity-protection.change-detection.md (Active Directory and Entra ID change detection in Identity Protection: monitored issues, cycle, Impact values and remediation)
- links-to references/_meta/text/identity-protection/identity-protection.credential-exposure.md (Endpoint Credential Exposure in Identity Protection: dashboard, scan types, cleanup and reports)
- links-to references/_meta/text/identity-protection/identity-protection.detection-policies.md (How ITDR threat detection policies, custom change detection policies and email notifications are configured)
- links-to references/_meta/text/identity-protection/identity-protection.entra-connection.md (How an Entra ID tenant is connected to ITDR: deployment script, permissions, certificates and scan setup)
- links-to references/_meta/text/identity-protection/identity-protection.entra-posture.md (Entra ID posture in Identity Protection: dashboard, issues, roadmap, reports and remediation)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.posture-scans.md (Scan setup and results: the AD posture scan, AD Privileged Account Tracking and the endpoint credential exposure scan)
