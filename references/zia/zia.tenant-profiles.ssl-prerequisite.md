A tenant profile on a CAC rule is not enough: the Help article requires an SSL/TLS Inspection rule. {{ssl-rule-required}}

**Login service per application.**

- {{office365-rule}} The Help article requires a higher rule order than the Office 365 One Click Rule; see [[zia.ssl-inspection.rules:predefined-rules]] for the predefined rules.
- {{google-rule}}
- {{webex-rule}}

For Microsoft Version 1 there is a related authentication caveat: {{microsoft-no-auth-exemption}}

The reason for the requirement is covered in [[zia.tenant-profiles.wire-mechanic]]. What happens if the rule is missing or the traffic is bypassed is not documented; see gap `bypassed-traffic-behavior` there and [[zia.ssl-inspection.bypass-impact]]. How the AI & ML rule page treats SSL/TLS inspection for ChatGPT profiles: [[zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]]. Pipeline position of inspection: [[zia.ssl-inspection.pipeline]].
