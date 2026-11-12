# ZSDK error codes: SDK errors 9001-9505 and ZSDK API errors 2001-2999 (shared.zsdk.error-codes)
Also called: zsdk error code; zsdk error 9504; zsdk error 9505; tunnelUpgradeFailed; connectionTerminatedWhileUpgrading; sdkNotInitialized; zsdkIdentifierIsNotPublished; hmacSecretFailed; tokenExpired; noZpaService; zsdk api errors; ZscalerSDKErrorDomain; ZscalerSDKErrorCode; ZscalerSDKErrorCodeMissingSubInAccessToken

The vendor publishes two tables: errors raised in the app by the SDK, and errors returned by the ZSDK API. Several API codes carry more than one error name.

## SDK errors

| Codes | What they mean |
| --- | --- |
| 9001-9002 | 9001 `unknown` is an unknown error (try again, then contact Support); 9002 `invalidParameter` means an invalid input parameter was given while starting the tunnel. [shared.zsdk.error-codes:sdk-general] |
| 9101-9103 | 9101 `noNetwork` means the network was unavailable when starting the tunnel; 9102 `timeOut` means the request timed out; 9103 `dnsFailure` means a DNS issue while connecting the tunnel. [shared.zsdk.error-codes:sdk-network] |
| 9301-9310 | 9301 `permissionDenied`: the ZSDK permission is not granted to the user. 9302 `sdkNotInitialized`: ZSDK was called before initialization; on Android call `ZscalerSDK.init()` before `startTunnel` or any other API. 9303 `sdkSecureInitFailed`: initialized with an issue. 9304 `invalidProxyPort`, 9305 `proxyConnectFailed`, 9309 `proxyAuthFailed`: proxy port invalid, proxy connection failed, proxy authorization failed. 9306 `setWebViewProxyFailed` and 9307 `clearWebViewProxyFailed`: setting or clearing the WebView proxy failed; update Android WebView. 9308 `startTunnelPendingInSDK`: a `startTunnel` call is pending; wait for it. 9310 `proxyAuthNotSupportedInAutomaticConfig`: proxy authorization is not supported in Automatic Configuration mode. [shared.zsdk.error-codes:sdk-init-proxy] |
| 9401-9403 | 9401 `dataParsingError`: data parsing failed at the server; 9402 `invalidToken`: an invalid token was sent to the server, so provide a valid one; 9403 `badRequest`: the server received a bad request. [shared.zsdk.error-codes:sdk-server] |
| 9501-9505 | 9501 `tunnelError`: error starting the tunnel. 9502 `tunnelAlreadyRunning`: no action required. 9503 `tunnelAuthenticationFailed`: authentication failed because of a configuration error. 9504 `connectionTerminatedWhileUpgrading`: the connection was terminated during the upgrade to the Zero Trust tunnel, and the existing Prelogin tunnel is invalid and stopped. 9505 `tunnelUpgradeFailed`: the upgrade to the Zero Trust tunnel failed and the Prelogin tunnel remains active. [shared.zsdk.error-codes:sdk-tunnel] |

## ZSDK API errors

