"use strict";
exports.__esModule = true;
exports.checkTrialExpire = exports.decrypt = exports.encrypt = exports.firstLaunch = void 0;
// import CryptoES from "crypto-es";
var aes_1 = require("crypto-js/aes");
// import CryptoJS from "crypto-js";
var electron_store_1 = require("electron-store");
var enc_utf8_1 = require("crypto-js/enc-utf8");
// import { dialog } from "electron";
var currentDate = new Date();
var store = new electron_store_1["default"]();
var trialDuration = 3; // 7 days trial
function firstLaunch() {
    console.log("First-time launch");
    var startDate = currentDate.toISOString();
    var encryptedStartDate = encrypt(startDate);
    console.log(encryptedStartDate);
    store.set("trialStartDate", encryptedStartDate);
}
exports.firstLaunch = firstLaunch;
function encrypt(text) {
    var encrypted = aes_1["default"].encrypt(text, "trial").toString();
    return encrypted;
}
exports.encrypt = encrypt;
function decrypt(encrypted) {
    var bytes = aes_1["default"].decrypt(encrypted, "trial");
    var originalText = bytes.toString(enc_utf8_1["default"]);
    return originalText;
}
exports.decrypt = decrypt;
// function showEndDialog(message, detail, type) {
//   const dialogOpts: Electron.MessageBoxOptions = {
//     type: type,
//     buttons: ["موافق"],
//     // title: `Update available for ${_event.releaseName}`,
//     title: `Express Store `,
//     message: message,
//     detail: detail,
//   };
//   dialog.showMessageBox(dialogOpts);
// }
function checkTrialExpire(encryptedStartDate) {
    var decryptedStartDate = decrypt(encryptedStartDate);
    // showEndDialog(
    //   "فترة تجريبية",
    //   +decryptedStartDate + " تاريخ البداية ",
    //   "info"
    // );
    var startDate = new Date(decryptedStartDate);
    var daysElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
    return daysElapsed - trialDuration;
}
exports.checkTrialExpire = checkTrialExpire;
