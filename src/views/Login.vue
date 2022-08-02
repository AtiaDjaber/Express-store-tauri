<template>
  <v-container align="center" fluid fill-height>
    <v-row class="justify-center">
      <v-col cols="6">
        <!-- <lottie-animation
            path="load.json"
            :width="370"
            :height="370"
            :loop="false"
            :speed="0.6"
        /> -->
        <!--        :loop="true"-->
        <!--        :autoPlay="true"-->
        <!--        :loopDelayMin="2.5"-->
        <!--        :loopDelayMax="5"-->
        <!--        :speed="1"-->
        <!--        :width="256"-->
        <!--        :height="256"-->
        <!--                <v-img-->
        <!--                  contain-->
        <!--                  height="400px"-->
        <!--                  width="400px"-->
        <!--                  src="@/assets/lloan.gif"-->
        <!--                ></v-img>-->
      </v-col>
      <div style="width: 450px" id="facture">
        <v-form ref="form" lazy-validation @submit.prevent="onClick">
          <v-card elevation="3" class="py-12">
            <v-card-title class="justify-center">
              <!-- <span class="mt-6 text-h4">SMART SCHOOL</span> -->
              <!--              <v-img-->
              <!--                contain-->
              <!--                height="60px"-->
              <!--                width="500px"-->
              <!--                src="@/assets/name.png"-->
              <!--              ></v-img>-->
              <h2 style="color: #275aa5">LOGIN PAGE</h2>
            </v-card-title>
            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="البريد الإلكتروني"
                  placeholder="أدخل البريد الإلكتروني"
                  v-model="user.email"
                  prepend-inner-icon="fa-user"
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
                  prepend-inner-icon="fa-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="user.password"
                  outlined
                  class="mb-n6"
                  required
                  @keyup.enter="onClick"
                ></v-text-field>
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
</template>
<script lang="ts">
import User from "@/classes/user";
import loginModule from "@/store/loginModule";
import { Component, Ref, Vue } from "vue-property-decorator";
import snackBarModule from "@/store/snackBarModule";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import PrintImage from "@/print/print_image";

@Component({ components: { LottieAnimation } })
export default class Login extends Vue {
  @Ref() form: any;
  user: User = new User();
  showPassword = false;
  message = "";
  opacity = "99";

  created() {
    this.user.email = "atia@gmail.com";
    this.user.password = "atiadjaber19931993";
  }

  print() {
    PrintImage.print(document.getElementById("facture"));
  }

  onClick() {
    this.print();
    if (this.form.validate()) {
      loginModule
        .login(this.user)
        .then((x) => {
          if (x) {
            (this as any).$router.push("/").catch(() => undefined);
          }
        })
        .catch((error) => {
          snackBarModule.setSnackbar({
            text: error,
            color: "error",
            timeout: 2000,
            show: true,
            icon: "times",
            x: "right",
            y: "top",
          });
        });
    }
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
