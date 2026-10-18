# Configuring Device Posture Profiles

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-device-posture-profiles
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1296826, revision 3245420

---

Watch a video on Device Posture Profiles.
Posture profiles for both Internet & SaaS and Private Access devices are created in the Device Posture section. To learn more about posture profiles, see About Device Posture Profiles. The posture profiles are used for configuring access policies for Private Access and for adding posture profile trust levels for Internet & SaaS. To learn more about posture profiles for Internet & SaaS, see About Internet & SaaS Posture Profiles.
To configure a device posture profile for Zscaler Client Connector:
- From the navigation menu, go to Infrastructure > Client Connector > Device Posture.
- Click Add Device Posture.
- In the Add Device Posture window:
  - Name: Enter a name for the device posture profile.
  - Platform: Select one or more of the following platform options:
    - Windows
    - macOS
    - Linux
    - Android
    - iOS
  - Apply to Windows Machine Tunnel: When selected, the posture type is evaluated and applied to the Private Access pre-Windows login machine tunnel. If not selected, the posture type is only evaluated for Private Access and Internet & SaaS tunnels. Applies to the following device postures for Windows: Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version and Zscaler Client Connector Version.
  - Apply when added as Partner Tenant: Applies to Zscaler Client Connector version 4.6 and later for Windows and Zscaler Client Connector version 5.0 and later for macOS. When selected, the posture type is evaluated and applied to the Private Access tunnel used to connect to a partner tenant. If not selected, the posture type is only evaluated for Private Access and Internet & SaaS tunnels.
  - Apply to macOS Machine Tunnel: When selected, the posture type is evaluated and applied to the Private Access pre-macOS login machine tunnel. If not selected, the posture type is only evaluated for Private Access and Internet & SaaS tunnels. Applies to the following device postures for macOS: CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version, and Zscaler Client Connector Version.
  - Frequency (In Minutes): Applies to Zscaler Client Connector version 4.4 and later for Windows and Zscaler Client Connector version 4.5 and later for macOS. For each posture type, select how often Zscaler Client Connector evaluates device posture by selecting a value, in one-minute intervals, from the drop-down menu. The maximum default value is 15 minutes. The minimum value is 2 minutes.
  - For the following posture checks, Zscaler Client Connector evaluates device posture immediately when the posture changes on a device, regardless of what is configured in the Frequency (In Minutes) field:
    - Process Check
    - Detect Carbon Black
    - Detect CrowdStrike
    - Detect SentinelOne
    - Detect Microsoft Defender
  - However, Zscaler Client Connector continues to evaluate device posture according to the configuration in the Frequency (in Minutes) field.
  - This feature is enabled by default. Contact Zscaler Support to disable this feature.
  - Posture Type: Complete the following steps, depending on the platforms you selected.
    - Certificate Trust
    - Applies to Windows, macOS, Linux, Android, or iOS. Select Certificate Trust from the drop-down menu and upload a certificate issued by an internal root Certificate Authority (CA) trusted by your organization's users. The user's device must trust the certificate to pass the posture validation check.
    - For iOS, the certificate must be trusted directly by the device. An intermediate certificate doesn't work.
    - Zscaler accepts Base64-encoded .pem and .cer files, and you can upload any one of the following:
      - A root CA certificate
      - An intermediate certificate
      - A client certificate
    - File Path
    - Applies to Windows or macOS. Select File Path from the drop-down menu and enter a file path that can be found on your users' systems. For example, you can enter: C:\Program Files(x86)\Example\AV.txt.
    - The user's device must have the specified file path to pass the posture validation check.
    - If you choose more than one platform, the File Path option is not available. Instead, you must use the Certificate Trust posture type.
    - Registry Key
    - Applies to Windows only. Select Registry Key from the Posture Type drop-down menu. Enter the registry key in the Registry Key field.
    - From the Match Type drop-down menu, select either Path or Value:
      - If you select Path, ensure that the registry key begins with HKEY. For example, HKEY_CURRENT_USER\Software\Zscaler\App.
      - If you select Value, you must also complete the Name and Data fields. For example, if you enter the registry key HKEY_CURRENT_USER\Software\Zscaler\App, you would enter ZNW_State in the Name field and CONNECTING in the Data field to describe that the service is connecting. To learn more, see Zscaler Client Connector: Windows Registry Keys.
    - The app checks against the registry key Path or the Value. The user's device must have the specified registry key to pass the posture validation check. The registry key check runs in the user context. If your permissions prevent users from accessing the system keys (e.g., HKLM), you must create the registry key where users can access it.
    - Client Certificate
    - Applies to Windows, macOS, and Linux. For details on how to configure Linux for the Client Certificate, see Configuring the Client Certificate Posture Check for Linux.
    - As of Zscaler Client Connector version 5.0 for Android, Zscaler is ending support for the Client Certificate posture type for all Android devices. To learn more, see End-of-Support for the Client Certificate Posture Type for All Android Devices.
    - Select Client Certificate from the drop-down menu and upload a certificate issued by an internal root Certificate Authority (CA) trusted by your organization's users. The certificate must be in the user store at the endpoint, issued by the CA that matches the uploaded certificate in the posture profile. The user must have a private and public key pair issued by the specified CA to pass this posture validation check.
    - Zscaler accepts Base64-encoded .pem and .cer files, and you can upload any one of the following:
      - A root CA certificate
      - An intermediate CA certificate
    - After uploading a certificate, enable or disable the Non-Exportable Private Key. If enabled, Zscaler Client Connector must check if the certificate's private key can or cannot be exported. Posture validation fails if Non-Exportable Private Key is enabled and the key is exportable.
    - Optionally, enable Perform CRL Check. If enabled, Zscaler Client Connector can help detect whether the certificate was revoked. The Certificate Revocation List (CRL) contains digital certificates that were revoked by the issuing CA before their scheduled expiration date, and those certificates should no longer be trusted. If a certificate was revoked, the posture check fails.
    - Zscaler Client Connector for Windows checks the CRL that was downloaded from the CA server and cached by a Microsoft API. If you use Zscaler Client Connector version 4.8 and later for Windows, you can have Zscaler Client Connector download, validate, and cache the CRL locally based on a configurable cache interval (0 to 30 minutes). Zscaler recommends using this option only in these scenarios:
      - The CRL server experiences instability due to fluctuating between reachable and unreachable states.
      - The CRL server is hosted as a Private Access application which could lead to ambiguous caching behavior due to Private Access access expiration.
      - You require frequent CRL downloads or granular control over caching intervals for near real-time validation.
    - Contact Zscaler Support to enable this feature.
    - For Windows and macOS only, enter a value in the Client Certificate Template Information field that matches the certificate issued by the uploaded root certificate.
    - Firewall
    - Applies to Windows or macOS. Select Firewall from the drop-down menu. Zscaler Client Connector checks the firewall status for all three firewall profiles: public, private, and domain. At least one of these profiles must be active to pass the posture validation check.
    - Zscaler Client Connector doesn't check for the presence of third-party firewalls. Third-party firewalls don't fulfill the posture check requirement.
    - Full Disk Encryption
    - Applies to Windows, macOS, and Android. Also applies to Zscaler Client Connector version 1.4 and later for Linux. Select Full Disk Encryption from the drop-down menu. Zscaler Client Connector checks if the device has full disk encryption enabled or disabled. The user must have full disk encryption enabled to pass the posture validation check.
    - For Linux only, provide a value in the File Path field to check whether or not the disk or the disk partition that contains the File Path is encrypted.
    - Domain Joined
    - Applies to Windows or macOS. Select Domain Joined from the drop-down menu and enter the domain or workgroup to match. Zscaler Client Connector checks if the device is joined to the domain or workgroup. The user's device must have a matching domain to pass the posture validation check.
    - Process Check
    - Applies to Zscaler Client Connector version 2.1.2 and later for Windows or macOS or Zscaler Client Connector version 1.3 and later for Linux. Select Process Check from the drop-down menu. For Process Path, enter the name and absolute path for the process (e.g., c:\folder\process.exe). Do not use double quotes. For Signer Certificate Thumbprint, enter the unique identifier of the process signer certificate. You can add multiple thumbprints for a single Process Check by separating each thumbprint with a comma.
      - Locating the Signer Certificate Thumbprint for Windows
      - In File Explorer:
        - Go to Program Files > Zscaler > ZSATunnel.
        - Right-click the ZSATunnel file and select Properties.
        - Click the Digital Signatures tab.
        - Select the signature from the list and click Details.
        - Click View Certificate.
        - Click the Details tab. Scroll down and click Thumbprint. The thumbprint displays in a window from which you can copy and paste it into the Signer Certificate Thumbprint field.
      - Locating the Signer Certificate Thumbprint for macOS
      - In the terminal window:
        - Extract the certificates associated with binary codesign -d --extract-certificates binarypath: (e.g., codesign -d --extract-certificates /Library/CS/CSDaemon <binary path>)
        - Parse the certificate: for ((certnumber=0 ; certnumber<=2; certnumber++)) ; do openssl asn1parse -in codesign${certnumber} -inform der -out codesign${certnumber}.der ; done
        - Convert to a PEM file: for ((certnumber=0 ; certnumber<=2; certnumber++)) ; do openssl x509 -inform der -in codesign${certnumber}.der -out codesign${certnumber}.pem ; done
        - Extract the certificates using the following command: openssl x509 -noout -sha1 -fingerprint -inform pem -in codesign0.pem
        - You can change -sha1 to -sha256.
        - Remove the colons from the output.
    - If you use Zscaler Client Connector version 4.9 and later for Windows, you can specify one or more software versions that the device must have to pass the check. Enter up to three versions in the Version field in a minimum two-version level to maximum 4-version level format. If you select Exact Match, the exact version number is required to pass the check. Contact Zscaler Support to enable this feature.
    - The following table shows example results for different values:
