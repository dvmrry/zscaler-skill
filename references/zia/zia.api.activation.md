A ZIA write is not live until it is activated {{saved-not-live}}, and the activation call is separate from the write, although ending a session can activate on its own [[zia.terraform.activation-methods:session-end-autoactivation]]. The Terraform side of this is in [[zia.terraform.activation]], and the product-level lifecycle across ZIA and Cloud and Branch Connector is in [activation](../shared/activation.md).

**Saved, not live.** {{saved-not-live|ref}} {{status-values}}

**The calls.** {{sdk-activation-endpoints}} {{oneapi-sample-activate}} Which path the legacy guide names is in dispute {{divergence:activate-path-differs}}. The Python call names are in [[zia.sdk-python.client-errors-and-accessors:activation-accessor]].
