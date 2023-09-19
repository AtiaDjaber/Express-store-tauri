<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <div class="pt-3">
        <ManageProductPurchase />
      </div>
      <v-col cols="3">
        <v-text-field
          ref="barcodeRef"
          :hint="$t('product_search')"
          :label="$t('product_search')"
          :placeholder="$t('product_search')"
          required
          append-icon="fa-search"
          prepend-inner-icon="mdi-barcode-scan"
          flat
          solo
          :value="search.name"
          @keyup.enter="manageSearch"
          @keyup="onChangeBarcodeSearch"
          @click:clear="clearInput"
          clearable
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>

      <v-col class="mt-2">
        <span> {{ facture.id ? "الفاتورة  # " + facture.id : "" }}</span>
      </v-col>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-2 mt-3"
        large
        outlined
        dark
        color="red "
        @click="clearCart()"
      >
        تنظيف السلة
        <v-icon right>mdi-delete-outline</v-icon>
      </v-btn>
      <v-btn
        class="ml-2 mt-3"
        dark
        large
        color="red "
        v-show="facture.id != null"
        @click="addNewFacture"
      >
        إلغاء التعديل
        <v-icon right>mdi-cancel</v-icon>
      </v-btn>
      <v-btn
        class="ms-2 mt-3"
        color="green darken-1"
        large
        style="color: white"
        v-shortkey="['f1']"
        @shortkey="saveFacture(false)"
        :disabled="
          facture.fournisseur_id == null || facture.purchases.length < 2
        "
        @click="saveFacture()"
      >
        حفظ F1
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            large
            v-on="on"
            class="mx-2 mt-3"
            style="color: white"
            color="blue darken-1"
            :disabled="
              facture.fournisseur_id == null || facture.purchases.length < 2
            "
            v-shortkey="['f2']"
            @shortkey="saveFacture(true)"
            @click="saveFacture(true)"
          >
            طباعة F2
            <v-icon right>mdi-printer-outline</v-icon>
          </v-btn>
        </template>
        <span>Press F2</span>
      </v-tooltip>
      <v-col cols="auto">
        <v-autocomplete
          :items="listFournisseur"
          v-model="facture.fournisseur_id"
          item-text="name"
          item-value="id"
          solo
          flat
          :disabled="facture.id != null"
          hide-details
          placeholder="اكتب اسم المورد"
          label="المورد"
          prepend-inner-icon="mdi-account-search"
          :clearable="facture.id == null"
        ></v-autocomplete>
      </v-col>
      <manage-fournisseur :isFab="true" :teacherAction="1" />

      <!--      <v-btn-->
      <!--          outlined-->
      <!--          class="ml-2 mt-3"-->
      <!--          color="grey darken-3"-->
      <!--          :disabled="facture.fournisseur_id == null"-->
      <!--          @click="saveFacture()"-->
      <!--      >-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>
    <v-row no-gutters></v-row>

    <div v-resize="onResize">
      <v-card outlined>
        <v-data-table
          :headers="Headers"
          :items="facture.purchases"
          @click:row="rowClick"
          hide-default-footer
          fixed-header
          :height="windowSize.y - 345"
          :items-per-page="-1"
          single-select
        >
          <template v-slot:item.barcode="{ item, index }">
            <v-text-field
              style="width: auto"
              label="الباركود"
              flat
              solo
              dense
              clearable
              hide-details
              @keyup="onChangeBarcode(item, index)"
              v-model="item.barcode"
            >
              <template v-slot:prepend-inner>
                <v-icon @click="generateBarcode(item, index)"
                  >mdi-barcode</v-icon
                >
              </template></v-text-field
            >
          </template>

          <template v-slot:[`item.name`]="{ item }">
            <v-text-field
              style="width: auto"
              label="اسم الصنف"
              flat
              solo
              dense
              clearable
              hide-details
              v-model="item.name"
            ></v-text-field>
          </template>

          <template v-slot:item.quantity="{ item, index }">
            <v-text-field
              style="width: 150px"
              label="الكمية"
              flat
              dense
              class="centered-input"
              solo
              hide-details
              type="number"
              hide-spin-buttons
              v-model="item.quantity"
              @input="editItem(item, index)"
            >
              <template v-slot:append>
                <v-icon @click="item.quantity++">mdi-plus</v-icon>
              </template>
              <template v-slot:prepend-inner>
                <v-icon @click="item.quantity--">mdi-minus</v-icon>
              </template>
            </v-text-field>
          </template>
          <template v-slot:item.price="{ item, index }">
            <v-text-field
              style="width: 70%"
              label="سعر البيع"
              flat
              dense
              solo
              hide-details
              type="number"
              v-model="item.price"
              @input="editItem(item, index)"
            ></v-text-field>
          </template>

          <template v-slot:item.purchase_price="{ item, index }">
            <v-text-field
              style="width: 70%"
              label="سعر الشراء"
              flat
              solo
              dense
              hide-details
              type="number"
              v-model="item.purchase_price"
              @input="editItem(item, index)"
            ></v-text-field>
          </template>

          <template v-slot:[`item.actions`]="{ item, index }">
            <v-row>
              <!--         v-if="item.id==null"-->
              <v-btn
                @click="deleteItem(item, index)"
                fab
                outlined
                small
                color="red"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <!--          <delete-dialog v-else :id="item.id" :source="'SALE'"/>-->
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <v-col>
      <!-- <v-footer padless color="white"> -->
      <v-row class="">
        <v-col cols="2">
          <v-text-field
            solo
            flat
            readonly
            v-model="facture.montant"
            append-icon="mdi-search"
            persistent-hint
            label="مبلغ الفاتورة  "
            hint="مبلغ الفاتورة"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="px-2" v-if="facture.fournisseur != null">
          <v-text-field
            flat
            background-color="primary lighten-3"
            solo
            v-model="facture.fournisseur.montant"
            persistent-hint
            hint="دين قديم"
            placeholder="دين قديم"
            prefix="DA"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            solo
            flat
            type="number"
            v-model="facture.remise"
            append-icon="mdi-percent"
            hint="تخفيض"
            persistent-hint
            label="تخفيض"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            solo
            flat
            type="number"
            v-model="facture.pay"
            append-icon="mdi-cash"
            hint="الدفع"
            persistent-hint
            label="الدفع "
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            solo
            flat
            readonly
            v-model="getRest"
            persistent-hint
            hint="الباقي"
            label="الباقي"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            flat
            solo
            hint="ملاحظة"
            persistent-hint
            v-model="facture.remark"
            append-icon="mdi-pencil"
            label="ملاحظة"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- </v-footer> -->
    </v-col>

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="#fb6333"
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <!-- <div id="facture" class="pa-3" style="width: 1000px">
      <v-row no-gutters class="mt-6">
        <v-col cols="6">
          <v-col>
            <v-row justify="center" class="mb-2">
              <h2>
                {{ setting.name_store }}
              </h2>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col v-if="setting.logo != null" cols="3">
                <v-img
                  class="mt-n6"
                  style="align: right"
                  height="100px"
                  width="100px"
                  contain
                  :src="setting.logo"
                >
                </v-img>
              </v-col>
              <v-col>
                <v-row>
                  <p class="mr-2">
                    <v-icon>mdi-map-marker-outline</v-icon>
                    {{ setting.address }}
                  </p>
                </v-row>
                <v-row>
                  <p class="mr-2">
                    <v-icon> mdi-phone-outline</v-icon>
                    {{ setting.tel }}
                  </p>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
        <v-divider vertical></v-divider>
        <
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2>فاتورة شراء</h2>
          </v-row>
          <p class="mt-6">رقم الفاتورة : {{ facture.id }}</p>
          <p>
            اسم المورد :
            {{
              facture.fournisseur != null
                ? facture.fournisseur.name
                : "غير محدد"
            }}
          </p>
          <p>التاريخ : {{ facture.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
        :headers="Headers"
        :items="facture.purchases"
        disable-sort
        hide-default-footer
        :items-per-page="-1"
        class="elevation-0 mt-5"
      >
      </v-data-table>

      <v-row class="mt-4"></v-row>
      <p class="mt-4 mr-2">المدفوع : {{ facture.pay }}</p>
      <p class="mr-2">التخفيض : {{ facture.remise }}</p>
      <p class="mr-2">الباقي : {{ facture.rest }}</p>

      <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
        <h4 class="mr-2">المجموع : {{ facture.montant }}</h4>
        <v-col cols="6"></v-col>
        <h4 class="mr-2" style="text-align: left">
          {{ setting.remark }}
        </h4>
      </v-row>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import ManageProductPurchase from "@/views/purchase/dialog/ManageProductPurchase.vue";
import Fournisseur from "@/classes/fournisseur";
import FournisseurApi from "@/api/fournisseurApi";
import purchaseModule from "@/store/purchaseModule";
import FournisseurFacture from "@/classes/fournisseurFacture";
import FournisseurFactureApi from "@/api/fournisseurFactureApi";
import Purchase from "@/classes/purchase";
import VueBarcode from "vue-barcode";

import SnackBarModule from "@/store/snackBarModule";
import fournisseur from "@/classes/fournisseur";
import depotApi from "@/api/depotApi";
import Depot from "@/classes/depot";
import { Setting } from "@/classes/setting";
import SettingApi from "@/api/setting_api";
import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";
import Decoded from "@/helper/decode";
import ManageFournisseur from "../fournisseur/dialog/ManageFournisseur.vue";
import stockApi from "@/api/stockApi";
import Search from "@/classes/search";
import Stock from "@/classes/stock";

@Component({
  components: {
    ManageProductPurchase,
    barcode: VueBarcode,
    ManageFournisseur,
  },
})
export default class PurchaseView extends Vue {
  Headers = [
    { text: "#", value: "count" },
    { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر الشراء", value: "purchase_price" },
    { text: "سعر البيع", value: "price" },
    { text: "المبلغ الإجمالي", value: "total" },

    { text: "", value: "actions" },
  ];

  facture = {
    montant: 0,
    pay: 0,
    rest: 0,
    remise: 0,
    purchases: [],
  } as FournisseurFacture;

  apiFacture = new FournisseurFactureApi();
  search = new Search();

  @Ref() readonly barcodeRef: any;

  totalCredit = 0;

  loading = false;
  count = 0;
  // private api = new fournisseurApi();
  perPage = 0;

  get getRest() {
    this.facture.rest =
      Number(this.facture.montant) -
      Number(this.facture.pay) -
      Number(this.facture.remise);
    return this.facture.rest;
  }

  editItem(purchase: Purchase, index: number): void {
    this.facture.purchases[index].quantity = purchase.quantity;
    this.facture.purchases[index].price = purchase.price;
    this.facture.purchases[index].purchase_price = purchase.purchase_price;
    this.facture.purchases[index].total =
      Number(purchase.quantity) * Number(purchase.purchase_price);
  }

  focusBarcodeField(): void {
    this.$nextTick(() => this.barcodeRef.focus());
  }
  onChangeBarcodeSearch(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  generateBarcode(item, index): void {
    stockApi.getBarcode().then((res) => {
      this.facture.purchases[index].barcode = res.data;

      item.barcode = res.data;
      this.$forceUpdate();
    });
  }
  emptyRow(): void {
    this.facture.purchases.push({
      count: this.facture.purchases.length + 1,
      total: 0.0,
      price: 0.0,
      quantity: 0,
      purchase_price: 0.0,
    } as Purchase);
  }

  created(): void {
    this.emptyRow();

    this.$root.$on("createdFournisseur", (newFour: fournisseur) => {
      this.listFournisseur.unshift(newFour);
      this.facture.fournisseur = newFour;
      this.facture.fournisseur_id = newFour.id;
    });
    this.$root.$on("editFactureFournisseur", (_: any) => {
      this.facture = purchaseModule.getFacture;
    });
    this.facture = purchaseModule.getFacture;
    this.$root.$on("deletedSaleId", (saleId: number) => {
      const index = this.facture.purchases.findIndex((e) => e.id == saleId);
      if (index >= 0) this.facture.purchases.splice(index, 1);
    });

    this.getapi();
  }

  @Watch("facture.purchases", { deep: true })
  onChange() {
    this.calcule();
  }

  @Watch("facture.purchases", { deep: true, immediate: true })
  onFillRow() {
    const indexEmpty = this.facture.purchases.findIndex((e) => e.name == null);
    if (indexEmpty < 0) {
      this.emptyRow();
    }
  }

  selectedSale = {} as Purchase;

  calcule() {
    for (let i = 0; i < this.facture.purchases.length; i++) {
      this.facture.purchases[i].total =
        Number(this.facture.purchases[i].quantity) *
        Number(this.facture.purchases[i].purchase_price);
    }

    this.facture.montant = 0;

    this.facture.purchases.forEach((product, index) => {
      product.count = index + 1;
      this.facture.montant =
        Number(this.facture.montant) + Number(product.total);
    });
  }

  public addNewFacture(): void {
    purchaseModule.setFacture({
      montant: 0,
      pay: 0,
      rest: 0,
      remise: 0,
      purchases: [],
    } as FournisseurFacture);
    // setTimeout(() => {
    this.facture = purchaseModule.getFacture;
    // }, 20);
  }
  onChangeBarcode(item: any, index: number): void {
    console.log(item);
    item.barcode = Decoded.DecodedBarcode(item.barcode);
    this.facture.purchases[index].barcode = item.barcode;
    this.$forceUpdate();
  }

  get setting() {
    return settingModule.getSetting;
  }

  clearCart() {
    purchaseModule.clearCart();
    this.emptyRow();
  }
  listStock = [] as Stock[];

  manageSearch(): void {
    stockApi
      .getStock(this.search)
      .then((response) => {
        if (response.status == 200) {
          this.listStock = response.data["data"];

          if (this.listStock.length == 1) {
            let stock = this.listStock[0];
            let purchase = Object.assign({}, {
              quantity: 1,
              product_id: stock.id,
              name: stock.name,
              purchase_price: stock.price,
              barcode: stock.barcode,
              total: 0,
              price: stock.sell_price,
            } as Purchase);

            // this.$root.$emit("addItem",  purchase);
            purchaseModule.addItem(purchase);
          } else {
            if (this.listStock.length > 1) {
              this.$root.$emit("searchManagePurchase", this.search.name);
            } else {
              SnackBarModule.setSnackbar({
                text: "المنتج غير موجود",
                color: "error",
                timeout: 2000,
                show: true,
                icon: "mdi-alert-outline",
                x: "right",
                y: "top",
              });
            }
          }
        }
        this.search.name = "";
      })
      .catch((error) => {
        SnackBarModule.setSnackbar({
          text: error,
          color: "error",
          timeout: 2000,
          show: true,
          icon: "mdi-alert-outline",
          x: "right",
          y: "top",
        });
      });
  }

  clearInput(): void {
    this.search.name = "";
  }
  saveFacture(print = false): void {
    this.loading = true;

    this.apiFacture
      .saveFacture(this.facture)
      .then((res) => {
        this.facture = res["data"];
        let copyFacture = Object.assign({}, this.facture);

        // PrintImage.print(document.getElementById("facture") as HTMLElement);
        this.addNewFacture();
        this.loading = false;
        if (print) {
          if (this.setting.isReceiptDefault) {
            PrintImage.printBon(this.setting, copyFacture as any, "مورد");
          } else {
            PrintImage.printFacturePdf(
              this.setting,
              copyFacture as any,
              "مورد"
            );
          }
        }
        // PrintImage.printFacturePdf(this.setting, copyFacture as any, "مورد");

        this.$root.$emit("updateFactures", "");
        SnackBarModule.setSnackbar({
          text: "تم إضافة الفاتورة بنجاح",
          color: "success",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      })
      .catch((err) => {
        this.loading = false;
        SnackBarModule.setSnackbar({
          text: "خطأ,فشل إضافة الفاتورة",
          color: "red",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      });
  }

  listFournisseur = [] as Fournisseur[];

  getapi(url?: string): void {
    FournisseurApi.getAllFournisseurs(url).then((data) => {
      this.listFournisseur = data as Fournisseur[];
    });
  }

  @Watch("facture.fournisseur_id", { immediate: true, deep: true })
  selectClient(): void {
    this.facture.fournisseur = this.listFournisseur.find(
      (e) => e.id == this.facture.fournisseur_id
    );
  }

  deleteItem(purchase: Purchase, index: number): void {
    // const index = this.facture.purchases.findIndex(
    //   (e) => e.product_id == purchase.product_id
    // );
    this.facture.purchases.splice(index, 1);
  }

  clearAll() {
    // purchaseModule.clearCart();
  }
  windowSize = { x: 0, y: 0 };

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
  rowClick(item: any, row: any) {
    // if (!row.isSelected) {
    //   row.select(true);
    //   this.selectedSale = item;
    // } else {
    //   row.select(false);
    //   this.selectedSale = {} as Purchase;
    // }
  }
}
</script>
<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}

/*::v-deep table.v-table tbody td {*/
/*  font-size: 20px !important;*/
/*}*/
.v-data-table ::v-deep th {
  font-size: 14px !important;
}

.v-data-table ::v-deep td {
  font-size: 16px !important;
}

#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}

.border {
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 20px;
  background-color: #0d47a1;
  border-color: #f54c14;
  text-decoration: none;
}

::v-deep .centered-input input {
  text-align: center;
}
</style>
