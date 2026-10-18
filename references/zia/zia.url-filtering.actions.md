The five console actions are Allow, Caution, Block, Isolate, and Conditional. Allow and Block need no explanation; the other three carry prerequisites that decide whether the action can take effect at all. {{caution}} {{isolate-needs-zbi}} {{conditional-prereqs}}

Block can carry an Allow Override, and its fields are conditional in a way that fails silently. {{override-conditions}} When someone asks why their override users never get the prompt, check `action` and `blockOverride` first. {{override-unrestricted-without-inspection}} Whether a rule's action is enforceable on HTTPS at all depends on the inspection path: see [[zia.ssl-inspection.pipeline]].

Tenant data can contain values the console never shows. {{api-action-values}} {{header-insertion-custom-only}} {{quotas}}
