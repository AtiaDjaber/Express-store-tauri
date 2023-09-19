import Search from "@/classes/search";
import { Setting } from "@/classes/setting";
import Stock from "@/classes/stock";
// import find from "find-process";

// D:\cosmetic-labels-banner-v2.png

export function resolveImage(stock: Stock, host: string): string {
  if (stock.path == null) {
    return require("@/assets/no-image.png");
  }
  const path = stock.path.replaceAll(
    String.fromCharCode(92),
    String.fromCharCode(47)
  );
  return host.includes("localhost") || host.includes("192.")
    ? "file:/" + path
    : host + "storage/attachments/" + stock.photo;
}
export function getQteFromSearch(stock: Stock, search: Search): number {
  const name = search.name.toLocaleLowerCase().trim();
  if (
    stock.name.toLocaleLowerCase().includes(name) ||
    (stock.reference && stock.reference.toLocaleLowerCase().includes(name))
  ) {
    return 1;
  }
  const barcode = stock.barcodes.find((e) =>
    e.name.toLocaleLowerCase().trim().includes(name)
  );
  if (barcode == undefined) {
    return 1;
  } else {
    return barcode.quantity;
  }
}

export function getSelectPrice(stock: Stock, setting: Setting): number {
  return setting.priceSell.includes("1")
    ? stock.sell_price
    : stock.sell_price2 ?? stock.sell_price;
}

export function formatCurrency(value: number, displaySymbol = false): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
  });
  if (displaySymbol) {
    return formatter.format(value).replace("DZD", "") + " DA";
  }
  return formatter.format(value).replace("DZD", "");
}

export async function getPid() {
  // const list = await find("port", 8000);
  // if (!list.length) {
  //   console.log("port 80 is free now");
  //   return null;
  // } else {
  //   console.log(
  //     "%s is listening port 8000",
  //     list[0].name + "   " + list[0].pid
  //   );
  //   return list[0].pid;
  // }
}
