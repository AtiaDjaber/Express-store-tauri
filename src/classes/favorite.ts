import Stock from "./stock";

export default class Favorite {
  id?: number;
  name?: string;
  products: Stock[];

  created_at?: Date;
  updated_at?: Date;
}
