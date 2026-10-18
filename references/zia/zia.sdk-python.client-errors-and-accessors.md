This describes the Python SDK as a client, not ZIA behavior. It covers how a failing call surfaces, how service objects are obtained, and the property and method names a script has to write exactly.

**Getting a service.** {{accessor-new-instance}}

**Accessor names.** {{url-filtering-accessor}} {{categories-accessor}} {{activation-accessor}}

**Errors.** {{api-error-object}} {{raise-exception-flag}} {{exception-classes-exist}} The tuple return and the rule that a caller must test the error slot are in [[zia.sdk-python.response-shape]].

**Misspelled names.** {{dns-gateway-accessor-misspelled}} {{browser-control-class-misspelled}} {{custom-file-type-getter-misspelled}}

**A fixed response-parsing bug.** {{l10n-key-corruption-fixed}} {{network-services-lite-model}} Paging and search behavior of the same client is in [[zia.sdk-python.request-conventions]].
