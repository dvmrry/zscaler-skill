# What the Microsegmentation Flow, Agent and Overview dashboards and the Application Map show (zms.dashboards)
Also called: zms dashboards; microsegmentation flow dashboard; microsegmentation application map; zms overview dashboard; zms agent dashboard

The Flow dashboard shows at most 10 top metrics per category and its time range filter runs from 1 Hour to 14 Days. [zms.dashboards:flow-top10]

**Flow dashboard.** The Flow dashboard counts talkers by Source IP and Protocol and listeners by IP, Protocol and Listening Port, and has a panel for flows between agents and resources not connected to any agents. [zms.dashboards:flow-panels]

**Agent dashboard.** The Agent dashboard filters agent data from 1 Hour to 14 Days, selects agents by type (Virtual Machines, Kubernetes Node or Kube Connector), and graphs CPU usage and memory of the agent and system for one or several selected agents. [zms.dashboards:agent-dashboard]

**Overview dashboard.** The Overview dashboard reports host agent status as Connected, Disconnected or Error, Kubernetes agent status as Connected or Disconnected, and licensed versus connected agents; its resource and resource-group protection panels (Protected or Unprotected) can be downloaded as CSV. [zms.dashboards:overview-status-panels] The Overview dashboard shows how many ML resource group recommendations and ML tag recommendations have been found and lets the admin review them. [zms.dashboards:overview-ml-counts]

**Application Map.** By default the Application Map displays the first resource group in alphabetical order; the Resource Group filter can be reset to show all, and further filters cover timeframe and AppZone for resource groups or VPCs/VNETs. [zms.dashboards:appmap-defaults] Clicking a resource group on the Application Map shows its managed and unmanaged flows and, if applicable, offers to review policy recommendations based on those flows. [zms.dashboards:appmap-click]

**Related.** Log pages behind these views are in [What the Microsegmentation Data Explorer log pages list: flow logs, aggregations, connection status, telemetry and events](kb:zms.analytics), and the recommendations reached from the map in [How Microsegmentation flow-based policy recommendations are generated, organized and accepted](kb:zms.policy-recommendations).

What to check:
1. Whether the period asked about falls inside the 1 Hour to 14 Days range of the Flow and Agent dashboards.
2. Which resource group the Application Map is showing before reading it as the whole environment.

Area: zms.dashboards, its subjects in references/_meta/spine/zms/zms.dashboards.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.analytics.md (What the Microsegmentation Data Explorer log pages list: flow logs, aggregations, connection status, telemetry and events)
- links-to references/_meta/text/zms/zms.policy-recommendations.md (How Microsegmentation flow-based policy recommendations are generated, organized and accepted)
