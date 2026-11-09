# Reading a ZIA DNS log record: naming, encodings and field caveats (zia.logs.dns-record-fields)
Also called: dns log field names; nss dns specifier vs insights column; dns log nss-only fields; feed escape character dns; dns pcapid; dns log client ip; dns log timestamp fields; dns log devicetype

Most fields have two names: the NSS format specifier used in raw feed output and the Insights Logs column. The DNS field table lists each field under an NSS format specifier and, where one exists, an Insights Logs column name, for example %s{time} as Logged Time and %s{req} as Requested Domain. [zia.logs.dns-record-fields:two-names] The DNS field table marks recordid, eedone, company and cloudname as specific to NSS in its Insights Logs column. [zia.logs.dns-record-fields:nss-only-fields] epochtime, tz, datacentercity and datacentercountry have an empty Insights Logs column in the DNS field table, so they map to no Insights Logs column. [zia.logs.dns-record-fields:epoch-no-insights]

**Time.** The seconds, minutes, hours, day, month, year and month-name and weekday fields are marked as derived from Logged Time, while time itself excludes the time zone. [zia.logs.dns-record-fields:time-derived] The tz field is the time zone specified when the NSS feed was configured. [zia.logs.dns-record-fields:tz-from-feed] How time zones behave across feeds and regions is open [Time zone with several feeds or regions](kb:zia.logs.nss-feed-format:multi-feed-timezone).

**Encoding.** The eedone field indicates whether the characters entered in the Feed Escape Character field of the NSS configuration page were hex encoded. [zia.logs.dns-record-fields:eedone-escape] Whether field presence differs by output format is open [Field presence across output formats](kb:zia.logs.nss-feed-format:format-field-presence), and so is Cloud NSS field parity [Whether VM-side format conversion drops a field](kb:zia.logs.nss-feed-format:vm-conversion-omits).

**Identity and capture.** The cip field is the IP address of the user: it can be the internal IP address when that is visible, for example traffic sent through a GRE tunnel or an internal IP address indicated using XFF, and otherwise it is the client's NATed public internet address. [zia.logs.dns-record-fields:cip-internal-or-nat] The pcapid field is the path of the packet capture (PCAP) file that captured the transaction, formatted <Company ID>/<Directory>/<PCAP File Name>, where the directory is the log type; the file is downloaded from the Capture column of the DNS Insights Logs page. [zia.logs.dns-record-fields:pcapid-format] The devicetype field lists Zscaler Client Connector, Cloud Browser isolation, VDI and IOTG as example values, and the device fields describe the Zscaler Client Connector device. [zia.logs.dns-record-fields:devicetype-values]

**Transport and categories.** The protocol field lists TCP, UDP and DoH (DNS over HTTP) as values, istcp is 1 for TCP and 0 otherwise, and http_code is the HTTP return code used in DNS over HTTPS sessions. [zia.logs.dns-record-fields:protocol-values] Encrypted DNS other than DoH is open [gap:zia.logs.dns-record-fields:dot-doq-open]. The domcat field is the category of the content of the DNS request and respipcat is the category of the content of the DNS response, shown in Insights as Request Categories and Response Categories. [zia.logs.dns-record-fields:two-categories] The ecs_slot field is the name of the EDNS Client Subnet rule applied to the transaction, shown as ECS Object Name, and ecs_prefix is the ECS prefix used in the request, a numeric string such as 192.168.0.0. [zia.logs.dns-record-fields:ecs-fields] In DNS Insights Logs, a blank User means location-based authentication is set; a blank request category means the domain is not categorized and a blank response category that the resolved IP or CNAME is not; Server IP is the actual DNS server that resolves the request, which can differ from the one the user targeted depending on the NAT rule configuration for DNS traffic; the HTTP status code field applies only when the protocol between the service and the DNS server is DoH. [zia.logs.dns-record-fields:dns-columns-misc]

The outcome fields are in [What happened to a DNS query: rules, actions, response values and errors](kb:zia.logs.dns-outcome) and the gateway fields in [DNS Gateway fields in the DNS log: slot, server protocol and flags](kb:zia.logs.dns-gateway-fields).

What to check:
1. Whether the field is read under its NSS specifier or its Insights Logs column name, and whether it has an Insights column at all.
2. Whether the time zone was set on the feed, and whether the time fields are derived from Logged Time.
3. Whether a hex-encoded character in a value comes from the feed escape character setting.
4. Whether `cip` is an internal or a NATed address before using it to identify a host.
5. Whether DoT or DoQ traffic is logged and under which protocol value.

Not known (open gaps):
- How DNS over TLS and DNS over QUIC appear in the protocol field [gap:zia.logs.dns-record-fields:dot-doq-open]: settled by lab-test or support-ticket. Blocks: filtering encrypted DNS by protocol

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.logs.nss-feed-format.md (How NSS feeds encode and deliver ZIA log fields)
- links-to references/_meta/text/zia/zia.logs.dns-gateway-fields.md (DNS Gateway fields in the DNS log: slot, server protocol and flags)
- links-to references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors)
