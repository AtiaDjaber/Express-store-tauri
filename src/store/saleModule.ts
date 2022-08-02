import ClientApi from "@/api/clientApi";
import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import store from ".";
import Sale from "@/classes/sale";
import Client from "@/classes/client";
import Facture from "@/classes/facture";
import SaleApi from "@/api/saleApi";

@Module({generateMutationSetters: true})
class SaleModule extends VuexModule {
    private api = new SaleApi();
    facture = {
        montant: 0, pay: 0, rest: 0, remise: 0,
        sales: [],
    } as Facture;

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

    get getFacture() {
        return this.facture;
    }


    @Mutation
    setFacture(facture: Facture) {
        this.facture = facture;
    }

    // @Mutation
    // setSales(sale: Sale[]) {
    //     this.facture.sales = sale;
    // }

    // @Mutation
    // setClient(client: Client) {
    //     // debugger
    //     // this.facture.client = client;
    //     this.facture = {montant: 0, pay: 0, rest: 0, remise: 0, sales: [],client:client} as Facture;
    // }

    @Mutation
    addItem(sale: Sale) {
        const productNew = Object.assign({}, sale);
        productNew.count = this.facture.sales.length + 1;

        const index = this.facture.sales.findIndex(
            (e) => e.product_id == productNew.product_id
        );
        if (index >= 0)
            this.facture.sales[index].quantity = this.facture.sales[index].quantity + 1;
        else {

            this.facture.sales.push(productNew);
        }
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
        this.facture.sales = [];
    }

    // @Mutation
    // editItem(sale: Sale) {
    //     const index = this.facture.sales.findIndex(
    //         (e) => e.product_id == sale.product_id
    //     );
    //     console.log("combo");
    //     console.log(sale)
    //     this.facture.sales[index].type = sale.type;
    //     this.facture.sales[index].duration = sale.duration;
    //     this.facture.sales[index].quantity = sale.quantity;
    //     this.facture.sales[index].total = Number(sale.duration) * Number(sale.quantity)
    //         * Number(sale.type == "يوم" ? sale.priceRentDay : sale.priceRentHour);
    //
    //     // this.facture.montant = 0;
    //     // this.facture.sales.forEach((prodct, index) => {
    //     //     prodct.count = index + 1;
    //     //     this.facture.montant = this.facture.montant + prodct.total;
    //     // });
    //     // this.facture.rest = Number(this.facture.montant) - Number(this.facture.pay);
    //     // this.totalCredit =
    //     //     (Number(this.facture.montant) + Number((this.facture.client.montant) ?? 0));
    //
    // }

    deleteSale(id: number): Promise<any> {
        return this.api.deleteSale(id).then((x) => x);
    }

    // newFacture() {
    //     this.facture = {montant: 0, pay: 0, rest: 0, remise: 0, sales: []} as Facture;
    // }
}

export default new SaleModule({
    store: store,
    name: "saleModule",
});
