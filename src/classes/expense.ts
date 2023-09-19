import Box from "./box";
import Category from "./category";
import User from "./user";

export default class Expense {
  id?: number;
  name?: string;
  price?: number;
  user_id?: number;
  user: User;
  box_id?: number;
  box: Box;
  remarque?: string;
  expense_category_id?: number;
  expense_category?: Category;
  date?: Date;
  created_at?: Date;
  updated_at?: string;
}
