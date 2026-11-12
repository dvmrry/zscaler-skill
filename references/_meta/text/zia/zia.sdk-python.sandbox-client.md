# How the Python SDK reaches the sandbox submission host (zia.sdk-python.sandbox-client)
Also called: zscsb sandbox token; sandboxCloud csbapi; ZSCALER_SANDBOX_TOKEN; submit_file sandbox python; sandbox submit missing token

This is the Python SDK's route for sandbox file submission, which is separate from the ZIA API calls it also makes. The route's status on a tenant is in [Submitting files to Sandbox and out-of-band inspection (Discan)](kb:zia.sandbox.submission).

**Credentials and host.** For any endpoint containing `/zscsb` the Python executor requires `sandboxToken` in the client config, raising ValueError if it is missing, and adds it as the `api_token` query parameter. [zia.sdk-python.sandbox-client:zscsb-token-query-param] Requests to `/zscsb` go to `https://csbapi.{sandboxCloud}.net`, with the cloud name taken lower-cased from the `sandboxCloud` setting. [zia.sdk-python.sandbox-client:zscsb-host] The Python README names `ZSCALER_SANDBOX_TOKEN` and `ZSCALER_SANDBOX_CLOUD` as the environment variables for `sandboxToken` and `sandboxCloud`. [zia.sdk-python.sandbox-client:sandbox-env-names] The OneAPI client accepts a sandbox token in place of a client ID and of a client secret or private key. [zia.sdk-python.sandbox-client:token-alone-builds-client]

**What is sent.** `submit_file` sends the file bytes with `application/octet-stream` and a `force` query value of 1 or 0, while `submit_file_for_inspection` sets the content type from the file extension and falls back to `application/octet-stream`. [zia.sdk-python.sandbox-client:submit-content-types]

What to check:
1. Whether the sandbox token and sandbox cloud are both set on the client, since submission uses neither the ZIA API host nor the OAuth token.
2. What content type the file was sent under when the verdict looks wrong.

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sandbox.submission.md (Submitting files to Sandbox and out-of-band inspection (Discan))

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.sandbox.md5-blocklist.md (Sandbox custom MD5 hash list)