| Codes | What they mean |
| --- | --- |
| 2001, 2005, 2028 | Certificate errors: code 2001 covers six names, `csrSignFailure` (signing the CSR failed), `invalidSigningCertificate`, `failedToRetrieveSigningCertificate` (check and validate the signing certificate), `failedToAddCustomExtensions`, `zsdkFailedCryptoServiceRequest` (ZSDK's upstream failed) and `invalidResourceArgument` (an invalid request); 2005 `revokeCertFailed` is a failure to revoke a certificate; 2028 covers `publicKeyTooShort` and `invalidClientCSR`. [shared.zsdk.error-codes:api-certificates] |
| 2003, 2004, 2023, 2024 | Private Access (ZPA) errors: 2003 `noZpaService` means no Private Access service is registered (register for it); 2004 `multipleZpaService` means several are registered; 2023 `hmacSecretFailed` is a failure to fetch the HMAC secret from Private Access; 2024 `hmacValidationFailed` is a failure to validate the HMAC payload. [shared.zsdk.error-codes:api-private-access] |
| 2006-2016, 2022 | Token and key errors: 2006 `tokenConfigNotFound` (no token configuration for the tenant), 2007 `jwkParseFailed`, 2008 `customerKeyNotPresent`, 2009 `customerKeyParseFailed`, 2010 `unsupportedKeyType`, 2011 `failedSignatureValidation`, 2012 `tokenExpired` (the access token expired), 2013 `tokenValidationFailed` (check the access token's fields), 2015 `missingCertificateIdOAuth2Client` (certificate_id missing from the OAuth2 client), 2016 `missingPrivateKeyOAuth2Client`, and 2022 `unsupportedCustomerTokenType` (the JSON Web Token is unsupported). [shared.zsdk.error-codes:api-tokens-keys] |
| 2026, 2027 | App identity errors: 2026 `missingMandatoryParams` (mandatory parameters missing); 2027 covers `zsdkIdentifierDoesNotExist` (the app's ZSDK ID does not exist; create and publish an app), `zsdkIdentifierIsNotPublished` (publish the app), `zsdkIdentifierIsAlreadyRevoked` (the app is revoked) and `zsdkIdentifierDoesNotHaveHMACSecret` (the app failed to fetch the HMAC secret from Private Access). [shared.zsdk.error-codes:api-app-identity] |
| 2999 | 2999 covers `unexpectedError`, `zsdkIdentifierFailedToRetrieveConfigs` (ZSDK failed to retrieve the configuration) and `csrfViolation` (a Cross-Site Request Forgery violation). [shared.zsdk.error-codes:api-unexpected] |

## The iOS header

The iOS header declares the SDK error constants in the NSErrorDomain ZscalerSDKErrorDomain, an extensible NSInteger enum ZscalerSDKErrorCode: Unknown, InvalidParameter, NoNetwork, TimeOut, DnsFailure, TunnelError, PermissionDenied, TunnelAlreadyRunning, TunnelStartPendingInSDK, TunnelAuthenticationFailed, ConnectionTerminatedWhileUpgrading and TunnelUpgradeFailed. [shared.zsdk.error-codes:ios-error-constants] Under a `OneIdErrors` section the iOS header also declares constants for token claim validation (`ZscalerSDKErrorCodeTokenClaimValidationFailed`), a missing sub in the access token (`ZscalerSDKErrorCodeMissingSubInAccessToken`), client-assertion generation, SAML assertion generation, signing and serialization failures, and a missing certificate_id in the SAML config (`ZscalerSDKErrorCodeMissingCertificateIdSamlConfig`). [shared.zsdk.error-codes:ios-oneid-constants] Which numbers these carry is open [gap:shared.zsdk.error-codes:ios-numeric-codes]. The header's comment on the multiple-registrations constant differs from the table [divergence:shared.zsdk.error-codes:multiple-zpa-comment].

What to check:
1. For 9504 or 9505, whether the failure happened while upgrading a Prelogin tunnel to Zero Trust, and whether the Prelogin tunnel is still up.
2. For 2027, whether the app key is published and not revoked.

Sources disagree (name both sides):
- What the iOS constant for multiple Private Access services means. [divergence:shared.zsdk.error-codes:multiple-zpa-comment]
  - zscaler-help: The help error table says 2004 multipleZpaService means there are multiple registered Private Access services.
  - zsdk-ios: The iOS header comment on ZscalerSDKErrorCodeMultipleZpaService reads 'No ZPA Service is registered', the same text as the no-service constant.
  Impact: The header comment looks copied from the no-service constant; read ZscalerSDKErrorCodeMultipleZpaService as the multiple-registrations error.

Not known (open gaps):
- Numeric values behind the iOS error constants [gap:shared.zsdk.error-codes:ios-numeric-codes]: settled by source-read or support-ticket. Blocks: mapping an iOS ZscalerSDKErrorCode constant to a code in the help table

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.zsdk.developer-api.md (The ZSDK developer API: classes, tunnels, lifecycle and notifications)
- see-also references/_meta/text/shared/shared.zsdk.configuration.md (Configuring ZSDK: registered apps and app keys, segments and access policy)
- see-also references/_meta/text/shared/shared.zsdk.sdk-integration.md (Adding the ZSDK to an app: Android, iOS, React Native and SwiftUI packages, prerequisites and sample apps)
