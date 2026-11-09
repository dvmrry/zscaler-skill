# NSS servers for Cloud & Branch Connector: certificate, buffering and sizing (cloud-connector.nss-va.servers)
Also called: nss server cloud connector; nss va certificate; nss client certificate; nss buffer; nss va sizing; nss va high availability; nss server state
Former IDs: cloud-connector-20

An NSS server is the Admin Console record of one NSS virtual machine. It decides how that VM authenticates, what it buffers and how it is sized.

**Registration.** When an NSS server is added, its NSS Type is set to NSS for Firewall, Cloud and Branch Connector by default. [cloud-connector.nss-va.servers:server-type-default] An NSS server has a Status the admin enables or disables and a non-configurable State that shows the server's health. [cloud-connector.nss-va.servers:status-and-state] What a server of another type would stream is open [gap:cloud-connector.nss-va.servers:server-type-mismatch].

**Certificate.** NSS servers let an admin issue a client certificate and a private key to install on the NSS VM, and let the NSS authenticate to the Zscaler service. [cloud-connector.nss-va.servers:client-certificate] In the Edit NSS Server window, under SSL Certificate, an admin can download the server's SSL certificate or generate a new certificate for the server; Help says the certificate can then be uploaded to the desired platform. [cloud-connector.nss-va.servers:certificate-regenerate] How long a certificate is valid and what happens when it lapses is open [gap:cloud-connector.nss-va.servers:certificate-lifetime].

**Buffering.** The NSS buffers logs for at least one hour: when the SIEM goes offline or the NSS-to-SIEM connection is disrupted, it buffers and sends the logs after the connection is re-established. The buffer memory is part of the VM spec computation, and the buffer grows in proportion to the RAM allocated to the NSS. [cloud-connector.nss-va.servers:buffer-one-hour] What the Nanolog does when the VM itself is unreachable is the NSS model shared with ZIA, in [What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery](kb:shared.nss.reliability).

**Sizing.** Before an NSS server is set up, the admin enters information about traffic and users so the Zscaler service can compute the appropriate resources for the NSS VM. [cloud-connector.nss-va.servers:sizing-computed] Sizing figures for given connector fleets are open [gap:cloud-connector.nss-va.servers:sizing-numbers].

**Redundancy and placement.** Whether two NSS VMs can stream the same logs at once is open [gap:cloud-connector.nss-va.servers:active-active]. Network egress and placement requirements for the VM are open [gap:cloud-connector.nss-va.servers:egress-and-placement], and so is the clock-sync requirement [gap:cloud-connector.nss-va.servers:clock-sync].

What to check:
1. The NSS server's State in the Admin Console, which shows its health, before looking at the SIEM.
2. Whether the certificate installed on the VM is the one currently issued for the server, after anyone generated a new certificate.
3. How long the SIEM was unreachable, against the at-least-one-hour buffer.

Not known (open gaps):
- NSS client certificate validity and what expiry does [gap:cloud-connector.nss-va.servers:certificate-lifetime]: settled by source-read or lab-test. Blocks: planning certificate renewal for an NSS VM before the stream stops
- NSS VM sizing for a given connector fleet [gap:cloud-connector.nss-va.servers:sizing-numbers]: settled by source-read or tenant-data. Blocks: estimating NSS VM CPU and memory before deployment
- Whether two NSS VMs can stream the same Cloud Connector logs at once [gap:cloud-connector.nss-va.servers:active-active]: settled by lab-test or support-ticket. Blocks: designing NSS VM redundancy for Cloud Connector logs
- Network egress and placement requirements for the NSS VM [gap:cloud-connector.nss-va.servers:egress-and-placement]: settled by source-read. Blocks: firewall and routing design for an NSS VM in a locked-down cloud account
- Whether NSS VM clock drift breaks its connection to the Zscaler cloud [gap:cloud-connector.nss-va.servers:clock-sync]: settled by source-read or lab-test. Blocks: diagnosing an NSS VM that cannot connect although the network path is open
- What an NSS server of the wrong type does with Cloud Connector logs [gap:cloud-connector.nss-va.servers:server-type-mismatch]: settled by source-read or lab-test. Blocks: diagnosing an NSS server that is up but streams no connector logs

Area: cloud-connector.nss-va, its subjects in references/_meta/spine/cloud-connector/cloud-connector.nss-va.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.feeds.md (NSS feeds for Cloud & Branch Connector: limits, output and SIEM destination), from cloud-connector.nss-va: Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.log-control-path.md (Log and Control Forwarding and NSS: the two legs that carry connector logs), from cloud-connector.nss-va: A connector log reaches a SIEM over two legs: the connector forwards it to the Zscaler cloud under the Log and Control Forwarding policy, and an NSS VM streams it from the Nanolog to the SIEM. A Log and Control Forwarding rule configures only the first leg; the NSS VM authenticates with its own certificate and is configured by NSS servers and feeds. [cloud-connector.nss-va.log-control-path:two-legs]
- links-to references/_meta/text/shared/shared.nss.reliability.md (What NSS delivers across an outage: VM buffer, Duplicate Logs and one-hour recovery)
