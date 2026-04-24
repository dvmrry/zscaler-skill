# Best Practices for Deploying GRE Tunnels

**Source:** https://help.zscaler.com/zia/best-practices-deploying-gre-tunnels
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — GRE — Best Practices for Deploying GRE Tunnels

## Deployment Principles

- Configure **two GRE tunnels from an internal router behind the firewall** to ZIA Public Service Edges.
- Build **primary and backup GRE tunnels from every internet egress location** and — if applicable — from each ISP.

**Provisioning options:**
- Submit a Zscaler Support ticket.
- Self-provision via the Zscaler Admin Console.

**Picker constraint:** when provisioning, regional **surcharge and premium data centers are excluded** from the selection list due to additional costs or specialized usage restrictions.

## MTU / MSS Calculation (critical — avoid fragmentation)

GRE adds a **4-byte header** to each packet. Mismatched MTU causes fragmentation and performance degradation.

Example calculation for a 1,500-byte WAN interface:

```
WAN Interface MTU = 1,500
WAN Interface MSS = MTU(1,500) − IP(20) − TCP(20) = 1,460
GRE header overhead = 4 bytes
GRE MTU            = 1,500 − IP(20) − GRE(4)     = 1,476
GRE MSS            = GRE MTU(1,476) − IP(20) − TCP(20) = 1,436
```

Use these values on the GRE tunnel interface.

## Bandwidth Recap

- 1 Gbps per GRE tunnel max (internal IPs **not NATed**).
- 250 Mbps per tunnel if internal IPs **NATed**.
- For more throughput: multiple tunnels with **different public source IPs**.
- When multi-tunneling, **maintain client persistence** (Load Balancer, ECMP, etc.) — a server checking persistence will refuse a connection to a different egress IP.

## Monitoring GRE Tunnels

GRE interfaces have **no built-in mechanism for detecting tunnel failure**. You must:

1. **Configure GRE keepalives** on the physical or logical interface — detects tunnel-level failure.
2. **Deploy Layer 7 health checks** where supported (Cisco IPSLA, Juniper RPM). If not, Layer 4 (ICMP, PAC-based failover).
3. Keepalives monitor the **interface**; L7 health checks monitor the **service** beyond the interface. Both are needed.

### L7 Health Check Target

Health check URL (Cisco IPSLA / Juniper RPM / equivalents):

```
http://gateway.<Zscaler cloud>.net/vpntest
```

Replace `<Zscaler cloud>` with your cloud name.

**Warning:** **do NOT use commonly visited websites like `www.google.com`** as health-check targets. This triggers Google to denylist Zscaler IPs and enforce CAPTCHA for all users from those IPs.

### Sample IPSLA Config (Cisco)

```
track 1 ip sla 1
 delay down 120 up 180
ip sla 1
 http raw http://<Primary Global Public Service Edge IP>
 timeout 5000
 threshold 500
 http-raw-request
  GET http://gateway.<Zscaler Cloud>.net/vpntest HTTP/1.0\r\n
  User-Agent: Cisco IP SLA\r\n
  end\r\n
  \r\n
  exit
ip sla schedule 1 life forever start-time now

track 2 ip sla 2
 delay down 120 up 180
ip sla 2
 http raw http://<Secondary Global Public Service Edge IP>
 timeout 5000
 threshold 500
 http-raw-request
  GET http://gateway.<Zscaler Cloud>.net/vpntest HTTP/1.0\r\n
  User-Agent: Cisco IP SLA\r\n
  end\r\n
  \r\n
  exit
ip sla schedule 2 life forever start-time now
```

- `delay down 120 up 180` — requires 2 consecutive failures (2×60s probes) to mark down; 3 consecutive successes to mark up. Prevents failover flapping.
- `threshold 500` — RTT threshold in ms. Configure based on client↔DC latency.

## Tunnel Failover (Cisco example)

Tie tunnel monitoring to tunnel failover: when monitoring says down, failover to backup; when monitoring recovers, switch back.

```
route-map ZS-NET-PORT permit 10
 match ip address ZS-NET-PORT
 set ip next-hop verify-availability 172.18.56.162 1 track 1
 set ip next-hop verify-availability 172.18.56.166 2 track 2
```

## Failover Model Comparison

| Parameter | Fast Failover | Conservative Failover |
|---|---|---|
| GRE Keepalive | `keepalive 10 3` (30s failure) | `keepalive 30 4` (120s failure) |
| IP SLA Type | ICMP Echo | HTTP Raw |
| IP SLA Frequency | 10 s | 60 s |
| IP SLA Timeout | 2,000 ms | 5,000 ms |
| Track Delay Down | 30 s | 120 s |
| Track Delay Up | 45 s | 180 s |
| Best-Case Failover | 30–32 s | 120–125 s |
| Worst-Case Failover | 40–42 s | 180–185 s |
| False Positive Risk | Higher | Lower |
| CPU/Resource Usage | Higher | Lower |
| Application Layer Test | No (L3 only) | Yes (HTTP service) |

Choose based on: how much failover latency your apps tolerate vs your false-positive tolerance / router CPU budget.
