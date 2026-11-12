# Emergency Access through the API, the Python SDK and Terraform (zpa.emergency-access.api-surface)
Also called: emergency_access python sdk; emergencyAccess users api; emergency access page_id pageId; zpa_emergency_access_user terraform; activate_now add_user; emergency access delete user; emergency access user deactivate terraform destroy

The calls behind [Emergency Access Users page: statuses, dates and actions](kb:zpa.emergency-access.users). In the Python SDK, client.zpa.emergency_access returns an EmergencyAccessAPI. [zpa.emergency-access.api-surface:service-class]

**Operations.** The API lists users with GET emergencyAccess/users (plural), and reads, adds, updates, activates and deactivates a user with the singular emergencyAccess/user paths. [zpa.emergency-access.api-surface:endpoints] The API and SDKs have no delete operation for emergency access users: deactivation is the removal path. [zpa.emergency-access.api-surface:no-delete]

**Fields.** The user object has the fields userId, firstName, lastName, emailId, userStatus, activatedOn, lastLoginTime, allowedActivate, allowedDeactivate and updateEnabled, and emailId, firstName and lastName are required on add. [zpa.emergency-access.api-surface:user-fields]

**Create and activate.** The add call takes activateNow, default true, and the Python add_user sends it from activate_now, which defaults to True. [zpa.emergency-access.api-surface:activate-now] The ZPA SDK's emergency-access `Create` sets `ActivateNow` to false on the caller's struct, then posts that struct. The field is `omitempty`, so it is not sent at all. [zpa.emergency-access.api-surface:sdk-go-create-clears-activate-now] A caller of the SDK's emergency-access `Create` cannot create a user that is activated immediately: the request never carries `activateNow: true`. [zpa.emergency-access.api-surface:sdk-go-create-cannot-activate-now] The activate call takes sendEmail as a query parameter, default false. The Python activate_user builds {"sendEmail": "true"} only when send_email is true, but passes that dict as create_request's fourth positional argument, which is headers, so it goes out as a request header rather than a query parameter. [zpa.emergency-access.api-surface:send-email] In the Python SDK, add_user builds query_params with microtenantId and then reassigns query_params to a dict holding only activateNow, so the microtenant ID is never sent on create; list_users, get_user, update_user and deactivate_user pass it as a query parameter, while activate_user hands its query dict to create_request in the headers position. [zpa.emergency-access.api-surface:add-user-drops-microtenant]

**Paging.** The list call pages with pageId and pageSize; the Python SDK has a special case that converts the parameters of the emergencyAccess/users request to camel case, and the Go SDK builds the URL with pageId. [zpa.emergency-access.api-surface:page-id-pagination] The vendor and the SDK docstring disagree on what pageId is [divergence:zpa.emergency-access.api-surface:page-id-meaning]. The Python ZPA services document the pagination key as page everywhere except emergency_access.py, which documents page_id. [zpa.emergency-access.api-surface:only-page-id-service]

**Terraform.** The zpa_emergency_access_user resource's delete handler calls the deactivate operation rather than a delete, so a Terraform destroy deactivates the user and drops it from state. [zpa.emergency-access.api-surface:terraform-destroy-deactivates] In the Terraform resource, changing email_id forces a new user. [zpa.emergency-access.api-surface:terraform-email-forcenew] The zpa_emergency_access_user resource schema defines only user_id, email_id, first_name and last_name, while its create, read, update and delete functions read microtenant_id from the resource data. [zpa.emergency-access.api-surface:terraform-no-microtenant-attribute] Other provider and Go SDK defects are in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths) and [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects).

What to check:
1. The operation: list and get are GET, add is POST, update, activate and deactivate are PUT, and there is no delete.
2. Whether the list call pages with the cursor that came back, rather than a page number.
3. That a Terraform destroy of the user resource deactivates the user and leaves the account in the IdP.
4. Whether add_user was called with activate_now left at its default of true, which activates the user on creation.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.emergency-access.api-surface:no-delete] Tier B: Absence claim. The OpenAPI path items for emergencyAccess list only get, post and put; emergency_access.py in the Python SDK defines list_users, get_user, add_user, update_user, activate_user and deactivate_user and no delete; the Go emergencyaccess package defines Get, GetByEmailID, Create, Update, Activate, Deactivate and GetAll.
- [zpa.emergency-access.api-surface:only-page-id-service] Tier B: Search, not a parse. Searched zscaler/zpa/*.py for page_id (only emergency_access.py, in its docstring and example) and for the query_params.page docstring (66 matches in the other services).
- [zpa.emergency-access.api-surface:sdk-go-create-cannot-activate-now] Tier B: Rests on Create overwriting `ActivateNow` before the POST and on the field being `omitempty`, so false is not sent. No source states what the API does when the field is absent, and the SDK's `Update` was not examined for a way to activate afterwards.

Sources disagree (name both sides):
- The API describes pageId as a cursor, while the Python docstring calls page_id the page number. [divergence:zpa.emergency-access.api-surface:page-id-meaning]
  - api-specs: pageId is the cursor that points to the end of the page of data that has been returned.
  - sdk-python: page_id specifies the page number, and the docstring example passes page_id 1.
  Impact: A caller who passes a page number may not get the page they expect; the Go SDK feeds back the NextPage value from each response as pageId.

Area: zpa.emergency-access, its subjects in references/_meta/spine/zpa/zpa.emergency-access.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled), from zpa.emergency-access: The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types]
- depends-on references/_meta/text/zpa/zpa.emergency-access.configuration.md (Configuring Emergency Access: availability, settings, authentication domains, Microtenants), from zpa.emergency-access: Emergency Access is in limited availability, and Zscaler Support enables it for an organization. [zpa.emergency-access.configuration:limited-availability]
- depends-on references/_meta/text/zpa/zpa.emergency-access.identity.md (Emergency Access identity: where users live, which IdPs, and how they sign in), from zpa.emergency-access: The IdP shown on the Emergency Access page is the IdP that has Use with Arbitrary Domains enabled, and the field is read-only. [zpa.emergency-access.identity:idp-arbitrary-domains]
- scoped-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry), from zpa.emergency-access: Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]
- links-to references/_meta/text/zpa/zpa.emergency-access.users.md (Emergency Access Users page: statuses, dates and actions)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
