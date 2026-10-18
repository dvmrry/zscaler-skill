# Updating the Host OS and Software Packages

**Source:** https://help.zscaler.com/zpa/updating-host-os-and-software-packages
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484916, revision 3243383

---

Software components are licensed so that Zscaler can periodically update their software. However, updates to the host operating system (OS) and software packages are the organization's responsibility. Zscaler ensures that the virtual machine software is the latest version. Software components refer to App Connectors, Private Service Edges for Private Access (ZPA), Private Cloud Controllers, and Network Connectors. The software component is designed to be compatible with updates to the host OS. To learn more, see Managing Deployed Software Components.
You can use this article to update RHEL 9.4 and 9.5 to RHEL 9.6 and later.
# Prerequisites
Before you update a software component's host OS, ensure the following prerequisites are met:
- Determine the frequency that the host OS should be updated. Zscaler recommends updating the OS at least every 5 weeks.
- Validate the software components and connectivity to the update servers.
- For prebuilt images, software components must be provisioned to a Private Access tenant to receive software updates via the OS package manager.
For enhanced security, you must use the passwd command to change the credentials on the default admin account if you have not already done so.
- Enter the admin credentials for the software component:
login: admin Password: *******
- Test connectivity by running the following command:
curl https://yum.private.zscaler.com
This validates that connectivity to the specific update URL is working. If you are waiting for the command to time out, and you don't get any errors, you must troubleshoot connectivity. To learn more, see Troubleshooting App Connectors, Troubleshooting Private Service Edges, or Troubleshooting Private Cloud Controllers.
# Updating the Host OS and Software Packages
The update of the host OS is scheduled according to local policy. Zscaler recommends notifying users of the potential for rolling reconnections during the update window. Each software component is estimated to be down for 20 minutes during the update.
To avoid application access and performance issues, you should not upgrade all App Connectors within an App Connector group or Private Service Edges within a Private Service Edge group at the same time. You can upgrade multiple App Connectors or Private Service Edges in a group simultaneously, provided that there are enough running App Connectors or Private Service Edges in the group to handle the traffic load.
Starting with App Connector version 24.650.4 and later, a version check and automated upgrade are performed during an initial connection. To learn more, see Zscaler Trust.
For host OS and software package updates, choose the component you want to update:
- App Connector
  - (Optional) Disable the App Connector you want to update.
  - When you disable the App Connector in the Zscaler Admin Console prior to stopping the service and updating, Private Access no longer routes new connections through the component and existing connections will continue through to their conclusion. If you stop the service without first disabling the App Connector and allowing traffic to drain, it results in forced connection resets for users connected through that App Connector.
    - Log in to the Zscaler Admin Console.
    - From the navigation menu, go to Private Access > Private Infrastructure > App Connectors.
    - Click the Edit icon for the App Connector you want to update.
    - Select Disabled under Status to disable the individual App Connector in the group.
    - See image.
    - Access the App Connector Status log type in the Zscaler Admin Console to view the list of currently active App Connectors to make sure any existing or long-lived critical transactions have ended or stopped.
  - Log in to the App Connector console using your admin credentials.
  - Stop the ZPA service using the following command:
- $ sudo systemctl stop zpa-connector
  - Remove all cached files using the following command:
- $ sudo yum clean all
- Only use this command when Disaster Recovery Mode or Business Continuity is not activated, and the system has full access to the repository.
  - Using the following commands, remove old packages that are not used:
- sudo yum remove --oldinstallonly -y sudo yum autoremove -y
  - After stopping the ZPA service and removing the old packages, log in and enter the following command to update the local system software:
- $ sudo yum update -y
  - After completing the update, reboot the App Connector using the following command:
- $ sudo reboot
  - After the reboot, go to the Zscaler Admin Console and click the Edit icon for the App Connector.
  - Select Enabled to enable the App Connector.
- See image.
  - Click Save.
