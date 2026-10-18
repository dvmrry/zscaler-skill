Bandwidth Control does not decide whether a transaction is allowed; it decides how much bandwidth the allowed transaction gets, and it does that last. {{last-in-web-order}} {{usage-decides}}

**What it never sees.** {{block-stops-later-policies}} The firewall module judges web traffic before the web module does ([[zia.firewall.traffic-path]]). {{only-surviving-traffic}} A flow that is blocked is therefore never a Bandwidth Control question; look at [[zia.url-filtering]], [[zia.cloud-app-control.precedence]] or the firewall first.

Which protocols are shaped at all: [[zia.bandwidth-control.allocation]].

What to check: whether the transaction was blocked or allowed upstream, and only then the rules that shape it.
