import FournisseurApi from "@/api/fournisseurApi";
import Fournisseur from "@/classes/Fournisseur";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import FournisseurPayment from "@/classes/FournisseurPayment";
import Search from "@/classes/search";
// import Fournisseur from "@/classes/Fournisseur";

@Module({ generateMutationSetters: true })
class fournisseurModule extends VuexModule {
  private api = new FournisseurApi();

  @Action
  getFournisseurs(search: Search): Promise<Fournisseur[]> {
    const newUrl =
      "?name=" +
      (search.name ? search.name : "") +
      (search.url ? search.url : "");
    return this.api.getFournisseurs(newUrl).then((x) => x);
  }

  @Action
  async saveFournisseur(Fournisseur: Fournisseur): Promise<Fournisseur> {
    return this.api
      .saveFournisseur(Fournisseur)
      .then((x) => Object.assign({}, x));
  }

  @Action
  async updateFournisseur(Fournisseur: Fournisseur): Promise<Fournisseur> {
    return this.api
      .updateFournisseur(Fournisseur)
      .then((x) => Object.assign({}, x));
  }

  deleteFournisseur(id: number): Promise<any> {
    return this.api.deleteFournisseur(id).then((x) => x);
  }
  deletePayment(id: number): Promise<any> {
    return this.api.deletePayment(id).then((x) => x);
  }

  getFournisseurPaymentsById(
    id: number,
    page: any
  ): Promise<FournisseurPayment[]> {
    return this.api.getFournisseurPaymentsById(id, page).then((x) => x);
  }

  @Action
  async addPayment(payment: FournisseurPayment): Promise<any> {
    return this.api.addPayment(payment).then((x) => Object.assign({}, x));
  }

  getFournisseurfactursById(search: Search): Promise<any> {
    return this.api.getFournisseurfacturesById(search).then((x) => x);
  }

  deleteFacture(id: number): Promise<any> {
    return this.api.deleteFacture(id).then((x) => x);
  }

  Fournisseuritem = {} as Fournisseur;

  @Mutation
  setFournisseur(item: Fournisseur) {
    this.Fournisseuritem = item;
  }

  get fournisseur() {
    return this.Fournisseuritem;
  }
}
export default new fournisseurModule({
  store: store,
  name: "fournisseurModule",
});
