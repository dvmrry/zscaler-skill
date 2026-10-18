Each application has options or traps that the general model hides.

**Google.** {{google-consumer-visitor}} The meaning of a visitor session is not documented (gap `google-visitor-meaning`). {{gcp-cloud-storage}}

**AWS.** {{aws-login-methods}} The Help says tenancy restriction via CLI is not supported for those services; see also the explicit block rule needed for AWS in [[zia.tenant-profiles]].

**Slack.** {{slack-wrong-workspace}}

**Dropbox.** {{dropbox-team-id-source}} Network control must be on in Dropbox; see [[zia.tenant-profiles.wire-mechanic]].

**GitHub and Zoom.** {{github-zoom-singletons}}

**YouTube.** {{youtube-config}} YouTube also needs an explicit block rule for other tenants; see [[zia.tenant-profiles]].

Per-application counts are in [[zia.tenant-profiles.limits]]. The identifiers each profile takes are in [[zia.tenant-profiles.applications]].
