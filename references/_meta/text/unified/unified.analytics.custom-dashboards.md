# Experience Center custom dashboards: data sources, templates, sharing roles, delete and PDF export (unified.analytics.custom-dashboards)
Also called: custom dashboards; analytics custom dashboards; share custom dashboard; blank dashboard

Besides the preconfigured dashboards, admins can create custom dashboards (Analytics > Custom Dashboards) focused on the metrics most important to them, viewing real-time data and sharing the dashboards with others in the organization in similar or related job functions. [unified.analytics.custom-dashboards:what-it-is] A custom dashboard's data source types correspond to the categories of analytics dashboards (Networking, Cybersecurity, Risk360, Digital Experience, Data Security and Operational), and a custom dashboard can contain widgets from multiple data sources. [unified.analytics.custom-dashboards:data-sources] ZIA's own dashboard customization is a different feature, held in [ZIA dashboards, widgets and notes: predefined dashboards, limits, units, time frames and drill-down](kb:zia.insights.dashboards). The pages do not state limits on dashboards, widgets or share recipients, say whether shared viewers see data their own role would hide, or define the Operational data source [gap:unified.analytics.custom-dashboards:limits-and-scope].

**The list.** The list shows the dashboards the admin created and those shared with them; among its filters are Last Modified, Created On (Last 1 Day to Last 90 Days) and Created By, and it searches by part of the name or description, and its Name and Action (share, rename, duplicate, delete) columns cannot be hidden; Shared With gives the number of users the dashboard is shared with. [unified.analytics.custom-dashboards:list-page]

**Creating and managing.** A dashboard can be created from scratch or from templates Zscaler provides: the admin chooses a data source template (such as Cybersecurity or Networking) with preloaded widgets that can be modified or removed, or Blank Dashboard; widgets can be moved, resized and relocated and the time range adjusted, and the dashboard is named and described through the Actions icon's Rename. [unified.analytics.custom-dashboards:create] A dashboard opens in edit mode; it can be exported to a PDF that Zscaler downloads to the admin's computer, widgets are added from the widget library, and for many widgets the Time Range icon selects a preset or custom range. [unified.analytics.custom-dashboards:edit-and-export] Only dashboards the admin created can be deleted, and the deletion is confirmed by typing CONFIRM in the dialog box. [unified.analytics.custom-dashboards:delete]

**Sharing.** A dashboard is shared with people in the organization as Viewer (can view but not edit) or Editor (can edit the widgets and layout); for either access type the users cannot delete it, access can be changed or removed with Remove Access, and Copy Link copies the dashboard's direct link. [unified.analytics.custom-dashboards:sharing]

Not known (open gaps):
- Custom dashboard limits, viewer data scope and the Operational data source [gap:unified.analytics.custom-dashboards:limits-and-scope]: settled by tenant-data or support-ticket

Area: unified.analytics, its subjects in references/_meta/spine/unified/unified.analytics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.insights.dashboards.md (ZIA dashboards, widgets and notes: predefined dashboards, limits, units, time frames and drill-down)
