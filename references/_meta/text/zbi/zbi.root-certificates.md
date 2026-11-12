# Root certificates the isolation browser trusts: limits, defaults, edit and delete rules (zbi.root-certificates)
Also called: isolation root certificate; Zscaler Root Certificate placeholder; browser isolation certificate type; upload root certificate for isolation

The isolation browser trusts the well-known certificate authorities that Chromium trusts, and admins can additionally upload root certificates for it to trust, which can be associated with Internet & SaaS isolation profiles. [zbi.root-certificates:chromium-trust-plus-uploaded] The default Zscaler Root Certificate is deployed automatically as a placeholder root certificate for any new isolation profile, in both the Internet & SaaS and the Private Access article; admins can add their own certificates to use instead. [zbi.root-certificates:default-placeholder]

**Adding.** An organization can add up to 10 root certificates for Zero Trust Browser in Internet & SaaS. [zbi.root-certificates:zia-limit-ten] Adding an Internet & SaaS root certificate takes a Name, a Type chosen as Browser Isolation, and the Content from a PEM file; the Private Access drawer takes a Name and an uploaded PEM file. [zbi.root-certificates:zia-add-type-pem]

**The list.** The Internet & SaaS Root Certificates page shows for each certificate its name, upload date and time, expiration date, type and a download option; certificates other than the default can be downloaded, edited and deleted. [zbi.root-certificates:zia-list-columns] The Private Access Root Certificates page lets admins delete custom root certificates that are not the default and are not associated with any isolation profile. [zbi.root-certificates:pa-delete-custom-only]

**Choosing certificates in a profile.** The Internet & SaaS profile wizard requires at least one root certificate, with the Zscaler Root Certificate used for SSL inspection offered by default; the Private Access wizard requires at least one certificate to deploy, with the Zscaler Root Certificate applied by default and not disableable. [zbi.root-certificates:profile-selection] The profile objects are in [Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions](kb:zbi.isolation-profiles).

**Editing.** The PEM file of an existing root certificate cannot be changed in either product; a different PEM file needs a new root certificate. [zbi.root-certificates:pem-cannot-change] In Internet & SaaS the Name and the Type of a root certificate can be edited; in Private Access the Name is edited. The default Zscaler Root Certificate is the exception (Internet & SaaS: it cannot be fully edited; Private Access: it cannot be edited). [zbi.root-certificates:edit-fields] A root certificate can be edited at any time, even while associated with an isolation profile (stated by both the Internet & SaaS and the Private Access editing articles). [zbi.root-certificates:edit-while-associated] The Internet & SaaS adding article says a root certificate that is not the default and not associated with an isolation profile can be edited. [zbi.root-certificates:zia-edit-only-unassociated] These two disagree [divergence:zbi.root-certificates:edit-while-associated-conflict].

**Deleting.** The default Zscaler Root Certificate cannot be deleted because at least one root certificate is required per isolation profile, and other certificates associated with an isolation profile cannot be deleted until disabled from that profile; in Private Access the delete icon is unavailable for such certificates. [zbi.root-certificates:delete-restrictions]

Whether the certificate objects can be managed through an API, SDK or Terraform is open [gap:zbi.root-certificates:automation-surfaces].

What to check:
1. Whether the profile has at least one root certificate selected, and whether a certificate a delete was refused for is still associated with a profile.

Sources disagree (name both sides):
- The editing articles say a root certificate can be edited at any time, even while associated with an isolation profile, while the Internet & SaaS adding article says a non-default certificate not associated with an isolation profile can be edited. [divergence:zbi.root-certificates:edit-while-associated-conflict]
  - zscaler-help: A root certificate can be edited at any time, even while associated with an isolation profile (Internet & SaaS and Private Access editing articles).
  - zscaler-help: A root certificate that is not the default and not associated with an isolation profile can be edited.
  Impact: An answer on whether an associated certificate can be edited depends on which article is followed; both are quoted, neither is settled.

Not known (open gaps):
- Whether Internet & SaaS isolation root certificates can be managed through the API, SDKs or Terraform [gap:zbi.root-certificates:automation-surfaces]: settled by source-read. Blocks: answering how to manage Internet & SaaS isolation root certificates as code

Area: zbi.root-certificates, its subjects in references/_meta/spine/zbi/zbi.root-certificates.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)
