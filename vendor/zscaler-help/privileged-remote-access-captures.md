# Privileged Remote Access — consolidated capture notes

**Captured:** 2026-04-24 via Playwright MCP; Consoles Policy section recaptured 2026-07-20. Content below is a structured summary rather than verbatim innerText per page — several original article pages returned Japanese-fallback translations on extraction (help.zscaler.com served `/ja/` variants for some URLs), so the notes preserve the semantic content under English URL attribution. For verbatim quoting, re-capture against the live pages.

## Sources

- [Understanding Privileged Remote Access](https://help.zscaler.com/zpa/understanding-privileged-remote-access)
- [About Privileged Credential Pools](https://help.zscaler.com/zpa/about-privileged-credential-pools)
- [Configuring Privileged Credentials](https://help.zscaler.com/zpa/configuring-privileged-credentials)
- [Accessing Privileged Approval Requests](https://help.zscaler.com/zpa/accessing-privileged-requests)
- [Requesting Approvals in the PRA Portal](https://help.zscaler.com/zpa/requesting-approvals-pra-portal)
- [Accessing Privileged Sessions (Recording & Playback)](https://help.zscaler.com/zpa/accessing-privileged-sessions)
- [About Privileged Remote Access Applications](https://help.zscaler.com/zpa/about-privileged-remote-access-applications)
- [Privileged Remote Access Management](https://help.zscaler.com/zpa/privileged-remote-access-management)
- [Configuring Consoles Policies](https://help.zscaler.com/zpa/configuring-consoles-policies)

---

## Understanding Privileged Remote Access

PRA is a **clientless remote-desktop gateway** that lets end users securely connect to servers, jump hosts, bastion hosts, or desktops using **RDP, SSH, or VNC** directly from modern web browsers — without installing Zscaler Client Connector or browser plugins.

### Components

- **Privileged Portals** — the end-user-facing entry point for requesting access and launching sessions.
- **Privileged Consoles** — the target systems that PRA relays to. Each console is defined with a protocol (RDP / SSH / VNC) and target host.
- **Privileged Approvals** — time-bounded access requests requiring approver sign-off.
- **Privileged Credentials** — stored credentials for machine login.
- **Privileged Policies** — access-policy rules that gate PRA sessions.
- **Privileged Application Segments** — the ZPA segment variant that exposes PRA consoles.

### Features

- Emergency access (admin break-glass to a session in progress).
- Arbitrary authentication domains.
- File transfer (bidirectional, policy-controlled).
- Clipboard control (copy/paste restrictions per capability policy).
- Session recording.

## About Privileged Credential Pools

**Credential pools** streamline access to privileged consoles by mapping authentication details through privileged credentials policies using SAML and SCIM conditions. Multiple users can access assigned consoles without manual login; users can initiate sessions without entering credentials themselves.

When all credentials in a pool are exhausted or in use, **access to the console is blocked**. Pools eliminate the need for users to possess individual credentials while maintaining pooled credential availability.

## Configuring Privileged Credentials

Three credential types are supported:

1. **Username/Password (RDP)** — with optional domain specification.
2. **SSH Key** — username + secret key + optional passphrase.
3. **VNC Password**.

**Protocol type is immutable after creation.** Credentials are assigned to credential pools and mapped via privileged credentials policy.

## Privileged Approval Requests

Approval workflow data is visible in **Analytics > Privileged Remote Access > Approval Requests**. Request metadata: requester, console, access period, reason, status, request timestamp.

- **Requesters** submit access requests specifying: console, start date, duration, and reason.
- **Approvers** review requests (filtered by console/requester) and approve/deny with specified access periods.
- Once approved, users receive **time-bounded access** to the privileged console. Access automatically expires at the end of the granted window.

## PRA Portal — Requesting Approvals

End users access the PRA Portal's **My Requests** tab to create approval requests.

Workflow:
1. Select microtenant + console.
2. Select start date + duration.
3. Provide optional reason.
4. Submit for approval review.

Approved requests grant temporary access to the specified console for the requested duration.

## Accessing Privileged Sessions (Recording & Playback)

Session recordings are managed in **Analytics > Privileged Sessions > Recordings**.

### Recording statuses

| Status | Meaning |
|---|---|
| **Failed** | Invalid credentials or network issues prevented recording. |
| **Completed** | Session finished; recording not yet processed. |
| **Available** | Ready for download but not for streaming. |
| **Queued** | Awaiting transcoding. |
| **Transcoding** | Converting from RAW to streaming format. |
| **Streaming Ready** | Transcoded and viewable in browser. |

Admins can download recordings locally or stream after transcoding. Playback supports download, streaming playback, and **prioritized transcoding** (push a specific recording to the front of the queue).

Recordings can be shared with other admins in the same tenant via URL copy; **permalinks allow sharing at specific timestamps**.

Access to recordings is gated by the **Session Recording Full Access** admin role permission.

---

## Configuring Consoles Policies

The former Privileged Capabilities Policy URL now redirects to **Configuring
Consoles Policies**. A consoles policy is assigned to selected privileged
consoles and controls:

- file uploads, with optional inline inspection when the ZIA integration is
  available;
- file downloads;
- clipboard copy from and paste into the privileged console;
- privileged-session recording;
- session sharing in **Control** or **Monitor** mode; and
- joining a live privileged session.

File Uploads, File Downloads, Clipboard Copy, Clipboard Paste, Record Sessions,
Share Sessions Mode, and Join Sessions Mode are disabled by default. For a
VNC-enabled console, file upload or download requires SSH on port 22 with the
same credentials used for the VNC login; attempts fail when the target has SFTP
disabled. Policy changes made during a live session take effect only for a new
session. The Help article also notes that session recording captures screen
output, not file-transfer or clipboard-transfer contents.

**File Transfer System**: A separate help article surface exists for PRA file-transfer details; not captured in this pass.
