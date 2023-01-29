import html2canvas from "html2canvas";
// import { shell, app, remote } from "electron";
// import fs from "fs";
// import path from "path";
// import { exec } from "child_process";
import jsPDF, { TextOptionsLight } from "jspdf";
import { applyPlugin, RowInput, UserOptions } from "jspdf-autotable";
import ConstantValues from "@/ConstantValues";
import { Setting } from "@/classes/setting";
import Facture from "@/classes/facture";
import autoTable from "jspdf-autotable";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";
import { Command } from "@tauri-apps/api/shell";
applyPlugin(jsPDF);

export default class PrintImage {
  static async getPrinters() {
    let res = await new Command("printers", [
      "printer",
      "get",
      "name",
    ]).execute();

    let printers = res.stdout
      .trim()
      .split("\n")
      .map((e) => {
        e = e.trim();
        return e;
      })
      .filter((e) => e != "Name");

    return printers;
  }
  // static print(htmlElement: HTMLElement, openFolder = false): void {
  //   html2canvas(htmlElement, {
  //     allowTaint: false,
  //     scale: 6,
  //     logging: true,
  //     imageTimeout: 0,
  //     useCORS: true,
  //     // onclone(doc, html) {
  //     //     doc.getElementById("facture").style.display = "block";
  //     // },
  //   }).then(async function (canvas) {
  //     const blob: any = await new Promise((resolve) =>
  //       canvas.toBlob((blob) => resolve(blob), "image/png", 1)
  //     );

  //     const buffer = Buffer.from(await blob.arrayBuffer());
  //     const date = new Date().getTime();

  //     const filePath = "facture/" + date + ".png";
  //     await new Promise((resolve, reject) =>
  //       fs.writeFile(filePath, buffer, "binary", (err) => {
  //         console.log("Print facture error => " + err);
  //         if (openFolder) shell.openPath(fs.realpath.name);

  //         const printCmd = exec(
  //           ".\\SumatraPDF.exe -silent -print-to-default -print-settings landscape " +
  //             filePath
  //         );

  //         // const printCmd = exec(".\\PDFToPrinter.exe " + filePath + " /s");

  //         printCmd.stdout.on("data", (data: any) =>
  //           console.log(`print data: ${data}`)
  //         );
  //       })
  //     );
  //   });
  // }

