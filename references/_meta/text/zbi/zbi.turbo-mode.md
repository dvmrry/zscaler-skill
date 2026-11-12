# Turbo Mode: instruction-set rendering instead of pixel streaming, and what the endpoint needs (zbi.turbo-mode)
Also called: turbo mode; pixel streaming; isolation rendering mode; webgl isolation; isolation slow; isolation frame rate; ie11 isolation

Turbo Mode changes how Cloud Browser delivers the rendered page, not what runs where. Turbo Mode is an alternative to pixel streaming that transfers rendered information from the isolated browser to the local browser as an instruction set; Zscaler describes it as much faster and much less bandwidth intensive than pixel streaming. [zbi.turbo-mode:instruction-set] Enabling Turbo Mode on an isolation profile does not change security: web content is still processed on isolation containers, only rendered content reaches the user's browser, and no code is executed locally on the device. [zbi.turbo-mode:no-local-code]

**Requirements.** Turbo Mode needs hardware acceleration enabled on the user's device with WebGL and WebGL2 support, it is not supported for Internet Explorer 11, and for Safari it requires version 18 or later. [zbi.turbo-mode:requirements] Turbo Mode is fully functional on most modern desktops and mobile devices. [zbi.turbo-mode:modern-devices]

**Benefits.** With Turbo Mode, web content renders at up to 50 frames per second, and rendering instructions are cached so that scrolling a page transfers minimal to no additional data. [zbi.turbo-mode:benefits]

**Where it is set.** Admins must enable Turbo Mode in the user's isolation profile; the page refers to the articles on creating isolation profiles for Internet & SaaS and for Private Access. [zbi.turbo-mode:per-profile] The preconfigured Miscellaneous & Unknown profile has it on: [The preconfigured profile's automatic settings are: name Misc & Unknown; Turbo Mode enabled; the recommended PAC file URL with Override PAC File disabled; Debug Mode disabled; the default Zscaler root certificate; copy and paste, file transfer and print disabled; Read-Only Isolation enabled; viewing office files in isolation, local browser rendering, application deep linking and Votiro CDR disabled; region selection All; the default isolation banner; Persist Browser Isolation URL bar disabled; Native Browser Experience; watermarking disabled; and Persistent State disabled.](kb:zbi.misc-unknown-subscription:fixed-settings). What a user on an unsupported browser gets from a profile with Turbo Mode on is open [gap:zbi.turbo-mode:unsupported-fallback].

What to check:
1. Whether Turbo Mode is enabled in the isolation profile the user's rule names.
2. Whether the endpoint has hardware acceleration with WebGL and WebGL2, and is not Internet Explorer 11.

Not known (open gaps):
- What a profile with Turbo Mode on does for a browser that cannot use it [gap:zbi.turbo-mode:unsupported-fallback]: settled by lab-test or source-read. Blocks: predicting the experience of a user without WebGL2 or hardware acceleration on a Turbo Mode profile

Area: zbi.turbo-mode, its subjects in references/_meta/spine/zbi/zbi.turbo-mode.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions): Admins must enable Turbo Mode in the user's isolation profile; the page refers to the articles on creating isolation profiles for Internet & SaaS and for Private Access. [zbi.turbo-mode:per-profile]
- links-to references/_meta/text/zbi/zbi.misc-unknown-subscription.md (The Miscellaneous & Unknown subscription: a preconfigured profile, an automatic rule and five editable settings)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)
