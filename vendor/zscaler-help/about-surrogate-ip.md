# Understanding Surrogate IP

**Source:** https://help.zscaler.com/zia/about-surrogate-ip
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399531, revision 3212388

---

In certain deployments from known locations, you can enable the Zscaler surrogate IP service to map a user to a private IP address so it applies the user's policies, instead of the location's policies, to traffic that it cannot authenticate, which includes:
- Applications that do not support cookies, such as Google Earth and SkyDrive.
- HTTPS transactions that are not decrypted.
- Transactions that use unknown user agents.
If a user browses the internet from multiple private IP addresses, the surrogate IP service maps all the private IP addresses to the user. The service also associates the transactions with the user in the logs.
The surrogate IP service maps a private IP address to only one user at a time and retains the mapping until:
- The configured idle time ends.
- The user logs out of a session or logs out of the Zscaler service.
- Another user sends authenticated transactions from the same private IP address.
Zscaler does not recommend using the surrogate IP service with multi-session Virtual Desktop Infrastructure (VDI) environments because the service maps the same private IP address to all users sharing that virtual machine (VM). This can lead to associating traffic transactions to incorrect users in the Zscaler logs.
This service maps the private IP address to a new user if a different user logs in to the Zscaler service from the same private IP address. If the mapping changes more than 3 times a minute (i.e., 3 different users log in and surf the internet from the same private IP address within a minute), the service stops mapping users to the private IP address for 5 minutes and applies location policies to the transactions that do not support authentication during these 5 minutes.
Additionally, an organization can subscribe to one or more dedicated proxy ports and associate them with a location. If you enable this feature on a location with at least one subscribed port, the service maps the public IP address and not the internal or private IP address to the user, so it can apply user-level policies to remote user traffic that it cannot authenticate.
Zscaler recommends that you enable surrogate IP for non-browser apps, such as Windows Store apps.
# Benefits
With surrogate IP, a user can authenticate to the service in one web browser and does not have to authenticate again if they open another web browser or use non-browser applications.
# Requirements
To use this feature, your organization must use one of the following methods to forward traffic to the service:
- A GRE or IPSec tunnel without NAT.
- Forward proxy chaining with the **Enable XFF Forwarding** option turned on for the location or sublocation.
- Your organization subscribes to a dedicated proxy port.
Also, the location or sublocation must have **Enforce Authentication** turned on. To learn more about enabling surrogate IP on locations and sublocations, see Configuring Locations and Understanding Sublocations.
# Limitations
- If you disable this feature, Zscaler cannot tag all user traffic as authenticated after the user has authenticated successfully in at least one web browser. For example, if the user authenticates to the Zscaler service in Chrome and opens Firefox, then the user is prompted to authenticate again in Firefox.
- This service should not be used with multi-session VDI machines because all users sharing the VM have the same private IP address. This can lead to associating the transactions with an incorrect user in the Zscaler logs.
