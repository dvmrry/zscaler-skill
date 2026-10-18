# Understanding LDAP User Synchronization

**Source:** https://help.zscaler.com/zia/about-ldap-user-synchronization
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399606, revision 3226777

---

When you configure the Zscaler service to synchronize user information from the directory server to the Zscaler database, it uses Lightweight Directory Access Protocol (LDAP) to synchronize user, group, and department information. To learn more about LDAP, refer to RFC 2251 Lightweight Directory Access Protocol (v3). The Zscaler service performs an LDAP search based on the configured customer's directory parameters and imports users who have a user or email attribute and who are part of the domain that is configured for the account.
The Zscaler service synchronizes data as follows:
- It adds users, groups and departments that are in the directory server, but not in the service. It can synchronize up to 128 groups per user.
- It deletes users, groups and departments that are in the service, but not in the directory server.
Zscaler does not delete but deactivates users. It invalidates the authentication cookies of the users that were deleted and they are no longer allowed to authenticate.
- It modifies its data to match what's in the directory, if there's a discrepancy between the information that's in the service and in the directory server.
If your organization cannot allow the Zscaler service to connect directly to your internal directory servers or if you want to bypass any firewall constraints on your network, your organization can install an on-site Zscaler Authentication Bridge (ZAB). The ZAB, which is typically located in your DMZ, is an appliance that communicates with your internal directory servers. The Zscaler service communicates only with the ZAB, which then queries your organization's directory server. To learn more about obtaining a ZAB, contact your Zscaler representative.
The Zscaler service by default performs an LDAP query to the directory server to authenticate users whose data was synchronized with a directory server (described in the next section.) You can configure the service to use another authentication method, as described in Choosing Provisioning and Authentication Methods.
# Authenticating Synchronized Users
The Zscaler service by default performs an LDAP query to the directory server to authenticate users whose data was synchronized from a directory server. It performs an LDAP Bind to the directory server to validate a user’s password and authenticate a user. Therefore, passwords are always stored and maintained on your directory server. They are never synchronized.
Zscaler highly recommends the option to use secure LDAP, to ensure the privacy of the LDAP communications between the service and your directory server, as shown in the diagram when a user logs in to the Zscaler service:
- A synchronized user logs in to the Zscaler service.
- The Zscaler Central Authority (CA) searches for the user in the Zscaler database by the login attribute and email address specified by the user.
- If the CA finds the user, it displays the password request form.
- When the user submits the password request form, the CA retrieves the Distinguished Name and tries to perform an LDAP Bind to the directory server using the Distinguished Name and password of the user.
- If the LDAP Bind succeeds, user authentication is successful.
To learn more, see Synchronizing User Data with an Active Directory or OpenLDAP.
