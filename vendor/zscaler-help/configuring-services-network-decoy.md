# Configuring Services on a Network Decoy

**Source:** https://help.zscaler.com/deception/configuring-services-network-decoy
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This capture is limited to the workflow and fields relevant to the Gen AI MCP
server service. The source article also covers Web, Shares, FTP, SSH, Telnet,
Windows, database/messaging, SCADA/IoT, Custom, and Custom Docker services.

Services are interactive network-decoy components that imitate legitimate
systems. The documented edit workflow is to stop the decoy, open or create an
Internal or Zero Trust Network decoy, configure the Services tab, submit the
change, and start the decoy again.

## Gen AI and MCP server service

The Gen AI service offers four application dataset types:

- Static
- High Interaction
- Adaptive
- MCP Server

The article describes a standard MCP server as middleware between AI
applications and external systems or data sources. A Deception MCP server
decoy instead connects an AI application or LLM chatbot to decoy application
tools. Any MCP-compatible application, including MCP Inspector, can interact
with those tools.

The tools generate fabricated responses. The Deception Admin Portal can use
hostnames from deployed decoys, including Threat Intelligence and Zero Trust
Network decoys, and provide them to the AI application for inclusion in tool
responses. This is intended to direct an attacker toward other decoys in the
customer environment.

The MCP server configuration includes:

- **MCP Server Name**
- **MCP Server Version**
- one or more **MCP Server Applications**
- one or more ports, with SSL enabled or disabled per port
- an optional SSL certificate in PEM format
- an optional unencrypted SSL private key in PEM format

The Deception Admin Portal does not support encrypted private keys for custom
SSL certificates on this path.

## Source boundary

This article configures a network decoy that imitates an MCP server for an
adversary-facing interaction. It does not document a Zscaler administrative
MCP integration, a Deception management API, or management tools for the
Deception tenant.
