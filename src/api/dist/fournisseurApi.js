"use strict";
exports.__esModule = true;
var axiosModule_1 = require("@/store/axiosModule");
var FournisseurApi = /** @class */ (function () {
    function FournisseurApi() {
    }
    // public constructor() {
    //   super(process.env.VUE_APP_API_URL);
    // }
    FournisseurApi.prototype.getFournisseurs = function (url) {
        return axiosModule_1["default"].instance
            .get("api/fournisseurs" + url)
            .then(function (x) { return x.data; });
    };
    FournisseurApi.getAllFournisseurs = function (url) {
        return (axiosModule_1["default"].instance
            // .get<Fournisseur[]>("api/teachers" + url)
            .get("api/allfournisseurs")
            .then(function (x) { return x.data; }));
    };
    FournisseurApi.prototype.saveFournisseur = function (Fournisseur) {
        var saveFournisseur = axiosModule_1["default"].instance
            .post("api/fournisseur/add", Fournisseur)
            .then(function (x) { return x.data; });
        return saveFournisseur;
    };
    FournisseurApi.prototype.updateFournisseur = function (Fournisseur) {
        var updateFournisseur = axiosModule_1["default"].instance
            .put("api/fournisseur/put", Fournisseur)
            .then(function (x) { return x.data; });
        return updateFournisseur;
    };
    FournisseurApi.prototype.deleteFournisseur = function (id) {
        var deleteFournisseur = axiosModule_1["default"].instance["delete"]("api/fournisseur/" + id)
            .then(function (x) { return x.data; });
        return deleteFournisseur;
    };
    FournisseurApi.prototype.deletePayment = function (id) {
        var deletedFournisseurPayment = axiosModule_1["default"].instance["delete"]("api/fournisseur_payment/" + id)
            .then(function (x) { return x.data; });
        return deletedFournisseurPayment;
    };
    FournisseurApi.prototype.getFournisseurPaymentsById = function (id, page) {
        return axiosModule_1["default"].instance
            .get("api/fournisseur_payments/getByFournisseurId?fournisseur_id=" +
            id +
            "&page=" +
            page)
            .then(function (x) { return x.data; });
    };
    FournisseurApi.prototype.addPayment = function (payment) {
        var savedPayment = axiosModule_1["default"].instance
            .post("api/fournisseur_payment/add?price=" +
            payment.price +
            "&fournisseur_id=" +
            payment.fournisseur_id +
            "&date=" +
            payment.date)
            .then(function (x) { return x.data; });
        return savedPayment;
    };
    FournisseurApi.prototype.getFournisseurfacturesById = function (search) {
        return axiosModule_1["default"].instance
            .get("api/fournisseur_factures?" + search.toFilter())
            .then(function (x) { return x.data; });
    };
    FournisseurApi.prototype.deleteFacture = function (id) {
        var deleteFacture = axiosModule_1["default"].instance["delete"]("api/fournisseur_facture/" + id)
            .then(function (x) { return x.data; });
        return deleteFacture;
    };
    return FournisseurApi;
}());
exports["default"] = FournisseurApi;
