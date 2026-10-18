ZIA's URL entry syntax looks like other products' and behaves differently, which is why intuitive answers go wrong here.

The wildcard is a leading period, not an asterisk. {{leading-period-wildcard}} {{asterisk-invalid}} When someone asks about `*.example.com`, translate it to `.example.com` first and answer for that, and say you translated it. Note that the wildcard form also covers the bare domain, which is the opposite of what most people expect from `*.example.com`.

Without the leading period, an entry is exact at the host level. {{exact-form}} To the right of the host, matching is always implicit, so ports, paths, and query strings never need their own syntax. {{right-side-implicit}} Paths have their own exact-versus-descendants switch. {{trailing-slash}} {{scheme-not-matched}}

These forms also rank against each other when one URL matches entries in different categories. {{exact-beats-wildcard}} That ranking feeds category membership: see [[zia.url-categories.membership]].

Two things remain unknown. "Up to 5 subdomain levels deep" does not say whether level 5 itself is covered, so a 5-level subdomain under a wildcard is undecidable from the documentation. Asterisk entries are documented as invalid, yet operators report the console saving them; until that is tested, reason about any asterisk entry as its leading-period equivalent and say that its real behavior is unverified. Format rules that reject entries outright are in [[zia.url-categories.entry-format]].
