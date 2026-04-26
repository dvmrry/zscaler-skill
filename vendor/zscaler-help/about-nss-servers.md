# About NSS Servers

**Source:** https://help.zscaler.com/zia/about-nss-servers
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

An NSS server is the representation of the NSS virtual machine (VM) in the Zscaler Admin Console. After you create a server, Zscaler issues a client certificate and private key that you can install on the NSS VM so that it can authenticate to the Zscaler service.

NSS servers provide the following benefits and enable you to:

- Stream traffic logs from the Zscaler Nanolog to your security information and event management (SIEM) system, allowing for real-time alerting, correlation with the logs of your other devices, and long-term local log archival.
- Assign as many as 16 unique NSS feeds per NSS server for broad and in-depth logging. (Web and Firewall logs are each limited to 8 feeds per server to ensure optimal performance.)

## About the NSS Servers Page

On the NSS Servers page (Administration > Nanolog Streaming Service), you can do the following:

- Add an NSS server.
- Deploy an NSS virtual appliance.

To learn more about adding an NSS server and deploying an NSS virtual appliance, see the NSS Deployment Guides.

- Download MIB files.
- Search for an NSS server.
- View a list of all configured NSS servers. For each server, you can see:
  - Server Name: The name of the server.
  - Type: The server type.
  - Status: The server status.
  - State: The health state of the server.
  - SSL Certificate: The option to download the SSL certificate.
- Modify the table and its columns.
- Edit an NSS server.
- Add an NSS feed.
- Add a Cloud NSS feed.
- Add an NSS Collector server.
