# What Is Zero Trust Browser?

**Source:** https://help.zscaler.com/zero-trust-browser/what-is-zero-trust-browser
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zero Trust Browser Help 
What Is Zero Trust Browser?
Zero Trust Browser
What Is Zero Trust Browser?
Ask Zscaler

Zero Trust Browser (formerly Zscaler Isolation) provides an organization the capability to isolate users from potentially harmful content on the internet. This is done by loading the accessed web page on a remote browser in any one of the many Zscaler data centers across the globe, and streaming the rendered content as a stream of pixels to the user's native browser.

The overall solution of Zero Trust Browser consists of three primary components: a browser extension that handles web-based security and access, a lightweight agent that enforces device posture controls and advanced data protection during the session, and a cloud browser for accessing private applications in an isolated session. To learn more, see About Zero Trust Client Browser for Zero Trust Browser.

Isolating web pages on an ephemeral, remote browser ensures that the HTML files, CSS files, JavaScript files, and any other active content served by the accessed web page never reach the user's machine or the corporate network, thus ensuring an air gap between the user and the web page accessed.

Zero Trust Browser not only provides the capability to isolate web pages, but also allows the user to view file types in isolation without requiring a download of the files to their local machine.

This feature is fully integrated with Internet & SaaS (ZIA) and Private Access (ZPA), allowing the admin of an organization to granularly define what web traffic should be isolated and what policies need to be applied to the isolated traffic. The traffic egressing the isolation browser is also passed through the Public Service Edges for Internet & SaaS before reaching the internet web page being accessed.

In addition to the security policies enforced by Internet & SaaS, Zero Trust Browser provides additional data exfiltration security controls, which enable an organization to control the level of interaction the user can have with the isolated web page.

Zero Trust Browser Traffic Flow

The internet-bound web traffic is forwarded to the Public Service Edge using a GRE tunnel, Zscaler Client Connector, or any of the other Zscaler-recommended traffic forwarding methods. If the accessed URL hits a URL filtering policy in Internet & SaaS created by the admin to isolate the traffic, the HTTP/HTTPS request is redirected to the isolation profile URL with the original URL in the query string.

The user's browser follows the redirect and makes a request to the isolation profile URL. Zero Trust Browser accepts the request and assigns a temporary, remote browser for the user. The remote browser then makes a connection to the original URL that the user intended to access, and the web page is loaded on the remote browser. This request to the original web page is also routed through the nearest Public Service Edges, and the traffic is evaluated against all the policies defined for the user in Internet & SaaS by the admin.

Default isolation profiles are automatically created for all organizations when they have Zero Trust Browser. You can also manually create multiple isolation profiles for both Internet & SaaS and Private Access in the Zscaler Admin Console.

Zero Trust Browser Architecture

The structure of Zero Trust Browser consists of multiple engines that work together to forward and convert traffic. When the user's traffic hits Zero Trust Browser, Zero Trust Browser creates an endpoint container for the user on the cloud. The Chromium rendering engine makes a connection to the web page that the user has requested, and renders the content of that web page. The rendered web page is processed by the proprietary experience engine, which then converts it into a stream of images that are delivered to the user's native browser over a secure HTTPS connection.

Each user redirected to Zero Trust Browser is allocated an endpoint container, and all subsequent requests hitting the isolation profile use the same container. The containers are destroyed if a user manually logs out of the isolation session, or if the default idle timeout of 10 minutes is reached.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
What Is Zero Trust Browser?
Step-by-Step Configuration Guide for Zero Trust Browser
