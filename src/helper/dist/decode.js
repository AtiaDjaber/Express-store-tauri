"use strict";
exports.__esModule = true;
var Decoded = /** @class */ (function () {
    function Decoded() {
    }
    Decoded.DecodedBarcode = function (barcode) {
        if (barcode == null) {
            return barcode;
        }
        barcode = barcode
            .replaceAll("à", "0")
            .replaceAll("&", "1")
            .replaceAll("é", "2")
            .replaceAll('"', "3")
            .replaceAll("'", "4")
            .replaceAll("(", "5")
            .replaceAll("-", "6")
            .replaceAll("è", "7")
            .replaceAll("_", "8")
            .replaceAll("ç", "9");
        // barcode = barcode.replace("&", "1");
        // barcode = barcode.replace("é", "2");
        // barcode = barcode.replace("\"", "3");
        // barcode = barcode.replace("'", "4");
        // barcode = barcode.replace("(", "5");
        // barcode = barcode.replace("-", "6");
        // barcode = barcode.replace("è", "7");
        // barcode = barcode.replace("_", "8");
        // barcode = barcode.replace("ç", "9");
        // barcode = barcode.replace("?", "M");
        return barcode;
    };
    return Decoded;
}());
exports["default"] = Decoded;
