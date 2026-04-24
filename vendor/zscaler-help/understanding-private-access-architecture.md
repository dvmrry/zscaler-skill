# Understanding the Private Access Architecture

**Source:** https://help.zscaler.com/zpa/understanding-private-access-architecture
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help 
Understanding the Private Access Architecture
Private Access (ZPA)
Understanding the Private Access Architecture
Ask Zscaler

Private Access (ZPA) was built from the ground up to provide secure remote access. To learn more about the Zscaler security platform and Internet & SaaS (ZIA) architecture, see Understanding the ZIA Cloud Architecture.

Private Access runs on a unique multi-tenant infrastructure, separate from that of Internet & SaaS, to make the service highly available. This separation ensures that when the same organization is using both services, public and internal traffic never mix on the same device. Additional measures are used to ensure security and privacy between organizations using the Private Access service, and in many cases, traversing the same equipment. Finally, all communication is encrypted end to end.

The Private Access service includes the following key components and subsystems:

Private Access Central Authority

The Private Access Central Authority (CA) is the brain and nervous system of the Zero Trust Exchange (ZTE). It is a geographically distributed system of in-sync nodes that all actively service requests. To learn more, see Public Service Edges and the Central Authority.

The Private Access CA monitors the ZTE and provides a central location for software and database updates, as well as policy and configuration settings. Each component of the system is aware of the health of the entire ZTE, and policy is distributed across all components of the CA. It includes user interfaces connected via APIs to configuration components, as well as distributed dispatchers that track real-time application states.

Close
Public Service Edges and Private Service Edges

Public Service Edges and Private Service Edges enforce user policies and provide secure transport to App Connectors. Maintained by Zscaler and deployed globally, Public Service Edges are the cloud-based portion of the Private Access data forwarding path, responsible for giving Zscaler Client Connector and App Connectors the ability to provide secure, authenticated, policy-based access to internal applications. Private Service Edges act in the same capacity, but they are managed by an organization. Public Service Edges and Private Service Edges are responsible for a variety of functions, including:

Zscaler Client Connector and App Connector configuration and authentication, using public key cryptography.

Public Service Edges and Private Service Edges use only public keys for authenticating all remote systems and clients connecting with it. No private keys are stored or used, with the exception of the Public Service Edge's or Private Service Edge's identity.

Creating and managing Microtunnels (M-Tunnels), including authentication, policy, setup, teardown, and data forwarding. M-Tunnels​​​​​ are end-to-end encrypted connections designed to ensure that all traffic stays separate. To learn more, see Understanding Communication Between Components and Subsystems below.

To learn more, see Understanding Service Edges.

Close
App Connectors

App Connectors provide the authenticated secure interface between an organization's application servers and the ZTE. App Connectors can be distributed using lightweight virtual machines (VM) to run in legacy enterprise data centers and public cloud environments, or as a package that can be installed under supported operating systems.

App Connectors are deployed in locations where internal applications reside, or they can be deployed in any location that has connectivity to those applications. Private Access selects the closest App Connector given the location of the user and the App Connector-to-application latency. It is best to install them in redundant (N+1) configurations, where (N) is the number of App Connectors required to support the applications, because they are always active. App Connectors never communicate with each other and do not accept inbound connections. They only require an outbound connection to the internet to reach Public Service Edges or Private Service Edges, so they can provide users access to internal applications in your organization.

Using a key pair (i.e., a provisioning key and a corresponding TLS client certificate), the App Connector and the ZTE verify each other as part of enrollment. After an App Connector is enrolled, the TLS client certificate allows it to maintain its authentication with the nearest Public Service Edge or Private Service Edge, which provides the App Connector with its configuration and allows it to begin its operational tasks. These tasks include:

Find applications as requested by users.
Act on behalf of the application to send traffic back to users.
Complete DNS requests on demand, based on established policies.
Monitor applications for their reachability.

To learn more, see About App Connectors.

Close
Traffic Forwarding

There are two ways to manage traffic forwarding:

Zscaler Client Connector

Zscaler Client Connector is a client or app that is installed on a user's device (or endpoint), which authenticates the endpoint with the ZTE and enables access to internal applications on behalf of that endpoint. Zscaler Client Connector verifies the integrity of both the Private Access infrastructure and the peers it communicates with using public key cryptography.

Beyond the full authentication, as handled as part of the standard SAML 2.0 workflow, Zscaler Client Connector creates a unique fingerprint of the user's device. This means if someone copies Zscaler Client Connector from one device to another, the fingerprint generated by Zscaler Client Connector will prevent successful enrollment from the new device.

Zscaler Client Connector recognizes the internal applications that are available via Private Access. Access to these applications is defined in Private Access based on policies. Using information received from the Public Service Edge or Private Service Edge, it intercepts the user requests for those applications, and then forwards those requests to the ZTE. No network information is required to access available applications, and an organization can specify if resources must go through Private Access at all times, when on an untrusted network only, or never.

To facilitate secure private connections that are abstracted from the physical network, Zscaler Client Connector associates permitted internal applications with a set of synthetic IP addresses. When a client application (i.e., a web browser or SSH client) sends out a DNS request, Zscaler Client Connector recognizes the domain as an internal application being protected by Private Access. Zscaler Client Connector then intercepts the DNS request and delivers a DNS response to the client application that uses the synthetic IP address associated with the internal application.

Organizations can also use Zscaler Client Connector to direct user traffic to Internet & SaaS. Zscaler Client Connector identifies internal applications to forward traffic to Private Access, and other traffic goes to Internet & SaaS. If an organization is using Internet & SaaS and Private Access, Zscaler Client Connector inherits some functionality from Internet & SaaS, including enrollment, user profiles, traffic management, etc. However, organizations do not need access to Internet & SaaS to use Private Access. To learn more, see What Is Zscaler Client Connector?

