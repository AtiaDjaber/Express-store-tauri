import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueKey from "vue-shortkey";
import VueI18n from "vue-i18n";
import { locales } from "./locales/locale";
import { formatCurrency } from "./helper/global_function";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "ar",
  fallbackLocale: "ar",
  messages: locales,
});

Vue.use(PerfectScrollbar);

const currencyPlugin = {
  install(Vue, options) {
    Vue.prototype.formatCurrency = formatCurrency;
  },
};
Vue.use(currencyPlugin);

// Inject Global Function Using Mixin
// Vue.mixin({
//   methods: {
//     globalHelper: function () {
//       alert("Hello world");
//     },
//   },
// });

// Vue.config.productionTip = false;
// import Echo from "laravel-echo";
// (window as any).Pusher = require("pusher-js");
Vue.use(VueKey);

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
new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
