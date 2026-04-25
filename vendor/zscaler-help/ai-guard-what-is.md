# What Is AI Guard? | Zscaler

**Source:** https://help.zscaler.com/ai-guard/what-ai-guard
**Captured:** 2026-04-24 via Playwright MCP.

---

The rise of generative large language models (LLMs) has accelerated the pace of application innovation and increased productivity, with organizations customizing LLMs to their specific tasks. However, the proliferation of LLMs in apps and agents is creating new security challenges, including prompt injection, toxicity, and code leakage. This increasing adoption of LLMs necessitates the implementation of AI security in applications, in addition to cybersecurity and data security.

AI Guard is a service that provides run-time protection for your AI applications by enforcing enterprise policies that prevent prompt injections, block jailbreak attempts, and stop personal information leakage with guardrails around LLM interactions.

It secures these interactions by filtering harmful or inappropriate content from the prompts that users enter and the responses they receive in the AI application. AI Guard enforces intent-based detectors on both prompts and responses. These intent-based detectors leverage AI models and GPUs for inference.

You can deploy AI Guard in SaaS mode (including Detection as a Service (DaaS)) or hybrid OnPrem mode. In Proxy mode, AI Guard is placed between the AI application and the LLM provider, whereas in DaaS mode, AI Guard is sitting as a side-car to your application. In DaaS mode, the AI application must make an API call to AI Guard for every prompt that you make and for every response you receive in the AI application. When using DaaS mode, AI Guard is not inline, and it does not require manually adding the LLM provider.

## Key Capabilities of AI Guard

**Visibility & Access Control**: Monitor which applications are accessing private AI systems, with granular controls over access permissions. Visibility tools ensure complete oversight of private AI interactions across the enterprise.

**Prompt Injection & Jailbreak Protection**: AI models can be manipulated with adversarial prompts to bypass restrictions or produce unintended outputs. The AI Guard guardrails detect and neutralize such attacks, ensuring that AI responses stay within defined safety parameters.

**Toxicity**: AI Guard's guardrails apply real-time monitoring and filtering to prevent toxic language.

**Sensitive Data Protection**: AI Guard enables inline inspection and classification to detect and block sensitive data before it is sent to AI APIs.

**Off-Topic Response Detection**: AI Guard detects and prevents off-topic responses, ensuring that AI stays focused on its intended use cases.

**Malicious URL Detection & Blocking**: AI Guard's solution actively scans links and blocks malicious URLs to prevent security threats.

**Language Detection & Enforcement**: Organizations can enforce AI interactions in specific approved languages, preventing unauthorized language use.

**Code Injection & Execution Detection**: AI Guard detects and prevents unauthorized code snippets embedded in AI interactions.

**Gibberish & Low-Quality Prompt/Response Filtering**: Detects gibberish, meaningless text, and irrelevant output, ensuring that AI responses remain coherent and valuable.

**Refusal Detection & Intervention**: When AI refuses to respond to valid queries due to overly restrictive filters or misunderstanding, the system flags and intervenes to alert the security team because it might be a denial-of-service attack.

**Finance Advice**: AI Guard can block actionable financial guidance (investing, trading, tax, product choices); allows neutral finance facts, history, and definitions.

**Prompt Tagging-based Access Control**: AI Guard has a prompt tagging model that automatically classifies prompts into different categories, enabling organizations to enforce AI governance, security, and compliance.

**Competitor Discussion Detection**: Identify and block prompts that reference competitors, rival products, pricing comparisons, or market strategies.

**URL Reachability Detection**: Verifies whether URLs in prompts are accessible, safe, or broken to prevent hallucinations.

**Legal Advice**: Block prompts seeking legal advice, interpretation, or compliance guidance. Allows neutral legal facts, definitions, and non-legal work inquiries.

## Deployment Modes
- **SaaS / Proxy mode**: AI Guard placed inline between the AI application and the LLM provider
- **DaaS (Detection as a Service)**: AI Guard as a side-car; application makes API call to AI Guard per prompt/response
- **OnPrem hybrid mode**: Available for organizations requiring on-premises deployment

## Related Articles
- Step-by-Step Configuration Guide for AI Guard
- Integrating ZIA with AI Guard
- Viewing AI Guard System Users
- AI Guard API Request Construction User Guide
- Test LLM Providers in AI Guard Proxy Mode
- Test LLM Providers in AI Guard DAS/API Mode