| Values in Version Field | Exact Match Checkbox | Passing Versions |
|---|---|---|
| 1.8 | Selected | Only 1.8.X.X versions |
| Cleared | All versions 1.8.X.X and later |  |
| 1.8.0.456, 1.8.0.789 | Selected | Only versions 1.8.0.456 and 1.8.0.789 |
| Cleared | All versions 1.8.0.456 and later |  |
| 1.8.0.456, 1.9.0.789 | Selected | Only versions 1.8.0.456 and 1.9.0.789 |
| Cleared | All versions 1.8.0.456 and later (including 1.9.X.X) |  |
    - Detect Carbon Black
    - This is only applicable if you're using Zscaler Client Connector version 2.1.2 and later for Windows or macOS. Select Detect Carbon Black. The user must have Carbon Black running on the device to pass the posture validation check.
    - If you use Zscaler Client Connector version 4.9 and later for Windows, you can specify one or more software versions that the device must have to pass the check. Enter up to three versions in the Version field in a minimum two-version level to maximum 4-version level format. If you select Exact Match, the exact version number is required to pass the check. Contact Zscaler Support to enable this feature.
    - The following table shows example results for different values:
| Values in Version Field | Exact Match Checkbox | Passing Versions |
|---|---|---|
| 1.8 | Selected | Only 1.8.X.X versions |
| Cleared | All versions 1.8.X.X and later |  |
| 1.8.0.456, 1.8.0.789 | Selected | Only versions 1.8.0.456 and 1.8.0.789 |
| Cleared | All versions 1.8.0.456 and later |  |
| 1.8.0.456, 1.9.0.789 | Selected | Only versions 1.8.0.456 and 1.9.0.789 |
| Cleared | All versions 1.8.0.456 and later (including 1.9.X.X) |  |
    - The following signer certificate matching thumbprints are supported for the Carbon Black RepMgr.exe executable for Windows:
