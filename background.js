chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "download-pdf") return;

  chrome.downloads.download({
    url: message.url,
    saveAs: true,
    conflictAction: "uniquify"
  }).then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
