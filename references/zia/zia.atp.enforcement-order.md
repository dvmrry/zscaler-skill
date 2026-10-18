Where a check falls decides which block the user sees. Three orders apply, depending on what the web module is looking at. {{first-violation-blocks}}

**Request, GET.** {{get-order}}

**Request, POST.** {{post-order}} {{mp-after-atp-checks}}

**Response.** {{response-order}}

What an exception skips is in [[zia.atp.security-exceptions]]; the denylist check is [[zia.atp.blocked-urls]]; country blocking is [[zia.atp.blocked-countries]]; Page Risk is [[zia.atp.page-risk]]. Domain-level checks on encrypted traffic happen before decryption: [[zia.ssl-inspection.pipeline]]. Cloud App Control and URL Filtering ordering is in [[zia.cloud-app-control.precedence]] and [[zia.url-filtering.rule-order]].
