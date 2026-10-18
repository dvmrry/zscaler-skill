{{firewall-first}} {{nonweb-firewall-only}} {{firewall-beats-web-allow}}

{{enforcement-conditions}} {{explicit-forwarding-tuples}} {{ztunnel-pac-opt-in}} Whether Z-Tunnel 2.0 engages the firewall without an option is open {{gap:ztunnel-2-firewall}}.

**Telling the two modules apart in the logs.** {{firewall-block-both-logs}} {{web-block-firewall-allowed}} Whether a web-module block also shows as blocked in the firewall log is open {{gap:web-block-firewall-log-conflict}}. {{firewall-log-action}}

**Order inside the firewall module.** Evaluation order among the firewall policies is open {{gap:module-internal-order}}. The web side is covered in [[zia.url-filtering]] and [[zia.ssl-inspection.pipeline]], and Cloud App Control in [[zia.cloud-app-control.precedence]].
