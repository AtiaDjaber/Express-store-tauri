import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'fa' || 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: '#875A7B',
                secondary: '#0aed45',
                accent: '#e1dd07',
                error: '#e201e6',
            },
            dark: {
                background: "#EEEEEE",
            }
        }
    },
    rtl:true,
});
