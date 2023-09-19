import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from ".";
import Sale from "@/classes/sale";
import Facture from "@/classes/facture";
import SaleApi from "@/api/saleApi";
import SnackBarModule from "@/store/snackBarModule";
import settingModule from "./settingModule";

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
    const index = this.cartList[this.currentCart].sales.findIndex(
      (e) => e.product_id == productNew.product_id
    );
    if (index >= 0) {
      // eslint-disable-next-line prefer-const
      let saleItem = this.cartList[this.currentCart].sales[index];
      const available = this.checkQuantity(saleItem);

      if (available || saleItem.product.name == "DIVERS") {
        saleItem.quantity = saleItem.quantity + productNew.quantity;
      } else {
        if (settingModule.setting.negative_stock) {
          saleItem.quantity = saleItem.quantity + productNew.quantity;
        }
      }
      this.checkPackagePrice(saleItem);
    } else {
      if (productNew.name != undefined) {
        productNew.quantity = 0;
        const available = this.checkQuantity(productNew);
        productNew.quantity = 1;
        if (available) {
          this.cartList[this.currentCart].sales.splice(0, 0, productNew);
        } else {
          if (settingModule.setting.negative_stock) {
            this.cartList[this.currentCart].sales.splice(0, 0, productNew);
          }
        }
      }
    }
  }

  checkQuantity(sale: Sale) {
    const avail =
      sale.product.quantity > sale.quantity ||
      sale.product.name == "DIVERS" ||
      sale.product.name == undefined;

    if (!avail) {
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
    return avail;
  }

  checkPackagePrice(sale: Sale) {
    if (sale.product.packing_size != null) {
      if (sale.product.packing_size <= sale.quantity) {
        sale.sell_price = sale.product.packing_price ?? sale.product.sell_price;
      } else {
        sale.sell_price = sale.product.sell_price;
      }
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
