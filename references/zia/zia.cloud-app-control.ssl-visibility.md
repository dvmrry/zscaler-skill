CAC and SSL inspection interact in two ways: what CAC sees, and which settings quietly stop inspection for a whole category of apps. The general pipeline is in [[zia.ssl-inspection.pipeline]]; this page covers what matters to CAC rules.

**Settings that turn off interception for whole vendors.** {{one-click-m365}} {{one-click-ucaas}} {{o365-optimize-bypass}} When a CAC rule on one of these apps does not behave as configured, check these settings before the rule.

**What that does to CAC.** {{domain-level-only-when-not-decrypted}} In particular, granular actions are defined on what a user does inside the application, so confirm decryption before promising them: the AI/ML rule page says granular actions need SSL/TLS Inspection ([[zia.cloud-app-control.ai-ml-rules]]). How CAC maps requests to applications on shared hostnames remains undocumented: [[zia.cloud-app-control.rule-criteria]].
