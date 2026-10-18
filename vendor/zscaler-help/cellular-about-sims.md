# About SIMs

**Source:** https://help.zscaler.com/zscaler-cellular/about-sims
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1519081, revision 3243197

---

A Zscaler SIM—both physical SIMs and eSIMs—serves as the gateway for a cellular-connected device to access the Zero Trust Exchange (ZTE). It is a data-only SIM that integrates directly with the ZTE, providing seamless security for IoT devices such as vending machines, EV chargers, machinery, and tablets/kiosks where agent-based solutions are not feasible. You can view essential details and statuses, and manage Zscaler SIMs provisioned to your organization, in the Zscaler Admin Console.
Zscaler SIMs provide the following benefits and enable you to:
- View critical information for each device, such as ICCID, IMEI, IP address, and data usage, and track its status and connectivity.
- Identify high-usage or offline devices. Use this information to address issues proactively and ensure seamless connectivity or update the SIM status.
# About the SIMs Page
On the SIMs page (Infrastructure > Cellular > SIMs), you can do the following:
- View the total data usage across all SIMs in the current view. If filters are applied, the Total Usage field shows only the data across the SIMs that match the applied filters.
- Update SIM Status or IMEI for multiple SIMs. This option is displayed only when a SIM is selected.
- Download the list of all SIMs and their details as a CSV file for the current view. If filters are applied, the downloaded file contains only the details of the SIMs that are shown for the selected filters.
- Refresh the page to fetch and show the latest data. This action does not remove the applied filters.
- Add or remove columns from the table.
- Show or hide filtering options.
- Filter the SIMs page based on different parameters.
- View the list of all Zscaler SIMs provisioned for your organization. For each SIM, you can see:
  - **ICCID**: The Integrated Circuit Card Identifier is a globally unique identifier assigned to each SIM. It is used to track and manage the SIM within the network infrastructure.
  - **EID**: The Embedded Identity Document for the eSIM.
  - **IMEI**: The International Mobile Equipment Identity is a unique identifier for the mobile device associated with the SIM. It helps with identifying and managing the devices in the network.
  - **IMSI**: The International Mobile Subscriber Identity is a unique number assigned to each mobile subscriber. It is used to identify the user on the mobile network.
  - **MSISDN**: The Mobile Station International Subscriber Directory Number is the associated mobile number of the SIM, if applicable.
  - **IP Address**: The IP address assigned to the device using the SIM, allowing it to connect and communicate over the internet.
  - **Form Factor**: The type of SIM, indicating whether it is a physical SIM or an eSIM.
  - **Device Manufacturer**: The name of the company that produces the device associated with the SIM.
  - **Device Model**: The full official identifier of the type of device associated with the SIM.
  - **Device Type**: The category of the device associated with the SIM (e.g., router, modem, and IoT gateway).
  - **Operating System**: The operating system running on the device associated with the SIM.
  - **Usage**: The amount of data consumed during the session (the duration between the start of the network connection and its termination), displayed in MB or GB.
  - **Status**: The operational state of the SIM, either **Active** (available for use) or **Inactive** (not in use).
  - **Country**: The country where the SIM is located.
  - **Tags**: The tags associated with the SIM. You can click a specific tag to filter the SIMs page and display only the SIMs that have the tag associated with them.
  - **Connection**: The connectivity state of the SIM.
    - **Online**: The SIM is connected to the network.
    - **Offline**: The SIM is disconnected from the network.
    - **Inventory**: The SIM is ready for assignment, or if already assigned, awaiting profile registration on a device. This option applies only to eSIMs.
    - If an eSIM was originally assigned to a user and then released back to the inventory, the connection state might not be updated on the SIMs page. You can refresh the connection state by viewing the eSIM details.
- View detailed information for each SIM.
- Edit status, update the IMEI, or update tags for a particular SIM.
- Limit the number of records displayed per page. You can choose to display 10, 25, 50, or 100 entries per page.
- Go to a specific page or move to the next or previous page.
