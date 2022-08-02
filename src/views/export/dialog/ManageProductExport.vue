<template>
  <v-dialog v-model="dialog" scrollable max-width="900">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="depotId == 2 && !expenseobj.id"
          color="primary"
          elevation="5"
        >
          إضافة صنف
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="light-blue darken-4 white--text">
        <span> اضافة صنف للسلة</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row class="mt-1">
            <v-text-field
              color="blue darken-2"
              dense
              label="الصنف"
              placeholder="البحث باسم الصنف"
              required
              append-icon="fa-search"
              outlined
              v-model="search.name"
              clearable
            ></v-text-field>
          </v-row>

          <v-data-table
            class="mb-n3"
            :headers="headersProducts"
            :items="liststock"
            single-select
            dense
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
                  rounded
                  elevation="0"
                  @click="addToCart(item)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn outlined block color="grey darken-1" @click="close">إلغاء</v-btn>
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
import exportModule from "@/store/exportModule";
import Stock from "@/classes/stock";
import Sale from "@/classes/sale";
import Search from "@/classes/search";
import Transfer from "@/classes/transfer";

@Component({ components: {} })
export default class ManageProductExport extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  depotId = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  @Ref() bdayMenu!: any;
  bdayMenuState = false;
  bdayDate = "";

  saveBday(date: string) {
    this.menu.save(date);
  }

  public dialog = false;
  valid = true;

  created() {
    // this.getProducts("1");

    this.depotId = this.expenseAction;


  }

  addToCart(stock: Stock) {
    let sale = Object.assign({}, {
      quantity: 1,
      product_id: stock.id,
      name: stock.name,
      sell_price: stock.sell_price,
      barcode: stock.barcode,
      total:  stock.sell_price,
      price: stock.price,
    } as Transfer);

    exportModule.addItem(sale);
  }

  close() {
    this.depotId = null;
    this.dialog = false;
  }

  liststock = [] as Stocks[];
  count = 0;
  private apiStock = new stockApi();
  headersProducts = [
    { text: "الصنف", value: "name" },
    { text: " الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "", value: "actions" },
  ];

  search = new Search();

  @Watch("search", { deep: true })
  onChange() {
    this.getProducts(this.search);
  }

  getProducts(search?: Search): void {
    this.apiStock
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
