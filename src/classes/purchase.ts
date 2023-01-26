import Depot from "@/classes/depot";

export default interface Purchase {
  id?: number;
  barcode?: string;
  name?: string;
  product_id?: number;
  fournisseur_facture_id?: number;
  depot_id?: number;
  depot: Depot;
  fournisseur_id?: number;
  price?: number;
  quantity?: number;
  purchase_price?: number;
  total?: number;
  count: number;
  type?: string;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
  type_table?: string;
}
