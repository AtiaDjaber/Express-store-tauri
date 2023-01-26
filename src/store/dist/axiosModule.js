"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
// import client from "@/classes/client";
var axiosModule = /** @class */ (function () {
    // create single instance from axios
    function axiosModule(baseURL) {
        axiosModule.instance = axios_1["default"].create({
            baseURL: baseURL,
            headers: {
                "Content-type": "application/json"
            }
        });
    }
    // add token to axios instance
    axiosModule.setAxiosToken = function () {
        this.instance.defaults.headers.common["Authorization"] =
            "Bearer " + localStorage.getItem("token");
    };
    Object.defineProperty(axiosModule.prototype, "axios", {
        // get instance axios
        get: function () {
            return this.axios;
        },
        enumerable: false,
        configurable: true
    });
    return axiosModule;
}());
exports["default"] = axiosModule;
