import ClientApi from "@/api/clientApi";
import Client from "@/classes/client";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import ClientPayment from "@/classes/clientPayment";
import Group from "@/classes/group";
import Search from "@/classes/search";
import Facture from "@/classes/facture";
// import client from "@/classes/client";

@Module({ generateMutationSetters: true })
class clientModule extends VuexModule {
  private api = new ClientApi();

  @Action
  getClients(search: Search): Promise<Client[]> {
    const newUrl =
      "?name=" +
      (search.name ? search.name : "") +
      (search.url ? search.url : "");
    return this.api.getClients(newUrl).then((x) => x);
  }

  @Action
  async saveclient(client: Client): Promise<Client> {
    return this.api.saveClient(client).then((x) => Object.assign({}, x));
  }

  @Action
  async updateClient(client: Client): Promise<Client> {
    return this.api.updateClient(client).then((x) => Object.assign({}, x));
  }

  deleteClient(id: number): Promise<any> {
    return this.api.deleteClient(id).then((x) => x);
  }
  deletePayment(id: number): Promise<any> {
    return this.api.deletePayment(id).then((x) => x);
  }

  getClientPaymentsById(id: number, page: any): Promise<ClientPayment[]> {
    return this.api.getClientPaymentsById(id, page).then((x) => x);
  }

  @Action
  async addPayment(payment: ClientPayment): Promise<any> {
    return this.api.addPayment(payment).then((x) => Object.assign({}, x));
  }

  getClientfactursById(seacrh: Search): Promise<any> {
    return this.api.getClientFactures(seacrh).then((x) => x);
  }

  deleteFacture(id: number): Promise<any> {
    return this.api.deleteFacture(id).then((x) => x);
  }

  clientitem = {} as Client;

  @Mutation
  setClient(item: Client) {
    this.clientitem = item;
  }

  get client() {
    return this.clientitem;
  }
}
export default new clientModule({
  store: store,
  name: "clientModule",
});
