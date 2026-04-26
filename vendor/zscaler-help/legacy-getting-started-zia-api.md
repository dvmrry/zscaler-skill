# Getting Started (ZIA Legacy API)

**Source:** https://help.zscaler.com/legacy-apis/getting-started-zia-api
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Zscaler provides secured access to cloud service API, Sandbox Submission API, and 3rd-Party App Governance API using different authentication schemes:

If you need to obtain API keys, authenticate into, and make calls using Zscaler OneAPI endpoints, see API Client Authentication in ZIdentity (`/zidentity/integration/oneapi-authentication`) and Getting Started with OneAPI (`/oneapi/getting-started`).

| API | Supported Authentication Methods |
|-----|----------------------------------|
| Cloud Service API | OAuth 2.0 (recommended); Combination of Basic Authentication and API Key |
| Sandbox Submission API | Combination of Basic Authentication and API Token |
| 3rd-Party App Governance API | API Key. Contact Zscaler Support if you do not have a valid API key. |

## OAuth 2.0 Authentication

OAuth 2.0 allows third-party applications to obtain controlled access to protected resources using access tokens. Zscaler uses the Client Credentials grant type, in which the clients exchange their credentials for an access token. For more information, see Securing ZIA APIs with OAuth 2.0 (`/zia/securing-zia-apis-oauth-2.0`).

Zscaler recommends the OAuth 2.0 authentication method for accessing the cloud service API.

Your organization must meet the following prerequisites before you can access the API:
- Prerequisites for OAuth 2.0 Authentication (expandable section)

When the prerequisites are met, you can securely access the API in the following way:
1. Retrieve your base URL.
2. Authenticate the client and retrieve an access token.
3. Make an API call.
4. Activate configuration changes.

To learn more about rate limiting and HTTP status codes, see Understanding Rate Limiting (`/zia/understanding-rate-limiting`) and API Response Codes and Error Messages (`/zia/api-response-codes-and-error-messages`).

## Using ZIA Admin Credentials and API Key/Token

In this method, API authentication is based on a combination of the API key and ZIA admin credentials (i.e., username and password).

Before getting started, make sure that your organization has an API subscription and an API key/token enabled. If you do not have a valid subscription, submit a Zscaler Support ticket. See Managing Cloud Service API Key (`/zia/managing-cloud-service-api-key`) and Managing Sandbox API Token (`/zia/managing-sandbox-api-token`).

In ZIdentity-enabled tenants, administrators accessing the ZIA APIs must be hosted on ZIdentity with appropriate roles assigned from ZIA. Users provisioned via third-party identity providers (IdPs) cannot authenticate to the APIs.

As a security best practice, it is highly recommended that you create a dedicated admin role and user with restricted functional scope access within the ZIA Admin Portal. This helps ensure correct usage, avoids potential conflicts between API and ZIA Admin Portal logins, and prevents misuse.

When these prerequisites are met, you can securely access the API in the following way:
1. Retrieve your base URL and API key/token.
2. Authenticate and create an API session.
3. Make an API call.
4. Activate configuration changes.
5. Log out of the API.

To learn more about rate limiting and HTTP status codes, see Understanding Rate Limiting and API Response Codes and Error Messages. If you encounter any issues with the API, contact Zscaler Support.

## Using 3rd-Party App Governance API Key

3rd-Party App Governance API authentication is based on your API key, which is provided to you if you have a 3rd-Party App Governance trial or license. If you do not have a valid API key, submit a Zscaler Support ticket.

When this prerequisite is met, you can securely access the API in the following way:
1. Use the base URL.
2. Make an API call.

Rate limits throttle the number of API calls you can make. The following rate limits apply to all 3rd-Party App Governance API endpoints:
- Trial: 25 per day
- License: 1,000 per day

To learn more about HTTP status codes, see the API Reference (`/zia/apptotal-api`).

## Navigation (sidebar structure)

The `API Developer & Reference Guide` section under `legacy-apis/zia-api` contains:
- Getting Started (`/legacy-apis/getting-started-zia-api`) ← this page
- Configuring the Postman REST API Client (`/legacy-apis/configuring-postman-rest-api-client`)
- Understanding Rate Limiting (`/legacy-apis/understanding-rate-limiting`)
- API Response Codes and Error Messages (`/legacy-apis/api-response-codes-and-error-messages`)
- Reference Guide (sub-section)
- Working with APIs (sub-section)