| Zscaler Client Connector version 3.5 and later for Windows |
|---|
| 4d66d506976bde36ae01ab3335d501bec9fb9837f855a4a29ecefdd9ad04384ae3a099aff61d717f9033309926659b4346c496d44407d39e0487868cd9665dc3abce52eaf263dad3412c7cedb9e79b9dfce3566368d917acf28779b98d996f416fef1f2b |
    - For Zscaler Client Connector version 4.5 and later for Windows, if there are no matching thumbprints, the posture check still passes if Carbon Black is installed and turned on in Windows Security.
    - The next table displays the signer certificate matching thumbprints supported for the following Carbon Black binaries for macOS:
      - /Applications/Confer.app/Contents/MacOS/repmgr
      - /Applications/VMware Carbon Black Cloud/repmgr.bundle/Contents/MacOS/repmgr
      - /Library/SystemExtensions/<UUID>/com.vmware.carbonblack.cloud.se-agent.extension.systemextension/Contents/MacOS/se_agent
      - The UUID varies depending on your system settings.
    - If you are using an older version of Zscaler Client Connector, look at the thumbprints of the Carbon Black release to ensure that the thumbprints are supported by the posture.
| Zscaler Client Connector version 4.3 and later for macOS |
|---|
| 8F262B63E0DA232A95111C9E1428BBCE76E609B7B19EE7CB9B1FEA04F201BBF12F71EE54DC38EDDBD2C80F662EC15090DD442266DAE2AE5FF662A39BC591E0FF2F3BB7BD2E00C23D |
    - For Zscaler Client Connector version 4.3 and later for macOS, if there are no matching thumbprints, the posture check still passes if Carbon Black is installed and the process is running.
    - Detect CrowdStrike
    - This is only applicable if you're using Zscaler Client Connector version 2.1.2 and later for Windows or macOS. Select Detect CrowdStrike. The user must have CrowdStrike running on the device to pass the posture validation check.
    - If you use Zscaler Client Connector version 4.9 and later for Windows, you can specify one or more software versions that the device must have to pass the check. Enter up to three versions in the Version field in a minimum two-version level to maximum 4-version level format. If you select Exact Match, the exact version number is required to pass the check. Contact Zscaler Support to enable this feature.
    - The following table shows example results for different values:
