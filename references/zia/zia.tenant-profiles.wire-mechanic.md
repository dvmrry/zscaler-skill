The documented cases follow. Read together they suggest (inferred, see `header-insertion` below) that ZIA adds the vendor's own tenant-restriction header rather than deciding tenant ownership itself.

**Microsoft.** {{microsoft-headers}}

**Google.** {{google-header}}

**AI and collaboration apps.** {{chatgpt-header}} {{claude-header}} {{docusign-header}} {{slack-headers}} {{webex-header}}

**Hosting and storage apps.** {{dropbox-header}} {{ibm-header}}

**Where the Help text stops.** {{github-zoom-header-names}} How those four applications are enforced is open {{gap:per-app-inspection-detail}}.

**What this means.** {{header-insertion}} {{needs-decrypted-traffic}} The prerequisite rules per application are in [[zia.tenant-profiles.ssl-prerequisite]]. What a bypassed login flow does is open {{gap:bypassed-traffic-behavior}}, and the general effect of bypass is in [[zia.ssl-inspection.bypass-impact]].
