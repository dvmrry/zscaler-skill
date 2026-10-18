# What Is Zscaler Breach Predictor?

**Source:** https://help.zscaler.com/breach-predictor/what-zscaler-breach-predictor
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1500431, revision 3118888

---

The average time it takes a threat actor to move laterally beyond the point of compromise decreases every year. As a result, reactive breach response is no longer a practical strategy. To combat data breaches, Security Operations Center (SOC) teams must be proactive and have the ability to understand how threats propagate so that threat actors can be stopped preemptively. Breach Predictor is an essential part of your overall security ecosystem, anticipating threats, providing you context about those threats, and helping prevent threat actors from accessing sensitive data in your organization.
Breach Predictor protects your organization by providing:
- Enhanced Attack Visibility
- Breach Predictor leverages the power of machine learning to bring real-time insights into threat activity impacting users in your organization, mapped to the MITRE Adversarial Tactics, Techniques, and Common Knowledge (ATT&CK) framework techniques. Breach Predictor ingests and analyzes vast amounts of Zscaler and third-party data to provide actionable insights.
- The Breach Predictor Dashboard uses various charts and graphs to give you a high-level overview, with options to drill down to see log information on individual user activities as part of a larger whole. The main Sankey chart focuses on how many of your users are at risk, and tells you which threats are affecting them and which stage of an attack they are likely in (Discover Attack, Compromise, Lateral Movement, or Data Loss).
- The most prominent part of the Breach Predictor Dashboard is the Overall Breach Probability score, which gives you instant insight into your organization’s security posture. The score takes into account the number of observed malware families, their location on the MITRE ATT&CK matrix, and the number of affected users. A higher score indicates a higher probability that a breach will occur in your organization. To learn more, see About the Dashboard.
- On the Findings page, you can quickly see all threats affecting your organization, placed in the MITRE ATT&CK Mapping matrix. Breach Predictor uses the MITRE ATT&CK framework to provide a more granular set of techniques that fit within the traditional 4 stages of attack. This framework lets you see more precisely your current attack stage location, as well as where a threat is expected to move. The basic idea is that the further right you move on the MITRE ATT&CK matrix, the closer you are to a data breach. Breach Predictor lets you see the current position of a threat, as well as where it’s headed, so that you can preemptively fix policy issues. To learn more, see About Findings.
- The following table shows how MITRE ATT&CK techniques map to the 4 main stages of attack:
| Attack Stages | MITRE ATT&CK Techniques |
|---|---|
| Discover Attack | ReconnaissanceResource Development |
| Compromise | Initial AccessExecutionPersistencePrivilege EscalationDefense Evasion |
| Lateral Movement | Credential AccessDiscoveryLateral MovementCollection |
| Data Loss | Command and ControlExfiltrationImpact |
- Proactive Breach Risk Reduction
- Breach Predictor leverages AI-powered breach probability scoring and policy recommendations to preemptively eliminate attack paths, lowering your organization’s overall risk. It lets you quickly and easily analyze vast amounts of data from multiple log sources, peer best practices, current policy settings, and cutting-edge threat data from Zscaler ThreatLabz, the security research arm of Zscaler.
- When Breach Predictor identifies a problem, the interface lets you address the issue more effectively by focusing on the attack path instead of on individual users. That way, you don’t get bogged down in granular data and can make adjustments that protect your organization as a whole. For example, suppose a large number of users are accessing a suspect URL. Instead of focusing on individual data because of individual alerts, Breach Predictor identifies the attack path and aggregates all users impacted by the attack and exposed at a particular URL.
- See image.
- Improved Security Posture
- Breach Predictor eases burdens on SOC workflows by providing context for each threat, how many users the threat has impacted, and any updates that might need to be made to your organization's existing policies. Breach Predictor isn’t meant to replace reactive security tools; instead, it’s designed to work in tandem with those tools to improve visibility and communication across your organization.
- Perhaps your SOC team doesn’t normally focus on security issues at a policy level, opting instead to concentrate on higher-level operations activities so that engineering can focus on policy work. However, adversaries don't confine themselves to specific boundaries, and the ever-evolving security landscape requires that security teams take the same approach. Bad actors are looking for any vulnerability to exploit, so your security tools must give you a complete view across your organization.
- By linking predictive modeling with policy visibility and recommendations, Breach Predictor helps bridge the gap between operations and engineering, encouraging improved communication with fewer silos. With traditional detection, you respond to an intruder who is already in your environment. With Breach Predictor, your team won’t spend as much time reacting to individual alerts; instead, you can focus on proactively anticipating and cutting off your adversaries’ next moves. Breach Predictor can help your SOC team develop an overarching strategy to avoid reactivity and deal with issues at the root level so that operational solutions are more effective.
- See image.
In fact, Breach Predictor not only simplifies your toolset, but it is specifically designed to take pressure off of your SOC teams and your organization as a whole by predicting where threats will move so that you aren't addressing incidents and vulnerabilities after they've happened, and by giving you comprehensive visibility across your security landscape.
The following illustration provides a high-level look at the value Breach Predictor brings to your organization:
See image.
To learn more about how to use Breach Predictor, see Using Zscaler Breach Predictor and Understanding Zscaler Breach Predictor.
