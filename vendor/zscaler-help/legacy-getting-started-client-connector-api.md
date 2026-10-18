# Getting Started

**Source:** https://help.zscaler.com/legacy-apis/getting-started-client-connector-api
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1416776, revision 3092956

---

Your organization must meet the following prerequisites before you can access the Zscaler Client Connector API:
- You must enable the API for your organization. To enable the API, contact Zscaler Support or submit a Zscaler Support ticket.
- Add an API key.
If you need to obtain API keys, authenticate into, and make calls using Zscaler OneAPI endpoints, see About API Clients in Authentication Service and Getting Started with OneAPI.
After these prerequisites are met, you can:
- Locate your base URI
- The base URI for the API is /public/v1 for the following:
  - The endpoint to get a one-time password (OTP).
  - The endpoint to get all passwords in the app profiles.
  - The endpoint to get device details.
  - The endpoint to remove devices from the Zscaler Client Connector Portal.
- To learn more, see Zscaler Client Connector API Reference Guide.
- Authenticate and create an API session
- Before executing any API calls, you must first authenticate via the API. Send a POST request to the /login endpoint with the following parameters:
  - apiKey: A string that contains the API client ID. To learn more, see About API Key Management.
  - secretKey: A string that contains the client secret. The client secret is only available to copy when adding an API key.
- Before making any API calls, you must retrieve your authorization token (JWT Token<jwtToken>). The authorization token is passed onto subsequent calls for authentication.
- To authenticate via the API, use the following Python script to sign in and get the JWT Token<jwtToken>. In your script, enter the actual API key and actual secret key. These are highlighted in red.
- import requests url = "https://mobile.<cloudName>.net/papi/auth/v1/login" payload={"apiKey":"{apiKey}","secretKey":"{secretKey}"} headers = { 'Content-Type': 'application/json' } response = requests.request("POST", url, headers=headers, json=payload) print(response.text)
- Example POST request for sign-in using a Python script:
- import requests url = "https://mobile.<cloudName>.net/papi/auth/v1/login" payload={"apiKey":"b26j87u0-51n5-4th3-p278-m2b6usl9ca11","secretKey":"42bjp311-51j8-4s61-95jx-n7bbx10e5130"} headers = { 'Content-type': 'application/json' } response = requests.request("POST", url, headers=headers, json=payload) print(response.text)
- The client secret (i.e., secret key) is only accessible within the Zscaler Client Connector Portal when the API key is created for the first time. Ensure to copy your client secret to the clipboard when you first create your API key. The authentication token expiry time is set to 3600 seconds (one hour) by default.
  - View an example response.
  - { "jwtToken" : "eyJraWQiOiI0bzZFS1k4STFqS1kwN2tQdjlqWV9", "message" : null }
- Make an API call
- After you have your authorization token, you can make an API call. Send a GET request to the /getOtp endpoint to get a one-time password for a specific device.
- Use the following Python script to get a one-time password. In your script, enter the actual Unique Device Identifier (UDID) and JWT token. These are highlighted in red.
- import requests url = "https://mobile.<cloudName>.net/papi/public/v1/getOtp?udid={udid}" headers = { "auth-token":"{jwtToken}" } response = requests.request("GET", url, headers=headers) print(response.text)
- Example GET request to get the OTP using a Python script:
- import requests url = "https://mobile.<cloudName>.net/papi/public/v1/getOtp?udid=253B446D-D4A2-1F3E-DFAC-A51EDA415A55:705" headers = { "auth-token":"eyJraWQiOiI0bzZFS1k4STFqS1kwN2tQdjlqWV9" } response = requests.request("GET", url, headers=headers) print(response.text)
  - View an example response.
  - { "otp" : "kg08abdcp1" }
- When making API calls, consider the following best practices:
  - Use UTF-8 encoding for all endpoints (e.g., use the encodeUriComponent() function in JavaScript to encode to UTF-8).
  - When updating a resource, always send a GET request before the PUT or POST request. This retrieves the current values for the resource before you update the entire resource with new values. After the update, the next GET request for that resource returns the new values. By using this practice, you avoid potentially missing updates between GET and PUT or POST calls.
  - Prevent API call caching by adding a dummy argument with a randomly generated number to all URL request strings. For example: GET /getOtp?_=123456?
  - Create a dedicated user for each script. Don't use the same keys in multiple scripts that are running concurrently.
To learn more about rate limits and HTTP status codes, see Understanding Rate Limiting and About Error Codes. If you encounter any issues with the API, contact Zscaler Support.
