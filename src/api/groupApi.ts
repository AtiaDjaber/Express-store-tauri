import Group from "@/classes/group";
import HttpClient from "./httpClient";
import Student from "@/classes/student";
import axiosModule from "@/store/axiosModule";

export default class GroupApi  {
 

  public getGroups(url?: string): Promise<Group[]> {
    return axiosModule.instance.get("api/groups" + url).then((x) => x.data);
  }
  public getGroupStudents(groupId: number): Promise<Student[]> {
    return axiosModule.instance
      .get("api/group/students?id=" + groupId)
      .then((x) => x.data);
  }

  saveGroup(group: Group) {
    const savedGroup = axiosModule.instance
      .post<Group>("api/group/add", group)
      .then((x) => x.data);
    return savedGroup;
  }

  updateGroup(group: Group) {
    const updatedGroup = axiosModule.instance
      .put<Group>("api/group/put", group)
      .then((x) => x.data);
    return updatedGroup;
  }

  deleteGroup(id: number) {
    const deletedGroup = axiosModule.instance
      .delete<any>("api/group/" + id)
      .then((x) => x.data);
    return deletedGroup;
  }

  saveGroupStudent(data: {
    studentId: number;
    groupId: number;
    quotas: number;
  }) {
    const saved = axiosModule.instance
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