| Values in Version Field | Exact Match Checkbox | Passing Versions |
|---|---|---|
| 1.8 | Selected | Only 1.8.X.X versions |
| Cleared | All versions 1.8.X.X and later |  |
| 1.8.0.456, 1.8.0.789 | Selected | Only versions 1.8.0.456 and 1.8.0.789 |
| Cleared | All versions 1.8.0.456 and later |  |
| 1.8.0.456, 1.9.0.789 | Selected | Only versions 1.8.0.456 and 1.9.0.789 |
| Cleared | All versions 1.8.0.456 and later (including 1.9.X.X) |  |
    - The following signer certificate matching thumbprints are supported for the CrowdStrike CSFalconService.exe executable for Windows:
| Zscaler Client Connector version 3.5 and later for Windows |
|---|
| cd485eaadb584dcf911bb9dae6ecae1253f0530893324968ecd73a9570c347cf0c8ee4bc390d394838b7c74e37392713e436e19a2be053100115da880e2f50955c71c9a9b5e6f9c0ecb1c1b198249f4f9c4a4665abbcd3d4a8bffcd9251b21bb2ec6e341426510225a68b9260814230b37e289bfe0566f28ca5296e9d87044679d0b405104b8db2c8d56eb03b878d8eb696cf3d4505e2f6641c57af9062ec51a1935420a805a0cefebecdbe59a391a69db32eab316adfe3b79a93d4b1fa7b8e6b2c972c99bfdc84962c16976bfbbf57b8f8b588a043b4fb0bc294a6d |
    - For Zscaler Client Connector version 4.5 and later for Windows, if there are no matching thumbprints, the posture check still passes if CrowdStrike is installed and turned on in Windows Security.
    - The next table displays the signer certificate matching thumbprints supported for the following CrowdStrike binaries for macOS:
      - /Library/CS/falcond
      - /Applications/Falcon.app/Contents/Resources/falcond
      - /Library/SystemExtensions/<UUID>/com.crowdstrike.falcon.Agent.systemextension/Contents/MacOS/com.crowdstrike.falcon.Agent
    - The UUID is different for every installation. For example: /Library/SystemExtensions/7F3C861E-7137-4797-AA86-CFD764D1796F/com.crowdstrike.falcon.Agent.systemextension/Contents/MacOS/com.crowdstrike.falcon.Agent
    - If you are using an older version of Zscaler Client Connector, look at the thumbprints of the CrowdStrike release to ensure that the thumbprints are supported by the posture.
