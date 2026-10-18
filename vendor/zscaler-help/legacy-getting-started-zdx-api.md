# Getting Started

**Source:** https://help.zscaler.com/legacy-apis/getting-started-zdx-api
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1397211, revision 3180039

---

To get started on ZDX API, you must meet the prerequisites. Then, you must have access to the base URL and authenticate to create an API session. Afterwards, you can then make an API call to one of the many ZDX API endpoints that are available to you.
# Prerequisites
Your organization must meet the following prerequisites before you can access the ZDX API:
- Create an API key.
- Be a ZDX Advanced Plan User.
If you need to obtain API keys, authenticate into, and make calls using Zscaler OneAPI endpoints, see About API Clients in Authentication Service and Getting Started with OneAPI.
# ZDX API Access
After the prerequisites are met, you can access the ZDX API by:
- Step 1: Access the base URL and your API key.
- The base URL for ZDX API is /api/<Zscaler Cloud Name>.net/v1 or /api/<Zscaler Cloud Name>.net/v2. Check which Zscaler cloud name was provisioned for your organization and use it to replace <Zscaler Cloud Name>. For example:
  - If your organization is provisioned for v1 and the zdxcloud, then your base URL is: /api/zdxcloud.net/v1.
  - If your organization is provisioned for v2 and the zdxcloud, then your base URL is: /api/zdxcloud.net/v2.
- The API key includes an API Key ID and API Key Secret that are required to access the ZDX API and to create a bearer access token.
- Step 2: Authenticate and create an API session.
- Before making any API calls, you must retrieve your authorization token (Bearer <access_token>). The API key is passed onto subsequent calls for authentication.
- To authenticate via the API and generate a Bearer <access_token>, you need the following:
  - key_id: The API Key ID assigned and created for you on the ZDX Admin Portal.
  - key_secret: The API Key Secret assigned and created for you on the ZDX Admin Portal.
- If you do not know your key ID or key secret, or to learn more about obtaining them, see Managing API Keys.
- After you have all of these details, you can start to generate the Bearer <access_token>.
- The highlighted green text indicates the information to be entered.
  - Send a POST request to /oauth/token with the following parameters:
  - POST https://api.zdxcloud.net/v2/oauth/token Accept: application/json Content-Type: application/json { "key_id": "key_id", "key_secret": "key_secret" }
    - Example POST request for sign in using Python.
    - import requests import io import hashlib import time import json from datetime import datetime, timezone # The following is an example of an API Key file downloaded from the ZDX key management UI. #{ # "key_id":"33Xxbd2hgtWdx2EjPxbIlZsaJESWH1jEyk2DXGzGgm5YHF2Va6D9ZCCgLkqhiHT5", # "key_secret":"aoQGJ5IHHza9eFGDmCyJMWxsAYQIRc3QFku9Qcx8YDVl7oUWX4GfWSAsuFMP9cD8" #} # Add the keyID and keySecret from the API Key file that is downloaded or copied from the ZDX Key Management UI. keyID = "33Xxbd2hgtWdx2EjPxbIlZsaJESWH1jEyk2DXGzGgm5YHF2Va6D9ZCCgLkqhiHT5" keySecret = "aoQGJ5IHHza9eFGDmCyJMWxsAYQIRc3QFku9Qcx8YDVl7oUWX4GfWSAsuFMP9cD8" payload = { 'key_id': keyID, 'key_secret': keySecret } response = requests.post('https://api.zdxcloud.net/v2/oauth/token', headers={'Content-Type' : 'application/json', 'accept' : 'application/json'}, data=json.dumps(payload)) accessToken = "" if response.status_code == 200: print("auth successful") accessToken = response.json()['token'] print(accessToken) else: raise Exception("auth failed")
  - View a successful response to the POST request. The following is an example of a successful response:
  - HTTP/1.1 200 OK { "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5qVkJSalk1TURsQ01VSXdOelU0UlRBMlF6WkZNRFE0UXpRMk1EQXlRalZETmprMVJUTTJRZyJ9.eyJzdWIiOiIxJnpqJjd1MGRpaG5zNHRoM3B0NyZzMW9tMmI2dXNsOSIsImF1ZCI6InpzY2FsZXJ0d28ubmV0LjEyMTk5MDAiLCJpYXQiOjE2NDM0MTU5NDMsImV4cCI6MTY0MzQxOTU0M30.OV7JDeqjYTolbsSB2JGbKtvq8tgnIxC9UNWRUliE2g6ST6olV-wxjAZ2iyjQP6DEJedgvZBLrbMfaLTcvUpcNZYXWIr_VlFjE3qxd50FSp0zPAWvB2QJahyYr40pL9WPMkxuCV_z-P7tnAYxaW8BaYC03s0HcEBgzh6GaMfH4pSXd7Cxh0vNAbNtPsfOpjifoOeTpbbwzyTGm6QXd0MuG7ttZgT9D1mVmurM5LHJF0YQXmZWGAu-dwKqcKWrCdHYdp4hfuMLFnSmEjYyKeglcYalxaQL4ZPxnGcOLPm4t7iRc2iYmU0FJjq1ZJpKHy04EyUnOvuPc8mCxV79HfVSUsB0SkIxoH2CoFAdrgwlqln-jaaDcy5M86soSdpUUKNj3tu2syf8Ch8ZT6TtpxjyQ5G_BsOl-up-JklsiRG2-Chftt2MT8NFZaRp0n8pH7J4Pl-hQbsQKtxOZvNRW2m7GZ8BOR7nWvXgMSzykiwXueHZRfTUHHOw-yxZtwcdwJRAPIml40FMub52ov7_ir866ro_ZggAcVkikdnQnKfmja-D1lIg2ZvP03MOfaPz9ww5ocfG3swylwqPPEK2FtRjMf4L1so2sJUsNqdU_10q7I5LvGh3yqCYaYSeU6fFNiopC0ntIbZ17OZDJjdjEOml_pT6GDvnI4T_H2rfze0c1Fk", "token_type": "Bearer", "expires_in": 3600 }
- Upon successful authentication, a bearer token will last 3,600 seconds or 60 minutes.
- Step 3: Make an API call.
- Try making an API call. In the following example, you can start a deep trace for a particular device.
- Send a POST request to /device/{deviceid}/deeptraces.
- POST https://api.zdxcloud.net/v2/devices/30989301/deeptraces Accept: application/json Content-Type: application/json Authorization: Bearer <token obtained from /oauth/token POST earlier> { "deviceid": "30989301" }
- When you send requests to the API, you must include an Authorization header with the bearer token obtained from the initial authentication to the API. If there is a failure to pass a valid bearer token, the result is a 401 Unauthorized error response from the API server.
- A successful response to this POST request would be:
- HTTP/1.1 200 OK { "trace_id": 1, "status": "started", "expected_time": 7200 }
- After receiving a successful response, you can use the GET request to retrieve information such as Web probe metrics, Cloud Path probe metrics, and health metrics from the deep tracing session has been completed. You can also submit a DELETE request to stop a deep trace before the duration expires.
To learn more about rate limiting and HTTP status codes, see Understanding Rate Limiting and Understanding Error Codes. If you encounter any issues with the API, contact Zscaler Support.
