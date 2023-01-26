import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import FournisseurFacture from "@/classes/fournisseurFacture";
import SaleApi from "@/api/saleApi";
import Purchase from "@/classes/purchase";

@Module({ generateMutationSetters: true })
class PurchaseModule extends VuexModule {
  private api = new SaleApi();
  facture = {
    montant: 0,
    pay: 0,
    rest: 0,
    remise: 0,
    purchases: [],
  } as FournisseurFacture;

  // saleList = [] as Sale[];
  // selectedClient = {montant: 0} as Client;

  totalCredit = 0;

  get getFacture() {
    return this.facture;
  }

  @Mutation
  setFacture(facture: FournisseurFacture) {
    this.facture = facture;
  }

  @Mutation
  addItem(purchase: Purchase) {
    const productNew = Object.assign({}, purchase);
    productNew.count = this.facture.purchases.length + 1;

    const index = this.facture.purchases.findIndex(
      (e) => e.product_id == productNew.product_id
    );
    if (index >= 0)
      this.facture.purchases[index].quantity =
        this.facture.purchases[index].quantity + 1;
    else {
      this.facture.purchases.push(productNew);
    }
  }

  @Mutation
  clearCart() {
    this.facture.purchases = [];
  }

  deleteSale(id: number): Promise<any> {
    return SaleApi.deleteSale(id).then((x) => x);
  }
}

export default new PurchaseModule({
  store: store,
  name: "purchaseModule",
});
