# About NSS Servers

**Source:** https://help.zscaler.com/zia/about-nss-servers
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1402076, revision 3245753

---

An NSS server is the representation of the NSS virtual machine (VM) in the Zscaler Admin Console. After you create a server, Zscaler issues a client certificate and private key that you can install on the NSS VM so that it can authenticate to the Zscaler service.
NSS servers provide the following benefits and enable you to:
- Stream traffic logs from the Zscaler Nanolog to your security information and event management (SIEM) system, allowing for real-time alerting, correlation with the logs of your other devices, and long-term local log archival.
- Assign as many as 16 unique NSS feeds per NSS server for broad and in-depth logging. (Web and Firewall logs are each limited to 8 feeds per server to ensure optimal performance.)
# About the NSS Servers Page
On the NSS Servers page (Data Explorer > Log Streaming > Internet Log Streaming - Nanolog Streaming Service), you can do the following:
- Add an NSS server.
- Deploy an NSS virtual appliance.
- To learn more about adding an NSS server and deploying an NSS virtual appliance, see the NSS Deployment Guides.
- Download MIB files.
- Search for an NSS server.
- View a list of all configured NSS servers. For each server, you can see:
  - Server Name: The name of the server.
  - Type: The server type.
  - Status: The server status.
  - State: The health state of the server.
  - SSL Certificate: The option to download the SSL certificate.
- Modify the table and its columns.
- Download the SSL Certificate for an NSS server.
- Add a new SSL Certificate for an NSS Server.
- Edit an NSS server.
- Go to the NSS Feeds, Cloud NSS Feeds, or NSS Collector Servers tabs.
