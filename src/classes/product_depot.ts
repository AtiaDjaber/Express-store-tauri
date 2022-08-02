import Stock from "@/classes/stock";
import Depot from "@/classes/depot";

export default interface ProductDepot {
  id?: number;
  product_id?: number;
  depot_id?: number;
  quantity?: number;
  sell_price?: number;
  product:Stock;
  depot:Depot;
  count: number;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
}
