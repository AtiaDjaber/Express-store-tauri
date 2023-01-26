"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var vuex_class_modules_1 = require("vuex-class-modules");
var _1 = require(".");
var saleApi_1 = require("@/api/saleApi");
var PurchaseModule = /** @class */ (function (_super) {
    __extends(PurchaseModule, _super);
    function PurchaseModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.api = new saleApi_1["default"]();
        _this.facture = {
            montant: 0,
            pay: 0,
            rest: 0,
            remise: 0,
            purchases: []
        };
        // saleList = [] as Sale[];
        // selectedClient = {montant: 0} as Client;
        _this.totalCredit = 0;
        return _this;
    }
    Object.defineProperty(PurchaseModule.prototype, "getFacture", {
        get: function () {
            return this.facture;
        },
        enumerable: false,
        configurable: true
    });
    PurchaseModule.prototype.setFacture = function (facture) {
        this.facture = facture;
    };
    PurchaseModule.prototype.addItem = function (purchase) {
        var productNew = Object.assign({}, purchase);
        productNew.count = this.facture.purchases.length + 1;
        var index = this.facture.purchases.findIndex(function (e) { return e.product_id == productNew.product_id; });
        if (index >= 0)
            this.facture.purchases[index].quantity =
                this.facture.purchases[index].quantity + 1;
        else {
            this.facture.purchases.push(productNew);
        }
    };
    PurchaseModule.prototype.clearCart = function () {
        this.facture.purchases = [];
    };
    PurchaseModule.prototype.deleteSale = function (id) {
        return saleApi_1["default"].deleteSale(id).then(function (x) { return x; });
    };
    __decorate([
        vuex_class_modules_1.Mutation
    ], PurchaseModule.prototype, "setFacture");
    __decorate([
        vuex_class_modules_1.Mutation
    ], PurchaseModule.prototype, "addItem");
    __decorate([
        vuex_class_modules_1.Mutation
    ], PurchaseModule.prototype, "clearCart");
    PurchaseModule = __decorate([
        vuex_class_modules_1.Module({ generateMutationSetters: true })
    ], PurchaseModule);
    return PurchaseModule;
}(vuex_class_modules_1.VuexModule));
exports["default"] = new PurchaseModule({
    store: _1["default"],
    name: "purchaseModule"
});
