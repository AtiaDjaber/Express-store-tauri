"use strict";
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
exports.getPid = exports.formatCurrency = exports.getSelectPrice = exports.getQteFromSearch = exports.resolveImage = void 0;
var find_process_1 = require("find-process");
// D:\cosmetic-labels-banner-v2.png
function resolveImage(stock, host) {
    if (stock.path == null) {
        return require("@/assets/no-image.png");
    }
    var path = stock.path.replaceAll(String.fromCharCode(92), String.fromCharCode(47));
    return host.includes("localhost") || host.includes("192.")
        ? "file:/" + path
        : host + "storage/attachments/" + stock.photo;
}
exports.resolveImage = resolveImage;
function getQteFromSearch(stock, search) {
    var name = search.name.toLocaleLowerCase().trim();
    if (stock.name.toLocaleLowerCase().includes(name)) {
        return 1;
    }
    var barcode = stock.barcodes.find(function (e) {
        return e.name.toLocaleLowerCase().trim().includes(name);
    });
    if (barcode == undefined) {
        return 1;
    }
    else {
        return barcode.quantity;
    }
}
exports.getQteFromSearch = getQteFromSearch;
function getSelectPrice(stock, setting) {
    var _a;
    return setting.priceSell.includes("1")
        ? stock.sell_price
        : (_a = stock.sell_price2) !== null && _a !== void 0 ? _a : stock.sell_price;
}
exports.getSelectPrice = getSelectPrice;
function formatCurrency(value, displaySymbol) {
    if (displaySymbol === void 0) { displaySymbol = false; }
    var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "DZD"
    });
    if (displaySymbol) {
        return formatter.format(value).replace("DZD", "") + " DA";
    }
    return formatter.format(value).replace("DZD", "");
}
exports.formatCurrency = formatCurrency;
function getPid() {
    return __awaiter(this, void 0, Promise, function () {
        var list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, find_process_1["default"]("port", 8000)];
                case 1:
                    list = _a.sent();
                    if (!list.length) {
                        console.log("port 80 is free now");
                        return [2 /*return*/, null];
                    }
                    else {
                        console.log("%s is listening port 8000", list[0].name + "   " + list[0].pid);
                        return [2 /*return*/, list[0].pid];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPid = getPid;
