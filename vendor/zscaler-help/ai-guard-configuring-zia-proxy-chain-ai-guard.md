# Integrating ZIA with AI Guard | Zscaler

**Source:** https://help.zscaler.com/secure-ai-users/integrating-zia-ai-guard
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/secure-ai-users/integrating-zia-ai-guard
**Help node:** `1540870`
**Help revision:** `3229535`
**Body content length:** 24,131 HTML characters

---

Thanks to the integration of AI Guard with Internet & SaaS (ZIA), ZIA can
invoke AI Guard to process users' AI traffic.

## Prerequisites

The current public page requires:

- An AI Guard subscription.
- Linked ZIA and AI Guard tenants; the page directs administrators to contact
  Zscaler Support to ensure they are linked.
- A single AI Guard mapping to one tenant and one domain. The page gives the
  example that the same domain cannot be mapped to both QA and Production
  tenants.
- Zscaler Experience Center enabled for the tenant. The page says its
  ZIA-related configuration assumes Experience Center.
- The CA certificate of the AI Guard endpoint.

The supported-application table is marked **last updated: September 2, 2026**.
The public table includes these providers and required domains. Client-type
details remain on the linked page.

| Provider | Domains required |
|---|---|
| Anthropic (Claude) | `*.claude.ai`, `*.api.anthropic.com` |
| Bedrock-Anthropic | Regional `bedrock-runtime.<region>.amazonaws.com` endpoints listed on the page |
| Bolt.new | `*.bolt.new` |
| Builder.io | `*.api.builder.io`, `*.cdn.builder.io`, `*.cdn.builder.codes` |
| DeepAI | `*.api.deepai.org` |
| Gamma | `*.api.gamma.app`, `*.ai.api.gamma.app` |
| ElevenLabs | `api.us.elevenlabs.io` |
| GitHub Copilot | `api.individual.githubcopilot.com` |
| GitHub Copilot Enterprise | `api.business.githubcopilot.com`, `api.enterprise.githubcopilot.com`, `api.individual.githubcopilot.com` |
| Glean | `*.glean.com` |
| Google Gemini | `*.gemini.google.com` |
| Google Gemini Code | `*.gemini.google.com`, `cloudcode-pa.googleapis.com` |
| Google Gemini Enterprise | Discovery Engine regional and global domains listed on the page |
| Google Gemini Workspaces | `appsgenaiserver-pa.clients6.google.com` |
| Grok (xAI) | `*.grok.com` |
| Lovable | `api.lovable.dev` |
| MaxAI | `*.api.maxai.me` |
| Microsoft 365 Copilot | `substrate.office.com`, `substrate.svc.cloud.microsoft`, `copilot.microsoft.com`, GitHub Copilot Enterprise domains, `augloop.office.com`, `www.copilot.com` |
| Mistral AI | `*.mistral.ai` |
| Napkin AI | `*.app.napkin.ai` |
| NotebookLM | `*.notebooklm.google.com` |
| OpenAI (ChatGPT, Codex) | `*.chatgpt.com`, `*.chat.openai.com` |
| OpenCode | `*.opencode.ai` |
| Perplexity | `*.perplexity.ai` |
| Quillbot | `quillbot.com` |
| Replit | `sp.replit.com` |
| Vertex AI | `*.cloudconsole-pa.clients6.google.com` |
| Windsurf | `server.self-serve.windsurf.com`, `server.codeium.com`; proxy mode only and custom block messages are not currently supported |

## Configuring ZIA

The page documents these public console steps:

1. Upload the AI Guard CA certificate under **Infrastructure > Internet & SaaS >
   Network Policies > Root Certificates**, selecting **Proxy Chaining**.
2. Add a proxy under **Infrastructure > Internet & SaaS > Network Policies >
   Proxies and Gateways**. The current page lists
   `forward.zseclipse.net`, port `9443`, the AI Guard root certificate,
   **Insert X-Authenticated-User** enabled, and **Enable Base64 Encoding for
   X-Authenticated-User value** disabled.
3. Add a proxy gateway with **Fail Close** selected and the AI Guard proxy as
   the primary proxy.
4. Add a Firewall Filtering Policy rule under **Policies > Access Control >
   Firewall > Firewall Filtering Policy** to block QUIC.
5. Add a wildcard FQDN destination group containing the desired provider
   domains, then add a Forwarding Control Policy rule using **Proxy Chaining**
   to the proxy gateway.

The page says users must be signed in to ZIA and authenticated by their IdP for
traffic forwarding to work.

## Configuring AI Guard

AI users defined in Authentication Service appear automatically in AI Guard
after ZIA is configured successfully. Groups are not yet automatically
populated. Administrators can define Policy Match policies for individual users
and groups; the default group is `AllUsersGroup`.

This capture records the current public Help body under the
`/secure-ai-users` namespace. The Help JSON endpoint
(`/zapi/fetch-data`) reported `data.info.status=301` for the former
`/ai-guard/configuring-zia-proxy-chain-ai-guard` URL, pointing to this
canonical route, on 2026-09-03. The same endpoint reported
`data.info.status=403` for the former `/ai-guard` root with **Help Article in
Maintenance**. These are Help-route and discoverability observations, not
product-retirement, commercial-availability, or tenant-entitlement claims.
