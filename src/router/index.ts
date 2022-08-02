import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SettingView from "@/views/setting/Setting.vue";
import ExpenseView from "@/views/expense/ExpenseView.vue";
import User from "@/views/user/UserView.vue";
import Client from "@/views/client/Client.vue";
import Fournisseur from "@/views/fournisseur/Fournisseur.vue";
import StockView from "@/views/stock/StockView.vue";
import ChartView from "@/views/chart/ChartView.vue";
import SaleView from "@/views/sale/SaleView.vue";
import PurchaseView from "@/views/purchase/PurchaseView.vue";
import PurchaseDetail from "@/views/purchase/PurchaseDetail.vue";
import HistoryView from "@/views/history/History.vue";
import PrinteViews from "@/views/printe/PrinteViews.vue";
import LoginView from "@/views/Login.vue";
import DepotMain from "@/views/depot/DepotMain.vue";
import exportImportView from "@/views/export/exportImportView.vue";

Vue.use(VueRouter);

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
    component: exportImportView,
    meta: {
      title: "تصدير/ استيراد سلع",
    },
  },
  {
    path: "/purchase",
    name: "Purchase",
    component: PurchaseDetail,
    meta: {
      title: "مشتريات",
    },
  },
  {
    path: "/depot",
    name: "Depot",
    component: DepotMain,
    meta: {
      title: "المخازن",
    },
  },
  {
    path: "/chart",
    name: "Chart",
    component: ChartView,
    meta: {
      title: "إحصائيات",
    },
  },
  {
    path: "/history",
    name: "History",
    component: HistoryView,
    meta: {
      title: "ارشيف المبيعات",
    },
  },

  {
    path: "/product",
    name: "Product",
    component: StockView,
    meta: {
      title: "المنتجات",
      icon: "mdi-bell-ring",
    },
  },
  {
    path: "/user",
    name: "User",
    component: User,
    meta: {
      title: "المستخدمين",
    },
  },
  {
    path: "/expense",
    name: "Expense",
    component: ExpenseView,
    meta: {
      title: "المصاريف",
    },
  },
  {
    path: "/client",
    name: "Client",
    component: Client,
    meta: {
      title: "الزبائن",
    },
  },
  {
    path: "/fournisseur",
    name: "Fournisseur",
    component: Fournisseur,
    meta: {
      title: "الموردين",
    },
  },
  {
    path: "/setting",
    name: "Setting",
    component: SettingView,
    meta: {
      title: "الإعدادات",
    },
  },
  {
    path: "/printe",
    name: "Printe",
    component: PrinteViews,
    meta: {
      title: "طباعة",
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
