# Deploying ZSDK Private Service Edges

**Source:** https://help.zscaler.com/zsdk/deploying-zsdk-private-service-edges
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Private Service Edge 
Deploying ZSDK Private Service Edges
Zscaler SDK for Mobile Apps
Deploying ZSDK Private Service Edges
Ask Zscaler

After you add a ZSDK Private Service Edge, you must deploy it. Deployment consists of installing and enrolling the Private Service Edge, which allows it to obtain a TLS client certificate that it must use to authenticate itself to the ZSDK cloud. After deployment, the Private Service Edge is ready to securely connect users to App Connectors and applications.

Understanding ZSDK Private Service Edge Enrollment

When a Private Service Edge is installed for the first time, it does not yet have a key pair (i.e., a local private key and a corresponding TLS client certificate). Instead, the Private Service Edge must first generate the local private key, which it encrypts using a hardware fingerprint. Then, the Private Service Edge must obtain the TLS client certificate through enrollment, which consists of the following processes:

The Private Service Edge uses the local private key to generate a Certificate Signing Request (CSR).
It uses the provisioning key assigned to its associated Private Service Edge group to authenticate the CSR to the ZSDK cloud.
It receives a signed TLS client certificate from the ZSDK cloud.
The signed TLS client certificate is pinned to the Private Service Edge's hardware fingerprint.

After the Private Service Edge is enrolled, it is paired with a single customer account, and it cannot be enrolled again. Private Service Edges run in virtual machine (VM) environments and must not be cloned, because the keys will no longer match the virtual hardware fingerprints.

Deploying a ZSDK Private Service Edge on a Supported Platform

Before you begin a deployment, read ZPA Private Service Edge Deployment Prerequisites, which provides detailed information on VM image sizing and scalability, supported platform requirements, deployment best practices, and other essential guidelines.

The deployment process differs depending on the platform used for the Private Service Edges. Zscaler recommends that Private Service Edges are deployed in pairs to ensure continuous availability during software upgrades. To learn more, see the Deployment Guide for the platform.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About ZSDK Private Service Edges
About ZSDK Private Service Edge Groups
About ZSDK Private Service Edge Provisioning Keys
Deploying ZSDK Private Service Edges
Viewing Disaster Recovery
Configuring Disaster Recovery
Managing ZSDK Private Service Edges
Managing ZSDK Private Service Edge Groups
Managing ZSDK Private Service Edge Provisioning Keys
