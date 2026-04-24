# What Is Zscaler Deception?

**Source:** https://help.zscaler.com/deception/what-zscaler-deception
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler Deception is a simple, faster, and more effective targeted threat detection solution built on the Zscaler Zero Trust architecture. Deception uses advanced lures and decoys to detect and disrupt sophisticated threats that consistently bypass traditional defenses, such as advanced persistent threats (APT), exploits, reconnaissance, lateral movement, active directory, supply chain, human-operated ransomware, supervisory control and data acquisition (SCADA), and industrial control system (ICS) attacks.

As an integral part of the Zscaler Zero Trust Exchange, Deception integrates with Zero Trust, tracking the full attack sequence and initiating automated response actions across the Zscaler platform.

## Why Deception?

Attackers are becoming exceptional at exploiting organizations' growing attack surfaces. Advanced attacks bypass existing defenses. Detecting and containing them is challenging because:

- Advanced attacks are stealthy and 91% of attacks do not generate a security alert.
- Advanced attacks are human-operated and 68% of attacks do not use malware.
- Security teams have too many events to investigate because 45% of alerts are false positives.

Deception uses active defense techniques to make your network a hostile environment for attackers. It blankets your environment with decoys for all your IT artifacts. Decoys make your environment unpredictable and disrupt attackers' playbooks. Decoys lure attackers and detect advanced attacks without operational overhead or false positives.

## Key Features and Benefits

- **Ease of deployment:** Integration with the Zscaler Zero Trust Exchange allows for seamless deployment. Deception is cloud-delivered and scalable, and requires minimal on-premises computing.
- **Comprehensive coverage:** Threat detection for perimeter, applications, endpoints, active directories, cloud, and operational technology (OT) or internet of things (IoT) environments.
- **Extensive built-in decoys:** Easy to customize and manage decoys that engage savvy adversaries.
- **Disrupt advanced threats:** Detects and stops attackers across security infrastructure, including low-visibility paths like DC-to-DC and internal-traffic-to-DC.
- **Low false positives:** There is no legitimate business traffic to decoys, so any interaction with them is an immediate high-confidence signal of an ongoing breach.
- **Business risk awareness:** Aligns security controls tightly to areas with current business risks.
- **Orchestrated response:** Orchestrates complex scenarios with high-fidelity alerts. Takes precise action to shut down active attacks, driven by high-confidence alerts.
- **Active defense with the MITRE ATT&CK framework:** Delivers 99% of the capabilities covered in MITRE Engage.

## How Deception Works

### Administration

- **Licenses:** Deception issues a license to you when you subscribe.
- **User Roles** — at license and account level:
  - **Administrator:** configure Decoy Connector (virtual machines), deploy decoys, view and analyze events, and orchestrate actions.
  - **Analyst:** investigate events, block the attackers, and export logs.
  - **Responder:** analyze events and orchestrate actions.
  - **Super admin:** view and manage all features and configurations of Deception, such as configuring user roles, APIs, decoys, audit logs, etc.
- Custom roles with specific read and write permissions can be created.

### Configure Network Components

To place decoys on your network, Deception allows you to configure **Decoy Connectors** and connect them to the Zscaler Deception Admin Portal. Virtual LANs (VLANs) can be configured to deploy network decoys. If Zscaler Private Access (ZPA) is deployed for Zero Trust Network Access, Deception can be integrated with ZPA to deploy **Zero Trust Network (ZTN) decoys** without installing any additional network components or making any changes to network configurations.

### Configure and Deploy Decoys

Deception provides extensive built-in decoys across the kill chain that mimic production assets. Configurable decoy types:

- Network decoys
- Threat Intelligence (TI) decoys
- Active Directory (AD) decoys
- Endpoint decoys
- Cloud decoys

Miragemaker datasets make decoys more realistic-looking and scalable.

### Detect Threats

When an attacker infiltrates your network and interacts with the decoys, Deception detects threats, collects information on the attacker's actions and intentions, and generates high-fidelity and real-time alerts.

### Investigate

When alerts appear on the Deception Admin Portal, Deception captures threat intelligence data and reconnaissance activity in real time. **ThreatParse** conducts natural language reconstruction of attacks, summarizes log information, and translates it into plain English to help the SOC and analysts understand what the attacker is trying to accomplish.

### Orchestrate

Based on high-fidelity data, Deception lets you orchestrate (automate) and build rules to take immediate actions when events are discovered to contain threats.

### Remediate

When the attacker's intended targets are uncovered, Deception deploys additional decoys to validate remediation.
