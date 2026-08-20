(() => {
  const looksLikePdf = (url) => {
    try {
      const parsed = new URL(url, location.href);
      return /\.pdf([?#]|$)/i.test(parsed.pathname) ||
        /ObtenerAgregadoPorPartida/i.test(parsed.pathname + parsed.search);
    } catch {
      return false;
    }
  };

  const findPdfUrl = () => {
    const resources = performance.getEntriesByType("resource");
    const found = [...resources].reverse().find((entry) => looksLikePdf(entry.name));
    if (found) return found.name;

    const element = document.querySelector('embed[type="application/pdf"], iframe[src*="pdf"]');
    return element?.src || null;
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "find-pdf") sendResponse({ url: findPdfUrl() });
  });
})();
