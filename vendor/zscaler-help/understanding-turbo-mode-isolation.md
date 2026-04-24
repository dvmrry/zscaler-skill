# Understanding Turbo Mode for Isolation

**Source:** https://help.zscaler.com/zero-trust-browser/understanding-turbo-mode-isolation
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zero Trust Browser Help 
End User Isolation Experience 
Understanding Turbo Mode for Isolation
Zero Trust Browser
Understanding Turbo Mode for Isolation
Ask Zscaler

Turbo Mode is an alternative to pixel streaming. It allows the transfer of rendered information from an isolated browser to a local browser as an instruction set. This method of rendering is much faster and much less bandwidth intensive than pixel streaming. It also promises a higher frame rate, ensuring a smooth isolated browsing experience. The capability provides a near-native experience.

Turbo Mode functions by taking browser instructions from the Zscaler Isolation platform and rendering the output natively to an end user's browser. This arrangement eliminates the requirement to stream the isolated content to a browser and is far more efficient with limited internet bandwidth. Turbo Mode is fully functional on most modern desktops and mobile devices. There is no compromise to security if you enable Turbo Mode on an isolation profile. Web content is processed on Isolation containers, and only the rendered content appears in the end user's browser. As a result, no code is executed locally on the device.

The user's device must have hardware acceleration enabled, with support for WebGL and WebGL2, in order to utilize Turbo Mode.

When Turbo Mode is enabled, the user experiences the following benefits:

Rendering of web content at up to 50 frames per second.
Caching of rendering instructions, which facilitates faster scrolling of a web page with the transfer of minimal to no additional data.
Seamless transitions between GIFs, animations, and screen movements without screen scraping or lag.

Admins must enable this feature in the user's isolation profile. To learn more, see Creating Isolation Profiles for ZIA and Creating Isolation Profiles for ZPA. Turbo Mode is not supported for Internet Explorer 11.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Using Persistent State for Isolation
About Zero Trust Client Browser for Zero Trust Browser
Accessing Multiple Sessions In Isolation
Accessing Network Diagnostics in Isolation
User Experience Modes in Isolation
Read-Only Mode In Isolation
Understanding Turbo Mode for Isolation
Using Debug Mode for Isolation
Using the Isolation Bar in Native Browser Experience
Using the Right-Click Menu in Isolation
Using Search in Isolation
Understanding Language Translate for Isolation
Transferring and Viewing Files in Isolation
Original URL for Isolation
Bookmarking Web Pages in Isolation
Mobile User Experience in Isolation
