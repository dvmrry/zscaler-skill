# Authentication Settings

**Source:** https://help.zscaler.com/legacy-apis/authentication-settings
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

## GET /authSettings

Retrieves the organization's default authentication settings information, including authentication profile and Kerberos authentication information.

Parameters: No parameters

Model - AuthSettings: Organization's default authentication settings

- orgAuthType* (string): User authentication type. Setting it to an LDAP-based authentication requires a complete LdapProperties configuration. Enum: [9 Items — ANY, NONE, LDAP_GROUP, LDAP_USER, SAML, AD_GROUP, AD_USER, ZIDENTITY, ZIDENTITY_GUEST]
- oneTimeAuth (string): When the orgAuthType is NONE, administrators must manually provide the password to new end users. For new users who have not yet authenticated, a one-time token or link with a temporary password is sent as an email by the security cloud. If SAML Single Sign-On is enabled, this one-time token is not applicable, and this field is ineffective. Enum: [3 Items — OTP_DISABLED, OTP_ENABLED, OTP_MANDATORY]
- samlEnabled (boolean): Whether or not to authenticate users using SAML Single Sign-On. Enabling SAML requires complete SamlSettings.
- kerberosEnabled (boolean): Whether or not to authenticate users using Kerberos
- kerberosPwd (string): Read Only. Kerberos password can only be set through generateKerberosPassword api. readonly: true
- authFrequency (string): How frequently the users are required to authenticate (i.e., cookie expiration duration after a user is first authenticated). This field is not applicable to the Lite API. Enum: [4 Items — DAILY_COOKIE, WEEKLY_COOKIE, MONTHLY_COOKIE, SESSION_COOKIE]
- authCustomFrequency (integer/$int32): How frequently the users are required to authenticate. This field is customized to set the value in days. Valid range is 1–180. This field is not applicable to the Lite API.
- passwordStrength (string): Password strength required for form-based authentication of hosted DB users. Not applicable for other authentication types (e.g. SAML SSO or Directory). Enum: [3 Items — NONE, LOW, HIGH]
- passwordExpiry (string): Password expiration required for form-based authentication of hosted DB users. Not applicable for other authentication types (e.g. SAML SSO or Directory). Enum: [4 Items — NEVER, MONTHLY, QUARTERLY, SEMIANNUALLY]
- lastSyncStartTime (integer/$int32): Timestamp (epoch time in seconds) corresponding to the start of the last LDAP sync. This is reset when the organization's authentication type is changed to a different directory authentication type. Applicable only for directory-based authentication. This field is not applicable to the Lite API.
- lastSyncEndTime (integer/$int32): Timestamp (epoch time in seconds) corresponding to the end of the last LDAP sync. Applicable only for directory-based authentication. This field is not applicable to the Lite API.
- mobileAdminSamlIdpEnabled (boolean): Indicate the use of Mobile Admin as IdP
- autoProvision (boolean): Enable SAML Auto-Provisioning
- directorySyncMigrateToScimEnabled (boolean): Enable to disable directory synchronization for this user repository type so you can enable SCIM provisioning or SAML auto-provisioning. Use this setting to migrate from directory synchronization to SCIM provisioning.

Responses:
- Code 200: Successful Operation

Example Value:
```json
{ "orgAuthType": "ANY", "oneTimeAuth": "OTP_DISABLED", "samlEnabled": true, "kerberosEnabled": true, "kerberosPwd": "string", "authFrequency": "DAILY_COOKIE", "authCustomFrequency": 0, "passwordStrength": "NONE", "passwordExpiry": "NEVER", "lastSyncStartTime": 0, "lastSyncEndTime": 0, "mobileAdminSamlIdpEnabled": true, "autoProvision": true, "directorySyncMigrateToScimEnabled": true }
```

## PUT /authSettings

Updates the organization's default authentication settings information.

Parameters:
- body (object, body): The default authentication settings information

Example Value (same schema as GET response):
```json
{ "orgAuthType": "ANY", "oneTimeAuth": "OTP_DISABLED", "samlEnabled": true, "kerberosEnabled": true, "authFrequency": "DAILY_COOKIE", "authCustomFrequency": 0, "passwordStrength": "NONE", "passwordExpiry": "NEVER", "lastSyncStartTime": 0, "lastSyncEndTime": 0, "mobileAdminSamlIdpEnabled": true, "autoProvision": true, "directorySyncMigrateToScimEnabled": true }
```

Responses:
- Code 200: Successful Operation

## GET /authSettings/lite

Retrieves organization's default authentication settings information. (Lightweight version — same model but `authFrequency`, `authCustomFrequency`, `lastSyncStartTime`, `lastSyncEndTime` are not applicable in the Lite API.)

Parameters: No parameters

Response: Same AuthSettings model as GET /authSettings.
