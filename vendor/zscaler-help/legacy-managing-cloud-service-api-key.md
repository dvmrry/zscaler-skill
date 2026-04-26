# Managing Cloud Service API Key

**Source:** https://help.zscaler.com/zia/managing-cloud-service-api-key
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

After your API subscription is enabled, your organization's cloud service API key is initially provisioned by Zscaler, enabled, and displayed within the Cloud Service API Key page along with the base URL. An organization can only have one API key for the cloud service API. To learn more, see Getting Started (`/zia/api-getting-started`).

**Note:** If you need to obtain API keys or secrets to access Zscaler OneAPI endpoints, see API Client Authentication in ZIdentity (`/zidentity/integration/oneapi-authentication`).

**Note:** Admins have view access to the Cloud Service API Key page information within the Zscaler Cloud Connector Portal (`/cloud-branch-connector/about-cloud-connector-portal`).

From this page, you can:
- Add a new API key
- Edit the API key
- Regenerate the API key
- Delete the API key

Your cloud service API key can be disabled by Zscaler or your service provider. The key might be disabled if your organization exceeds the threshold number of API calls allowed or the code developed for your organization violates Zscaler's terms and conditions. If this occurs, the ability to add, regenerate, or delete the key is removed and a **Disabled** status appears. You must contact Zscaler Support or your service provider to re-enable the key.

If your API subscription expires, you still have access to the Cloud Service API Key page, but you cannot make any modifications (i.e., you lose access to the POST and PUT actions within the API). Also, your existing API key is still valid but disabled. If this occurs, contact Zscaler Support. The API key is re-enabled after your subscription is renewed.

## Related Articles
- About Cloud Service API Key (`/zia/about-cloud-service-api-key`)
- About Sandbox API Token (`/zia/about-sandbox-api-token`)
- Managing Sandbox API Token (`/zia/managing-sandbox-api-token`)
- Securing Internet & SaaS APIs with OAuth 2.0 (`/zia/securing-internet-saas-apis-oauth-2.0`)
- About OAuth 2.0 Authorization Servers (`/zia/about-oauth-2.0-authorization-servers`)
- Managing OAuth 2.0 Authorization Servers (`/zia/managing-oauth-2.0-authorization-servers`)
- OAuth 2.0 Configuration Guide for Okta (`/zia/oauth-2.0-configuration-guide-okta`)
- OAuth 2.0 Configuration Guide for Microsoft Entra ID (`/zia/oauth-2.0-configuration-guide-microsoft-entra-id`)
- OAuth 2.0 Configuration Guide for PingFederate (`/zia/oauth-2-0-configuration-guide-pingfederate`)
