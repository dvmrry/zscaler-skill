# Using Custom PAC Files to Forward Traffic to Internet & SaaS

**Source:** https://help.zscaler.com/zia/using-custom-pac-file-forward-traffic-zia
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399446, revision 3233294

---

Zscaler allows you to host up to 10 versions of your custom PAC files at a time in the Zscaler Admin Console. You can create multiple versions for the same PAC file and can stage them for testing before deployment. When you add a PAC file, you can check its syntax and correct any errors before you save it.
Default PAC file limits:
- The number of PAC files allowed per organization is 256. Contact Zscaler Support to increase the limit of allowed PAC files to 1,024.
- The size limit of each PAC file that you can upload is 256 KB. Contact Zscaler Support to increase the PAC file size limit to a maximum of 2 MB.
PAC file changes immediately impact your organization's traffic. If you're editing a PAC file, verify the changes and apply them during your organization's maintenance window. Zscaler highly recommends that you save a copy of your current PAC file before applying any changes.
# Prerequisites
- Ensure that you review the best practices.
- Test the newly edited or created PAC file on a local machine before production deployment.
On the Hosted PAC Files page, you can:
- Add a Custom PAC File
- To add a PAC file to the Zscaler service:
  - Go to Infrastructure > Internet & SaaS > Traffic Forwarding > Hosted PAC Files.
  - The page lists the default PAC files and any other custom files that were uploaded to the Zscaler service.
  - Click Add PAC File.
  - See image.
  - In the Add PAC File window:
    - PAC File Name: Enter a name for the PAC file. The name you enter here applies to all the additional versions of the PAC file. The name cannot exceed 255 characters and cannot include spaces.
    - Description: Enter a description of the PAC file. The description cannot exceed 255 characters.
    - Domain: This field displays the domain name that your organization provided when it first registered. If there are multiple domain names, select the domain to which the PAC file applies. This selection applies to all the additional versions of the PAC file.
    - Obfuscate URL: Enable this field to obfuscate the PAC file URL. This selection applies to all the additional versions of the PAC file.
    - You cannot modify (enable or disable) the Obfuscate URL field for a saved PAC file as it changes the Hosted URL and causes a network shortage because the new Hosted URL must be redistributed to all your users. Users using the old Hosted URL are served by the default proxy PAC file instead of the intended custom PAC file. To prevent a shortage and ensure all users are using the new Hosted URL, follow these instructions.
      - On the Hosted PAC Files page, click the View icon corresponding to the PAC file for which you want to enable or disable the Obfuscate URL field.
      - On the Preview Version Details page, select the required version of the PAC file and copy the content to the clipboard.
      - Click Add PAC File on the Hosted PAC Files page.
      - In the Add PAC File window, enter the necessary information, such as name, description, and domain for the PAC file.
      - Ensure that you enable or disable Obfuscate URL.
      - In the PAC File Contents section, paste the content copied from the old PAC file.
      - Click Save and activate the change.
      - Distribute the new PAC file URL to your users.
    - PAC File Contents: Type or copy and paste your JavaScript. To learn more, see Writing a Pac File and Best Practices for Writing PAC Files.
    - You can also copy and expand the PAC file contents.
  - Click Verify PAC File to check for errors in the syntax.
  - See image.
  - An error message is displayed if the PAC file has errors. You can correct the PAC file and click Verify PAC File again to ensure that there are no errors, or you can save the PAC file with errors.
  - Click Save & Deploy and activate the change.
    - If the PAC file has no verification errors, enter a commit message in the window that appears and click Confirm. The message cannot exceed 255 characters.
    - See image.
    - If the PAC file has verification errors, complete the following sections in the window that appears:
      - Enter a commit message under the Save section. The message cannot exceed 255 characters.
      - Select I accept the risk under the Deploy section.
      - Click Confirm.
    - See image.
