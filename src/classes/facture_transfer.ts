import Transfer from "@/classes/transfer";
import Depot from "@/classes/depot";
import User from "./user";
export default interface FactureTransfer {
  id?: number;
  depot_id?: number;
  montant?: number;
  remise?: number;
  remark?: string;
  type?: string;
  created_at?: string;
  depot: Depot;
  user: User;
  transfers?: Transfer[];
}