- Private Service Edge
  - (Optional) Disable the Private Service Edge you want to update.
    - Log in to the Zscaler Admin Console.
    - From the navigation menu, go to Private Access > Private Infrastructure > Private Service Edges.
    - Click the Edit icon for the Private Service Edge that you want to update.
    - Select Disabled under Status to disable the individual Private Service Edge in the group.
    - See image.
    - Access the Private Service Edge Status log type in the Zscaler Admin Console to view the list of currently active Private Service Edges to make sure any existing or long-lived critical transactions have ended or stopped.
  - Log in to the Private Service Edge console using your admin credentials.
  - Stop the zpa-service-edge using the following command:
- sudo systemctl stop zpa-service-edge
  - Remove all cached files using the following command:
- $ sudo yum clean all
- Only use this command when Disaster Recovery Mode or Business Continuity is not activated, and the system has full access to the repository.
  - Using the following commands, remove old packages that are not used:
- sudo yum remove --oldinstallonly -y sudo yum autoremove -y
  - After stopping the ZPA service and removing the old packages, log in and enter the following command to update the local system software:
- $ sudo yum update -y
  - After completing the update, reboot the Private Service Edge using the following command:
- $ sudo reboot
  - After the reboot, go to the Zscaler Admin Console and click the Edit icon to edit the Private Service Edge.
  - Select Enabled to enable the Private Service Edge.
- See image.
  - Click Save.
- Private Cloud Controller
  - (Optional) Disable the Private Cloud Controller you want to update.
    - Log in to the Zscaler Admin Console.
    - From the navigation menu, go to Infrastructure >Business Continuity > Private Cloud Controllers.
    - Click the Edit icon for the Private Cloud Controller that you want to update.
    - Select Disabled under Status to disable the individual Private Cloud Controller in the group.
    - See image.
    - Access the Private Cloud Controller Status log type in the Zscaler Admin Console to view the list of currently active Private Cloud Controllers to make sure any existing or long-lived critical transactions have ended or stopped.
  - Log in to the Private Cloud Controller console using your admin credentials.
  - Stop the zpa-pcc-service using the following command:
- $ sudo systemctl stop zpa-pcc
  - Remove all cached files using the following command:
- $ sudo yum clean all
- Only use this command when Disaster Recovery Mode or Business Continuity is not activated, and the system has full access to the repository.
  - Using the following commands, remove old packages that are not used:
- sudo yum remove --oldinstallonly -y sudo yum autoremove -y
  - After stopping the service and removing the old packages, log in and enter the following command to update the local system software:
- $ sudo yum update -y
  - After completing the update, reboot the Private Cloud Controller using the following command:
- $ sudo reboot
  - After the reboot, go to the Zscaler Admin Console and click the Edit icon for the Private Cloud Controller.
  - Select Enabled to enable the Private Cloud Controller.
- See image.
  - Click Save.
- Network Connector
  - (Optional) Disable the Network Connector you want to update.
    - Log in to the Zscaler Admin Console.
    - From the navigation menu, go to Private Access > VPN (for Legacy Apps) > Network Connectors.
    - Click the Edit icon for the Network Connector you want to update.
    - Select Disabled under Status to disable the individual Network Connector in the group.
    - See image.
    - Access the Network Connector Status log type in the Zscaler Admin Console to view the list of currently active Network Connectors to make sure any existing or long-lived critical transactions have ended or stopped.
  - Log in to the Network Connector console using your admin credentials.
  - Stop the ZPA service using the following command:
- $ sudo systemctl stop np-connector
  - Remove all cached files using the following command:
- $ sudo yum clean all
  - Using the following commands, remove old packages that are not used:
- sudo yum remove --oldinstallonly -y sudo yum autoremove -y
  - After stopping the ZPA service and removing the old packages, log in and enter the following command to update the local system software:
- $ sudo yum update -y
  - After completing the update, reboot the Network Connector using the following command:
- $ sudo reboot
  - After the reboot, go to the Zscaler Admin Console and click the Edit icon for the Network Connector.
  - Select Enabled to enable the Network Connector.
- See image.
  - Click Save.
