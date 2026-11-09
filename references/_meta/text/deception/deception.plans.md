# Deception Standard and Advanced plans: decoy counts, Gen AI decoys, orchestration and API access (deception.plans)
Also called: deception standard; deception advanced; deception limits; deception ranges and limitations; how many decoys; deception api access; deception license

Deception has two plans, Standard and Advanced, and the limits are per organization. All values are per organization unless noted; raising limits or upgrading from Standard to Advanced goes through the account team or Zscaler Support, and after a plan switch only the active plan's features remain enabled. [deception.plans:plan-rules] A Deception Standard or Advanced plan included with a ZIA or ZPA edition can be claimed only with a minimum of 1,000 users in the subscription. [deception.plans:bundle-minimum]

**Decoys.** Standard includes 20 decoys and Advanced 300; Windows high-interaction virtual machine decoys, high-interaction container decoys and Gen AI decoys are Advanced only. [deception.plans:decoy-limits] The plan's decoy count is the sum of Threat Intelligence, network, cloud (Azure and AWS) and Active Directory decoys; landmine decoys are counted separately, daily, as the sum of Client Connector, standalone and agentless landmine decoys. [deception.plans:decoy-count-composition] The number of Decoy Connectors equals the number of decoys in the license, subject to system limitations. [deception.plans:connectors-equal-decoys] At most 10 network decoys can have custom services enabled, and at most 5 high-interaction containers are allowed per license. [deception.plans:decoy-caps]

**Orchestration.** Standard supports built-in orchestration rules only; custom rules, enrichment, SIEM forwarding, containment, Zscaler Sandbox, managed threat hunting and Private Access containment integrations are Advanced only; email notifications are limited to 500 per day. [deception.plans:orchestrate]

**Enterprise features.** In the Enterprise settings table, single sign-on and audit logs are supported on both plans; API access is not supported on the Standard Plan and supported on the Advanced Plan; custom roles are listed only in the Advanced Plan column (Standard lists predefined only). [deception.plans:enterprise]

What to check:
1. Which plan the tenant has before answering whether Gen AI decoys, custom orchestration rules, SIEM forwarding, Private Access containment or API access are available.
2. For a Deception entitlement that came with a ZIA or ZPA edition, whether the subscription has at least 1,000 users.

Area: deception.plans, its subjects in references/_meta/spine/deception/deception.plans.json
