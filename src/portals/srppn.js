(() => {
  "use strict";

  const SRPPN_HOSTNAME = "srppn.chihuahua.gob.mx";
  const PDF_ENDPOINT_PATTERN = /ObtenerAgregadoPorPartida/i;
  const PDF_FILE_PATTERN = /\.pdf$/i;

  const toUrl = (value, baseUrl) => {
    try {
      return new URL(value, baseUrl);
    } catch {
      return null;
    }
  };

  const isSupportedPdfUrl = (value, baseUrl = `https://${SRPPN_HOSTNAME}/`) => {
    const url = toUrl(value, baseUrl);
    if (!url || url.protocol !== "https:" || url.hostname !== SRPPN_HOSTNAME) {
      return false;
    }

    return PDF_ENDPOINT_PATTERN.test(`${url.pathname}${url.search}`) || PDF_FILE_PATTERN.test(url.pathname);
  };

  const findPdfUrl = ({ resourceUrls = [], documentUrls = [], baseUrl } = {}) => {
    const candidates = [...resourceUrls, ...documentUrls];
    return candidates.reverse().find((url) => isSupportedPdfUrl(url, baseUrl)) || null;
  };

  const api = Object.freeze({
    SRPPN_HOSTNAME,
    findPdfUrl,
    isSupportedPdfUrl
  });

  globalThis.PortalPdfDownloader = Object.assign(globalThis.PortalPdfDownloader || {}, { srppn: api });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
