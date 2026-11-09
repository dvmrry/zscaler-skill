# Workflow Automation API keys: the Key ID and secret, expiry, disabling, regenerating and deleting (zwa.settings.api-keys)
Also called: zwa api keys; workflow automation api key; key secret; API Management

A Workflow Automation API key consists of a Key ID and a Key Secret, both required to authenticate Workflow Automation APIs; keys can be generated only on the API Keys page in the Zscaler Admin Console. [zwa.settings.api-keys:key-parts] SDK authentication with these keys is in [The Workflow Automation API from a client's side: hosts, the Python and Go clients, and what neither SDK covers](kb:zwa.api); the wider settings are in [Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release](kb:zwa.settings).

**Secret handling.** Key IDs are always accessible on the API Keys page, but the key secret is available only when the key is created and is not in the saved configuration. [zwa.settings.api-keys:secret-visibility] The key secret and key ID are copied from the API Key window shown after Submit, and the secret can be copied only when creating the key. [zwa.settings.api-keys:secret-copy]

**The API Keys page.** The API Keys page lists, for each key, the Name, Created By (the creator's email address), Key ID, Last Used (a date) and Expiry (a date). [zwa.settings.api-keys:list-columns] With a Workflow Automation subscription API Management is automatically accessible to an admin role; an admin can create and display the API key needed to authenticate API calls. [zwa.settings.api-keys:access-and-purpose]

**Lifecycle.** Setting an expiration time on an API key is optional; if enabled a lifetime in days is entered, and if disabled the key has no expiration time. [zwa.settings.api-keys:expiration] The legacy getting-started page for the Workflow Automation API refers to the Expire after time option being enabled in the Workflow Automation Admin Portal, whereas the API Keys page labels its optional expiration setting Expiration Time. [zwa.settings.api-keys:expiration-option-name] An API key is enabled when created; it can be disabled with the toggle, after which it cannot be used for authentication, and the same action enables it again. [zwa.settings.api-keys:disable-enable] Regenerating an API key generates a new key secret for the same admin and key ID; deleting an API key deletes it permanently. [zwa.settings.api-keys:regenerate-delete] The documented benefits of the API Keys page include regenerating a key whenever required or when vulnerabilities for an attack are suspected, and deleting a key so that no further API requests are possible after the API services have been used. [zwa.settings.api-keys:delete-ends-access]

What to check:
1. Whether the key secret was copied when the key was created, since it is not available afterwards.

Area: zwa.settings, its subjects in references/_meta/spine/zwa/zwa.settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.api.md (The Workflow Automation API from a client's side: hosts, the Python and Go clients, and what neither SDK covers)
- links-to references/_meta/text/zwa/zwa.settings.md (Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release)
