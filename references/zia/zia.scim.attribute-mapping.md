"The user is in ZIA but the department rule misses them" is an attribute-mapping question. {{user-fields}} {{group-fields}}

**Which attribute is the identity.** userName is the login name in user@domain form, so it must also fit the domain registration in [[zia.scim.setup]]; the user ID rules apply, see [[zia.ad-integration.identity-objects]]. Do not map externalId or emails.value to the login: they are stored for reference.

**Name attributes.** {{name-prefix}} By inference from the prefix difference, a mapping copied from a ZPA connector may not carry first and last names into ZIA.

**Department** is the attribute most often missing. {{enterprise-department}} {{connector-omits-department}} Whether the string must match an existing department is a separate question: [[zia.scim.groups-and-departments]].

Three points are open and recorded as gaps rather than answered: which attributes are required, whether custom attributes are persisted, and how each IdP handles department by default.

What to check: the connector's attribute mapping for the enterprise extension, the userName/login form, and the ZIA user record's department field after a push.
