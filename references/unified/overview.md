---
product: unified
topic: overview
title: "Zscaler Experience Center — unified admin console for the Zero Trust Exchange"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/unified-what-zscaler-experience-center.md"
author-status: draft
---

# Zscaler Experience Center — unified admin console for the Zero Trust Exchange

## What it is

Zscaler Experience Center (sometimes referred to as the "Unified Admin Console" or the "/unified" help path) is a unified, AI-powered administrative console that consolidates management, configuration, and monitoring of the Zscaler Zero Trust Exchange (ZTE) platform into a single interface. It eliminates the need for separate per-product admin dashboards (Tier A — vendor/zscaler-help/unified-what-zscaler-experience-center.md).

The help portal path `help.zscaler.com/unified` maps to the "Getting Started with Zscaler" section, which covers initial onboarding into Experience Center and the unified ZTE platform.

## What it consolidates

Experience Center provides a single admin interface for:
- Internet & SaaS (ZIA)
- Private Access (ZPA)
- Zscaler Digital Experience (ZDX)
- Zscaler Client Connector (ZCC)
- And other Zscaler services

The goal is a single pane of glass for the entire Zscaler platform, replacing the historical model where ZIA, ZPA, ZDX each had separate admin portals.

## Key capabilities

### Unified Identity Layer

Single source of truth for users, groups, and roles. Role-based access control (RBAC) configured once and applied consistently across all Zscaler services. Admin roles configured here govern access across ZIA, ZPA, ZDX, and other products in the platform.

### Common Policy Framework

Global policies that govern access to any application — public cloud, private data center, or open internet — from a single policy authoring point. Policies created here feed through to ZIA (for internet/SaaS traffic) and ZPA (for private app access).

### Generative AI — Zscaler Copilot

Experience Center integrates "Zscaler Copilot", a generative AI assistant. Capabilities:
- Natural language troubleshooting queries to identify root cause of connectivity or security issues
- Proactive recommendations for policy optimizations or threat remediation
- Persona-focused analytics

### Unified Data and Analytics

Aggregates logs and telemetry from ZIA, ZPA, and ZDX into a unified analytics engine. Enables cross-platform correlation of performance and security events — for example, correlating a ZIA threat event with ZPA access activity from the same user.

### Guided Onboarding Workflows

Interactive onboarding walkthroughs following industry best practices. Covers: user onboarding (from IdP import, CSV, or manual), traffic forwarding configuration, URL filtering policies, SSL inspection, cyber threat protection policies, data protection policies, user privacy, and policy activation.

### Persona-Focused Insights

Different data views for different roles:
- Executive summary views (high-level KPIs and risk posture)
- Practitioner deep-dive views (technical data, drill-down)

### Executive Insights App

A sub-module within Experience Center designed for executive audience. Separate navigation entry. Includes its own error/troubleshooting documentation.

## What "Unified Admin Console" means in context

In Zscaler documentation and support discussions, "unified admin console" or "unified portal" may refer to Experience Center generically. The help portal path `/unified` predates the Experience Center branding — it was previously the "Getting Started" and "Unified" guide.

Older Zscaler deployments used separate portals per product. Experience Center is the new unified surface. Tenants may still access legacy ZIA/ZPA portals during transition; the help portal includes "Legacy UI" entries for ZIA, ZPA, ZDX, ZCC, ZTB, Risk360, etc.

## Cloud name context

The "Understanding Zscaler Cloud Names" article lives under /unified. Cloud names matter because each tenant is assigned to a specific ZIA/ZPA cloud (e.g., zscalerone.net, zscalertwo.net, etc.), and Experience Center operates across these clouds. Admins need cloud name awareness for DNS, SSL, and API endpoint configuration.

## API surface

Experience Center itself is an admin console, not an API product. The underlying products (ZIA, ZPA, ZDX) have their own published REST APIs. Experience Center does not expose a separate API — it is the UI over those APIs. For programmatic management, use ZIA API, ZPA API, or ZDX API directly.

## Key operational notes

- Experience Center is designed to work with ZIdentity (Zscaler's IdP/SSO product) for the unified identity layer; the specific authentication requirement for Experience Center itself is not explicitly stated in vendor sources (Tier A — vendor/zscaler-help/unified-what-zscaler-experience-center.md).
- Tenants upgrading from legacy separate portals to Experience Center go through a documented migration path ("Upgrading to Zscaler Experience Center").
- The /unified help path covers the onboarding getting-started journey, not just the console UI itself.

## Legacy vs. current portal terminology

The Zscaler help portal maintains "Legacy UI" entries for the following, which are the old per-product portals that predate Experience Center:

| Legacy entry | Notes |
|---|---|
| Legacy UI: Internet & SaaS (ZIA) | Old standalone ZIA admin console |
| Legacy UI: Private Access (ZPA) | Old standalone ZPA admin console |
| Legacy UI: Digital Experience Monitoring (ZDX) | Old standalone ZDX admin console |
| Legacy UI: Zscaler Client Connector | Old ZCC portal |
| Legacy UI: Cloud & Branch Connector | Old Cloud Connector admin console |
| Legacy UI: Zscaler Cellular | Old Cellular admin console |
| Legacy UI: Zero Trust Branch | Old ZTB console |
| Legacy UI: Zero Trust Browser | Old isolation admin UI |
| Legacy UI: Risk360 Advanced | Earlier generation of Risk360 |
| Legacy UI: ZIdentity | Older ZIdentity UI |
| Legacy UI: Workflow Automation | Older Workflow Automation UI |
| Legacy UI: DSPM | Older DSPM UI |

When a support conversation references the "legacy" portal, it means these older per-product admin UIs. The Experience Center is the current unified surface. Long-term contracts or older deployments may still have access to legacy portals; Zscaler is progressively migrating tenants.

## ZIA/ZPA cloud vs. Experience Center portal

Experience Center is the management UI — it is not itself a data plane or proxy. The ZIA cloud and ZPA cloud that process user traffic are unchanged by Experience Center. Experience Center connects to the tenant's assigned ZIA cloud and ZPA cloud to manage configuration and display telemetry. Cloud names (e.g., `admin.zscalerone.net`, `admin.zscalertwo.net`) are important for:
- Direct API calls to ZIA or ZPA REST endpoints
- ZIA NSS configuration
- SSL certificate trust configuration

Operators building automation against ZIA or ZPA should use the cloud-specific API base URL, not an Experience Center URL.

## Common questions

- **"What is the Experience Center?"** → Unified admin console for managing ZIA, ZPA, ZDX, ZCC, and other Zscaler products from a single interface.
- **"Is there an Experience Center API?"** → No. Use ZIA API, ZPA API, or ZDX API for programmatic management.
- **"What's the difference between the old ZIA portal and Experience Center?"** → Experience Center is the new unified console. Old ZIA portal is still accessible as "Legacy UI: Internet & SaaS" but is being deprecated over time.
- **"Does Experience Center change my ZIA/ZPA policies?"** → No. Policies are the same; Experience Center is a different UI to manage the same underlying configuration.
- **"What is Zscaler Copilot?"** → The generative AI assistant embedded in Experience Center for natural language troubleshooting and recommendations.

## Cross-links

- ZIA (the primary internet security product managed via Experience Center): [`../zia/index.md`](../zia/index.md)
- ZPA (private access product): [`../zpa/index.md`](../zpa/index.md)
- ZIdentity (authentication for Experience Center): [`../zidentity/index.md`](../zidentity/index.md)
- Portfolio map: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
