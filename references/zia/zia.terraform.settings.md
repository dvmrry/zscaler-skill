A few global settings resources have rules that the schema does not show: caps on the URL lists, a rejected content type in notifications, and special handling of empty or equivalent values in browser control. Each is a place where a plan can differ from what the API holds.

**URL lists.** {{url-lists-capped}} The two lists are written with two separate calls: [[zia.terraform.multi-step-writes]].

**End user notifications.** {{eun-no-javascript}}

**Browser control.** {{profile-needs-real-value}} {{absent-profile-recorded-as-none}} {{profile-change-skipped-when-empty}} {{any-normalised-by-api}} The data-source side of the empty profile is in [[zia.terraform.data-source-fidelity]].
