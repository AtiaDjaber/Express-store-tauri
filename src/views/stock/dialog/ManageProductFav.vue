<template>
  <v-dialog v-model="dialog" scrollable max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableExpenseAction == 2"
          outlined
          color="pink"
          large
          elevation="0"
        >
          إضافة صنف
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title class="primary--text font-weight-bold">
        <span> اضافة صنف للمفضلة</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row class="mt-1">
            <v-text-field
              label="الصنف"
              placeholder="البحث باسم الصنف"
              required
              append-icon="fa-search"
              flat
              solo
              :value="search.name"
              @keyup="onChangeBarcode"
              @click:clear="clearInput"
              clearable
            ></v-text-field>
          </v-row>

          <v-data-table
            class="mb-n3"
            :headers="headersProducts"
            :items="liststock"
            single-select
            dense
            @click:row="rowClick"
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
                  @click="addToFav(item)"
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
import saleModule from "@/store/saleModule";
import Stock from "@/classes/stock";
import Sale from "@/classes/sale";
import Search from "@/classes/search";
import Decoded from "@/helper/decode";
import Favorite from "@/classes/favorite";

@Component({ components: {} })
export default class ManageProductFav extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  mutableExpenseAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";
  favorite = {} as Favorite;

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
  //  TODO :disabled="mutableExpenseAction == 2 && !expenseobj.id"
  // expenseobj = {} as Expense;

  // vexpense = new VExpense();

  created() {
    this.mutableExpenseAction = this.expenseAction;

    this.$root.$on("selectedFavorite", (favorite: Favorite) => {
      this.favorite = favorite;
    });
  }

  addToFav(stock: Stock) {
    this.manage(this.favorite, stock);
  }

  close() {
    this.mutableExpenseAction = 1;
    this.dialog = false;
  }

  onChangeBarcode(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }
  clearInput(): void {
    this.search.name = "";
  }
  manage(favorite: Favorite, stock: Stocks) {
    stockApi
      .attachProductToFavorite(favorite, stock)
      .then((result: unknown) => {
        favorite.products.unshift(stock);
        console.log(favorite.products.length);
        // this.$root.$emit("addProductToFav", stock);
        SnackBarModule.setSnackbar({
          text: "تمت العملية بنجاح",
          color: "success",
          timeout: 2000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
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

  liststock = [] as Stocks[];
  count = 0;
  private apiStock = new stockApi();
  headersProducts = [
    // { text: "الباركود", value: "barcode" },
    { text: "الاسم", value: "name" },
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

  paginate(obj: any): void {
    this.search.url = obj.page;
  }
  selectedItem = {} as Stock;

  rowClick(item: any, row: any) {
    console.log("one CLick");

    if (!row.isSelected) {
      row.select(true);
      this.selectedItem = item;
    } else {
      row.select(false);
      this.selectedItem = {} as Stock;
    }
  }
}
</script>