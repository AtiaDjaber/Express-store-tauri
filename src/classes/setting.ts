import Depot from "./depot";

export class Setting {
  id?: number;
  zakat?: Date = new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    new Date().getDate()
  );
  name_store?: string = "اسم المحل";
  tel?: string;
  address?: string;
  email?: string;
  logo?: string;
  remark?: string;
  warning?: string;
  barcode?: string;
  receipt?: string;
  facture?: string;
  printBarcodePrice = true;
  printBarcodeName = true;
  isImage = 0;
  depot_id = 0;
  depot?: Depot;
  created_at?: Date;
  priceToPoint?: number;
  pointFromPrice?: number;
  priceFromPoint?: number;
  pointToPrice?: number;
}
