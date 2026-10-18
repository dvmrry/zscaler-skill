{{endpoint}} {{update-is-put}} {{mcp-update-no-readback}}

**Field encodings.**

- **State.** {{enabled-to-state}}
- **Protocols.** {{protocols-enum}}
- **ZPA IP group.** {{zpa-ip-group-always-sent}}
- **Id-bearing objects in Python.** {{python-id-wrapping}} {{python-edns-type}}

The Web EUN flag is spelled differently across clients {{divergence:web-eun-key}}. {{go-web-eun-omitempty}} {{recorded-uppercase-eun}} {{ansible-uses-python}} What an omitted or explicit false does on update is open {{gap:web-eun-false}}. The Go-wide version is in [[zia.sdk-go.write-encoding]] and [[shared.sdk-go.zero-value-writes]].

Which companion fields each action needs, and the action enum, are in [[zia.dns-control.actions]]. Terraform detach and group-delete behavior for DNS rules is in [[zia.terraform.delete-detach]]. Rule ordering through Terraform is in [[zia.terraform.rule-order]].
