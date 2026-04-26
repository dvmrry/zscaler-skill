# Understanding ZSDK Error Codes

**Source:** https://help.zscaler.com/zsdk/understanding-zsdk-error-codes
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Zscaler SDK Developer Guide 
Understanding ZSDK Error Codes
Zscaler SDK for Mobile Apps
Understanding ZSDK Error Codes
Ask Zscaler

The following tables are lists of error codes you can encounter for ZSDK.

ZSDK Error Codes

The following table is a list of error codes that you can see when configuring for ZSDK:

Error Code	Error Name	Description	Recommended Action
9001	unknown	An unknown error occurred.	Try again. If the problem persists, contact Zscaler Support.
9002	invalidParameter	The input parameter is invalid.	Provide valid and correct parameters while starting the tunnel.
9101	noNetwork	Your network is unavailable when attempting to start the tunnel.	Try again when the network is back online. If the problem persists, contact Zscaler Support.
9102	timeOut	The request timed out.	No action required. If the problem persists, contact Zscaler Support.
9103	dnsFailure	There is an issue with the DNS while connecting the tunnel.	No action required. If the problem persists, contact Zscaler Support.
9301	permissionDenied	The ZSDK permission is not granted to the user.	Check the device in use for granted permissions.
9302	sdkNotInitialized	ZSDK is not initialized when it is called upon during application creation.	Call the ZscalerSDK.init() method first before calling startTunnel or any other APIs in Android.
9303	sdkSecureInitFailed	ZSDK is initialized, but there was an issue.	Try again. If the problem persists, contact Zscaler Support.
9304	invalidProxyPort	The proxy port is invalid.	Try again. If the problem persists, contact Zscaler Support.
9305	proxyConnectFailed	Connection to proxy server failed.	Try again. If the problem persists, contact Zscaler Support.
9306	setWebViewProxyFailed	The set proxy in WebView failed.	Ensure the Android WebView is updated with the latest version of the affected device.
9307	clearWebViewProxyFailed	The clear proxy in WebView failed.	Ensure the Android WebView is updated with the latest version of the affected device.
9308	startTunnelPendingInSDK	There is a pending startTunnel call.	Wait for the startTunnel call to finish and then try again.
9309	proxyAuthFailed	Proxy authorization failed.	Try again. If the problem persists, contact Zscaler Support.
9310	proxyAuthNotSupportedInAutomaticConfig	Proxy authorization is not supported in Automatic Configuration mode.	No action required.
9401	dataParsingError	Data parsing failed at the server end.	Try again. If the problem persists, contact Zscaler Support.
9402	invalidToken	An invalid token was sent as a request to the server.	Provide a valid token when you send a request to the server.
9403	badRequest	The server encountered a bad request.	Try again. If the problem persists, contact Zscaler Support.
9501	tunnelError	An error was encountered when starting the tunnel.	Try again. If the problem persists, contact Zscaler Support.
9502	tunnelAlreadyRunning	The tunnel is already in a running state.	No action required.
9503	tunnelAuthenticationFailed	Authentication failed due to a configuration error.	Try again. If the problem persists, contact Zscaler Support.
9504	connectionTerminatedWhileUpgrading	Connection was terminated during upgrade to the Zero Trust tunnel. The existing Prelogin tunnel is invalid and stopped.	Try again. If the problem persists, contact Zscaler Support.
9505	tunnelUpgradeFailed	The upgrade to the Zero Trust tunnel failed. The Prelogin tunnel remains active.	Try again. If the problem persists, contact Zscaler Support.

API Errors

If you are using APIs, you can see the following API errors:

Error Code	Error Name	Description	Recommended Action
2001	csrSignFailure	There was a failure to sign the certificate signing request (CSR).	No action required.
2002	invalidTenantName	The specified tenant name is invalid.	Specify a valid tenant name.
2003	noZpaService	There is no registered Zscaler Private Access (ZPA) service.	Register for ZPA service.
2004	multipleZpaService	There are multiple, registered ZPA services.	No action required.
2005	revokeCertFailed	There was a failure to revoke certification.	No action required.
2006	tokenConfigNotFound	Unable to find token configuration for the tenant.	No action required.
2007	jwkParseFailed	There was a failure to parse the JSON Web Key.	No action required.
2008	customerKeyNotPresent	The customer key is not present.	No action required.
2009	customerKeyParseFailed	There was a failure to parse the customer key.	No action required.
2010	unsupportedKeyType	The key type is unsupported.	Ensure the key type is supported.
2011	failedSignatureValidation	Signature validation failed.	Check the signature for validation errors.
2012	tokenExpired	The access token expired.	Refresh the access token's expiration.
2013	tokenValidationFailed	The access token validation failed.	Try again. If the problem persists, check the access token's fields.
2014	tokenClaimValidationFailed	The token claim validation failed.	No action required.
2015	missingCertificateIdOauth2Client	The certificate_id is missing from the OAuth2 client.	No action required.
2016	missingPrivateKeyOAuth2Client	The private key is missing from the OAuth2 client.	No action required.
2017	failureGeneratingClientAssertion	There was a failure to generate client assertion.	No action required.
2018	failureGeneratingSamlAssertion	There was a failure to generate the Security Assertion Markup Language (SAML) assertion.	No action required.
2019	failureSigningSamlAssertion	There was a failure to sign the SAML assertion.	No action required.
2020	failureSerializingSamlAssertion	There was a failure to serialize the SAML assertion.	No action required.
2021	missingCertificateIdSamlConfig	The certificate_id is missing in the SAML configuration.	No action required.
2022	unsupportedCustomerTokenType	The JSON Web Token is unsupported.	Ensure the JSON Web Token is supported.
2023	hmacSecretFailed	There was a failure to fetch the Hash-based Message Authentication Code (HMAC) secret from ZPA.	Check the HMAC secret from ZPA.
2024	hmacValidationFailed	There was a failure to validate HMAC payload.	No action required.
2025	missingSubInAccessToken	The sub claim is missing from the access token.	Add the sub claim to the access token.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding ZSDK Error Codes
Developer Reference
Best Practices
