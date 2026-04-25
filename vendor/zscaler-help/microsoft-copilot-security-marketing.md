# Zscaler Copilot Security for Microsoft | Zscaler

**Source:** https://www.zscaler.com/products-and-solutions/microsoft-copilot-security
**Captured:** 2026-04-25 via WebFetch.

---

## Title & Value Proposition

**Control Data Security and Oversharing in Microsoft Copilot** — Enforce safe guardrails for Copilot data access while maintaining your security posture.

## Key Capabilities

Four core security functions:

1. **Prompt Visibility & DLP** — Full visibility into Copilot user prompts; block sensitive data inputs with DLP
2. **Permission Remediation** — Prevent Copilot oversharing by removing excessive sharing permissions
3. **Data Classification** — Add missing Purview sensitivity labels to restrict Copilot access
4. **Configuration Hardening** — Identify and close dangerous misconfigurations in Microsoft 365 and Copilot settings

## What It Protects

- **OneDrive** — fixes improperly permissioned data that Copilot can overconsume and share
- **Purview labels** — addresses classification gaps for sensitive information
- **Microsoft 365 configs** — closes exposure from configuration drift
- **Prompt-level access** — prevents underprivileged users from accessing sensitive data through Copilot interactions

## Integration Approach

Uses both **API and inline** security paths to enable robust control over Copilot deployments — proper access constraints around sensitive data across the Microsoft tenant.

## Broader Platform Position

Part of Zscaler's Data Security pillar within the unified Zero Trust platform. Complements existing DLP, CASB, and DSPM solutions for comprehensive data protection. Specifically addresses the SaaS-AI vector where the same data Copilot indexes flows back to users via prompts — without DLP / classification / permission discipline, oversharing risk compounds.

## Related Resource

Vendored deployment guide: `Zscaler-Microsoft-Copilot-Deployment-Guide-FINAL.pdf` (in `vendor/zscaler-help/downloads/`).
