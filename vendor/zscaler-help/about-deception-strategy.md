# About Deception Strategy

**Source:** https://help.zscaler.com/deception/about-deception-strategy
**Captured:** 2026-04-24 via Playwright MCP.

---

Adversaries penetrate the perimeter and access valuable resources in your network. A complete defense strategy can help you to detect threats. The **Deception Strategy** feature allows you to quickly configure Network decoys, Threat Intelligence (TI) decoys, Active Directory (AD) decoys, and Landmine policies on a single page.

A strategy consists of predefined **personalities** that are built based on different types of servers, applications, IT infrastructure, users, etc. When a personality is selected, the Network, TI, and AD decoy configurations (hostname, FQDN, default services, etc.) are automatically configured.

**Personalities** are a set of configurations that represent a specific type of service, application, or user. Identical personalities can be grouped together using tags such as OS Linux, Engineering, Databases, etc. When you select a tag, any one of the personalities is used. For example, when you select the Databases tag, the system selects one personality from a list of personalities tagged as Databases.

By default, Zscaler Deception provides built-in strategies that cover various business use cases to detect threats. Custom strategies can be created for business-specific needs.

After a strategy is created, it can be deployed using **Internal** or **Zero Trust Network (ZTN)** decoys.

## Benefits

- Create optimal strategies to improve threat detection.
- Configure realistic-looking decoys that have services, names, or configurations that mimic real assets on your network.

## Deception Strategy Page

On the Deception Strategy page (Miragemaker > Strategy Builder > Deception Strategy):

- View a list of all strategies. For each strategy:
  - **Name**
  - **Description**
  - **Network Decoys** — personalities or tags used
  - **Threat Intelligence (TI)** — personalities or tags used
  - **Active Directory** — personalities or tags used
  - **Landmine** — personalities used on endpoints
- Create a strategy.
- Export strategies.
- Download a strategy.
- Validate a strategy.
- Edit or delete a strategy.
