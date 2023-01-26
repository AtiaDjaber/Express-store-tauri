import "@fortawesome/fontawesome-free/css/all.css";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "fa" || "mdi",
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
        lighten_font: "#696969",
      },
      dark: {
        background: "black",
        secondary: "#f54c14",
        error: "#e201e6",
        plain: "#121212",
        greyback: "#272727",
        lighten_font: "#ffffff",
      },
    },
  },
  rtl: true,
});
