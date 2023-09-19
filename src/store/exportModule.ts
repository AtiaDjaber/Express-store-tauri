import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import Sale from "@/classes/sale";
import Facture from "@/classes/facture";
import SaleApi from "@/api/saleApi";
import FactureTransfer from "@/classes/facture_transfer";
import Transfer from "@/classes/transfer";
import ExportApi from "@/api/exportApi";

@Module({ generateMutationSetters: true })
class ExportModule extends VuexModule {
  private api = new SaleApi();
  private apiExportImport = new ExportApi();

  async deleteImportExportFacture(id: number): Promise<any> {
    return this.apiExportImport.deleteExportImport(id);
  }
  facture = {
    montant: 0,
    transfers: [],
  } as FactureTransfer;

  // saleList = [] as Sale[];
  // selectedClient = {montant: 0} as Client;

  totalCredit = 0;

  // get getClient() {
  //     return this.facture.client;
  // }

  // @Mutation
  // calcule() {
  //     this.facture.montant = 0;
  //
  //     this.facture.sales.forEach((prodct, index) => {
  //         prodct.count = index + 1;
  //         this.facture.montant = this.facture.montant + prodct.total;
  //     });
  //     this.facture.rest = Number(this.facture.montant) - Number(this.facture.pay);
  //     this.totalCredit =
  //         (Number(this.facture.montant) + Number((this.facture.client.montant) ?? 0));
  // }

  // get getFacture() {
  //     return this.facture;
  // }

  @Mutation
  setFacture(facture: FactureTransfer) {
    this.facture = facture;
  }

  // @Mutation
  // setSales(sale: Sale[]) {
  //     this.facture.sales = sale;
  // }

  // @Mutation
  // setClient(client: Client) {
  //     // this.facture.client = client;
  //     this.facture = {montant: 0, pay: 0, rest: 0, remise: 0, sales: [],client:client} as Facture;
  // }

  @Mutation
  addItem(sale: Transfer) {
    const productNew = Object.assign({}, sale);
    productNew.count = this.facture.transfers.length + 1;

    const index = this.facture.transfers.findIndex(
      (e) => e.product_id == productNew.product_id
    );
    if (index >= 0)
      this.facture.transfers[index].quantity =
        this.facture.transfers[index].quantity + 1;
    else this.facture.transfers.push(productNew);
  }

  // @Mutation
  // removeItem(sale: Sale) {
  //     const index = this.facture.sales.findIndex((e) => e.product_id == sale.product_id);
  //     this.facture.sales.splice(index, 1);
  // }
  //
  // @Mutation
  // deleteItemById(saleId: Number) {
  //     const index = this.facture.sales.findIndex((e) => e.id == saleId);
  //     this.facture.sales.splice(index, 1);
  // }

  @Mutation
  clearCart() {
    this.facture.transfers = [];
  }

  deleteSale(id: number): Promise<any> {
    return SaleApi.deleteSale(id).then((x) => x);
  }
}

export default new ExportModule({
  store: store,
  name: "exportModule",
});
