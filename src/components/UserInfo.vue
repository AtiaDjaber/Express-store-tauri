<template>
  <v-row>
    <!-- <span style="font-size: 20px" class="mt-2 mx-2"> {{ currentUser.name }}</span> -->
    <v-menu
      bottom
      open-on-hover
      origin="top left"
      transition="scale-transition"
      class="mt-3"
      max-width="350"
      :close-on-content-click="false"
      offset-y="offset-y"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-badge
            bordered
            bottom
            color="green accent-4"
            dot
            offset-x="10"
            offset-y="10"
          >
            <v-avatar size="45">
              <v-img :src="require('@/assets/avatar-1.png')"></v-img>
            </v-avatar>
          </v-badge>
          <!-- <v-avatar color="blue darken-2" size="40">
            <span class="white--text"
              >{{ currentUser.name.toUpperCase().charAt(0) }}
            </span>
          </v-avatar> -->
        </v-btn>
      </template>
      <v-container class="plain" fluid fill-height>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-badge
              bordered
              bottom
              color="green accent-4"
              dot
              offset-x="12"
              offset-y="12"
            >
              <v-avatar size="60">
                <v-img :src="require('@/assets/avatar-1.png')"></v-img>
              </v-avatar>
            </v-badge>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            ><h3 class="d-block text-center font-weight-medium mt-2">
              {{ currentUser.name }}
            </h3></v-col
          >
        </v-row>
        <v-row no-gutters>
          <v-col
            ><span class="d-block text-center font-weight-medium mt-2">
              {{ currentUser.email }}
            </span></v-col
          >
        </v-row>
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row no-gutters class="my-3">
          <v-col class="d-flex justify-center">
            <v-btn
              @click="logout()"
              rounded
              class="text-capitalize btn-h-red"
              outlined
              text
              >تسجيل الخروج
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-menu>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import loginModule from "@/store/loginModule";

@Component({ components: {} })
export default class UserInfo extends Vue {
  get currentUser() {
    return loginModule.getCurrentUser;
  }

  logout() {
    loginModule.logout();
    (this as any).$router.push("/login");
  }
}
</script>

<style></style>
