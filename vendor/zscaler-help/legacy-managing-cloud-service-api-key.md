# Managing Cloud Service API Key

**Source:** https://help.zscaler.com/zia/managing-cloud-service-api-key
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400506, revision 3242995

---

After your API subscription is enabled, your organization's cloud service API key is initially provisioned by Zscaler, enabled, and displayed within the Cloud Service API Key page along with the base URL. An organization can only have one API key for the cloud service API. To learn more, see Getting Started.
To learn more about obtaining API keys or secrets to access Zscaler OneAPI endpoints, see Understanding OneAPI Authentication.
From the Cloud Service API Key page, you can do the following:
- Add a new API key.
- Your organization can only have one API key. You must delete the existing key before adding a new one.
- To add a new cloud service API key:
  - From the navigation menu, go to Administration > API > Internet & SaaS API.
  - On the Cloud Service API Key tab, make sure that you have deleted the existing key. After the key is deleted, the Add API Key option becomes available.
  - See image.
  - Click Add API Key.
  - You can immediately start using the new Key displayed on the tab.
- Edit the API key.
- This action cannot be undone.
- To edit the cloud service API key:
  - From the navigation menu, go to Administration > API > Internet & SaaS API.
  - On the Cloud Service API Key tab, click the Edit icon.
  - The Edit API Key window appears.
  - In the Edit API Key window, enter the New API Key. The new key must meet the following requirements:
    - The new key must be alphanumeric (i.e., A-Z, a-z, 0-9) and exactly 12 characters in length.
    - The new key cannot be the same as the current API Key.
  - See image.
  - Click Save.
  - After this, the old API key is immediately invalidated.
- Regenerate the API key.
- This action cannot be undone.
- To regenerate the cloud service API key:
  - From the navigation menu, go to Administration > API > Internet & SaaS API.
  - On the Cloud Service API Key tab, click the Regenerate icon.
  - The Regenerate API Key window appears.
  - In the Regenerate API Key window, click Regenerate API Key.
  - See image.
  - After this, a randomized key string is immediately generated and the old string is invalidated.
- Delete the API key.
- This action cannot be undone.
- To delete the cloud service API key:
  - From the navigation menu, go to Administration > API > Internet & SaaS API.
  - On the Cloud Service API Key tab, click the Delete icon.
  - The Delete API Key window appears.
  - In the Delete API Key window, manually enter CONFIRM and click Delete.
  - See image.
  - After this, the key is immediately removed and invalidated.
Your cloud service API key can be disabled by Zscaler or your service provider. The key might be disabled if your organization exceeds the threshold number of API calls allowed or the code developed for your organization violates Zscaler's terms and conditions. If this occurs, the ability to add, regenerate, or delete the key is removed and a Disabled status appears. You must contact Zscaler Support or your service provider to re-enable the key.
See image.
If your API subscription expires, you still have access to the Cloud Service API Key page, but you cannot make any modifications (i.e., you lose access to the POST and PUT actions within the API). Also, your existing API key is still valid but disabled. If this occurs, contact Zscaler Support. The API key is re-enabled after your subscription is renewed.
