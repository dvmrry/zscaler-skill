# Operating a GCP Zero Trust Gateway: health states, configuration rejection, traffic tests (cloud-connector.gcp-ztg.operations)
Also called: gcp ztg unhealthy; gcp ztg degraded; gcp ztg not available; gcp ztg config rejected; gcp ztg traffic simulation; gcp ztg test environment; gcp ztg analytics

The gateway list shows one service status per gateway; the gateway page breaks health down per zone and adds configuration, analytics, events and a traffic test.

**Status.** The GCP gateway list shows each gateway's region, availability zone ID, intercept deployment group, intercept endpoint group count, location, created and modified times, and a service status of Healthy, Unhealthy or Not Available. [cloud-connector.gcp-ztg.operations:list-status] The Status tab reports, per availability zone, the gateway's ability to reach Internet & SaaS (Internet), to forward direct traffic (Local Egress) and to reach Private Access (Private Applications), and the status refreshes when the page is refreshed. [cloud-connector.gcp-ztg.operations:zone-status] Healthy means the zone's backend traffic is functioning as expected; Unhealthy means traffic is being dropped because no healthy backend is processing it; Degraded means traffic may have lost redundancy but is still forwarded. [cloud-connector.gcp-ztg.operations:status-meanings]

**Intercept information.** The Intercept Information view names the intercept endpoint group and the GCP project in which it was created. [cloud-connector.gcp-ztg.operations:intercept-information]

**Configuration.** The gateway can reject an activated Internet & SaaS configuration that would make it unable to function; the Config tab lists activated versions as Active or Inactive, a latest version that is not Active may have been rejected, and two versions can be compared. [cloud-connector.gcp-ztg.operations:config-rejection]

**Analytics and events.** Analytics graphs total bytes and total packets processed by the internal load balancer over a chosen timeframe as Average, Max or Sum; the byte count excludes health-check traffic. [cloud-connector.gcp-ztg.operations:analytics] The Events tab lists events in a timeframe with event, category, type, start time and status. [cloud-connector.gcp-ztg.operations:events]

**Traffic simulation.** Traffic Simulation tests forwarding and Internet & SaaS policy: the Zscaler service sets up a virtual environment in the Zscaler GCP account, sends traffic through the endpoint, and returns the output of the GCP curl command. [cloud-connector.gcp-ztg.operations:simulation-mechanics] A test environment takes approximately 5 minutes to create, lasts one hour, can be renewed for one more hour, and tests run once it reaches the CREATE_COMPLETE state. [cloud-connector.gcp-ztg.operations:simulation-lifetime] A test created in one GCP gateway is available in all GCP gateways of the same Cloud Connector account in all regions, and while it is active a connected endpoint owned by the Zscaler account appears on the gateway. [cloud-connector.gcp-ztg.operations:simulation-shared] A test takes a protocol of HTTP or HTTPS, a URL, optional curl parameters, and verbose (-v) and insecure (-k) options; run is offered only after a test environment exists. [cloud-connector.gcp-ztg.operations:simulation-options]

What to check:
1. Which zone and which path (Internet, Local Egress, Private Applications) is Unhealthy or Degraded on the Status tab; Unhealthy means traffic in that zone is dropped.
2. Whether the latest Internet & SaaS configuration version is Active on the Config tab, or the gateway rejected it.
3. Whether a test environment already exists in the account before creating one, since a test created on one gateway is shared by every GCP gateway in the account.

Area: cloud-connector.gcp-ztg, its subjects in references/_meta/spine/cloud-connector/cloud-connector.gcp-ztg.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.md (GCP Zero Trust Gateway: managed service boundary and restrictions)
- see-also references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.creation.md (Creating a GCP Zero Trust Gateway: region, zones, location, IAM principals)
