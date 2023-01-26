"use strict";
exports.__esModule = true;
var axiosModule_1 = require("@/store/axiosModule");
var DepotApi = /** @class */ (function () {
    function DepotApi() {
    }
    DepotApi.prototype.getDepots = function (search) {
        return axiosModule_1["default"].instance
            .get("api/depots?" + search.toFilter())
            .then(function (x) { return x.data; });
    };
    DepotApi.prototype.getAllDepots = function (url) {
        return axiosModule_1["default"].instance.get("api/depots").then(function (x) { return x.data; });
    };
    DepotApi.prototype.saveDepot = function (depot) {
        var saveDepot = axiosModule_1["default"].instance
            .post("api/depot/add", depot)
            .then(function (x) { return x.data; });
        return saveDepot;
    };
    DepotApi.prototype.updateDepot = function (depot) {
        var updateDepot = axiosModule_1["default"].instance
            .put("api/depot/put", depot)
            .then(function (x) { return x.data; });
        return updateDepot;
    };
    DepotApi.prototype.deleteDepot = function (id) {
        var deleteDepot = axiosModule_1["default"].instance["delete"]("api/depot/" + id)
            .then(function (x) { return x.data; });
        return deleteDepot;
    };
    return DepotApi;
}());
exports["default"] = DepotApi;
