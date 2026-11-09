# Zscaler Resilience: four failure tiers from minor failures to catastrophic events (portfolio.resilience)
Also called: zscaler resilience; resilience; cloud resilience; failure tiers; blackout; brownout; catastrophic failure; business continuity; bc

The Zscaler Resilience page says Zscaler Resilience is a complete set of capabilities that ensures uninterrupted business continuity during blackouts, brownouts, or even catastrophic black swan events. [portfolio.resilience:resilience-umbrella]

**The four tiers.**
- The page says the Zscaler platform routinely handles common minor failures, such as those caused by node failure or software bugs, with little or no end user interaction required. [portfolio.resilience:tier-minor]
- The page says failover mechanisms, autonomous or manual, can remediate blackouts: local outages such as those in the data center, or unexpected connectivity issues. [portfolio.resilience:tier-blackout]
- The page says several autonomous failover mechanisms, such as latency-based dynamic service edge selection and customer-controlled data center exclusion, can handle brownouts (service degradation issues). [portfolio.resilience:tier-brownout]
- The page says that during full cloud outages caused by black swan events, or cloud reachability issues, Zscaler business continuity solutions handle traffic to the internet, SaaS and private apps, routing to private service edges for uninterrupted access and restricting access only to critical apps. [portfolio.resilience:tier-catastrophic]

The Resilience page says Zscaler business continuity solutions handle traffic during full cloud outages; the Business Continuity Cloud help page says that service mainly helps organizations stay connected and protected during critical failure scenarios, which it says include global Zscaler cloud outages. [portfolio.resilience:bcc-relation] Components and constraints of that deployment are in [Business Continuity Cloud: components, constraints and what is open](kb:portfolio.business-continuity-cloud).

Whether this resilience set has a programmatic surface is open [gap:portfolio.resilience:resilience-no-sdk].

What to check:
1. For a question about which failure tier applies, match the symptom to a tier first (node or software failure, localized outage, degradation, or full cloud outage) and answer from that tier's claim.

Not known (open gaps):
- Whether Zscaler Resilience has a programmatic surface [gap:portfolio.resilience:resilience-no-sdk]: settled by source-read

Area: portfolio.resilience, its subjects in references/_meta/spine/portfolio/portfolio.resilience.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/portfolio/portfolio.business-continuity-cloud.md (Business Continuity Cloud: components, constraints and what is open)
