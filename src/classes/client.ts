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
  photo?: string;
  barcode = "";
  point = 0;
  is_faithful: boolean;
}
