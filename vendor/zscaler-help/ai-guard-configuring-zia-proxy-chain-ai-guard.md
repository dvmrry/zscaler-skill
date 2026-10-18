# Integrating ZIA with AI Guard

**Source:** https://help.zscaler.com/secure-ai-users/integrating-zia-ai-guard
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540870, revision 3244600

---

Thanks to the integration of AI Guard with Internet & SaaS (ZIA), you can configure ZIA to invoke AI Guard for processing user's AI traffic.
# Prerequisites
Before you can integrate ZIA with AI Guard, ensure that you:
- Have an AI Guard subscription.
- Have linked ZIA and AI Guard. Contact Zscaler Support to ensure they are linked.
  - AI Guard can only be mapped to a single tenant and a single domain. For example, if acme.com exists in both the QA and Production tenant, AI Guard can map to either the QA or Production tenant, but not both.
- Have Experience Center enabled for your tenant. Instructions for ZIA-related configuration assume that it will be performed via Experience Center.
- Have the CA certificate of the AI Guard endpoint. Contact Zscaler Support if you need help getting it.
- Are using a supported generative AI application. The following table lists the supported AI applications (last updated: Sept. 02, 2026); use the page controls at the bottom-right of the table to view all providers:
| Application | Client Types | Domains Required |
|---|---|---|
| Anthropic (Claude) | Web BrowsersClaude DesktopClaude CLIClaude Code for VS CodeClaude MS Add-in (Excel/PPT) | *.claude.ai*.api.anthropic.com |
| Bedrock-Anthropic | Web BrowsersCLI | Enter the domain for your region:bedrock-runtime.ap-northeast-1.amazonaws.com bedrock-runtime.ap-northeast-2.amazonaws.com bedrock-runtime.ap-south-1.amazonaws.com bedrock-runtime.ap-southeast-1.amazonaws.com bedrock-runtime.ap-southeast-2.amazonaws.com bedrock-runtime.ca-central-1.amazonaws.com bedrock-runtime.eu-central-1.amazonaws.com bedrock-runtime.eu-west-1.amazonaws.com bedrock-runtime.eu-west-2.amazonaws.com bedrock-runtime.eu-west-3.amazonaws.com bedrock-runtime.sa-east-1.amazonaws.com bedrock-runtime.us-east-1.amazonaws.com bedrock-runtime.us-east-2.amazonaws.com bedrock-runtime.us-gov-east-1.amazonaws.com bedrock-runtime.us-west-2.amazonaws.com bedrock-runtime.ap-northeast-3.amazonaws.com |
| Bolt.new | Web Browsers | *.bolt.new |
| Builder.io | Web Browsers | *.api.builder.io*.cdn.builder.io*.cdn.builder.codes |
| DeepAI | Web Browsers | *.api.deepai.org |
| Gamma | Web Browsers | *.api.gamma.app*.ai.api.gamma.app |
| ElevenLabs | Web Browsers: Text-to-speech supported | api.us.elevenlabs.io |
| GitHub Copilot | Web Browsers | api.individual.githubcopilot.com |
| GitHub Copilot Enterprise | Web BrowsersGitHub in Visual Studio (VS) Code | api.business.githubcopilot.comapi.enterprise.githubcopilot.comapi.individual.githubcopilot.com |
| Glean | Web Browser Chat | *.glean.com |
| Google Gemini | Web Browsers | *.gemini.google.com |
| Google Gemini Code | Web Browsers | *.gemini.google.comcloudcode-pa.googleapis.com |
| Google Gemini Enterprise | Web Browsers | *.biz-discoveryengine.googleapis.com*.content-us-discoveryengine.googleapis.com *.discoveryengine.clients6.google.com*.us-discoveryengine.clients6.google.com *.eu-discoveryengine.clients6.google.com *.global-discoveryengine.clients6.google.com *.us-discoveryengine.googleapis.com *.eu-discoveryengine.googleapis.com |
| Google Gemini Workspaces | Google Suite (Docs, Slides, Sheets): "Ask Gemini" and "Generate document" are supported."Help me write," "Refine," and "Refine the selected text" functionality is not supported. | appsgenaiserver-pa.clients6.google.com |
| Grok (xAI) | Web Browsers | *.grok.com |
| Lovable | Web Browsers | api.lovable.dev |
| MaxAI | Web Browsers | *.api.maxai.me |
| Microsoft 365 Copilot | M365 Web Experience (Web Browser)M365 Desktop App (Windows and Mac)Copilot.com (Web Browser)Copilot in Word (Desktop App and Web Browser)Copilot in Excel (Web Browser)Copilot in Outlook (Web Browser) | substrate.office.comsubstrate.svc.cloud.microsoftcopilot.microsoft.comapi.business.githubcopilot.comapi.enterprise.githubcopilot.comapi.individual.githubcopilot.comaugloop.office.comwww.copilot.com.cloud.microsoft |
| Mistral AI | Mistral Vibe (formerly Le Chat) backend | *.mistral.ai |
| Napkin AI | Web Browsers | *.app.napkin.ai |
| NotebookLM | Web Browsers | *.notebooklm.google.com |
| OpenAI (ChatGPT, Codex) | Web BrowsersDesktop App (Windows and Mac) | *.chatgpt.com*.chat.openai.com |
| OpenCode | AppCLI | *.opencode.ai |
| Perplexity | Web BrowsersPerplexity Desktop AppComet Browser | *.perplexity.ai |
| Quillbot | Web Browsers | quillbot.com |
| Replit | Web Browsers | sp.replit.com |
| Vertex AI | Web Browsers | *.cloudconsole-pa.clients6.google.com |
| Windsurf | Desktop App (Proxy Mode Only).Custom Block Messages are not currently supported with this provider. | server.self-serve.windsurf.comserver.codeium.com |
# Configuring ZIA
- Uploading your AI Guard CA certificate to ZIA
- To upload your AI Guard CA certificate to ZIA:
  - In the Zscaler Admin Console, go to **Infrastructure** > **Internet & SaaS** > **Network Policies** > **Root Certificates**.
  - Click **Add Root Certificates**. The **Add Root Certificate** window appears.
  - See image.
  - In the **Add Root Certificate** window:
    - **Name**: Enter a name for your certificate.
    - **Type**: From the drop-down menu, select **Proxy Chaining**.
    - **File**: Browse and select the AI Guard CA certificate (.pem file) from your system.
  - Click **Save**.
