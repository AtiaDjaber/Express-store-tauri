"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstLaunch = firstLaunch;
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _cryptoEs = _interopRequireDefault(require("crypto-es"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { AES } from "crypto-es/lib/aes";
// import { Uft8 } from "crypto-es/lib/core.js";
function firstLaunch(currentDate) {
  console.log("First-time launch");
  var startDate = currentDate.toISOString();
  var encryptedStartDate = encrypt(startDate);
  localStorage.setItem("trialStartDate", encryptedStartDate);
}

function encrypt(text) {
  var encrypted = _cryptoEs["default"].AES.encrypt(text, "trial").toString();

  return encrypted;
}

function decrypt(encrypted) {
  var decrypted = _cryptoEs["default"].AES.decrypt(encrypted, "trial").toString();

  return decrypted;
}