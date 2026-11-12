# ZPA Public Service Edges (zpa.public-service-edges)
Also called: public service edge; zpa public service edge; zscaler managed service edge; zpa broker tier; is there a virtual service edge in zpa

A Public Service Edge question in Private Access is one of three, and Private Access has no Virtual Service Edge ([Virtual Service Edge is an Internet & SaaS (ZIA) product; it does not appear in the ZPA parts of the Python SDK, the Go SDK or the Terraform provider, and ZPA's customer-deployed edge is the Private Service Edge.](kb:zpa.public-service-edges.what-it-is:no-vse-in-zpa)).

1. **What is it and who runs it?** [What a ZPA Public Service Edge is](kb:zpa.public-service-edges.what-it-is).
2. **Does is_public mark a Public Service Edge?** [What is_public means on a Service Edge group](kb:zpa.public-service-edges.public-flag).
3. **How does the Public tier show up in the API?** [How the Public tier appears in the management API](kb:zpa.public-service-edges.api-visibility).

The customer-deployed tier is [ZPA Private Service Edges](kb:zpa.private-service-edges).

Area: zpa.public-service-edges, its subjects in references/_meta/spine/zpa/zpa.public-service-edges.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges): A tenant's Private Service Edge groups sit alongside Public Service Edges: a group can be configured to be prioritized over a closer Public Service Edge. [zpa.private-service-edges.what-it-is:coexists-with-public]
- links-to references/_meta/text/zpa/zpa.public-service-edges.what-it-is.md (What a ZPA Public Service Edge is)
- logged-in references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service): Log data for Public Service Edges is exported to log routers, which direct it to the Log Streaming Service hosted in the geographic region for each organization; the Log Streaming Service analyzes events reported primarily by Public or Private Service Edges. [zpa.public-service-edges.what-it-is:log-routing]
- links-to references/_meta/text/zpa/zpa.public-service-edges.api-visibility.md (How the Public tier appears in the management API)
- links-to references/_meta/text/zpa/zpa.public-service-edges.public-flag.md (What is_public means on a Service Edge group)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.private-service-edge.md (ZIA Private Service Edge)
