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
var index_1 = require("./index");
var SnackBarModule = /** @class */ (function (_super) {
    __extends(SnackBarModule, _super);
    function SnackBarModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // state
        _this.notifications = [];
        return _this;
    }
    Object.defineProperty(SnackBarModule.prototype, "getNotifications", {
        // getters
        get: function () {
            return this.notifications;
        },
        enumerable: false,
        configurable: true
    });
    SnackBarModule.prototype.validationErrors = function (messages) {
        return Object.values(messages).flat();
    };
    SnackBarModule.prototype.setSnackbar = function (playload) {
        this.notifications = [];
        if (playload.text.toString().includes("500")) {
            playload.text = "فشلت العملية";
            playload.icon = "mdi-alert-outline";
        }
        else if (playload.text.toString().includes("422")) {
            playload.text = this.validationErrors(playload.text.response.data["message"]).join("\n,");
            playload.color = "blue";
        }
        else if (playload.text.toString().includes("401")) {
            playload.text = "معلومات الدخول غير صحيحة";
            playload.icon = "mdi-alert-outline";
        }
        this.notifications.push(playload);
    };
    __decorate([
        vuex_class_modules_1.Mutation
    ], SnackBarModule.prototype, "setSnackbar");
    SnackBarModule = __decorate([
        vuex_class_modules_1.Module({ generateMutationSetters: true })
    ], SnackBarModule);
    return SnackBarModule;
}(vuex_class_modules_1.VuexModule));
exports["default"] = new SnackBarModule({ store: index_1["default"], name: "snackBarModule" });
