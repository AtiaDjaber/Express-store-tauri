<template>
  <v-dialog v-model="dialog" scrollable max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableExpenseAction == 2"
          color="primary"
          large
          elevation="1"
        >
          إضافة صنف
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title class="primary--text font-weight-bold">
        <span> اضافة صنف للسلة</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row class="mt-1">
            <v-text-field
              label="الصنف"
              placeholder="البحث باسم الصنف"
              hint="البحث باسم الصنف"
              required
              append-icon="fa-search"
              solo
              flat
              @keyup="onChangeBarcode"
              v-model="search.name"
              clearable
            ></v-text-field>
          </v-row>

          <v-card outlined>
            <v-data-table
              class="mb-n3"
              :headers="headersProducts"
              :items="liststock"
              single-select
              :server-items-length="count"
              :items-per-page="10"
              @update:options="paginate"
              :footer-props="{
                'items-per-page-options': [10, 10],
                'show-current-page': true,
                'show-first-last-page': true,
                'page-text': 'رقم الصفحة',
                'items-per-page-text': 'عدد الأسطر',
              }"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-row class="my-1">
                  <v-btn
                    color="green"
                    class="mr-2"
                    small
                    outlined
                    fab
                    elevation="0"
                    @click="addToCart(item)"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-table></v-card
          >
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn outlined large block color="red darken-1" @click="close"
          >إلغاء</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Ref, Prop, Watch } from "vue-property-decorator";
import expense from "@/classes/expense";
import Expense from "@/classes/expense";
import VExpense from "@/validation/vExpense";
import expenseApi from "@/api/expenseApi";
import SnackBarModule from "@/store/snackBarModule";
import Stocks from "@/classes/stock";
import stockApi from "@/api/stockApi";
import purchaseModule from "@/store/purchaseModule";
import Stock from "@/classes/stock";
import Purchase from "@/classes/purchase";
import Search from "@/classes/search";
import Decoded from "@/helper/decode";
import { Debounce } from "vue-debounce-decorator";
import commandFournisseurModule from "@/store/commandFournisseurModule";
import ItemCommandFournisseur from "@/classes/ItemCommandFournisseur";

@Component({ components: {} })
export default class ManageProductPurchase extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  mutableExpenseAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  @Prop({ default: "purchaseFournisseur" }) typeFacture!: string;

  save(date: string) {
    this.menu.save(date);
  }

  onChangeBarcode(text: any): void {
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  public dialog = false;
  valid = true;
  vexpense = new VExpense();

  Apiexpense = new expenseApi();

  created() {
    // this.getProducts("1");
    this.$root.$on("searchManagePurchase", (search: string) => {
      this.search.name = search;

      this.dialog = true;
    });
    this.mutableExpenseAction = this.expenseAction;
  }

  addToCart(stock: Stock) {
    console.log(this.typeFacture);
    if (this.typeFacture == "purchaseFournisseur") {
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
      let purchase = Object.assign({}, {
        quantity: 1,
        product_id: stock.id,
        name: stock.name,
        price: stock.sell_price,
      } as ItemCommandFournisseur);

      // this.$root.$emit("addItem",  purchase);
      commandFournisseurModule.addItem(purchase);
    }
  }

  close() {
    this.mutableExpenseAction = 1;
    this.dialog = false;
  }

  liststock = [] as Stocks[];
  count = 0;
  headersProducts = [
    // { text: "الباركود", value: "barcode" },
    { text: "الاسم", value: "name" },
    { text: "المرجع", value: "reference" },
    { text: " الكمية", value: "quantity" },
    { text: "السعر", value: "price" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "", value: "actions" },
  ];

  search = new Search();

  @Watch("search", { deep: true })
  onChange() {
    this.getProducts(this.search);
  }

  @Debounce(120)
  getProducts(search?: Search): void {
    stockApi
      .getStock(search)
      .then((response) => {
        this.liststock = [];
        // this.liststock.length = 0;
        if (response.status == 200) {
          (response.data.data as Stocks[]).forEach((x) => {
            this.liststock.push(x);
          });
          this.count = response.data.total;
        }
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

  paginate(obj: any) {
    this.search.url = obj.page;
    this.getProducts(this.search);
  }
}
</script>
