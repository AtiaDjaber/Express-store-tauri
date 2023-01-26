"use strict";
exports.__esModule = true;
exports.Setting = void 0;
var Setting = /** @class */ (function () {
    function Setting() {
        this.zakat = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
        this.name_store = "اسم المحل";
        this.printBarcodePrice = true;
        this.printBarcodeName = true;
        this.isImage = 0;
        this.depot_id = 0;
    }
    return Setting;
}());
exports.Setting = Setting;
