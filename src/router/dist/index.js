"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var SaleView_vue_1 = require("@/views/sale/SaleView.vue");
var Login_vue_1 = require("@/views/Login.vue");
vue_1["default"].use(vue_router_1["default"]);
// old : 7mb
// new :
var routes = [
    {
        path: "/login",
        name: "Login",
        component: Login_vue_1["default"],
        meta: {
            title: "تسجيل الدخول"
        }
    },
    {
        path: "/sale",
        name: "Sale",
        component: SaleView_vue_1["default"],
        meta: {
            title: "الرئيسية"
        }
    },
    {
        path: "/export",
        name: "Export",
        component: function () { return Promise.resolve().then(function () { return require("@/views/export/exportImportView.vue"); }); },
        meta: {
            title: "تصدير/ استيراد سلع"
        }
    },
    {
        path: "/purchase",
        name: "Purchase",
        component: function () { return Promise.resolve().then(function () { return require("@/views/purchase/PurchaseDetail.vue"); }); },
        meta: {
            title: "مشتريات"
        }
    },
    {
        path: "/depot",
        name: "Depot",
        component: function () { return Promise.resolve().then(function () { return require("@/views/depot/DepotMain.vue"); }); },
        meta: {
            title: "المخازن"
        }
    },
    {
        path: "/notification",
        name: "Dotification",
        component: function () { return Promise.resolve().then(function () { return require("@/views/notification/NotificationView.vue"); }); },
        meta: {
            title: "الإشعارات"
        }
    },
    {
        path: "/chart",
        name: "Chart",
        component: function () { return Promise.resolve().then(function () { return require("@/views/chart/ChartView.vue"); }); },
        meta: {
            title: "إحصائيات"
        }
    },
    {
        path: "/history",
        name: "History",
        component: function () { return Promise.resolve().then(function () { return require("@/views/history/History.vue"); }); },
        meta: {
            title: "ارشيف المبيعات"
        }
    },
    {
        path: "/product",
        name: "Product",
        component: function () { return Promise.resolve().then(function () { return require("@/views/stock/StockTabs.vue"); }); },
        meta: {
            title: "المنتجات",
            icon: "mdi-bell-ring"
        }
    },
    {
        path: "/user",
        name: "User",
        component: function () { return Promise.resolve().then(function () { return require("@/views/user/UserView.vue"); }); },
        meta: {
            title: "المستخدمين"
        }
    },
    {
        path: "/expense",
        name: "Expense",
        component: function () { return Promise.resolve().then(function () { return require("@/views/expense/ExpenseView.vue"); }); },
        meta: {
            title: "المصاريف"
        }
    },
    {
        path: "/client",
        name: "Client",
        component: function () { return Promise.resolve().then(function () { return require("@/views/client/Client.vue"); }); },
        meta: {
            title: "الزبائن"
        }
    },
    {
        path: "/fournisseur",
        name: "Fournisseur",
        component: function () { return Promise.resolve().then(function () { return require("@/views/fournisseur/Fournisseur.vue"); }); },
        meta: {
            title: "الموردين"
        }
    },
    {
        path: "/setting",
        name: "Setting",
        component: function () { return Promise.resolve().then(function () { return require("@/views/setting/Setting.vue"); }); },
        meta: {
            title: "الإعدادات"
        }
    },
    {
        path: "/box",
        name: "box",
        component: function () { return Promise.resolve().then(function () { return require("@/views/box/Box.vue"); }); },
        meta: {
            title: "الصناديق"
        }
    },
];
var router = new vue_router_1["default"]({
    mode: "history",
    base: process.env.BASE_URL,
    routes: routes
});
router.beforeEach(function (to, from, next) {
    var _a;
    var publicPages = ["login"];
    var authRequired = !publicPages.includes(to.path);
    var user = (_a = localStorage.getItem("user")) !== null && _a !== void 0 ? _a : "";
    document.title = "Express Store";
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
