Reading or writing ATP through the API has three endpoints and several traps. {{endpoints}}

**Shape.** {{settings-shape}} Console-toggle-to-key pairs are in [[zia.atp.categories]].

**Two naming traps.** {{misspelled-file-format-key}} {{cookie-stealing-pcap-key}}

**Writing.** {{put-replaces-whole-object}} The denylist is not a whole-object write: [[zia.atp.blocked-urls]]. The allowlist is: [[zia.atp.security-exceptions]]. {{writes-staged}}

Malware Protection uses a different shape: [[zia.malware-protection.api-surface]]. Provider behavior for the denylist resource is in [[zia.terraform.multi-step-writes]]; read-error handling is in [[zia.terraform.error-handling]]; SDK encoding defects are in [[zia.sdk-go.write-encoding]].

What to check: fetch the whole object, change keys by their wire names (including the misspelled one), send it back whole, then re-read.
