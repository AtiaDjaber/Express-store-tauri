import Depot from "./depot";
import Stock from "./stock";
import User from "./user";

export default class Barcode {
  id?: number;
  name?: string;
  product_id?: number;
  product: Stock;
  quantity: number;
  created_at?: Date;
}
