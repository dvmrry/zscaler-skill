# The ThreatLabz data source and the Finding Is Mitigated field: which Zscaler services mitigate which CVEs (unified.secops-platform.data.threatlabz)
Also called: threatlabz data source; finding is mitigated; CVE Mitigated By

The ThreatLabz data source retrieves the data ThreatLabz maintains on how CVEs are mitigated by Zscaler services (including Internet & SaaS and Private Access), and is provisioned in every new account. [unified.secops-platform.data.threatlabz:tl-what] ThreatLabz data is correlated with deduplicated asset records and Zscaler service coverage to calculate contextualized risk scores based on the protection the Zscaler services provide. [unified.secops-platform.data.threatlabz:tl-risk-scores]

**Finding Is Mitigated.** Cross-referencing ThreatLabz data with the Zscaler Client Connector Devices data source, which reports which Zscaler services are installed on which assets, shows which Zscaler services protect against specific CVEs, as a mitigating factor for finding scoring. [unified.secops-platform.data.threatlabz:tl-zcc-crossref] The Finding Is Mitigated field is TRUE when a service that can mitigate the CVE (per ThreatLabz) is installed on the asset where it was detected (per Zscaler Client Connector Devices) and FALSE otherwise, set by a unification rule. [unified.secops-platform.data.threatlabz:tl-is-mitigated] The Finding Is Mitigated field feeds the CVE Mitigated By factor in UVM finding score settings, which can be adjusted. [unified.secops-platform.data.threatlabz:tl-score-factor]

**Labels.** In the platform the Internet & SaaS service is displayed as ZIA, as in the Vulnerability Mitigation Products and Asset Mitigation Products field values. [unified.secops-platform.data.threatlabz:tl-zia-label]

Area: unified.secops-platform, its subjects in references/_meta/spine/unified/unified.secops-platform.json
