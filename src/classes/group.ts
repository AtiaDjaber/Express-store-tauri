// import Subject from "@/classes/subject";
import Client from "@/classes/client";

export default class Group {
  id?: number;
  name?: string;
  price?: number;
  quotas?: number;
  percenatgeTeacher?: number;
  subj_id?: number;
  subjectFullName?: string;
  // subj?: Subject;
  // client?: Client;
  teacher_id?: string;
  created_at?: Date;
  updated_at?: string;
}
