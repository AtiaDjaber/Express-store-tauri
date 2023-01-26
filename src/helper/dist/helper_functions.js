"use strict";
exports.__esModule = true;
var HelperFunctions = /** @class */ (function () {
    function HelperFunctions() {
    }
    HelperFunctions.selectedColor = function (product) {
        var color = "primary";
        if (product.quantity <= product.quantity_alert) {
            color = "amber lighten-1";
        }
        if (product.quantity < 0) {
            color = "red accent-3";
        }
        return color;
    };
    return HelperFunctions;
}());
exports["default"] = HelperFunctions;
