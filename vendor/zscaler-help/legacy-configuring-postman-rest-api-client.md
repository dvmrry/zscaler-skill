# Configuring the Postman REST API Client (ZIA API)

**Source:** https://help.zscaler.com/legacy-apis/configuring-postman-rest-api-client
**Captured:** 2026-04-26 via Playwright MCP (snapshot extraction).

---

Zscaler supports the Windows, macOS, and Linux versions of the Postman REST API app.

If you already have Postman installed and configured, you can download the latest version of the cloud service API and Sandbox Submission API Postman collection files from any article within the Reference Guide.

The Sandbox Submission API uses a base URL that is different from that of the cloud service API. It also requires an API token. Make sure that both are set properly within Postman for your Zscaler cloud.

## Installing and Configuring Postman for Windows, macOS, or Linux

1. Go to the Postman website and download the app for your OS.
2. Install the app.
3. After installation, open the app and log in using your account.
4. Download the latest version of the cloud service API collection file from the Reference Guide.
5. From the main window, click **Import**.
6. In the Import window, select your `.postman_collection` file or drag it to the selection area.
7. After the file is imported, a new folder (e.g., **cloud service API**) is displayed within **Collections**.
8. Ensure that **No Environment** is selected in the environment drop-down, then click the **Environment quick look** icon.
9. Click **Add**.
10. On the **New Environment** tab:
    - Enter a descriptive name (e.g., `Zscaler Test Environment`).
    - Under **Variable**, enter `url`.
    - For **Type**, leave as **default**.
    - For **Initial Value**, enter `https://zsapi.<Zscaler Cloud Name>/api/v1` (e.g., `zsapi.zscalerbeta.net`).
    - Click **Save** and close the tab.
11. Select the configured environment from the environment drop-down menu.

## Authenticating a Session in Postman

1. Log in to the ZIA Admin Portal using your API admin credentials.
2. Go to **Administration** > **Cloud Service API Security** > **Cloud Service API Key**.
3. On the **Cloud Service API Key** tab, copy the **Key**.
4. In Postman:
   - Click the **Settings** icon on the top right, then choose **Settings**.
   - Under the **General** tab, turn off **SSL certificate verification**.
5. In the Postman collection, select the **POST Authenticate** request.
6. Go to the **Pre-request Script** tab and replace `YourApiKey` in the script with the Key you copied.
7. Go to the request's **Body** tab and replace the username and password with your API admin credentials.
8. Click **Send**.

If authentication is successful, a **Status 200 OK** message is returned.

## Making an API Call in Postman

Example: look up categories for a list of URLs using `/urlLookup`:

1. Make sure you can authenticate successfully.
2. Go to **URL categories** > **POST URL lookup**.
3. Click the request's **Body** tab — you can look up a maximum of 100 URLs per request, each not exceeding 1024 characters.
4. Click **Send**.

If successful, you receive **Status 200 OK** and can see the `JSESSIONID` under the **Cookies** tab.

**Important:** By default, the session is terminated after **5 minutes** and reauthentication is required.
