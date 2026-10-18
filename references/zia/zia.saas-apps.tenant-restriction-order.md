When the tenant profile is correct but personal accounts still sign in, check the SSL Inspection order before the profile ([[zia.saas-apps]] lists the other causes). Walk it in this order.

**1. Does the login traffic get decrypted at all?** Tenant restriction works by ZIA adding headers to the login request ([[zia.tenant-profiles.wire-mechanic]]), which needs decryption, and Help requires an SSL Inspection rule that selects Microsoft Login Services and ranks above the Office 365 One Click rule ([[zia.tenant-profiles.ssl-prerequisite]]). {{one-click-rule-exempts-web-policies}} {{one-click-rule-order-editable}}

**2. Which rule matches first?** SSL Inspection rules are first match ([[zia.ssl-inspection.rules]]). So {{bypass-first-disables-restriction}}

**3. Is it the stronger exemption?** {{bypass-other-policies-skips-profile}} The difference between the two predefined exemption styles is in [[zia.ssl-inspection.exemptions]] and [[zia.ssl-inspection.pipeline]].

**4. Fix.** {{order-fix}}

Whether the failure leaves no error and no log is open {{gap:silent-failure}}. Whether Google and Webex tenant restriction fail the same way is open {{gap:same-shape-google-webex}}. Whether the Click-to-Run exemption and the One Click rule are one rule is open {{gap:click-to-run-versus-one-click}}.
