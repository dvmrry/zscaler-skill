A location can end up in a group, and so in a rule's scope, without anyone choosing that membership.

**At creation.** {{type-assigns-predefined}} {{workload-default}} {{profile-default}} {{omitted-profile-picks-group}}

**Over time.** {{dynamic-auto-update}} {{attribute-change-moves-policy}} {{other-can-match-groups}}

**Opting out.** {{exclude-flags}} Whether the dynamic flag also keeps a location out of the predefined groups is open {{gap:exclude-dynamic-scope}}, and the sources disagree on its reach {{divergence:exclude-dynamic-reach}}.

**Terraform and Ansible.** {{tf-exclusive-enforced-one-side}} {{tf-dynamic-field-not-in-schema}} {{tf-static-drift-fix}} {{ansible-reads-exclude-flags}}

Group types and conditions: [[zia.locations.groups]]. Which rules those groups feed: [[zia.locations.rule-scoping]].
