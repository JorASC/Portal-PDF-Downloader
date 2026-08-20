const button = document.querySelector("#download");
const status = document.querySelector("#status");

const setStatus = (text) => { status.textContent = text; };

const detectPdfInCurrentFrame = () => {
  const endpointPattern = /ObtenerAgregadoPorPartida/i;
  const pdfFilePattern = /\.pdf$/i;
  const supportedHostname = "srppn.chihuahua.gob.mx";
  const viewerPdfUrl = globalThis.PDFViewerApplication?.url;
  const candidates = [
    ...performance.getEntriesByType("resource").map((entry) => entry.name),
    ...[...document.querySelectorAll("embed[src], iframe[src], object[data]")]
      .map((element) => element.src || element.data)
      .filter(Boolean),
    viewerPdfUrl
  ].filter(Boolean);

  return candidates.reverse().find((value) => {
    try {
      const url = new URL(value, location.href);
      return url.protocol === "https:" &&
        url.hostname === supportedHostname &&
        (endpointPattern.test(`${url.pathname}${url.search}`) || pdfFilePattern.test(url.pathname));
    } catch {
      return false;
    }
  }) || null;
};

button.addEventListener("click", async () => {
  button.disabled = true;
  setStatus("Looking for the loaded PDF…");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    setStatus("No active tab was found.");
    button.disabled = false;
    return;
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: detectPdfInCurrentFrame
    });
    const url = results.map((result) => result.result).find(Boolean);

    if (!url) {
      setStatus("No PDF found. Open it and wait for it to finish loading.");
      button.disabled = false;
      return;
    }

    const download = await chrome.runtime.sendMessage({ type: "download-pdf", url });
    setStatus(download?.ok ? "The save dialog was opened." : `Download failed: ${download?.error || "unknown error"}`);
  } catch {
    setStatus("Use this button from a supported portal document tab.");
  }
  button.disabled = false;
});
