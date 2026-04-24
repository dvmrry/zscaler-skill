# Adding Bandwidth Classes

**Source:** https://help.zscaler.com/zia/adding-bandwidth-classes
**Captured:** 2026-04-24 via Playwright MCP.

---

Bandwidth classes identify the URL categories and applications to which the service allocates bandwidth. **You must configure bandwidth classes before you can reference them in Bandwidth Control policy rules.**

To configure bandwidth classes:

- Edit the predefined bandwidth classes, or
- Add new bandwidth classes, then group URL categories, applications, or domains into them.

## Limits (Cloud Applications tab)

- Up to **245 custom bandwidth classes**.
- Up to **8 bandwidth classes with custom domains**.
- Up to **25,000 domains across all bandwidth classes** (including URL categories).
- **Predefined bandwidth classes cannot be deleted** — you can add domains to them, but can't remove the class itself.

## Default-rule behavior for unreferenced classes

**If you have created a custom bandwidth class that isn't being used in any policies for a location**, then the custom class will be added to the location's default Bandwidth Control rule. The default rule includes all internet traffic not covered by other rules. By default, it's not guaranteed any bandwidth, but it **can consume up to 100% of the bandwidth when available**. These defaults can be changed by editing the default rule.

## Procedure — Add a new bandwidth class

1. Go to **Administration > Bandwidth Classes** to manage bandwidth classes.
2. Go to the **Cloud Applications** tab.
3. Click **Add Bandwidth Class**.

In the **Add Bandwidth Class** window:

- **Name** — enter a name for the class.
- **URL categories** — select URL categories to add.
- **Cloud Applications** — select cloud-application categories or individual cloud applications. By default the field displays the first 100 cloud applications; click **Click to see more** at the bottom to load subsequent batches of 100.
- **Domains** — enter URLs to include. Hit Enter after each entry. Multiple entries supported. You can add domains for **up to 8 individual bandwidth classes**.

For item lists:

- View up to 500 items on a page.
- Filter the list by searching.
- Remove the first 25,000 items (**Remove 25K Items**) or only items from a specific page (**Remove Page**). A confirmation window appears.

Click **Save**, then **Save and activate the change**.
