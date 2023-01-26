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
var html2canvas_1 = require("html2canvas");
var electron_1 = require("electron");
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var jspdf_1 = require("jspdf");
var jspdf_autotable_1 = require("jspdf-autotable");
var ConstantValues_1 = require("@/ConstantValues");
jspdf_autotable_1.applyPlugin(jspdf_1["default"]);
var PrintImage = /** @class */ (function () {
    function PrintImage() {
    }
    PrintImage.print = function (htmlElement, openFolder) {
        if (openFolder === void 0) { openFolder = false; }
        html2canvas_1["default"](htmlElement, {
            allowTaint: false,
            scale: 6,
            logging: true,
            imageTimeout: 0,
            useCORS: true
        }).then(function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var blob, buffer, _a, _b, date, filePath;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                return canvas.toBlob(function (blob) { return resolve(blob); }, "image/png", 1);
                            })];
                        case 1:
                            blob = _c.sent();
                            _b = (_a = Buffer).from;
                            return [4 /*yield*/, blob.arrayBuffer()];
                        case 2:
                            buffer = _b.apply(_a, [_c.sent()]);
                            date = new Date().getTime();
                            filePath = "facture/" + date + ".png";
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    return fs_1["default"].writeFile(filePath, buffer, "binary", function (err) {
                                        console.log("Print facture error => " + err);
                                        if (openFolder)
                                            electron_1.shell.openPath(fs_1["default"].realpath.name);
                                        var printCmd = child_process_1.exec(".\\SumatraPDF.exe -silent -print-to-default -print-settings landscape " +
                                            filePath);
                                        // const printCmd = exec(".\\PDFToPrinter.exe " + filePath + " /s");
                                        printCmd.stdout.on("data", function (data) {
                                            return console.log("print data: " + data);
                                        });
                                    });
                                })];
                        case 3:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    PrintImage.buildHeader = function (doc, facture, setting, type) {
        var width = doc.internal.pageSize.getWidth();
        var name;
        if (type == "زبون") {
            name =
                (facture.client != null ? facture.client.name : "بيع مباشر") +
                    " : " +
                    "الزيون ";
        }
        if (type == "مورد") {
            name =
                (facture.fournisseur != null
                    ? facture.fournisseur.name
                    : "شراء مباشر") +
                    " : " +
                    "المورد ";
        }
        if (type == "مخزن") {
            name =
                (facture.depot != null ? facture.depot.name : "شراء مباشر") +
                    " : " +
                    "المخزن";
        }
        // doc.addImage("/public/logo.png", width - 30, 0, 20, 20);
        // doc.line(width / 2, 10, width / 2, 20);
        doc.autoTable({
            head: [
                [
                    type == "زبون"
                        ? "فاتورة بيع"
                        : type == "مورد"
                            ? "فاتورة شراء"
                            : facture.type == "export"
                                ? "فاتورة تصدير"
                                : "فاتورة استيراد",
                    setting.name_store,
                ],
            ],
            body: [
                ["رقم الفاتورة : " + facture.id, setting.email + " : " + "الإيميل"],
                [name, setting.tel + " : " + "الهاتف"],
                [
                    "التاريخ : " + facture.created_at,
                    setting.address + " : " + "العنوان",
                ],
            ],
            margin: { left: 0, right: 0, top: 5, bottom: 5, horizontal: 10 },
            tableLineColor: 0x000000,
            headStyles: {
                cellWidth: width / 2 - 10,
                fontStyle: "bold",
                fillColor: "#FFFFFF",
                lineColor: "#000000",
                lineWidth: 0,
                textColor: "#000000",
                fontSize: 16,
                font: "custom",
                overflow: "linebreak",
                halign: "center"
            },
            bodyStyles: {
                cellWidth: width / 2 - 10,
                fontSize: 12,
                fontStyle: "normal",
                fillColor: "#FFFFFF",
                textColor: "#000000",
                lineColor: "#000000",
                lineWidth: 0,
                font: "custom",
                overflow: "linebreak",
                halign: "right"
            },
            theme: "grid",
            tableWidth: "auto"
        });
    };
    PrintImage.buildFooterTransfer = function (doc, facture, setting, type) {
        var _a;
        doc.autoTable({
            body: [
                [
                    {
                        content: facture.montant,
                        colSpan: 2,
                        styles: { cellWidth: 40 }
                    },
                    {
                        content: "المجموع",
                        colSpan: 1,
                        rowSpan: 1,
                        styles: { cellWidth: 30 }
                    },
                    { content: (_a = facture.remark) !== null && _a !== void 0 ? _a : "", styles: { halign: "right" } },
                    {
                        content: ": ملاحظة",
                        rowSpan: 1,
                        styles: { cellWidth: 23 }
                    },
                ],
            ],
            margin: { horizontal: 10 },
            bodyStyles: {
                cellWidth: "auto",
                fontSize: 12,
                // fontStyle: "normal",
                fillColor: "#FFFFFF",
                textColor: "#000000",
                lineColor: "#000000",
                lineWidth: 0,
                font: "custom",
                overflow: "linebreak",
                halign: "right"
            },
            theme: "grid",
            tableWidth: "auto",
            // tableWidth: width / 3,
            styles: { overflow: "hidden" }
        });
    };
    PrintImage.buildFooter = function (doc, facture, setting, type) {
        var _a, _b;
        doc.autoTable({
            body: [
                [
                    {
                        content: facture.montant,
                        colSpan: 2,
                        styles: { cellWidth: 40 }
                    },
                    {
                        content: "المجموع",
                        colSpan: 1,
                        rowSpan: 1,
                        styles: { cellWidth: 30 }
                    },
                    { content: (_a = facture.remark) !== null && _a !== void 0 ? _a : "", styles: { halign: "right" } },
                    {
                        content: ": ملاحظة",
                        rowSpan: 1,
                        styles: { cellWidth: 23 }
                    },
                ],
                [
                    {
                        content: facture.pay,
                        colSpan: 2,
                        styles: { cellWidth: 40 }
                    },
                    {
                        content: "الدفع",
                        styles: { cellWidth: 30 }
                    },
                    {
                        content: facture.user.name,
                        styles: { halign: "right" }
                    },
                    {
                        content: ": المستخدم",
                        colSpan: 1,
                        styles: { cellWidth: 23 }
                    },
                ],
                [
                    { content: facture.remise, colSpan: 2 },
                    { content: "التخفيض", colSpan: 1 },
                    {
                        content: "",
                        colSpan: 2,
                        rowSpan: 2,
                        styles: { valign: "bottom", halign: "center", fontStyle: "bold" }
                    },
                ],
                [
                    { content: facture.rest, colSpan: 2, rowSpan: 1 },
                    { content: "الباقي", colSpan: 1, rowSpan: 1 },
                ],
                [
                    {
                        content: (_b = setting.remark) !== null && _b !== void 0 ? _b : "",
                        colSpan: 5,
                        rowSpan: 1,
                        styles: {
                            halign: "center",
                            fontStyle: "bold",
                            lineWidth: 0.3,
                            fontSize: 14
                        }
                    },
                ],
            ],
            margin: { horizontal: 10 },
            bodyStyles: {
                cellWidth: "auto",
                fontSize: 12,
                // fontStyle: "normal",
                fillColor: "#FFFFFF",
                textColor: "#000000",
                lineColor: "#000000",
                lineWidth: 0,
                font: "custom",
                overflow: "linebreak",
                halign: "right"
            },
            theme: "grid",
            tableWidth: "auto",
            // tableWidth: width / 3,
            styles: { overflow: "hidden" }
        });
    };
    // Print facture A4 using pdfjs
    PrintImage.printFacturePdf = function (setting, facture, type) {
        return __awaiter(this, void 0, Promise, function () {
            var doc, width, date, blob, buffer, _a, _b, filePath;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        doc = new jspdf_1["default"]("p");
                        doc.addFileToVFS("arial.ttf", ConstantValues_1["default"].Font);
                        doc.addFont("arial.ttf", "custom", "normal", "Identity-H");
                        doc.setFont("custom");
                        doc.setLanguage("ar-DZ");
                        // doc.viewerPreferences({ Direction: "R2L" });
                        // doc.setR2L(true);
                        doc.setFontSize(12);
                        width = doc.internal.pageSize.getWidth();
                        this.buildHeader(doc, facture, setting, type);
                        doc.autoTable({
                            columns: [
                                { dataKey: "total", header: "المبلغ" },
                                {
                                    dataKey: type == "زبون" || type == "مخزن" ? "sell_price" : "purchase_price",
                                    header: "السعر"
                                },
                                { dataKey: "quantity", header: "الكمية" },
                                { dataKey: "name", header: "الصنف" },
                            ],
                            body: type == "زبون"
                                ? facture.sales
                                : type == "مورد"
                                    ? facture.purchases
                                    : facture.transfers,
                            margin: { left: 5, right: 5, top: 0, bottom: 5, horizontal: 10 },
                            tableLineColor: 0x000000,
                            headStyles: {
                                cellWidth: "auto",
                                fontStyle: "bold",
                                fillColor: "#FFFFFF",
                                lineColor: "#000000",
                                lineWidth: 0,
                                textColor: "#000000",
                                fontSize: 14,
                                font: "custom",
                                overflow: "linebreak",
                                halign: "right"
                            },
                            bodyStyles: {
                                cellWidth: "auto",
                                fontSize: 12,
                                fillColor: "#FFFFFF",
                                textColor: "#000000",
                                lineColor: "#000000",
                                lineWidth: 0,
                                font: "custom",
                                overflow: "linebreak",
                                halign: "right"
                            },
                            theme: "striped",
                            tableWidth: "auto"
                        });
                        if (type == "مخزن") {
                            this.buildFooterTransfer(doc, facture, setting, type);
                        }
                        else {
                            this.buildFooter(doc, facture, setting, type);
                        }
                        date = new Date().getTime();
                        blob = doc.output("blob");
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, blob.arrayBuffer()];
                    case 1:
                        buffer = _b.apply(_a, [_c.sent()]);
                        filePath = "facture/" + date + ".pdf";
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                return fs_1["default"].writeFile(filePath, buffer, "binary", function (err) {
                                    var facturePath = "facture";
                                    // shell.openPath(path.join(__dirname, "1671810459821.pdf"));
                                    // shell.openPath(
                                    //   remote.app.getAppPath().replace("resources\\app.asar", "") +
                                    //     "facture\\" +
                                    //     date +
                                    //     ".pdf"
                                    // );
                                    // console.log("path facture  => " + remote.app.getAppPath());
                                    var printCmd = child_process_1.exec(".\\PDFToPrinter.exe " + filePath + " /s");
                                    printCmd.stdout.on("data", function (data) {
                                        return console.log("print data: " + data);
                                    });
                                });
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PrintImage.printBarcode = function (htmlElement) {
        html2canvas_1["default"](htmlElement, { scale: 8 }).then(function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var imgData, doc, date, blob, buffer, _a, _b, filePath;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            imgData = canvas.toDataURL("image/png");
                            doc = new jspdf_1["default"]("l", "mm", [40, 20], true);
                            doc.addImage(imgData, "PNG", 0, 0, 40, 20);
                            date = new Date().getTime();
                            blob = doc.output("blob");
                            _b = (_a = Buffer).from;
                            return [4 /*yield*/, blob.arrayBuffer()];
                        case 1:
                            buffer = _b.apply(_a, [_c.sent()]);
                            filePath = "barcode/" + date + ".pdf";
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    return fs_1["default"].writeFile(filePath, buffer, "binary", function (err) {
                                        console.log("Print facture error => " + err);
                                        var printCmd = child_process_1.exec(".\\PDFToPrinter.exe " + filePath + " /s");
                                        printCmd.stdout.on("data", function (data) {
                                            return console.log("print data: " + data);
                                        });
                                    });
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    PrintImage.buildHeaderBon = function (doc, facture, setting, type) {
        var _a, _b;
        var width = doc.internal.pageSize.getWidth();
        var name;
        if (type == "زبون") {
            name =
                (facture.client != null ? facture.client.name : "") + " : " + "الزبون ";
        }
        if (type == "مورد") {
            name =
                (facture.fournisseur != null ? facture.fournisseur.name : "") +
                    " : " +
                    "المورد ";
        }
        if (type == "مخزن") {
            name =
                (facture.depot != null ? facture.depot.name : "") + " : " + "المخزن";
        }
        // doc.addImage("/public/logo.png", width - 30, 0, 20, 20);
        // doc.line(width / 2, 10, width / 2, 20);
        doc.autoTable({
            body: [
                [
                    {
                        content: (_a = setting.name_store) !== null && _a !== void 0 ? _a : "",
                        colSpan: 4,
                        rowSpan: 1,
                        styles: {
                            halign: "center",
                            fontStyle: "bold",
                            lineWidth: [0.3],
                            // lineWidth: 0.3,
                            fontSize: 12
                        }
                    },
                ],
                [
                    {
                        content: (_b = setting.address) !== null && _b !== void 0 ? _b : "",
                        colSpan: 4,
                        rowSpan: 1,
                        styles: {
                            halign: "center"
                        }
                    },
                ],
                [
                    {
                        content: "Tel :" + setting.tel,
                        colSpan: 4,
                        styles: { halign: "center" }
                    },
                ],
                [
                    {
                        content: setting.email,
                        colSpan: 4,
                        styles: { halign: "center" }
                    },
                ],
                [
                    {
                        content: type == "زبون" ? "وصل بيع" : "وصل شراء",
                        colSpan: 4,
                        rowSpan: 1,
                        styles: {
                            halign: "center",
                            fontStyle: "bold",
                            fontSize: 11
                        }
                    },
                ],
            ],
            margin: { horizontal: 1, top: 2, bottom: 0 },
            bodyStyles: {
                cellWidth: "auto",
                fontSize: 9,
                // fontStyle: "normal",
                fillColor: "#FFFFFF",
                textColor: "#000000",
                lineColor: "#000000",
                lineWidth: 0,
                font: "custom",
                cellPadding: { horizontal: 0, vertical: 1 },
                overflow: "linebreak",
                halign: "right"
            },
            theme: "grid",
            tableWidth: "auto",
            // tableWidth: width / 3,
            styles: { overflow: "hidden" }
        });
    };
    PrintImage.printBon = function (setting, facture, type) {
        return __awaiter(this, void 0, Promise, function () {
            var doc, date, blob, buffer, _a, _b, filePath;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        doc = new jspdf_1["default"]("p", "mm", [72, 297]);
                        doc.addFileToVFS("arial.ttf", ConstantValues_1["default"].Font);
                        doc.addFont("arial.ttf", "custom", "normal", "Identity-H");
                        doc.setFont("custom");
                        doc.setLanguage("ar-DZ");
                        doc.setFontSize(10);
                        this.buildHeaderBon(doc, facture, setting, type);
                        doc.autoTable({
                            columns: [
                                { dataKey: "total", header: "المبلغ" },
                                { dataKey: "quantity", header: "الكمية" },
                                { dataKey: "name", header: "الصنف" },
                            ],
                            body: type == "زبون"
                                ? facture.sales
                                : type == "مورد"
                                    ? facture.purchases
                                    : facture.transfers,
                            margin: { top: 0, bottom: -2, horizontal: 1 },
                            tableLineColor: 0x000000,
                            columnStyles: {
                                0: { cellWidth: 18 },
                                1: { cellWidth: 15 },
                                2: { cellWidth: 37 }
                            },
                            bodyStyles: {
                                fontSize: 8,
                                fillColor: "#FFFFFF",
                                textColor: "#000000",
                                lineColor: "#000000",
                                lineWidth: 0.3,
                                font: "custom",
                                overflow: "linebreak",
                                halign: "right",
                                // cellWidth: "wrap",
                                cellPadding: {
                                    top: 0.5,
                                    right: 0.5,
                                    bottom: 0.5,
                                    left: 0
                                }
                            },
                            headStyles: {
                                // cellWidth: 23,
                                fontStyle: "bold",
                                fillColor: "#FFFFFF",
                                lineColor: "#000000",
                                lineWidth: 0.3,
                                textColor: "#000000",
                                fontSize: 10,
                                font: "custom",
                                overflow: "linebreak",
                                halign: "center"
                            },
                            theme: "grid",
                            tableWidth: 72
                        });
                        this.buildFooterBon(doc, facture, setting, type);
                        date = new Date().getTime();
                        blob = doc.output("blob");
                        _b = (_a = Buffer).from;
                        return [4 /*yield*/, blob.arrayBuffer()];
                    case 1:
                        buffer = _b.apply(_a, [_c.sent()]);
                        filePath = "facture/" + date + ".pdf";
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                return fs_1["default"].writeFile(filePath, buffer, "binary", function (err) {
                                    console.log("Print facture error => " + err);
                                    var printCmd = child_process_1.exec(".\\PDFToPrinter.exe " + filePath + " /s");
                                    printCmd.stdout.on("data", function (data) {
                                        return console.log("print data: " + data);
                                    });
                                });
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PrintImage.buildFooterBon = function (doc, facture, setting, type) {
        var _a, _b;
        doc.autoTable({
            body: [
                [
                    {
                        content: facture.montant + " : " + "المجموع",
                        colSpan: 2,
                        styles: { cellWidth: 30 }
                    },
                    {
                        content: (_a = facture.remark) !== null && _a !== void 0 ? _a : "" + ": ملاحظة",
                        styles: { halign: "right", cellWidth: "auto" }
                    },
                ],
                [
                    {
                        content: facture.pay + " : " + "الدفع",
                        colSpan: 2,
                        styles: { cellWidth: 30 }
                    },
                    {
                        content: facture.user.name + " : " + "المستخدم",
                        styles: { halign: "right" }
                    },
                ],
                [
                    { content: facture.remise + " : " + "التخفيض", colSpan: 2 },
                    {
                        content: ""
                    },
                ],
                [
                    { content: facture.rest + " : " + "الباقي", colSpan: 2, rowSpan: 1 },
                    { content: "", colSpan: 1, rowSpan: 1 },
                ],
                [
                    {
                        content: (_b = setting.remark) !== null && _b !== void 0 ? _b : "",
                        colSpan: 4,
                        rowSpan: 1,
                        styles: {
                            halign: "center",
                            fontStyle: "bold",
                            // lineWidth: [0, 0, 0, 0.3],
                            lineWidth: 0.3,
                            fontSize: 11
                        }
                    },
                ],
            ],
            margin: { horizontal: 1 },
            bodyStyles: {
                cellWidth: "auto",
                fontSize: 9,
                // fontStyle: "normal",
                fillColor: "#FFFFFF",
                textColor: "#000000",
                lineColor: "#000000",
                lineWidth: 0,
                font: "custom",
                overflow: "linebreak",
                halign: "right"
            },
            theme: "grid",
            tableWidth: "auto",
            // tableWidth: width / 3,
            styles: { overflow: "hidden" }
        });
    };
    return PrintImage;
}());
exports["default"] = PrintImage;
