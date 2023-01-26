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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var vuex_class_modules_1 = require("vuex-class-modules");
var _1 = require(".");
var saleApi_1 = require("@/api/saleApi");
var exportApi_1 = require("@/api/exportApi");
var ExportModule = /** @class */ (function (_super) {
    __extends(ExportModule, _super);
    function ExportModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.api = new saleApi_1["default"]();
        _this.apiExportImport = new exportApi_1["default"]();
        _this.facture = {
            montant: 0,
            transfers: []
        };
        // saleList = [] as Sale[];
        // selectedClient = {montant: 0} as Client;
        _this.totalCredit = 0;
        return _this;
    }
    ExportModule.prototype.deleteImportExportFacture = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.apiExportImport.deleteExportImport(id)];
            });
        });
    };
    // get getClient() {
    //     return this.facture.client;
    // }
    // @Mutation
    // calcule() {
    //     this.facture.montant = 0;
    //
    //     this.facture.sales.forEach((prodct, index) => {
    //         prodct.count = index + 1;
    //         this.facture.montant = this.facture.montant + prodct.total;
    //     });
    //     this.facture.rest = Number(this.facture.montant) - Number(this.facture.pay);
    //     this.totalCredit =
    //         (Number(this.facture.montant) + Number((this.facture.client.montant) ?? 0));
    // }
    // get getFacture() {
    //     return this.facture;
    // }
    ExportModule.prototype.setFacture = function (facture) {
        this.facture = facture;
    };
    // @Mutation
    // setSales(sale: Sale[]) {
    //     this.facture.sales = sale;
    // }
    // @Mutation
    // setClient(client: Client) {
    //     // debugger
    //     // this.facture.client = client;
    //     this.facture = {montant: 0, pay: 0, rest: 0, remise: 0, sales: [],client:client} as Facture;
    // }
    ExportModule.prototype.addItem = function (sale) {
        var productNew = Object.assign({}, sale);
        productNew.count = this.facture.transfers.length + 1;
        var index = this.facture.transfers.findIndex(function (e) { return e.product_id == productNew.product_id; });
        if (index >= 0)
            this.facture.transfers[index].quantity =
                this.facture.transfers[index].quantity + 1;
        else
            this.facture.transfers.push(productNew);
    };
    // @Mutation
    // removeItem(sale: Sale) {
    //     const index = this.facture.sales.findIndex((e) => e.product_id == sale.product_id);
    //     this.facture.sales.splice(index, 1);
    // }
    //
    // @Mutation
    // deleteItemById(saleId: Number) {
    //     const index = this.facture.sales.findIndex((e) => e.id == saleId);
    //     this.facture.sales.splice(index, 1);
    // }
    ExportModule.prototype.clearCart = function () {
        this.facture.transfers = [];
    };
    ExportModule.prototype.deleteSale = function (id) {
        return saleApi_1["default"].deleteSale(id).then(function (x) { return x; });
    };
    __decorate([
        vuex_class_modules_1.Mutation
    ], ExportModule.prototype, "setFacture");
    __decorate([
        vuex_class_modules_1.Mutation
    ], ExportModule.prototype, "addItem");
    __decorate([
        vuex_class_modules_1.Mutation
    ], ExportModule.prototype, "clearCart");
    ExportModule = __decorate([
        vuex_class_modules_1.Module({ generateMutationSetters: true })
    ], ExportModule);
    return ExportModule;
}(vuex_class_modules_1.VuexModule));
exports["default"] = new ExportModule({
    store: _1["default"],
    name: "exportModule"
});
