The provider validates URL Filtering user agents against a shorter list than some of its sources. {{validator-omits-brave}} {{validator-shared-by-three-resources}}

**BRAVE.** {{header-profile-accepts-brave}} {{hcl-cannot-declare-brave}} The contract and the provider disagree on SSL Inspection {{divergence:brave-provider-vs-contract}}. {{read-copies-user-agents}} Whether a read can fail on a BRAVE value is not established {{gap:issue-606-read-time-failure}}.

**Isolation.** {{isolate-needs-cbi}} {{isolate-validation}}
