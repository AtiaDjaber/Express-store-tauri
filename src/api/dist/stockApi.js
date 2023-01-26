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
var axiosModule_1 = require("@/store/axiosModule");
var axios_1 = require("axios");
var stockApi = /** @class */ (function () {
    function stockApi() {
    }
    stockApi.getStock = function (search) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.get("api/products?" + search.toFilter())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.getAllStock = function (search) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.get("api/products/all?" + search.toFilter())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.getProductsDepot = function (search) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.get("api/product_depot?" + search.toFilter())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.getBarcode = function (resource) {
        if (resource === void 0) { resource = "products"; }
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.get("api/product/generate?table=" + resource)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.saveStock = function (stock) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.post("api/product/add", stock)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.saveManyStock = function (stock) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.post("api/product/add_many", stock)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.deleteStock = function (id) {
        var deleteStock = axiosModule_1["default"].instance["delete"]("api/product/" + id)
            .then(function (x) { return x.data; });
        return deleteStock;
    };
    stockApi.updateStock = function (stock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axiosModule_1["default"].instance.put("api/product/put", stock)];
            });
        });
    };
    stockApi.getFav = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.get("api/favorites")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.saveFav = function (favorite) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.post("api/favorite/add", favorite)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.updateFav = function (favorite) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axiosModule_1["default"].instance.put("api/favorite/put", favorite)];
            });
        });
    };
    stockApi.attachProductToFavorite = function (favorite, stock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axiosModule_1["default"].instance.post("api/favorite/add-product/" + favorite.id + "/" + stock.id, {})];
            });
        });
    };
    stockApi.detachProductFromFavorite = function (favorite, stock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axiosModule_1["default"].instance.post("api/favorite/remove-product/" + favorite.id + "/" + stock.id, {})];
            });
        });
    };
    stockApi.uploadImage = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(formData);
                        return [4 /*yield*/, axios_1["default"]
                                .post(process.env.VUE_APP_API_URL + "api/product/upload", formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: "Bearer " + localStorage.getItem("token")
                                }
                            })["catch"](function (e) {
                                console.log(e);
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    stockApi.deleteFavorite = function (id) {
        var deleteStock = axiosModule_1["default"].instance["delete"]("api/favorite/" + id)
            .then(function (x) { return x.data; });
        return deleteStock;
    };
    stockApi.getDamages = function (search) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.get("api/damages?" + search.toFilter())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.deleteDamage = function (id) {
        var deleted = axiosModule_1["default"].instance["delete"]("api/damages/" + id)
            .then(function (x) { return x.data; });
        return deleted;
    };
    stockApi.saveDamage = function (damage) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axiosModule_1["default"].instance.post("api/damage/add", damage)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    stockApi.deleteBarcode = function (id) {
        var deleted = axiosModule_1["default"].instance["delete"]("api/barcode/" + id)
            .then(function (x) { return x.data; });
        return deleted;
    };
    return stockApi;
}());
exports["default"] = stockApi;
