Endpoint and method first. {{endpoint}} {{update-is-put}} An update therefore replaces the rule, and a client that sends only some fields is relying on the service to keep the rest. {{mcp-update-no-readback}}

Field encodings that trip clients:

- State. {{enabled-to-state}}
- Protocols. {{protocols-enum}}
- ZPA IP group. {{zpa-ip-group-always-sent}}
- Id-bearing objects in Python. {{python-id-wrapping}} {{python-edns-type}}

The Web EUN flag is spelled differently across clients (divergence `web-eun-key`). {{go-web-eun-omitempty}} {{recorded-uppercase-eun}} {{ansible-uses-python}} The behavior on update is gap `web-eun-false`; the Go-wide version of the question is in [[zia.sdk-go.write-encoding]] and [[shared.sdk-go.zero-value-writes]].

Which companion fields each action needs, and the action enum, are in [[zia.dns-control.actions]]. Terraform detach and group-delete behavior for DNS rules is in [[zia.terraform.delete-detach]]. Rule ordering through Terraform is in [[zia.terraform.rule-order]].
