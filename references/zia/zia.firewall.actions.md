A firewall rule's action decides what happens to the flow once the rule matches. The two rule types do not share a vocabulary.

{{filtering-action-values}} {{ips-action-values}} {{bypass-ips-is-bypass}} When a question says "bypass the firewall for this traffic", the only captured bypass value is the IPS one; Filtering has no bypass value; ALLOW is the nearest value in the enum.

What the three block variants and EVAL_NWAPP do on the wire is not documented in any captured source: the old reference described BLOCK_DROP as a silent drop, BLOCK_RESET as a TCP reset, BLOCK_ICMP as an ICMP unreachable and EVAL_NWAPP as a hand-off to a network-application evaluator that does not terminate evaluation. Those are plausible readings of the names, but none is stated, so they are held as a gap and should not be quoted as vendor behavior. {{full-logging-block-only}} The log fields that record the action are in [[zia.firewall.traffic-path]].

What to check: read the action value from the rule itself rather than assuming from the name, and for any answer that depends on what the client sees (timeout or reset) say that it is unverified.
