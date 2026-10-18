The legacy custom IPS signature endpoints have wire rules that the SDK source records only in comments. Export and validate work as described below; import is disabled in the SDK and unconfirmed.

**Export.** {{export-request-no-csv-type}} {{export-response-raw-csv}}

**Validate.** {{validate-body-wrapped}} {{validate-http-signaling}}

**Import.** {{import-disabled}} {{import-csv-format}} {{import-multipart-guess}} Whether it works today is open {{gap:import-wire-unconfirmed}}. The same file also describes export as broken and as live {{divergence:export-broken-note-vs-live-function}}.

**Python.** {{python-create-preflight}} {{python-update-no-preflight}}

**Categories.** {{categories-go-all-pages-python-one-page}}

Custom signatures versus IPS policy rules: [[zia.firewall.ips]].
