# Python SDK client-side checks that raise: PRA credentials and approval times, and custom control rules (zpa.sdk-python.validation-helpers)
Also called: is_valid_ssh_key; Invalid SSH key format; Unsupported credential_type; validate_and_convert_times; Start time cannot be more than 1 hour in the past; pra approval one year; add_custom_control rule TypeError

These are claims about checks the Python SDK runs before sending. Most of them raise an exception, so a call that fails here never reaches the error slot.

**PRA credentials.** `add_credential` and `update_credential` raise ValueError, rather than returning it, when username or password is missing for USERNAME_PASSWORD, when username or private key is missing for SSH_KEY, when the password is missing for PASSWORD, and for any other `credential_type`. [zpa.sdk-python.validation-helpers:credential-type-raises] The SSH key check accepts any text that contains one of the headers `-----BEGIN OPENSSH PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----` or `-----BEGIN EC PRIVATE KEY-----`; it does not parse the key. [zpa.sdk-python.validation-helpers:ssh-key-check]

**PRA approvals.** The PRA approval time conversion raises ValueError for a time zone that is not in the pytz list, for a start time more than one hour in the past, and for an end time more than 365 days after the start. [zpa.sdk-python.validation-helpers:approval-times-checked] `add_approval` converts times only when both `start_time` and `end_time` are given, using the working hours time zone or UTC, and then sends epoch `startTime` and `endTime`; `update_approval` makes the same call. [zpa.sdk-python.validation-helpers:approval-times-both-needed] How the optional working hours are sent is in [PRA operations in the Python SDK and Ansible approvals](kb:zpa.pra.tooling).

**App Protection custom controls.** `add_custom_control` rebuilds each rule from its `type`, optional `names` and each condition's `lhs`, `op` and `rhs`, raising TypeError for a rule that is not a dictionary and KeyError for a rule or condition missing those keys; other keys on a rule are dropped. [zpa.sdk-python.validation-helpers:custom-control-rule-shape]

What to check:
1. Whether a credential or approval call raised before sending, and was wrapped in a try block, since these checks raise ValueError.
2. Whether an SSH key passed the SDK check only because it contained a PEM header, which says nothing about the key being usable.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.pra.tooling.md (PRA operations in the Python SDK and Ansible approvals)
