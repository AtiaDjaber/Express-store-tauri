import Stock from "@/classes/stock";

export default class HelperFunctions {
  static selectedColor(product?: Stock): string {
    let color = "primary";
    if (product.quantity <= product.quantity_alert) {
      color = "amber lighten-1";
    }
    if (product.quantity < 0) {
      color = "red accent-3";
    }

    return color;
  }
}
