# Understanding Turbo Mode for Isolation

**Source:** https://help.zscaler.com/zero-trust-browser/understanding-turbo-mode-isolation
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1506406, revision 3243239

---

Turbo Mode is an alternative to pixel streaming. It allows the transfer of rendered information from an isolated browser to a local browser as an instruction set. This method of rendering is much faster and much less bandwidth intensive than pixel streaming. It also promises a higher frame rate, ensuring a smooth isolated browsing experience. The capability provides a near-native experience.
Turbo Mode functions by taking browser instructions from the Zero Trust Browser platform and rendering the output natively to an end user's browser. This arrangement eliminates the requirement to stream the isolated content to a browser and is far more efficient with limited internet bandwidth. Turbo Mode is fully functional on most modern desktops and mobile devices. There is no compromise to security if you enable Turbo Mode on an isolation profile. Web content is processed on isolation containers, and only the rendered content appears in the end user's browser. As a result, no code is executed locally on the device.
The user's device must have hardware acceleration enabled, with support for WebGL and WebGL2, in order to utilize Turbo Mode.
When Turbo Mode is enabled, the user experiences the following benefits:
- Rendering of web content at up to 50 frames per second.
- Caching of rendering instructions, which facilitates faster scrolling of a web page with the transfer of minimal to no additional data.
- Seamless transitions between animations and screen movements without screen scraping or lag.
Admins must enable this feature in the user's isolation profile. To learn more, see Creating Isolation Profiles for Internet & SaaS and Creating Isolation Profiles for Private Access. Turbo Mode is not supported for Internet Explorer 11.
