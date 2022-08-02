import Client from "@/classes/client";
import Sale from "@/classes/sale";
import Depot from "@/classes/depot";
export default interface Facture {
  id?: number;
  client_id?: number;
  depot_id?: number;

  montant?: number;
  pay?: number;
  rest?: number;
  remise?: number;
  remark?: string;
  type?: string;
  deleted_at?: null;
  created_at?: string;
  updated_at?: null;
  client: Client;
  depot:Depot;
  sales?: Sale[];
}
