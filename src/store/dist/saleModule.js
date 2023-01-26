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
var snackBarModule_1 = require("@/store/snackBarModule");
var SaleModule = /** @class */ (function (_super) {
    __extends(SaleModule, _super);
    function SaleModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //   facture = this.emptyFacture();
        _this.cartList = [_this.emptyFacture()];
        _this.date = new Date();
        _this.currentCart = 0;
        return _this;
    }
    // saleList = [] as Sale[];
    //   get getFacture() {
    //     return this.facture;
    //   }
    SaleModule.prototype.changeSelectedCart = function (index) {
        this.currentCart = index;
    };
    Object.defineProperty(SaleModule.prototype, "getFacture", {
        get: function () {
            return this.cartList[this.currentCart];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SaleModule.prototype, "getListFacture", {
        get: function () {
            return this.cartList;
        },
        enumerable: false,
        configurable: true
    });
    SaleModule.prototype.getMax = function () {
        var max = 1;
        for (var i = 0; i < this.cartList.length; i++) {
            for (var j = 0; j < this.cartList.length; j++) {
                if (max < this.cartList[i].cartNumber) {
                    max = this.cartList[i].cartNumber;
                }
            }
        }
        return max + 1;
    };
    SaleModule.prototype.setFacture = function (facture) {
        // this.cartList[this.currentCart] = facture;
        this.cartList.push(Object.assign({ cartNumber: this.getMax(), cartName: "السلة" }, facture));
        this.changeSelectedCart(this.cartList.length - 1);
    };
    SaleModule.prototype.setCartList = function (cartList) {
        this.cartList = cartList;
    };
    SaleModule.prototype.addItem = function (productNew) {
        // const productNew = Object.assign({}, sale);
        productNew.count = this.cartList[this.currentCart].sales.length + 1;
        var index = this.cartList[this.currentCart].sales.findIndex(function (e) { return e.product_id == productNew.product_id; });
        if (index >= 0)
            this.cartList[this.currentCart].sales[index].quantity =
                this.cartList[this.currentCart].sales[index].quantity + 1;
        else {
            if (productNew.name != undefined) {
                this.cartList[this.currentCart].sales.splice(0, 0, productNew);
            }
            this.checkQuantity(productNew);
        }
    };
    SaleModule.prototype.checkQuantity = function (sale) {
        if (sale.product.quantity < 1) {
            snackBarModule_1["default"].setSnackbar({
                text: "الكمية غير متوفرة",
                color: "error",
                timeout: 2000,
                show: true,
                icon: "mdi-alert-outline",
                x: "right",
                y: "top"
            });
        }
        if (sale.product.date_expire != null &&
            new Date(sale.product.date_expire).getTime() - this.date.getTime() >= 0) {
            snackBarModule_1["default"].setSnackbar({
                text: "تحذير انتهت صلاحية المنتج",
                color: "error",
                timeout: 6000,
                show: true,
                icon: "mdi-alert-outline",
                x: "left",
                y: "top"
            });
        }
    };
    SaleModule.prototype.clearCart = function () {
        this.cartList[this.currentCart].sales = [];
    };
    SaleModule.prototype.addNewFacture = function () {
        this.cartList[this.currentCart] = this.emptyFacture();
    };
    SaleModule.prototype.emptyFacture = function (cartNumber) {
        if (cartNumber === void 0) { cartNumber = 1; }
        return {
            montant: 0,
            pay: 0,
            rest: 0,
            remise: 0,
            sales: [],
            cartName: "السلة",
            cartNumber: cartNumber
        };
    };
    SaleModule.prototype.deleteSale = function (id) {
        return saleApi_1["default"].deleteSale(id).then(function (x) { return x; });
    };
    __decorate([
        vuex_class_modules_1.Mutation
    ], SaleModule.prototype, "setFacture");
    __decorate([
        vuex_class_modules_1.Mutation
    ], SaleModule.prototype, "setCartList");
    __decorate([
        vuex_class_modules_1.Mutation
    ], SaleModule.prototype, "addItem");
    __decorate([
        vuex_class_modules_1.Mutation
    ], SaleModule.prototype, "clearCart");
    __decorate([
        vuex_class_modules_1.Mutation
    ], SaleModule.prototype, "addNewFacture");
    __decorate([
        vuex_class_modules_1.Action
    ], SaleModule.prototype, "deleteSale");
    SaleModule = __decorate([
        vuex_class_modules_1.Module({ generateMutationSetters: true })
    ], SaleModule);
    return SaleModule;
}(vuex_class_modules_1.VuexModule));
exports["default"] = new SaleModule({
    store: _1["default"],
    name: "saleModule"
});
