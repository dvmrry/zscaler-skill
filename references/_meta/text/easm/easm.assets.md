# EASM asset inventory: types, risk levels, Approved, Candidate and Archived status, detail fields and the Assets page (easm.assets)

Internet-facing assets that asset discovery identifies and inventories include domains, hosts, web pages, certificates, ASNs, IP addresses and IP blocks. [easm.assets:asset-types] Discovered assets are categorized into one or more types, with the details varying across asset types. [easm.assets:asset-types-multi] Assets map to risk findings in a many-to-many relationship. [easm.assets:many-to-many]

## The Assets page

The Assets page lists each asset's Name, Type, Risk Level, Findings Count, Status, First Seen, Last Seen and UUID. [easm.assets:list-columns] An asset's Name might contain a domain name, host name, IP address or IP block, web page URL, ASN or certificate ID, depending on its type. [easm.assets:name-contents] By default the Assets page is filtered to show only approved assets, and the Status filter can include Candidate and Archived assets. [easm.assets:status-default-view] The Assets page filters include Status, Risk Level, Last Seen and Type; Last Seen is single-select with Within 7 Days, Within 30 Days, Within 90 Days and Within 1 Year. [easm.assets:filters] On the Assets page the Name column is always shown and cannot be modified, and only one column should be sorted at a time. [easm.assets:table-customization] The Assets page downloads as a CSV file that replicates the table as displayed, including any sorting, filtering and column selection. [easm.assets:csv-download]

## Risk level

An asset's risk level quantifies the risk posed by the asset and is derived from the risk score calculated for its associated findings. [easm.assets:asset-risk-derivation] Asset risk level maps from the asset risk score as Minimal 0, Low 1–39, Medium 40–69, High 70–89 and Critical 90–100. [easm.assets:risk-level-score] The About Asset Inventory and Understanding Asset Details pages name the lowest asset risk level Minimum, where the asset risk-score table names it Minimal. [easm.assets:risk-level-label-variants]

## Status

Assets have three statuses, and an asset can be moved from any status to any other. [easm.assets:status-values] Approved assets are periodically scanned and their connections are also scanned, and all seed assets are marked approved by default. [easm.assets:approved] Candidate is the default status for attributed assets before they are validated and marked approved; Candidate assets are not included in periodic scans, and their successive connections are not scanned. [easm.assets:candidate] EASM automatically validates attributed assets after discovery, and assets it does not validate need to be manually verified by admins. [easm.assets:candidate-validation] Archived assets, and their successive connections, are removed from the scanning process, and archived assets are not part of the discovery chain established by their original connection to the seed. [easm.assets:archived] Whether Archived is permanent is disputed [divergence:easm.assets:archived-permanence]. Changing an asset's status prompts a Status Update Confirmation window in which a reason is entered, which the page says is useful for auditing trails. [easm.assets:status-reason]

## Asset details

The Available Fields for Each Asset Type table lists No of Subdomains (on the Domain row), Registration Expiration and WHOIS Registrar. [easm.assets:details-domain-fields] For Host and Web Page assets the details include a Revealing Hostname Boolean. [easm.assets:details-host-web-fields] For Certificate assets the details include certificate issued and expiry dates, issuer organization name, signature algorithm, subject common name and subject organization name. [easm.assets:details-certificate-fields] For ASN assets the details include Allocation Date, IPv4 Addresses, IPv6 Prefixes and AS Full Name. [easm.assets:details-asn-fields] Whois data (Registrant Organization, Registrant Email, Registrar) is available for all asset types except certificates. [easm.assets:whois-fields]

The Discovery Chain section presents the full path of asset discovery from the seed asset leading up to the discovery of the current asset, and when an asset is discovered in more than one way the path with the highest confidence is shown. [easm.assets:discovery-chain] The Services section lists the services observed running on the asset, with port number, protocol and the dates the open port was first and last observed. [easm.assets:details-services] The asset's Risk tab shows, per finding, a Category of Exposure, Vulnerability or Misconfiguration and a Scan Type of Web, Network, Certificate or DNS. [easm.assets:details-asset-findings-fields]

The seeds and profiles behind discovery are in [EASM organizations, seeds and discovery profiles: defaults, permissions, disable and delete, and scan cadence](kb:easm.discovery); the findings behind the risk level are in [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings). The risk-score derivation is open [gap:easm.assets:asset-risk-score-formula].

What to check:
1. Which statuses the Assets page filter includes before concluding an asset is missing, since by default it shows only approved assets.
2. Whether the asset is Approved, Candidate or Archived before asking why it is or is not scanned.

Sources disagree (name both sides):
- The asset status page says archived assets and their connections are permanently removed from the scanning process, and also says assets can be moved from any status to any other. [divergence:easm.assets:archived-permanence]
  - zscaler-help: Archived assets and their successive connections are permanently removed from the scanning process.
  - zscaler-help: Assets can be transitioned from one status to any other status.
  Impact: Whether an archived asset can be returned to Approved and scanned again is not settled; check the tenant before telling a user an archive is reversible or final.

Not known (open gaps):
- How an asset's risk score is computed from its findings [gap:easm.assets:asset-risk-score-formula]: settled by source-read or support-ticket

Area: easm.assets, its subjects in references/_meta/spine/easm/easm.assets.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/easm/easm.discovery.md (EASM organizations, seeds and discovery profiles: defaults, permissions, disable and delete, and scan cadence)
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/easm/easm.overview.md (Zscaler EASM: what it is, how it is set up, and where each part is documented)
- see-also references/_meta/text/easm/easm.dashboards.md (EASM Insights Overview and Assets Overview dashboards: widgets, time frames and bucket definitions)
