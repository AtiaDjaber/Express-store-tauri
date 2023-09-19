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
exports.LoginModule = void 0;
var vuex_class_modules_1 = require("vuex-class-modules");
var store_1 = require("@/store");
var loginService_1 = require("@/service/loginService");
var axiosModule_1 = require("./axiosModule");
var LoginModule = /** @class */ (function (_super) {
    __extends(LoginModule, _super);
    function LoginModule(service, options) {
        var _this = _super.call(this, options) || this;
        _this.isLoggedIn = false;
        _this._service = service;
        _this._user = localStorage.getItem("user");
        _this.isLoggedIn = _this._user !== null;
        return _this;
    }
    LoginModule.prototype.login = function (user) {
        var _this = this;
        return this._service
            .login(user)
            .then(function (x) {
            if (x) {
                x.chart = x.chart + "" === "1";
                x.facture = x.facture + "" === "1";
                x.client = x.client + "" === "1";
                x.expense = x.expense + "" === "1";
                x.user = x.user + "" === "1";
                x.depot = x.depot + "" === "1";
                x.purchase = x.purchase + "" === "1";
                x.fournisseur = x.fournisseur + "" === "1";
                x.sale = x.sale + "" === "1";
                x.product = x.product + "" === "1";
                x.transfer = x.transfer + "" === "1";
                x.password = undefined;
                // if (remember) {
                _this.setUser(JSON.stringify(x));
                // }
                axiosModule_1["default"].setAxiosToken();
                return x;
            }
            return null;
        })["catch"](function (error) {
            console.log(error);
        });
    };
    LoginModule.prototype.setUser = function (x) {
        this._user = x;
        if (x != "") {
            localStorage.setItem("user", x);
            this.isLoggedIn = true;
        }
        else {
            localStorage.removeItem("user");
            this.isLoggedIn = false;
        }
    };
    LoginModule.prototype.logout = function () {
        this.setUser("");
    };
    Object.defineProperty(LoginModule.prototype, "isLogin", {
        get: function () {
            return this.isLoggedIn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoginModule.prototype, "getCurrentUser", {
        get: function () {
            return JSON.parse(this._user);
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        vuex_class_modules_1.Action
    ], LoginModule.prototype, "login");
    __decorate([
        vuex_class_modules_1.Mutation
    ], LoginModule.prototype, "setUser");
    __decorate([
        vuex_class_modules_1.Action
    ], LoginModule.prototype, "logout");
    LoginModule = __decorate([
        vuex_class_modules_1.Module
    ], LoginModule);
    return LoginModule;
}(vuex_class_modules_1.VuexModule));
exports.LoginModule = LoginModule;
exports["default"] = new LoginModule(new loginService_1["default"](), {
    store: store_1["default"],
    name: "login"
});
