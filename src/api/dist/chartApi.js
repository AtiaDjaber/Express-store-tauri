"use strict";
exports.__esModule = true;
var axiosModule_1 = require("@/store/axiosModule");
var ChartApi = /** @class */ (function () {
    function ChartApi() {
    }
    ChartApi.prototype.saveChart = function (chart) {
        var promise = axiosModule_1["default"].instance
            .post("api/chart/add", chart)
            .then(function (x) { return x.data; });
        return promise;
    };
    ChartApi.prototype.deleteChart = function (id) {
        return axiosModule_1["default"].instance["delete"]("api/Chart/" + id)
            .then(function (x) { return x.data; });
    };
    ChartApi.prototype.groupSubjByBarcodeForChart = function (data) {
        return axiosModule_1["default"].instance
            .post("api/student/groupSubjByStudentForChart", data)
            .then(function (x) { return x.data; });
    };
    ChartApi.prototype.groupSubjByIdForChart = function (data) {
        return axiosModule_1["default"].instance
            .post("api/student/groupSubjByStudentForChart", data)
            .then(function (x) { return x.data; });
    };
    ChartApi.getChart = function (url) {
        return axiosModule_1["default"].instance.get("api/Charts" + url).then(function (x) { return x.data; });
    };
    ChartApi.getTopClientsData = function () {
        return axiosModule_1["default"].instance
            .get("api/chart/top_clients")
            .then(function (x) { return x.data; });
    };
    ChartApi.getChartData = function () {
        return axiosModule_1["default"].instance
            .get("api/chart/yearMonthChart")
            .then(function (x) { return x.data; });
    };
    ChartApi.getDaysChart = function (from, to) {
        return axiosModule_1["default"].instance
            .get("api/chart/daysChart" + "?from=" + from + "&to=" + to)
            .then(function (x) { return x.data; });
    };
    // public getDetailAnalyticsTeacher(
    //     teacher_id: number,
    //     from?: string,
    //     to?: string
    // ): Promise<any> {
    //     return axiosModule.instance
    //         .get(
    //             "api/chart/getBenifitByTeacherId" +
    //             "?from=" +
    //             from +
    //             "&to=" +
    //             to +
    //             "&teacher_id=" +
    //             teacher_id
    //         )
    //         .then((x) => x.data);
    // }
    ChartApi.getBenifitPeriod = function (from, to) {
        return axiosModule_1["default"].instance
            .get("api/chart/benifitPeriod" + "?from=" + from + "&to=" + to)
            .then(function (x) { return x.data; });
    };
    ChartApi.getBenifitPeriodDepots = function (from, to) {
        return axiosModule_1["default"].instance
            .get("api/chart/benifitPeriodDepots" + "?from=" + from + "&to=" + to)
            .then(function (x) { return x.data; });
    };
    ChartApi.getTotalDepots = function (from, to) {
        return axiosModule_1["default"].instance
            .get("api/chart/totalDepots")
            .then(function (x) { return x.data; });
    };
    ChartApi.getClientDues = function () {
        return axiosModule_1["default"].instance
            .get("api/chart/clients_dues")
            .then(function (x) { return x.data; });
    };
    ChartApi.getProductsInventory = function () {
        return axiosModule_1["default"].instance
            .get("api/chart/products_inventory")
            .then(function (x) { return x.data; });
    };
    ChartApi.getExpensesAnalytics = function (from, to) {
        return axiosModule_1["default"].instance
            .get("api/chart/expenses?" + "from=" + from + "&to=" + to)
            .then(function (x) { return x.data; });
    };
    return ChartApi;
}());
exports["default"] = ChartApi;
