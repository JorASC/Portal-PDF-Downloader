const test = require("node:test");
const assert = require("node:assert/strict");
const { findPdfUrl, isLikelyPdfUrl, isSupportedRppUrl } = require("../src/portals/srppn.js");

const endpointUrl = "https://srppn.chihuahua.gob.mx/rpp/WebAPI/Servicios/CopiasCertificadas/ObtenerAgregadoPorPartida?partida=123";

test("accepts the SRPPN PDF endpoint over HTTPS as a likely PDF URL", () => {
  assert.equal(isLikelyPdfUrl(endpointUrl), true);
});

test("accepts direct PDF files from SRPPN", () => {
  assert.equal(isLikelyPdfUrl("https://srppn.chihuahua.gob.mx/rpp/files/document.pdf"), true);
});

test("rejects a matching endpoint from another domain", () => {
  assert.equal(isSupportedRppUrl("https://example.com/rpp/ObtenerAgregadoPorPartida?partida=123"), false);
});

test("rejects insecure URLs and pages outside RPP", () => {
  assert.equal(isSupportedRppUrl("http://srppn.chihuahua.gob.mx/rpp/document.pdf"), false);
  assert.equal(isSupportedRppUrl("https://srppn.chihuahua.gob.mx/consulta"), false);
});

test("accepts a non-PDF-looking URL when it comes from the RPP viewer", () => {
  assert.equal(isSupportedRppUrl("https://srppn.chihuahua.gob.mx/rpp/WebAPI/Servicios/Documentos/Descargar?id=123"), true);
});

test("prefers the most recently found supported resource", () => {
  const latestUrl = "https://srppn.chihuahua.gob.mx/rpp/files/latest.pdf";
  assert.equal(findPdfUrl({ resourceUrls: [endpointUrl, latestUrl] }), latestUrl);
});

test("uses supported document element URLs when resources have no PDF", () => {
  assert.equal(findPdfUrl({ documentUrls: [endpointUrl] }), endpointUrl);
});
