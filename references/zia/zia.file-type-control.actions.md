What happens to a file that matches a rule, and what happens when no rule matches.

With no matching rule the answer is allow: {{default-allow-all}} Rules are therefore opt-in restrictions, and a disabled rule restricts nothing: {{disabled-rules-hold-order}}

When a rule matches: {{actions}} {{browser-notification-template}} {{operation}} {{capture-on-block}}

Two things are not documented and should be tested before relying on them: Caution for traffic with no user to acknowledge (see gap `caution-without-a-user`), and the fate of unscannable or unknown files that no rule names (see gap `unscannable-and-unknown-default`).

FTP Control has no action selector of its own (see [[zia.ftp-control.settings]]); a File Type Control rule reaches FTP files through its protocol criterion. How the criteria decide a match is in [[zia.file-type-control.criteria]], and where File Type Control sits relative to DLP and scanning is in [[zia.file-type-control.pipeline]].
