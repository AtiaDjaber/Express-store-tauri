"use strict";
exports.__esModule = true;
var axiosModule_1 = require("@/store/axiosModule");
var historyApi = /** @class */ (function () {
    function historyApi() {
    }
    historyApi.getFactures = function (search) {
        return axiosModule_1["default"].instance
            .get("api/factures?" + search.toFilter())
            .then(function (x) { return x.data; });
    };
    historyApi.getFactureClient = function (id) {
        return axiosModule_1["default"].instance
            .get("api/facture/getByFactureId/" + id)
            .then(function (x) { return x.data; });
    };
    historyApi.getFactureFournisseur = function (id) {
        return axiosModule_1["default"].instance
            .get("api/fournisseur_facture/getByFactureId/" + id)
            .then(function (x) {
            console.log(x);
            return x.data;
        });
    };
    historyApi.getFourinsseurFactures = function (search) {
        return axiosModule_1["default"].instance
            .get("api/fournisseur_factures?" + search.toFilter())
            .then(function (x) { return x.data; });
    };
    return historyApi;
}());
exports["default"] = historyApi;
