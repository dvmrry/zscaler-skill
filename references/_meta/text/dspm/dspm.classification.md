# DSPM Data Classification Settings: synced DLP engines, the sensitivity setting and document categories (dspm.classification)
Also called: dspm data classification settings; dspm sensitivity setting; dspm dlp engines; dspm document categories; dspm predefined dlp engines

DSPM classification uses DLP engines and dictionaries synced from Internet & SaaS (ZIA); the DLP engines can only be viewed in the Admin Console and can be modified in Internet & SaaS with the necessary permissions. [dspm.classification:engines-synced-from-zia] Only DLP engines assigned to the DSPM channel in Internet & SaaS (ZIA) are displayed and available for selection in DSPM. [dspm.classification:dspm-channel-filter] The engine channels are in [The DLP Engines page shows, per engine, the channels associated with it; the captured row names Network Share, Personal Cloud Storage, Printing, or Removable Storage, and also Endpoint DLP, SaaS Security, DSPM, Inline Web, and Email DLP.](kb:zia.dlp.engines:engine-channels).

**Settings page.** The Data Classification Settings page lists synced engines with Engine Type (Predefined or Custom), Enabled (whether evaluation is enabled) and Sensitive (the sensitivity setting). [dspm.classification:settings-columns] By default, the sensitivity setting is enabled for all DLP engines. [dspm.classification:sensitivity-default] If the sensitivity setting is disabled for all DLP engines, any new engine added in Internet & SaaS is not automatically synced with DSPM and its sensitivity setting must be enabled manually in the Zscaler Admin Console. [dspm.classification:sensitivity-disable-all] DSPM's documented examples of sensitivity: high for PII or credit card numbers, moderate for email addresses, low for data with nothing sensitive or confidential. [dspm.classification:sensitivity-levels]

**Engines and dictionaries.** A DLP engine is a collection of one or more DLP dictionaries, and the service provides predefined DLP engines and supports custom DLP engines. [dspm.classification:engine-definition] The predefined DLP engines page lists engines whose names end in predefined, e.g. Credit Cards (detects credit card numbers) and Social Security Numbers (US). [dspm.classification:predefined-engines] Only two engines are quoted [gap:dspm.classification:predefined-engine-list]. The Understanding Data Classification page says DSPM uses predefined DLP engines and dictionaries for data classification. [dspm.classification:uses-predefined] The settings page lists Predefined or Custom engine types [gap:dspm.classification:predefined-or-custom].

**Document categories.** The DLP engine running in DSPM classifies each document with ML categories DMV, Financial, HR, Immigration, Insurance, Legal, Medical, Medical Imaging, Real Estate, Source Code and Technical, each with subcategories. [dspm.classification:document-categories] Classification as a scan feature is in [Data is classified with Zscaler's DLP engines and dictionaries, through full, incremental, historical or sampling scans.](kb:dspm.scanning:classification).

What to check:
1. Whether a classification statement comes from the Understanding Data Classification page (predefined engines and dictionaries) or from the settings page (Predefined or Custom engine types).

Not known (open gaps):
- Whether DSPM classifies with predefined engines only or custom engines too [gap:dspm.classification:predefined-or-custom]: settled by lab-test or source-read
- The full predefined DLP engine list [gap:dspm.classification:predefined-engine-list]: settled by source-read

Area: dspm.classification, its subjects in references/_meta/spine/dspm/dspm.classification.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/dspm/dspm.scanning.md (How DSPM scans: onboarding scope, the in-account orchestrator, data stores, authentication, classification and data residency)
- links-to references/_meta/text/zia/zia.dlp.engines.md (DLP engines: the unit a rule references)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/dspm/dspm.overview.md (Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated)
- see-also references/_meta/text/dspm/dspm.inventory.md (What the DSPM Resource, Data and Identity Inventory pages show, and how posture states and risk are defined)
