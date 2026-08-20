# Portal PDF Downloader

Portal PDF Downloader is a small Chrome extension that saves a PDF the user has already opened in a supported web portal. The first supported portal is [SRPPN Chihuahua](https://srppn.chihuahua.gob.mx/).

It is designed for documents available through the user's own signed-in Chrome session. It does not bypass authentication, payment, permissions, or other portal restrictions.

## Features

- One-click download from the extension popup
- Chrome's native **Save As** dialog
- Detection of SRPPN's `ObtenerAgregadoPorPartida` endpoint and direct SRPPN PDF files
- Strict HTTPS and portal-host validation before downloading
- No analytics, external services, or data collection
- Portal-specific detection logic isolated for future expansion

## How it works

```text
Open PDF in SRPPN → extension detects its portal URL → Chrome download API → native Save As dialog
```

When the user clicks the button, the extension checks the current tab and its frames for a compatible URL exposed by the page resource list or PDF viewer element. This means it does not require reloading the portal page. Chrome then requests that URL through the normal browser session and shows its native save dialog.

## Install locally

1. Clone this repository.
2. Open `chrome://extensions` in Google Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Select this repository folder.
6. Open a compatible PDF in SRPPN and wait for it to load.
7. Click the extension icon, then **Download open PDF**.

## Supported portal

| Portal | Supported URL patterns |
| --- | --- |
| `srppn.chihuahua.gob.mx` | `ObtenerAgregadoPorPartida` and direct `.pdf` files |

Only HTTPS URLs on the listed host are eligible for download. A URL from another domain, an insecure URL, or an unrelated portal page is rejected.

## Privacy and permissions

The extension does not collect, store, send, or share document data or user data. Its permissions are limited to the active tab, temporary script execution after the user clicks the button, Chrome downloads, and the SRPPN domain. Read the full [privacy policy](PRIVACY.md).

## Development

This project intentionally uses plain JavaScript and no build step.

```bash
npm test
```

After changing extension files, open `chrome://extensions` and click the reload icon for the extension. The portal tab itself does not need to be reloaded.

### Manual verification

1. Load the unpacked extension in Chrome.
2. Sign in to SRPPN normally, if required.
3. Open a document that uses the supported endpoint.
4. Click **Download open PDF**.
5. Confirm Chrome shows a save dialog and saves the expected document.
6. Open an unrelated tab and confirm the extension reports that it is unsupported.

## Project structure

```text
├── src/portals/srppn.js  # SRPPN URL detection and validation rules
├── popup.js              # Checks the active portal tab after a user click
├── background.js         # Validates and delegates downloads to Chrome
├── popup.html / popup.js # User interface
├── test/                 # Unit tests for portal rules
├── PRIVACY.md
└── manifest.json
```

## Adding another portal

Create a portal module under `src/portals/` with its own URL validation rules, add a narrowly scoped host permission and content-script match in `manifest.json`, then add unit tests. Do not broaden existing portal access or introduce unrestricted host permissions.

## License

Licensed under the [MIT License](LICENSE).
