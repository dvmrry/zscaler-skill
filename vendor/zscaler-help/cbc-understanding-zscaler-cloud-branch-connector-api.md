# Understanding the Zscaler Cloud & Branch Connector API

**Source:** https://help.zscaler.com/legacy-apis/understanding-zscaler-cloud-branch-connector-api
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1447251, revision 3243491

---

The Zscaler Cloud & Branch Connector API gives you programmatic access to the following Zscaler Cloud & Branch Connector features:
- Authentication
- Authentication API resources allow you to authenticate and create an API session, check for an existing API session, and delete an API session. To learn more, see:
  - Reference Guide > Authentication
  - Getting Started
- Activation
- Activation API resources allow you to activate your configuration changes by pushing them to the Central Authority (CA). In order for any configuration changes to take effect, the Zscaler service requires you to activate the changes. To learn more, see:
  - Reference Guide > Activation
  - Getting Started
- Admin & Role Management
- Admin & Role Management API resources allow you to retrieve admin user and role information to configure the level of access admins have in the Zscaler Cloud & Branch Connector Portal and API. These resources also allow you to add, update, or delete admins within your organization. To learn more, see:
  - Reference Guide > Admin and Role Management
  - Admin and Role Management
  - Getting Started
- Cloud & Branch Connector Groups
- Cloud & Branch Connector group API resources allow you to apply policies to a group of deployed Cloud & Branch Connectors. They also make it easy to upgrade Cloud & Branch Connectors belonging to the same group to maintain redundancy while upgrades are being executed. To learn more, see:
  - Reference Guide > Cloud & Branch Connector Groups
  - Cloud & Branch Connector Group Management
  - Getting Started
- DNS Control Forwarding Rule
- DNS Control Forwarding Rule API resources allow you to retrieve DNS forwarding rules. These resources allow you to create, update, or delete DNS forwarding rule configuration. To learn more, see:
  - Reference Guide > DNS Control Forwarding Rule
  - Traffic Forwarding
- DNS Gateway
- DNS Gateway API resources allow you to retrieve the list of DNS gateways. To learn more, see:
  - Reference Guide > DNS Gateway
  - About DNS Gateways
- Forwarding Gateways
- Forwarding Gateways API resources allow you to retrieve the list of available ZPA application segments. To learn more, see:
  - Reference Guide > Forwarding Gateways
  - Forwarding Methods
- Location Management
- Location Management API resources allow you to retrieve location and location template information. These resources also allow you to create, update, and delete location templates. To learn more, see:
  - Reference Guide > Location Management
  - Location Management
- Log and Control Forwarding
- Log and Control Forwarding API resources allow you to retrieve the list of forwarding rules. These resources allow you to create, update, or delete forwarding rule configurations. To learn more, see:
  - Reference Guide > Log and Control Forwarding Rule
  - About Log and Control Forwarding
- Partner Integrations
- Partner Integrations API resources allow you to retrieve Amazon Web Services (AWS) accounts, AWS account group information, Microsoft Azure accounts, and supported regions. These resources also allow you to create, update, and delete AWS accounts, AWS account groups, and Azure accounts. To learn more, see:
  - Reference Guide > Partner Integrations
  - Cloud Connector Partner Integrations
- Policy Management
- Policy Management API resources allow you to create and update traffic forwarding rules and retrieve the list of available rules and the count of rules using the following endpoints. To learn more, see:
  - Reference Guide > Policy Management
  - Traffic Forwarding
- Policy Resources
- Policy Resources API endpoints allow you to create and manage specific objects used in policy configuration, such as IP & FQDN groups, network services, and ZPA application segments. To learn more, see:
  - Reference Guide > Policy Resources
  - Firewall Filtering
- Provisioning
- Provisioning API resources allow you to retrieve available API keys and regenerate new API keys. To learn more, see:
  - Reference Guide > Provisioning
  - Managing Credentials Using API
- Workload Groups
- Workload groups API resources allow you to retrieve the list of workload groups. To learn more, see:
  - Reference Guide > Workload Groups
- Zero Trust Gateway
- Zero Trust Gateway (ZTGW) APIs allow you to create or update ZTGWs, retrieve ZTGWs, configuration status, number of ZTGWs per organization, etc. To learn more, see:
  - Reference Guide > Zero Trust Gateway
  - What Are Zero Trust Gateways?
Prior to using the API, Zscaler recommends that you review Getting Started for information regarding prerequisites, authentication, and making API calls.
For information on rate limits, see Understanding Rate Limits. To learn more about HTTP status codes, see API Response Codes and Error Messages. If you encounter any issues with the Zscaler Cloud & Branch Connector API, contact Zscaler Support.
