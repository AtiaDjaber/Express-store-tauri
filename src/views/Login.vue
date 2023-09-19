<template>
  <div>
    <v-toolbar color="plain" elevation="0">
      <v-row justify="space-between" class="px-6">
        <div>
          <v-dialog v-model="dialog" scrollable max-width="700">
            <template v-slot:activator="{ on, attrs }">
              <div class="mr-2" v-bind="attrs" v-on="on">
                <v-btn text color="primary" large icon elevation="1">
                  <v-icon>mdi-connection</v-icon>
                </v-btn>
              </div>
            </template>
            <v-card v-if="dialog" color="plain">
              <v-card-title class="primary--text">
                <span> تغيير عنوان الاتصال</span>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation v-model="valid">
                    <v-row class="mt-6">
                      <v-col>
                        <v-text-field
                          color="blue darken-2"
                          label="عنوان الاتصال"
                          placeholder="عنوان الاتصال"
                          hint="عنوان الاتصال"
                          required
                          flat
                          solo
                          clearable
                          v-model="setting.host"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-divider></v-divider>

              <v-card-actions class="justify-end">
                <v-btn
                  outlined
                  large
                  color="red darken-1"
                  @click="dialog = false"
                  >إلغاء</v-btn
                >
                <v-btn
                  large
                  class="mx-6"
                  color="green darken-1"
                  @click="updateSetting()"
                  >حفظ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-spacer></v-spacer>
        <v-col>
          <v-row justify="end">
            <h2 class="primary--text mt-2">Express Store</h2>
            <v-img
              class="ma-2"
              width="40"
              height="36"
              max-height="36"
              max-width="40"
              :src="require('@/assets/logo.png')"
            >
            </v-img>
          </v-row>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-row justify="center" align-content="center" class="mt-16">
      <v-col align-self="center">
        <v-container align="center" fluid fill-height>
          <v-row class="justify-center">
            <v-col cols="6">
              <lottie-animation
                class="mt-n16"
                path="load1.json"
                :width="570"
                :height="570"
                :loop="false"
                :speed="0.7"
                @AnimControl="setAnimController"
              />
            </v-col>
            <div style="width: 450px" id="facture">
              <v-form ref="form" lazy-validation @submit.prevent="onClick">
                <v-card elevation="3" class="py-12">
                  <v-card-title class="justify-center my-3">
                    <h2 class="secondary--text">تسجيل الدخول</h2>
                  </v-card-title>
                  <v-card-text>
                    <v-col cols="12">
                      <!-- <v-autocomplete
                        :items="listUsers"
                        label="البريد الإلكتروني"
                        outlined
                        v-model="user.email"
                        prepend-inner-icon="fa-user"
                        placeholder="أختر البريد الإلكتروني"
                        required
                        item-value="email"
                        item-text="email"
                      ></v-autocomplete> -->
                      <!-- <v-select
                        :items="items"
                        label="البريد الإلكتروني"
                        dense
                        v-model="user.email"
                        prepend-inner-icon="fa-user"
                        placeholder="أختر البريد الإلكتروني"
                        required
                        outlined
                      ></v-select> -->
                      <v-text-field
                        label="البريد الإلكتروني او اسم المستخدم"
                        placeholder="أدخل البريد الإلكتروني او اسم المستخدم"
                        v-model="user.email"
                        prepend-inner-icon="mdi-account-outline"
                        outlined
                        required
                        class="mt-10"
                        @keyup.enter="onClick"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="كلمة المرور"
                        placeholder="أدخل كلمة المرور"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-icon="
                          showPassword
                            ? 'mdi-eye-outline'
                            : 'mdi-eye-off-outline'
                        "
                        @click:append="showPassword = !showPassword"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="user.password"
                        outlined
                        class="mb-n6"
                        required
                        @keyup.enter="onClick"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="setting.remember"
                        @change="updateSetting(false)"
                        label="تذكرني لاحقا"
                        color="primary"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-col cols="12">
                      <v-btn
                        height="50"
                        block
                        style="font-size: 20px"
                        @click="onClick"
                        color="primary"
                      >
                        دخول
                      </v-btn>
                    </v-col>
                  </v-card-actions>
                </v-card>
              </v-form>
            </div>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import User from "@/classes/user";
import loginModule from "@/store/loginModule";
import { Component, Ref, Vue } from "vue-property-decorator";
import snackBarModule from "@/store/snackBarModule";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import settingModule from "@/store/settingModule";
import axiosModule from "@/store/axiosModule";
import userApi from "@/api/userApi";

@Component({ components: { LottieAnimation } })
export default class Login extends Vue {
  @Ref() form: any;
  user: User = new User();
  showPassword = false;
  message = "";
  dialog = false;
  valid = true;
  controllerAnimation;

  get setting() {
    return settingModule.getSetting;
  }
  created() {
    this.getListUsers();
    // this.user.email = "atia@gmail.com";
    // this.user.password = "adminadmin";
  }

  updateSetting(showToast = true): void {
    console.log("setting changed");
    settingModule.setSetting(this.setting);
    // const printCmd = exec(
    //   "(Get-Content  expressStoreBackend/.rr.yaml) -replace '  address: 127.0.0.1:8000','  address: :8002' | Out-File -encoding ASCII expressStoreBackend/.rr.yaml"
    // );
    // printCmd.stdout.on("data", (data: any) => console.log(`data: ${data}`));
    if (showToast) {
      snackBarModule.setSnackbar({
        text: "تمت عملية التعديل بنجاح",
        color: "success",
        timeout: 1000,
        show: true,
        icon: "mdi-checkbox-marked-circle-outline",
        x: "right",
        y: "top",
      });
    }
    new axiosModule(this.setting.host);
    this.dialog = false;
  }

  setAnimController(controller): void {
    setTimeout(() => {
      controller.pause();
    }, 6000);
  }
  onClick(): void {
    loginModule
      .login(this.user)
      .then((x) => {
        if (x) {
          console.log(x);
          snackBarModule.setSnackbar({
            text: "تمت عملية تسجيل الدخول بنجاح",
            color: "success",
            timeout: 2000,
            show: true,
            icon: "mdi-checkbox-marked-circle-outline",
            x: "right",
            y: "top",
          });
          (this as any).$router.push("/").catch(() => undefined);
        } else {
          snackBarModule.setSnackbar({
            text: "معلومات الدخول خاطئة",
            color: "error",
            timeout: 2000,
            show: true,
            icon: "mdi-alert-outline",
            x: "right",
            y: "top",
          });
        }
      })
      .catch((error) => {
        console.log(error + " mu");
        snackBarModule.setSnackbar({
          text: error,
          color: "error",
          timeout: 2000,
          show: true,
          icon: "times",
          x: "right",
          y: "bottom",
        });
      });
  }
  listUsers = [] as User[];

  userApi = new userApi();
  getListUsers(): void {
    this.userApi
      .getAllUser()
      .then((response) => {
        this.listUsers = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>
<style scoped>
.floating {
  animation-name: floating;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  margin-left: 30px;
  margin-top: 0px;
}

@keyframes floating {
  0% {
    transform: translate(0, 0px);
  }
  50% {
    transform: translate(0px, 35px);
  }
  100% {
    transform: translate(0, -0px);
  }
}

.title {
  font-family: "AlienMoon";
  background-color: #f6f7ff;
}
</style>
