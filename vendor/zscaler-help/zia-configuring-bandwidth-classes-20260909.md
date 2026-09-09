SOURCE-URLS:
https://help.zscaler.com/zia/adding-bandwidth-classes
https://help.zscaler.com/zia/Configuring-bandwidth-classes
RESOLVED-URL: https://help.zscaler.com/zia/Configuring-bandwidth-classes
CANONICAL: https://help.zscaler.com/zia/Configuring-bandwidth-classes
TITLE: Configuring Bandwidth Classes | Zscaler
**Captured:** 2026-09-09T16:25:47.853Z (browser-rendered article body; both requests returned this body)
EXTRACTION: visible text from #normal-article-page after client rendering; navigation, feedback, related articles, footer, and cookie banner omitted.
---
Watch a video about Bandwidth Classes (shows legacy UI).

Bandwidth classes identify the URL categories and applications to which the service allocates bandwidth. You must configure the bandwidth classes before you can reference them in the Bandwidth Control policy rules. To configure cloud application bandwidth classes, edit the predefined bandwidth classes or add new bandwidth classes (custom), then group URL categories, applications, or domains into the bandwidth classes.

On the Cloud Applications tab:

You can add up to 245 custom bandwidth classes.
You can have up to 8 bandwidth classes with custom domains.
You can add up to 25,000 domains across all bandwidth classes (including URL categories).
Managing Predefined Bandwidth Classes

The Cloud Applications tab lists predefined bandwidth classes to which you can add URL domains. You can also add your own custom domains. To learn more about predefined bandwidth classes, see About Bandwidth Classes.

The following are the predefined bandwidth classes:

File Share: Includes URLs that represent file-sharing sites.
Finance: Includes URLs that represent business-oriented, financial web-based applications or tools, such as Smith Barney or E*Trade.
General Surfing: Includes all URL categories and cloud apps that do not fall into the following categories: Webmail, Instant Messaging, Streaming Media/File Share, and Social Networks/Blogging. This class can't be edited.
Sales/Support Apps: Includes URLs that represent business-oriented, sales/support web-based applications or tools, such as Salesforce or NetSuite.
Streaming Media: Includes URLs that represent streaming sites.

To manage domains to the predefined bandwidth classes:

From the navigation menu, go to Internet Access > Resources > Bandwidth Classes.
Go to the Cloud applications tab.

Click the Edit icon next to the bandwidth class you want to edit.

The Edit Bandwidth Class drawer appears.

In the Edit Bandwidth Class drawer:

Domains: Enter the URLs you want to include in the bandwidth class, and click Add. Use the URL format guidelines for adding domains.
Click the Edit or Delete icon to modify or remove an existing domain, respectively.

See image.

Click Save and activate your changes.

You cannot delete a predefined bandwidth class.

Adding Custom Bandwidth Classes

In addition to predefined bandwidth classes, you can add custom bandwidth classes and specify the URL categories and cloud applications. If you have created a custom bandwidth class that isn't being used in any policies for a location, then the custom class is added to the location’s default Bandwidth Control rule. The default rule includes all internet traffic not covered by other rules. By default, it's not guaranteed any bandwidth, but it can consume up to 100% of the bandwidth when available.

To add a custom bandwidth class:

Go to Internet Access > Resources > Bandwidth Classes.
Go to the Cloud Applications tab.

Click Add Bandwidth Class.

The Add Bandwidth Class drawer appears.

In the Add Bandwidth Class drawer:

Name: Enter a name for the class.
Definition: Displays custom in the field. This is a non-editable field.
URL Categories: Select URL categories to add to the bandwidth class.

Cloud Applications: Select cloud applications to add to the bandwidth class. You can select cloud application categories or individual cloud applications.

See image.

Domains: Enter the URLs that you want to include in the bandwidth class and click Add Items. You can enter multiple entries. Press Enter after each entry. You can add domains for up to 8 individual bandwidth classes. For guidance on entering URLs, see the URL format guidelines. For item lists, you can view up to 500 items on a page; filter the list by searching for a word, phrase, or number contained in an item; and remove the first 25,000 items from the list (Remove 25K Items) or only items from a specific page (Remove Page). If you select Remove 25K Items or Remove Page, a confirmation window appears.

See image.

Click Save and activate the change.
