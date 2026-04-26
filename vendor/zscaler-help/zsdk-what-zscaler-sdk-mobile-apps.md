# What Is Zscaler SDK for Mobile Apps?

**Source:** https://help.zscaler.com/zsdk/what-zscaler-sdk-mobile-apps
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Getting Started 
What Is Zscaler SDK for Mobile Apps?
Zscaler SDK for Mobile Apps
What Is Zscaler SDK for Mobile Apps?
Ask Zscaler

Zscaler SDK for Mobile Apps (ZSDK) is a Zero Trust Network Access (ZTNA) security solution designed for consumer mobile applications. ZSDK allows organizations to protect their entire digital delivery chain by requiring authentication and authorization for all resource access attempts, regardless of their origin. This Zero Trust approach helps organizations safeguard against unauthorized access and data breaches in today's complex digital landscape.

The ZSDK Admin Portal allows you to manage your applications' security policies in a central location. ZSDK renders your applications and back-end infrastructure completely invisible to unauthorized users and entities on the public internet.

To learn how to configure ZSDK, see Step-by-Step Configuration Guide.

Key Features and Benefits

The following are ZSDK key features and benefits:

Encrypted Communication: Uses Mutual Transport Layer Security (mTLS) microtunnels to encrypt all network requests originating from the mobile app.
API and Back-End Service Protection: Prevents public exposure of APIs and back-end services to the internet by rendering them invisible to unauthorized users.
Zero Trust Architecture: Implements a ZTNA model that requires end-user identity verification for all access attempts, and therefore reduces the overall attack surface of the application.
Integration with Mobile Apps: Designed for native (iOS or Android) and hybrid mobile applications to maintain a seamless user experience while implementing security.
Logging and Analytics: Provides real-time visibility and insight into your organization's application usage, security events and policy violations, performance metrics (e.g., latency data), and user authentication events.
How Does ZSDK Work?

ZSDK operates through several key steps to ensure secure communication:

SDK Integration: ZSDK is embedded into the application's source code during development by activating the security features from the first launch.
Back-End Deployment: APIs and back-end services are deployed behind App Connectors to enable service access by creating inside-out mTLS microtunnels to the Zscaler cloud. This architecture acts as a broker to process requests to reach back-end services while keeping them hidden from public internet exposure.
User Identity Verification: ZSDK verifies the token's signature against the security certificate, confirms that the JSON Web Token contains the required claims, and then authenticates the user's identity prior to granting app access.
Secure Communication Channel: After the user's identity is verified, ZSDK creates mTLS microtunnels to route network requests through the ZSDK cloud. The ZSDK Public Service Edge acts as a broker to route connections via the App Connector's microtunnel.

This comprehensive defense strategy ensures that all mobile app communications with back-end services remain authenticated, encrypted, and properly routed, thereby minimizing unauthorized access and data interception risks.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
What Is Zscaler SDK for Mobile Apps?
Understanding ZSDK Cloud Architecture
Step-by-Step Configuration Guide for ZSDK
What Is My Cloud Name for ZSDK?
Ranges & Limitations