Close
Browser Access

Browser Access allows you to leverage a web browser for user authentication and application access over Private Access. This allows access to applications over Private Access for users who cannot install Zscaler Client Connector on their devices.

The application must be available via HTTP/HTTPS in a web browser that supports TLS 1.2. When a user tries to access an internal web application, they can open any web browser on their device and enter the application's URL. Private Access directs this traffic to the organization's identity provider (IdP), where the IdP authenticates the user and grants a SAML certificate before forwarding the traffic to a Public Service Edge or Private Service Edge. Browser Access is session based, so the user must authenticate via the IdP every time they try to access the web application.

The Public Service Edge or Private Service Edge accepts the SAML certificate and applies all policies, making only permissioned internal web applications accessible to the user. If the policy allows the user access, Private Access identifies the best-path App Connector for the internal web application and connects them to it. When the Public Service Edge or Private Service Edge sends out a request to all App Connectors sitting at the application level, the App Connector sitting closest to the internal web application responds by connecting to the Public Service Edge or Private Service Edge.

The connections from user to Public Service Edge (or Private Service Edge) and App Connector to Public Service Edge (or Private Service Edge) are then stitched together forming a TLS-encrypted tunnel, creating a secure channel between the authorized user and the internal web application without granting network access.

To learn more, see About Browser Access.

Close
Close
Logging Streaming Service

The Log Streaming Service (LSS) provides real-time and historical visibility into the operation of Private Access by analyzing events reported, primarily by the Public Service Edges or Private Service Edges. In addition to real-time analytics and status, the LSS provides short- and long-term storage.

Information sent to the LSS includes user activity and status, App Connector status, and HTTP information related to Browser Access. The default fields in log templates created by Private Access include personally identifiable information (PII), however, your organization can create a custom log template that only captures specific fields.

The LSS has two components: a log receiver and an App Connector. It can stream logs from your Private Access tenant to a SIEM or log receiver you manage. You must specify the logs required for streaming in the Zscaler Admin Console.

Because Private Access was purpose built to ensure secure, private access to internal applications, the service does not store any information on any type of persistent media (i.e., disk) unless it is configured to do so by your organization. The information can also be obfuscated based on your organization's preferences.

To learn more, see About Log Streaming Service.

Close
Understanding Communication Between Components and Subsystems

All communication between Private Access components travel within a mutually pinned, client and server certificate-verified TLS connection. Within this TLS-encrypted Zscaler Tunnel (Z-Tunnel), a microtunneling protocol exists. Select components of Private Access run through this encrypted Microtunnel end to end.

Because client and server use pinned certificates, it is cryptographically impossible for Private Access to experience a Man-in-the-Middle (MITM) attack. The client certificates are verified against an organization's Certificate Authority (CA) and the server certificates are verified against Zscaler's CA, which cannot be spoofed by any third-party compromised CA.

All Zscaler certificates are signed through an offline-only, air-gapped, signing ceremony. Private Access only accepts connections from Zscaler Client Connector and the App Connector instances that present a client certificate signed by a CA associated with each tenant. Zscaler Client Connector and App Connector will only connect to Private Access service components that present a certificate signed by the Private Access infrastructure PKI.

All certificates used within the Private Access infrastructure, including all organization-operated systems, have private keys that never leave the physical device in which they were generated. The private keys for each organization's Central Authority (CA) are stored in encrypted format (i.e., AES256-GCM). Proper best practices for public key lifecycles are always maintained.

Zscaler Tunnel

A Zscaler Tunnel (Z-Tunnel) is a TLS-encrypted, mutually authenticated point-to-point connection between Zscaler Client Connector and a Public Service Edge managed by Zscaler, or it's between an App Connector and a Private Service Edge managed by an organization. A Z-Tunnel does not contain any direct IP data. An additional Z-Tunnel is created between Zscaler Client Connector and a Public Service Edge, or between an App Connector and a Private Service Edge, to support multi-tenancy in Zscaler Client Connector. This allows Zscaler Client Connector to establish a Z-Tunnel with the tenant and establish a separate Z-Tunnel with the partner tenant. The second Z-Tunnel works without any additional setup or configuration. Also, the Z-Tunnel can carry within it multiple communication channels called Microtunnels.

Z-Tunnels are authenticated using public key cryptography. Zscaler Client Connector and App Connectors are authenticated with the organization's public key infrastructure (PKI). Public Service Edges and Private Service Edges are authenticated with Zscaler's PKI. In addition to the certificate-based authentication already applied, the Z-Tunnel is further authenticated using SAML 2.0.

Microtunnel

A Microtunnel (M-Tunnel) is an end-to-end communication channel created between Zscaler Client Connector and an internal application via a Public Service Edge or Private Service Edge and an App Connector upon demand.

An M-Tunnel originates in Zscaler Client Connector when traffic from a client application (i.e., a web browser or SSH client) attempts to connect to an application server, which is associated with a synthetic IP address. The M-Tunnel extends to the Public Service Edge or Private Service Edge using a tag created by Zscaler Client Connector. The M-Tunnel then extends to the appropriate App Connector using a different tag chosen by that connector. Finally, the App Connector connects the M-Tunnel to the actual application server providing the service originally requested by the client application.

At no point in the communication is actual IP identification data passed. Instead, the combination of tags created by Zscaler Client Connector and the App Connector function similarly to the label stack in a Multiprotocol Label Switching (MPLS) network. Just as in an MPLS network, where the label-switched path (LSP) uniquely identifies a connection, Zscaler Client Connector and App Connector tags identify a unique connection for each application request.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
What Is Zscaler Private Access?
Understanding the Private Access Architecture
Step-by-Step Configuration Guide for Private Access
