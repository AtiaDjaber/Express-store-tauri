import Stock from "@/classes/stock";
// import si from "systeminformation";

export default class HelperFunctions {
  static selectedColor(product?: Stock): string {
    let color = "primary";
    if (product.quantity <= product.quantity_alert) {
      color = "orange lighten-1";
    }
    if (product.quantity <= 0) {
      color = "red accent-3";
    }

    return color;
  }
}

export async function getHardDiskSerialNumber() {
  // try {
  //   const disks = await si.diskLayout();
  //   if (disks.length > 0) {
  //     // Select the first disk (you can loop through the array if you have multiple disks)
  //     const firstDisk = disks[0];
  //     // Get the serial number of the first disk
  //     const serialNumber = firstDisk.serialNum;
  //     console.log("Hard Disk Serial Number:", serialNumber);
  //     return serialNumber;
  //   } else {
  //     console.log("No hard disks found.");
  //   }
  // } catch (err) {
  //   console.error("Error:", err);
  // }
}
