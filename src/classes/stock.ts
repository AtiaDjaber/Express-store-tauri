import Barcode from "./barcode";
import Category from "./category";

export default class Stock {
  product: Stock;
  id?: number;
  photo?: string;
  path?: string;
  name?: string;
  note?: string;
  barcode?: string;
  barcodes?: Barcode[];
  quantity_alert?: number;
  sell_price?: number = 0;
  sell_price2?: number = 0;
  price?: number = 0;
  quantity?: number = 0;
  packing_size?: number = 0;
  packing_price?: number = 0;
  count?: number;
  type?: string;
  reference?: string;
  pivot: any;
  created_at?: Date;
  updated_at?: Date;
  Percentage?: number = 0;
  percentage2?: number = 0;
  date_expire?: Date;
  category_id: number;
  category?: Category;
  accessoires: Stock[];
  alternatives: Stock[];
}
