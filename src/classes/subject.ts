import Group from "@/classes/group";

export default class Subject {
  id?: number;
  name?: string;
  level?: string;
  grade?: string;
  photo?: string;
  created_at?: Date;
  updated_at?: string;
  group?: Group;
}
