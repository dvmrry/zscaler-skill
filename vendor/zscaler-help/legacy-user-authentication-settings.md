# User Authentication Settings

**Source:** https://help.zscaler.com/legacy-apis/user-authentication-settings
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

This reference page covers the `/authSettings/exemptedUrls` endpoint — URLs exempted from cookie authentication.

## GET /authSettings/exemptedUrls

Gets a list of URLs that were exempted from cookie authentication (`/zia/about-zscaler-cookies`). To learn more, see URL Format Guidelines (`/zia/url-format-guidelines`).

Parameters: No parameters

Model - Urls:
- urls (array[string]): Domains or URLs which are exempted from SSL Inspection

Responses:
- Code 200: Successful Operation

Example Value:
```json
{ "urls": [ "string" ] }
```

## POST /authSettings/exemptedUrls

Adds a URL to or removes a URL from the cookie authentication exempt list. To add a URL to the list, set the action parameter to `ADD_TO_LIST`. To remove a URL, set action to `REMOVE_FROM_LIST`.

Parameters:
- action *required (string, query): The action applied to the exempted URLs list (i.e., adding a URL or removing a URL). Available values: `ADD_TO_LIST`, `REMOVE_FROM_LIST`

Model - Urls:
- urls (array[string]): Domains or URLs which are exempted from SSL Inspection

Responses:
- Code 200: Successful Operation

Example Value:
```json
{ "urls": [ "string" ] }
```

**Note:** Compare with `Authentication Settings` (`/legacy-apis/authentication-settings`) which covers the main `/authSettings` GET/PUT and `/authSettings/lite` endpoints — the global authentication settings object rather than the exempted URL list.
