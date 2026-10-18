# Step-by-Step Configuration Guide for ZSDK

**Source:** https://help.zscaler.com/zsdk/step-step-configuration-guide-zsdk
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1506946, revision 3213710

---

This guide provides the configuration steps needed to begin using Zscaler SDK for Mobile Apps (ZSDK) for your organization.
Before you begin configuring ZSDK, Zscaler recommends reading the following articles:
- What Is Zscaler SDK for Mobile Apps?
- Ranges & Limitations
# Configuring ZSDK
To configure ZSDK, complete the following steps:
- Step 1: Register Your App
- To use ZSDK in your mobile app, you need to register your mobile app to obtain an app key. To learn more, see Register Your App.
- If you cannot register an app, contact Zscaler Support.
- Step 2: Configure a Token Validator
- Configure a JSON Web Token validator to enable ZSDK to work with your user identity and management systems to provide strong authentication and authorization. To learn more, see Managing Token Validators.
- Step 3: Add App Connectors
- Add App Connectors to provide a secure, authenticated interface between your servers and the ZSDK cloud. To learn more, see Managing App Connectors.
- Step 4: Deploy App Connectors
- App Connector deployment consists of installing the App Connector and enrolling it to obtain the TLS client certificate to authenticate itself to the Zscaler cloud.
- The deployment process differs depending on the platform used for the App Connector. Zscaler recommends that App Connectors be deployed in pairs to ensure continuous availability during software upgrades. To learn more, see the platform-specific deployment guides:
  - App Connector Deployment Prerequisites
  - App Connector Deployment Guide for Amazon Web Services
  - App Connector Deployment Guide for Linux
  - App Connector Deployment Guide for Docker
  - App Connector Deployment Guide for Microsoft Azure
  - App Connector Deployment Guide for Microsoft Hyper-V
  - App Connector Deployment Guide for Nutanix AHV
  - App Connector Deployment Guide for VMware Platforms
  - Networking Deployed Software Components
  - Configuring a Split DNS Zone for App Connectors
  - Troubleshooting App Connectors
- Step 5: Define Application Segment
- You need to define an application segment for applications (e.g., back-end services, APIs) that you want to protect with ZSDK. An application is an FQDN, local domain name, or IP address that you define on a standard set of ports. To learn more, see Defining and Managing Application Segments.
- Step 6: Add Access Policy
- By default, Zscaler blocks access to applications and segment groups for users until you configure policy rules that explicitly allow access. To learn more, see Managing Access Policies.
- Step 7: Integrate ZSDK
- After configuring your application in the ZSDK Admin Portal and deploying App Connectors, you need to integrate ZSDK before you can start securing your app's operations. Depending on your application type, read one of the ZSDK Integration Guides:
  - ZSDK Integration Guide for Android
  - ZSDK Integration Guide for iOS
