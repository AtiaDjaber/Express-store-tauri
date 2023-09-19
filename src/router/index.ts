import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SaleView from "@/views/sale/SaleView.vue";
import LoginView from "@/views/Login.vue";
import StockTabs from "@/views/stock/StockTabs.vue";
import UserView from "@/views/user/UserView.vue";
import exportImportView from "@/views/export/exportImportView.vue";
import PurchaseDetail from "@/views/purchase/PurchaseDetail.vue";
import DepotMain from "@/views/depot/DepotMain.vue";
import ChartView from "@/views/chart/ChartView.vue";
import Setting from "@/views/setting/Setting.vue";
import Fournisseur from "@/views/fournisseur/Fournisseur.vue";
import NotificationView from "@/views/notification/NotificationView.vue";
import History from "@/views/history/History.vue";
import Client from "@/views/client/Client.vue";
import Box from "@/views/box/Box.vue";
// import AddCommandFournisseurView from "@/views/add_command_fournisseur/AddCommandFournisseurView.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "login",
    },
  },
  {
    path: "/sale",
    name: "Sale",
    component: SaleView,
    meta: {
      title: "point_vente",
    },
  },
  {
    path: "/",
    name: "home",
    component: SaleView,
    meta: {
      title: "point_vente",
    },
  },
  {
    path: "/export",
    name: "Export",
    component: exportImportView,
    // component: () => import("@/views/export/exportImportView.vue"),
    meta: {
      title: "conversion_produits",
    },
  },
  {
    path: "/purchase",
    name: "Purchase",
    component: PurchaseDetail,
    // component: () => import("@/views/purchase/PurchaseDetail.vue"),
    meta: {
      title: "achats",
    },
  },
  {
    path: "/depot",
    name: "Depot",
    component: DepotMain,
    // component: () => import("@/views/depot/DepotMain.vue"),
    meta: {
      title: "magasins",
    },
  },
  {
    path: "/notification",
    name: "Dotification",
    component: NotificationView,
    // component: () => import("@/views/notification/NotificationView.vue"),
    meta: {
      title: "notifications",
    },
  },
  {
    path: "/chart",
    name: "Chart",
    component: ChartView,
    // component: () => import("@/views/chart/ChartView.vue"),
    meta: {
      title: "statistiques",
    },
  },
  {
    path: "/history",
    name: "History",
    component: History,
    // component: () => import("@/views/history/History.vue"),
    meta: {
      title: "archives_ventes",
    },
  },

  {
    path: "/product",
    name: "Product",
    component: StockTabs,
    meta: {
      title: "produites",
      icon: "mdi-bell-ring",
    },
  },
  {
    path: "/user",
    name: "User",
    component: UserView,
    // component: () => import("@/views/user/UserView.vue"),
    meta: {
      title: "utilisateurs",
    },
  },
  {
    path: "/expense",
    name: "Expense",
    component: () => import("@/views/expense/ExpenseView.vue"),
    meta: {
      title: "depenses",
    },
  },
  {
    path: "/client",
    name: "Client",
    component: Client,
    // component: () => import("@/views/client/Client.vue"),
    meta: {
      title: "clients",
    },
  },
  // {
  //   path: "/add_command",
  //   name: "AddCommand",
  //   component: AddCommandFournisseurView,
  //   meta: {
  //     title: "purchase_order",
  //   },
  // },
  {
    path: "/fournisseur",
    name: "Fournisseur",
    component: Fournisseur,
    // component: () => import("@/views/fournisseur/Fournisseur.vue"),
    meta: {
      title: "fournisseurs",
    },
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    // component: () => import("@/views/setting/Setting.vue"),
    meta: {
      title: "setting",
    },
  },
  {
    path: "/box",
    name: "box",
    component: Box,
    // component: () => import("@/views/box/Box.vue"),
    meta: {
      title: "boites",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ["login"];
//   const authRequired = !publicPages.includes(to.path);
//   const user = localStorage.getItem("user") ?? "";

//   if (to.path == "/login" && user && user != "") {
//     next("/sale");
//   } else {
//     if (to.path !== "/login" && authRequired && (!user || user == "")) {
//       next("login");
//     } else {
//       if (to.path == "/") {
//         next("/sale");
//       } else {
//         next();
//       }
//     }
//   }
// });

export default router;
