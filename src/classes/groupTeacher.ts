import Teacher from "@/classes/teacher";
import Subject from "@/classes/subject";

export default class GroupTeacher {
  id?: number;
  group_id?: string;
  teacher_id?: string;
  created_at?: Date;
  updated_at?: string;
  teacher?: Teacher;
  subj?: Subject;
  quotas?: string;

  name?: string ;
}
