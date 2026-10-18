These are claims about the Go SDK's OneAPI client, which every provider built on it inherits.

Authentication does not follow the caller's cancellation. {{auth-ignores-caller-context}} {{refresh-fixed-sleep}} So an operation that has already been cancelled can still sit in authentication or in the post-refresh wait.

Token state is shared across concurrent requests without consistent locking. {{token-read-unlocked}} {{stop-channel-unsynchronized}} The practical effect is intermittent rather than deterministic: a request may go out with a token being replaced, which is one plausible source of sporadic 401s under heavy parallel use.

One renewal edge case can wedge the client. {{renewal-can-panic-holding-lock}}
