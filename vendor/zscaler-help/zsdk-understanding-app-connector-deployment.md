# Understanding App Connector Deployment

**Source:** https://help.zscaler.com/zsdk/understanding-app-connector-deployment
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Applications 
App Connectors 
App Connector Deployment 
Understanding App Connector Deployment
Zscaler SDK for Mobile Apps
Understanding App Connector Deployment
Ask Zscaler

After you add an App Connector, you must deploy it. Deployment consists of installing and enrolling the App Connector, which allows the App Connector to obtain a TLS client certificate that it must use to authenticate itself to the ZSDK cloud. After deployment, the App Connector is ready to securely connect users to applications.

Understanding App Connector Enrollment

When an App Connector is installed for the first time, it does not yet have a key pair (i.e., a local private key and a corresponding TLS client certificate). Instead, the App Connector must first generate the local private key, which it encrypts using a hardware fingerprint. Then, the App Connector must obtain the TLS client certificate through enrollment using the following process:

The App Connector uses the local private key to generate a certificate signing request (CSR).
The App Connector uses the provisioning key to authenticate the CSR to the ZSDK cloud. This is the provisioning key that you generated when adding an App Connector.
The App Connector receives a signed TLS client certificate from the ZSDK cloud.
The signed TLS client certificate is pinned to the App Connector's hardware fingerprint.

After the App Connector is enrolled, it is paired with a single customer account; therefore, the App Connector cannot be enrolled again. App Connectors running in virtual machine (VM) environments should never be cloned because the keys are no longer matching the virtual hardware fingerprints.

Deploying an App Connector on a Supported Platform

Before you begin a deployment, see App Connector Deployment Prerequisites which provides detailed information on VM image sizing and scalability, supported platform requirements, deployment best practices, and other essential guidelines.

The deployment process differs depending on the platform used for the App Connector. Zscaler recommends that App Connectors be deployed in pairs, to ensure continuous availability during software upgrades.

To learn more, see:

The Deployment Guide for the platform of your choice.
The App Connector Deployment Checklist to understand what is required to deploy App Connectors.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding App Connector Deployment
App Connector Deployment Prerequisites
App Connector Deployment Checklist
Maintaining Deployed App Connectors
