Tenant-wide settings change URL Filtering outcomes without any rule changing. Check them when a rule "should" have fired and did not.

Uncategorized traffic has two layers. {{misc-unknown}} {{nrod-definition}} {{nrod-lookup-prerequisite}} A rule on NROD silently matches nothing until the lookup is enabled.

Two settings decide what URL is judged. {{embedded-sites}} {{aiml-redirect}} The redirect case is the counter-intuitive one: a block on the category does not stop a redirecting response.

Some settings exclude each other or interact with bypasses. {{cipa-exclusive}} {{global-ssl-bypass-evaluation}} For how SSL inspection decides what URL Filtering sees at all, see [[zia.ssl-inspection.pipeline]].

{{genai-prompts}}

Writing these settings through automation has a trap. {{go-full-state-write}}
