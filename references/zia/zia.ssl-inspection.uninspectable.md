When inspection "fails" the question is whether it could ever have worked. Four populations cannot be inspected whatever the rule says.

**The endpoint cannot trust the certificate.** {{cannot-install-cert}} {{byod-guest-segmented}} {{iot}}

**The application refuses the certificate.** {{cert-pinning}} {{pinning-exempt-by-app-or-domain}} The second kind of refusal, an application that embeds its own CA bundle, is open {{gap:ca-bundle-pinned-vendor-apps}}.

**The protocol cannot be decrypted.** {{client-certs-and-ciphers}} The setting that blocks it is Block Undecryptable Traffic in [[zia.ssl-inspection.actions]].

**The traffic never reaches the TCP path.** {{quic}}

Everything not on this list should be inspectable once the root is trusted, which is the job of [[zia.ssl-inspection.certificates]]. Choosing to exempt a population instead is [[zia.ssl-inspection.exemptions]], and what stops working for it is [[zia.ssl-inspection.bypass-impact]].