- Create a Branch for the Custom PAC File
- You can create multiple branches or versions for your PAC file. Zscaler allows you to host up to 10 versions of the PAC file at a time.
- When you create more than 10 versions, you are prompted to delete an older version of the PAC file. The versions that are deployed, staged for deployment, or marked as last known good are not available for selection.
- To create a new branch for the custom PAC file:
  - On the Hosted PAC Files page, click the View icon corresponding to the PAC file.
  - See image.
  - On the Preview Version Details page, select the version in the Preview field of the custom PAC file for which you want to view details.
  - See image.
  - Click Create Branch.
  - See image.
  - On the Create Branch page:
    - Select the version that you want to use as a template to create a new branch. You can also click the Menu icon to do the following actions:
      - Deploy
      - Mark as Last Known Good
      - Create Branch
      - Export
      - Stage Deployment
    - See image.
    - View the following information for the selected PAC file version:
      - PAC File Name: The name of the PAC file.
      - Description: Additional notes or information about the PAC file.
      - Domain: The Zscaler domain in which the PAC file is hosted.
      - Obfuscate URL: Displays whether the PAC file URL is obfuscated or not.
      - Status: Displays the verification and deployment status of the PAC file.
      - Last Modified On: The date the PAC file was last modified.
      - Last Modified By: The last admin username who modified the PAC file.
      - Commit Message: The message entered while saving this version of the PAC file.
    - See image.
    - Edit the PAC file contents.
    - Click Verify PAC File. You can save the PAC file with or without verification errors.
    - After PAC file verification, save and activate the changes:
      - Click Save.
      - Enter a commit message in the window that appears, and click Confirm to save the new version of the PAC file. The message cannot exceed 255 characters.
      - See image.
      - Click Save & Stage Deployment.
      - Enter a commit message in the window that appears, and click Confirm to stage the new version for testing before deployment. The message cannot exceed 255 characters.
      - See image.
      - You can stage only one PAC file version for deployment at a time, and the hosted URL for that PAC file is different from the deployed version. If you deploy the staged PAC file, then the hosted URL changes to the previously deployed version.
      - Click Save & Deploy to deploy the PAC file with immediate effect.
        - If the PAC file has no verification errors, enter a commit message in the window that appears and click Confirm. The message cannot exceed 255 characters.
        - See image.
        - If the PAC file has verification errors, complete the following sections in the window that appears:
          - Enter a commit message under the Save section. The message cannot exceed 255 characters.
          - Select I accept the risk under the Deploy section.
          - Click Confirm.
        - See image.
- Manage Different Versions of the Custom PAC File
- You can manage all branches of your PAC file in the Zscaler Admin Console. You can view the deployed version or any other version of the PAC file. You can also compare the contents of any two PAC file versions.
- To manage the custom PAC file versions:
  - On the Hosted PAC Files page, click the Manage Versions icon corresponding to the PAC file.
  - See image.
  - The Manage PAC File page appears.
  - On the Manage Versions tab, you can do the following:
    - Compare any two versions of the PAC file:
      - Click Compare Two Versions.
      - Select any two PAC file versions and then click Compare Two Versions again.
      - See image.
      - The comparison table for the selected versions is displayed, and the differences are highlighted.
    - View the following information:
      - Version: The version number of the PAC file.
      - Date Saved: Timestamp of when the content in the PAC file was last saved or when a new branch was saved.
      - Last Updated: Timestamp of when the PAC file was last updated.
      - Last Modified By: The last admin username who modified the PAC file.
      - Commit Message: The message entered while saving this version of the PAC file.
      - Hosted URL: The hosted URL of the PAC file.
      - Status: Indicates the verification status of the PAC file.
      - Action: Deploy, mark or remove the Last Known Good tag, create a branch, delete, or stage deployment for the PAC file version.
    - Click the version number to view more details of the PAC file. You are redirected to the Preview Version Details page for the selected PAC file version.
    - See image.
  - On the View Deployed Version tab, you can view the details of the currently deployed PAC file version.
  - See image.
- Delete a Custom PAC File Version
- Zscaler allows you to host up to 10 versions of the PAC file at a time. If you want to create an additional PAC file version (i.e., 11th version), you must delete an older version of that PAC file.
- To delete a custom PAC file version:
  - On the Hosted PAC Files page, click the Manage Versions icon corresponding to the PAC file.
  - See image.
  - The Manage PAC File page appears.
  - On the Manage Versions tab, locate the PAC file version you want to delete. In the Action column, click the Column Menu icon and select Delete.
  - The versions that are tagged as Deployed, Staged for Deployment, or Last Known Good cannot be deleted.
  - See image.
  - In the Delete PAC Version window that appears, read the warning message and click Delete.
  - See image.
- To delete all versions of a custom PAC file, click the Delete icon corresponding to that PAC file in the hosted PAC files table.
- See image.
# Next Steps
After adding the custom PAC file to the Zscaler Admin Console, you must:
- Distribute the PAC file URL to your users.
- Review the firewall requirements, and ensure that you have made the necessary configuration changes.
