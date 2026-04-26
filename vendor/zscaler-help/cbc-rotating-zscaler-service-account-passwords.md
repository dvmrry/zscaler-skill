# Rotating Zscaler Service Account Passwords

**Source:** https://help.zscaler.com/cloud-branch-connector/rotating-zscaler-service-account-passwords
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Deployment Management for Virtual Devices 
Rotating Zscaler Service Account Passwords
Cloud & Branch Connector
Rotating Zscaler Service Account Passwords
Ask Zscaler

Zscaler Cloud & Branch Connector virtual devices contain a Zscaler Service Account called zsroot. This account is a privileged user that enables secure administrative access and management of the virtual device. In order to safeguard your organization, Zscaler strongly recommends implementing routine password rotation as a best practice.

Zscaler Cloud Connector

Zscaler Cloud Connectors are typically accessed with the SSH Key that your cloud provider provides at the creation of the connector. Although your zsroot password is not required for logging in, Zscaler recommends periodically changing the password.

Log in to the VM as user zsroot.
Change the password:
Enter the following command:
passwd zsroot
Follow the prompts to enter the current password and then a new password.
Zscaler Virtual Branch Connector
Log in to the device through the console/management interface as user zsroot.
Change the password:
Enter the following commands:
ssh zsroot@169.254.2.2
passwd zsroot
Follow the prompts to enter the current password and then a new password.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Managing Cloud & Branch Connector Upgrades
Rotating Zscaler Service Account Passwords
