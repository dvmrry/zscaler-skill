# Event Monitoring notification channels: email, webhook and Amazon SNS setup and verification (shared.event-monitoring.channels)
Also called: subscriptions/channels; sns:verify; zscaler_role_arn; sns topic policy template; event monitoring sns 422; event monitoring webhook not receiving; setup_required

The contract has five channel operations: GET /subscriptions/channels, GET on /subscriptions/channels/email, /webhook and /sns, and POST /subscriptions/channels/sns:verify. [shared.event-monitoring.channels:channel-operations]

**Discovering channels.** GET /subscriptions/channels lists the channel types supported for the tenant, each with `type`, `description` and `setup_required`; SNS shows `setup_required: true`, meaning more configuration is needed before it can be used. [shared.event-monitoring.channels:channel-list]

**Email and webhook.** Email addresses in `email.to`, `cc` and `bcc` must match `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`, and `webhook_url` must match `^https?://.+$`. [shared.event-monitoring.channels:validation-rules]

**Amazon SNS.** Zscaler publishes to the customer's SNS topic from a Zscaler-managed AWS account using an assumed IAM role, and the customer controls who can publish through the topic policy. [shared.event-monitoring.channels:sns-cross-account] GET /subscriptions/channels/sns returns the Zscaler IAM role ARN (`zscaler_role_arn`), the required permissions (`sns:Publish` and `sns:GetTopicAttributes` in the example) and an SNS topic policy template (`sns_topic_policy_template`) to apply to the topic. [shared.event-monitoring.channels:sns-details] The SNS channel supports any AWS commercial region where SNS is available. [shared.event-monitoring.channels:sns-regions]

**Verifying SNS access.** POST /subscriptions/channels/sns:verify takes a required `topic_arn` matching `arn:aws:sns:<region>:<12-digit-account>:<topic-name>` (optional .fifo suffix) and an optional `region`, inferred from the ARN when omitted; the response carries `verified` and `topic_arn`, plus `message_sent` on success or `error` on failure. [shared.event-monitoring.channels:verify-request] The guide calls verification a read-only check of whether Zscaler can call sns:GetTopicAttributes on the topic, and the OpenAPI operation likewise describes it as a read-only check of sns:GetTopicAttributes. [shared.event-monitoring.channels:verify-read-only] Whether it also publishes a test message differs: the guide's no-test-message statement and the OpenAPI operation's read-only description set against the guide's success example and the OpenAPI response's `message_sent` [divergence:shared.event-monitoring.channels:verify-test-message]. sns:verify returns 200 when publish access is validated, 400 for a malformed request or ARN, 404 for a wrong endpoint path (the guide says it does not indicate a missing topic), 422 when the request is valid but verification failed at AWS (missing permission, missing topic or another AWS error), and 500 for an internal error. [shared.event-monitoring.channels:verify-codes]

**Coverage.** A captured channel schema, or a successful verification, does not show that every channel is enabled for a tenant or that a notification will be delivered; channel availability is per tenant. [shared.event-monitoring.channels:no-delivery-proof]

What to check:
1. Before creating an SNS subscription, whether sns:verify returned 200 with verified true for the topic ARN.
2. For a 422 from sns:verify, whether the topic exists and its policy lets the Zscaler role call sns:GetTopicAttributes and sns:Publish.
3. For an email or webhook subscription that never fires, whether the address matches the channel's validation pattern and the webhook is reachable.

Inferred, not quoted (say so when an answer rests on one):
- [shared.event-monitoring.channels:no-delivery-proof] Tier B: The channel list is described as the channels supported for the tenant, and verification is described as a read-only GetTopicAttributes check (verify-read-only), though whether it also publishes a test message differs between the guide's statement and its success example (verify-test-message).

Sources disagree (name both sides):
- Whether sns:verify publishes a test message to the topic. [divergence:shared.event-monitoring.channels:verify-test-message]
  - zscaler-help: The guide's Step 5 says verification checks sns:GetTopicAttributes, is read-only, and publishes no test message.
  - api-specs: The OpenAPI operation description also calls it a read-only GetTopicAttributes check.
  - zscaler-help: The guide's success example returns `message_sent` holding a test message body.
  - api-specs: The OpenAPI response schema describes `message_sent` as the test message sent during verification, present on success.
  Impact: A caller cannot tell from the sources whether a successful verification has put a message on the topic,.

Area: shared.event-monitoring, its subjects in references/_meta/spine/shared/shared.event-monitoring.json
