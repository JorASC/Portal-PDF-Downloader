# Privacy Policy

Portal PDF Downloader does not collect, store, transmit, sell, or share personal data.

The extension runs only on `https://srppn.chihuahua.gob.mx/*`. When the user presses **Download open PDF**, it searches the current page for a compatible PDF URL and passes that URL to Chrome's built-in download service. The PDF is requested by Chrome using the user's normal browser session.

The extension does not read passwords, extract cookies, bypass authentication, process payments, alter portal permissions, or send information to external services.

## Permissions

- `activeTab`: lets the popup access only the tab the user explicitly selected.
- `scripting`: lets the extension check that selected tab for a compatible PDF URL only after the user clicks the download button.
- `downloads`: opens Chrome's native save dialog after the user requests a download.
- Host access to `srppn.chihuahua.gob.mx`: enables detection only inside the supported portal.

For questions about this policy, open an issue in this repository.
