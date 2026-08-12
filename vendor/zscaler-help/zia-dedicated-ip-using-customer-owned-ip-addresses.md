# Dedicated IP Using Customer-Owned IP Addresses

**Source:** https://help.zscaler.com/zia/dedicated-ip-using-customer-owned-ip-addresses
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Zscaler's Dedicated IP service can use either Zscaler-owned addresses or a
customer-owned address range brought into the Zscaler cloud. The article names
the latter option **Bring Your Own IP (BYOIP)**.

## Prerequisites

- At least one `/24` subnet is required for every Zscaler data center where the
  organization wants Dedicated IP addresses provisioned.
- The organization must subscribe to the Dedicated IP service.
- Customer-owned prefixes must be covered by cryptographic Route Origin
  Authorization (ROA).
- The prefix must be registered with the appropriate Regional Internet
  Registry (RIR) and associated with an Autonomous System Number (ASN).

## Route authorization

The customer creates an ROA containing the prefix and the regional Zscaler ASN.
The article lists:

| Region | Zscaler ASN |
|---|---|
| APAC | `AS53813` |
| Americas | `AS22616` |
| EMEA | `AS62044` |

The ROA prefix length must match the prefix announced from the data center.

## Proof of control and provisioning

The documented workflow is:

1. Generate a self-signed X.509 certificate and publish the public certificate
   in the RIR netblock's comment or remarks field.
2. Create a message in the form
   `<version>|<prefix>|<mesg_expire_date>`, with the date formatted `yyyymmdd`.
   Zscaler recommends an expiration date at least one month in the future.
3. Sign the message with the certificate's private key using SHA-256 and RSA-PSS.
4. Open a Zscaler Support ticket containing the requested data centers, the
   plain-text BYOIP message, and its signature.
5. Zscaler Support validates the route authorization, advertises the routes
   from the requested data centers, and provisions addresses from the prefix to
   the ZIA tenant.

This article documents a Support-assisted Dedicated IP provisioning path. It
does not make BYOIP equivalent to customer-managed Source IP Anchoring (SIPA).
