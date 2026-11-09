# ZSDK token validators, browser token validators and web server certificates (shared.zsdk.authentication)
Also called: zsdk token validator; zsdk jwt validation; zsdk jwks url; zsdk browser token validator; zsdk web server certificate; zsdk certificate management

ZSDK token validators inspect and validate the JSON Web Tokens issued by the IdP, checking token validity, signing certificate authenticity and the required claims. [shared.zsdk.authentication:token-validator-checks]

## Token validators

The IdP's JWT must contain the subject (sub), audience (aud) and issuer (iss) claims when a token validator is configured; more claims can be added depending on the IdP's JWT. [shared.zsdk.authentication:token-validator-required-claims] In the Add Token Validator drawer the exp, sub and iat claims are shown as enforced and cannot be configured; for aud and iss only the Value is entered, not the Name. [shared.zsdk.authentication:token-validator-enforced-claims] A token validator has an Access Type of Mobile Apps or Browser Access, and a Validation Type of Client JWKS URL or Certificates and Public Keys; a Browser Access token validator needs an app that has Browser Access enabled. [shared.zsdk.authentication:token-validator-access-type]

Signature validation for a token validator is either a JWKS URL from the app's IdP (Client JWKS URL) or an uploaded certificate used by the IdP to sign JWTs (Certificates and Public Keys); the target is the app key registered earlier. [shared.zsdk.authentication:token-validator-signature-validation] A public key supplied to a token validator in PEM format has the standard BEGIN and END PUBLIC KEY headers and follows the RSA algorithm for a PEM format. [shared.zsdk.authentication:token-validator-pem-format] A public key can be extracted from an existing certificate with openssl x509 and checked with openssl pkey; the output for a properly formatted public key is similar to the documented Public-Key (2048 bit) modulus and exponent example, and if it is not Zscaler recommends checking why the PEM format is incorrect. [shared.zsdk.authentication:token-validator-pem-extract-verify]

## Browser token validators

A browser token validator is added for an application segment with Browser Access enabled and takes aud, iss and sub claim values from the IdP's JWT; its validation type is a Client JWKs URL or an uploaded certificate or public key. [shared.zsdk.authentication:browser-token-validator-claims] The Browser Token Validator page lists the browser token validators for Browser Access-enabled application segments, showing each one's Name and Type. [shared.zsdk.authentication:browser-token-validator-page] Whether this and the Browser Access type of token validator are one object is open [gap:shared.zsdk.authentication:validator-routes].

## Web server certificates

The About Certificates article says ZSDK web server certificates are typically used for Browser Access and are selected when defining an application in an application segment; enrollment certificates cannot be used with a CA for Browser Access. [shared.zsdk.authentication:web-server-certificate-purpose] Whether a certificate is required for Browser Access is in dispute [divergence:shared.zsdk.authentication:browser-access-certificate-requirement]. An uploaded, signed web server certificate must be a PEM file containing both the certificate and the unencrypted private key, in RSA format only, with a certificate chain. [shared.zsdk.authentication:certificate-upload-format] A CSR for a web server certificate takes the subject's distinguished name, which does not need a wildcard common name, and a subject alternate name that lets the certificate cover multiple hostnames (domains only). [shared.zsdk.authentication:certificate-csr] On the Certificates page an expired certificate shows a red Warning icon, one with fewer than 7 days before expiration a yellow Caution icon, and one with fewer than 30 days an orange Info icon. [shared.zsdk.authentication:certificate-expiry-icons]

For an application segment with Browser Access enabled, a certificate signed by a public CA requires HTTPS as the protocol; the same article says that when an application's certificate is self-signed, or ZSDK cannot verify the chain of trust to the public CA, HTTP must be selected, without repeating the Browser Access condition. [shared.zsdk.authentication:certificate-protocol-rule] How that rule interacts with the Use Untrusted Certificates default is open [gap:shared.zsdk.authentication:untrusted-certificates-interaction].

What to check:
1. Whether the IdP's JWT carries the sub, aud and iss claims the token validator requires.
2. Whether a public key given to a token validator has the BEGIN and END PUBLIC KEY headers and the RSA format.
3. Which protocol an application segment with Browser Access enabled uses for its certificate: HTTPS for a public CA signature, HTTP for a self-signed certificate or one whose chain of trust ZSDK cannot verify.

Sources disagree (name both sides):
- Whether a web server certificate is required for Browser Access. [divergence:shared.zsdk.authentication:browser-access-certificate-requirement]
  - zscaler-help: The About Certificates article says web server certificates are typically used for Browser Access.
  - zscaler-help: The Managing Certificates article says web server certificates are required to use Browser Access.
  - zscaler-help: The Browser Access prerequisites article lists its requirements as applying only when using a certificate.
  Impact: A Browser Access design cannot tell from one page whether a certificate is optional, typical or mandatory.

Not known (open gaps):
- Whether the Token Validator with Access Type Browser Access and the Browser Token Validator are the same object [gap:shared.zsdk.authentication:validator-routes]: settled by lab-test or source-read. Blocks: answering where to configure a Browser Access token validator
- How the HTTP rule for self-signed certificates interacts with Use Untrusted Certificates [gap:shared.zsdk.authentication:untrusted-certificates-interaction]: settled by lab-test or source-read

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json
