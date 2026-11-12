# Automating browser isolation: where the API surface lives across Internet & SaaS and Private Access (zbi.api)
Also called: zbi api; cbi api; browser isolation api; isolation profile api; cbiconfig; cbizpaprofile; isolationprofile; zero trust browser sdk; browser isolation terraform; browser isolation ansible
Former IDs: zbi-02, zbi-04

Browser isolation has no API of its own: profile lookup is an Internet & SaaS operation, profiles, banners, certificates and regions are Private Access CBI configuration operations, and isolation rules are Private Access policy rules. Paths, SDK functions and Terraform resources are generated: `node scripts/kb.mjs surface /browserIsolation/profiles` and `node scripts/kb.mjs surface cbiconfig`.

**Naming.** Python's `client.zbi` is not browser isolation: [In the Python SDK, the `zbi` service client is Zscaler Business Insights, not browser isolation.](kb:shared.terminology.product-names:zbi-is-business-insights), covered in [The Business Insights API: custom applications, report configurations and report downloads](kb:business-insights.api).

**Wire behavior.** Private Access CBI paths, list shapes and write handling are in [Cloud Browser Isolation and AppProtection API: paths, writes and version handling](kb:zpa.api.cbi-appprotection-wire), and the Go package layout in [The Go SDK nests PRA and CBI services in privilegedremoteaccess and cloudbrowserisolation package trees; the PRA portal and CBI region services use the same routes as the Python pra_portal and cbi_region modules.](kb:zpa.api.sdk-coverage:pra-cbi-layout). Internet & SaaS rule wiring of the isolate action is in [URL Filtering rule fields where the Python SDK, Terraform provider and help disagree](kb:zia.api.url-filtering-wire).

**Two profile lists.** The Private Access contract has two documented profile lists: `Get All ZPA Profiles` under the CBI configuration path, whose entries carry `cbiProfileId` and `cbiUrl`, and `Get Profiles For Customer` under the management configuration path, a paged list whose entries carry `isolationProfileId` and `isolationUrl`; both accept `showDisabled`. [zbi.api:two-profile-lists] Which one an isolation rule's profile ID refers to, and whether the two can disagree, is open [gap:zbi.api:profile-list-choice].

**Fields.** Which API field carries each console setting is open [gap:zbi.api:feature-field-mapping], and the full value sets of the copy-paste and upload-download controls are open [gap:zbi.api:control-value-sets].

**Postman and Ansible.** The OneAPI Postman collection has isolation banner and certificate management folders, with requests to add, list, get and delete CBI banners and certificates, a Browser Isolation request that reads the Cloud Browser Isolation profiles, and a browser control settings request that updates Smart Isolation. [zbi.api:postman-requests] In the Ansible collections, the Internet & SaaS module for isolation profiles only lists them and filters by ID or name in memory, and the Private Access modules write CBI banners and certificates and isolation rules (v1 and v2) but only read CBI and isolation profiles. [zbi.api:ansible-coverage]

The provider documentation lists the copy-paste and upload-download values: The Terraform provider's documentation for the Private Access CBI profile lists the supported `copy_paste` values as `none` or `all`, and the supported `upload_download` values as `none`, `all` or `upstream`. [zbi.api:tf-control-values]

What the provider documents for individual fields: The Terraform provider's documentation for the Private Access CBI profile describes `allow_printing` as letting the user print pages rendered in the isolation browser, `restrict_keystrokes` as preventing keyboard and text input to isolated pages, `document_viewer` as viewing Microsoft Office files in isolation, `session_persistence` as saving user cookies between sessions, `watermark` as a custom watermark on isolated pages, `deep_link` as applications allowed to launch outside the isolation session, and `debug_mode` as allowing isolation sessions to start in debug mode. [zbi.api:tf-field-descriptions]

What to check:
1. Whether a script that says zbi is calling Business Insights instead of isolation endpoints.
2. Which of the two Private Access profile lists an isolation rule's profile ID was read from.

Inferred, not quoted (say so when an answer rests on one):
- [zbi.api:ansible-coverage] Tier B: Rests on the module file listing at the pins: the isolation-related modules are zia_cloud_browser_isolation_profile_info in ziacloud-ansible and, in zpacloud-ansible, zpa_cloud_browser_isolation_banner, _banner_info, _certificate, _certificate_info, _profile_info, zpa_isolation_profile_info and zpa_policy_access_isolation_rule and _v2; no module name or call writes a CBI profile.

Not known (open gaps):
- Which Private Access profile list policy workflows should use, and whether the two can diverge [gap:zbi.api:profile-list-choice]: settled by tenant-data or source-read. Blocks: choosing the right lookup when writing an isolation rule
- Which Private Access CBI profile field carries each console setting [gap:zbi.api:feature-field-mapping]: settled by source-read or lab-test. Blocks: translating a console profile setting into an API or Terraform field

Area: zbi.api, its subjects in references/_meta/spine/zbi/zbi.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/business-insights/business-insights.api.md (The Business Insights API: custom applications, report configurations and report downloads)
- links-to references/_meta/text/shared/shared.terminology.product-names.md (Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC)
- links-to references/_meta/text/zia/zia.api.url-filtering-wire.md (URL Filtering rule fields where the Python SDK, Terraform provider and help disagree)
- links-to references/_meta/text/zpa/zpa.api.cbi-appprotection-wire.md (Cloud Browser Isolation and AppProtection API: paths, writes and version handling)
- links-to references/_meta/text/zpa/zpa.api.sdk-coverage.md (Which ZPA services the Go and Python SDKs cover differently, and the Go packages behind Python-only module names)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)
