# GRE Deployment Scenarios

**Source:** https://help.zscaler.com/zia/gre-deployment-scenarios
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — GRE — GRE Deployment Scenarios

Zscaler recommends combining GRE tunneling, PAC files, Surrogate IP, and Zscaler Client Connector.

## 1. GRE Tunnels from the Internal Router to Public Service Edges (preferred)

- Configure **two GRE tunnels from an internal router behind the firewall**.
- Primary tunnel → Public Service Edge in one data center.
- Secondary tunnel → Public Service Edge in a different data center.
- Provides visibility into **internal IP addresses** → used for Zscaler security policies and logging.

**Setup notes:**
- GRE tunnel source IP: a **public IP address configured on the loopback interface** of the router.
- **Firewall rule** required: allow GRE traffic from the router.
- If the org has redundant routers or ISPs, configure automatic failover to the redundant ISP.

## 2. GRE Tunnels from the Border Router to Public Service Edges (fallback)

Use this when internal-router GRE is not feasible.

- Configure the border router to send internet-bound traffic to Public Service Edges.
- **Disable NAT on the firewall** to preserve internal IP address visibility to the Public Service Edges.

Note: this setup loses the internal-IP visibility unless NAT is disabled, which may conflict with other firewall requirements.

## 3. GRE Tunnels in Explicit Proxy Mode

For explicit proxy mode in **no-default-route environments**, use one of these **Global Public Service Edge IP addresses**:

```
185.46.212.88
185.46.212.89
185.46.212.90
185.46.212.91
185.46.212.92
185.46.212.93
185.46.212.97
185.46.212.98
```

See *About Global Public Service Edges* for details.
