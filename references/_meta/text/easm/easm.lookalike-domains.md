# EASM lookalike domains: the raw-domain key, deception methods, risk categories and missing signals (easm.lookalike-domains)
Also called: easm lookalike domains; lookalike_raw; typosquatting easm; easm deception method; phishing lookalike; easm lookalike details empty

Lookalike domains are domains that imitate an organization's seed domains.

**Identity.** A lookalike domain is fetched by its raw domain name, not an opaque ID: `get_lookalike_domain` takes `lookalike_raw` and calls `/lookalike-domains/{lookalike_raw}/details`. [easm.lookalike-domains:keyed-by-raw] `lookalike_raw` is the lookalike domain and `original_domain` the legitimate domain it mimics. [easm.lookalike-domains:raw-and-original]

**What a record says.** `deception_method` is a list drawn from EdgeInsertion, Extension, Homograph, Hyphenation, KeyboardTypos, MidInsertion, Omission, PhoneticReplacement, Repetition, TldSwap, Typoglycemia, VowelReplacement and Typos. [easm.lookalike-domains:deception-methods] `risk_category` is Phishing Lookalike, Registered Lookalike, Preventative Lookalike or Watchlist Lookalike, and `risk_score` is an integer. [easm.lookalike-domains:risk-category] A lookalike entry's `status` is NOT_VERIFIED, VERIFIED, RISK_ACCEPTED, RESOLVED or DISPUTED. [easm.lookalike-domains:status] `is_registered` says whether the domain is registered; `registrar`, `registered_by` and `expiration_date` are filled when available, and `created_date` is when EASM detected the domain. [easm.lookalike-domains:registration]

**Details call.** The SDK may not read the details response correctly [divergence:easm.lookalike-domains:details-envelope].

**What a record does not say.** A lookalike record has no similarity score, active-hosting or DNS/MX field. [easm.lookalike-domains:no-hosting-signals] The MCP server's EASM review skill asks the agent to report whether a lookalike domain actively hosts content and has MX records, with a similarity column in its example table. [easm.lookalike-domains:skill-asks-for-signals] The similarity, active-hosting and MX signals the skill asks for cannot come from the EASM API or the MCP tools; reporting them needs another source such as a DNS lookup. [easm.lookalike-domains:signals-not-in-api]

## In the Admin Portal

