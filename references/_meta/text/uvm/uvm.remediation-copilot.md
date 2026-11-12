# What Remediation Copilot does in a UVM ticket, what it will not do, and its limits (uvm.remediation-copilot)
Also called: remediation copilot; uvm ai assistant; save to fixes; limited-context mode

Remediation Copilot is an AI-powered assistant integrated into UVM tickets, accessed from the ticket drawer; previously saved chats appear in the ticket's Fixes tab. [uvm.remediation-copilot:what-it-is] Remediation Copilot only provides guidance and does not apply changes; users must review and test the instructions before implementing them. [uvm.remediation-copilot:guidance-only]

**Privacy and access.** The What Is Remediation Copilot page says data shared with Remediation Copilot is not transmitted to external third parties and the system strips PII where possible, but that some ticket fields might contain sensitive information so users should review content before submitting it; it also says use of AI features in the SecOps platform is optional, controlled by admin opt-in. [uvm.remediation-copilot:privacy-optin] Account admins can remove access to Remediation Copilot by turning off AI capabilities in Account Settings. [uvm.remediation-copilot:admin-disable]

**Using it.** Save to Fixes saves a summarized remediation plan to the ticket's Fixes tab under the AI tab for Fix Type, and multiple summaries can be saved to one ticket. [uvm.remediation-copilot:save-to-fixes] When a ticket includes many findings, Remediation Copilot might run in limited-context mode and not take all findings into account; the documented workaround is to split the findings of interest into a new ticket and run it there. [uvm.remediation-copilot:limited-context] [gap:uvm.remediation-copilot:limited-context-threshold] If the session times out during long-running responses, Retry proceeds. [uvm.remediation-copilot:session-timeout]

**Guidance by finding type.** For CVEs, Remediation Copilot can help identify patch or upgrade options or suggest mitigations if fixes are unavailable, highlight operational considerations such as reboots for OS-level fixes, and distinguish direct from transitive dependencies. [uvm.remediation-copilot:cve-guidance] For misconfigurations, Remediation Copilot can recommend secure settings and compensating measures when a secure setup is not immediately feasible, and relate findings to compliance standards such as SOC 2 and PCI DSS. [uvm.remediation-copilot:misconfig-guidance] For code-level issues, Remediation Copilot can share best practices for secure coding or runtime mitigations and suggest compensating controls for flaws such as SQL injection or XSS when immediate remediation is not viable. [uvm.remediation-copilot:code-guidance]

**Related.** [Unified Vulnerability Management (UVM): what it does with findings, and what can be automated](kb:uvm.overview) [How UVM tickets work: the Tickets page, manual split and merge, automatic grouping rules, status buckets and ticket workflows](kb:uvm.tickets)

[gap:uvm.remediation-copilot:chat-handling]

Not known (open gaps):
- How many findings in a ticket put Remediation Copilot into limited-context mode [gap:uvm.remediation-copilot:limited-context-threshold]: settled by lab-test or support-ticket
- Which model Remediation Copilot uses, and how chats are retained and audited [gap:uvm.remediation-copilot:chat-handling]: settled by support-ticket or source-read

Area: uvm.remediation-copilot, its subjects in references/_meta/spine/uvm/uvm.remediation-copilot.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/uvm/uvm.overview.md (Unified Vulnerability Management (UVM): what it does with findings, and what can be automated)
- links-to references/_meta/text/uvm/uvm.tickets.md (How UVM tickets work: the Tickets page, manual split and merge, automatic grouping rules, status buckets and ticket workflows)