| Zscaler Client Connector 4.3 and later for macOS |
|---|
| 475B2989BAE075A1F444B76ADAABE8EDF33A0ADFB7447A2DAE7B0C3016274ACBB55F7AA8A7349ACF5B45F61068B29FCC8FFFF1A7E99B78DA9E9C4635611E5B662C593A08FF58D14AE22452D198DF6C60 |
    - For Zscaler Client Connector version 4.3 and later for macOS, if there are no matching thumbprints, the posture check still passes if CrowdStrike is installed and the process is running.
    - CrowdStrike ZTA Score
    - This is only applicable if you're using Zscaler Client Connector version 3.4 and later for Windows or macOS. Select CrowdStrike ZTA Score. The user must have CrowdStrike running on the device to pass the posture validation check.
    - Users must enable the CrowdStrike ZTA feature in CrowdStrike. Contact CrowdStrike Support to enable this feature.
    - Enter a score between 1 and 100. This number represents a risk score that helps determine the security level of the device. The higher the number you designate, the more secure you consider the device. Zscaler Client Connector compares this number against an overall score (a combined score based on the device OS settings and sensor settings) assigned by CrowdStrike's user agent. If that overall score is greater than or equal to the score you've entered, the posture check passes. If the overall score is less than the score you entered, the posture check fails. To learn more about the ZTA score, refer to the CrowdStrike documentation.
    - Detect SentinelOne
    - This is only applicable if you're using Zscaler Client Connector version 2.1.2 and later for Windows or macOS. Select Detect SentinelOne. The user must have SentinelOne running on the device to pass the posture validation check.
    - If you use Zscaler Client Connector version 4.9 and later for Windows, you can specify one or more software versions that the device must have to pass the check. Enter up to three versions in the Version field in a minimum two-version level to maximum 4-version level format. If you select Exact Match, the exact version number is required to pass the check. Contact Zscaler Support to enable this feature.
    - The following table shows example results for different values:
| Values in Version Field | Exact Match Checkbox | Passing Versions |
|---|---|---|
| 1.8 | Selected | Only 1.8.X.X versions |
| Cleared | All versions 1.8.X.X and later |  |
| 1.8.0.456, 1.8.0.789 | Selected | Only versions 1.8.0.456 and 1.8.0.789 |
| Cleared | All versions 1.8.0.456 and later |  |
| 1.8.0.456, 1.9.0.789 | Selected | Only versions 1.8.0.456 and 1.9.0.789 |
| Cleared | All versions 1.8.0.456 and later (including 1.9.X.X) |  |
    - The following signer certificate matching thumbprints are supported for the SentinelOne SentinelAgent.exe executable for Windows:
| Zscaler Client Connector version 3.6 and later for Windows | Zscaler Client Connector version 3.5 and later for Windows |
|---|---|
| f1654692e31c02872d73507de97617fd6dc14c8c910b496dc984d3818001dbfe1a75cf75e46aef0e2b90394e9b094f067f84d9a0b15009d51fda20dd22C492673C2651B397AC13750978220A87E03CD569640f124bafc9a891fc4b51fcfd0ddf8785a6e55dfc737f10a570899baf8209e9e5cd4cfdfd6aed403e7374894c743e3ebd2ecc15f8a46091ff6a4d2349d742850cafb6f691b5d2b79b3d47576ec52a | f1654692e31c02872d73507de97617fd6dc14c8c910b496dc984d3818001dbfe1a75cf75e46aef0e2b90394e9b094f067f84d9a0b15009d51fda20dd |
    - For Zscaler Client Connector version 4.5 and later for Windows, if there are no matching thumbprints, the posture check still passes if SentinelOne is installed and turned on in Windows Security.
    - The next table displays the signer certificate matching thumbprints supported for the following SentinelOne binaries for macOS:
    - /Library/Sentinel/sentinel-agent.bundle/Contents/MacOS/sentineld
    - If you are using an older version of Zscaler Client Connector, look at the thumbprints of the SentinelOne release to ensure that the thumbprints are supported by the posture.
