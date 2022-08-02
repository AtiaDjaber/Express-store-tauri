import Depot from "@/classes/depot";
import Fournisseur from "./fournisseur";
import Purchase from "./purchase";
export default interface FournisseurFacture {
  id?: number;
  fournisseur_id?: number;
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
  fournisseur: Fournisseur;
  depot: Depot;
  purchases?: Purchase[];
}
