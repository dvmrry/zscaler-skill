"Why was this cloud app allowed, blocked, or not caught?" needs the questions below answered in order. Cloud App Control (CAC) is a separate rule set from URL Filtering with its own categories, criteria and actions, so mixing the two up is the usual error.

1. **Does CAC decide, or does URL Filtering?** CAC is evaluated first, and only an explicit CAC allow can skip URL Filtering: [[zia.cloud-app-control.precedence]]. Establish the cascading state first.
2. **Which rule type (cloud app category) holds the rule?** Rules are organised and capped per category, and some categories have granular controls: [[zia.cloud-app-control.rule-types]]. The AI & ML category has its own rule flow: [[zia.cloud-app-control.ai-ml-rules]].
3. **Does the rule's criteria match?** Which fields combine with AND and OR, and how a single rule names an app: [[zia.cloud-app-control.rule-criteria]]. A rule that names a Risk Profile instead of apps matches by attribute: [[zia.cloud-app-control.risk-profiles]].
4. **What does the matching rule do?** Console actions, granular action strings, and how to discover them: [[zia.cloud-app-control.actions]].
5. **Could CAC see the app at all?** Identification depends on what is visible before decryption: [[zia.cloud-app-control.ssl-visibility]].

For "users still reach a blocked app" or "an allowed app is blocked", start with [[zia.cloud-app-control.troubleshooting]]. For field-level questions about tenant snapshots and the SDKs, see [[zia.cloud-app-control.api-surface]]. Tenant restriction (Tenant Profiles) is a related feature documented in [Tenant Profiles](./tenant-profiles.md).