| Zscaler Client Connector 3.7 and later for macOS |
|---|
| CAF5A626546E84A2036913B07FCB835EB60D4F95c885b2ee5abf5815455f274990215f1b29514b49 |
    - For Zscaler Client Connector version 4.3 and later for macOS, if there are no matching thumbprints, the posture check still passes if SentinelOne is installed and the process is running.
    - Ownership Variable
    - Applies to Android or iOS. Select Ownership Variable from the drop-down menu. Enter a variable using an alphanumeric value no greater than 32 characters.
    - The user's device must have the variable to pass the posture validation check. Your device management solution pushes the variable to the device during installation.
    - The Ownership Variable must be set through mobile device management when deploying Zscaler Client Connector. For successful deployment of Zscaler Client Connector to your users' devices, see the following articles:
      - Customizing Zscaler Client Connector with Install Options for Android
      - Customizing Zscaler Client Connector with Install Options for iOS
    - Unauthorized Modification
    - Applies to Android or iOS. Select Unauthorized Modification from the drop-down menu. Zscaler Client Connector checks for unauthorized modifications on the device, such as jailbreaking or rooting. The user's device must not have unauthorized modifications to pass the posture validation check.
    - If you are using Zscaler Client Connector version 1.5.2 for iOS or Zscaler Client Connector version 1.5.0 for Android, see Using the Unauthorized Modification Device Posture Profile for known issues.
    - Detect Microsoft Defender
    - Applies to Zscaler Client Connector version 2.1.1 and later for Windows or macOS, or Zscaler Client Connector version 1.4 and later for Linux. Select Detect Microsoft Defender. The user must have Microsoft Defender Advanced Threat Protection running on the device to pass the posture validation check.
    - If you use Zscaler Client Connector version 4.9 and later for Windows, you can specify one or more software versions that the device must have to pass the check. Enter up to three versions in the Version field in a minimum two-version level to maximum 4-version level format. If you select Exact Match, the exact version number is required to pass the check. Contact Zscaler Support to enable this feature.
    - The following table shows example results for different values:
| Values in Version Field | Exact Match Checkbox | Passing Versions |
|---|---|---|
| 1.8 | Selected | Only 1.8.X.X versions |
| Cleared | All versions 1.8.X.X and later |  |
| 1.8.0.456, 1.8.0.789 | Selected | Only versions 1.8.0.456 and 1.8.0.789 |
| Cleared | All versions 1.8.0.456 and later |  |
| 1.8.0.456, 1.9.0.789 | Selected | Only versions 1.8.0.456 and 1.9.0.789 |
| Cleared | All versions 1.8.0.456 and later (including 1.9.X.X) |  |
    - For Linux only, enter the executable path for the Microsoft Defender endpoint on Linux.
    - The next table displays the signer certificate matching thumbprints supported for the following Detect Microsoft Defender binaries for macOS:
    - /Library/SystemExtensions/<UUID>/com.microsoft.wdav.epsext.systemextension/Contents/MacOS/epsext
