<template>
  <v-app class="app">
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
    <v-app-bar
      v-if="isLoggedIn"
      :clipped-left="$i18n.locale == 'ar'"
      app
      elevation="1"
    >
      <v-img
        width="35"
        height="30"
        max-height="30"
        max-width="35"
        :src="require('@/assets/logo.png')"
      >
      </v-img>

      <h3 class="mx-6 text-primary">{{ $t(title) }}</h3>
      <div class="mx-6"></div>

      <v-spacer></v-spacer>
      <!-- <h3>
        {{ currentUser.box == null ? "غير محدد" : currentUser.box.name }}
        <v-icon class="px-5" large>mdi-cash-register</v-icon>
      </h3> -->
      <v-btn large class="px-5" text color="lighten_font">
        {{ currentUser.box == null ? "غير محدد" : currentUser.box.name }}
        <v-icon class="px-1">mdi-cash-register</v-icon>
      </v-btn>

      <v-divider vertical inset class="me-2"></v-divider>
      <locale-component></locale-component>

      <v-divider vertical inset class="ms-2"></v-divider>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" large class="mx-2" icon @click="screenMode">
            <v-icon>
              {{ frame ? "mdi-fullscreen" : "mdi-fullscreen-exit" }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ !frame ? "تصغير" : "ملء الشاشة" }}</span>
      </v-tooltip>

      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" large class="mx-2" icon @click="changeTheme()">
            <v-icon>mdi-brightness-6</v-icon>
          </v-btn>
        </template>
        <span>تغيير المظهر</span>
      </v-tooltip>
      <router-link class="linkCss" to="/notification">
        <v-tooltip bottom color="secondary">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" large class="mx-2" icon>
              <v-icon> mdi-bell-outline </v-icon>
            </v-btn>
          </template>
          <span>الإشعارات</span>
        </v-tooltip>
      </router-link>

      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            :loading="saveDB"
            v-on="on"
            @click="backup"
            large
            class="mx-1"
            icon
          >
            <v-icon> mdi-database-settings-outline </v-icon>
          </v-btn>
        </template>
        <span> حفظ نسخة احتياطية من قاعدة البيانات </span>
      </v-tooltip>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="checkForUpdate" large class="mx-1" icon>
            <v-icon> mdi-update </v-icon>
          </v-btn>
        </template>
        <span>التحقق من وجود تحديثات</span>
      </v-tooltip>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            :loading="restarting"
            v-on="on"
            @click="restartServer"
            large
            class="mx-1"
            icon
          >
            <v-icon> mdi-server </v-icon>
          </v-btn>
        </template>
        <span>إعادة تشغيل السرفر</span>
      </v-tooltip>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" to="/setting" large class="mx-1" icon>
            <v-icon> mdi-cog-outline </v-icon>
          </v-btn>
        </template>
        <span>الإعدادات</span>
      </v-tooltip>
      <div class="pa-3 mx-2">
        <user-info></user-info>
      </div>
    </v-app-bar>
    <Sidebar v-if="isLoggedIn"></Sidebar>
    <v-main>
      <v-progress-linear
        v-show="progress > 0 && progress < 100"
        color="deep-orange"
        height="6"
        :value="progress"
        striped
      ></v-progress-linear>
      <!-- <perfect-scrollbar> -->
      <router-view />
      <!-- </perfect-scrollbar> -->
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
    <v-overlay :value="appMessage">
      <v-row justify="center">
        <v-progress-circular
          indeterminate
          color="secondary"
          size="64"
        ></v-progress-circular>
      </v-row>
      <v-row justify="center" class="mt-6">
        <h3 class="mt-3">{{ appMessage }}</h3>
      </v-row>
    </v-overlay>
    <!-- <v-btn @click="print"></v-btn>
    <div id="pdf" style="font-family: amiri" hidden>
      <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="2">
              <table>
                <tr>
                  <td class="title">
                    <img
                      :src="setting.logo"
                      style="
                        width: 100%;
                        max-width: 200px;
                        max-height: 200px;
                        margin-top: -30px;
                      "
                    />
                  </td>

                  <td>
                    Invoice #: 123<br />
                    التاريخ: January 1, 2023<br />
                    Due: February 1, 2023
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <hr />
          <tr class="information">
            <td colspan="2">
              <table>
                <tr>
                  <td>
                    Sparksuite, Inc.<br />
                    12345 Sunny Road<br />
                    Sunnyville, CA 12345
                  </td>

                  <td>
                    Acme Corp.<br />
                    John Doe<br />
                    john@example.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="heading">
            <td>Payment Method</td>

            <td>Check #</td>
          </tr>

          <tr class="details">
            <td>Check</td>

            <td>1000</td>
          </tr>

          <tr class="heading">
            <td>الصنف</td>
            <td>الكمية</td>
            <td>السعر</td>
            <td>الإجمالي</td>
          </tr>

          <tr class="item">
            <td>Website design</td>
            <td>2</td>
            <td>150.00</td>

            <td>$300.00</td>
          </tr>

          <tr class="item">
            <td>صابون</td>
            <td>2</td>
            <td>150.00</td>
            <td>$75.00</td>
          </tr>
          <tr class="item">
            <td>صابون</td>
            <td>2</td>
            <td>60.00</td>
            <td>$120.00</td>
          </tr>

          <tr class="item last">
            <td>Domain name (1 year)</td>

            <td>$10.00</td>
          </tr>

          <tr class="total">
            <td></td>

            <td>Total: $385.00</td>
          </tr>
        </table>
      </div>
    </div> -->
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
// import { ipcRenderer } from "electron";
import axiosModule from "./store/axiosModule";
import LocaleComponent from "./components/LocaleComponent.vue";
// import Echo from "laravel-echo";
// import { execFile } from "child_process";

