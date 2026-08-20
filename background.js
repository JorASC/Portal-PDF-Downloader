importScripts("src/portals/srppn.js");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "download-pdf") return;

  if (!globalThis.PortalPdfDownloader.srppn.isSupportedPdfUrl(message.url)) {
    sendResponse({ ok: false, error: "The requested URL is not a supported SRPPN PDF." });
    return;
  }

  chrome.downloads.download({
    url: message.url,
    saveAs: true,
    conflictAction: "uniquify"
  }).then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