| Zscaler Client Connector version 3.7 and later for macOS |
|---|
| 2ED71A71E4BFC746CBB0C0B1C80AADCE899A67F27D4DE827C9FA532C2C65684AD5DDB003231DDF9F |
    - Detect Antivirus
    - This is only applicable if you're using Zscaler Client Connector version 3.6 and later for Windows or macOS. Select Detect Antivirus from the drop-down menu.
    - For Windows, you can enter the antivirus name in the AV Name field and enable Check if AV Definitions Are Up-to-Date. When enabled, Zscaler Client Connector detects if an antivirus is running on the system. If you specify an antivirus name, the antivirus must be running on the system for the posture check to pass. If you leave the AV Name field blank, Zscaler Client Connector detects any antivirus running on the system.
    - For macOS, you must specify the antivirus name in the AV Name field. Include the system extension name as part of the antivirus name. You can use the command line tool systemextensionsctl to identify the complete name.
    - OS Version
    - Applies to Zscaler Client Connector version 3.6 and later for Windows or macOS, or Zscaler Client Connector 1.4 and later for Linux, or Zscaler Client Connector 3.7 and later for Android. Select OS Version from the drop-down menu.
    - For Windows only, select an edition from the OS Editions drop-down menu, click Add OS to add it, and then select a build from the OS Build drop-down menu. If the machine is running this version or later, then the posture check passes. Click Add OS to add more OS Editions.
    - For macOS only, select a version from the OS Versions drop-down menu, click Add OS to add it, and then enter the OS version. Click Add OS to add more OS Versions.
    - For Linux only, select a distribution from the Linux Distributions drop-down menu, click Add OS to add it, and then enter the OS version. Click Add OS to add more Linux Distributions.
    - For Android only, select an edition from the OS Editions drop-down menu, click Add OS to add it, and then click the Calendar icon to select a month for the patch date. Click Add OS to add more OS Editions.
    - Jamf Detection
    - Applies to Zscaler Client Connector version 4.3 and later for macOS.
      - Jamf Detection: Zscaler Client Connector checks if Jamf is running on the device.
      - Jamf Risk Level: Zscaler Client Connector checks for Jamf-provided risk levels. Choose from Secure, Low, Medium, or High.
    - If you are using Jamf Detection posture check, when removing an MDM profile from a device, the Jamf daemon might still be running. To ensure it is not running, on unenrollment, admins must add the command sudo jamf -removeFramework to Jamf Pro to completely remove the Jamf daemon from running on the system.
    - AzureAD Domain Joined
    - Applies to Windows only. Select AzureAD Domain Joined from the drop-down menu and then enter a globally unique identifier in the Tenant Id field. Zscaler Client Connector checks if the device is AzureAD Domain Joined to the specified Tenant Id.
    - A device can be only Domain Joined, only AzureAD Domain Joined, or both AzureAD Domain Joined and Domain Joined (i.e., hybrid join).
    - Server Validated Client Certificate
    - Applies only to Zscaler Client Connector version 4.4 and later for Windows and Zscaler Client Connector version 5.0 and later for macOS. This posture is applicable to Private Access (ZPA) only.
    - Select Server Validated Client Certificate from the drop-down menu and upload a CA certificate trusted by your organization's users. The client certificate must be either in the current user personal store or local computer personal store at the endpoint. The client certificate must be issued by the root CA or by an intermediate CA signed by the root CA, and you must upload the root CA certificate to the posture profile.
    - On macOS clients, be sure to deploy the client certificate via MDM and enable Allow all app access in the MDM profile so that the private key can be accessed without being prompted. The client certificate must also be in the System keychain for posture evaluation. Certificates in the Login keychain are not supported at this time. Client certificates that require user interaction (e.g., smart cards with a PIN) are not supported.
    - For this posture validation check, the server sends a challenge to the client. After locating the private key and the root CA on the certificate chain, the client sends the signed challenge back to the server to pass the validation.
    - Zscaler accepts Base64-encoded .pem and .cer files, and you can upload a root CA certificate.
    - After uploading a certificate, enable or disable the Non-Exportable Private Key. If enabled, Zscaler Client Connector must check if the certificate's private key can or cannot be exported. Posture validation fails if Non-Exportable Private Key is enabled and the key is exportable.
    - If you upload a large number of certificates (more than 50), the response from the server might take some time (around 10 seconds).
    - CrowdStrike ZTA Device OS Score
    - This is only applicable if you're using Zscaler Client Connector version 4.6 and later for Windows or Zscaler Client Connector version 4.8 and later for macOS. Select CrowdStrike ZTA Device OS Score. The user must have CrowdStrike running on the device to pass the posture validation check.
    - Users must enable the CrowdStrike ZTA feature in CrowdStrike. Contact CrowdStrike Support to enable this feature.
    - Enter a score between 1 and 100. This number represents a risk score that helps determine the security level of the device. The higher the number you designate, the more secure you consider the device. Zscaler Client Connector compares this number against the OS score assigned by CrowdStrike's user agent. If that OS score is greater than or equal to the score you've entered, the posture check passes. If the OS score is less than the score you entered, the posture check fails. To learn more about the OS score, refer to the CrowdStrike documentation.
    - CrowdStrike ZTA Sensor Setting Score
    - This is only applicable if you're using Zscaler Client Connector version 4.6 and later for Windows or Zscaler Client Connector version 4.8 and later for macOS. Select CrowdStrike ZTA Sensor Setting Score. The user must have CrowdStrike running on the device to pass the posture validation check.
    - Users must enable the CrowdStrike ZTA feature in CrowdStrike. Contact CrowdStrike Support to enable this feature.
    - Enter a score between 1 and 100. This number represents a risk score that helps determine the security level of the device. The higher the number you designate, the more secure you consider the device. Zscaler Client Connector compares this number against the sensor setting score assigned by CrowdStrike's user agent. If that sensor setting score is greater than or equal to the score you've entered, the posture check passes. If the sensor setting score is less than the score you entered, the posture check fails. To learn more about the sensor setting score, refer to the CrowdStrike documentation.
    - Zscaler Client Connector Version
    - Applies to Zscaler Client Connector version 4.8 and later for Windows or Zscaler Client Connector version 4.8 and later for macOS. Select Zscaler Client Connector Version from the drop-down menu. Enter up to five versions in the Version field in a minimum two-version level to maximum 4-version level format. If you select Exact Match, the exact version number is required to pass the check.
    - You can enter only values 4.8 and higher (e.g., 4.8, 4.8.0.456, 4.9, 4.9.0.789). The following table shows example results for different values:
