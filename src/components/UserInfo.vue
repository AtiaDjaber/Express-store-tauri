<template>
  <v-row>
    <span style="font-size: 20px" class="mt-2 mx-2"> {{ currentUser.name }}</span>
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
          <v-avatar color="blue darken-2" size="40">
          <span class="white--text">{{
              currentUser.name.toUpperCase().charAt(0)
            }}
          </span>
          </v-avatar>
        </v-btn>
      </template>
      <v-container class="white" fluid fill-height>
        <v-row
        >
          <v-col class="d-flex justify-center">
            <v-avatar color="blue darken-2" size="80">
            <span class="white--text">{{
                currentUser.name.toUpperCase().charAt(0)
              }}</span>
            </v-avatar>
          </v-col
          >
        </v-row
        >
        <v-row no-gutters
        >
          <v-col
          ><h4 class="d-block text-center font-weight-medium mt-2">
            {{ currentUser.name }}
          </h4></v-col
          >
        </v-row>
        <v-row>
          <v-col>
            <v-divider/>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-3"
        >
          <v-col class="d-flex justify-center"
          >
            <v-btn
                @click="logout()"
                rounded
                small
                color="grey darken-2"
                class="font-weight-regular text-capitalize btn-h-red"
                outlined
                text
            >تسجيل الخروج
            </v-btn
            >
          </v-col
          >
        </v-row
        >
      </v-container>
    </v-menu>
  </v-row>

</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import loginModule from "@/store/loginModule";

@Component({components: {}})
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
