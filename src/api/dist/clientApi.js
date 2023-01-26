"use strict";
exports.__esModule = true;
var axiosModule_1 = require("@/store/axiosModule");
var clientApi = /** @class */ (function () {
    function clientApi() {
    }
    clientApi.prototype.getClients = function (url) {
        return axiosModule_1["default"].instance
            .get("api/clients" + url)
            .then(function (x) { return x.data; });
    };
    clientApi.prototype.getAllClients = function (url) {
        return (axiosModule_1["default"].instance
            // .get<Client[]>("api/teachers" + url)
            .get("api/allclients")
            .then(function (x) { return x.data; }));
    };
    clientApi.prototype.saveClient = function (Client) {
        var saveClient = axiosModule_1["default"].instance
            .post("api/client/add", Client)
            .then(function (x) { return x.data; });
        return saveClient;
    };
    clientApi.prototype.updateClient = function (client) {
        var updateClient = axiosModule_1["default"].instance
            .put("api/client/put", client)
            .then(function (x) { return x.data; });
        return updateClient;
    };
    clientApi.prototype.deleteClient = function (id) {
        var deleteClient = axiosModule_1["default"].instance["delete"]("api/client/" + id)
            .then(function (x) { return x.data; });
        return deleteClient;
    };
    clientApi.prototype.deletePayment = function (id) {
        var deletedClientPayment = axiosModule_1["default"].instance["delete"]("api/client_payment/" + id)
            .then(function (x) { return x.data; });
        return deletedClientPayment;
    };
    clientApi.prototype.getClientPaymentsById = function (id, page) {
        return axiosModule_1["default"].instance
            .get("api/client_payments/getByClientId?client_id=" + id + "&page=" + page)
            .then(function (x) { return x.data; });
    };
    clientApi.prototype.addPayment = function (payment) {
        var savedPayment = axiosModule_1["default"].instance
            .post("api/client_payment/add?price=" +
            payment.price +
            "&client_id=" +
            payment.client_id +
            "&date=" +
            payment.date)
            .then(function (x) { return x.data; });
        return savedPayment;
    };
    clientApi.prototype.getClientFactures = function (search) {
        return axiosModule_1["default"].instance
            .get("api/factures/getByClientId?" + search.toFilter())
            .then(function (x) { return x.data; });
    };
    clientApi.prototype.deleteFacture = function (id) {
        var deleteFacture = axiosModule_1["default"].instance["delete"]("api/facture/" + id)
            .then(function (x) { return x.data; });
        return deleteFacture;
    };
    return clientApi;
}());
exports["default"] = clientApi;
