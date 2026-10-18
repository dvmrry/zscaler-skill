# Configuring the Client Certificate Posture Check for Linux

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-client-certificate-posture-check-linux
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1443106, revision 3203694

---

This article describes how to configure the Client Certificate for Linux. You must perform these steps to successfully use the Client Certificate posture check for Linux in the Zscaler Admin Console.
The Client Certificate posture check verifies the following conditions:
- The certificate authority (CA) certificate uploaded to the Zscaler Admin Console can be trusted by the Linux client system.
- The Client Certificate on the Linux client system is either issued by the CA certificate or is on the certificate chain of trust, with the uploaded CA certificate being a root CA.
- The private key associated with the Client Certificate is on the Linux client system.
Follow these steps to configure the Client Certificate for Linux:
- On the Linux client system, install Zscaler Client Connector.
- In the Zscaler Admin Console, upload a CA certificate issued by an internal root CA trusted by the organization’s users. You can upload one of the following certificates:
- A root CA certificate (a self-signed certificate). This root CA certificate and all intermediate CAs must be installed in the trusted certificate store on the Linux client system following these sample steps.
  - Create the CA key: openssl genrsa -des3 -out ca.key 4096
  - Create the self-signed root certificate for signing client certificates: openssl req -new -x509 -days 365 -key ca.key -out ca.crt
  - Create the private key: openssl genrsa -out client.key 1024
  - Create the Certificate Signing Request (CSR) using the client key: openssl req -new -key client.key -out client.csr
  - Sign the client certificate with the root certificate: openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client_cert.pem
  - Upload the root certificate ca.crt to the Zscaler Admin Console.
  - Install the root certificate ca.crt to the client machine using the following commands:
  - On Ubuntu systems:
- sudo cp ca.crt /usr/local/share/ca-certificates/ sudo /usr/sbin/update-ca-certificates
  - On CentOS/Fedora systems:
- sudo update-ca-trust force-enable sudo cp ca.crt /etc/pki/ca-trust/source/anchors/ sudo update-ca-trust extract
  - Copy the Client Certificate file client_cert.pem to the following locations on the Linux client:
  - The certificate file must be Base64-encoded and the file name must end with the extension .pem.
    - If Non-Exportable Private Key is disabled, copy to ~/.Zscaler/certificates/. The Client Certificate file has user access permission.
    - If Non-Exportable Private Key is enabled, copy to /opt/zscaler/client_cert/. The Client Certificate file has root access only.
  - Confirm that certificates are properly installed by running the following commands:
    - On Ubuntu systems: openssl verify -show_chain -CApath /etc/ssl/certs/ <client_cert_file>
    - On CentOS/Fedora systems: openssl verify -show_chain -CApath /etc/pki/ca-trust/extracted/pem/ <client_cert_file>
- An intermediate certificate. If there are intermediate CAs on the certificate chain of trust, they must be installed either in the system store or the directory /opt/zscaler/intermediate_ca/.
- Copy the Client Certificate file client_cert.pem to the following locations on the Linux client:
The certificate file must be Base64-encoded and the file name must end with the extension .pem.
- If Non-Exportable Private Key is disabled, copy to ~/.Zscaler/certificates/. The Client Certificate file has user access permission.
- If Non-Exportable Private Key is enabled, copy to /opt/zscaler/client_cert/. The Client Certificate file has root access only.
Confirm that certificates are properly installed by running the following commands:
- On Ubuntu systems: openssl verify -show_chain -CApath/etc/ssl/certs/ <client_cert_file>
- On CentOS/Fedora systems: openssl verify -show_chain -CApath /etc/pki/ca-trust/extracted/pem/ <client_cert_file>
- Copy the private key that is associated with the Client Certificate to the Linux client system. The private key store location depends on whether or not Non-Exportable Private Key is enabled or disabled:
- If Non-Exportable Private Key is disabled, copy the private key in the user's home directory: ~/.Zscaler/certificates/private/
- If Non-Exportable Private Key is enabled, copy the private key to the directory: /opt/zscaler/private_key/. This directory is created when you install Zscaler Client Connector. This directory is owned by the root and has a permission setting of 755. Zscaler Client Connector checks the private key file's permission. Posture validation fails if the file can be accessed by non-root users.
The private key file should be Base64-encoded and the file name must end with the extension .key.
- Log in to Zscaler Client Connector.
