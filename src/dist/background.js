"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var lib_1 = require("vue-cli-plugin-electron-builder/lib");
var child_process_1 = require("child_process");
var electron_devtools_installer_1 = require("electron-devtools-installer");
var electron_updater_1 = require("electron-updater");
var isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
electron_1.protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: false, standard: true } },
]);
// mysql -u root express_store < file.sql
var win;
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var checkResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    win = new electron_1.BrowserWindow({
                        width: 1280,
                        height: 780,
                        // autoHideMenuBar: true,
                        title: "Express Store",
                        icon: "public/icon.ico",
                        webPreferences: {
                            nodeIntegration: true,
                            nodeIntegrationInWorker: true,
                            // webSecurity: false,
                            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
                            enableRemoteModule: true
                        }
                    });
                    win.maximize();
                    if (!process.env.WEBPACK_DEV_SERVER_URL) return [3 /*break*/, 2];
                    // Load the url of the dev server if in development mode
                    return [4 /*yield*/, win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)];
                case 1:
                    // Load the url of the dev server if in development mode
                    _a.sent();
                    if (!process.env.IS_TEST)
                        win.webContents.openDevTools();
                    return [3 /*break*/, 3];
                case 2:
                    lib_1.createProtocol("app");
                    // Load the index.html when not in development
                    win.loadURL("app://./index.html");
                    _a.label = 3;
                case 3:
                    child_process_1.execFile("start.bat");
                    createBackup();
                    // win.setMenuBarVisibility(false);
                    if (!isDevelopment) {
                        win.setMenuBarVisibility(false);
                        // shell.openPath("backup.exe");
                        if (process.env.VUE_APP_API_URL.toString().includes("localhost")) {
                            createBackup();
                        }
                    }
                    return [4 /*yield*/, electron_updater_1.autoUpdater.checkForUpdatesAndNotify()];
                case 4:
                    checkResponse = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createBackup() {
    var date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    // const mysqldump = spawn("mysqldump", [
    //   "-u",
    //   "root",
    //   "express_store",
    //   ">",
    //   "backup/express_store_" + date + ".sql",
    //   "&&",
    //   "gzip",
    //   "backup/express_store_" + date + ".sql",
    // ]);
    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // let fs = require("fs");
    // let wstream = fs.createWriteStream("backup/express_store_" + date + ".sql");
    // mysqldump.stdout
    //   .pipe(wstream)
    //   .on("finish", function () {
    //     console.log("Completed");
    //   })
    //   .on("error", function (err) {
    //     console.log("Error => " + err);
    //   });
    var db = "express_store";
    var backup = "backup/express_store" + date + ".sql";
    child_process_1.exec("mysqldump -u root " + db + " > " + backup + " && gzip " + backup);
}
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(isDevelopment && !process.env.IS_TEST)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, electron_devtools_installer_1["default"](electron_devtools_installer_1.VUEJS_DEVTOOLS)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error("Vue Devtools failed to install:", e_1.toString());
                return [3 /*break*/, 4];
            case 4:
                createWindow();
                // const path = require("path");
                // const appFolder = app.getPath("appData");
                // const exe = path.resolve(appFolder, "..", "Local\\Programs\\update.exe");
                // const exeName = "update.exe";
                electron_1.app.setLoginItemSettings({
                    openAtLogin: true,
                    args: [
                        // "--processStart",
                        // exeName,
                        "--process-start-args",
                        "--startup",
                        "\"--hidden\"",
                    ],
                    openAsHidden: true
                });
                return [2 /*return*/];
        }
    });
}); });
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", function (data) {
            if (data === "graceful-exit") {
                electron_1.app.quit();
            }
        });
    }
    else {
        process.on("SIGTERM", function () {
            electron_1.app.quit();
        });
    }
}
electron_updater_1.autoUpdater.on("update-available", function (_event) {
    var dialogOpts = {
        type: "info",
        buttons: ["Ok"],
        title: "Update available for " + _event.releaseName,
        message: (process.platform === "win32"
            ? _event.releaseNotes
            : _event.releaseName),
        detail: "A new version available"
    };
    win.webContents.send("update-available", true);
    electron_1.dialog.showMessageBox(dialogOpts);
});
electron_updater_1.autoUpdater.on("error", function (event) {
    var dialogOpts = {
        type: "error",
        buttons: ["Ok"],
        title: "There was a problem updating the application",
        message: event.message
    };
    electron_1.dialog.showMessageBox(dialogOpts);
});
electron_updater_1.autoUpdater.on("update-downloaded", function (_event) {
    var dialogOpts = {
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: (process.platform === "win32"
            ? _event.releaseNotes
            : _event.releaseName),
        detail: "A new version has been downloaded. Restart the application to apply the updates."
    };
    electron_1.dialog.showMessageBox(dialogOpts).then(function (returnValue) {
        if (returnValue.response === 0)
            electron_updater_1.autoUpdater.quitAndInstall();
    });
});
var updateNotAvailable = false;
electron_updater_1.autoUpdater.on("update-not-available", function (_event) {
    var dialogOpts = {
        type: "info",
        buttons: ["Ok"],
        title: "Update Not available for " + electron_updater_1.autoUpdater.channel,
        message: "A message!",
        detail: "Update Not available for " + electron_updater_1.autoUpdater.channel
    };
    if (!updateNotAvailable) {
        updateNotAvailable = true;
        // dialog.showMessageBox(dialogOpts);
    }
});
electron_updater_1.autoUpdater.on("download-progress", function (progress) {
    win.webContents.send("download-progress", progress.percent);
});
