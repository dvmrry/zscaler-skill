# Dedicated IP Using Customer-Owned IP Addresses

**Source:** https://help.zscaler.com/zia/dedicated-ip-using-customer-owned-ip-addresses
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1534000, revision 3218001

---

Zscaler's dedicated IP service provides organizations with dedicated IP addresses and also allows you to bring your own IP address range (i.e., Bring Your Own IP or BYOIP) into the Zscaler cloud.
# Prerequisites
To integrate BYOIP with Zscaler's dedicated IP service:
- You require at least one /24 subnet for each Zscaler data center where you need dedicated IP addresses to be provisioned.
- You must subscribe to the Zscaler dedicated IP service, which provisions dedicated IP addresses at a single Zscaler data center. These IPs can either be Zscaler-owned or customer-owned.
- Customer-owned IP addresses must be verified using cryptographic Route Origin Authorization (ROA) for integration into Zscaler's dedicated IP service.
- The IP address prefix must be registered with your Regional Internet Registry (RIR), which manages the allocation of numbered resources like IP addresses, and associated with an Autonomous System Number (ASN).
# Integrating Customer-Owned IP Address
The following section explains the steps and process of verifying and securing your IP addresses with Zscaler to ensure successful deployment:
- Create an ROA.
  - Create a Route Origin Authorization (ROA) object in your RIR which contains your prefix and a Zscaler ASN. A ROA proves you own the IP address and that you authorize Zscaler to announce your prefix via a Zscaler ASN.
  - Zscaler operates three Autonomous Systems (ASes), one in each of the following regions. Use one of these Autonomous System Numbers (ASN) depending upon which region the BYOIP is deployed:
    - **APAC**: AS53813
    - **Americas**: AS22616
    - **EMEA**: AS62044
- When creating an ROA, the ROA object must be the same prefix length that is announced from a data center. For example, if you announce 200.100.100.0/24 from data center 1, a corresponding ROA object must be created for 200.100.100.0/24.
- Generate a self-signed certificate.
  - Create a self-signed x.509 certificate (standard format of digital certificates used to verify entities in online communications) which creates a public and private certificate. This is used to sign the Zscaler BYOIP message and to ensure the authenticity of the message.
  - For example, on Linux, use the following commands:
  - openssl genrsa -out private.key 2048
  - openssl req -new -x509 -key private.key -days 365 | tr -d '\n' > publickey.cer
  - When generated, attach the public certificate to your netblock where the BYOIP prefix is allocated, in the comment or remarks section of your RIR:
    - **ARIN**: Edit the comments of the prefix record
    - **RIPE**: Edit the remarks of the inetnum record
    - **APNIC**: Edit the remarks of the inetnum record
  - Ensure that there are no spaces or carriage returns when pasting the message into the comments or remarks section.
- Create and sign the Zscaler BYOIP message.
  - For Zscaler to authenticate your IP addresses and advertise the routes, create a Zscaler BYOIP message with the following format: <version>|<prefix>|<mesg_expire_date>
  - This is an example of a Zscaler BYOIP message: 1|200.100.100.0/24|20251231
  - In this example:
    - The version is 1
    - The BYOIP prefix is 200.100.100.0/24
    - The message expiration date is 20251231, formatted as <yyyy><mm><dd>
    - Zscaler recommends setting the expiration date at least one month ahead of creating the message as it allows appropriate time to validate and provision the IP addresses.
  - Sign the Zscaler BYOIP message with the private certificate that you created. For example, on Linux, use the following command:
  - echo "1|200.100.100.0/24|20251231" | tr -d '\n' | openssl dgst -sha256 -sigopt rsa_padding_mode:pss -sigopt rsa_pss_saltlen:-1 -sign private.key -keyform PEM | openssl base64 | tr -- '+=/' '-_~' | tr -d '\n' > my-signed-prefix-signature
- Submit a Zscaler Support ticket.
  - After signing your BYOIP message, submit a Zscaler Support ticket with the following information:
    - The list of Zscaler data centers where the IP prefixes need to be advertised. You need a minimum of one /24 address prefix for each Zscaler data center.
    - The Zscaler BYOIP text message and signed message.
  - After submitting the ticket, the Zscaler Support team validates the authenticity of the routes, advertises the routes from the requested data centers, and provisions the IP addresses from the prefix to your Zscaler tenant.
