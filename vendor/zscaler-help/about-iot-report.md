# About the IoT Report

**Source:** https://help.zscaler.com/zia/about-iot-report
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

The Internet of Things (IoT) Report shows the device inventory and its insights discovered from unauthenticated web traffic. Zscaler's AI/ML engine classifies all unauthenticated devices automatically to help generate the report. This provides awareness and insight into your organization's traffic discovered from different IoT devices, the number of devices connected from each device type, the number of devices discovered at each location, the applications they connect to, their traffic destinations, and more. The report is updated every 6 hours for the active devices discovered in the last 24 hours.

The IoT Report provides the following benefits and enables you to:

- Gain visibility and monitor the IoT devices connected to your organization's traffic.
- Discover shadow IoT and IT devices connected to your organization's network for threat assessment, which is difficult with legacy or traditional security solutions.
- Analyze and secure your organization's traffic from potential threats posed by diverse device environments.

## About the IoT Report Page

On the IoT Report page (click Analytics, enable the toggle Switch to Existing Reports, and then go to Internet & SaaS > Analytics > IoT Report), you can do the following:

- Filter the IoT report for locations that have IoT discovery enabled in your organization.

To generate the report, ensure IoT is enabled for that location on the Location Management page. Addition or removal of locations can take up to 24 hours to reflect in the location filter. The first report for any new location takes 24 hours to generate.

- Download the IoT report to a PDF file.
- **IoT Device Classification:** This section displays the top IoT device classifications and the number of devices connected from each classification within your organization. Click on an IoT classification to view details of all the devices for that classification; you are redirected to the Discovered Devices page. If you have more than 12 classifications, you see carousel buttons that allow you to scroll and see the other classifications you have.
- **IoT Device Distribution by Policy Status:** This section displays the IoT device distribution based on the status of the IoT policy. It shows the total number of IoT devices discovered, the number of IoT devices that have policies applied, and the number of IoT devices that have no policies. You can click on the device distribution bar chart to view details for the device; you are redirected to the Discovered Devices.
- **Device Type Distribution:** This pie chart displays the total number of devices connected to your organization's traffic and its distribution among various device types. The following device types are available in this section:
  - User Devices (Unmanaged user devices whose traffic does not flow via Zscaler Client Connector)
  - IoT Devices
  - Servers
  - Unknown (Devices not classified due to limited information for the AI/ML engine)

Click on a device type to view the details of all the devices for that device type, or click View All to see all of them; you are redirected to the Discovered Devices page.

- **Top User Device Classification:** This graph shows the top user device types and the number of users connected from each of these user device types. Click on a classification to view the details of all the devices for that classification; you are redirected to the Discovered Devices page.
- **Devices Location:** This section shows the total number of devices connected from different cities. You can:
  - Click on a city to view the details about the devices in that location. You are redirected to the Discovered Devices page.
  - Hover over a city to view the number of devices connected from the city, name of the city, state, and country.
