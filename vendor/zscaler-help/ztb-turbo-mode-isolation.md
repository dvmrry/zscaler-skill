# Understanding Turbo Mode for Isolation

**Source:** https://help.zscaler.com/zero-trust-browser/understanding-turbo-mode-isolation
**Captured:** 2026-04-28 via Playwright MCP

---

Turbo Mode is an alternative to pixel streaming. It allows the transfer of rendered information from an isolated browser to a local browser as an instruction set. This method of rendering is much faster and much less bandwidth intensive than pixel streaming. It also promises a higher frame rate, ensuring a smooth isolated browsing experience. The capability provides a near-native experience.

## How It Works

Turbo Mode functions by taking browser instructions from the Zscaler Isolation platform and rendering the output natively to an end user's browser. This arrangement eliminates the requirement to stream the isolated content to a browser and is far more efficient with limited internet bandwidth.

Web content is processed on Isolation containers, and only the rendered content appears in the end user's browser. As a result, no code is executed locally on the device.

## Requirements

- Hardware acceleration must be enabled on the user's device
- WebGL and WebGL2 support required
- Not supported for Internet Explorer 11

## Benefits When Enabled

- Rendering of web content at up to 50 frames per second
- Caching of rendering instructions — facilitates faster scrolling with minimal to no additional data transfer
- Seamless transitions between GIFs, animations, and screen movements without screen scraping or lag

## Configuration

Admins must enable Turbo Mode in the user's isolation profile (ZIA isolation profiles or ZPA isolation profiles).
