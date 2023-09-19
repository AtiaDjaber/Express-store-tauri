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
  locale = "ar";
  host: string;
  priceSell = "السعر 1";
  isReceiptDefault = true;
  printBarcodePrice = true;
  printBarcodeName = true;
  remember = true;
  negative_stock = true;
  isImage = 0;
  server = 0;
  depot_id = 0;
  depot?: Depot;
  created_at?: Date;
  nif?: string;
  rip?: string;
  nis?: string;
  n_rc?: string;
  n_ai?: string;
  priceToPoint?: number;
  pointFromPrice?: number;
  priceFromPoint?: number;
  pointToPrice?: number;
}
