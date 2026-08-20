# Portal PDF Downloader

A small Chrome extension that detects the PDF currently rendered in a supported web portal and lets the user save it with one click.

It is designed for PDFs the user can already access in their own signed-in browser session. The extension does not bypass authentication, payment, access controls, or website restrictions.

## Why this project

Some portals render a document through an embedded PDF viewer instead of exposing a clear download link. This extension reads the browser's already-loaded resource list, identifies the PDF request, and asks Chrome to save that same file.

## Features

- One-click detection of the open PDF
- Native Chrome save dialog
- Minimal permissions
- Scoped to the configured portal domain
- No external services, analytics, or data collection

## Install locally

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose this project folder.
6. Open a PDF in the supported portal, wait for it to finish loading, and click the extension icon.
7. Select **Download open PDF**.

## How it works

```text
Portal PDF viewer → browser resource list → extension popup → Chrome download API → save dialog
```

The content script finds a recently loaded PDF resource. The popup passes its URL to the extension service worker, which invokes Chrome's built-in downloads API.

## Current portal support

The initial implementation is scoped to `srppn.chihuahua.gob.mx` and detects the portal's `ObtenerAgregadoPorPartida` PDF endpoint. Supporting another portal requires adding its domain and a suitable resource URL matcher in `content.js`.

## Project structure

```text
├── manifest.json     # Chrome Extension Manifest V3 configuration
├── content.js        # Finds the PDF resource in the current page
├── popup.html/js     # User interface and interaction flow
└── background.js     # Requests the browser download
```

## Privacy and permissions

`downloads` is used only after the user clicks the button. Access is limited to the supported portal domain. The extension does not transmit, store, or collect document contents, URLs, or user data.

## Development

After changing a file, open `chrome://extensions` and click the reload icon on the extension. Then reload the portal page before testing again.

## License

MIT. See [LICENSE](LICENSE).
