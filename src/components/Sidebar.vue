<!-- eslint-disable vue/no-unused-vars -->
<template>
  <v-navigation-drawer
    right
    permanent
    app
    v-model="drawer"
    mini-variant
    mini-variant-width="90"
  >
    <lottie-animation
      class="mt-1"
      path="load.json"
      :width="60"
      :height="50"
      :loop="false"
      :speed="0.6"
    />
    <v-list width="72px" flat class="mt-1">
      <v-list-item-group mandatory v-model="selectedItem">
        <v-tooltip
          v-for="(page, index) in pages"
          :key="index"
          left
          color="secondary"
        >
          <template v-slot:activator="{ on }">
            <v-row no-gutters>
              <v-col>
                <div v-if="selectedItem == index" class="div_menu"></div>
              </v-col>
              <v-col cols="11">
                <router-link class="linkCss" :to="page.route">
                  <v-list-item
                    :active-class="selectedItem == index ? 'border' : ''"
                  >
                    <v-list-item-content v-on="on">
                      <v-icon>{{ page.icon }}</v-icon>
                    </v-list-item-content>
                  </v-list-item>
                </router-link>
              </v-col>
            </v-row>
          </template>
          <span>{{ page.title }}</span>
        </v-tooltip>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import loginModule from "@/store/loginModule";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

@Component({ components: { LottieAnimation } })
export default class Sidebar extends Vue {
  selectedItem = 0;

  drawer = null;

  created(): void {
    console.log(this.$route.path);
    this.selectedItem = this.pages.findIndex(
      (e) => e.route == this.$route.path
    );
  }
  pages = [
    {
      title: "نقطة البيع",
      icon: "mdi-home",
      route: "/sale",
    },
    {
      title: "المنتجات",
      icon: "mdi-shape-outline",
      route: "/product",
    },

    {
      title: "زبائن",
      icon: "mdi-account-multiple-outline",
      route: "/client",
    },
    {
      title: "أرشيف المبيعات",
      icon: "mdi-history",
      route: "/history",
    },

    {
      title: "مصاريف",
      icon: "mdi-cash-multiple",
      route: "/expense",
    },
    {
      title: "مخازن",
      icon: "mdi-storefront",
      route: "/depot",
    },
    {
      title: "نقل سلعة",
      icon: "mdi-swap-vertical-circle",
      route: "/export",
    },
    {
      title: "موردين",
      icon: "mdi-account-multiple-outline",
      route: "/fournisseur",
    },
    {
      title: "مشتريات",
      icon: "mdi-cart-variant",
      route: "/purchase",
    },
    {
      title: "إحصائيات",
      icon: "mdi-chart-bar",
      route: "/chart",
    },
    {
      title: "مستخدمين",
      icon: "mdi-security",
      route: "/user",
    },
    {
      title: "صناديق",
      icon: "mdi-cash-register",
      route: "/box",
    },
  ];

  get currentUser(): any {
    return loginModule.getCurrentUser;
  }
}
</script>

<style scoped>
.border {
  background: #f54c14;
  margin-bottom: 4px;
  margin-left: 2px;
  border-radius: 30%;
  height: 55px;
  margin-right: 8px;

  transition-duration: 400ms;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: rgba(0, 0, 0, 0.87);
  background-color: #eeeeee;
  margin: 4px;
  margin-right: 10px;
  border-radius: 50%;
  height: 55px;
  width: 55px;
  transition-duration: 300ms;
}

.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: rgba(0, 0, 0, 0.87);
  background-color: #414141;
  margin: 4px;
  margin-right: 10px;
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
  margin-top: 12px;
  border-radius: 30%;
}
</style>
