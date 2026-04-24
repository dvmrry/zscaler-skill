# Using Custom PAC Files to Forward Traffic to ZIA

**Source:** https://help.zscaler.com/zia/using-custom-pac-file-forward-traffic-zia
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler allows you to host **up to 10 versions** of your custom PAC files at a time in the ZIA Admin Portal. Multiple versions can be staged for testing before deployment. When you add a PAC file, you can check its syntax and correct any errors before you save it.

## Default PAC file limits

- **Number of PAC files allowed per organization: 256.** Contact Zscaler Support to increase to **1,024**.
- **Size limit per PAC file: 256 KB.** Contact Zscaler Support to increase to **2 MB**.

## Operational warnings

- PAC file changes **immediately impact your organization's traffic**. If editing a PAC file, verify the changes and apply them during your organization's maintenance window. Zscaler highly recommends saving a copy of the current PAC file before applying any changes.

## Prerequisites

- Review the best practices.
- Test the newly edited or created PAC file on a local machine before production deployment.

## On the Hosted PAC Files page

You can:

- Add a Custom PAC File
- Create a Branch for the Custom PAC File
- Manage Different Versions of the Custom PAC File
- Delete a Custom PAC File Version

## Next Steps

After adding the custom PAC file:

- Distribute the PAC file URL to your users.
- Review the firewall requirements and make the necessary configuration changes.
