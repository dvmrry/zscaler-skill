# How the Go SDK obtains and renews OneAPI tokens (shared.sdk-go.auth-lifecycle)
Also called: sdk token renewal; terraform hangs on authentication; cancel does not stop authentication; sporadic 401; token refresh race

These are claims about the Go SDK's OneAPI client, which every provider built on it inherits.

**Cancellation during authentication.** Authentication and token refresh run under the client's own stored context, a never-cancelled context derived from `context.Background()`, not the caller's request context, so cancelling an operation or hitting its deadline does not cancel authentication. [shared.sdk-go.auth-lifecycle:auth-ignores-caller-context] After refreshing a token because the session was invalidated, the SDK waits a fixed two seconds before retrying, and that wait ignores cancellation. [shared.sdk-go.auth-lifecycle:refresh-fixed-sleep]

**Token state under concurrency.** Requests read the access token for the Authorization header in buildRequest without holding the client lock (buildRequest takes it only inside c.authenticate(), which releases it on return), while the renewal goroutine and the session-refresh path replace the token under that lock. [shared.sdk-go.auth-lifecycle:token-read-unlocked] Under concurrent requests and renewal, that unlocked read of a value written under the lock is a data race. [shared.sdk-go.auth-lifecycle:token-read-race] `Close` closes and clears the renewal goroutine's stop channel under the client lock, but the goroutine reads that channel without the lock, so closing a client concurrently with renewal is not race-free. [shared.sdk-go.auth-lifecycle:stop-channel-unsynchronized]

**Renewal edge case.** If a renewed token expires within one minute, the next renewal interval is zero or negative and resetting the ticker panics. The panic happens while the renewal goroutine holds the client lock, which it releases only by a later, non-deferred unlock. [shared.sdk-go.auth-lifecycle:renewal-can-panic-holding-lock]

What to check:
1. Whether a cancelled or timed-out operation is still waiting inside authentication or the fixed post-refresh wait.
2. Whether intermittent 401s line up with token renewal under parallel requests.
3. Whether the token lifetime is one minute or less, which is the condition for the renewal panic.

Inferred, not quoted (say so when an answer rests on one):
- [shared.sdk-go.auth-lifecycle:token-read-race] Tier B: Follows from token-read-unlocked: buildRequest reads `AuthToken.AccessToken` after c.authenticate() has released the lock, while startTokenRenewalTicker and ExecuteRequest's session-refresh path assign `AuthToken` while holding it, so the read is not ordered against a concurrent write. That this is a data race rests on the Go memory model; no source states it, and no run under the Go race detector is recorded.
- [shared.sdk-go.auth-lifecycle:renewal-can-panic-holding-lock] Tier B: Needs a token lifetime of one minute or less. Relies on Go's time.Ticker.Reset contract (it panics for a non-positive duration); the Go standard library is not a vendored source.

Area: shared.sdk-go, its subjects in references/_meta/spine/shared/shared.sdk-go.json
