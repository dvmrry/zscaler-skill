# Understanding the Business Continuity Cloud Components

**Source:** https://help.zscaler.com/zia/understanding-business-continuity-cloud-components
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Traffic Forwarding 
Business Continuity 
Understanding the Business Continuity Cloud Components
Internet & SaaS (ZIA)
Understanding the Business Continuity Cloud Components
Ask Zscaler

The Zscaler-managed Business Continuity Cloud service includes two components, Private Policy Cache and Private PAC Servers, working with the ZIA Private Service Edges. These components apply the last known good policy configurations to the outgoing traffic and redirect traffic to the dedicated private cloud infrastructure during business continuity mode. Both Private Policy Cache and Private PAC Servers are deployed in redundant pairs in each Business Continuity Cloud site. They are managed by Zscaler and are subject to ongoing updates and enhancements at any time.

The ZIA Business Continuity Cloud only supports Z-Tunnel 1.0, PAC files, and GRE tunnel connectivity.

To learn more, see Understanding Zscaler-Managed Business Continuity Cloud.

Private Policy Cache

This component is integrated into the ZIA Private Service Edge infrastructure and acts as a local repository for policy configurations, ensuring business continuity when Zscaler cloud is unreachable.

During public cloud software upgrades, the Business Continuity Cloud upgrade is delayed on purpose to prevent upgrade-related issues. This also delays the update of any new policies or configurations to support fault isolation.

Key Benefits

Private Policy Cache provides the following benefits:

Ensures the last known good policies are available when the Zscaler cloud is inaccessible.
Continuously fetches and syncs tenant-specific configurations (location, users, groups, etc.) during normal operations.
Automatically integrates version upgrades to ensure consistency in functionality.
Supports a seamless switch between public and private clouds in business continuity mode.
Functionality

Private Policy Cache supports the following functionalities:

During normal operations:
Fetches and stores tenant-specific configurations from the cloud and syncs them regularly to be readily available in business continuity mode.
Serves as the primary control path for local Service Edge instances, ensuring up-to-date policy availability for business continuity.
During business continuity:
Facilitates access to applications with full cyber and data protection.
Operates independently of public clouds to maintain security policies.
Private PAC Servers

This component hosts the client's PAC files and reroutes traffic to the business continuity private cloud during critical failures.

Functionality

Private PAC Servers support the following functionalities:

During normal operations:
Receives and locally stores PAC files from the public cloud for each Business Continuity Cloud site.
Ensures stored PAC files are geographically and health-aware for seamless failover.
During business continuity:
Hosts disaster recovery PAC files to redirect client requests to the appropriate Business Continuity Cloud.
Provides geo-awareness, allowing Zscaler Client Connector to connect to the nearest Business Continuity Cloud based on its IP address or location.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding Zscaler-Managed Business Continuity Cloud
Understanding the Business Continuity Cloud Components
