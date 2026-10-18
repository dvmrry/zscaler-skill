# What Is Zscaler Cellular?

**Source:** https://help.zscaler.com/zscaler-cellular/what-zscaler-cellular
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1518216, revision 3188786

---

Zscaler Cellular is a comprehensive solution designed to provide secure, scalable, and efficient connectivity for IoT and mobile devices on a Zero Trust architecture. It includes two key products: Zscaler SIM and Zscaler Cellular Edge. This offering enables organizations to secure cellular traffic seamlessly while leveraging Zscaler's industry-leading Zero Trust Exchange (ZTE) for policy enforcement, visibility, and control. Zscaler Cellular addresses the growing challenges of securing billions of cellular-connected IoT devices and mobile endpoints, particularly in environments where traditional security solutions fail to scale. The solution integrates into existing telecom infrastructure to deliver a secure and unified connectivity experience, ensuring:
- Accessibility: Secure access to devices worldwide on any protocol.
- Security: Network segmentation, least-privilege access, full visibility, and no attack surface.
- Simplification: Streamlined management of cellular estates through a Network-as-a-Service model.
- Connectivity: Global connectivity with regional egress and multi-operator coverage.
Zscaler Cellular ensures secure traffic steering, eliminates the risk of lateral movements, and provides centralized visibility and control over all cellular data.
# Key Features and Benefits
Zscaler Cellular combines simplified provisioning, intelligent traffic management, and robust Zero Trust policy enforcement to deliver unparalleled security and usability for cellular-connected devices. With features like IP address, IMEI, or IMSI-based policy constructs, real-time logging, and centralized dashboards, organizations gain:
- Near-Instant Deployment: Streamlined provisioning with minimal changes to telecom infrastructure.
- No Client-Side Software: Eliminates the need for software agents on endpoints.
- Granular Control: Enables precise policy enforcement for SIM-connected devices.
- Full Traffic Visibility: Offers centralized monitoring of telemetry metrics, including SIM activity and anomaly detection.
- Eliminated Attack Surface: Prevents lateral movement within networks by enforcing Zero Trust principles.
- Improved Performance: Optimizes routing for reduced latency and enhanced device connectivity.
By leveraging the ZTE, Zscaler Cellular seamlessly integrates with policies in Zscaler Internet Access (ZIA) and Zscaler Private Access (ZPA) to provide visibility and scalability for IoT devices, addressing challenges such as carrier inefficiencies and security gaps in public cellular networks.
# How Does Zscaler SIM Work?
- Device Connection: An IoT or mobile device equipped with Zscaler SIM connects to public 4G/5G networks.
- Traffic Forwarding: Zscaler SIM routes cellular traffic to the nearest Zscaler Cellular Edge, which acts as the bridge between the telecom network and Zscaler. The Cellular Edge then forwards traffic to the ZTE, which inspects and enforces security policies.
- Policy Application: Traffic is subjected to ZIA or ZPA policies based on predefined constructs (e.g., IP address, IMEI, and IMSI).
- Visibility and Control: Administrators access centralized dashboards to monitor traffic, enforce policies, and generate reports.
# Use Cases by Industry
- Critical Infrastructure: Secure connectivity for railway systems, power grids, and other critical operational technology systems.
- Industrial IoT: Secure telemetry for connected machinery and logistics equipment.
- Retail: Enable secure point-of-sale (POS) systems and kiosks.
- Mobility: Provide connectivity for connected vehicles and EV chargers.
- Logistics/Transportation: Secure upload of telemetry data and connected cabins.
