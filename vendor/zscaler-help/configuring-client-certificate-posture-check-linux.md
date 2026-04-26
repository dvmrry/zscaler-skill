# Configuring the Client Certificate Posture Check for Linux

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-client-certificate-posture-check-linux
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Client Connector Help 
Device Posture Profiles 
Configuring the Client Certificate Posture Check for Linux
Client Connector
Configuring the Client Certificate Posture Check for Linux
Ask Zscaler

This article describes how to configure the Client Certificate for Linux. You must perform these steps to successfully use the Client Certificate posture check for Linux in the Zscaler Admin Console.

The Client Certificate posture check verifies the following conditions:

The certificate authority (CA) certificate uploaded to the Zscaler Admin Console can be trusted by the Linux client system.
The Client Certificate on the Linux client system is either issued by the CA certificate or is on the certificate chain of trust, with the uploaded CA certificate being a root CA.
The private key associated with the Client Certificate is on the Linux client system.

Follow these steps to configure the Client Certificate for Linux:

On the Linux client system, install Zscaler Client Connector.
In the Zscaler Admin Console, upload a CA certificate issued by an internal root CA trusted by the organization's users. You can upload one of the following certificates:
A root CA certificate (a self-signed certificate). This root CA certificate and all intermediate CAs must be installed in the trusted certificate store on the Linux client system following these sample steps.
An intermediate certificate. If there are intermediate CAs on the certificate chain of trust, they must be installed either in the system store or the directory /opt/zscaler/intermediate_ca/.
Copy the Client Certificate file client_cert.pem to the following locations on the Linux client:

The certificate file must be Base64-encoded and the file name must end with the extension .pem.

If Non-Exportable Private Key is disabled, copy to ~/.Zscaler/certificates/. The Client Certificate file has user access permission.
If Non-Exportable Private Key is enabled, copy to /opt/zscaler/client_cert/. The Client Certificate file has root access only.

Confirm that certificates are properly installed by running the following commands:

On Ubuntu systems: openssl verify -show_chain -CApath/etc/ssl/certs/ <client_cert_file>
On CentOS/Fedora systems: openssl verify -show_chain -CApath /etc/pki/ca-trust/extracted/pem/ <client_cert_file>
Copy the private key that is associated with the Client Certificate to the Linux client system. The private key store location depends on whether or not Non-Exportable Private Key is enabled or disabled:
If Non-Exportable Private Key is disabled, copy the private key in the user's home directory: ~/.Zscaler/certificates/private/
If Non-Exportable Private Key is enabled, copy the private key to the directory: /opt/zscaler/private_key/. This directory is created when you install Zscaler Client Connector. This directory is owned by the root and has a permission setting of 755. Zscaler Client Connector checks the private key file's permission. Posture validation fails if the file can be accessed by non-root users.

The private key file should be Base64-encoded and the file name must end with the extension .key.

Log in to Zscaler Client Connector.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Device Posture Profiles
Configuring Device Posture Profiles
Configuring the Client Certificate Posture Check for Linux
Searching for a Device Posture Profile
About Internet & SaaS Posture Profiles
Adding Internet & SaaS Posture Profiles
Searching for an Internet & SaaS Posture Profile
