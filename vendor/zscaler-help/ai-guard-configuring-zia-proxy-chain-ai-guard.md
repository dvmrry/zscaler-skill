# Integrating ZIA with AI Guard | Zscaler

**Source:** https://help.zscaler.com/ai-guard/configuring-zia-proxy-chain-ai-guard
**Captured:** 2026-05-22 via Codex Browser.

---

Thanks to the integration of AI Guard with Internet & SaaS (ZIA), you can configure ZIA to invoke AI Guard for processing user's AI traffic.

Prerequisites

Before you can integrate ZIA with AI Guard, ensure that you:

Have an AI Guard subscription.

Have linked ZIA and AI Guard. Contact Zscaler Support to ensure they are linked.

Have the CA certificate of the AI Guard endpoint. Contact Zscaler Support if you need help getting it.

Are using the following ZIA endpoint location when configuring the ZIA proxy: forward.zseclipse.net, Port: 9443. This is subject to change, and you will receive notifications if that happens.

Are using a supported generative AI application. The following table lists the supported AI applications (last updated: April 14, 2026); use the page controls at the bottom-right of the table to view all providers:

1 to 10 of 18. Page 1 of 2

Application

Client Types

Domains Required

Anthropic (Claude)

Web Browsers

Claude Desktop

Claude CLI

Claude Code for VS Code

Claude MS Add-in (Excel/PPT)

.claude.ai

.api.anthropic.com

Bolt.new

Web Browsers

.bolt.new

Builder.io

Web Browsers

.api.builder.io

.cdn.builder.io

.cdn.builder.codes

DeepAI

Web Browsers

.api.deepai.org

ElevenLabs

Web Browsers: Text-to-speech supported

api.us.elevenlabs.io

GitHub Copilot

Web Browsers

api.individual.githubcopilot.com

Google Gemini

Web Browsers

.gemini.google.com

Google Gemini Code

Web Browsers

.gemini.google.com

cloudcode-pa.googleapis.com

Google Gemini Enterprise

Web Browsers

.biz-discoveryengine.googleapis.com

.content-us-discoveryengine.googleapis.com

.discoveryengine.clients6.google.com

.us-discoveryengine.clients6.google.com

.eu-discoveryengine.clients6.google.com

.global-discoveryengine.clients6.google.com

.us-discoveryengine.googleapis.com

.eu-discoveryengine.googleapis.com

Google Gemini Workspaces

Google Suite (Docs, Slides, Sheets): "Ask Gemini" and "Generate document" are supported.

"Help me write," "Refine," and "Refine the selected text" functionality is not supported.

appsgenaiserver-pa.clients6.google.com

Page 1 of 2

Configuring ZIA

Uploading your AI Guard CA certificate to ZIA

To upload your AI Guard CA certificate to ZIA:

In the Zscaler Admin Console, go to Infrastructure > Internet & SaaS > Network Policies > Root Certificates.

Click Add Root Certificates. The Add Root Certificate window appears.

See image.

In the Add Root Certificate window:

Name: Enter a name for your certificate.

Type: From the drop-down menu, select Proxy Chaining.

File: Browse and select the AI Guard CA certificate (.pem file) from your system.

Click Save.

Configuring the ZIA Proxy

To configure your ZIA proxy:

In the Zscaler Admin Console, go to Infrastructure > Internet & SaaS > Network Policies > Proxies and Gateways.

In the Proxies tab, click Add Proxy. The Add Proxy window appears.

See image.

In the Add Proxy window:

Proxy Name: Enter a user-friendly name for the third-party proxy that you are defining.

IP Address/FQDN: Enter the IP address or the FQDN of the third-party proxy service. This is the endpoint listed in the Prerequisites section.

Port: Enter the port number on which the third-party proxy service listens to the requests forwarded from the Zscaler service. This is the port listed in the Prerequisites section.

Proxy's Root Certificate: Select the root certificate you previously created.

Insert X-Authenticated-User: Enable this setting.

Enable Base64 Encoding for X-Authenticated-User value: Disable this setting.

Description (Optional): Enter additional notes or information. The description cannot exceed 256 characters.

Click Save.

In the Proxy Gateways tab, click Add Gateway for Proxies. The Add Gateway for Proxies window appears.

See image.

In the Add Gateway and Proxies window:

Name: Enter a name for your proxy gateway.

Fail Close: Leave selected.

Primary Proxy: Select the proxy you previously created.

Secondary Proxy: Leave blank.

Click Save.

Creating a rule for ZIA to drop QUIC traffic

To create a rule for ZIA to drop QUIC traffic:

In the Zscaler Admin Console, go to Policies > Access Control > Firewall > Firewall Filtering Policy.

See image.

On the Firewall Filtering Policy page, click Add Rule. The Add Rule window appears.

In the Add Rule window:

Criteria: Select Network Services from the drop-down menu.

Network Services: Select QUIC from the dropdown menu.

Network Services: In the Services tab, click the drop-down menu and select QUIC.

Network Traffic: From the drop-down menu, select Block/Drop.

Rule Name: Enter a name for the rule..

See image.

If you have ZIA Tunnel 1.0, disable the QUIC protocol from your browser. Refer to your specific browser's instructions to disable QUIC.

Click Save.

Creating a wildcard destination group and forwarding rule

To create a wildcard destination group and forwarding rule:

In the Zscaler Admin Console, go to Policies > Access Control > Firewall > IP &FQDN Groups.

See image.

On the Destination IPv4 Groups tab, click Add Destination IPv4 Group. The Add Destination IPv4 Group window opens.

In the Add Destination IPv4 Group window:

Name: Enter a name such as AI Guard.

Type: Select Wildcard FQDN.

Wildcard FQDN: Add in the required domains for your desired AI providers and click Add Items. The AI domains are found in the Prerequisites section.

Enter wildcard FQDNs using an asterisk (*) as the wildcard character. Provide each entry in a new line.

Description (Optional): Enter additional information not exceeding 10240 characters.

See image.

Click Save.

In the Zscaler Admin Console, go to Infrastructure > Internet & SaaS > Network Policies > Forwarding Control Policy.

See image.

On the Forwarding Control page, click Add Rule. The Add Forwarding Rule window appears.

In the Add Forwarding Rule window:

Criteria: Select Destination IPv4 Groups.

Destination IPv4 Groups: Select the wildcard FQDN destination group you previously created.

Rule Name: Enter a name for the forwarding rule.

Forwarding Method: Select Proxy Chaining.

Forward to Proxy Gateway: Select the proxy gateway you previously created.

See image.

For traffic forwarding to work, users must have signed in to ZIA through mechanisms such as Zscaler Client Connector, and they must be authenticated by your IdP. You can check the logs in ZIA to ensure that traffic forwarding is enabled. To learn more, see About Insights Logs.

Configuring AI Guard

You must add each LLM provider and AI application to AI Guard manually. To learn more, see Add and Manage AI Applications for AI Guard, Managing LLM Providers for AI Guard, and Managing LLM Provider Credentials for AI Guard.

AI users defined in ZIdentity show up automatically in AI Guard after you have configured ZIA successfully. Groups are not yet automatically populated. You can define policies in Policy Match for both individual users and groups you've created. The default group is AllUsersGroup.

See image.
