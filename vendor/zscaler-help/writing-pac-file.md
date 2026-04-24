# Writing a PAC File

**Source:** https://help.zscaler.com/zia/writing-pac-file
**Captured:** 2026-04-24 via Playwright MCP.

---

Copy and paste any one of the 4 default PAC files — **recommended.pac**, **proxy.pac**, **mobile_proxy.pac**, **kerberos.pac** — from the ZIA Admin Portal based on your requirements. Customize them as necessary. Build your PAC file one element at a time; save the file and test it after each addition.

## Prerequisites

Before you begin, review *Best Practices for Writing PAC Files*.

By default, each PAC file that you upload to the Zscaler service can be up to **256 KB** in size. Contact Zscaler Support to increase the PAC file size limit to a maximum of **2 MB**.

## PAC File Components

- FindProxyForURL Function
- Return Statements
- Arguments
- Zscaler-Specific Variables
- Manual Failover to Secondary Data Center

## Manual Failover to Secondary Data Center

When the primary data center is down, the failover to the secondary data center is automatic. However, if the primary data center is unavailable for other reasons (ISP issues, latency, etc.), modify the PAC file syntax as follows to manually fail over to the secondary data center:

```javascript
return "PROXY ${SECONDARY_GATEWAY_FX}:80; PROXY ${GATEWAY_FX}:80; DIRECT";
```

If your organization uses a subcloud, use the variables `${GATEWAY.<Subcloud>.<Zscaler Cloud>.net}` and `${SECONDARY.GATEWAY.<Subcloud>.<Zscaler Cloud>.net}`. For example:

```javascript
return "PROXY ${SECONDARY.GATEWAY.<Subcloud>.<Zscaler Cloud>.net_FX}:80; PROXY ${GATEWAY.<Subcloud>.<Zscaler Cloud>.net_FX}:80; DIRECT";
```
