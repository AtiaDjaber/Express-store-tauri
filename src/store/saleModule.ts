import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import Sale from "@/classes/sale";
import Facture from "@/classes/facture";
import SaleApi from "@/api/saleApi";
import SnackBarModule from "@/store/snackBarModule";

@Module({ generateMutationSetters: true })
class SaleModule extends VuexModule {
  //   facture = this.emptyFacture();
  cartList = [this.emptyFacture()] as Facture[];

  date = new Date();
  currentCart = 0;
  // saleList = [] as Sale[];

  //   get getFacture() {
  //     return this.facture;
  //   }

  changeSelectedCart(index: number): void {
    this.currentCart = index;
  }

  get getFacture() {
    return this.cartList[this.currentCart];
  }

  get getListFacture() {
    return this.cartList;
  }
  getMax(): number {
    let max = 1;
    for (let i = 0; i < this.cartList.length; i++) {
      for (let j = 0; j < this.cartList.length; j++) {
        if (max < this.cartList[i].cartNumber) {
          max = this.cartList[i].cartNumber;
        }
      }
    }
    return max + 1;
  }
  @Mutation
  setFacture(facture: Facture) {
    // this.cartList[this.currentCart] = facture;
    this.cartList.push(
      Object.assign(
        { cartNumber: this.getMax(), cartName: "السلة" } as Facture,
        facture
      )
    );
    this.changeSelectedCart(this.cartList.length - 1);
  }

  @Mutation
  setCartList(cartList: any) {
    this.cartList = cartList;
  }
  @Mutation
  addItem(productNew: Sale) {
    // const productNew = Object.assign({}, sale);
    productNew.count = this.cartList[this.currentCart].sales.length + 1;

    const index = this.cartList[this.currentCart].sales.findIndex(
      (e) => e.product_id == productNew.product_id
    );
    if (index >= 0)
      this.cartList[this.currentCart].sales[index].quantity =
        this.cartList[this.currentCart].sales[index].quantity + 1;
    else {
      if (productNew.name != undefined) {
        this.cartList[this.currentCart].sales.splice(0, 0, productNew);
      }
      this.checkQuantity(productNew);
    }
  }
  checkQuantity(sale: Sale) {
    if (sale.product.quantity < 1) {
      SnackBarModule.setSnackbar({
        text: "الكمية غير متوفرة",
        color: "error",
        timeout: 2000,
        show: true,
        icon: "mdi-alert-outline",
        x: "right",
        y: "top",
      });
    }
    if (
      sale.product.date_expire != null &&
      new Date(sale.product.date_expire).getTime() - this.date.getTime() >= 0
    ) {
      SnackBarModule.setSnackbar({
        text: "تحذير انتهت صلاحية المنتج",
        color: "error",
        timeout: 6000,
        show: true,
        icon: "mdi-alert-outline",
        x: "left",
        y: "top",
      });
    }
  }
  @Mutation
  clearCart() {
    this.cartList[this.currentCart].sales = [];
  }

  @Mutation
  addNewFacture() {
    this.cartList[this.currentCart] = this.emptyFacture();
  }

  emptyFacture(cartNumber = 1): Facture {
    return {
      montant: 0,
      pay: 0,
      rest: 0,
      remise: 0,
      sales: [],
      cartName: "السلة",
      cartNumber: cartNumber,
    } as Facture;
  }
  @Action
  deleteSale(id: number): Promise<any> {
    return SaleApi.deleteSale(id).then((x) => x);
  }
}

export default new SaleModule({
  store: store,
  name: "saleModule",
});
