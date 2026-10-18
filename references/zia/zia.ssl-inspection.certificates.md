For inspection to work without browser warnings the client has to trust whatever signs the leaf certificate. {{central-authority}} {{per-request-certificates}} So the real question is who is in the chain and where it is installed. {{root-must-be-trusted}}

**Which CA.** {{ca-options}} {{ca-choice-not-a-match-criterion}} {{override-intermediate}}
**Key custody and storage.** {{hsm}} {{in-memory}}

**Where the root must be installed.** {{own-trust-stores}} {{own-trust-store-remedies}} {{chromeos}}

**Mobile devices and servers.** {{mobile-mdm}} {{servers-deferred}}

The specific commands for each toolchain are open {{gap:toolchain-trust-mechanisms}}. Traffic that never accepts the root at all (pinned apps, IoT, guest networks) is in [[zia.ssl-inspection.uninspectable]]; the settings that govern what a rule does with a bad upstream certificate are in [[zia.ssl-inspection.actions]].
