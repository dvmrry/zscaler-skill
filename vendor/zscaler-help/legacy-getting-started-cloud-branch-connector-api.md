# Getting Started

**Source:** https://help.zscaler.com/legacy-apis/getting-started-cloud-branch-connector-api
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1447241, revision 3160749

---

Your organization must meet the following prerequisites before you can access the Zscaler Cloud & Branch Connector API:
- You must enable the API for your organization. To enable the API, contact Zscaler Support or submit a Zscaler Support ticket.
- You must have your Admin Role configured with **API Key Management** permission in the Zscaler Cloud & Branch Connector Admin Portal.
- You must add an API key.
Once these prerequisites are met, you can:
- Access your base URL and API key
- You can access your base URL and API key from the **API Key Management** page (**Administration** > **API Key Management**) in the Zscaler Cloud & Branch Connector Admin Portal. To learn more, see API Key Management.
- Authenticate and create an API session
  - Obfuscate the API key using one of the following obfuscateApiKey() implementation methods:
  - PHP
  - PHP Implementation:
  - /** * @param int $obfuscateTimestamp in MICROseconds * @param string $apiKey * @return string */ private static function obfuscateApiKey($obfuscateTimestamp, $apiKey) { $n = substr($obfuscateTimestamp, -6); $r = $n >> 1; $r = str_pad($r, 6, '0', STR_PAD_LEFT); $obfuscatedApiKey = ''; for ($i = 0; $i < strlen($n); $i++) { $pos = substr($n, $i, 1); $obfuscatedApiKey .= substr($apiKey, $pos, 1); } for ($j = 0; $j < strlen($r); $j++) { $pos = substr($r, $j, 1) + 2; $obfuscatedApiKey .= substr($apiKey, $pos, 1); } return $obfuscatedApiKey; }
  - The following code is then used to fetch the session cookie (JSESSIONID):
  - $obfuscateTimestamp = (int)(microtime(true) * 1000); $obfuscatedApiKey = self::obfuscateApiKey($obfuscateTimestamp, 'your_api_key');
  - By default, the microtime(true) function returns a float representing the current time in seconds. So, in the code example, microtime(true) is multiplied by 1000 to ensure that the function returns the timestamp in microseconds.
  - PowerShell
  - PowerShell Implementation:
  - function obfuscateApiKey { param ( [string] #Your API key $apiKey, [string] #Timestamp $timestamp ) $high = $timestamp.substring($timestamp.length - 6) $low = ([int]$high -shr 1).toString() $obfuscatedApiKey = '' while ($low.length -lt 6) { $low = '0' + $low } for ($i = 0; $i -lt $high.length; $i++) { $obfuscatedApiKey += $apiKey[[int64]($high[$i].toString())] } for ($j = 0; $j -lt $low.length; $j++) { $obfuscatedApiKey += $apiKey[[int64]$low[$j].ToString() + 2] } return $obfuscatedApiKey }
  - Python
  - Python 3.x Implementation:
  - import time def obfuscateApiKey (): seed = 'YOUR_API_KEY' now = int(time.time() * 1000) n = str(now)[-6:] r = str(int(n) >> 1).zfill(6) key = "" for i in range(0, len(str(n)), 1): key += seed[int(str(n)[i])] for j in range(0, len(str(r)), 1): key += seed[int(str(r)[j])+2] print("Timestamp:", now, "\tKey", key) obfuscateApiKey()
  - Python 2.x Implementation:
  - import time def obfuscateApiKey (): seed = 'YOUR_API_KEY' now = str(long(time.time() * 1000)) n = now[-6:] r = str(int(n) >> 1).zfill(6) key = "" for i in range(0, len(n), 1): key += seed[int(n[i])] for j in range(0, len(r), 1): key += seed[int(r[j])+2] print "Timestamp:%s Key:%s" % (now, key) obfuscateApiKey()
  - Java
  - Java Implementation:
  - /** * obfuscateApiKey java method to obfuscate an API key based on current time * stamp * * @param key * @param timestamp * @return the obfuscated API key to use in POST /authenticatedSession */ private static String obfuscateApiKey(String key, String timestamp) { int apiKeySize = 12; String retVal = ""; char[] key1Arr = key.substring(0, apiKeySize - 2).toCharArray(); char[] key2Arr = key.substring(2).toCharArray(); String hiIndices = timestamp.substring(timestamp.length() - 6); int hitime = Integer.valueOf(hiIndices); int lotime = hitime >> 1; String loIndices = String.format("%06d", lotime); for (char index : hiIndices.toCharArray()) { retVal += key1Arr[index - '0']; } for (char index : loIndices.toCharArray()) { retVal += key2Arr[index - '0']; } return retVal; }
  - JavaScript
  - JavaScript Implementation:
  - obfuscateApiKey: function(timestamp, key) { var high = timestamp.substring(timestamp.length - 6); var low = (parseInt(high) >> 1).toString(); var apiKey = ""; while (low.length < 6) { low = "0" + low; } for (var i = 0; i < high.length; i++) { apiKey += key.charAt(parseInt(high.charAt(i))); } for (var j = 0; j < low.length; j++) { apiKey += key.charAt(parseInt(low.charAt(j)) + 2); } return apiKey; }
  - Shell Script
  - Shell Script Implementation:
  - epoch=$(date +%s000) mykey={your API key} key="" n=${epoch:(-6)} o=`printf %06d $((10#$n >> 1))` for ((i=0; i<${#n}; i++)); do tmp=${n:$i:1} key+=${mykey:$tmp:1} done for ((j=0; j<${#o}; j++)); do tmp=${o:$j:1}+2 key+=${mykey:$tmp:1} done
  - Before you can make any API calls, you must first authenticate via the API. This creates an authenticated session and returns a session ID. You can then pass this session ID in a header for subsequent API calls. To authenticate, send a POST request to the /auth endpoint with the following request body name-value pairs:
  - apiKey: Obfuscated API key value.
  - username: Username of the admin user that is provisioned.
  - password: Password of the admin user.
  - timestamp: Long value that represents the current time in milliseconds since midnight, January 1, 1970 UTC. This timestamp value must reflect the real current time.
- Example POST request to /auth:
- POST /api/v1/auth HTTP/1.1 Host: https://connector.zscalertwo.net Content-Type: application/json Cache-Control: no-cache { "apiKey": "s0m3rAnd0mKey", "username": "adminXYZ@acme.com", "password": "s0m3pa55w0rd", "timestamp": "1389681124480" }
- A successful response to this POST:
- HTTP/1.1 200 OK Strict-Transport-Security: max-age=31622400; includeSubDomains; preload X-FRAME-OPTIONS: SAMEORIGIN Transfer-Encoding: chunked Content-Type: application/json Date: Tue, 26 Sep 2022 23:24:15 GMT Set-Cookie: JSESSIONID=B875640E5EB2DA2C20CF191AE21F91B1; Path=/; Secure; HttpOnly Server: Zscaler {"authType":"ADMIN_LOGIN","obfuscateApiKey":true,"passwordExpiryTime":-1,"passwordExpiryDays":-1} JSESSIONID = B875640E5EB2DA2C20CF191AE21F91B1
- The Zscaler service checks that the timestamp passed by the POST /auth request meets the following conditions:
  - It is the same timestamp used to obfuscate the API key using the obfuscateApiKey() method.
  - It is within a two-hour range of Zscaler's measured epoch time.
- A successful response to /auth returns a cookie in the Set-Cookie header, called JSESSIONID, that must be used in subsequent requests.
- By default, the JSESSIONID expires within 30 minutes from the last activity or request on that session, or when you explicitly log out by sending a DELETE request to /auth. If API calls are made after the expiry of JSESSIONID, a 401 Unauthorized error is returned. To resume making API calls, reauthenticate the API by sending a POST request to /auth.
- If an unsuccessful POST request is made to /auth, the response code returns a 400 Bad Request error, such as:
- {"code":"INVALID_USERNAME_OR_PASSWORD","message":"Invalid email or password"}
- To learn more, seeAPI Response Codes and Error Messages.
- Make an API call
- After you have authenticated and obtained a session ID, you can begin making API calls. In the following example, you’ll make an API call to the /ecgroup endpoint to list the Cloud & Branch Connector groups available to you.
- Send a GET request to /ecgroup to list the Cloud & Branch Connector groups available to you.
- Example GET request to /ecgroup:
- GET /api/v1/ecgroup HTTP/1.1 Content-Type: application/json X-CSRF-Token: {{token}} Accept: */* Host: connector.zscalertwo.net Cookie: JSESSIONID=E50F625E715B54BC228F9EE36F93F6E9; ZS_SESSION_CODE=1046360416
- A successful response to this GET request returns the following response and a list of Cloud & Branch Connector groups available to you:
  - Example GET /ecgroup response
  - HTTP/1.1 200 OK vary: accept-encoding Content-Encoding: gzip Content-Type: application/json Transfer-Encoding: chunked Date: Mon, 13 Feb 2023 22:01:14 GMT Keep-Alive: timeout=10 Connection: keep-alive Server: Zscaler [ { "id": 63260789, "name": "zs-cc-vpc-02de960b4c73a7275-us-west-2a", "desc": "Auto created from ami-0c0f8d637a04769ea_i-04f78174f6daf4792", "deployType": "CLOUD", "status": [ "CLOUD" ], "platform": "AWS", "awsAvailabilityZone": "US_WEST_2A", "location": { "id": 63260784, "name": "us-west-2-vpc-02de960b4c73a7275" }, "maxEcCount": 0, "provTemplate": { "id": 316001, "name": "aws-zwlc-id" }, "tunnelMode": "UNENCRYPTED", "ecVMs": [ { "id": 63260794, "name": "zs-cc-vpc-02de960b4c73a7275-us-west-2a-VM-B5bV5", "status": [ "REGISTERED", "PKG_REPO_REGISTERED" ], "operationalStatus": "INACTIVE", "provTemplate": { "id": 316001, "name": "aws-zwlc-id" }, "formFactor": "SMALL", "managementNw": { "id": 350251, "ipStart": "10.1.200.178", "ipEnd": "0.0.0.0", "netmask": "255.255.255.0", "defaultGateway": "10.1.200.1", "nwType": "AUTOMATIC", "dns": { "id": 350249, "ips": [ "10.1.0.2" ], "dnsType": "AUTOMATIC" } }, "ecInstances": [ { "id": 63260797, "name": "zs-cc-vpc-02de960b4c73a7275-us-west-2a-VM-B5bV5_INSTANCE_1_MnEgQ", "flags": "REGISTERED", "ecInstanceType": "SME", "registerTime": 0, "natIp": "52.38.213.147", "serviceNw": { "id": 350258, "ipStart": "10.1.200.33", "ipEnd": "0.0.0.0", "netmask": "255.255.255.0", "defaultGateway": "10.1.200.1", "nwType": "AUTOMATIC", "dns": { "id": 350257, "ips": [ "10.1.0.2" ], "dnsType": "AUTOMATIC" } }, "virtualNw": { "id": 350256, "ipStart": "0.0.0.0", "ipEnd": "0.0.0.0", "netmask": "0.0.0.0", "defaultGateway": "0.0.0.0", "nwType": "AUTOMATIC", "dns": { "id": 350254, "ips": [ "0.0.0.0" ], "dnsType": "AUTOMATIC" } } } ], "cityGeoId": 5714964, "natIp": "52.38.213.147", "ziaGateway": "165.225.50.12", "zpaBroker": "136.226.57.254", "buildVersion": "346637", "lastUpgradeTime": 1678010276, "upgradeStatus": 0, "upgradeStartTime": 0, "upgradeEndTime": 7200, "upgradeDayOfWeek": 1, "haStatus": "DISABLED" } ] }, { "id": 63260807, "name": "zs-cc-vpc-07c37249a25154547-us-east-2a", "desc": "Auto created from ami-06a12e35f23ca5f7a_i-0bf0bbc515f4c7f64", "deployType": "CLOUD", "status": [ "CLOUD" ], "platform": "AWS", "awsAvailabilityZone": "US_EAST_2A", "location": { "id": 63260805, "name": "us-east-2-vpc-07c37249a25154547" }, "maxEcCount": 0, "provTemplate": { "id": 316001, "name": "aws-zwlc-id" }, "tunnelMode": "UNENCRYPTED", "ecVMs": [ { "id": 63260809, "name": "zs-cc-vpc-07c37249a25154547-us-east-2a-VM-0TbUx", "status": [ "REGISTERED", "PKG_REPO_REGISTERED" ], "operationalStatus": "INACTIVE", "provTemplate": { "id": 316001, "name": "aws-zwlc-id" }, "formFactor": "SMALL", "managementNw": { "id": 350260, "ipStart": "10.1.200.201", "ipEnd": "0.0.0.0", "netmask": "255.255.255.0", "defaultGateway": "10.1.200.1", "nwType": "AUTOMATIC", "dns": { "id": 350259, "ips": [ "10.1.0.2" ], "dnsType": "AUTOMATIC" } }, "ecInstances": [ { "id": 63260813, "name": "zs-cc-vpc-07c37249a25154547-us-east-2a-VM-0TbUx_INSTANCE_1_4emcc", "flags": "REGISTERED", "ecInstanceType": "SME", "registerTime": 0, "natIp": "3.20.194.248", "serviceNw": { "id": 350268, "ipStart": "10.1.200.105", "ipEnd": "0.0.0.0", "netmask": "255.255.255.0", "defaultGateway": "10.1.200.1", "nwType": "AUTOMATIC", "dns": { "id": 350266, "ips": [ "10.1.0.2" ], "dnsType": "AUTOMATIC" } }, "virtualNw": { "id": 350264, "ipStart": "0.0.0.0", "ipEnd": "0.0.0.0", "netmask": "0.0.0.0", "defaultGateway": "0.0.0.0", "nwType": "AUTOMATIC", "dns": { "id": 350263, "ips": [ "0.0.0.0" ], "dnsType": "AUTOMATIC" } } } ], "cityGeoId": 4509177, "natIp": "3.20.194.248", "ziaGateway": "165.225.8.22", "zpaBroker": "165.225.100.203", "buildVersion": "346637", "lastUpgradeTime": 1677999488, "upgradeStatus": 0, "upgradeStartTime": 0, "upgradeEndTime": 7200, "upgradeDayOfWeek": 1, "haStatus": "DISABLED" } ] } ]
- When making API calls, consider the following best practices:
  - Always pass the JSESSIONID cookie with the request.
  - Use UTF-8 encoding for all endpoints (e.g., use the encodeUriComponent() function in JavaScript to encode to UTF-8).
  - When updating a resource, always send a GET request before the PUT request. This retrieves the current values for the resource before you update the entire resource with new values. After the update, the next GET request for that resource returns the new values. By doing this, you avoid potentially missing updates between GET and PUT calls. Create a dedicated user for each script. Don't use the same user in multiple scripts that are running concurrently.
  - Create an authenticated session only if an API call returns a 401 Unauthorized error (SESSION_NOT_VALID), which indicates that the authenticated session has expired or does not exist. To learn how to create an authenticated session, see Authenticate and create an API session.
- Zscaler recommends using the Postman REST API client to send ad-hoc requests to the API.
- Activate configuration changes
- After modifying any configurations, you must activate the changes by sending a PUT request to /ecAdminActivateStatus/activate. As a best practice, if you are making multiple configuration changes, Zscaler recommends grouping the changes and activating all the changes at one time.
- To avoid race conditions, do not manually change configuration settings via the Zscaler Cloud & Branch Connector Admin Portal while your scripts are running. The Zscaler service might lock a configuration while a user is editing. When multiple users are editing concurrently, only one user's change succeeds while the remaining users might receive a 409 Conflict error (EDIT_LOCK_NOT_AVAILABLE).
- If you encounter a race condition and a 409 Conflict error code is returned, Zscaler recommends adding a wait cycle of a few seconds and retrying to recover.
- You can retrieve the activation status by sending a GET request to /ecAdminActivateStatus. However, you cannot revert a change and any queued activations cannot be canceled. To learn more, see Activation in the API Reference and Saving and Activating Changes.
- Log out of API
- To log out of an authenticated API session, send a DELETE request to /auth.
To learn more about rate limiting and HTTP status codes, see Understanding Rate Limits and API Response Codes and Error Messages. If you encounter any issues with the API, contact Zscaler Support.
