Who and what FTP Control reaches is narrower than the feature name suggests. Work through four questions.

1. **Where is the user?** {{location-scope}} Whether native FTP works for an unlocated user is open {{gap:remote-user-native-ftp}}.
2. **Which protocols?** {{ftps-supported}} Passive-only behavior and the default-deny on FTP over HTTP are held in [[zia.firewall]] (`ftp-passive-only`, `ftp-default`). Whether FTP over HTTPS needs decryption for content inspection is open: see gap `ftp-over-https-decrypt`, and check [[zia.ssl-inspection.bypass-impact]].
3. **Does URL Filtering decide first?** URL Filtering rules take precedence over FTP Control (`ftp-url-filtering-precedence` in [[zia.firewall]]). {{url-filtering-only-all-user-rules}} A user-scoped URL Filtering rule therefore never explains an FTP block; look for an all-users rule in [[zia.url-filtering.rule-order]].
4. **What scans the files?** {{files-extracted-and-scanned}} {{malware-toggles}} {{dlp-sandbox-ftc-on-extracted}} File Type Control behavior on those files is in [[zia.file-type-control]].

The settings that open FTP at all are in [[zia.ftp-control.settings]].
