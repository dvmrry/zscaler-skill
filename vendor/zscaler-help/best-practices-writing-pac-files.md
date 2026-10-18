# Best Practices for Writing PAC Files

**Source:** https://help.zscaler.com/zia/best-practices-writing-pac-files
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399381, revision 3243749

---

If your organization needs to use custom PAC files, Zscaler highly recommends that you copy and paste the default PAC file in the Zscaler Admin Console and edit the file accordingly. This article provides best practices for writing a PAC file:
- Use a simple text editor, such as Windows Notepad, to create and edit a PAC file. Avoid using Microsoft Office Word; some of its characters and features, such as smart quotes, can affect or break the PAC file.
- Because PAC files are text and can be downloaded and viewed by anyone, use appropriate file permissions to ensure that they are secure.
- Thoroughly review and understand the PAC file before making changes.
- By default, each PAC file can be up to 256 KB in size. Contact Zscaler Support to increase the PAC file size limit to a maximum of 2 MB.
- The number of bits required to encode a character changes from character to character, making a precise character count difficult. An error message displays when you try to save a PAC file that is over 256 KB without increasing the limit.
- The speed of file execution depends on the way arguments are constructed in the PAC file, not on the total length of the file. PAC files execute commands serially. Therefore:
  - Do not use excessive exclusion functions, as this might cause slowness.
  - Place arguments or exceptions that have a high probability of being executed at the beginning of the file. For example, private IP address lookups should be at the beginning.
  - Numerous logical OR statements can cause slowness when processing PAC files. It is recommended to group each of the 100 OR statements within its IF statements, so they can be parsed in batches.
- Avoid using complex regular expressions to make a PAC file smaller. This can make it less efficient.
- Add comments that explain the purpose of each argument. Ensure that the comments are easy to understand and are consistent with programming best practices. Comments can be added as separate lines in the PAC file or after an argument at the end of the line. Always begin comments with two forward slashes (//). JavaScript does not attempt to parse or execute text preceded by two forward slashes (//). Although the forward slashes are only required before a comment, you can add forward slashes after a comment as well to improve readability. For example:
- //Comment for the argument return "DIRECT”;
- or
- return "DIRECT”; //Comment for the argument
- Keep the file as small and efficient as possible. Configure SSL exceptions in the Zscaler Admin Console instead of adding them to the PAC file.
- Validate support for built-in JavaScript functions before using them.
- Check URL and host parameters before adding them to the PAC file.
- Use Zscaler-specific variables, such as ${GATEWAY} and ${SECONDARY_GATEWAY}, instead of Public Service Edge for Internet & SaaS (ZIA) IP addresses or host names to ensure proper failover. (If your organization uses a subcloud, use the variables ${GATEWAY.organization_name.zscaler.net} and ${SECONDARY_GATEWAY.organization_name.zscaler.net}.)
- The Zscaler-specific variables are applicable only if you host your PAC file on the Zscaler cloud.
- If your organization is subscribed to a dedicated port, specify your dedicated port instead of the default port 80.
- Check simple rule exceptions first.
- Place high-probability checks near the top.
- Minimize the use of regular expressions.
- Use efficient regular expressions, and avoid capturing matches that will not be used. Because return is immediate, avoid using else with if statements.
- Single-line if() statements do not require begin '{' and end '}' brackets.
- Carefully consider the use (overuse) of isResolvable(), dnsResolve(), and isInNet() due to potential DNS performance issues.
- Try and group similar exceptions into a bigger if loop. For example, instead of checking against 10 hosts with xyz.google.com in a big OR statement, convert it into an outer if statement that is applied to if the host has *.google.com and then test against the 10 hosts.
- Check for IP addresses in a separate if loop.
- Every opening curly bracket must have a corresponding closing curly bracket, and every opening parenthesis must have a corresponding closing parenthesis. One of the most common mistakes in building PAC files is losing count of opening and closing parentheses and brackets.
- Avoid using external or global variables and functions.
- When possible, sort lists of IP addresses, domains, or both to ease future maintenance efforts.
- When possible, group common return values into a single conditional if() check.
- Some browsers might execute PAC files in a case-sensitive manner. To ensure that an incorrect case does not break your PAC file, add the following argument at the top of the PAC file (immediately below the opening curly bracket) to convert everything to lowercase when the PAC file is executed:
- var lhost = host.toLowerCase(); host = lhost;
- Use indents to improve readability. JavaScript ignores white spaces, tabs, and blank lines in the text file, so do not be afraid to manipulate the layout of your text file. For example, if you put text within curly brackets ({ }), indent the line. You must put the closing curly bracket at the same indent level as the opening curly bracket.
- Nested between the opening and closing curly brackets are various JavaScript variables, conditional statements, return statements, and comments.
- Test all conditions and exceptions used in your PAC file prior to deployment. Verify that your JavaScript is error-free. You can use the Google tool (pactester) or any other PAC parser tool to ensure that there are no syntax errors in your PAC file and it works correctly. Additionally, leverage the Verify PAC File option in the Zscaler Admin Console.
- See image.
