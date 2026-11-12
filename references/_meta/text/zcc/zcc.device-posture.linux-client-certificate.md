# Setting up the Client Certificate posture check on Linux (zcc.device-posture.linux-client-certificate)
Also called: linux client certificate posture; /opt/zscaler/private_key; ~/.Zscaler/certificates; non-exportable private key linux; linux posture certificate fails

On Linux the client certificate and its key are files Client Connector reads from fixed directories. Where they go depends on whether the profile's Non-Exportable Private Key option is on.

**What is verified.** The Linux Client Certificate check verifies that the client system trusts the CA certificate uploaded to the admin console, that the client certificate is issued by that CA or chains to it as root, and that the certificate's private key is on the system. [zcc.device-posture.linux-client-certificate:verifies] An uploaded self-signed root CA and all intermediate CAs must be installed in the client's trusted certificate store; intermediates may instead go in /opt/zscaler/intermediate_ca/. [zcc.device-posture.linux-client-certificate:ca-in-trust-store]

**Certificate file.** The client certificate must be a Base64 file ending in .pem, placed in ~/.Zscaler/certificates/ with user access when Non-Exportable Private Key is off, or in /opt/zscaler/client_cert/ with root-only access when it is on. [zcc.device-posture.linux-client-certificate:cert-locations]

**Private key.** The private key file should be Base64-encoded and its name must end in .key; it goes in ~/.Zscaler/certificates/private/ when Non-Exportable Private Key is off, or in /opt/zscaler/private_key/ when it is on; that directory is created at install, owned by root with permission 755. [zcc.device-posture.linux-client-certificate:key-locations] Client Connector checks the private key file's permissions, and posture validation fails if non-root users can access the file. [zcc.device-posture.linux-client-certificate:key-permission-enforced]

**Confirming the chain.** The vendor's check for a correct install is `openssl verify -show_chain` against /etc/ssl/certs/ on Ubuntu or /etc/pki/ca-trust/extracted/pem/ on CentOS and Fedora. [zcc.device-posture.linux-client-certificate:verify-commands]

What to check:
1. Whether the certificate and key sit in the directories for the profile's Non-Exportable Private Key setting, with the .pem and .key extensions.
2. With Non-Exportable Private Key on, whether the key file under /opt/zscaler/private_key/ is readable by any non-root user, which fails the check.
3. Whether openssl verifies the certificate chain against the system store, with any intermediates installed.

Area: zcc.device-posture, its subjects in references/_meta/spine/zcc/zcc.device-posture.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/shared/shared.device-posture.trust-levels.md (Internet & SaaS device trust levels: how posture becomes a policy criterion), from zcc.device-posture: An Internet & SaaS posture profile holds an expression for each of High Trust, Medium Trust and Low Trust; Client Connector evaluates the checks of all levels on the device and the highest matching level is used. [shared.device-posture.trust-levels:level-expressions]
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.device-posture: An app profile, on each platform's policy page (Windows, macOS, Linux, iOS and Android), can apply an Internet & SaaS (ZIA) posture profile. [zcc.device-posture:zia-posture-profile]
- depends-on references/_meta/text/zcc/zcc.device-posture.check-types.md (Device posture check types: what each checks, where it applies, and how it passes): Client Certificate applies to Windows, macOS and Linux, and its Android support ends with Client Connector 5.0; it passes when the user store holds a certificate issued by the CA uploaded to the profile and the user has the matching key pair. [zcc.device-posture.check-types:client-certificate]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated), from zcc.device-posture: Zscaler Client Connector evaluates device posture profiles every 15 minutes, new connections are established on the updated posture, and existing connections are not affected by updates to security postures. [zpa.posture-profiles.evaluation:cadence]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.policy-operand.md (The POSTURE operand in ZPA policy rules), from zcc.device-posture: In the console each posture profile in a condition set is set to VERIFIED, meaning Zscaler Client Connector verified the device against the profile's criteria, or VERIFICATION FAILED, meaning it was unable to verify the device against them. [zpa.posture-profiles.policy-operand:console-states]
