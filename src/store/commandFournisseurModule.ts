import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import FournisseurFacture from "@/classes/fournisseurFacture";
import SaleApi from "@/api/saleApi";
import Purchase from "@/classes/purchase";
import CommandFournisseur from "@/classes/CommandFournisseur";
import ItemCommandFournisseur from "@/classes/ItemCommandFournisseur";

@Module({ generateMutationSetters: true })
class CommandFournisseurModule extends VuexModule {
  facture = {
    items_command_fournisseur: [],
  } as CommandFournisseur;

  // saleList = [] as Sale[];
  // selectedClient = {montant: 0} as Client;

  totalCredit = 0;

  get getFacture() {
    return this.facture;
  }

  @Mutation
  setFacture(facture: CommandFournisseur) {
    this.facture = facture;
  }

  @Mutation
  addItem(purchase: ItemCommandFournisseur) {
    const productNew = Object.assign({}, purchase);
    productNew.count = this.facture.items_command_fournisseur.length + 1;

    const index = this.facture.items_command_fournisseur.findIndex(
      (e) => e.product_id == productNew.product_id
    );
    if (index >= 0)
      this.facture.items_command_fournisseur[index].quantity =
        this.facture.items_command_fournisseur[index].quantity + 1;
    else {
      this.facture.items_command_fournisseur.push(productNew);
    }
  }

  @Mutation
  clearCart() {
    this.facture.items_command_fournisseur = [];
  }

  deleteSale(id: number): Promise<any> {
    return SaleApi.deleteSale(id).then((x) => x);
  }
}

export default new CommandFournisseurModule({
  store: store,
  name: "commandFournisseurModule",
});
