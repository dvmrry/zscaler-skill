For inspection to work without browser warnings the client has to trust whatever signs the leaf certificate. {{central-authority}} {{per-request-certificates}} So the real question is who is in the chain and where it is installed. {{root-must-be-trusted}}

**Which CA.** {{ca-options}} Neither choice changes how rules match. {{override-intermediate}} The key-custody and privacy objections are answered separately. {{hsm}} {{in-memory}}

**Where the root must be installed.** The operating system store is only the first place. {{own-trust-stores}} {{own-trust-store-remedies}} {{chromeos}}

Two populations are deployed differently. {{mobile-mdm}} {{servers-deferred}}

The specific commands for each toolchain are not in the captured sources: see the open gap `toolchain-trust-mechanisms`; do not improvise them from memory. Traffic that never accepts the root at all (pinned apps, IoT, guest networks) is in [[zia.ssl-inspection.uninspectable]]; the settings that govern what a rule does with a bad upstream certificate are in [[zia.ssl-inspection.actions]].
