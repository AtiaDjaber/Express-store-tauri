"use strict";
exports.__esModule = true;
var Search = /** @class */ (function () {
    function Search() {
        this.name = "";
        this.url = "";
        this.from = null;
        this.client_id = null;
        this.box_id = null;
        this.fournisseur_id = null;
        this.depot_id = null;
        this.type = null;
    }
    Search.prototype.toFilter = function () {
        return ("page=" +
            (this.url ? this.url : "1") +
            "&name=" +
            (this.name ? this.name : "") +
            "&from=" +
            (this.from ? this.from : "") +
            "&to=" +
            (this.to ? this.to : "") +
            "&client_id=" +
            (this.client_id ? this.client_id : "") +
            "&fournisseur_id=" +
            (this.fournisseur_id ? this.fournisseur_id : "") +
            "&type=" +
            (this.type ? this.type : "export") +
            "&depot_id=" +
            (this.depot_id ? this.depot_id : "") +
            "&box_id=" +
            (this.box_id ? this.box_id : ""));
    };
    return Search;
}());
exports["default"] = Search;
