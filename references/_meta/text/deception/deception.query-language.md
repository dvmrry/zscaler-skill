# Deception query language: operators, constants, precedence and flags used in filters, rule conditions and ThreatParse rules (deception.query-language)
Also called: deception query; deception filter syntax; orchestration condition syntax; threatparse rule syntax

The Deception query language builds filters and conditions in the dashboard filter, Orchestration rule conditions, SIEM integration event filters, and ThreatParse rules in Miragemaker, and is a Boolean expression syntax modeled on Python. [deception.query-language:where-used] A field is always placed on the left side of a simple Boolean expression, and which fields are available varies between modules. [deception.query-language:fields] [gap:deception.query-language:module-field-lists]

**Operators.** Comparison operators include == (is), != (is not), < (less than or before), > (greater than or after), <= and >=, with the keyword alternatives shown in the operator table. [deception.query-language:comparison-operators] Bound tests use between...and and not between...and with integer, fractional or date constants. [deception.query-language:bound-tests] Regular expression tests use ~ or like against string-type fields only, with constants in JavaScript notation between forward slashes. [deception.query-language:regex-operators] The expression accepts regex flags with the meaning of Python's re flags: I (case-insensitive matching), L (makes \w, \W, \b, \B, \s and \S dependent on the locale configured in the Admin Portal), M (^ and $ also match at the start and end of each line) and S (. matches a newline). [deception.query-language:regex-flags] [gap:deception.query-language:regex-flag-note-scope]Membership tests use in and not in against a string or list constant, and at least one operand must be a field. [deception.query-language:membership] Boolean expressions combine with and, or and not, and parentheses group sub-expressions. [deception.query-language:logical-operators] Operator precedence ranks between...and first, then the binary comparison, membership and regex operators, then and, then or. [deception.query-language:precedence] [gap:deception.query-language:precedence-not-rank]

**Constants.** Constants are true/false, null, integers, decimals, double-quoted strings, single-quoted DateTime, Date and Time values, and square-bracket lists. [deception.query-language:constant-types] Lists may be heterogeneous only in the Orchestrate module, cannot contain identifiers, and may contain null and nested lists. [deception.query-language:list-constants] Time constants treat 12 AM as midnight and 12 PM as noon, date values cannot be extracted from the Investigate timestamp identifier, and now supports relative values such as 'now - 7 days'. [deception.query-language:time-constants] A single-constant expression is evaluated by truthiness: null is false, non-zero integers and decimals are true, non-empty strings are true, dates and times are always true, and non-empty lists are true. [deception.query-language:truthiness]

**Where the page contradicts itself.** [divergence:deception.query-language:hello-string-truthiness] [divergence:deception.query-language:outside-range-equivalent]

What to check:
1. Which module the query runs in, since field availability varies between modules and heterogeneous lists are supported only in the Orchestrate module.
2. Which regex flag the page's "not supported in the Filters in Dashboard" sentence refers to, before telling anyone a flag does or does not work in the dashboard filter.
3. How a single string constant or an outside-range test is evaluated: the page's examples contradict its stated rules.

Sources disagree (name both sides):
- The page's rule for single-constant truthiness says non-empty strings evaluate to true, while its example says the string "Hello" evaluates to false. [divergence:deception.query-language:hello-string-truthiness]
  - zscaler-help: A non-empty string evaluates to true.
  - zscaler-help: The example "Hello" evaluates to false and returns all events.
  Impact: The rule and the example give opposite results for a non-empty string constant; the captures do not say which is right.
- The operator table defines not between as checking that a value is outside the range, while the equivalence table gives an expression for not between that is true inside the range. [divergence:deception.query-language:outside-range-equivalent]
  - zscaler-help: not between checks that the field value is outside the range of two constants.
  - zscaler-help: The equivalence row gives network.orig_bytes >= 2000 and network.orig_bytes <= 3000 as the equivalent of network.orig_bytes not between 2000 and 3000.
  Impact: The equivalent expression matches values inside the range 2000 to 3000, so the row contradicts the stated outside-range meaning; the captures do not say which is right.

Not known (open gaps):
- Which regex flag is not supported in the dashboard filter [gap:deception.query-language:regex-flag-note-scope]: settled by source-read or lab-test
- Where not ranks in operator precedence [gap:deception.query-language:precedence-not-rank]: settled by source-read or lab-test
- Which fields each module offers [gap:deception.query-language:module-field-lists]: settled by source-read

Area: deception.query-language, its subjects in references/_meta/spine/deception/deception.query-language.json
