# About Deception Strategy

**Source:** https://help.zscaler.com/deception/about-deception-strategy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1542436, revision 3221680

---

Adversaries penetrate the perimeter and access valuable resources in your network. A complete defense strategy can help you to detect threats. The Deception Strategy feature allows you to quickly configure Network decoys, Threat Intelligence (TI) decoys, Active Directory (AD) decoys, and Landmine policies on a single page. A strategy consists of predefined personalities that are built based on different types of servers, applications, IT infrastructure, users, etc. When you select a personality, the Network, TI, and AD decoy configurations such as hostname, FQDN, etc. are automatically configured along with the default services that are configured for the personality.
Personalities are a set of configurations that represent a specific type of service, application, or user. Identical personalities can be grouped together using tags such as OS Linux, Engineering, Databases, etc. When you select a tag, any one of the personalities is used. For example, when you select the Databases tag, the system selects one personality from a list of personalities tagged as Databases.
By default, Zscaler Deception provides built-in strategies that cover various business use cases to detect threats. You can create a custom strategy for your business needs.
After you create a strategy, you can deploy it using Internal or Zero Trust Network (ZTN) decoys.
Deception Strategy provides the following benefits and enables you to:
- Create optimal strategies to improve threat detection.
- Configure realistic-looking decoys that have services, names, or configurations that mimic real assets on your network.
# About the Deception Strategy Page
On the Deception Strategy page (Miragemaker > Strategy Builder > Deception Strategy), you can do the following:
- View a list of all the strategies. For each strategy, you can view:
  - Name: The name of the strategy.
  - Description: The description of the strategy.
  - Network Decoys: The personalities or tags used for creating network decoys.
  - Threat Intelligence (TI): The personalities or tags used in the TI decoy.
  - Active Directory: The personalities or tags used in the AD decoy.
  - Landmine: The personalities used on endpoints.
- Create a strategy.
- Export strategies.
- Download a strategy.
- Validate a strategy.
- Edit or delete a strategy.
