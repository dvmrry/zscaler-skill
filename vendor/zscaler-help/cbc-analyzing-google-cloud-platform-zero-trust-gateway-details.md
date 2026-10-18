# Analyzing Google Cloud Platform Zero Trust Gateway Details

**Source:** https://help.zscaler.com/cloud-branch-connector/analyzing-google-cloud-platform-zero-trust-gateway-details
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540927, revision 3226029

---

The Google Cloud Platform (GCP) Gateway page provides management and operational information about the selected gateway. You can access the GCP Gateway page by selecting a GCP gateway on the GCP Gateway page.
GCP gateways are in Limited Availability. To enable this feature, contact Zscaler Support.
# Analyzing the GCP Gateway Page
On the GCP Gateway page, you can view the following:
- Dashboard
- On the Dashboard tab, you can view the following gateway details:
  - In the Gateway Info section:
    - Name: The name of your GCP gateway.
    - Status: The service status of the GCP gateway (i.e., Healthy, Unhealthy, or Not Available).
    - Zero Trust Gateway ID: The Zscaler internal ID that identifies the resource.
    - Cloud Provider: The cloud provider type (i.e., Amazon Web Services or Google Cloud Platform).
    - Created Date: The date and time when the GCP gateway was created.
    - Last Modified On: The date and time when the GCP gateway was last modified.
    - Intercept Deployment Group: A GCP-provided resource that allows the Zscaler service to intercept and inspect workload traffic from your VPCs. To learn more, see About Google Cloud Platform Zero Trust Gateways.
  - In the Regions And Location section:
    - Region: The name of the GCP region where the GCP gateway is deployed. To learn more about supported regions, see Supported Regions for Zero Trust Gateways.
    - Location Template: The location template name of the GCP gateway.
    - Availability Zones: The IDs of availability zones where the GCP gateway is deployed.
    - Location: The location name of the GCP gateway.
  - In the IAM Principals section:
    - Users: The users entered as principal types when adding an IAM principal.
    - Groups: The groups entered as principal types when adding an IAM principal.
    - Service Accounts: The service accounts entered as principal types when adding an IAM principal.
    - To learn more, see Adding a Google Cloud Platform Zero Trust Gateway.
- Status
- The Status tab displays the status of the GCP gateway. The Zscaler service refreshes the status when you refresh the page. The tab displays the following information about GCP availability zones:
  - Internet: The ability of the GCP gateway to reach Internet & SaaS.
  - Local Egress: The ability of the GCP gateway to forward direct traffic.
  - Private Applications: The ability of the GCP gateway to reach Private Access.
- The corresponding status can be one of the following:
  - Healthy: The backend traffic in the availability zone is functioning as expected.
  - Unhealthy: The traffic is being dropped because there is no healthy backend processing.
  - Degraded: The traffic might have lost redundancy, but it is still being forwarded.
- Intercept Information
  - Intercept Endpoint Group: The name of your project-wide resource that allows you to access a Zscaler-managed security service in GCP. To learn more, see About Google Cloud Platform Zero Trust Gateways.
  - Project: The GCP project where you created the intercept endpoint group. To learn more, refer to the GCP documentation.
- Config
- The Config tab displays a table with the following details about Internet & SaaS configuration versions that have been activated:
  - Version: The version of the Zscaler configuration that was activated.
  - Submitted On: The date and time the configuration was activated.
  - Status: The status of the version (i.e., Active or Inactive).
- The GCP gateway can reject a configuration that you activate if it makes the GCP gateway unable to function properly. The most recent configuration versions are typically active. If the latest configuration version is not active, the GCP gateway might have rejected the configuration. You can compare two configuration versions by selecting the checkboxes and clicking Compare Versions.
- Analytics
- On the Analytics tab, you can select Timeframe, Statistics, and Type to display values from CloudWatch.
- You can configure settings for the graph to display the following:
  - Timeframe: Select a time frame to view data within that range. The graph automatically selects the number of data points based on the time frame you select.
  - Stat: Select Average, Max, or Sum to view the average, maximum, or total amount of data. If the stat for that type is not calculated, the graph returns no value.
  - Type: Select a type to modify what data the graph displays:
    - Total Bytes Processed: The total number of bytes processed by the internal load balancer during the selected time frame. This includes traffic sent to and from the destination, but not traffic from health checks.
    - Total Packets Processed: The total number of packets processed by the internal load balancer during the selected time frame.
- Events
- On the Events tab, you can select a Timeframe to view events that occurred within the range:
  - Event: The event that occurred
  - Category: The category of the event
  - Type: The type of event that occurred
  - Start Time: The date and time when the event started
  - Status: The status of the event
- Traffic Simulation
- On the Traffic Simulation tab, you can check whether the endpoint can send the traffic through the Zero Trust Exchange (ZTE). You can also send egressing traffic out through the Zscaler service in Internet & SaaS. You can test your forwarding and Internet & SaaS policies by creating a traffic test. The Zscaler service sets up a virtual environment in the Zscaler GCP account and sends traffic through the endpoint to execute the test. The result of the test appears as the output of the GCP curl command. A test created in one GCP gateway is available in all the GCP gateways created in that Cloud Connector account in all regions.
- If you navigate to the GCP Gateways page or the Endpoints page while the test environment is active, a connected VPC endpoint that is the Zscaler account is shown.
- Click Create Test Environment to create a test environment. After approximately 5 minutes, the test environment is created. The test environment lasts for one hour. During that time, an endpoint appears on your GCP gateway with the Zscaler account as its associated account. If you need more time, click Renew and the test environment lasts for one more hour. When the test environment is in the CREATE_COMPLETE state, you can run the test.
- Click New Test to save configuration parameters, which allows you to define GCP curl parameters. In the Create a New Test window:
  - Name: Enter a name for the test.
  - Description (Optional): Enter a description for the test.
  - Protocol: Enter HTTP or HTTPS as the protocol for the test.
  - URL: Enter the URL of the website you are testing.
  - Commands (Optional): Enter the GCP curl command parameters to test and fetch information about a website.
  - Verbose (-v): Select the checkbox to enable verbose, which instructs the curl command to provide information on the website being tested.
  - Insecure (-k): Select the checkbox to enable insecure, which instructs the curl command to not verify the certificate.
- In the table, you can view the following for each test:
  - ID: The ID of the traffic test.
  - Name: The name of the traffic test.
  - URL: The URL associated with the traffic test.
  - Type: The type of traffic test performed.
  - Description: The description of the traffic test.
  - You can also edit, delete, or run a test after a test environment has been created. If a test environment has not been created, run is not an option and the icon does not appear.