| Values in Version Field | Exact Match Checkbox | Passing Versions |
|---|---|---|
| 4.8 | Selected | Only 4.8.X.X versions |
| Cleared | All versions 4.8.X.X and later |  |
| 4.8.0.456, 4.9 | Selected | All versions 4.9.X.X and only version 4.8.0.456 |
| Cleared | All versions 4.8.0.456 and later (including 4.9.X.X) |  |
| 4.8.0.456, 4.9.0.789 | Selected | Only versions 4.8.0.456 and 4.9.0.789 |
| Cleared | All versions 4.8.0.456 and later (including 4.9.X.X) |  |
  - Not all device posture types work for all platforms. If you select a device that doesn't support a specific posture type, the posture type is unavailable.
  - Message: (Optional) A message that displays if an end user is blocked from a Private Access app due to the device posture failing. You can enter a custom message or keep the default message. You can click Restore Default to replace the custom message with the default message.
  - If the device posture fails, the end user receives a standard pop-up notification with a Learn More link. If the user clicks Learn More, the Zscaler Client Connector app opens and displays this message in the Notifications window.
  - The message displays only if the associated access policy has the Device Posture Failure Notification enabled and the user's app profile includes a notification template with Show Device Posture Failure Remediation Notification enabled. Applies only to Zscaler Client Connector version 4.8 and later for Windows and Zscaler Client Connector version 5.0 and later for macOS. Contact Zscaler Support to enable this feature.
  - Website URL: (Optional) Enter a website URL to include in the message that users can click to learn more about or implement the remediation steps.
- (Optional) Enter a Device Posture Description.
- Click Save.
After configuring the posture profiles, you can use these profiles to configure access policies and add posture profile trust levels for Internet & SaaS.
