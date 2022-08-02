import User from "./user";

export default class Expense {
  id?: number;
  name?: string;
  price?: number;
  user_id?: number;
  user: User;
  remarque?: string;
  date?: Date;
  created_at?: Date;
  updated_at?: string;
}
