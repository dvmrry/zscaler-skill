These are claims about how the Python and Go SDKs call the PAC file endpoints, not about PAC behavior in the service. The product model is in [[zia.traffic-forwarding.pac]].

**Reads.** {{get-returns-all-versions}}

**Cloning a version.** {{clone-strict-signature}} {{clone-needs-committed-parent}} {{clone-evicts-oldest-at-cap}}

**Create and validation.** {{add-validates-and-raises}} {{validate-raw-body}}

**Version actions.** {{python-action-body-is-object}} {{go-action-body-is-raw-commit-message}} {{automate-action-operation}} Which form the service accepts is open {{gap:action-body-contract}}.

The sources disagree on that body [[zia.traffic-forwarding.pac:version-action-body]].
