A bandwidth class is the matcher that Bandwidth Control rules point at. {{purpose}} A rule never matches a URL or application directly; if traffic is not in a class that a rule references, that rule does not shape it ([[zia.bandwidth-control.rules]]).

**Custom classes.** {{custom-matchers}} Domain counts are capped: see [[zia.bandwidth-control.limits]]. The URL categories picked here resolve the usual way ([[zia.url-categories.membership]]).

**The four tabs.** {{four-tabs}}

**Predefined classes.** {{predefined-cloud-apps}} {{general-surfing}} Which items each predefined class contains is not captured {{gap:predefined-membership}}.

**Large Files, VoIP and Web Conferencing.** {{large-files}} {{voip-webconf-apps}} In the API these plausibly correspond to typed classes of the same object, with eight predefined type values; no source states that mapping (see [[zia.bandwidth-control.api-surface]], claim types-match-predefined).

**Activation.** {{save-then-activate}} The staged-versus-live activation gate is described in the legacy doc [activation](../shared/activation.md), which is not yet a subject.
