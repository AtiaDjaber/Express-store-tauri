export default class User {
  id?: number;
  name?: string;
  email?: string;
  tel?: string;
  type?: string;
  status?: string;
  photo?: string;
  token?: string;
  chart?: boolean;
  user?: boolean;
  purchase?: boolean;
  fournisseur?: boolean;
  depot?: boolean;
  password?: string;
  facture?: boolean;
  sale?: boolean;
  client?:boolean;
  expense?: boolean;

  created_at?: Date;
  updated_at?: Date;
}
