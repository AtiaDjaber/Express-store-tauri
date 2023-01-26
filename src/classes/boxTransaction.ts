import Box from "./box";
import User from "./user";

export default class BoxTransaction {
  id?: number;
  start_montant?: number;
  close_montant?: number;
  date?: Date;
  status?: boolean;
  user_id?: number;
  box_id?: number;
  box: Box;
  user: User;
  created_at?: Date;
}
