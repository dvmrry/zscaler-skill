**Who is responsible.** {{customer-access-zscaler-not-required}} {{support-tunnel-options}} So "Zscaler cannot get in" is the default, and it changes if either support-tunnel option is switched on. The hardware form factor is the opposite model: Zscaler runs it ([[zia.private-service-edge.what-it-is]]). Upgrades happen automatically, with timing controls: [[zia.virtual-service-edge.upgrades]].

**What it shares with the cloud.** {{policy-and-logs-in-cloud}} Whether a log entry names the VM or the cluster is not documented ([[zia.virtual-service-edge.operations:log-identifier]]).

**Hardening and local logs.** {{hardened-appliance}} {{auth-log}} {{first-login}} Treat /var/log/auth.log as the place to look for unauthorized access to the appliance; whether any copy leaves the VM is not stated ([[zia.virtual-service-edge.operations:auth-log-transmission]]).

**Monitoring.** {{snmpv3-only}} Beyond SNMP and the Admin Console lists, what health view exists for a Virtual Service Edge is not documented ([[zia.virtual-service-edge.operations:vse-health-visibility]]); the ZIA PSE Health Dashboard needs ZDX and is described for Private Service Edges.
