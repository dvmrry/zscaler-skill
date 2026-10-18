# About Network Events

**Source:** https://help.zscaler.com/zscaler-cellular/about-network-events
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1518096, revision 3243214

---

The Network Events page offers a centralized interface for monitoring and analyzing network activity across all Zscaler SIMs provisioned to your organization. It provides detailed insights into network events and authorization events for each SIM. This comprehensive logging enables you to troubleshoot efficiently and ensure seamless connectivity.
The Network Events page provides the following benefits and enables you to:
- Track SIM transitions between online and offline states to ensure consistent network availability and performance.
- Access detailed logs of authorization events and connectivity changes to quickly identify and resolve issues.
- Gain centralized insights into network activity across all provisioned SIMs, improving oversight and management efficiency.
# About the Network Events Page
On the Network Events page (Infrastructure > Cellular > Network Events), you can do the following:
- Apply time filters to view log entries specific to that period.
- Refresh the page to fetch and show the latest data. This action does not remove the applied filters.
- Add or remove columns from the table.
- Show or hide filtering options.
- Filter network events based on different parameters.
- View a list of records of network events for all SIMs provisioned to your organization. For each record, you can see:
  - **ICCID**: The Integrated Circuit Card Identifier is a globally unique identifier assigned to each SIM card. It is used to track and manage the SIM within the network infrastructure. Click to view detailed information for each network event.
  - **Recorded at**: The date and time when the network event occurred.
  - **EID**: The Embedded Identity Document is a unique identifier for eSIMs. This is shown only if eSIMs are listed.
  - **IMSI**: The International Mobile Subscriber Identity is a unique number assigned to each mobile subscriber. It is used to identify the user on the mobile network.
  - **Country**: The geographical location (country) where the event was recorded.
  - **Operator**: The network operator handling the connectivity.
  - **Category**: The type of event (session start, session end, online/offline status, or authorization).
  - **Event Status**: The status of the network event.
  - **Event Sub Status**: The additional status details of the network event.
- Limit the number of records displayed per page. You can choose to display 10, 25, 50, or 100 records per page.
- Go to a specific page using the page number or move to the next or previous page.
