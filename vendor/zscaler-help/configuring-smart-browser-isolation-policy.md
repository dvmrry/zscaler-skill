# Configuring Smart Browser Isolation Policy

**Source:** https://help.zscaler.com/zia/configuring-smart-browser-isolation-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1402926, revision 3239209

---

You can configure a Smart Browser Isolation policy that automatically isolates potentially malicious web content using the AI/ML models. This policy identifies suspicious websites and decrypts them using SSL/TLS Inspection and presents the users with a rendition of the actual websites in a remote browser using Zero Trust Browser (formerly Isolation).
Enable the Inspect Inbound Traffic and Inspect Outbound Traffic toggles on the Malware Protection page (Cyberthreat Protection > Policy > Malware Protection > Malware Policy) for the Smart Browser Isolation policy to work.
To configure the Smart Browser Isolation policy:
- From the navigation menu, go to Zero Trust Browser > Browser Isolation Internet Access > Smart Isolation.
- The Smart Isolation page appears.
- On the Smart Isolation page:
  - Click Edit.
  - You can configure the following sections:
    - Smart Browser Isolate
    - Enable AI/ML based Smart Browser Isolation: Enable this option to protect users from suspicious websites hosting malicious active content using AI/ML models, which continually identify suspicious domains. Enabling this option automatically creates an editable SSL/TLS Inspection rule to decrypt suspicious websites. When this feature is enabled, the following options appear:
      - Users: Select the users to which the policy applies. You can select up to 32 users. If you select no values, policy evaluation ignores this criterion.
      - Groups: Select the groups to which the policy applies. You can select up to 32 groups. If you select no values, policy evaluation ignores this criterion.
      - Contact Zscaler Support to increase the limit of Users or Groups.
    - Cloud Browser Isolate
    - Browser Isolation Profile: You can choose the isolation profile to which the policy applies.
    - Ensure to create isolation profiles for your organization in the Zscaler Admin Console for them to be available in this field.
  - See image.
- Click Save and activate the change.