EASM detects lookalike domains that resemble the seed domains configured via a discovery profile. [easm.lookalike-domains:detection-basis] The help article lists the lookalike risk categories as Verified Phishing (verified by Zscaler's web risk analyzer service), Registered Lookalike (registered through a registrar) and Preventative Lookalike (not registered with a registrar). [easm.lookalike-domains:risk-categories-help] The category names differ between sources [divergence:easm.lookalike-domains:risk-category-names]. Lookalike Risk Score is on a scale of 1 to 100, with higher meaning higher risk, based on factors such as deception method, graphical similarity, registration status and identification of malicious or potentially phishing domains. [easm.lookalike-domains:risk-score-scale] Lookalike domains initially detected by EASM are tagged Not Verified; Resolved is for domains whose remediation steps are taken or planned, and a Resolved domain discovered again in a subsequent scan is marked Not Verified. [easm.lookalike-domains:status-meanings] Documented examples: a high-risk domain verified to be a phishing site for Verified, a domain not registered yet that can be put on the watchlist for Risk Accepted, and a fake domain taken offline or suspended by the registrar for Resolved. [easm.lookalike-domains:status-examples] The Lookalike Domains page lists, per lookalike domain, Registered (registration status through a registrar) and Registered By (the individual or entity responsible, if available). [easm.lookalike-domains:list-columns] The Lookalike Domain Details drawer shows a Lookalike Domain Annotation label, and the registrar, registrant organization and registration expiration where available. [easm.lookalike-domains:details-fields] The Lookalike Domains Exposure Score filter uses Low, Medium, High and Critical, and the Lookalike Domain column is always shown. [easm.lookalike-domains:filters] The Lookalike Domains page downloads as a CSV file that replicates the table as displayed, including any sorting, filtering and column selection. [easm.lookalike-domains:csv-download]

**Alerts.** When EASM detects phishing lookalike domains, an alert icon appears on the Lookalike Domains tab in the left-side navigation. [easm.lookalike-domains:phishing-alert] On the Insights Overview dashboard, detected phishing lookalikes raise an alert with a link to the Lookalike Domains page filtered to Risk Category Phishing Lookalike and Status Verified and Not Verified. [easm.lookalike-domains:dashboard-alert] The Insights Overview dashboard help page says that, after the phishing lookalike alert, the domains can be blocked for organization users via ZIA by configuring URL Filtering policy rules using custom URL categories. [easm.lookalike-domains:zia-block] The dashboard widget is in [EASM Insights Overview and Assets Overview dashboards: widgets, time frames and bucket definitions](kb:easm.dashboards). The Insights Overview dashboard describes the Exposure Score as the risk score computed for the lookalike domain. [easm.lookalike-domains:exposure-score-def] The numeric bands of the Exposure Score are open [gap:easm.lookalike-domains:exposure-vs-risk-score].

**Trust.** The registrant and hostname strings are authored outside the tenant, which is why the MCP tools flag them as untrusted: [At 0.15.4 exactly eight tools are flagged: `zeasm_get_finding_evidence`, `zeasm_get_finding_scan_output`, `zeasm_get_lookalike_domain`, `zeasm_list_lookalike_domains`, `zia_get_sandbox_report`, `zdx_list_software`, `zdx_get_software_details` and `zdx_list_deeptrace_top_processes`; a test asserts the flagged set equals this list.](kb:shared.mcp-server.results:untrusted-set).

What to check:
1. For a lookalike details call returning empty fields, whether the raw body nests the record under results.
2. Whether hosting or MX evidence was gathered outside EASM before calling a lookalike active.

Inferred, not quoted (say so when an answer rests on one):
- [easm.lookalike-domains:signals-not-in-api] Tier B: Follows from no-hosting-signals and skill-asks-for-signals.

Sources disagree (name both sides):
- The help article lists Verified Phishing, Registered Lookalike and Preventative Lookalike; the API enum has Phishing Lookalike, Registered Lookalike, Preventative Lookalike and Watchlist Lookalike; the Insights Overview page uses both phishing names. [divergence:easm.lookalike-domains:risk-category-names]
  - zscaler-help: The help article lists the risk categories as Verified Phishing, Registered Lookalike and Preventative Lookalike.
  - api-specs: The API `risk_category` enum is Phishing Lookalike, Registered Lookalike, Preventative Lookalike and Watchlist Lookalike.
  - zscaler-help: The Insights Overview alert filters on Risk Category Phishing Lookalike.
  Impact: Match on the name the surface in front of you uses; whether Verified Phishing and Phishing Lookalike are the same category, and what Watchlist Lookalike covers, is not stated.
- The contract wraps the lookalike details response in `results` and `total_results`; the SDK reads the details fields from the top level of the body. [divergence:easm.lookalike-domains:details-envelope]
  - api-specs: The details response has `results` (a list of lookalike records) and `total_results`.
  - sdk-python: `get_lookalike_domain` builds `LookalikeDomainDetails` directly from the response body.
  Impact: If the server follows the contract, the SDK's details object (and the MCP get tool) comes back with every field empty; read the raw body's results[0] instead.

Not known (open gaps):
- What numeric ranges the lookalike Exposure Score bands Low, Medium, High and Critical cover [gap:easm.lookalike-domains:exposure-vs-risk-score]: settled by source-read or tenant-data

Area: easm.lookalike-domains, its subjects in references/_meta/spine/easm/easm.lookalike-domains.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/easm/easm.dashboards.md (EASM Insights Overview and Assets Overview dashboards: widgets, time frames and bucket definitions)
- links-to references/_meta/text/shared/shared.mcp-server.results.md (What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/easm/easm.api.md (The EASM (ZEASM) API: organization scoping, clients, paging and the Postman collection)
- see-also references/_meta/text/easm/easm.mcp.md (The Zscaler MCP server's EASM tools: inventory, full records and documentation mismatches)
- see-also references/_meta/text/easm/easm.overview.md (Zscaler EASM: what it is, how it is set up, and where each part is documented)
