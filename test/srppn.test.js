const test = require("node:test");
const assert = require("node:assert/strict");
const { findPdfUrl, isSupportedPdfUrl } = require("../src/portals/srppn.js");

const endpointUrl = "https://srppn.chihuahua.gob.mx/Documentos/ObtenerAgregadoPorPartida?partida=123";

test("accepts the SRPPN PDF endpoint over HTTPS", () => {
  assert.equal(isSupportedPdfUrl(endpointUrl), true);
});

test("accepts direct PDF files from SRPPN", () => {
  assert.equal(isSupportedPdfUrl("https://srppn.chihuahua.gob.mx/files/document.pdf"), true);
});

test("rejects a matching endpoint from another domain", () => {
  assert.equal(isSupportedPdfUrl("https://example.com/ObtenerAgregadoPorPartida?partida=123"), false);
});

test("rejects insecure URLs and unrelated SRPPN pages", () => {
  assert.equal(isSupportedPdfUrl("http://srppn.chihuahua.gob.mx/document.pdf"), false);
  assert.equal(isSupportedPdfUrl("https://srppn.chihuahua.gob.mx/consulta"), false);
});

test("prefers the most recently found supported resource", () => {
  const latestUrl = "https://srppn.chihuahua.gob.mx/files/latest.pdf";
  assert.equal(findPdfUrl({ resourceUrls: [endpointUrl, latestUrl] }), latestUrl);
});

test("uses supported document element URLs when resources have no PDF", () => {
  assert.equal(findPdfUrl({ documentUrls: [endpointUrl] }), endpointUrl);
});