  static buildHeader(doc: any, facture: any, setting: Setting, type: string) {
    const width = doc.internal.pageSize.getWidth();
    let name;
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
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        textColor: "#000000",
        fontSize: 16,
        font: "custom",
        overflow: "linebreak",
        halign: "center",
      },
      bodyStyles: {
        cellWidth: width / 2 - 10,
        fontSize: 12,
        fontStyle: "normal",
        fillColor: "#FFFFFF",
        textColor: "#000000",
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
      },
      theme: "grid",
      tableWidth: "auto",
    } as UserOptions);
  }

  static buildFooterTransfer(
    doc: any,
    facture: any,
    setting: Setting,
    type: string
  ) {
    doc.autoTable({
      body: [
        [
          {
            content: facture.montant,
            colSpan: 2,
            styles: { cellWidth: 40 },
          },
          {
            content: "المجموع",
            colSpan: 1,
            rowSpan: 1,
            styles: { cellWidth: 30 },
          },
          { content: facture.remark ?? "", styles: { halign: "right" } },
          {
            content: ": ملاحظة",
            rowSpan: 1,
            styles: { cellWidth: 23 },
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
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
      },
      theme: "grid",
      tableWidth: "auto",

      // tableWidth: width / 3,
      styles: { overflow: "hidden" },
    } as UserOptions);
  }
  static buildFooter(doc: any, facture: any, setting: Setting, type: string) {
    doc.autoTable({
      body: [
        [
          {
            content: facture.montant,
            colSpan: 2,
            styles: { cellWidth: 40 },
          },
          {
            content: "المجموع",
            colSpan: 1,
            rowSpan: 1,
            styles: { cellWidth: 30 },
          },
          { content: facture.remark ?? "", styles: { halign: "right" } },
          {
            content: ": ملاحظة",
            rowSpan: 1,
            styles: { cellWidth: 23 },
          },
        ],

        [
          {
            content: facture.pay,
            colSpan: 2,
            styles: { cellWidth: 40 },
          },
          {
            content: "الدفع",
            styles: { cellWidth: 30 },
          },

          {
            content: facture.user.name,
            styles: { halign: "right" },
          },
          {
            content: ": المستخدم",
            colSpan: 1,
            styles: { cellWidth: 23 },
          },
        ],
        [
          { content: facture.remise, colSpan: 2 },
          { content: "التخفيض", colSpan: 1 },
          {
            content: "",
            colSpan: 2,
            rowSpan: 2,
            styles: { valign: "bottom", halign: "center", fontStyle: "bold" },
          },
        ],
        [
          { content: facture.rest, colSpan: 2, rowSpan: 1 },
          { content: "الباقي", colSpan: 1, rowSpan: 1 },
          // {
          //   content: "",
          //   colSpan: 1,
          //   rowSpan: 1,
          //   styles: { halign: "center", fontStyle: "bolditalic" },
          // },
        ],
        [
          {
            content: setting.remark ?? "",
            colSpan: 5,
            rowSpan: 1,
            styles: {
              halign: "center",
              fontStyle: "bold",
              lineWidth: 0.3,
              fontSize: 14,
            },
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
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
      },
      theme: "grid",
      tableWidth: "auto",

      // tableWidth: width / 3,
      styles: { overflow: "hidden" },
    } as UserOptions);
  }
  // // Print facture A4 using pdfjs
  static async printFacturePdf(
    setting: Setting,
    facture: any,
    type?: string
  ): Promise<void> {
    const doc: any = new jsPDF("p");
    doc.addFileToVFS("arial.ttf", ConstantValues.Font);
    doc.addFont("arial.ttf", "custom", "normal", "Identity-H");
    doc.setFont("custom");
    doc.setLanguage("ar-DZ");
    // doc.viewerPreferences({ Direction: "R2L" });
    // doc.setR2L(true);
    doc.setFontSize(12);
    const width = doc.internal.pageSize.getWidth();

    this.buildHeader(doc, facture, setting, type);

    doc.autoTable({
      columns: [
        { dataKey: "total", header: "المبلغ" },
        {
          dataKey:
            type == "زبون" || type == "مخزن" ? "sell_price" : "purchase_price",
          header: "السعر",
        },
        { dataKey: "quantity", header: "الكمية" },
        { dataKey: "name", header: "الصنف" },
      ],
      body:
        type == "زبون"
          ? (facture.sales as any)
          : type == "مورد"
          ? facture.purchases
          : facture.transfers,

      margin: { left: 5, right: 5, top: 0, bottom: 5, horizontal: 10 },

      tableLineColor: 0x000000,

      headStyles: {
        cellWidth: "auto",
        fontStyle: "bold",
        fillColor: "#FFFFFF",
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,

        textColor: "#000000",
        fontSize: 14,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
      },
      bodyStyles: {
        cellWidth: "auto",
        fontSize: 12,
        fillColor: "#FFFFFF",
        textColor: "#000000",
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
      },
      theme: "striped",
      tableWidth: "auto",
    } as UserOptions);

    if (type == "مخزن") {
      this.buildFooterTransfer(doc, facture, setting, type);
    } else {
      this.buildFooter(doc, facture, setting, type);
    }

    const date = new Date().getTime();
    // const blob = doc.output("blob");
    // const contents = await blob.arrayBuffer();

    const filePath = "facture/" + date + ".pdf";
    await writeBinaryFile({
      path: filePath,
      contents: doc.output("arraybuffer"),
    }).then(async (_) => {
      new Command("print", [filePath, setting.facture]).execute();
    });
  }

  static printBarcode(htmlElement: HTMLElement): void {
    //   html2canvas(htmlElement, { scale: 8 }).then(async function (canvas) {
    //     const imgData = canvas.toDataURL("image/png");
    //     const doc = new jsPDF("l", "mm", [40, 20], true);
    //     doc.addImage(imgData, "PNG", 0, 0, 40, 20);
    //     const date = new Date().getTime();
    //     const blob = doc.output("blob");
    //     const buffer = Buffer.from(await blob.arrayBuffer());
    //     const filePath = "barcode/" + date + ".pdf";
    //     await new Promise((resolve, reject) =>
    //       fs.writeFile(filePath, buffer, "binary", (err) => {
    //         console.log("Print facture error => " + err);
    //         const printCmd = exec(".\\PDFToPrinter.exe " + filePath + " /s");
    //         printCmd.stdout.on("data", (data) =>
    //           console.log(`print data: ${data}`)
    //         );
    //       })
    //     );
    //     // doc.save(date + ".pdf");
    //   });
  }

  static buildHeaderBon(
    doc: any,
    facture: any,
    setting: Setting,
    type: string
  ): void {
    const width = doc.internal.pageSize.getWidth();
    let name;
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
            content: setting.name_store ?? "",
            colSpan: 4,
            rowSpan: 1,
            styles: {
              halign: "center",
              fontStyle: "bold",
              lineWidth: [0.3],
              // lineWidth: 0.3,
              fontSize: 12,
            },
          },
        ],
        [
          {
            content: setting.address ?? "",
            colSpan: 4,
            rowSpan: 1,
            styles: {
              halign: "center",
            },
          },
        ],
        [
          {
            content: "Tel :" + setting.tel,
            colSpan: 4,

            styles: { halign: "center" },
          },
        ],
        [
          {
            content: setting.email,
            colSpan: 4,
            styles: { halign: "center" },
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
              fontSize: 11,
            },
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
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        font: "custom",
        cellPadding: { horizontal: 0, vertical: 1 },
        overflow: "linebreak",
        halign: "right",
      },
      theme: "grid",
      tableWidth: "auto",

      // tableWidth: width / 3,
      styles: { overflow: "hidden" },
    } as UserOptions);
  }

  static async printBon(
    setting: Setting,
    facture: any,
    type?: string
  ): Promise<void> {
    const doc = new jsPDF("p", "mm", [72, 297]);
    doc.addFileToVFS("arial.ttf", ConstantValues.Font);
    doc.addFont("arial.ttf", "custom", "normal", "Identity-H");
    doc.setFont("custom");
    doc.setLanguage("ar-DZ");
    doc.setFontSize(10);
    this.buildHeaderBon(doc, facture, setting, type);
    (doc as any).autoTable({
      columns: [
        { dataKey: "total", header: "المبلغ" },
        { dataKey: "quantity", header: "الكمية" },
        { dataKey: "name", header: "الصنف" },
      ],
      body:
        type == "زبون"
          ? (facture.sales as any)
          : type == "مورد"
          ? facture.purchases
          : facture.transfers,
      margin: { top: 0, bottom: -2, horizontal: 1 },
      tableLineColor: 0x000000,
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 15 },
        2: { cellWidth: 37 },
      },
      bodyStyles: {
        fontSize: 8,
        fillColor: "#FFFFFF",
        textColor: "#000000",
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0.3,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
        // cellWidth: "wrap",
        cellPadding: {
          top: 0.5,
          right: 0.5,
          bottom: 0.5,
          left: 0,
        },
      },
      headStyles: {
        // cellWidth: 23,
        fontStyle: "bold",
        fillColor: "#FFFFFF",
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0.3,
        textColor: "#000000",
        fontSize: 10,
        font: "custom",
        overflow: "linebreak",
        halign: "center",
      },
      theme: "grid",
      tableWidth: 72,
      // didDrawPage: function (data) {
      //   doc.text("وصل بيع", width / 2, 20);
      // },
    } as UserOptions);
    this.buildFooterBon(doc, facture, setting, type);
    const date = new Date().getTime();
    const filePath = "facture/" + date + ".pdf";
    await writeBinaryFile({
      path: filePath,
      contents: doc.output("arraybuffer"),
    }).then(async (_) => {
      new Command("print", [filePath, setting.receipt]).execute();
    });
  }
  static buildFooterBon(
    doc: any,
    facture: any,
    setting: Setting,
    type: string
  ): void {
    doc.autoTable({
      body: [
        [
          {
            content: facture.montant + " : " + "المجموع",
            colSpan: 2,
            styles: { cellWidth: 30 },
          },
          {
            content: facture.remark ?? "" + ": ملاحظة",
            styles: { halign: "right", cellWidth: "auto" },
          },
        ],
        [
          {
            content: facture.pay + " : " + "الدفع",
            colSpan: 2,
            styles: { cellWidth: 30 },
          },
          {
            content: facture.user.name + " : " + "المستخدم",
            styles: { halign: "right" },
          },
        ],
        [
          { content: facture.remise + " : " + "التخفيض", colSpan: 2 },
          {
            content: "",
          },
        ],
        [
          { content: facture.rest + " : " + "الباقي", colSpan: 2, rowSpan: 1 },
          { content: "", colSpan: 1, rowSpan: 1 },
        ],
        [
          {
            content: setting.remark ?? "",
            colSpan: 4,
            rowSpan: 1,
            styles: {
              halign: "center",
              fontStyle: "bold",
              // lineWidth: [0, 0, 0, 0.3],
              lineWidth: 0.3,
              fontSize: 11,
            },
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
        lineColor: "#000000", // Or gray [200, 200, 200]
        lineWidth: 0,
        font: "custom",
        overflow: "linebreak",
        halign: "right",
      },
      theme: "grid",
      tableWidth: "auto",
      // tableWidth: width / 3,
      styles: { overflow: "hidden" },
    } as UserOptions);
  }
}
