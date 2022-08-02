// import html2canvas from "html2canvas";
// import {shell} from "electron";
// import fs from "fs";
// import {exec} from "child_process";
// import jsPDF, { TextOptionsLight } from "jspdf";
// import { applyPlugin, UserOptions } from "jspdf-autotable";
// import ConstantValues from "@/ConstantValues";
// import { Setting } from "@/classes/setting";
// applyPlugin(jsPDF);
import { writeBinaryFile, BaseDirectory,createDir } from '@tauri-apps/api/fs';

import { Setting } from "@/classes/setting";
import html2canvas from "html2canvas";
import { Command } from '@tauri-apps/api/shell'

export default class PrintImage {
    static print(htmlElement: HTMLElement, openFolder = false) {
        html2canvas(htmlElement, {
            allowTaint: false,
            scale: 4,
            logging: true,
            imageTimeout: 0,
            useCORS: true,
            // onclone(doc, html) {
            //     doc.getElementById("facture").style.display = "block";
            // },
        }).then(async function (canvas) {
            const blob: any = await new Promise((resolve) =>
                canvas.toBlob((blob) => resolve(blob), "image/jpg")
            );

            const date = new Date().getTime();
            const buffer = await new Response(blob).arrayBuffer();
          

          const filePath = date + ".jpg";

          await writeBinaryFile(filePath,await blob.arrayBuffer());


          // await new Promise((resolve, reject) =>
              
          //       fs.writeFile(filePath, buffer, "binary", (err) => {
                    // if (openFolder)
                    //     shell.openPath(fs.realpath.name);

                    // const printCmd = exec(
                    //     ".\\SumatraPDF.exe -silent -print-to-default -print-settings landscape " +
                    //     filePath
                    // );
                    // printCmd.stdout.on("data", (data: any) =>
                    //     console.log(`print data: ${data}`)
                    // );
            //     })
            // );
        });
    }

    static async test(setting:Setting):Promise<void> {
    // const doc = new jsPDF("p", "mm", [72, 297]);

    // doc.addFileToVFS("arial.ttf", ConstantValues.Font);
    // doc.addFont("arial.ttf", "custom", "normal", "Identity-H");
    // doc.setFont("custom");
    // doc.setLanguage("ar-DZ");
    // // doc.viewerPreferences({ Direction: "R2L" });
    // // doc.setR2L(true);
    // doc.setFontSize(10);
    // const width = doc.internal.pageSize.getWidth();

    // doc.text(setting.name_store, width / 2, 5, {
    //   fontSize: 10,
    //   color: 0x000000,
    //   align: "center",
    //   lang: "ar",
    // } as TextOptionsLight);

    // doc.text(setting.tel, width / 2, 9, {
    //   fontSize: 6,
    //   color: 0x000000,
    //   align: "center",
    //   lang: "ar",
    // } as TextOptionsLight);

    // doc.text(setting.address, width / 2, 13, {
    //   fontSize: 6,
    //   color: 0x000000,
    //   align: "center",
    //   lang: "ar",
    // } as TextOptionsLight);

    // (doc as any).autoTable({
    //   head: [["المبلغ", "الكمية", "الصنف"]],
    //   body: [
    //     ["10", "345.00", "صابون صابون صابون دوف وردي"],
    //     ["2", "345.00", "قرعة جافيل دوز 2 L"],
    //   ],
    //   margin: { left: 1, right: 1, top: 25, bottom: 5, horizontal: 1 },

    //   tableLineColor: 0x000000,

    //   bodyStyles: {
    //     fontSize: 8,
    //     fillColor: "#FFFFFF",
    //     textColor: "#000000",
    //     lineColor: "#000000", // Or gray [200, 200, 200]
    //     lineWidth: 0.3,
    //     font: "custom",
    //     overflow: "linebreak",
    //     halign: "right",
    //   },
    //   headStyles: {
    //     cellWidth: 23,
    //     fontStyle: "bold",
    //     fillColor: "#FFFFFF",
    //     lineColor: "#000000", // Or gray [200, 200, 200]
    //     lineWidth: 0.3,
    //     textColor: "#000000",
    //     fontSize: 10,
    //     font: "custom",
    //     overflow: "linebreak",
    //     halign: "center",
    //   },
    //   theme: "grid",
    //   tableWidth: 72,
    //   didDrawPage: function (data) {
    //     doc.text("وصل بيع", width / 2, 20);
    //   },
    // } as UserOptions);

    // const date = new Date().getTime();
    // // doc.save(date + ".pdf");

    // const blob = doc.output("blob");
    // const buffer = Buffer.from(await blob.arrayBuffer());
    // const filePath = "facture/" + date + ".pdf";
    // await new Promise((resolve, reject) =>
    //   fs.writeFile(filePath, buffer, "binary", (err) => {
    //     const printCmd = exec(".\\PDFToPrinter.exe " + filePath + " /s");
    //     printCmd.stdout.on("data", (data) =>
    //       console.log(`print data: ${data}`)
    //     );
    //   })
    // );
  }

}
