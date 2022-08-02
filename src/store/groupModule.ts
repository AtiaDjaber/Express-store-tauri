import GroupApi from "@/api/groupApi";
import Group from "@/classes/group";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import GroupSubject from "@/classes/groupSubject";
import Search from "@/classes/search";
// import Student from "@/classes/student";

@Module({ generateMutationSetters: true })
class GroupModule extends VuexModule {
  private api = new GroupApi();

  @Action
  getGroups(search?: Search): Promise<Group[]> {
    const newUrl = search
      ? "?name=" +
        (search.name ? search.name : "") +
        (search.url ? search.url : "")
      : "";
    return this.api.getGroups(newUrl).then((x) => x);
  }
  // @Action
  // getGroupStudents(groupId: number): Promise<Student[]> {
  //   return this.api.getGroupStudents(groupId).then((x) => x);
  // }

  @Action
  async saveGroup(group: Group): Promise<Group> {
    return this.api.saveGroup(group).then((x) => Object.assign({}, x));
  }

  @Action
  async updateGroup(group: Group): Promise<Group> {
    return this.api.updateGroup(group).then((x) => Object.assign({}, x));
  }

  deleteGroup(id: number): Promise<any> {
    return this.api.deleteGroup(id).then((x) => x);
  }

  // @Action
  // async saveGroupStudent(data: {
  //   studentId: number;
  //   groupId: number;
  //   quotas: number;
  // }) {
  //   return this.api.saveGroupStudent(data).then((x) => x);
  // }
  
}
export default new GroupModule({
  store: store,
  name: "groupModule",
});
