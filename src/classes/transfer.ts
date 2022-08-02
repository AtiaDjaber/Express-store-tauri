export default interface Transfer {
  id?: number;
  barcode?: string;
  name?: string;
  product_id?: number;
  factures_transfers_id?: number;
  client_id?: number;
  depot_id?: number;
  price?: number;
  quantity?: number;
  sell_price?: number;
  total?: number;
  count: number;
  type?: string;
  deleted_at?: null;
  created_at?: Date;
  updated_at?: Date;
}
