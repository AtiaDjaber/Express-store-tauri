<template>
  <v-app class="app">
    <v-app-bar v-if="isLoggedIn" clipped-left app elevation="1">
      <h3 class="mx-6 text-primary">{{ title }}</h3>
      <div class="mx-6"></div>
      <v-snackbar
        v-for="item in notificationList"
        v-model="item.show"
        :timeout="item.timeout"
        :key="item.show"
        :color="item.color"
        :top="item.y === 'top'"
        :bottom="item.y === 'bottom'"
        :right="item.x === 'right'"
        :left="item.x === 'left'"
        elevation="3"
        multi-line
        :value="true"
      >
        <h3 style="color: white">
          <v-icon>{{ item.icon }}</v-icon>
          {{ item.text }}
        </h3>
        <div style="height: 3px; width: 300px; color: deeppink"></div>
      </v-snackbar>

      <v-spacer></v-spacer>
      <!-- <h3>
        {{ currentUser.box == null ? "غير محدد" : currentUser.box.name }}
        <v-icon class="px-5" large>mdi-cash-register</v-icon>
      </h3> -->
      <v-btn large class="px-5" text color="lighten_font">
        {{ currentUser.box == null ? "غير محدد" : currentUser.box.name }}
        <v-icon class="px-1">mdi-cash-register</v-icon>
      </v-btn>

      <v-divider vertical inset></v-divider>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn large class="mx-5 px-2" icon v-bind="attrs" v-on="on">
            <v-icon class="px-3">mdi-chevron-down</v-icon>العربية
          </v-btn>
        </template>

        <v-list class="px-3">
          <v-list-item @click="() => {}">
            <v-list-item-title>العربية </v-list-item-title>
          </v-list-item>
          <v-list-item @click="() => {}">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn large class="mx-2" icon @click="changeTheme()">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
      <!-- 
      <v-switch
        class="mx-2"
        v-model="$vuetify.theme.dark"
        append-icon="mdi-brightness-6"
        prepend-icon="mdi-brightness-6"
        color="red"
        inset
        value="red"
        hide-details
      ></v-switch> -->
      <v-divider vertical inset></v-divider>

      <router-link class="linkCss" to="/notification">
        <v-btn large class="mx-2" icon>
          <v-icon> mdi-bell-outline </v-icon>
        </v-btn>
      </router-link>
      <v-btn to="/setting" large class="mx-1" icon>
        <v-icon> mdi-cog-outline </v-icon>
      </v-btn>
      <!-- {
      title: "إعدادات",
      icon: "mdi-cog-outline",
      route: "/setting",
    }, -->
      <div class="pa-3 mx-2">
        <user-info></user-info>
      </div>
      <!-- <v-divider vertical inset></v-divider> -->
      <!-- <span class="mx-3">V{{ appVersion }}</span> -->
    </v-app-bar>
    <Sidebar v-if="isLoggedIn"></Sidebar>
    <v-main>
      <v-progress-linear
        id="v-progress-linear"
        v-show="progress > 0 && progress < 100"
        color="deep-orange"
        height="6"
        :value="progress"
        striped
      ></v-progress-linear>

      <router-view />
    </v-main>
    <v-bottom-sheet v-model="sheet" inset>
      <v-sheet class="text-center" height="160px">
        <v-progress-linear
          :value="100"
          class="my-0"
          height="5"
          color="pink"
        ></v-progress-linear>
        <v-btn large class="mt-6" text @click="sheet = false">
          <v-icon color="accent">mdi-close</v-icon>
          <h3 class="accent--text">إغلاق</h3>
        </v-btn>
        <h3 class="my-3">
          <v-chip color="green" text-color="white" class="ma-2">
            <span style="font-size: 1.2rem" class="white--text">{{
              daysAlmsRest
            }}</span>
          </v-chip>

          عدد الأيام المتبقي على تاريخ الزكاة
        </h3>
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>
<!-- style="display: none" -->

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";
import UserInfo from "@/components/UserInfo.vue";
import { RouteMeta } from "vue-router";
import Client from "./views/client/Client.vue";
import snackBarModule from "./store/snackBarModule";
import loginModule from "@/store/loginModule";
import settingModule from "./store/settingModule";
// import { ipcRenderer } from "electron";
import axiosModule from "./store/axiosModule";
// import Echo from "laravel-echo";

@Component({ components: { Sidebar, UserInfo, Client } })
export default class App extends Vue {
  drawer = null;
  progress = 0;
  appVersion = "";

  get isLoggedIn(): boolean {
    return loginModule.isLogin;
  }
  get currentUser(): any {
    return loginModule.getCurrentUser;
  }
  get title(): string {
    return (this.$route.meta as RouteMeta).title;
  }

  get notificationList() {
    return snackBarModule.getNotifications;
  }

  changeTheme() {
    (this as any).$vuetify.theme.dark = !(this as any).$vuetify.theme.dark;
    localStorage.setItem("isDark", "" + (this as any).$vuetify.theme.dark);
  }

