"use strict";
exports.__esModule = true;
var snackBarModule_1 = require("@/store/snackBarModule");
var axiosModule_1 = require("@/store/axiosModule");
var LoginService = /** @class */ (function () {
    function LoginService() {
    }
    LoginService.prototype.login = function (user) {
        return axiosModule_1["default"].instance.post("api/login", user).then(function (x) {
            if (x.status == 200) {
                // axios.defaults.headers.common["Authorization"] = x.data["token"];
                // axiosModule.instance.defaults.headers.common["Authorization"] =
                //   "Bearer " + x.data["token"];
                localStorage.setItem("token", x.data["token"]);
                return x.data["data"];
            }
            else {
                snackBarModule_1["default"].setSnackbar({
                    text: "معلومات الدخول خاطئة",
                    color: "error",
                    timeout: 2000,
                    show: true,
                    icon: "mdi-alert-outline",
                    x: "right",
                    y: "top"
                });
                return null;
            }
        });
    };
    return LoginService;
}());
exports["default"] = LoginService;
