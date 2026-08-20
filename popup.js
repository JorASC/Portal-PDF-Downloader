const button = document.querySelector("#download");
const status = document.querySelector("#status");

const setStatus = (text) => { status.textContent = text; };

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
    const result = await chrome.tabs.sendMessage(tab.id, { type: "find-pdf" });
    if (!result?.url) {
      setStatus("No PDF found. Open it and wait for it to finish loading.");
      button.disabled = false;
      return;
    }

    const download = await chrome.runtime.sendMessage({ type: "download-pdf", url: result.url });
    setStatus(download?.ok ? "The save dialog was opened." : `Download failed: ${download?.error || "unknown error"}`);
  } catch {
    setStatus("Use this button from a supported portal document tab.");
  }
  button.disabled = false;
});
