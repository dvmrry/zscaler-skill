# How the ZIA Ansible collection updates a custom URL category (zia.ansible.url-categories)
Also called: zia_url_categories ansible; ansible REMOVE_FROM_LIST 400; ziacloud ansible url category remove urls fails; Request body is invalid url category ansible

This covers the `zia_url_categories` module of the ZIA Ansible collection. The Terraform provider's equivalent path is in [Terraform custom and predefined URL category resources](kb:zia.terraform.url-categories).

**Update path.** On update, the module compares the current and desired `urls` and `db_categorized_urls` lists and, when either list has additions or removals, sends the removals as a REMOVE_FROM_LIST call and the additions as an ADD_TO_LIST call, adding or removing only the diff rather than replacing the entire list. [zia.ansible.url-categories:incremental-diff] The REMOVE_FROM_LIST payload is a copy of the module's whole desired category in which `urls` and `db_categorized_urls` hold only the entries to remove, or are dropped when there are none to remove, so the other category fields travel with the call. [zia.ansible.url-categories:remove-payload-shape]

**Reported failure.** Collection issue #134, still open, reports that from collection 2.1.0 a `zia_url_categories` task with `state: present` that has to remove URLs fails because the REMOVE_FROM_LIST call returns HTTP 400 `Request body is invalid.`, leaving the stale URLs on the category. The reporter says the same pattern worked before the incremental-update change and names pinning the collection below 2.1.0 as a workaround. [zia.ansible.url-categories:issue-134-remove-rejected] Why the service rejects the body is open [gap:zia.ansible.url-categories:issue-134-cause].

Not known (open gaps):
- Why the ZIA API rejects the module's REMOVE_FROM_LIST body [gap:zia.ansible.url-categories:issue-134-cause]: settled by lab-test. Blocks: saying that a REMOVE_FROM_LIST body carrying the other category fields, or a large removal, is accepted

Area: zia.ansible, its subjects in references/_meta/spine/zia/zia.ansible.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.url-categories.md (Terraform custom and predefined URL category resources)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
