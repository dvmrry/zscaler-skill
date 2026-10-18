These are claims about the Go SDK's OneAPI client, which every provider built on it inherits.

**Cancellation during authentication.** {{auth-ignores-caller-context}} {{refresh-fixed-sleep}}

**Token state under concurrency.** {{token-read-unlocked}} {{stop-channel-unsynchronized}}

**Renewal edge case.** {{renewal-can-panic-holding-lock}}
