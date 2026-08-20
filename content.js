(() => {
  "use strict";

  const findPdfUrl = () => {
    const resourceUrls = performance.getEntriesByType("resource").map((entry) => entry.name);
    const documentUrls = [...document.querySelectorAll("embed[src], iframe[src], object[data]")]
      .map((element) => element.src || element.data)
      .filter(Boolean);

    return globalThis.PortalPdfDownloader.srppn.findPdfUrl({
      resourceUrls,
      documentUrls,
      baseUrl: location.href
    });
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "find-pdf") sendResponse({ url: findPdfUrl() });
  });
})();
