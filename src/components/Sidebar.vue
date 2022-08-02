<!-- eslint-disable vue/no-unused-vars -->
<template>
  <v-navigation-drawer
    right
    permanent
    app
    v-model="drawer"
    color="white"
    mini-variant
    mini-variant-width="90"
  >
    <lottie-animation
      path="load.json"
      :width="60"
      :height="50"
      :loop="false"
      :speed="0.6"
    />
    <v-list width="72px" flat class="mt-1">
      <v-list-item-group mandatory v-model="selectedItem">
        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 0" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item active-class="border">
                  <router-link class="linkCss" to="/sale">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-home</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>الرئيسية</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 1" class="div_menu"></div>
              </v-col>
              <v-col> </v-col>
              <v-col cols="11">
                <v-list-item active-class="border">
                  <router-link class="linkCss" to="/export">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-swap-vertical-circle</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>نقل سلعة</span>
        </v-tooltip>
        <!--TODO Add permission ui-->
        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 2" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.sale"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/product">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-shape-outline</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>منتجات</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 3" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.depot"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/depot">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-storefront</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>مخازن</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 4" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item active-class="border">
                  <router-link class="linkCss" to="/history">
                    <v-list-item-content v-on="on">
                      <v-icon>fas fa-history</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>أرشيف المبيعات</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 5" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item :disabled="true" active-class="border">
                  <router-link disabled="true" class="linkCss" to="/client">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>زبائن</span>
        </v-tooltip>
        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 6" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.purchase"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/purchase">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-cart-variant</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>مشتريات</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 7" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.fournisseur"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/fournisseur">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>موردين</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 8" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.chart"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/chart">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-chart-bar</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>إحصائيات</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 9" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.expense"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/expense">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-cash-multiple</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>المصاريف</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 10" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item
                  :disabled="!currentUser.user"
                  active-class="border"
                >
                  <router-link class="linkCss" to="/user">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-account-outline</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>مستخدمين</span>
        </v-tooltip>

        <v-tooltip left color="black">
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == 11" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <v-list-item active-class="border">
                  <router-link class="linkCss" to="/setting">
                    <v-list-item-content v-on="on">
                      <v-icon>mdi-cog-outline</v-icon>
                    </v-list-item-content>
                  </router-link>
                </v-list-item>
              </v-col>
            </v-row>
          </template>
          <span>إعدادات</span>
        </v-tooltip>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import loginModule from "@/store/loginModule";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import { RouteMeta } from "vue-router";

@Component({ components: { LottieAnimation } })
export default class Sidebar extends Vue {
  selectedItem = 0;

  drawer = null;

  get currentUser() {
    return loginModule.getCurrentUser;
  }
}
</script>

<style scoped>
.border {
  background: #f54c14;
  margin: 6px;
  border-radius: 30%;
  height: 55px;
  transition-duration: 400ms;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: rgba(0, 0, 0, 0.87);
  background-color: #eeeeee;
  margin: 6px;
  border-radius: 50%;
  height: 55px;
  width: 55px;
  transition-duration: 400ms;
}

.v-list-item-group .v-list-item--active {
  color: white !important;
}

.theme--light.v-list-item--active .v-list-item__subtitle,
.theme--light.v-list-item .v-list-item__action-text {
  color: white !important;
}

.linkCss {
  text-decoration: none;
  color: inherit;
}

.div_menu {
  width: 5px;
  height: 30px;
  background-color: #f54c14;
  margin-top: 20px;
  border-radius: 30%;
}
</style>
