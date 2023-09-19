"use strict";
exports.__esModule = true;
exports.Setting = void 0;
var Setting = /** @class */ (function () {
    function Setting() {
        this.zakat = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
        this.name_store = "اسم المحل";
        this.locale = "ar";
        this.priceSell = "السعر 1";
        this.isReceiptDefault = true;
        this.printBarcodePrice = true;
        this.printBarcodeName = true;
        this.remember = true;
        this.isImage = 0;
        this.server = 0;
        this.depot_id = 0;
    }
    return Setting;
}());
exports.Setting = Setting;
