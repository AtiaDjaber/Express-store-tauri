"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var HttpClient = /** @class */ (function () {
    function HttpClient(baseURL) {
        this.instance = axios_1["default"].create({
            baseURL: baseURL,
            headers: {
                "Content-type": "application/json"
            }
        });
        this.instance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
    }
    return HttpClient;
}());
exports["default"] = HttpClient;
