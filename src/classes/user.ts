import Box from "./box";

export default class User {
  id?: number;
  name?: string;
  email?: string;
  tel?: string;
  type?: string;
  status?: string;
  box: Box;
  photo?: string;
  token?: string;
  chart?: boolean;
  user?: boolean;
  purchase?: boolean;
  fournisseur?: boolean;
  depot?: boolean;
  product?: boolean;
  transfer?: boolean;
  setting?: boolean;
  password?: string;
  old_password: string;
  facture?: boolean;
  sale?: boolean;
  client?: boolean;
  expense?: boolean;

  created_at?: Date;
  updated_at?: Date;
}
