# Adding a Cloud Application Risk Profile

**Source:** https://help.zscaler.com/zia/adding-cloud-application-risk-profile
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help — Policies — Cloud Apps — Risk Profiles — Adding a Cloud Application Risk Profile

The cloud application risk profile feature allows you to control how cloud applications are used in your organization. The feature consists of two parts: creating a cloud application risk profile and associating the profile with the Cloud App Control policy rules.

To add a cloud application risk profile:

1. Go to Administration > Risk Profiles.
2. On the Cloud Application tab, click Add Cloud Application Risk Profile. The Add Cloud Application Risk Profile window appears.
3. In the Add Cloud Application Risk Profile window:
   - **Profile Name**: Enter the name of the cloud application risk profile. This is displayed when configuring the Cloud App Control policy rules.
   - **Risk Index**: Select the risk index number (1–5, 1 being the lowest risk and 5 being the highest). It represents the risk score assigned to each cloud application based on the risk attribute values. You can select multiple risk indexes. *All the cloud applications, including those with risk index overrides from the Application Information page, are evaluated in the policy if the risk index criterion matches.*
   - **Application Status**: Select the application status. You can select either Sanctioned or Unsanctioned. To learn more, see About Cloud Application Status.
   - **Tags**: Select the tags associated with the application. To learn more, see About Cloud Application Tags.
   - **Certificates Supported**: Select the supported certifications for the application. You can choose to either include or exclude certificates.
   - **Password Strength**: Select one of the following options that represent how secure your password is for the application:
     - Good: Require users to set passwords that are at least eight characters long and contain at least one digit, one capital letter, and one special character. Only ASCII characters are allowed.
     - Poor: Require users to set passwords that are at least eight characters long and contain at least one non-alphabetic character. Only ASCII characters are allowed.
     - Unknown: Have no restriction on the strength or complexity of the passwords.
   - **Data Encryption in Transit**: Select the data encryption versions (SSLv2, SSLv3, TLSv1.0, TLSv1.1, TLSv1.2, TLSv1.3, or Unknown).
   - **SSL Cert Key Size**: Select a cert key size (Any, 2048 Bits, 256 Bits, 3072 Bits, 384 Bits, 4096 Bits, or Unknown).
   - Select **Yes** or **No** for the following hosting and security characteristics, to see which applications they are applied to. You can also select **Unknown** if that information is not known. To learn more, see Hosting and Security Characteristics.
     - Poor Terms of Service
     - Admin Audit Logs
     - Data Breach in 3 Years
     - Source IP Restrictions
     - MFA Support
     - File Sharing
     - SSL Pinned
     - HTTP Security Header Support
     - Evasive
     - DNS CAA Policy
     - Weak Cipher Support
     - Valid SSL Certificate
     - Published CVE Vulnerability
     - Vulnerable to Heartbleed
     - Vulnerable to Poodle
     - Vulnerable to Logjam
     - Support for WAF
     - Remote Access Screen Sharing
     - Vulnerability Disclosure Policy
     - Sender Policy Framework
     - DomainKeys Identified Mail
     - Domain-Based Message Authentication
     - Malware Scanning for Content

The cloud application risk profile consists of a series of **AND** operators placed between the attributes in the Application Status, Hosting Information, and Security Information sections. The attributes that allow multiple value selection (Risk Index, Certificates Supported, Data Encryption in Transit, and SSL Cert Key Size) consist of a series of **OR** operators placed between the values in them.

For example, [Risk Index (1 (OR) 3 (OR) 5)] (AND) [Application Status (Sanctioned)] (AND) [Certificates Supported (AICPA (OR) GDPR)] (AND) [SSL Pinned (Yes)].

4. Click Save and activate the change.
