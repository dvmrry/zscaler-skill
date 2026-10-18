There are three levels of cap: per rule, per profile, and per organization or across profiles.

**Per rule.** {{per-rule-cap}} Do not confuse this with a different row: {{saas-tenants-not-profiles}}

**Per profile and across profiles, by application.**

- {{aws}}
- {{chatgpt}}
- {{claude}}
- {{docusign}}
- {{dropbox}}
- {{github}}
- {{google-domains}}
- {{gcp}}
- {{ibm}}
- {{microsoft}}
- {{slack}}
- {{youtube}}
- {{webex}}
- {{zoho}}
- {{zoom}}

**Two pages disagree.** The Adding Tenant Profiles form states some counts differently from this table {{divergence:adding-vs-limits-page}}. How many identifiers of a type are already in use across profiles is open {{gap:live-count-vs-cap}}; the call that returns it is in [[zia.tenant-profiles.api-surface]].

The rule-level cap applies to the CAC rule, whose own count limits are in [[zia.cloud-app-control.rule-types]]. A Terraform provider older than 4.7.23 stopped lower; see [[zia.tenant-profiles.api-surface]].
