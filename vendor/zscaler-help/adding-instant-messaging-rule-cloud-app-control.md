# Adding an Instant Messaging Rule for Cloud App Control

**Source:** https://help.zscaler.com/zia/adding-instant-messaging-rule-cloud-app-control
**Captured:** 2026-04-23 via Playwright MCP.

**Representative per-category CAC rule-adding article.** The field set and wording (particularly Rule Order, Admin Rank, Rule Status, common criteria) are templated across all 19 per-category CAC rule-adding articles. This capture stands in for the shared template — used to resolve [clarification `zia-06`](../_clarifications.md#zia-06-cac-disabled-rule-semantics) via the **Rule Status** field description, which matches URL Filtering's wording verbatim.

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Cloud App Control Policies — Adding an Instant Messaging Rule for Cloud App Control

You can create rules to control access to specific cloud applications. Cloud apps are organized into categories to facilitate defining rules for similar applications. You can completely block or selectively disable IM applications. Client-based IMs (e.g., Trillian) and web IMs (e.g., Google Chat, Zendesk Chat) are supported. Admins can completely block the IM or just block file transfers. IM file transfers are scanned for viruses and DLP (if policies are set).

## Adding a Rule for Instant Messaging Apps

1. Go to **Policy > URL & Cloud App Control > Cloud App Control Policy**.
2. Click **Add** and select **Instant Messaging**.
3. In the Add Instant Messaging Rule window, enter:

### Cloud App Control Rule Attributes (shared across all per-category CAC rules)

- **Rule Order** — Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2). You can change the value, but if Admin Rank is enabled, your assigned admin rank determines the rule order values you can select.
- **Admin Rank** — 0 to 7 (0 is highest). Your assigned admin rank determines the values you can select. You cannot select a rank higher than your own. **The rule's admin rank determines the value you can select in the rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.**
- **Rule Name** — unique.
- **Rule Status** — *An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.* *(Identical wording to* Configuring the URL Filtering Policy *p.3, confirming CAC Rule Status semantic parity with URL Filtering — resolves* `zia-06`*.)*
- **Rule Label** — see About Rule Labels.

### Criteria (shared across all per-category CAC rules)

- **Cloud Applications** — Any or select up to some limit. By default the field displays the first 100 cloud applications; click "Click to see more" at the bottom to load the next 100.
- **Cloud Application Instances** — up to 8 per rule. Appears only when parent application is selected.
- **Cloud Application Risk Profile** — mutually exclusive with Cloud Applications.
- **Users** (32) / **Groups** (32) / **Departments** (32) / **Locations** (32) / **Location Groups** (32).
- **Adaptive Access Profile** — requires Experience Center subscription.
- **Time** — Always or up to 2 intervals.
- **Devices / Device Groups / Device Trust Level / User Agent / User Risk Profile**.
  - User risk score levels (default ranges): Low 0–29, Medium 30–59, High 60–79, Critical 80–100.
  - Device Groups include the special groups `Cloud Browser Isolation` (requires Zero Trust Browser enabled) and `No Client Connector`.
- **Rule Expiration** — optional; set start, end, and time zone.

### Action (category-specific — here for Instant Messaging)

Choose one of the following for Chatting and File Transfers:
- Allow
- Caution
- Block
- Conditional
- Isolate (only if Zero Trust Browser is enabled)

You can choose either Allow or Block for File Transfers.

### Other Common Fields

- **Cascade to URL Filtering** — per-rule toggle. Appears only when the global *Allow Cascading to URL Filtering* option is **disabled** on Administration > Advanced Settings. When enabled, URL Filtering policy is enforced on a transaction even after it's explicitly allowed by this CAC rule. URL Filtering policy doesn't apply if CAC blocks the transaction.
- **Browser Notification Template** — appears when action is Caution or Block.
- **End User Notification (Show/Hide)** — appears only when a granular action is blocked for the selected application. Show by default.
- **Custom Message** — Zscaler Client Connector-based EUN.
- **Description** — ≤10,240 characters.
