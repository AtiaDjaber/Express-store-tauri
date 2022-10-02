<template>
  <v-app class="app">
    <v-app-bar v-if="isLoggedIn" clipped-left app color="white" elevation="1">
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
      <!--      <div>-->
      <!--        <router-link class="linkCss" to="/notification">-->
      <!--          <v-icon color="red">mdi-bell-ring</v-icon>-->
      <!--        </router-link>-->
      <!--        <v-divider class="divi" dark></v-divider>-->
      <!--      </div>-->
      <div class="pa-3">
        <user-info></user-info>
      </div>
    </v-app-bar>
    <Sidebar v-if="isLoggedIn"></Sidebar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";
import UserInfo from "@/components/UserInfo.vue";
import { RouteMeta } from "vue-router";
import Client from "./views/client/Client.vue";
import snackBarModule from "./store/snackBarModule";
import loginModule from "@/store/loginModule";
import settingModule from "./store/settingModule";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
@Component({ components: { Sidebar, UserInfo, Client } })
export default class App extends Vue {
  drawer = null;

  get isLoggedIn() {
    return loginModule.isLogin;
  }
  get currentUser() {
    return loginModule.getCurrentUser;
  }
  get title() {
    let title = (this.$route.meta as RouteMeta).title;
    return title;
  }

  get notificationList() {
    return snackBarModule.getNotifications;
  }

  created() {
    // settingModule.getSettings();
  }
  async checkUpdate() {
    try {
      const { shouldUpdate, manifest } = await checkUpdate();
      debugger;
      if (shouldUpdate) {
        // display dialog
        await installUpdate();
        // install complete, restart app
        await relaunch();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
<style scoped>
@import "./assets/app_styles.css";

.app {
  font-family: "Tajwal";
  background-color: #fbfbff;
}

/* .divi {
  color: #f6f7ff;
  divider-inset-margin: 2px;
} */
.linkCss {
  text-decoration: none;
  color: inherit;
}
</style>
<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c2c2c2;
  border-radius: 6px;
}

v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  font-size: 16px !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1.1rem !important;
}
</style>
