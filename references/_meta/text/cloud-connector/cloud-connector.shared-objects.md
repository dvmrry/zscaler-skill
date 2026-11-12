# Objects ZIA and Cloud & Branch Connector share: IP groups and network services (cloud-connector.shared-objects)
Also called: shared objects; zia and ztc shared objects; ip source groups shared with zia; backfill from zia; creatorContext; objects created in zia appear in cloud connector

Some Cloud & Branch Connector objects are not separate from ZIA's. The Cloud & Branch Connector API gives source IP groups, destination IP groups, IP pools (`/ipGroups`), network services and network service groups a `creatorContext` of ZIA or EC: the product the object was created in. [cloud-connector.shared-objects:creator-context] So the Cloud & Branch Connector lists of those objects can hold objects created in ZIA, not only its own. [cloud-connector.shared-objects:zia-created-listed]

**Which pairs.** The marker sits on the four kinds that have a ZIA counterpart of the same name, plus IP pool groups, which have none: Source IP groups, destination IP groups, network services and network service groups are object types of both the ZIA and the Cloud & Branch Connector APIs. [cloud-connector.shared-objects:twin-types] Whether a pair is one record seen from both products, so that an edit or delete in one shows in the other, is open [gap:cloud-connector.shared-objects:same-record]. Writing a ZIA-origin group through the Cloud Connector API is in [Writes to ZIA-origin and non-editable source groups through the Cloud Connector API](kb:cloud-connector.source-ip-groups:zia-origin-editability). The Cloud & Branch Connector help for destination IP groups is in [Destination IP groups in Cloud & Branch Connector: types, predefined groups and forwarding limits](kb:cloud-connector.shared-objects.destination-ip-groups), for IP pools in [IP pools for Private Access DNS resolution in Cloud & Branch Connector: default pool, per-location pools and entries](kb:cloud-connector.shared-objects.ip-pools) and for network services and groups in [Network services and network service groups in Cloud & Branch Connector](kb:cloud-connector.shared-objects.network-services).

**Pairs without the marker.** Locations and workload groups also exist in both products under the same names, but nothing public marks them as shared [gap:cloud-connector.shared-objects:unmarked-twins].

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.shared-objects:zia-created-listed] Tier B: A ZIA value in creatorContext is meaningful only for an object created in ZIA that the Cloud & Branch Connector API returns; no source states the sync directly.
- [cloud-connector.shared-objects:twin-types] Tier B: Read from the zscalerctl catalogue, which has both types of each name, and the creatorContext marker; the field-for-field match of each pair is not checked.

Not known (open gaps):
- Whether a shared pair is one record in both products [gap:cloud-connector.shared-objects:same-record]: settled by lab-test or operator-experience
- Whether locations and workload groups are shared between ZIA and Cloud & Branch Connector [gap:cloud-connector.shared-objects:unmarked-twins]: settled by lab-test or operator-experience

Area: cloud-connector.shared-objects, its subjects in references/_meta/spine/cloud-connector/cloud-connector.shared-objects.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.shared-objects.destination-ip-groups.md (Destination IP groups in Cloud & Branch Connector: types, predefined groups and forwarding limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.shared-objects.ip-pools.md (IP pools for Private Access DNS resolution in Cloud & Branch Connector: default pool, per-location pools and entries)
- links-to references/_meta/text/cloud-connector/cloud-connector.shared-objects.network-services.md (Network services and network service groups in Cloud & Branch Connector)
- links-to references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.md (Cloud Connector source IP groups: what they are and what is unknown about them)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/ip-source-groups.md (config type)
- configured-via references/_meta/text/types/zia/ip-source-groups.md (config type)
- configured-via references/_meta/text/types/ztw/ip-destination-groups.md (config type)
- configured-via references/_meta/text/types/zia/ip-destination-groups.md (config type)
- configured-via references/_meta/text/types/ztw/network-services.md (config type)
- configured-via references/_meta/text/types/zia/network-services.md (config type)
- configured-via references/_meta/text/types/ztw/network-service-groups.md (config type)
- configured-via references/_meta/text/types/zia/network-service-groups.md (config type)
- configured-via references/_meta/text/types/ztw/ip-groups.md (config type)
- see-also references/_meta/text/cloud-connector/cloud-connector.api.locations-wire.md (Cloud Connector locations on the wire: the profile values and what Terraform can manage)
