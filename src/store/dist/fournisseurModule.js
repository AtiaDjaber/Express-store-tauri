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
var fournisseurApi_1 = require("@/api/fournisseurApi");
var vuex_class_modules_1 = require("vuex-class-modules");
var _1 = require(".");
// import Fournisseur from "@/classes/Fournisseur";
var fournisseurModule = /** @class */ (function (_super) {
    __extends(fournisseurModule, _super);
    function fournisseurModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.api = new fournisseurApi_1["default"]();
        _this.Fournisseuritem = {};
        return _this;
    }
    fournisseurModule.prototype.getFournisseurs = function (search) {
        var newUrl = "?name=" +
            (search.name ? search.name : "") +
            (search.url ? search.url : "");
        return this.api.getFournisseurs(newUrl).then(function (x) { return x; });
    };
    fournisseurModule.prototype.saveFournisseur = function (Fournisseur) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.api
                        .saveFournisseur(Fournisseur)
                        .then(function (x) { return Object.assign({}, x); })];
            });
        });
    };
    fournisseurModule.prototype.updateFournisseur = function (Fournisseur) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.api
                        .updateFournisseur(Fournisseur)
                        .then(function (x) { return Object.assign({}, x); })];
            });
        });
    };
    fournisseurModule.prototype.deleteFournisseur = function (id) {
        return this.api.deleteFournisseur(id).then(function (x) { return x; });
    };
    fournisseurModule.prototype.deletePayment = function (id) {
        return this.api.deletePayment(id).then(function (x) { return x; });
    };
    fournisseurModule.prototype.getFournisseurPaymentsById = function (id, page) {
        return this.api.getFournisseurPaymentsById(id, page).then(function (x) { return x; });
    };
    fournisseurModule.prototype.addPayment = function (payment) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.api.addPayment(payment).then(function (x) { return Object.assign({}, x); })];
            });
        });
    };
    fournisseurModule.prototype.getFournisseurfactursById = function (search) {
        return this.api.getFournisseurfacturesById(search).then(function (x) { return x; });
    };
    fournisseurModule.prototype.deleteFacture = function (id) {
        return this.api.deleteFacture(id).then(function (x) { return x; });
    };
    fournisseurModule.prototype.setFournisseur = function (item) {
        this.Fournisseuritem = item;
    };
    Object.defineProperty(fournisseurModule.prototype, "fournisseur", {
        get: function () {
            return this.Fournisseuritem;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        vuex_class_modules_1.Action
    ], fournisseurModule.prototype, "getFournisseurs");
    __decorate([
        vuex_class_modules_1.Action
    ], fournisseurModule.prototype, "saveFournisseur");
    __decorate([
        vuex_class_modules_1.Action
    ], fournisseurModule.prototype, "updateFournisseur");
    __decorate([
        vuex_class_modules_1.Action
    ], fournisseurModule.prototype, "addPayment");
    __decorate([
        vuex_class_modules_1.Mutation
    ], fournisseurModule.prototype, "setFournisseur");
    fournisseurModule = __decorate([
        vuex_class_modules_1.Module({ generateMutationSetters: true })
    ], fournisseurModule);
    return fournisseurModule;
}(vuex_class_modules_1.VuexModule));
exports["default"] = new fournisseurModule({
    store: _1["default"],
    name: "fournisseurModule"
});
