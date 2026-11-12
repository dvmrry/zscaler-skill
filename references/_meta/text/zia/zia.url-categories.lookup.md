# Looking up and disputing a URL's category: URL Lookup and Site Review (zia.url-categories.lookup)
Also called: URL Lookup; Site Review; sitereview.zscaler.com; reclassification request

Two tools show how Zscaler categorizes a site. In the Zscaler Admin Console, an admin can see how Zscaler categorizes a site according to its URL or IP address. The result shows the URL Classifications (the predefined category or super category of the URL), the Security Alert associated with the URL, and the Cloud Application category and cloud application the URL is associated with. [zia.url-categories.lookup:url-lookup-console] If a SaaS or cloud provider dedicates an IP address or IP range to an application, the Zscaler service categorizes it. The page's example: 13.107.6.152/31 is used for Microsoft 365 and is categorized as Professional Services and Microsoft 365. [zia.url-categories.lookup:ip-categorized-example]

**Site Review.** Site Review is a URL categorization lookup tool that can be accessed by users going through the Zscaler service, at https://sitereview.zscaler.com/. Its results might vary from those seen in the tenant's environment due to custom categories that the admin has configured. [zia.url-categories.lookup:site-review-tool] Site Review accepts up to three sites per lookup. The URL or IP address is automatically populated in the Enter URL field when a review is requested from the blocked EUN page. A request can select up to three categories that seem appropriate for the website. [zia.url-categories.lookup:site-review-input] The Site Review website supports Chinese, Chinese Taiwan (Optional), English (United States), English (United Kingdom), French, German, Japanese, Russian and Spanish, and the browser language settings must be set to one of them. [zia.url-categories.lookup:site-review-languages]

**Disputing a category.** A site the user thinks is incorrectly categorized can be sent through Site Review to request reclassification. A Support case is automatically created for each request based on the requester's email address, and an email notification follows the review. Requests are handled on a best-effort basis and are not covered by an SLA. Site Review does not allow recategorization of a URL to a specific cloud application; to do that, contact Zscaler Support. [zia.url-categories.lookup:reclassification-request] Turnaround beyond best effort is open [gap:zia.url-categories.lookup:site-review-turnaround].

Not known (open gaps):
- How long a Site Review reclassification takes [gap:zia.url-categories.lookup:site-review-turnaround]: settled by support-ticket

Area: zia.url-categories, its subjects in references/_meta/spine/zia/zia.url-categories.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to)
- see-also references/_meta/text/zia/zia.url-categories.entry-format.md (What a URL category entry may contain, and category limits)
