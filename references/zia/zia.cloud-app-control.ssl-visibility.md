CAC and SSL inspection interact in two ways: what CAC sees, and which settings turn off interception for a whole vendor's destinations. The general pipeline is in [[zia.ssl-inspection.pipeline]]; this page covers what matters to CAC rules.

**Settings that turn off interception for whole vendors.** {{one-click-m365}} {{one-click-ucaas}} {{o365-optimize-bypass}}

**What that does to CAC.** {{domain-level-only-when-not-decrypted}} How CAC maps requests to applications on shared hostnames is open [[zia.cloud-app-control.rule-criteria:app-identity]].
