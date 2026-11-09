# ZIA SCIM server operations, paging and rate limit (zia.scim.operations)
Also called: scim endpoints; scim filter; scim pagination; scim startIndex; scim rate limit; scim bulk; scim patch; scim delta sync; meta.lastModified; scim totalResults

Use this when a custom client or a connector misbehaves against the service itself. The SCIM server supports, for users: POST /Users to create; GET /Users for up to 1,000 entries and GET /Users?startIndex=<value> for the next 1,000; GET /Users/{UserID}; PUT or PATCH /Users/{UserID} to update; and DELETE /Users/{UserID}. [zia.scim.operations:user-operations] For groups it supports POST /Groups, GET /Groups (up to 1,000) with startIndex paging, GET /Groups/{GroupID}, PUT or PATCH /Groups/{GroupID} and DELETE /Groups/{GroupID}. [zia.scim.operations:group-operations] Beyond users and groups the server exposes POST /Bulk to modify resources, GET /Schemas and /Schemas/{SchemaID}, GET /ServiceProviderConfig, GET /ResourceTypes and /ResourceTypes/{ResourceTypeID}, and POST [prefix]/.search. [zia.scim.operations:bulk-and-discovery]

**Filters and incremental reads.** Users can be filtered by userName, externalID or id with eq, and by meta.lastModified with gt; groups by displayName together with members.value. The help row for the meta.lastModified filter is labelled 'Filter Users by Date Created After' although the filter is on lastModified. [zia.scim.operations:filters] A client that needs incremental reconciliation can use the meta.lastModified gt filter to read only users changed since its last run, and the userName, externalID and id equality filters for targeted lookups. [zia.scim.operations:delta-sync]

**Paging.** totalResults is exact when under 10K; above 10K the service returns a rough estimate to keep responses fast, and after the client fetches the last page the field reflects the precise, final count. [zia.scim.operations:paging] The Go SDK helper decides it is finished from totalResults, see [What the Go and Python SDKs do for ZIA SCIM](kb:zia.scim.sdk-coverage).

**Write shape.** In Zscaler's group PATCH example the body uses the PatchOp message schema with an add operation of a members value and is sent as application/json-patch+json; the server answers 204 No Content, as it does for a user delete. [zia.scim.operations:patch-example]

**Rate.** Zscaler SCIM servers have a rate limit of 5 requests per second, and applications should be configured to comply to avoid retries. [zia.scim.operations:rate-limit] A first push of many thousands of records made as individual calls is bounded by the server's rate of 5 requests per second. [zia.scim.operations:first-sync-rate-bound] The Go SDK client sets no limiter of its own, see [What the Go and Python SDKs do for ZIA SCIM](kb:zia.scim.sdk-coverage). How large batches should use Bulk is open [gap:zia.scim.operations:bulk-limits].

**SCIM Event Logs page.** The SCIM Event Logs page lists the recorded SCIM client activity, such as creating, updating and deleting user or group accounts in the Admin Console, together with the SCIM client's logs (timestamps, error codes, status codes) and any configuration changes it made. The activity is recorded only if SCIM-based provisioning is enabled for users on the Zscaler service, and only one SCIM log is audited per day for wrong domain errors. [zia.scim.operations:event-log-contents] The SCIM Event Logs page can be filtered by time range (a specified range within the last 14 days), category, subcategory and result, and searched by message, error code or status code. [zia.scim.operations:event-log-window] Each SCIM event log shows a Timestamp (the local time of the client's last activity), Category (Provisioning), Sub-Category (SCIM), Message (the action performed), Result, Error Code and Status Code, and configuration changes can be viewed as the differences between pre-configuration and post-configuration. [zia.scim.operations:event-log-columns] The page lists no error or status code values [gap:zia.scim.operations:event-log-code-values]. Its filter and search names match the request fields of the event log report API, but no capture says they are the same dataset [gap:zia.scim.operations:event-log-vs-report-api].

How quickly a pushed change takes effect is in [How fast SCIM changes reach ZIA](kb:zia.scim.propagation); what active=false and DELETE do is in [What SCIM does when a user is disabled or deleted](kb:zia.scim.deactivation).

What to check:
1. Whether the verb and endpoint the client actually sends are supported, see the user, group and bulk operations.
2. Whether the client follows startIndex until the last page rather than stopping at the first 1,000 entries.
3. Whether the request rate stays within 5 requests per second.

Inferred, not quoted (say so when an answer rests on one):
- [zia.scim.operations:delta-sync] Tier B: Derived from the filter list; the articles do not describe delta sync, and the help row's 'Date Created After' label leaves it open whether the comparison is on creation or modification time.
- [zia.scim.operations:first-sync-rate-bound] Tier B: Assumes one request per record; whether Bulk changes the arithmetic is not documented, see the bulk-limits gap.

Not known (open gaps):
- Error and status code values on the SCIM Event Logs page [gap:zia.scim.operations:event-log-code-values]: settled by tenant-data or source-read
- Whether SCIM Event Logs are the data the event log report API returns [gap:zia.scim.operations:event-log-vs-report-api]: settled by source-read or lab-test
- Bulk operation limits and request shape [gap:zia.scim.operations:bulk-limits] (data gap): filled by operator; settled by tenant-data or source-read. Blocks: advice on batching large initial provisioning

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.scim.sdk-coverage.md (What the Go and Python SDKs do for ZIA SCIM)
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior), from zia.scim: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites), from zia.scim: SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.scim: Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/zia/zia.scim.deactivation.md (What SCIM does when a user is disabled or deleted)
- links-to references/_meta/text/zia/zia.scim.propagation.md (How fast SCIM changes reach ZIA)
