# What Is AI Guard for Users?

**Source:** https://help.zscaler.com/secure-ai-users/what-ai-guard
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540836, revision 3227844

---

The rise of generative large language models (LLMs) has accelerated the pace of application innovation and increased productivity, with organizations customizing LLMs to their specific tasks. However, the proliferation of LLMs in apps and agents is creating new security challenges, including prompt injection, toxicity, and code leakage. This increasing adoption of LLMs necessitates the implementation of AI security in applications, in addition to cybersecurity and data security.
AI Guard is a service that provides run-time protection for your AI applications by enforcing enterprise policies that prevent prompt injections, block jailbreak attempts, and stop personal information leakage with guardrails around LLM interactions.
It secures these interactions by filtering harmful or inappropriate content from the prompts that users enter and the responses they receive in the AI application. AI Guard enforces intent-based detectors on both prompts and responses.
See image.
# Key Capabilities of AI Guard
The following functionality and guardrails are some of the options available to you with AI Guard:
- Visibility & Access Control: You can monitor which applications are accessing private AI systems, with granular controls over access permissions. Visibility tools ensure complete oversight of private AI interactions across the enterprise.
- Prompt Injection & Jailbreak Protection: AI models can be manipulated with adversarial prompts to bypass restrictions or produce unintended outputs. The AI Guard guardrails detect and neutralize such attacks, ensuring that AI responses stay within defined safety parameters.
- Toxicity: AI-generated content can potentially be emotionally harmful for workers. AI Guard's guardrails apply real-time monitoring and filtering to prevent toxic language.
- Sensitive Data Protection: AI models can inadvertently expose or process confidential, regulated, or proprietary information. AI Guard enables inline inspection and classification to detect and block sensitive data before it is sent to AI APIs.
- Off-Topic Response Detection: AI Guard detects and prevents off-topic responses, ensuring that AI stays focused on its intended use cases.
- Malicious URL Detection & Blocking: AI-generated responses can sometimes include harmful or phishing links. AI Guard's solution actively scans links and blocks malicious URLs to prevent security threats and safeguard users from cyber risks.
- Language Detection & Enforcement: Organizations can enforce AI interactions in specific approved languages, preventing unauthorized language use that can lead to miscommunication or security vulnerabilities.
- Code Injection & Execution Detection: AI Guard detects and prevents unauthorized code snippets embedded in AI interactions, protecting against potential security risks from malicious scripts or unauthorized automation attempts.
- Gibberish & Low-Quality Prompt/Response Filtering: AI models can sometimes produce nonsensical or low-value responses. Our system detects gibberish, meaningless text, and irrelevant output, ensuring that AI responses remain coherent and valuable.
- Refusal Detection & Intervention: When AI refuses to respond to valid queries due to overly restrictive filters or misunderstanding, our system flags and intervenes to alert the security team because it might be a denial-of-service attack.
- Finance Advice: AI Guard can block actionable financial guidance (investing, trading, tax, product choices); allows neutral finance facts, history, and definitions.
- Prompt Tagging-based Access Control: AI Guard has prompt tagging model that automatically classifies prompts into different categories, enabling organizations to enforce AI governance, security, and compliance while optimizing AI interactions.
- Competitor Discussion Detection: You can identify and block prompts that reference competitors, rival products, pricing comparisons, or market strategies.
- URL Reachability Detection: AI-provided links can sometimes be outdated or unreachable. This guardrail verifies whether URLs in prompts are accessible, safe, or broken to prevent hallucinations.
- Legal Advice: Block prompts seeking legal advice, interpretation, or compliance guidance. This allows for neutral legal facts, definitions, and non-legal work inquiries.
