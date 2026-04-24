# Best Practices for Writing PAC Files

**Source:** https://help.zscaler.com/zia/best-practices-writing-pac-files
**Captured:** 2026-04-24 via Playwright MCP.

---

If your organization needs to use custom PAC files, Zscaler highly recommends that you copy and paste the default PAC file in the ZIA Admin Portal and edit the file accordingly.

## Authoring environment

- Use a simple text editor, such as Windows Notepad. Avoid Microsoft Office Word; some of its characters and features (smart quotes etc.) can break the PAC file.
- Because `.pac` files are text and can be downloaded and viewed by anyone, use appropriate file permissions to keep them secure.
- Thoroughly review and understand the PAC file before making changes.

## Size limit

- Default limit: **256 KB** per PAC file. Contact Zscaler Support to increase to a maximum of **2 MB**.
- The number of bits required to encode a character varies, making exact character count difficult. An error message displays when you try to save a PAC file over 256 KB without raising the limit.

## Performance

- Speed of file execution depends on **how arguments are constructed**, not on total length. PAC files execute commands serially. Therefore:
  - Do not use excessive exclusion functions — may cause slowness.
  - Place arguments/exceptions with a high probability of being executed **at the beginning** (e.g., private IP address lookups).
  - Numerous logical `OR` statements cause slowness. **Group each 100 OR statements within its own IF statement** so they parse in batches.
  - Avoid complex regular expressions just to make a PAC file smaller.

## Commenting

- Add comments explaining the purpose of each argument. Keep comments easy to understand and consistent with programming best practices.
- Comments can be separate lines or trail an argument at the end of a line.
- Always begin comments with two forward slashes (`//`). JavaScript does not parse or execute text preceded by `//`. Although forward slashes are only required before a comment, you can add them after a comment for readability.

## Keep it small and efficient

- Configure SSL exceptions in the ZIA Admin Portal instead of adding them to the PAC file.
- Validate support for built-in JavaScript functions before using them.
- Check URL and host parameters before adding them.

## Zscaler-specific variables

Use Zscaler-specific variables such as `${GATEWAY}` and `${SECONDARY_GATEWAY}` instead of ZIA Public Service Edge IP addresses or host names to ensure proper failover.

If your organization uses a subcloud, use `${GATEWAY.organization_name.zscaler.net}` and `${SECONDARY_GATEWAY.organization_name.zscaler.net}`.

**The Zscaler-specific variables are applicable only if you host your PAC file on the Zscaler cloud.**

If your organization is subscribed to a dedicated port, specify your dedicated port instead of the default port 80.

## Rule ordering and regex

- Check simple rule exceptions first.
- Place high-probability checks near the top.
- Minimize use of regular expressions.
- Use efficient regular expressions; avoid capturing matches that will not be used. Because `return` is immediate, avoid using `else` with `if` statements.
- Single-line `if()` statements do not require `{` and `}` brackets.
- Carefully consider use of `isResolvable()`, `dnsResolve()`, and `isInNet()` due to potential DNS performance issues.
- Group similar exceptions into a bigger `if` loop. Example: instead of checking 10 `xyz.google.com` hosts in a big OR, convert to an outer `if` that tests `*.google.com` then tests the 10 hosts inside.
- Check for IP addresses in a separate `if` loop.

## Syntax hygiene

- Every opening curly bracket must have a corresponding closing bracket; every opening parenthesis must have a corresponding closing parenthesis. One of the most common mistakes in building PAC files is losing count.
- Avoid using external or global variables and functions.
- When possible, sort lists of IP addresses or domains to ease future maintenance.
- When possible, group common return values into a single conditional `if()` check.

## Case-sensitivity

Some browsers may execute PAC files in a case-sensitive manner. To ensure that incorrect case does not break your PAC file, add the following at the top of the PAC file (immediately below the opening curly bracket) to lowercase everything at execution:

```javascript
var lhost = host.toLowerCase();
host = lhost;
```

## Layout

Use indents to improve readability. JavaScript ignores whitespace, tabs, and blank lines, so manipulating the layout is safe. If you put text within curly brackets, indent the line. Put the closing curly bracket at the same indent level as the opening curly bracket.

## Testing

Test all conditions and exceptions prior to deployment. Verify that the JavaScript is error-free. Use the Google tool (`pactester`) or any other PAC parser tool to ensure no syntax errors. Additionally, leverage the **Verify PAC File** option in the ZIA Admin Portal.
