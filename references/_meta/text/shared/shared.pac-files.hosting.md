# Hosted PAC files: the console page, Obfuscate URL, limits and how changes reach clients (shared.pac-files.hosting)
Also called: hosted pac files page; obfuscate url; pac url obfuscation; pac number of hits; currently deployed version; error-accepted; pac non-ascii limit; pac file size limit; pac rollback; pac propagation

The service hosts the default PAC files and an organization's custom ones. The limits, version states and the rule that changes are immediate are in [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac); this subject covers the rest of hosting.

**Serving.** The PAC servers support HTTP and HTTPS; HTTPS is used by changing the URL scheme and is recommended for security. [shared.pac-files.hosting:http-https] An organization can use more than one PAC file, for example one for mobile devices and another for all other devices. [shared.pac-files.hosting:multiple-files]

**The Hosted PAC Files page.** For each file the Hosted PAC Files page shows its hosted URL, a status of Verified or Error-Accepted (saved with errors the admin accepted at verification), the Number of Hits in the last 30 days and the Currently Deployed Version; files can be previewed and exported as text, PAC or JS. [shared.pac-files.hosting:page-columns] Deploying a file that has verification errors requires a commit message and selecting I accept the risk. [shared.pac-files.hosting:accept-risk] On Manage Versions, any two versions can be compared, and each version's actions are deploy, mark or remove Last Known Good, create a branch, delete or stage deployment; a separate tab shows the deployed version. [shared.pac-files.hosting:versions-actions]

**Who can read the file.** A PAC file is text that anyone can download and view, so it should be protected with appropriate file permissions. [shared.pac-files.hosting:public-file] Because the file must be public for users' machines to fetch it, anyone with the URL can read content the organization may not want public; enabling Obfuscate URL makes the console generate a different URL, and Zscaler strongly recommends it. [shared.pac-files.hosting:obfuscate-recommended] Obfuscate URL applies to all the additional versions of a file and cannot be changed on a saved file, because it changes the hosted URL; users still on the old URL are served the default proxy PAC file instead of the custom one. To change it, the content is copied into a new PAC file with the setting changed, and the new URL is distributed. [shared.pac-files.hosting:obfuscate-fixed]

**Size and characters.** A PAC file name and description are each limited to 255 characters, and the file can contain up to 12% non-ASCII characters (binary). [shared.pac-files.hosting:name-and-characters] What saving a file over the non-ASCII limit does is open [gap:shared.pac-files.hosting:non-ascii-save]. Characters take different numbers of bits to encode, so a precise character count is difficult; saving a file over 256 KB without a raised limit shows an error. [shared.pac-files.hosting:size-is-encoded] Whether 256 KB is a hard maximum differs between sources [divergence:shared.pac-files.hosting:max-file-size]; the help's limits are [By default an organization can have 256 PAC files (Support can raise this to 1,024), each up to 256 KB (Support can raise it to 2 MB), with up to 10 versions per file.](kb:zia.traffic-forwarding.pac:limits).

**How fast changes reach clients.** A change to a subcloud's data center list takes about 5 minutes to reach Zscaler-hosted PAC files; Client Connector refreshes the app profile PAC every 15 minutes, so users are redirected about 10 to 20 minutes after the change, and Update Policy in the app syncs the app profile PAC immediately. [shared.pac-files.hosting:subcloud-propagation] The Editing a Subcloud article gives a different redirect figure: [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds). When browsers pick up a changed file is open in [When clients pick up a changed PAC file](kb:zia.traffic-forwarding.pac:client-cache), and WPAD delivery in [PAC delivery by WPAD, MDM and manual settings](kb:zia.traffic-forwarding.pac:delivery-methods).

What to check:
1. Whether clients are fetching the file at all, from its Number of Hits over the last 30 days.
2. Whether the file was deployed with verification errors (Error-Accepted) rather than Verified.
3. After an Obfuscate URL change, whether users were given the new hosted URL; users on the old URL get the default proxy PAC file.
4. For Client Connector users, whether the app profile PAC has refreshed (every 15 minutes, or Update Policy).

Sources disagree (name both sides):
- Whether 256 KB is the maximum PAC file size. [divergence:shared.pac-files.hosting:max-file-size]
  - zscaler-help: The reference architecture gives 256 KB as the maximum file size.
  - zscaler-help: The custom PAC file article gives 256 KB as the default, raisable by Zscaler Support to 2 MB.
  Impact: Reading the reference architecture alone, a file over 256 KB looks impossible and gets split or trimmed, when a Support request can raise the limit.

Not known (open gaps):
- What saving a PAC file over the non-ASCII limit does [gap:shared.pac-files.hosting:non-ascii-save]: settled by lab-test. Blocks: explaining a PAC file that will not save or deploy

Area: shared.pac-files, its subjects in references/_meta/spine/shared/shared.pac-files.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)
- interacts-with references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses), from shared.pac-files: For Z-Tunnel 1.0, network bypasses can go in the app profile PAC file; for Z-Tunnel 2.0 the vendor says not to put them there and to add them as VPN gateway bypasses or destination exclusions. [zcc.z-tunnel.bypasses:pac-not-for-2]
- links-to references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zia/zia.terraform.pac-files.md (The zia_pac_files resource: versions, pinning and status transitions)
- see-also references/_meta/text/shared/shared.pac-files.md (PAC files across Zscaler: where each question is answered)
