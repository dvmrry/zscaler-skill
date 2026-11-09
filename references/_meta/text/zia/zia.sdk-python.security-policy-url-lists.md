# How the Python SDK edits the security allowlist and denylist (zia.sdk-python.security-policy-url-lists)
Also called: add_urls_to_whitelist; add_urls_to_blacklist; erase_blacklist; allowlist overwritten; denylist urls python sdk; security whitelist replace

This covers how the Python SDK edits the global allowlist and denylist URL lists. It is a statement about the client; what the service stores is on the product side.

**Allowlist.** `add_urls_to_whitelist` and `delete_urls_from_whitelist` read the current allowlist, change it in the client, and write the whole list back through `replace_whitelist`, which sends a PUT to `/security` with `whitelistUrls`. [zia.sdk-python.security-policy-url-lists:allowlist-add-delete-replace-whole-list] Two allowlist changes made between one helper's read and its write can overwrite each other, since the write replaces the whole list. [zia.sdk-python.security-policy-url-lists:allowlist-write-not-atomic]

**Denylist.** `add_urls_to_blacklist` and `delete_urls_from_blacklist` send a POST to `/security/advanced/blacklistUrls` with query parameter `action` set to ADD_TO_LIST or REMOVE_FROM_LIST and body `blacklistUrls`, carrying only the given URLs rather than a list they read and rewrote; each then returns the list read back with `get_blacklist()`. [zia.sdk-python.security-policy-url-lists:denylist-add-delete-action-endpoint] `replace_blacklist` sends a PUT to `/security/advanced` with `blacklistUrls`, and `erase_blacklist` and `erase_whitelist` are the replace calls with an empty list. [zia.sdk-python.security-policy-url-lists:denylist-replace-and-erase]

What to check:
1. Which helper changed the list, since allowlist helpers rewrite the whole list and denylist helpers send one action.
2. Whether another admin or script changed the allowlist around the same time as a helper call.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-python.security-policy-url-lists:allowlist-write-not-atomic] Tier B: Holds when another change to the allowlist lands between the helper's read and its PUT; the helper code takes no lock and sends no version or precondition.

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json
