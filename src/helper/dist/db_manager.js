"use strict";
exports.__esModule = true;
exports.createBackup = exports.removeFilesOlderThanYesterday = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var moment_1 = require("moment");
var child_process_1 = require("child_process");
// Get the date of yesterday
var yesterday = moment_1["default"]().subtract(2, "day").startOf("day");
// Function to check if a file is older than yesterday
function isOlderThanYesterday(file) {
    var fileStats = fs_1["default"].statSync(file);
    var fileModifiedTime = moment_1["default"](fileStats.mtime).startOf("day");
    return fileModifiedTime.isBefore(yesterday) && !file.includes("keep");
}
// Function to remove files older than yesterday
function removeFilesOlderThanYesterday() {
    setTimeout(function () {
        try {
            var directoryPath_1 = "backup/";
            console.log(directoryPath_1);
            fs_1["default"].readdir(directoryPath_1, function (err, files) {
                if (err) {
                    console.error("Error reading directory:", err);
                    return;
                }
                files.forEach(function (file) {
                    var filePath = path_1["default"].join(directoryPath_1, file);
                    if (isOlderThanYesterday(filePath)) {
                        fs_1["default"].unlink(filePath, function (err) {
                            if (err) {
                                console.error("Error removing file:", filePath, err);
                            }
                            else {
                                console.log("Removed file:", filePath);
                            }
                        });
                    }
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }, 19000);
}
exports.removeFilesOlderThanYesterday = removeFilesOlderThanYesterday;
// must file name not contains any spaces
function createBackup(time) {
    if (time === void 0) { time = 0; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10);
            var db = "express_store";
            var backup = "backup/" + db + date + ".sql";
            console.log(backup);
            //  && gzip ${backup}
            child_process_1.exec("mysqldump -u root --default-character-set=utf8mb4 " + db + " > " + backup, function (error, stdout, stderr) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ stdout: stdout, stderr: stderr });
                }
            });
        }, time);
    });
}
exports.createBackup = createBackup;
