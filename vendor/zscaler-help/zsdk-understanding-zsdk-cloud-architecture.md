# Understanding ZSDK Cloud Architecture

**Source:** https://help.zscaler.com/zsdk/understanding-zsdk-cloud-architecture
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1506931, revision 3116087

---

Zscaler SDK for Mobile Apps (ZSDK) is built to provide secure mobile application access. ZSDK runs on a dedicated multi-tenant infrastructure designed for high availability and security. All communication is encrypted end to end to allow complete isolation between different organizations using the same service. ZSDK's scalable and multi-tenant infrastructure consists of ZSDK Public Service Edges, ZSDK Private Service Edges, App Connectors, and Mobile Client SDK.
# Key Components
ZSDK architecture consists of the following key components:
- Public Service Edges
- ZSDK Public Service Edges are cloud-based components maintained by Zscaler and deployed globally. They serve as the primary interface between mobile applications using ZSDK and protected back-end services.
- Public Service Edges provide:
  - ZSDK authentication and configuration using public key cryptography.
  - Policy enforcement and access control.
  - Management of Mutual Transport Layer Security (mTLS) microtunnels for secure communication.
  - Traffic routing and load balancing.
  - Threat detection and prevention.
- Public Service Edges use only public keys for authenticating all mobile applications and their corresponding App Connectors. Private keys are never stored or used, except for the Public Service Edge's own identity.
- Private Service Edges
- ZSDK Private Service Edges are single-tenant instance brokers that provide similar functionality of ZSDK Public Service Edges in an organization's environment. Your organization hosts them either on your premises or on a cloud service, but Zscaler manages them. Private Service Edges serve as the connections between Zscaler Client Connector and App Connectors and then register the connection in the ZSDK cloud.
- Private Service Edges provide:
  - Policy enforcement and access control.
  - Secure access to private mobile applications when ZSDK Public Service Edges in data centers are not conveniently located between users and the applications they need to reach.
  - Business continuity and continued access to critical services during disaster events.
- Private Service Edges use provisioning keys for authenticating all mobile applications.
- To learn more, see About ZSDK Private Service Edges.
- App Connectors
- App Connectors provide a secure interface between an organization's back-end services and Zscaler cloud by:
  - Deploying lightweight virtual machines that are installed in data centers to host your servers and mobile apps.
  - Creating outbound-only connections to the Zscaler cloud.
  - Reducing the need for inbound firewall rules.
  - Supporting redundant configurations (N+1).
  - Enabling service discovery and health monitoring.
  - Providing local DNS resolution.
- App Connectors authenticate a provisioning key pair and maintain persistent mTLS connections to the nearest Public Service Edge. They do not accept inbound connections and only require outbound internet access.
- To learn more, see About App Connectors.
- Mobile Client SDK
- The Mobile Client SDK is the client-side component integrated into mobile applications to provide:
  - Application authentication and integrity verification.
  - Secure communication channel establishment.
  - Certificate and key management.
  - Traffic interception and routing.
  - Device posture checking.
- The Mobile Client SDK creates a unique device fingerprint and application signature to prevent unauthorized copies or modifications of protected applications.
To learn more about the key features and benefits of ZSDK, see What Is Zscaler SDK for Mobile Apps?
