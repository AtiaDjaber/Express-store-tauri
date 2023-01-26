import User from "./user";

export default class Box {
  id?: number;
  name?: string;
  user_id?: number;
  user: User;
  status?: boolean;

  date?: Date;
  created_at?: Date;
  updated_at?: string;
}
