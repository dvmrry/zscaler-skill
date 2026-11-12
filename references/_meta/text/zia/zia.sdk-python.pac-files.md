# How the SDKs call the PAC file endpoints: clone, validate and version actions (zia.sdk-python.pac-files)
Also called: pac clone 400 resource not found; pac file version action; pac commit message corrupted; clone_pac_file; update_pac_file commit message; validate pac file raw body

These are claims about how the Python and Go SDKs call the PAC file endpoints, not about PAC behavior in the service. The product model is in [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac).

**Reads.** `get_pac_file` reads `/pacFiles/{id}/version`, and its docstring says it retrieves all versions of a PAC file for the ID; `get_pac_file_version` reads one version. [zia.sdk-python.pac-files:get-returns-all-versions]

**Cloning a version.** `clone_pac_file` has fixed arguments rather than `**kwargs`. The SDK's docstring says the clone endpoint takes only version-level fields, and that sending parent fields such as name or domain, or `pacVersion`, in the body makes the API answer 400 RESOURCE_NOT_FOUND instead of an input error. [zia.sdk-python.pac-files:clone-strict-signature] The SDK's docstring says the clone request must be made against committed state: a parent created in the same session must be activated first, or the clone fails with the same 400 RESOURCE_NOT_FOUND. [zia.sdk-python.pac-files:clone-needs-committed-parent] At 10 existing versions `clone_pac_file` adds `deleteVersion` to the URL, using the caller's `delete_version` or else the lowest existing version number. [zia.sdk-python.pac-files:clone-evicts-oldest-at-cap]

**Create and validation.** `add_pac_file` requires `pac_content`, runs `validate_pac_file` on it before the POST, and raises an exception instead of returning an error value when the content is missing or fails validation. [zia.sdk-python.pac-files:add-validates-and-raises] `validate_pac_file` sends the PAC source as the raw request body, dedented and stripped of leading line breaks, and the request executor special-cases `/pacFiles/validate` so the body goes out as data without JSON conversion. [zia.sdk-python.pac-files:validate-raw-body]

**Version actions.** Python's `update_pac_file` puts the action in the path and sends the remaining keyword arguments, including `pac_commit_message`, as a dictionary body that the executor sends as JSON. [zia.sdk-python.pac-files:python-action-body-is-object] Go's `UpdatePacFile` takes a `commitMessage` string and, when it is not empty, sends it as the raw request body. Its doc comment says the endpoint expects the commit message as the raw request body (not a JSON object) and that sending a serialized object corrupts the version's stored commit message. [zia.sdk-python.pac-files:go-action-body-is-raw-commit-message] The Automate OpenAPI capture lists the PAC version action as the operation 'Pac Resource Update Pac Version Flag' with path parameters and an optional newLKGVer query parameter, and the operation carries no requestBody member. [zia.sdk-python.pac-files:automate-action-operation] Which form the service accepts is open [gap:zia.sdk-python.pac-files:action-body-contract].

The sources disagree on that body [zia.traffic-forwarding.pac:version-action-body](kb:zia.traffic-forwarding.pac:version-action-body).

What to check:
1. Which SDK performed a PAC version action, and whether the commit message read back after it matches what was sent.
2. Whether a clone that returned 400 RESOURCE_NOT_FOUND followed an activation of the parent, and whether parent fields were in the body.
3. How many versions the PAC file already holds before a clone.
4. Whether a failed create was an exception from content validation rather than an API error.

Not known (open gaps):
- What the PAC version-action endpoint accepts as a request body [gap:zia.sdk-python.pac-files:action-body-contract]: settled by lab-test. Blocks: saying whether the Python object body or the Go raw commit message is the correct write, and what commit message ends up stored

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)
