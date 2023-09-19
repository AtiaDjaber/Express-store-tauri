export default class Client {
  id?: number;
  name?: string;
  montant?: number;
  ancien?: number;
  mobile?: string;
  created_at?: Date;
  updated_at?: Date;
  email?: string;
  address?: string;
  nif?: string;
  nis?: string;
  n_rc?: string;
  n_ai?: string;
  photo?: string;
  barcode = "";
  point = 0;
  is_faithful = false;
}
