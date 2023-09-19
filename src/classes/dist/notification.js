"use strict";
exports.__esModule = true;
exports.Notification = void 0;
var Notification = /** @class */ (function () {
    function Notification(text, color, timeout, show, icon, x, y) {
        this.show = false;
        this.text = text;
        this.color = color;
        this.timeout = timeout;
        this.show = show;
        this.icon = icon;
        this.y = y;
        this.x = x;
    }
    return Notification;
}());
exports.Notification = Notification;
