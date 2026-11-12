# Listing enrolled devices: page size and how each SDK pages (zcc.devices.listing)
Also called: getDevices; list_devices; zcc devices GetAll; only 50 devices returned; device list incomplete; zcc device pagination

The device list is paged, and the two SDKs page it differently. A device missing from a list read is not evidence that it is not enrolled until the read is known to be complete.

**The API.** The page parameters and their defaults are [The device list takes `page` (default 1) and `pageSize`, which defaults to 50 with a maximum of 5000, and filters by `username` and `osType`.](kb:zcc.api.devices-wire:api-page-size).

**Go.** The Go `devices.GetAll` always requests pages of 1000 starting at page 1 and stops at the first page with fewer than 1000 devices; the caller cannot change the page size. [zcc.devices.listing:go-getall] Whether a page can come back shorter than requested before the end is open [gap:zcc.devices.listing:short-page-before-end]. The general consequence of a truncated list read is in [When one of these helpers returns a truncated list without an error, an object that exists but sits beyond the returned part is absent from the result, and a caller that searches the result for it gets the same outcome as for an object that does not exist.](kb:shared.sdk-go.list-pagination:truncated-list-reads-as-absent-object).

**Python.** The Python `list_devices` makes one request with the caller's parameters and returns that response's page; with no page size given it lets the API use its default of 50. A given size is sent as given; the SDK clamps it to 1 through 5000 only for the limit its response object uses to decide whether there is a next page. [zcc.devices.listing:python-one-page]

What to check:
1. For a Python read, whether the caller walked every page, since one call returns one page of 50 by default.
2. For a Go read, whether the count is a multiple of 1000 or ended on a short page that could be a server cap.

Not known (open gaps):
- Whether the device list can return a short page before the last one [gap:zcc.devices.listing:short-page-before-end]: settled by tenant-data. Blocks: trusting a Go device count as complete

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zcc/zcc.api.devices-wire.md (ZCC device endpoints on the wire: removal, CSV downloads, OTPs and app profile passwords)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.devices.md (ZCC enrolled devices)
