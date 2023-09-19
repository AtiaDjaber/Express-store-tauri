import Client from "@/classes/client";
import Sale from "@/classes/sale";
import Depot from "@/classes/depot";
import User from "./user";
export default class Facture {
  id?: number;
  client_id?: number;
  depot_id?: number;
  montant?: number = 0;
  pay?: number = 0;
  rest?: number = 0;
  remise?: number = 0;
  gift = false;
  remark?: string;
  type?: string;
  deleted_at?: null;
  created_at?: string;
  updated_at?: null;
  client?: Client;
  depot?: Depot;
  user: User;
  sales?: Sale[] = [];
  cartName = "السلة";
  cartNumber = 1;
}
