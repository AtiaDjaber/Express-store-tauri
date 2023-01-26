import Depot from "@/classes/depot";
import Stock from "./stock";

export default class Sale {
  id?: number;
  barcode?: string;
  name?: string;
  accessoires: Stock[];
  alternatives: Stock[];
  product: Stock;
  product_id?: number;
  // quantity_stock: number;
  facture_id?: number;
  depot_id?: number;
  depot: Depot;
  client_id?: number;
  price?: number = 0;
  quantity?: number = 0;
  sell_price?: number = 0;
  total?: number = 0;
  count: number;
  type?: string;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
  type_table?: string;
}
