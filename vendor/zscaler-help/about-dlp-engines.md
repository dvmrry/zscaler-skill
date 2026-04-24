# About DLP Engines

**Source:** https://help.zscaler.com/zia/about-dlp-engines
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Policies 
Data Loss Prevention 
DLP Dictionaries & Engines 
About DLP Engines
Internet & SaaS (ZIA)
About DLP Engines
Ask Zscaler

A DLP engine is a collection of one or more DLP dictionaries. When you define your DLP policy rules and Endpoint DLP policy rules, you must reference DLP engines, rather than DLP dictionaries. By using a DLP engine, you can create rules to detect content that encompasses more than one dictionary. For example, if your organization wants to protect social security and credit card numbers, create a rule using an engine that contains the Credit Cards and Social Security Numbers dictionaries.

The Zscaler service provides predefined DLP engines and supports custom DLP engines. You can edit predefined engines, create custom engines, or clone existing engines to detect content that is relevant to your organization. When configuring a predefined or custom engine, you can also combine dictionaries with Boolean operators to create logical expressions. To learn more, see Understanding DLP Engines.

DLP engines provide the following benefits and allow you to:

Use a collection of DLP dictionaries to define DLP policy rules.
Create rules to detect content that encompasses more than one dictionary.
Use the Zscaler predefined DLP engines, or create your own custom DLP engines.

Zscaler DLP engines can scan files with a maximum size of 400 MB. For an archived file, the size of individual files when decompressed can also be a maximum of 100 MB. DLP engines can scan up to 5 levels of compression.

About the DLP Engines Page

On the DLP Engines page (Policies > Data Protection > Common Resources > DLP Dictionaries & Engines > DLP Engines), you can do the following:

Add a custom DLP engine.
View a list of all DLP engines that were configured for your organization. For DLP engines, you can see:
Name: The name of the DLP engine. You can sort this column.
Channels: The specific channels (Network Share, Personal Cloud Storage, Printing, or Removable Storage) associated with the DLP engine.
Dictionaries: The DLP dictionaries included in the engine.
Description: The description of the engine, if available. You can sort this column.
Search for a DLP engine.
Modify the table and its columns.
Edit or clone a DLP engine.
Go to the DLP Dictionaries page, to view, modify, or add DLP dictionaries.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About DLP Dictionaries
Understanding Predefined DLP Dictionaries
Editing Predefined DLP Dictionaries
Cloning Predefined DLP Dictionaries
Adding Custom DLP Dictionaries
Defining Patterns for Custom DLP Dictionaries
Defining Phrases for Custom DLP Dictionaries
Defining Microsoft Information Protection Labels for Custom DLP Dictionaries
About DLP Engines
Understanding DLP Engines
Editing Predefined DLP Engines
Adding Custom DLP Engines
Cloning DLP Engines
