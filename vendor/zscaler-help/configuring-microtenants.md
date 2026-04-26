# Configuring Microtenants

**Source:** https://help.zscaler.com/zpa/configuring-microtenants
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Within the Zscaler Admin Console, you can add Microtenants. For a complete list of ranges and limitations for Microtenants, see Ranges & Limitations.

To add a Microtenant:

1. Go to Administration > Admin Management > Private App Microtenants.
2. Click Add.

The Add Microtenant drawer appears.

3. In the Add Microtenant drawer:
   - **Name:** Enter a name for the Microtenant. The name cannot contain special characters, with the exception of periods (.), hyphens (-) and underscores (_).
   - **Status:** Enable the Microtenant. By default, this is disabled.

Users mapped to Microtenants that are using Private Service Edges for Private Access reauthenticate when the Microtenant is disabled. In addition, users that are mapped to a Microtenant are reassigned to the Default Microtenant when the Microtenant is disabled. Active sessions for the Microtenant are terminated when the Microtenant is disabled.

   - **Description:** (Optional) Enter a description for the Microtenant.
   - **Authentication Domain:** Select the available authentication domains from the drop-down menu. You can search for a specific authentication domain, click Clear All to remove all selections, or click the Delete icon next to the selected authentication domain to remove it. End users that are authenticated to the Private Access solution with the selected authentication domains are mapped to their relevant Microtenant. Private Access maps Microtenants that are at the top of the list first compared to Microtenants that are at the bottom of the list.
   - **Privileged Approvals:** Enable to allow users who don't have Authentication Domain-related access the ability to access the Microtenant within a privileged console. Users without the Authentication Domain only have access to Microtenants and privileged consoles assigned to them. After you enable Privileged Approvals for a Microtenant, you need to configure a privileged approval for that Microtenant to provide users without an Authentication Domain access. By default, this is disabled.

4. Click Save.
5. Copy the Admin ID and Password to your clipboard. You need it for authentication.

The Admin ID and Password are only available when adding a Microtenant. It is not available to access in the Zscaler Admin Console after you close the window, so store it in a secure location.

6. Close the window.

After configuring a Microtenant, there can be situations where users from one Microtenant need to access one or more application segments from another Microtenant. Applications that are present in a Microtenant can be shared with other Microtenants. If an application is not shared with any other Microtenant, it can be moved to the default tenant. To learn more, see Sharing Defined Application Segments and Moving Resources from a Microtenant.
