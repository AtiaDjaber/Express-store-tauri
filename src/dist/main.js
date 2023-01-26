"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var store_1 = require("./store");
var vuetify_1 = require("./plugins/vuetify");
var vue_shortkey_1 = require("vue-shortkey");
var vue_i18n_1 = require("vue-i18n");
vue_1["default"].use(vue_i18n_1["default"]);
// Vue.config.productionTip = false;
// import Echo from "laravel-echo";
// (window as any).Pusher = require("pusher-js");
vue_1["default"].use(vue_shortkey_1["default"]);
// const token = localStorage.getItem("token");
// console.log(token);
// (window as any).Echo = new Echo({
//   broadcaster: "pusher",
//   key: "websocketkey",
//   // authEndpoint: "http://localhost:8000/broadcasting/auth",
//   // wsHost: "127.0.0.1",
//   // key: process.env.MIX_PUSHER_APP_KEY,
//   cluster: "mt1",
//   wsHost: window.location.hostname,
//   // wsHost: window.location.hostname,
//   encrypted: false,
//   forceTLS: false,
//   wsPort: 6001,
//   wssPort: 6001,
//   disableStats: false,
//   enabledTransports: ["ws", "wss"],
//   // auth: {
//   //   headers: {
//   //     authorization: "Bearer " + token,
//   //   },
//   // },
// });
new vue_1["default"]({
    router: router_1["default"],
    store: store_1["default"],
    vuetify: vuetify_1["default"],
    render: function (h) { return h(App_vue_1["default"]); }
}).$mount("#app");
