import ItemCommandFournisseur from "./ItemCommandFournisseur";
import Fournisseur from "./fournisseur";
import User from "./user";
export default class CommandFournisseur {
  id?: number;
  fournisseur_id?: number;
  depot_id?: number;

  remark?: string;
  type?: string;
  deleted_at?: null;
  created_at?: string;
  updated_at?: null;
  fournisseur?: Fournisseur;
  user?: User;
  items_command_fournisseur?: ItemCommandFournisseur[];
}
