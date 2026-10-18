# Configuring the Postman REST API Client

**Source:** https://help.zscaler.com/legacy-apis/configuring-postman-rest-api-client
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400491, revision 3138013

---

Zscaler supports the Windows, macOS, and Linux versions of the Postman REST API app. To learn more about the app and its features, refer to the Postman documentation.
If you already have Postman installed and configured, you can download the latest version of the cloud service API and Sandbox Submission API Postman collection files from any article within the Reference Guide.
See image.
The Sandbox Submission API uses a base URL that is different from that of the cloud service API. It also requires an API token. Make sure that both are set properly within Postman for your Zscaler cloud. To learn more, see Getting Started.
# Installing and Configuring Postman for Windows, macOS, or Linux
To install and configure Postman:
- Go to the Postman website and download the app for your OS (i.e., Windows, macOS, or Linux).
For this example, the 64-bit version of the Postman application running on Windows is used to illustrate the instructions.
- Install the app.
- After installation, open the app and log in using your account.
- Download the latest version of the cloud service API collection file from the Reference Guide.
- From the main window, click Import.
See image.
Alternatively, go to the application menu on the top-left corner and click File > Import....
See image.
- In the Import window that appears, select your .postman_collection file or drag the file to the selection area.
See image.
After the file is imported, a new folder with the name used within the Postman collection file (e.g., cloud service API) is displayed within Collections.
- Ensure that No Environment is selected in the environment drop-down menu on the top right, and then click the Environment quick look icon.
- Click Add.
See image.
- On the New Environment tab that appears, complete the following steps:
  - Enter a descriptive name for the environment (e.g., Zscaler Test Environment).
  - Under Variable, enter url.
  - For Type, leave as default.
  - For Initial Value, enter https://zsapi.<Zscaler Cloud Name>/api/v1, where <Zscaler Cloud Name> is the cloud name provisioned for your organization by Zscaler (e.g., zsapi.zscalerbeta.net). To learn more, see What Is My Cloud Name for ZIA?
  - Click Save and close the tab.
See image.
Select the environment you configured (e.g., Zscaler Test Environment) from the environment drop-down menu on the top right. To learn more, refer to the Postman documentation.
See image.
# Authenticating a Session in Postman
After installing and configuring the Postman app, authenticate a session.
- Log in to the ZIA Admin Portal using your API admin credentials. To learn more, see Getting Started.
- Go to Administration > Cloud Service API Security > Cloud Service API Key.
- On the Cloud Service API Key tab, copy the Key.
- In the Postman app:
  - Click the Settings icon on the top right, and then choose Settings.
See image.
Alternatively, go to the application menu on the top-left corner and click File > Settings.
See image.
- Under the General tab, turn off SSL certificate verification.
See image.
- In the Postman collection you imported previously, select the POST Authenticate request.
See image.
- Go to the Pre-request Script tab and replace YourApiKey in the script with the Key you copied in step 3.
See image.
- Go to the request's Body tab and replace the username and password with your API admin credentials.
See image.
- Click Send.
If authentication is successful, a Status 200 OK message is returned, for example:
See image.
# Making an API Call in Postman
Make an API call using Postman. The following example shows how to look up categories for a specified list of URLs using /urlLookup:
- Make sure that you can authenticate successfully.
- Go to URL categories > POST URL lookup.
Click the request's Body tab to view the list of reconfigured URLs for which the lookup operation must be performed. You can look up a maximum of 100 URLs per request, with each URL not exceeding 1024 characters.
- Click Send.
If the request is successful, you should receive a Status 200 OK message and a response Body that looks as follows:
See image.
You can see the JSESSIONID under the Cookies tab.
See image.
By default, the session is terminated after 5 minutes and reauthentication is required.
