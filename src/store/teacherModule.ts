import clientApi from "@/api/clientApi";
import client from "@/classes/client";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import TeacherPayment from "@/classes/clientPayment";
import Group from "@/classes/group";
import Search from "@/classes/search";

@Module({ generateMutationSetters: true })
class TeacherModule extends VuexModule {
  private api = new clientApi();

  @Action
  getTeachers(search: Search): Promise<client[]> {
    const newUrl =
      "?name=" +
      (search.name ? search.name : "") +
      (search.url ? search.url : "");
    return this.api.getClients(newUrl).then((x) => x);
  }

  @Action
  async saveTeacher(Client: client): Promise<client> {
    return this.api.saveClient(Client).then((x) => Object.assign({}, x));
  }

  @Action
  async updateClient(Client: client): Promise<client> {
    return this.api.updateClient(Client).then((x) => Object.assign({}, x));
  }

  deleteTeacher(id: number): Promise<any> {
    return this.api.deleteClient(id).then((x) => x);
  }
  deletePayment(id: number): Promise<any> {
    return this.api.deletePayment(id).then((x) => x);
  }

  // @Action
  // getGroupSubjectsByTeacher(id: number): Promise<Group[]> {
  //   return this.api.getGroupSubjectsByTeacher(id).then((x) => x);
  // }
  // @Action
  // getTeacherPaymentsById(id: number): Promise<TeacherPayment[]> {
    // return this.api.getTeacherPaymentsById(id).then((x) => x);
  // }
  @Action
  async addPayment(payment: TeacherPayment): Promise<TeacherPayment> {
    return this.api.addPayment(payment).then((x) => Object.assign({}, x));
  }
}
export default new TeacherModule({
  store: store,
  name: "teacherModule",
});
