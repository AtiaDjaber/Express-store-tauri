import Group from "@/classes/group";
import HttpClient from "./httpClient";
import Student from "@/classes/student";

export default class GroupApi extends HttpClient {
  public constructor() {
    super(process.env.VUE_APP_API_URL);
  }

  public getGroups(url?: string): Promise<Group[]> {
    return this.instance.get("api/groups" + url).then((x) => x.data);
  }
  public getGroupStudents(groupId: number): Promise<Student[]> {
    return this.instance
      .get("api/group/students?id=" + groupId)
      .then((x) => x.data);
  }

  saveGroup(group: Group) {
    const savedGroup = this.instance
      .post<Group>("api/group/add", group)
      .then((x) => x.data);
    return savedGroup;
  }

  updateGroup(group: Group) {
    const updatedGroup = this.instance
      .put<Group>("api/group/put", group)
      .then((x) => x.data);
    return updatedGroup;
  }

  deleteGroup(id: number) {
    const deletedGroup = this.instance
      .delete<any>("api/group/" + id)
      .then((x) => x.data);
    return deletedGroup;
  }

  saveGroupStudent(data: {
    studentId: number;
    groupId: number;
    quotas: number;
  }) {
    const saved = this.instance
      .post<Group>(
        "api/sg/add?student_id=" +
          data.studentId +
          "&group_id=" +
          data.groupId +
          "&quotas=" +
          data.quotas
      )
      .then((x) => x.data);
    return saved;
  }
}