- Configuring the ZIA Proxy
- To configure your ZIA proxy:
  - In the Zscaler Admin Console, go to **Infrastructure** > **Internet & SaaS** > **Network Policies** > **Proxies and Gateways**.
  - In the **Proxies** tab, click **Add Proxy**. The **Add Proxy** window appears.
  - See image.
  - In the **Add Proxy** window:
    - **Proxy Name**: Enter a user-friendly name for the third-party proxy that you are defining.
    - **IP Address/FQDN**: forward.prod.zsaiguard.net.
    - **Port**: 9443.
    - **Proxy's Root Certificate**: Select the root certificate you previously created.
    - **Insert X-Authenticated-User**: Enable this setting.
    - **Enable Base64 Encoding for X-Authenticated-User value**: Disable this setting.
    - **Description (Optional)**: Enter additional notes or information. The description cannot exceed 256 characters.
  - Click **Save**.
  - In the **Proxy Gateways** tab, click **Add Gateway for Proxies**. The **Add Gateway for Proxies** window appears.
  - See image.
  - In the **Add Gateway and Proxies** window:
    - **Name**: Enter a name for your proxy gateway.
    - **Fail Close**: Leave selected.
    - **Primary Proxy**: Select the proxy you previously created.
    - **Secondary Proxy**: Leave blank.
  - Click **Save**.
- Creating a rule for ZIA to drop QUIC traffic
- To create a rule for ZIA to drop QUIC traffic:
  - In the Zscaler Admin Console, go to **Policies** > **Access Control** > **Firewall** > **Firewall Filtering Policy**.
  - See image.
  - On the **Firewall Filtering Policy** page, click **Add Rule**. The **Add Rule** window appears.
  - In the **Add Rule** window:
    - **Criteria**: Select **Network Services** from the drop-down menu.
      - **Network Services**: Select **QUIC** from the dropdown menu.
    - **Network Services**: In the **Services** tab, click the drop-down menu and select **QUIC**.
    - **Network Traffic**: From the drop-down menu, select **Block/ICMP**.
    - **Rule Name**: Enter a name for the rule.
    - See image.
  - If you have ZIA Tunnel 1.0, disable the QUIC protocol from your browser. Refer to your specific browser's instructions to disable QUIC.
  - Click **Save**.
- Creating a wildcard destination group and forwarding rule
- To create a wildcard destination group and forwarding rule:
  - In the Zscaler Admin Console, go to **Policies** > **Access Control** > **Firewall** > **IP &FQDN Groups**.
  - See image.
  - On the **Destination IPv4 Groups** tab, click **Add Destination IPv4 Group**. The **Add Destination IPv4 Group** window opens.
  - In the **Add Destination IPv4 Group** window:
    - **Name**: Enter a name such as AI Guard.
    - **Type**: Select **Wildcard FQDN**.
    - **Wildcard FQDN**: Add in the required domains for your desired AI providers and click **Add Items**. The AI domains are found in the Prerequisites section.
    - **Description (Optional)**: Enter additional information not exceeding 10240 characters.
  - See image.
  - Click **Save**.
  - In the Zscaler Admin Console, go to **Infrastructure** > **Internet & SaaS** > **Network Policies** > **Forwarding Control Policy**.
  - See image.
  - On the **Forwarding Control** page, click **Add Rule**. The **Add Forwarding Rule** window appears.
  - In the **Add Forwarding Rule** window:
    - **Criteria**: Select **Destination IPv4 Groups**.
      - **Destination IPv4 Groups**: Select the wildcard FQDN destination group you previously created.
    - **Rule Name**: Enter a name for the forwarding rule.
    - **Forwarding Method**: Select **Proxy Chaining**.
    - **Forward to Proxy Gateway**: Select the proxy gateway you previously created.
    - See image.
- For traffic forwarding to work, users must have signed in to ZIA through mechanisms such as Zscaler Client Connector, and they must be authenticated by your IdP. You can check the logs in ZIA to ensure that traffic forwarding is enabled. To learn more, see About Insights Logs.
# Configuring AI Guard
AI users defined in Authentication Service show up automatically in AI Guard after you have configured ZIA successfully. Groups are not yet automatically populated. You can define policies in **Policy Match** for both individual users and groups you've created. The default group is **AllUsersGroup**.
See image.
