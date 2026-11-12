# TLS between the App Connector and the log receiver (zpa.log-receivers.tls)
Also called: lss tls; mutual tls log receiver; use_tls; log receiver certificate; lss certificate trust; app connector enrollment certificate trust store

TLS on the stream is optional and mutual, and its trust is set up outside the receiver object.

**Behavior.** Mutual TLS between the log receiver and the App Connector can be enabled when configuring a log receiver, and LSS traffic flows between them only after mutual authentication is established, which requires them to exchange certificates. [zpa.log-receivers.tls:mutual-tls-optional] TLS Encryption is disabled by default on a receiver and requires the receiver to support TLS communication. [zpa.log-receivers.tls:tls-default-off]

**Receiver requirements.** The log receiver must support TLS, must have a client certificate for mutual TLS that uses a public root CA, and must validate the chain of trust to the App Connector's enrollment certificate, for example by holding that certificate in its trust store. [zpa.log-receivers.tls:receiver-requirements]

**App Connector side.** The App Connector receives a root certificate automatically during deployment and is designed to trust log receiver certificates signed by the global public root CAs or by custom root CAs used as its enrollment certificate. [zpa.log-receivers.tls:connector-trust]

**What the tools expose.** The receiver object in the Go SDK, the Python SDK model and the Terraform schema carries only a boolean useTls: it has no CA, certificate or peer-verification attribute. [zpa.log-receivers.tls:tls-flag-only]

What to check:
1. That the receiver supports TLS and presents a client certificate from a public root CA when TLS Encryption is on.
2. That the receiver's trust store holds the App Connector's enrollment certificate.
3. That a trust problem is fixed on the receiver or connector, not in the receiver object, which carries only a TLS flag.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.tls:tls-flag-only] Tier B: Absence claim: the Go LSSConfig struct, the Python LSSConfig model and the Terraform config schema were read in full and hold no attribute for a CA, certificate or peer verification.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- depends-on references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment): The App Connector receives a root certificate automatically during deployment and is designed to trust log receiver certificates signed by the global public root CAs or by custom root CAs used as its enrollment certificate. [zpa.log-receivers.tls:connector-trust]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
