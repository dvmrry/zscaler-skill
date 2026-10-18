# Understanding Subclouds

**Source:** https://help.zscaler.com/zia/understanding-subclouds
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398841, revision 3224268

---

A subcloud is a subset of Public Service Edges for Internet & SaaS (ZIA), which are full-featured secure internet gateways that inspect all web traffic bidirectionally for malware, and enforce security, compliance, and next-generation firewall (NGFW) policies. Public Service Edges are deployed in Zscaler data centers around the globe, so when your users move to a different location, they can access the internet from any device and the Public Service Edges protect their traffic and apply your corporate policies.
If certain requirements make forwarding traffic to Public Service Edges less than ideal, you can extend Zscaler's patented cloud architecture to your organization's premise by deploying Private Service Edges for Internet & SaaS or Virtual Service Edges for Internet & SaaS.
A subcloud can be a subset of Public Service Edges, a subset of Private Service Edges, or a subset of both Public Service Edges and Private Service Edges. A subcloud cannot be a subset of Public Service Edges in only one data center.
# Using a Subcloud
Zscaler always recommends that organizations forward traffic to the Public Service Edges in the Zscaler cloud. They are deployed in active-active mode all over the world, to ensure availability and redundancy. Zscaler monitors and maintains its Public Service Edges worldwide to ensure 24/7 availability.
The service uses geolocation technology to find the Public Service Edge closest to the user and forwards web traffic to that Public Service Edge, which in some cases might be less than ideal. For example, you might be required to forward web traffic to Public Service Edges in a specific region only, but if a remote user has traveled outside of it, then web traffic might be forwarded to a Public Service Edge located outside of your preferred region. In such a case, an organization can use a subcloud to ensure that traffic is forwarded to your preferred Public Service Edges.
Following are the different types of subclouds that Zscaler can set up, depending on an organization's requirements:
- Public Service Edges
- For organizations that need to forward web traffic to Public Service Edges in a specific region only, a subcloud that consists of only Public Service Edges located in that region can be created. For example, if you need to forward web traffic to Public Service Edges that are located in Europe only (for compliance or regulatory requirements), you can use a subcloud that consists of Public Service Edges in Europe, as shown in the following illustration.
- Private Service Edges
- If you want your web traffic to be forwarded to only Private Service Edges, a subcloud that consists of only your Private Service Edges can be created. This ensures that your traffic does not get forwarded to Public Service Edges. In the following illustration, the subcloud's name is Safemarch.
- Public Service Edges and Private Service Edges
- If you want your web traffic to be forwarded to certain Public Service Edges and Private Service Edges, a subcloud that consists of only your preferred Public Service Edges and Private Service Edges can be created. This ensures that your traffic is only forwarded to the Public Service Edges in that subcloud. In the following illustration, the subcloud's name is Safemarch2.
The illustrations used in these sections are for example purposes only and the locations listed are subject to change.
# Setting Up a Subcloud
If you are interested in having a subcloud for your organization, submit a ticket to Zscaler Support. The Zscaler service sets up the subcloud if your organization has access only to limited, restricted, or private data centers.
The subcloud name can contain up to 32 characters, including alphabet (both upper and lower cases), numerals, or hyphens (-). The first and last character must always be an alphabet or a numeral.
# Using PAC File Variables
If you want to use a PAC file to forward your web traffic to a subcloud, you must use a custom PAC file that doesn't use the variables gateway.<Zscaler cloud> and ${GATEWAY} in its return statement. Otherwise, web traffic is forwarded to the nearest Public Service Edge, which might not be a Public Service Edge in your subcloud.
To ensure your web traffic is always forwarded to the Public Service Edges specified in the subcloud:
- Use the following variables for applications that don't support PAC files:
gateway.<Subcloud>.<Zscaler cloud> secondary.gateway.<Subcloud>.<Zscaler cloud>
- Use the following variables in PAC files:
${GATEWAY.<Subcloud>.<Zscaler cloud>} ${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>}
- Use the following variables for Kerberos:
${GATEWAY.<Subcloud>.<Zscaler cloud>_HOST} ${SECONDARY.GATEWAY.<Subcloud>.<Zscaler cloud>_HOST}
Each subcloud is associated with a DNS name, which resolves the Public Service Edges in that subcloud. Replace <Subcloud> with the DNS name of the subcloud, and replace <Zscaler cloud> with your cloud name. To learn how to find your Zscaler cloud name, see Understanding Zscaler Cloud Names.
For example, if you want to restrict the traffic forwarding within the data centers only in the US, then configure your PAC files to use the Zscaler-managed subcloud CONUS for any of the following clouds:
- zscaler.net
- zscalertwo.net
- zscalerthree.net
Use the variables ${GATEWAY.CONUS.<Zscaler cloud>} and ${SECONDARY.GATEWAY.CONUS.<Zscaler cloud>} in the return statement of your PAC file.
# Subcloud Failover
After you edit the data center list for a subcloud from the Subclouds page on the Zscaler Admin Console, it takes about 5 minutes for the changes to be reflected in Zscaler Hosted PAC files. Zscaler Client Connector automatically refreshes the Application Profile PAC every 15 minutes and picks up the subcloud change on the next sync which overlaps with the Application Profile PAC being updated. Users should be redirected about 10–20 minutes after the subcloud changes are activated.
Ensure that the Application Profile PAC has been updated to reflect the subcloud changes prior to requesting an app policy update.
To update the app policy:
- Open Zscaler Client Connector on the client machine.
- Go to More.
- Click Update Policy next to App Policy to immediately sync the Application Profile PAC.
See image.
