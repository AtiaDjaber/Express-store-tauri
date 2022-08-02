import Depot from "@/classes/depot";

export default interface Sale {
  id?: number;
  barcode?: string;
  name?: string;
  product_id?: number;
  facture_id?: number;
  depot_id?:number;
  depot:Depot;
  client_id?: number;
  price?: number;
  quantity?: number;
  sell_price?: number;
  total?: number;
  count: number;
  type?: string;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
  type_table?:string;
}
