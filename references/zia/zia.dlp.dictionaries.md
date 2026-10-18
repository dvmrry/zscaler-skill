Dictionaries answer "what is being looked for". A dictionary never appears on a rule directly; engines wrap dictionaries and rules reference engines ([[zia.dlp.engines]]).

{{dictionary-definition}} {{predefined-and-custom}} {{predefined-catalog}}

Cloning is narrower than the console wording suggests. {{cloning-is-limited}}

What counts as a hit depends on the threshold, so a dictionary that "should have matched" is often a threshold question. {{confidence-threshold-decides-violation}} {{threshold-type-values}} The Low, Medium and High criteria differ per dictionary, so read the dictionary's own table in the help article rather than assuming a shared scale. No source gives a numeric mapping from score to level.

Custom dictionaries come in more kinds than the console labels suggest. {{custom-dictionary-types}} {{mip-labels-dictionary}} Exact data matching (EDM) and indexed document matching (IDM) reference separate objects (EDM schemas, IDM profiles) rather than inline lists; their mechanics are not covered by any captured source.

{{validate-pattern-unreliable}}

{{dictionary-limits}}

When Terraform reads or writes dictionaries, the provider has its own field-handling defects, covered in [[zia.terraform.field-fidelity]] and [[zia.terraform.data-source-fidelity]].
