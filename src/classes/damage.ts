import Depot from "./depot";
import Stock from "./stock";
import User from "./user";

export default class Damage {
  id?: number;
  price?: number;
  total?: number;
  user_id?: number;
  user: User;
  product_id?: number;
  product: Stock;
  depot_id?: number;
  depot: Depot;
  quantity: number;
  remarque?: string;
  created_at?: Date;
  updated_at?: string;
}
