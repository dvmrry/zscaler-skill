# Understanding the ZDX Cloud Architecture

**Source:** https://help.zscaler.com/zdx/understanding-zdx-cloud-architecture
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Digital Experience Monitoring (ZDX) Help 
Understanding the ZDX Cloud Architecture
Digital Experience Monitoring (ZDX)
Understanding the ZDX Cloud Architecture
Ask Zscaler

With Zscaler Digital Experience (ZDX), organizations can fully monitor the cloud application experience simply and intuitively from the end user perspective. ZDX delivers holistic, end-to-end user experience monitoring across any network, helping IT teams streamline troubleshooting and improve user productivity.

ZDX provides application performance monitoring for customer-defined applications and predefined applications such as Zoom, Box, Salesforce, ServiceNow, and Microsoft 365 applications, including Microsoft Teams, SharePoint Online, OneDrive for Business, and Outlook.

ZDX Components

The ZDX architecture is built to scale with the monitoring requirements of our clients. The components of our solution are illustrated and described next:

End User Device Performance

The service continuously gathers and analyzes data on end user devices, resource utilization, health metrics, and multiple events such as CPU and memory usage, including Wi-Fi connectivity issues that impact the end user experience.

Close
Cloud Path Performance

Hop-by-hop network path metrics are measured and analyzed from end-to-end over time, from every user device to the application. With Cloud Path visibility, you can proactively detect and resolve end user connectivity issues to cloud applications, understand ISP usage, and gain visibility through the Zscaler cloud.

Close
Application Performance

ZDX continuously monitors and measures application metrics such as response time and DNS resolution, as well as broader availability metrics of the application.

Close
ZDX Scoring

An aggregated user experience performance score is tracked over time at the user, application, location, department, and organizational level. The ZDX Score ranks user performance and provides visualization for anomaly detection.

Close
ZDX Architecture

The ZDX solution architecture is composed of the following blocks:

ZDX Central Authority (CA)

The ZDX CA is the brain and nervous system of ZDX. It monitors the cloud and provides a central location for software and database updates as well as policy and configuration settings. The design is similar to that of the Internet & SaaS CA.

Zscaler Client Connector

The Zscaler Client Connector provides device metrics at negligible additional CPU consumption. The Zscaler Client Connector exchanges information with the telemetry and policy gateway to receive configuration from ZDX and reports metrics to the cloud service for consumption. The service also provides latitude and longitude coordinates for geolocation if the operating system location services are enabled.

Zero Trust Exchange (ZTE)

The ZDX cloud connects and authenticates to Internet & SaaS and Private Access clouds to retrieve users, departments, and locations. It also connects to the Zscaler Client Connector Portal for integrated management of Zscaler Client Connector and ZIA definitions. User-definition infrastructure and integration for ZDX standalone deployments without ZIA/ZPA services are also included.

Telemetry and Policy Gateway (TPG)

This is a multi-tenant RESTFUL application for traffic control. The TPG acts as a gateway for monitoring metrics, policies, and data lake. Zscaler Client Connector metrics are sent to Microsoft Azure Data Explorer (ADX) and policies are sent to the Zscaler Client Connector. This also includes a stateless design for scalability.

ZDX Admin Portal

With administrator access for configuration, reporting, alerting, and analysis, the ZDX Admin Portal integrates with ZIA/ZPA management to provide a centralized configuration. ZDX provides granular role-based access control with single sign-on (SSO) in the Zscaler Client Connector Portal for administrators.

ZDX Analytics

The ZDX cloud leverages the Microsoft ADX analytics service.

Call Quality Monitoring

The ZDX cloud integrates with Microsoft Graph API or Zoom to read meetings and call quality data. Customer-specific onboarding is needed so that ZDX can read call quality data.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
What Is Zscaler Digital Experience?
Understanding the ZDX Cloud Architecture
Using the ZDX Setup Wizard
Step-by-Step Configuration Guide for ZDX
Supported Versions & Feature Compatibility
Zscaler Service Continuity Customer Notification Protocol