import { getPid } from "./helper/global_function";
import { createBackup } from "./service/db_manager";
import { getHardDiskSerialNumber } from "./helper/helper_functions";
import PrintImage from "./print/print_image";
@Component({ components: { Sidebar, UserInfo, Client, LocaleComponent } })
export default class App extends Vue {
  drawer = null;
  progress = 0;
  appVersion = "";
  restarting = false;
  saveDB = false;

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
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    localStorage.setItem("isDark", "" + this.$vuetify.theme.dark);
  }

  async backup(): Promise<void> {
    this.saveDB = true;

    await createBackup();
    this.saveDB = false;
  }
  created(): void {
    this.$vuetify.theme.dark =
      (localStorage.getItem("isDark") ?? "false") == "true" ? true : false;

    // ((window as any).Echo as Echo).connect();
    // ((window as any).Echo as Echo)
    //   .channel("testchannel")
    //   .listen(".Test", (e) => {
    //     console.log("t" + e["data"]);
    //   });
    settingModule.getSettings();
    this.isUserRemember();
    new axiosModule(this.setting.host);

    axiosModule.setAxiosToken();
  }

  isUserRemember() {
    if (!(this.setting.remember ?? true)) {
      loginModule.logout();
      (this as any).$router.push("/login");
    }
  }

  get setting() {
    return settingModule.getSetting;
  }

  appMessage = "";

  print() {
    // PrintImage.testPdf(this.setting);
  }

  frame = true;
  screenMode(): void {
    // ipcRenderer.send("frame", "_");
    this.frame = !this.frame;
  }
  mounted(): void {
    // getHardDiskSerialNumber();
    // ipcRenderer.on("download-progress", (evt, message) => {
    //   this.progress = message;
    // });

    // ipcRenderer.on("closing-app", (evt, message) => {
    //   this.appMessage = message;
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

  checkForUpdate(): void {
    console.log("Render");
    // ipcRenderer.send("checkUpdate", "_");
  }

  restartServer(restart = true): void {
    this.restarting = true;
    getPid()
      .then(function (pid) {
        // if (pid) {
        //   process.kill(pid, "SIGKILL");
        //   if (restart) {
        //     execFile("start.bat", (error, stdout, stderr) => {
        //       console.log(error);
        //     });
        //   }
        // } else {
        //   execFile("start.bat", (error, stdout, stderr) => {
        //     console.log(error);
        //   });
        // }
        this.restarting = false;
      })
      .catch((e) => {
        this.restarting = false;
      });
  }
}
</script>
<style scoped>
@import "./assets/app_styles.css";

.app {
  font-family: "Almarai";
  /* direction: rtl; */

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

.ps {
  height: 100vh;
}
::-webkit-scrollbar {
  width: 14px;
}

html {
  overflow-y: auto;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(126, 126, 126);
  background-clip: border-box;
  -webkit-background-clip: border-box;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c2c2c2;
  border-radius: 6px;
}

.v-date-picker-table .v-btn {
  font-size: 14px !important;
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

.v-sheet.v-card {
  border-radius: 8px;
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

.title_input {
  font-size: 1rem;
  color: var(--primar);
}
</style>
<style>
.invoice-box {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: "amiri";
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.invoice-box.rtl {
  direction: rtl;
  font-family: "amiri";
}

.invoice-box.rtl table {
  text-align: right;
}

.invoice-box.rtl table tr td:nth-child(2) {
  text-align: left;
}
</style>
