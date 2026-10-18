# About Asset-Level Risk

**Source:** https://help.zscaler.com/risk360/about-asset-level-risk
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1486691, revision 2795206

---

Asset-level risk aggregates and visualizes the total number of assets in your organization, highlights risky assets, and further provides drill-downs on these risky assets to understand what's driving the risk. In progression to the Risk360's organizational-level risk score representation, and over 100 factors that can drill down to show specific users and locations at risk, asset-level risk helps view the risk score assigned at the asset level. It facilitates the monitoring and remediation of risky assets.
Zscaler’s asset-level risk scoring model considers more than 65 indicators that influence the risk score. The model accounts for the fact that not all indicators are equal; each indicator variably contributes to the risk score based on the severity and frequency of the associated threat. Hence, these indicators are separated into three major categories:
- Pre-infection Behavior
- Pre-infection behavior indicators encompass a range of blocked actions that could lead to an asset infection, such as blocked malware, known and suspected malicious URLs, phishing sites, pages with browser exploits, and more. Some sample indicators for asset risk scoring include:
  - Malware blocked by Zscaler’s Advanced Threat Protection or inline Sandbox
  - Blocked known and suspected malicious URLs
  - Blocked websites with known and suspected phishing content
  - Blocked pages with known browser exploits
  - Blocked known and suspected adware and spyware
  - Blocked pages with a high PageRisk score
  - Quarantined pages
  - Blocked files with known vulnerabilities
  - Blocked emails containing viruses
  - Detected mobile app vulnerabilities
- Post-infection Behavior
- Post-infection behavior indicators include a range of blocked actions that are attempted after an asset is infected. Some sample indicators for asset risk scoring include:
  - Botnet traffic
  - Command-and-control traffic
- Suspicious Behavior
- Suspicious behavior indicators are similar to pre-infection indicators, with less severity and less guarantee of leading to infection. This includes policy violations, risky activities like browsing deny-listed URLs, DLP compliance violations, and anonymizing sites that could lead to an infected asset. Some sample indicators for asset risk scoring include:
  - URLs that are denylisted
  - DLP compliance violations
  - Pages with known dangerous ActiveX controls
  - Pages vulnerable to cross-site scripting attacks
  - Possible browser cookie theft
  - Internet Relay Chat (IRC) tunneling use
  - Anonymizing sites
  - Blocks or warnings from secure browsing about an outdated/disallowed component
  - Peer-to-peer (P2P) site denials
  - Webspam sites
  - Attempts to browse blocked URL categories
  - Mobile app issues that include denial of the mobile app, insecure user credentials, location information leaks, personally identifiable information (PII), information identifying the asset, or communication with unknown servers.
  - Tunnel blocks
  - Fake proxy authentication
  - SMTP (email) issues including rejected password-encrypted attachments, unscannable attachments, detected or suspected spam, rejected recipients, DLP blocks or quarantines, and blocked attachments.
  - IPS blocks of cryptomining & blockchain traffic
  - Reputation-based blocks of suspected adware/spyware sites
  - Disallowed use of a DNS-over-HTTPS site
Asset-level risk provides the following benefits and enables you to:
- View risk at the asset-level and perform necessary remediation to lower the risk.
- Analyze asset metadata, graphical analysis, risk score, risk trends, and a list of events impacting risk score, among many other insights of significance.
- Identify users, locations, etc. with risky assets to isolate security exposure.
# About the Assets Page
On the Assets page, you can view the following information:
- **Overview**: View your assets in the following views:
  - Risk Score
  - The Risk Score view displays a three-dimensional graph with the Risk Score, Asset Count, and Days. This helps you analyze the number of assets under each severity for a select date:
    - Each risk severity is highlighted with a unique color code:
      - No Risk (0–1)
      - Low (>1–25)
      - Medium (>25–50)
      - High (>50–75)
      - Critical (>75–100)
    - Your organization's total number of assets is displayed at the top of the section.
    - You can view the data for specific severities using the severity checkboxes.
    - Hover over the severity dots in the graph to view the number of assets under specific severity for that day. This helps you view the number of assets under each severity for a particular date.
    - You can left-click, hold the mouse, and then move the graph to the position in which you want to view the data. Click **Reset Chart Position** to set the graph to its original position.
    - You can use your mouse scroll to increase or decrease the size of the graph.
  - See image.
  - Location
  - The Location view shows all the assets in your organization spread across the globe. The map shows the country where the assets are located. Hover over the country to view the number of assets in them. The size of the bubble signifies the number of assets present, relative to other locations. The top-left of the section displays the number of assets with unknown locations.
  - The **Top Risky Locations** section at the bottom-left displays the locations with the highest percentage of risky assets in descending order.
  - See image.
- **Distribution of Assets by Authentication Status**: The pie chart shows the percentage split between the number of authenticated and unauthenticated assets. The total number of assets is displayed at the center of the pie chart.
- **Authenticated Assets**: The chart shows the types of assets available in your organization's traffic with their count. This data is for authenticated assets only.
- **Risky Asset Inventory**: The table shows the top 1,000 risky asset details. For each asset, you can view the following information:
  - **Asset ID**: The unique ID assigned to the asset by the Zscaler service.
  - **Private IP Address**: The IP address of the asset.
  - **Egress IP Address**: The client's gateway IP address that sends the local network traffic to other networks on the internet.
  - **Username**: The user responsible or owns the asset.
  - **Asset Type**: The type of asset (iOS, Android OS, etc.).
  - **Authentication Status**: Indicates whether the asset is authenticated or not.
  - **Risk Score**: The risk score computed for the asset.
  - **Last Seen**: The time and date when the last activity was observed on the asset.
  - **Location**: The city where the asset is located. Displays Road Warrior if the asset isn't tied to a location.
  - Click an asset row to view additional details about the risky assets on the Asset Details page.
  - You can use the following operators for the table:
    - Filter the data for specific Asset ID, Asset Type, or Location.
    - Download the table data into a CSV file.
    - Search for a specific asset using the asset ID.
    - Modify the table columns.
    - Use the arrows at the bottom of the table to go to the next page. You can also select the number of entries you want to view on a page.
