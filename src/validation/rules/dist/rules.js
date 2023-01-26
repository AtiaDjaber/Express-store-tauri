"use strict";
// import { parsePhoneNumber } from "libphonenumber-js";
exports.__esModule = true;
var libphonenumber_js_1 = require("libphonenumber-js");
var Rules = /** @class */ (function () {
    function Rules() {
    }
    Rules.checkPhoneNumberNull = function (v) {
        if (v !== undefined) {
            var number = libphonenumber_js_1.parsePhoneNumber("+213" + v);
            return number !== undefined ? number.isValid() : false;
        }
        else
            return false;
    };
    Rules.checkIsNumberOrNull = function (v0) {
        if (v0 !== undefined) {
            if (isNaN(Number(v0)))
                return false;
            return !isNaN(Number(v0)) || v0 == "";
        }
        return true;
    };
    Rules.checkNumberGTEZero = function (v0) {
        if (v0 !== undefined) {
            if (isNaN(Number(v0)))
                return false;
            return Number(v0) >= 0 || v0 == "";
        }
        return true;
    };
    Rules.NumberRule = function (v) {
        return Rules.checkIsNumberOrNull(v) || "الرجاء إدخال رقم";
    };
    Rules.length10 = function (v) { return v.length == 10 || "الرجاء إدخال 10 أرقام"; };
    Rules.NumberGreaterThanZeroRule = function (v) {
        return Number(v) > 0 || "الرجاء إدخال رقم أكبر من الصفر";
    };
    Rules.NumberGreaterThanEqualZeroRule = function (v) {
        return Rules.checkNumberGTEZero(v) || "الرجاء إدخال رقم أكبر من أو يساوي الصفر";
    };
    Rules.Required = function (v) { return !!v || "حقل إجباري"; };
    Rules.StringRule = function (v) {
        return isNaN(Number(v)) || "الرجاء إدخال حروف فقط ";
    };
    Rules.Phone = function (v) {
        return Rules.checkPhoneNumberNull(v) || "رقم الهاتف خاطئ";
    };
    Rules.From0To100 = function (v) {
        return (0 <= Number(v) && Number(v) <= 100) || "الرجاء إدخال رقم بين 0 و 100";
    };
    return Rules;
}());
exports["default"] = Rules;
