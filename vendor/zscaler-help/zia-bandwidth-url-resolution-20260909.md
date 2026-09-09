SCOPE: URL resolution and plain-reader behavior for the two Configuring Bandwidth Classes URLs.
**Captured:** 2026-09-09T16:25:47.853Z browser body; 2026-09-09T16:25:56Z HTTP response headers/body probe.

REQUESTED-URL: https://help.zscaler.com/zia/adding-bandwidth-classes
BROWSER INITIAL OBSERVATION: newly created Chrome tab initially reported URL/title "https://help.zscaler.com/zia/adding-bandwidth-classes" / "help.zscaler.com/zia/adding-bandwidth-classes" while the cookie shell was loading.
BROWSER LOADED OBSERVATION: after client rendering, browser URL became https://help.zscaler.com/zia/Configuring-bandwidth-classes; document.title became "Configuring Bandwidth Classes | Zscaler"; canonical link became https://help.zscaler.com/zia/Configuring-bandwidth-classes.
BROWSER BODY RESULT: same rendered article body as the direct capital-C URL; see zia-configuring-bandwidth-classes-20260909.md.

REQUESTED-URL: https://help.zscaler.com/zia/Configuring-bandwidth-classes
BROWSER LOADED OBSERVATION: browser URL remained https://help.zscaler.com/zia/Configuring-bandwidth-classes; document.title was "Configuring Bandwidth Classes | Zscaler"; canonical link was https://help.zscaler.com/zia/Configuring-bandwidth-classes.
BROWSER BODY RESULT: same rendered article body as the lowercase requested URL; see zia-configuring-bandwidth-classes-20260909.md.

HTTP PROBE (curl -L -o /dev/null -w): all six requested URLs returned HTTP 200 and content type text/html; charset=utf-8; each downloaded 1890 bytes. For the lowercase adding URL, url_effective remained https://help.zscaler.com/zia/adding-bandwidth-classes. Thus no HTTP 3xx Location redirect was observed; the capital-C resolution is client-side application routing after the server returns the JavaScript shell.

HTTP RESPONSE HEADERS (lowercase adding URL): HTTP/2 200; server CloudFront; content-length 1890; date Wed, 09 Sep 2026 16:25:56 GMT; cache-control public, s-maxage=31536000, max-age=0, must-revalidate.

PLAIN-READER RESULT: web text extraction of the requested Help pages returned only "If you're seeing this message, that means JavaScript has been disabled on your browser, please enable JS to make this app work." The browser-rendered captures in this directory are therefore the required body evidence; do not treat the one-line plain-reader shell as article content.
