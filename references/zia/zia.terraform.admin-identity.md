The provider manages ZIA administrator roles, administrator accounts and local users as separate resources, and several of their attributes are validated or refreshed in ways the schema alone does not show. Role type, rank and password handling are the places a plan most often surprises an operator.

**Admin roles.** {{role-type-values}} {{role-type-immutable}} {{sdwan-role-constraints}}

**Rank.** {{rank-unvalidated}} The documented range and direction of rank are in [[zia.dlp.rules]]. Whether the values are the same in every tenant is open {{gap:rank-values-fixed}}.

**Admin passwords.** {{admin-password-not-returned}}

**Local users.** {{user-read-sets-no-password}} {{user-read-from-list}} {{user-email-unique}} The enrollment of authentication methods is covered in [[zia.terraform.multi-step-writes]], and the first-role-only expansion of admin users in [[zia.terraform.field-fidelity]].
