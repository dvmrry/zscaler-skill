# Understanding Cloud App Categories

**Source:** https://help.zscaler.com/zia/understanding-cloud-app-categories
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Cloud App Control Policies — Understanding Cloud App Categories

Cloud app categories are a key part of Cloud App Control. The service organizes cloud applications into 19 categories. For 11 of the categories, you can create rules to allow or block applications per category. For the other 8 categories, in addition to creating rules to allow or block applications per category, you can also apply granular controls (i.e., the specific actions a user can take within the application) as per your organizational requirements.

## Cloud App Categories with Allow or Block Options

Following are the cloud application categories with the allow or block options. To learn how to view the list of supported cloud applications for each category, see Viewing Supported Cloud Applications.

- Consumer
- Custom Applications
- DNS Over HTTPS Services
- Finance
- Health Care
- Hosting Providers
- Human Resources
- IT Services
- Legal
- Productivity & CRM Tools
- Sales & Marketing

## Cloud App Categories with Granular Controls

Following are the cloud application categories with granular controls. To learn how to view the list of supported cloud applications for each category, see Viewing Supported Cloud Applications.

- **AI & ML Applications**: Granular controls appear when ChatGPT or Microsoft Copilot are chosen with Application Access set to Allow.
- **Collaboration & Online Meetings**: Granular controls appear when Microsoft Teams, SharePoint Online, Slack, or Webex Meetings are chosen with Application Access set to Allow.
- **File Sharing**: Granular controls appear for all the applications and additional granular controls appear when Box, Dropbox, OneDrive, OneDrive for Business, or Google Drive are chosen with Viewing set to Allow.
- **Instant Messaging**: Granular controls appear for all the applications with Chatting set to Allow.
- **Social Networking**: Granular controls appear for all the applications and additional granular controls appear when LinkedIn is chosen with Viewing set to Allow.
- **Streaming Media**: Granular controls appear for all the applications with Viewing/Listening set to Allow.
- **System & Development**: Granular controls appear for all the applications and additional granular controls appear when GitHub is chosen with Viewing set to Allow.
- **Webmail**: Granular controls appear for all the applications with Viewing Mail set to Allow.

If more than one cloud application with granular controls is selected for a category, then only the actions that are common among the selected applications are displayed.

## Viewing Supported Cloud Applications

To view the supported cloud applications for a cloud app category from the Zscaler Admin Console:

1. Go to Policies > Access Control > SaaS Application Control > Policies.
2. In the left-side navigation, select a cloud app category, then click Add Rule.
3. On the Add Rule window, click and open the Cloud Applications drop-down menu.

The drop-down menu lists the supported cloud applications for the selected cloud app category.

You can look up a cloud application for a URL using the URL Lookup tool or the urlLookup API.
