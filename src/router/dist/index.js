"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var SaleView_vue_1 = require("@/views/sale/SaleView.vue");
var Login_vue_1 = require("@/views/Login.vue");
var StockTabs_vue_1 = require("@/views/stock/StockTabs.vue");
var UserView_vue_1 = require("@/views/user/UserView.vue");
var exportImportView_vue_1 = require("@/views/export/exportImportView.vue");
var PurchaseDetail_vue_1 = require("@/views/purchase/PurchaseDetail.vue");
var DepotMain_vue_1 = require("@/views/depot/DepotMain.vue");
var ChartView_vue_1 = require("@/views/chart/ChartView.vue");
var Setting_vue_1 = require("@/views/setting/Setting.vue");
var Fournisseur_vue_1 = require("@/views/fournisseur/Fournisseur.vue");
var NotificationView_vue_1 = require("@/views/notification/NotificationView.vue");
var History_vue_1 = require("@/views/history/History.vue");
var Client_vue_1 = require("@/views/client/Client.vue");
var Box_vue_1 = require("@/views/box/Box.vue");
var AddCommandFournisseurView_vue_1 = require("@/views/add_command_fournisseur/AddCommandFournisseurView.vue");
vue_1["default"].use(vue_router_1["default"]);
var routes = [
    {
        path: "/login",
        name: "Login",
        component: Login_vue_1["default"],
        meta: {
            title: "login"
        }
    },
    {
        path: "/sale",
        name: "Sale",
        component: SaleView_vue_1["default"],
        meta: {
            title: "point_vente"
        }
    },
    {
        path: "/",
        name: "home",
        component: SaleView_vue_1["default"],
        meta: {
            title: "point_vente"
        }
    },
    {
        path: "/export",
        name: "Export",
        component: exportImportView_vue_1["default"],
        // component: () => import("@/views/export/exportImportView.vue"),
        meta: {
            title: "conversion_produits"
        }
    },
    {
        path: "/purchase",
        name: "Purchase",
        component: PurchaseDetail_vue_1["default"],
        // component: () => import("@/views/purchase/PurchaseDetail.vue"),
        meta: {
            title: "achats"
        }
    },
    {
        path: "/depot",
        name: "Depot",
        component: DepotMain_vue_1["default"],
        // component: () => import("@/views/depot/DepotMain.vue"),
        meta: {
            title: "magasins"
        }
    },
    {
        path: "/notification",
        name: "Dotification",
        component: NotificationView_vue_1["default"],
        // component: () => import("@/views/notification/NotificationView.vue"),
        meta: {
            title: "notifications"
        }
    },
    {
        path: "/chart",
        name: "Chart",
        component: ChartView_vue_1["default"],
        // component: () => import("@/views/chart/ChartView.vue"),
        meta: {
            title: "statistiques"
        }
    },
    {
        path: "/history",
        name: "History",
        component: History_vue_1["default"],
        // component: () => import("@/views/history/History.vue"),
        meta: {
            title: "archives_ventes"
        }
    },
    {
        path: "/product",
        name: "Product",
        component: StockTabs_vue_1["default"],
        meta: {
            title: "produites",
            icon: "mdi-bell-ring"
        }
    },
    {
        path: "/user",
        name: "User",
        component: UserView_vue_1["default"],
        // component: () => import("@/views/user/UserView.vue"),
        meta: {
            title: "utilisateurs"
        }
    },
    {
        path: "/expense",
        name: "Expense",
        component: function () { return Promise.resolve().then(function () { return require("@/views/expense/ExpenseView.vue"); }); },
        meta: {
            title: "depenses"
        }
    },
    {
        path: "/client",
        name: "Client",
        component: Client_vue_1["default"],
        // component: () => import("@/views/client/Client.vue"),
        meta: {
            title: "clients"
        }
    },
    {
        path: "/add_command",
        name: "AddCommand",
        component: AddCommandFournisseurView_vue_1["default"],
        // component: () => import("@/views/client/Client.vue"),
        meta: {
            title: "purchase_order"
        }
    },
    {
        path: "/fournisseur",
        name: "Fournisseur",
        component: Fournisseur_vue_1["default"],
        // component: () => import("@/views/fournisseur/Fournisseur.vue"),
        meta: {
            title: "fournisseurs"
        }
    },
    {
        path: "/setting",
        name: "Setting",
        component: Setting_vue_1["default"],
        // component: () => import("@/views/setting/Setting.vue"),
        meta: {
            title: "setting"
        }
    },
    {
        path: "/box",
        name: "box",
        component: Box_vue_1["default"],
        // component: () => import("@/views/box/Box.vue"),
        meta: {
            title: "boites"
        }
    },
];
var router = new vue_router_1["default"]({
    mode: process.env.IS_ELECTRON ? "hash" : "history",
    base: process.env.BASE_URL,
    routes: routes
});
router.beforeEach(function (to, from, next) {
    var _a;
    var publicPages = ["login"];
    var authRequired = !publicPages.includes(to.path);
    var user = (_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "";
    if (to.path == "/login" && user && user != "") {
        next("/sale");
    }
    else {
        if (to.path !== "/login" && authRequired && (!user || user == "")) {
            next("login");
        }
        else {
            if (to.path == "/") {
                next("/sale");
            }
            else {
                next();
            }
        }
    }
});
exports["default"] = router;
