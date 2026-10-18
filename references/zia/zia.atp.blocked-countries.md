A site blocked "from the wrong place" is usually about where the server is, not where the user is.

{{web-server-location}} {{not-user-location}}

An exception overrides it. {{allowlist-overrides}} See [[zia.atp.security-exceptions]].

**In the API.** {{wire-values}}

The check runs after Security Exceptions and before IPS signature detection: [[zia.atp.enforcement-order]].

What to check: the destination server's country (not the user's), whether the country is selected, whether the URL is in Security Exceptions, and the log's evidence in [[zia.atp.block-diagnosis]].
