The documented cases follow. Read together they suggest (inferred, see `header-insertion` below) that ZIA adds the vendor's own tenant-restriction header rather than deciding tenant ownership itself.

**Microsoft.** {{microsoft-headers}}

**Google.** {{google-header}}

**AI and collaboration apps.** {{chatgpt-header}} {{claude-header}} {{docusign-header}} {{slack-headers}} {{webex-header}}

**Hosting and storage apps.** {{dropbox-header}} {{ibm-header}}

**Where the Help text stops.** {{github-zoom-header-names}} The captured article has no header or interception sentence at all for AWS, Google Cloud Platform, YouTube or Zoho. See gap `per-app-inspection-detail` for what is not known about how those are enforced.

**What this means.** {{header-insertion}} {{needs-decrypted-traffic}} The prerequisite rules per application are in [[zia.tenant-profiles.ssl-prerequisite]]. What a bypassed login flow does is not documented: gap `bypassed-traffic-behavior`, and the general effect of bypass is in [[zia.ssl-inspection.bypass-impact]].

When a restriction does not work, check in this order: the profile is on the rule, the login service is in an SSL/TLS Inspection rule that matches before any bypass, and, for Microsoft, the version and personal-domain setting in [[zia.tenant-profiles.microsoft]].
