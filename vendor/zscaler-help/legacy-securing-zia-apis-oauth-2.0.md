# Securing Internet & SaaS APIs with OAuth 2.0

**Source:** https://help.zscaler.com/zia/securing-internet-saas-apis-oauth-2.0
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

The Zscaler service supports OAuth 2.0 authentication to securely access the cloud service API. OAuth 2.0 authentication allows third-party applications to obtain controlled access to protected resources using access tokens. The Zscaler service uses the Client Credentials OAuth flow, in which the clients exchange their credentials for an access token and gain access to the cloud service API, outside the context of users. The Zscaler service supports OAuth 2.0 implementations with PingFederate, Okta, and Microsoft Entra ID (formerly Azure Active Directory).

OAuth 2.0 authentication offers the following advantages over other authentication methods:

- **Better Security:** OAuth 2.0 secures your APIs with dynamic credentials, which are time-bound and generated on demand for a client.
- **Limits Exposure of Credentials:** Unlike the authentication model that uses API keys and Internet & SaaS (ZIA) admin credentials and may involve user management outside the organization's identity provider, OAuth 2.0 does not require Internet & SaaS admin credentials for authentication.
- **Granular Access Control:** The Client Credentials OAuth flow employs API Roles (`/zia/adding-api-roles`) to define permissions required to access specific categories of cloud service API. Unlike admin roles, API roles are not assigned to Internet & SaaS admin users. Instead, API roles are associated with the client applications that are accessing the API. OAuth 2.0 provides added security to API access by isolating API permissions from admin users with access to the Zscaler Admin Console.
- **Reduced Maintenance:** OAuth 2.0 does not require obfuscation of credentials, unlike API keys which need to be obfuscated on the client with additional programming for enhanced security.

OAuth 2.0 authentication is supported only for cloud service API.

## Terminologies and Concepts

OAuth 2.0 authentication includes the following components:

- **Resource Server:** The host on which the protected resources reside. After successful authorization of client applications, the resource server grants clients access to protected resources. In Zscaler's OAuth 2.0 authentication model, the cloud service API acts as the resource server and authorizes client applications to make API calls.
- **Authorization Server:** The identity provider that accepts authorization requests from clients and issues signed access tokens upon successful authorization.
- **Client:** The client application that requests access to protected resources residing in the resource server (i.e., cloud service API). The client authenticates with the authorization server to obtain an access token and then uses the access token to access the cloud service API.
- **Access Tokens:** An access token is a string issued to a client application by the authorization server. The client application uses the access token to identify itself and gain authorized access to protected resources residing in the resource server.
- **Grant Type:** Also referred to as OAuth flows, grant types define the various methods in which a client application can obtain an authorization grant from the authorization server and also the sequence in which the OAuth 2.0 authorization process takes place. The Zscaler service uses the Client Credentials grant type, which allows clients to access protected resources outside the context of users.
- **Scope:** Scope defines the specific permissions required by a client application to access the data in the resource server. In Zscaler's OAuth 2.0 authentication model, scope is defined using API Roles (`/zia/adding-api-roles`) and must be associated with the client application in the OAuth 2.0 service console.

## OAuth 2.0 Flow

The Zscaler service uses the Client Credentials OAuth flow. In this model, client applications make API calls to the cloud service API using an access token obtained from the authorization server in exchange for their credentials. Therefore, the clients access the cloud service API resources on their behalf without requiring any user interaction.

1. **A client requests an access token from the authorization server.** A client application registered with the authorization server sends an authorization request with its credentials (i.e., client ID and client secret) to the authorization server. In addition to the client credentials, the authorization request must specify the required scope and the grant type.

2. **The authorization server authenticates the client and provides an access token.** The authorization server validates the client's credentials and provides the client with a signed JWT access token upon successful authorization. The response from the authorization server contains the access token, token type (bearer token), and the token expiration time.

3. **The client sends the access token to the resource server.** The client sends an API request to the resource server with the signed access token (JSON Web Token) in the request authorization header.

4. **The resource server grants access to protected resources.** The following series of events take place before the resource server can accept the API request:
   - The Zscaler service extracts the JWT access token from the API request header and decodes the token to fetch information such as the key ID, algorithm, scope, client ID, audience, expiration, and other configured values.
   - The Zscaler service cryptographically verifies the signature of the JWT token using the authorization server's public key.
   - If the JWT signature verification is successful, the Zscaler service validates the JWT's scope claim, which is in `<Zscaler Cloud Name>::<Org ID>::<API Role>` format. The `<API Role>` value in the scope is used to authorize the API request. This value must match with one of the API Roles configured in the Zscaler Admin Console. If no match is found, the API request is rejected.
   - The Zscaler service may verify any additional claims in the JWT, such as audience, issuer, client ID, etc.
   - Finally, the Zscaler service grants the client application access to the requested API resources.

## Setting up OAuth 2.0

You need to set up the following configurations sequentially before initiating cloud service API authentication using OAuth 2.0:

1. Configure API Roles in the Zscaler Admin Console
2. Register applications on the external OAuth provider
3. Add OAuth 2.0 Authorization Servers to the Zscaler Admin Console

API operations that are authenticated using OAuth 2.0 are associated with an auto-generated Admin ID and recorded in Audit Logs. An Admin ID is generated for each API role in the following format: `oauth-<rolename>$@<orgid>.<cloud_domain>`. To learn more, see Adding API Roles (`/zia/adding-api-roles`).

## Important Note on Scope Format

The JWT scope claim must be in `<Zscaler Cloud Name>::<Org ID>::<API Role>` format. This is **distinct** from OneAPI OAuth 2.0 where the `audience` parameter is `https://api.zscaler.com`. The legacy ZIA OAuth 2.0 integration uses an external OAuth provider (PingFederate, Okta, or Microsoft Entra ID), NOT ZIdentity — this is an older integration path different from the modern OneAPI flow.
