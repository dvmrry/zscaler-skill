# The URL Filtering and Cloud App advanced settings resource: import, field names and what an update sends (zia.terraform.url-filtering-settings)
Also called: zia_url_filtering_and_cloud_app_settings; enable_per_plexity_prompt; app_setting import; creative commons search results terraform; url filtering advanced settings terraform

This singleton resource writes every advanced URL and Cloud App setting at once. Create and update build a typed `URLAdvancedPolicySettings` value from the schema and pass it to `UpdateUrlAndAppSettings`, which PUTs the whole struct rather than a patch of changed ones. Its booleans omit `omitempty`, so a disabled setting is sent as false; the exceptions are `BlockSkype` and `SafeSearchApps`, which are tagged `omitempty`. [zia.terraform.url-filtering-settings:update-is-full-typed-put] Provider v4.8.5 fixed this resource rejecting updates with `Request body is invalid.` and being unable to turn a setting back off; updates now carry every supported setting, and `safe_search_apps` is sent only when applications are specified. [zia.terraform.url-filtering-settings:v4-8-5-fixed-turn-off]

**Import and names.** `zia_url_filtering_and_cloud_app_settings` is imported with the literal ID `app_setting`, and the importer sets the resource ID to that string. [zia.terraform.url-filtering-settings:import-id-app-setting] The Perplexity prompt-logging attribute is spelled `enable_per_plexity_prompt` in the executable schema, and the resource reads and writes it under that name. [zia.terraform.url-filtering-settings:perplexity-field-misspelled]

**Creative Commons.** The SDK field `EnableCreativeCommonsSearchResults` is tagged `json:"enableCreativeCommonsSearchResults"` with no `omitempty`. [zia.terraform.url-filtering-settings:creative-commons-field-has-no-omitempty] The provider data source declares `enable_creative_commons_search_results` as a computed attribute and sets it from the API response. [zia.terraform.url-filtering-settings:creative-commons-only-in-data-source] So an update through the resource sends `enableCreativeCommonsSearchResults=false` even though the resource schema never sets it. [zia.terraform.url-filtering-settings:creative-commons-false-serialized]

**Resource and data source differ.** The resource defines and reads back the Google AI prompt-logging attribute, while the data source defines neither the Google AI nor the QuillBot attributes. [zia.terraform.url-filtering-settings:resource-has-google-quillbot] Platform behavior of the settings themselves: [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

What a serialized false does to an enabled setting is open [What a serialized enableCreativeCommonsSearchResults:false does to an enabled setting](kb:zia.url-filtering.advanced-settings:creative-commons-backend-effect).

What to check:
1. Whether an HCL attribute uses the provider's own spelling, `enable_per_plexity_prompt`, before reporting the field missing.
2. Whether Creative Commons search results changed after an apply that never mentioned them.

Inferred, not quoted (say so when an answer rests on one):
- [zia.terraform.url-filtering-settings:creative-commons-false-serialized] Tier B: Go serializes a non-omitempty bool as false when the builder leaves it unassigned; the resource file contains no reference to the field (searched).
- [zia.terraform.url-filtering-settings:resource-has-google-quillbot] Tier B: The absence in the data source file was established by searching it for google_ai and quillbot (no matches at the pin).

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.sdk-go.write-encoding.md (How the Go SDK encodes ZIA writes (omitted zero values, empty responses))
