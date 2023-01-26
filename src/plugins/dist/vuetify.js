"use strict";
exports.__esModule = true;
require("@fortawesome/fontawesome-free/css/all.css");
require("@mdi/font/css/materialdesignicons.css"); // Ensure you are using css-loader
var vue_1 = require("vue");
var framework_1 = require("vuetify/lib/framework");
vue_1["default"].use(framework_1["default"]);
exports["default"] = new framework_1["default"]({
    icons: {
        iconfont: "fa" || "mdi"
    },
    theme: {
        dark: true,
        themes: {
            light: {
                primary: "#875A7B",
                secondary: "#f54c14",
                accent: "#f54c14",
                error: "#e201e6",
                plain: "white",
                background: "white",
                greyback: "#f5f5f5",
                lighten_font: "#696969"
            },
            dark: {
                background: "black",
                secondary: "#f54c14",
                error: "#e201e6",
                plain: "#121212",
                greyback: "#272727",
                lighten_font: "#ffffff"
            }
        }
    },
    rtl: true
});
