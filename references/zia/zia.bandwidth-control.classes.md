A bandwidth class is the matcher that Bandwidth Control rules point at. {{purpose}} A rule never matches a URL or application directly; if traffic is not in a class that a rule references, that rule does not shape it ([[zia.bandwidth-control.rules]]).

**Custom classes.** {{custom-matchers}} The Domains field takes URLs. Domain counts are capped: see [[zia.bandwidth-control.limits]]. The URL categories picked here resolve the usual way ([[zia.url-categories.membership]]).

**The four tabs.** {{four-tabs}} Only the Cloud Applications tab is where classes are created.

**Predefined classes.** {{predefined-cloud-apps}} {{general-surfing}} Which items each predefined class contains is not captured; see the gap.

**Large Files, VoIP and Web Conferencing.** {{large-files}} {{voip-webconf-apps}} In the API these plausibly correspond to typed classes of the same object, with eight predefined type values; no source states that mapping (see [[zia.bandwidth-control.api-surface]], claim types-match-predefined).

**Activation.** {{save-then-activate}} The staged-versus-live activation gate is described in the legacy doc `references/shared/activation.md`, which is not yet a subject.

What to check: which tab the class lives on, whether the class is actually referenced by a rule (an unreferenced custom class falls into the default rule: [[zia.bandwidth-control.default-rule]]), and whether the change was activated.
