<!-- eslint-disable vue/no-unused-vars -->
<template>
  <v-navigation-drawer
    :right="$i18n.locale == 'ar'"
    permanent
    app
    v-model="drawer"
    mini-variant
    mini-variant-width="90"
  >
    <!-- <lottie-animation
      class="mt-1"
      path="load1.json"
      :width="60"
      :height="50"
      :loop="false"
      :speed="0.6"
    /> -->
    <perfect-scrollbar>
      <v-list width="72px" flat class="mt-1">
        <v-list-item-group mandatory v-model="selectedItem">
          <v-tooltip
            v-for="(page, index) in pages"
            :key="index"
            :left="$i18n.locale == 'ar'"
            :right="$i18n.locale != 'ar'"
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
                      :active-class="
                        selectedItem == index
                          ? $i18n.locale == 'ar'
                            ? 'borderAr'
                            : 'borderEn'
                          : ''
                      "
                    >
                      <v-list-item-content v-on="on">
                        <v-icon>{{ page.icon }}</v-icon>
                      </v-list-item-content>
                    </v-list-item>
                  </router-link>
                </v-col>
              </v-row>
            </template>
            <span>{{ $t(page.title) }}</span>
          </v-tooltip>
        </v-list-item-group>
      </v-list>
    </perfect-scrollbar>
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
      title: "point_vente",
      icon: "mdi-home",
      route: "/sale",
    },
    {
      title: "produites",
      icon: "mdi-shape-outline",
      route: "/product",
    },

    {
      title: "clients",
      icon: "mdi-account-multiple-outline",
      route: "/client",
    },
    {
      title: "archives_ventes",
      icon: "mdi-history",
      route: "/history",
    },

    {
      title: "depenses",
      icon: "mdi-cash-multiple",
      route: "/expense",
    },
    {
      title: "magasins",
      icon: "mdi-storefront",
      route: "/depot",
    },
    {
      title: "conversion_produits",
      icon: "mdi-swap-vertical-circle",
      route: "/export",
    },
    {
      title: "fournisseurs",
      icon: "mdi-account-multiple-outline",
      route: "/fournisseur",
    },

    {
      title: "achats",
      icon: "mdi-cart-variant",
      route: "/purchase",
    },
    {
      title: "purchase_order",
      icon: "mdi-playlist-edit",
      route: "/add_command",
    },
    {
      title: "statistiques",
      icon: "mdi-chart-bar",
      route: "/chart",
    },
    {
      title: "utilisateurs",
      icon: "mdi-security",
      route: "/user",
    },
    {
      title: "boites",
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
/* .scroll-list {
  overflow-y: hidden;
  height: 600px; 
  transition: overflow-y 0.2s ease-in-out; 
}

.scroll-list:hover {
  overflow-y: auto; 
} */
.borderEn {
  background: #f54c14;
  margin-bottom: 4px;
  margin-top: 2px;
  border-radius: 30%;
  margin-left: 10px;

  height: 55px;
  transition-duration: 400ms;
}
.borderAr {
  background: #f54c14;
  margin-bottom: 4px;
  margin-top: 2px;
  border-radius: 30%;
  margin-right: 10px;
  height: 55px;
  transition-duration: 400ms;
}

.theme--light.v-list-item:not(.v-list-item--active):not(
    .v-list-item--disabled
  ) {
  color: rgba(0, 0, 0, 0.87);
  background-color: #eeeeee;
  margin: 4px;
  margin-inline: 10px;
  border-radius: 50%;
  height: 55px;
  width: 55px;
  transition-duration: 300ms;
}

.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: rgba(0, 0, 0, 0.87);
  background-color: #414141;
  margin: 4px;
  margin-inline: 10px;
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
