Botnet Protection has four toggles that sound alike and work differently.

**Known C2 servers.** {{known-c2-servers}} {{rate-based-profiles}}

**C2 traffic to unknown servers.** {{c2-traffic}} {{c2-traffic-needs-decryption}}

**Alerting on traffic that matches nothing.** {{alert-unknown-c2}}

**DGA domains.** {{dga}} {{dga-has-capture}}

**Counter-based detection** is not self-service. {{counter-based}}

Reclassification by AI/ML can also move a URL into the botnet group: [[zia.atp.ai-ml-recategorization]]. The other groups are in [[zia.atp.categories]].

What to check: whether the destination is a false positive on one of the named profiles, whether the traffic was decrypted, and whether the Alert toggle (off by default) is the source of a new URL category in logs.
