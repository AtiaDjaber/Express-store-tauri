"use strict";
exports.__esModule = true;
var axiosModule_1 = require("@/store/axiosModule");
var GroupApi = /** @class */ (function () {
    function GroupApi() {
    }
    GroupApi.prototype.getGroups = function (url) {
        return axiosModule_1["default"].instance.get("api/groups" + url).then(function (x) { return x.data; });
    };
    GroupApi.prototype.getGroupStudents = function (groupId) {
        return axiosModule_1["default"].instance
            .get("api/group/students?id=" + groupId)
            .then(function (x) { return x.data; });
    };
    GroupApi.prototype.saveGroup = function (group) {
        var savedGroup = axiosModule_1["default"].instance
            .post("api/group/add", group)
            .then(function (x) { return x.data; });
        return savedGroup;
    };
    GroupApi.prototype.updateGroup = function (group) {
        var updatedGroup = axiosModule_1["default"].instance
            .put("api/group/put", group)
            .then(function (x) { return x.data; });
        return updatedGroup;
    };
    GroupApi.prototype.deleteGroup = function (id) {
        var deletedGroup = axiosModule_1["default"].instance["delete"]("api/group/" + id)
            .then(function (x) { return x.data; });
        return deletedGroup;
    };
    GroupApi.prototype.saveGroupStudent = function (data) {
        var saved = axiosModule_1["default"].instance
            .post("api/sg/add?student_id=" +
            data.studentId +
            "&group_id=" +
            data.groupId +
            "&quotas=" +
            data.quotas)
            .then(function (x) { return x.data; });
        return saved;
    };
    return GroupApi;
}());
exports["default"] = GroupApi;
