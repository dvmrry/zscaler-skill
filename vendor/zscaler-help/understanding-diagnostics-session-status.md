# Understanding the Diagnostics Session Status

**Source:** https://help.zscaler.com/zdx/understanding-diagnostics-session-status
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Digital Experience Monitoring (ZDX) Help 
Troubleshoot 
Diagnostics 
Understanding the Diagnostics Session Status
Digital Experience Monitoring (ZDX)
Understanding the Diagnostics Session Status
Ask Zscaler

The Diagnostics Session Status indicates the current status of a Diagnostics Session. The Diagnostics Session status can be seen in both the In Progress and History tables as an overview or in the Individual Diagnostics Session Information window as part of the in-depth information of the Diagnostics Session.

Diagnostics Sessions in the In Progress table can have one of the following statuses:

Created: The session was created by an admin in ZDX.
Started: Zscaler Client Connector confirms that it has received a request to start a session and probe execution will begin. It might take a few minutes for the state to change from Created to Started.
In Progress: Zscaler Client Connector is executing this session; this status indicates an ongoing session. These sessions provide updated session data every minute.

Diagnostics Sessions in the History table can have one of the following statuses:

Abort Initiated: An admin canceled the session prematurely. The request is forwarded to the Zscaler Client Connector.
Aborted: After receiving the Abort Initiated request, Zscaler Client Connector acknowledges the request and the state is changed to Aborted. It might take a few minutes for the state to be updated.
Expired: The request to start the session timed out due to lack of response from the Zscaler Client Connector. This could be because the device is offline or facing network issues.
Failed: After restarting, Zscaler Client Connector was not able to run the previously scheduled probes due to some internal errors.
Incomplete: The session was not completed due to issues in the pipeline. Partial data is displayed in this case.
Completed: The session has completed successfully.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Diagnostics
Starting a New Diagnostics Session
Viewing Diagnostics Session Results
Evaluating Diagnostics Session Information
Understanding the Diagnostics Session Status
