"The user is in ZIA but the department rule misses them" is an attribute-mapping question. {{user-fields}} {{group-fields}}

**Which attribute is the identity.** The user ID rules are in [[zia.ad-integration.identity-objects]], and the domain in the login must be registered as described in [[zia.scim.setup]]. {{login-from-username-only}}

**Name attributes.** {{name-prefix}}

**Department.** {{enterprise-department}} {{connector-omits-department}} Whether the string must match an existing department is a separate question: [[zia.scim.groups-and-departments]].

Three points are open: which attributes are required {{gap:required-attributes}}, whether custom attributes are persisted {{gap:custom-attributes}}, and how each IdP handles department by default {{gap:per-idp-department-mapping}}.
