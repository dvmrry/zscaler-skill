# About Factors

**Source:** https://help.zscaler.com/risk360/about-factors
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1452786, revision 3165422

---

The Factors page shows the list of contributing factors that are affecting your organization's risk score. The Risk360 service quantifies each factor according to its risk weight, which then adds to your overall organization risk score and also maps these factors to various renowned risk and security frameworks such as MITRE and NIST. The service also supports integration with other vendors like CrowdStrike to gather data for risky events and activities and translate them into Risk360 factors to provide a holistic risk-management experience.
The Factors page provides the following benefits and allows you to:
- Analyze each contributing factor influencing your organization's risk score.
- View the factors from different perspectives to better understand the factors affecting your organization's risk score.
# About the Factors Page
On the Factors page, in the top right, you can select how you want to view the page. Based on your selection, the page updates to the following views:
- Attack-Based
- The attack view shows the factors in a single list.
- In this view, you can:
  - Export the factors contributing to your organization's risk score into a CSV file. The downloaded file shows all the factors contributing to your organization's risk score, irrespective of any filter selected at the time of the download.
  - Switch to the entity-based view (**Tree View**).
  - View the category-based risk score for your organization.
  - Search for a factor.
  - View a list of all the contributing factors to your organization's risk score. For each factor, you can see:
    - **Factor Name**: The name of the contributing factor affecting the risk score.
    - **Category**: The type of risk the factor represents, such as lateral propagation or data loss.
    - **Your Score**: The score for the contributing factor. The total score for a factor depends on its severity (0 being a healthy score).
    - **Last 30 Days**: A graph showing the last 30-day score trend for that factor.
    - **Entities**: The entities affected by the factor, such as third parties, applications, workforce, or assets.
    - **Licensed?**: Whether you are subscribed to the feature required to implement the recommended action (**Y** for Yes and **N** for No).
    - **Recommended Actions**: The recommended actions proposed to attain a healthy risk score.
    - Click any of the columns (except **Licensed?**, **Include**, or **Entities**) to view more information about the factor in the drawer view:
      - Drawer
      - The drawer consists of the following tabs:
## Details
      - On the Details tab, you can view the following information:
        - The name of the factor.
        - **Severity**: The severity of the factor, such as critical, high, or medium.
        - **Recommended Actions**: The recommended actions proposed to attain a healthy risk score.
        - **Description**: Detailed information about the factor, useful help article links, and a link that redirects you to the admin portal for the Zscaler service that is responsible for the factor, if available.
        - **Notes**: Any notes that you added. Click the **Edit** or **Delete** icon to modify or delete the note, respectively.
        - **Related Recommendation Cards**: The related discovered problems and their recommendations.
      - Each problem or factor affecting your organization's risk is visualized in the form of cards on the Insights Page.
## Compliance
      - On the Compliance tab, you can view a list of recognized cybersecurity frameworks and their control IDs mapped to the factor. If you click the control ID, you're redirected to the framework's website, where the control IDs are explained in detail. To learn more, see Assessing Compliance.
  - Choose whether to include or exclude the factor from risk score computation. By default, this option is enabled for all factors. You can exclude a factor if you have a compensating control over the factor or any other reason, but you must provide an explanation. Compensating controls are supplementary security measures that are implemented to protect against identified risks or threats (e.g., multi-factor authentication, firewalls, antivirus software). The changes you make are captured in the audit logs with your username and the reason you provide for the change.
  - See image.
- Entity-Based
- The entity-based view shows the factors listed within their category.
- In this view, you can:
  - Export the factors contributing to your organization's risk score into a CSV file. The downloaded file shows all the factors contributing to your organization's risk score, irrespective of any filter selected at the time of the download.
  - Switch to the attack-based view (**List View**).
  - Filter factors for specific entities by clicking the entity tiles. To deselect an entity, click it again.
  - View the contributing factors to your organization's risk score. For each factor, you can see:
    - **Factor Name**: The name of the contributing factor affecting the risk score.
    - **Recommended Actions**: The recommended actions proposed to attain a healthy risk score.
    - **Licensed?**: Whether you are subscribed to the required feature to implement the recommended action (**Y** for Yes and **N** for No).
    - **Your Score**: The score for the contributing factor. The total score for a factor depends on its severity (0 being a healthy score).
    - **Last 30 Days**: A graph showing the last 30-day score trend for the factor.
    - **Include**: Whether the factor is enabled for risk score computation.
    - Click any of the columns (except **Licensed?** or **Include**) to view more information about the factor in the drawer view:
      - Drawer
      - The drawer consists of the following tabs:
## Details
      - On the Details tab, you can view the following information:
        - The name of the factor.
        - **Severity**: The severity of the factor, such as critical, high, or medium.
        - **Recommended Actions**: The recommended actions proposed to attain a healthy risk score.
        - **Description**: Detailed information about the factor, useful help article links, and a link that redirects you to the admin portal for the Zscaler service that is responsible for the factor, if available.
        - **Notes**: Any notes that you added. Click the **Edit** or **Delete** icon to modify or delete the note, respectively.
        - **Related Recommendation Cards**: The related discovered problems and their recommendations.
## Compliance
      - On the Compliance tab, you can view a list of recognized cybersecurity frameworks and their control IDs mapped to the factor. Click on the control ID; you're redirected to the framework's website where the control IDs are explained in detail. To learn more, see Assessing Compliance.
  - Choose whether to include or exclude the factor from risk score computation. By default, this option is enabled for all factors. You can exclude a factor if you have a compensating control over the factor or any other reason, but you must provide an explanation. Compensating controls are supplementary security measures that are implemented to protect against identified risks or threats (e.g., multi-factor authentication, firewalls, antivirus software). The changes you make are captured in the audit logs with your username and the reason you provide for the change.
  - See image.
  - Show or hide the factors for a specific category.