  created(): void {
    (this as any).$vuetify.theme.dark =
      (localStorage.getItem("isDark") ?? "false") == "true" ? true : false;

    // ((window as any).Echo as Echo).connect();
    // ((window as any).Echo as Echo)
    //   .channel("testchannel")
    //   .listen(".Test", (e) => {
    //     console.log("t" + e["data"]);
    //   });

    new axiosModule(process.env.VUE_APP_API_URL);
    axiosModule.setAxiosToken();
    settingModule.getSettings();
  }

  get setting() {
    return settingModule.getSetting;
  }

  mounted(): void {
    // ipcRenderer.on("download-progress", (evt, message) => {
    //   this.progress = message;
    // });
    this.changeTitle();
    this.displayAlmsMessage();
  }
  sheet = false;
  daysAlmsRest = 0;
  // display El Zakat message
  displayAlmsMessage(): void {
    var diff = new Date(this.setting.zakat).getTime() - new Date().getTime();
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays >= 0 && diffDays <= 30) {
      this.sheet = true;
      this.daysAlmsRest = diffDays;
    }
    console.log(diffDays);
  }

  changeTitle(): void {
    document.title =
      "Express Store V" + window.require("electron").remote.app.getVersion();
  }
}
</script>
<style scoped>
@import "./assets/app_styles.css";

.app {
  font-family: "Almarai";
  /* background: #ffffff !important; */
  /* old grey #fbfafc */
  /* overflow: auto; */
}

.linkCss {
  text-decoration: none;
  color: inherit;
}
/* .theme--dark.v-tabs-items {
  background-color: transparent !important;
} */
</style>
<style>
.theme--light.v-data-table tbody tr.v-data-table__selected {
  background: #ebe8ea !important;
}
/* ::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: black;
  background-clip: border-box;
  -webkit-background-clip: border-box;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 6px;
} */
html {
  overflow-y: auto;
}

::-webkit-scrollbar-thumb {
  background: #c2c2c2;
  border-radius: 6px;
}

/* .theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
    background: rgb(255, 255, 255);
} */
v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  font-size: 16px !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1.1rem !important;
}
.v-input .v-label {
  font-size: 1.1em;
}
::v-deep .centered-input input {
  text-align: center;
}
.v-input input {
  font-size: 1.1em;
  border-radius: 4px;
}
.v-text-field {
  border-radius: 6px;
  /* color: gray; */
}
.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #f2f2f2;
}
.theme--dark.v-tabs-items {
  background-color: transparent !important;
}
.theme--light.v-tabs-items {
  background-color: transparent !important;
}
.v-dialog dialog-border-radius {
  border-radius: 10px;
}
.v-list-item--dense .v-list-item__title,
.v-list-item--dense .v-list-item__subtitle,
.v-list--dense .v-list-item .v-list-item__title,
.v-list--dense .v-list-item .v-list-item__subtitle {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1rem;
}

.titleCard {
  font-size: 1.1rem;
  word-wrap: break-word;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /* if you change this, make sure to change the fallback line-height and height */
  -webkit-box-orient: vertical;
  line-height: 1em;
  overflow: hidden;

  max-height: 2.4em;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none;
}
.ribbon-1 {
  position: absolute;
  inset: 0 auto auto 0;
  background: #ea2167;
  transform-origin: 100% 0;
  transform: translate(-29.3%) rotate(-45deg);
  box-shadow: 0 0 0 999px #ea2167;
  clip-path: inset(0 -100%);
  opacity: 0.8;
}
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.ribbon-2 {
  --f: 10px; /* control the folded part*/
  --r: 15px; /* control the ribbon shape */
  --t: 10px; /* the top offset */

  position: absolute;
  inset: var(--t) calc(-1 * var(--f)) auto auto;
  padding: 0 10px var(--f) calc(10px + var(--r));
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--f)),
    calc(100% - var(--f)) 100%,
    calc(100% - var(--f)) calc(100% - var(--f)),
    0 calc(100% - var(--f)),
    var(--r) calc(50% - var(--f) / 2)
  );
  background: #bd1550;
  box-shadow: 0 calc(-1 * var(--f)) 0 inset #0005;
}

.ribbon {
  position: absolute;
  display: block;
  top: -4px;
  right: -4px;
  width: 110px;
  height: 60px;
  overflow: hidden;
}

.ribbon .label {
  position: relative;
  display: block;
  left: -10px;
  top: 23px;
  width: 158px;
  padding: 4px 0;
  font-size: 15px;
  text-align: center;
  color: #fff;
  background-color: #e85e68;
  -webkit-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  -ms-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  -webkit-transform: rotate(45deg) translate3d(0, 0, 0);
  -moz-transform: rotate(45deg) translate3d(0, 0, 0);
  -ms-transform: rotate(45deg) translate3d(0, 0, 0);
  transform: rotate(45deg) translate3d(0, 0, 0);
}

.label:before,
.label:after {
  content: "";
  position: absolute;
  bottom: -4px;
  border-top: 4px solid #a71c26;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
}

.label:before {
  left: 0;
}

.label:after {
  right: 0;
}

.theme--light.v-data-table tbody tr.v-data-table__selected {
  background: #ffeafc !important;
}
</style>
