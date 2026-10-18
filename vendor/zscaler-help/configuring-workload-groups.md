# Configuring Workload Groups

**Source:** https://help.zscaler.com/zia/configuring-workload-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1461746, revision 3239662

---

You can configure workload groups to apply security policies to the workloads deployed on the public cloud service provider such as the Amazon Web Services (AWS) platform. You can view all the workloads and their respective tags in Cloud Connector in the Zscaler Admin Console. A maximum of 8 key-value pairs can be used to build the expression for the workload group. To learn more, see About Workload Groups.
Only admins with full policy access can add or edit the workload groups.
To configure a workload group:
- From the navigating menu, go to Internet Access > Resources > Workload Groups.
- Click Add Workload Group.
- The Add Workload Group window appears.
- See image.
- In the Add Workload Group window:
  - Name: Enter a name for the workload group.
  - Description: (Optional) Enter additional notes or information about the workload group.
  - Tag Scope: Select one of the following tag scope for your workload group:
    - Cloud-Defined: This scope is an attribute defined by the cloud service provider (CSP). For example, Vpc-id is defined by the CSP.
    - User-Defined: This scope is a resource tagged with a key-value pair by the user configuration of the resource.
    - Any: This scope is a resource that can be either cloud-defined or user-defined.
  - Tag Type: Select a tag type to build an expression using tag keys and tag values for the workload group. To learn more, see Understanding Workload Groups.
    - For user-defined tag scope, you can select one of the following options from the drop-down menu:
      - Network Interface
      - Subnet
      - VM
      - VPC
    - For cloud-defined tag scope, the default Attribute tag type is automatically selected.
  - Tag Key: Search for and select a tag key or manually enter a custom tag key for the workload group.
    - To search for and select a tag key, in the Search Keys tab, configure the following filters. Zscaler runs a real-time query to fetch the workload tags from your selected source. Select a tag key from the drop-down list:
      - Source: Select your cloud service provider (e.g., AWS, GCP, or Azure).
      - Project: Select your GCP project. This field is only available if you select the source as GCP.
      - Subscription: Select your Azure subscription. This field is only available if you select the source as Azure.
      - Account: Select the ID of the account you created in Cloud Connector.
      - Region: Select the region for the cloud service provider account.
    - See image.
    - To enter a custom tag key, in the Manual Key tab, enter a tag key in the text box and click Add.
    - See image.
  - Tag Value: Select a tag value associated with the tag key or manually enter a custom tag value for the workload group.
    - To select a tag key, the Search Values tab automatically populates values based on the selected tag key.
    - See image.
    - To enter a custom tag value, in the Manual Value tab, enter a tag value for the selected tag key in the text box and click Add.
    - See image.
  - Click the Add+ icon within the inner tag expression to configure multiple key-value pairs for the same tag scope and tag type. These values are connected through AND or OR operations. You can click the operation sign to change the expression.
  - See image.
  - Click the Add+ icon in the outer tag expression to configure tags with different tag scopes and tag types that are connected through AND or OR operations. You can click the operation sign to change the expression.
  - See image.
- Click Show Expression to verify the tag expression you created for the workload group. This field displays a two-dimensional expression table with a single operator in each row and column.
- See image.
- Click Save and activate the change.
To delete an expression, click the Delete icon associated with the added tag expression.
See image.
