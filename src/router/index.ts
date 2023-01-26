import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SaleView from "@/views/sale/SaleView.vue";
import LoginView from "@/views/Login.vue";

Vue.use(VueRouter);

// old : 7mb
// new :
const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "تسجيل الدخول",
    },
  },
  {
    path: "/sale",
    name: "Sale",
    component: SaleView,
    meta: {
      title: "الرئيسية",
    },
  },
  {
    path: "/export",
    name: "Export",
    component: () => import("@/views/export/exportImportView.vue"),
    meta: {
      title: "تصدير/ استيراد سلع",
    },
  },
  {
    path: "/purchase",
    name: "Purchase",
    component: () => import("@/views/purchase/PurchaseDetail.vue"),
    meta: {
      title: "مشتريات",
    },
  },
  {
    path: "/depot",
    name: "Depot",
    component: () => import("@/views/depot/DepotMain.vue"),
    meta: {
      title: "المخازن",
    },
  },
  {
    path: "/notification",
    name: "Dotification",
    component: () => import("@/views/notification/NotificationView.vue"),
    meta: {
      title: "الإشعارات",
    },
  },
  {
    path: "/chart",
    name: "Chart",
    component: () => import("@/views/chart/ChartView.vue"),
    meta: {
      title: "إحصائيات",
    },
  },
  {
    path: "/history",
    name: "History",
    component: () => import("@/views/history/History.vue"),
    meta: {
      title: "ارشيف المبيعات",
    },
  },

  {
    path: "/product",
    name: "Product",
    component: () => import("@/views/stock/StockTabs.vue"),
    meta: {
      title: "المنتجات",
      icon: "mdi-bell-ring",
    },
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/user/UserView.vue"),
    meta: {
      title: "المستخدمين",
    },
  },
  {
    path: "/expense",
    name: "Expense",
    component: () => import("@/views/expense/ExpenseView.vue"),
    meta: {
      title: "المصاريف",
    },
  },
  {
    path: "/client",
    name: "Client",
    component: () => import("@/views/client/Client.vue"),
    meta: {
      title: "الزبائن",
    },
  },
  {
    path: "/fournisseur",
    name: "Fournisseur",
    component: () => import("@/views/fournisseur/Fournisseur.vue"),
    meta: {
      title: "الموردين",
    },
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("@/views/setting/Setting.vue"),
    meta: {
      title: "الإعدادات",
    },
  },
  {
    path: "/box",
    name: "box",
    component: () => import("@/views/box/Box.vue"),
    meta: {
      title: "الصناديق",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["login"];
  const authRequired = !publicPages.includes(to.path);
  const user = localStorage.getItem("user") ?? "";
  document.title = "Express Store";
  if (to.path == "/login" && user && user != "") {
    next("/sale");
  } else {
    if (to.path !== "/login" && authRequired && (!user || user == "")) {
      next("login");
    } else {
      if (to.path == "/") {
        next("/sale");
      } else {
        next();
      }
    }
  }
});

export default router;
