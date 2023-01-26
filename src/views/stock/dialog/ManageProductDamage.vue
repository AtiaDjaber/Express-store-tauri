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
        <span> اضافة صنف تالف</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-row class="mt-1">
                <v-text-field
                  label="الصنف"
                  placeholder="البحث باسم الصنف"
                  hint="البحث باسم الصنف"
                  required
                  append-icon="fa-search"
                  solo
                  flat
                  :value="search.name"
                  @keyup="onChangeBarcode"
                  @click:clear="clearInput"
                  clearable
                ></v-text-field>
              </v-row>
              <v-card outlined>
                <v-data-table
                  class="mb-n3"
                  :headers="headersProducts"
                  :items="liststock"
                  single-select
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
                </v-data-table
              ></v-card>
            </v-col>
            <v-col
              cols="5"
              align-center
              align-self="center"
              v-show="selectedItem.id != null"
            >
              <v-card outlined>
                <v-footer height="55" color="white" elevation="0">
                  <h3>معلومات الصنف التالف</h3>
                </v-footer>
                <v-divider></v-divider>
                <v-footer
                  class="mx-2 mt-3"
                  height="47"
                  color="grey lighten-4"
                  rounded
                >
                  <v-col class="text-center" cols="12">
                    {{ selectedItem.name }}
                  </v-col>
                </v-footer>
                <v-col class="mt-2">
                  <v-text-field
                    placeholder="أدخل الكمية التالفة"
                    hint="الكمية التالفة"
                    required
                    flat
                    class="centered-input"
                    style="text-align: center"
                    v-model="damage.quantity"
                    solo
                    hide-details
                    hide-spin-buttons
                    background-color="grey lighten-4"
                    prepend-inner-icon="mdi-cart-minus"
                    type="number"
                    clearable
                  >
                    <template v-slot:append>
                      <v-icon @click="damage.quantity++">mdi-plus</v-icon>
                    </template>
                    <template v-slot:prepend-inner>
                      <v-icon @click="damage.quantity--">mdi-minus</v-icon>
                    </template></v-text-field
                  >
                </v-col>
                <v-col>
                  <v-select
                    v-model="damage.depot_id"
                    :items="listDepots"
                    item-text="name"
                    item-value="id"
                    hide-details
                    solo
                    flat
                    background-color="grey lighten-4"
                    label="المخزن"
                    placeholder="اختر مخزن البيع"
                    prepend-inner-icon="mdi-store-outline"
                    clearable
                  ></v-select>
                </v-col>
                <v-col justify-center>
                  <v-btn
                    large
                    color="primary darken-1"
                    class="my-3"
                    @click="manage()"
                    >إضافة الصنف</v-btn
                  >
                </v-col>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn outlined block color="red darken-1" @click="close">إلغاء</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Ref, Prop, Watch } from "vue-property-decorator";
import SnackBarModule from "@/store/snackBarModule";
import Stocks from "@/classes/stock";
import stockApi from "@/api/stockApi";
import saleModule from "@/store/saleModule";
import Stock from "@/classes/stock";
import Sale from "@/classes/sale";
import Search from "@/classes/search";
import Decoded from "@/helper/decode";
import Favorite from "@/classes/favorite";
import Damage from "@/classes/damage";
import DepotApi from "@/api/depotApi";
import Depot from "@/classes/depot";

@Component({ components: {} })
export default class ManageProductDamage extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  mutableExpenseAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  public dialog = false;
  valid = true;
  //  TODO :disabled="mutableExpenseAction == 2 && !expenseobj.id"
  // expenseobj = {} as Expense;

  // vexpense = new VExpense();

  private api = new DepotApi();
  listDepots = [] as Depot[];
  created() {
    this.api.getDepots(this.search).then((data) => {
      this.listDepots = [];

      this.listDepots = (data as any).data;
      this.listDepots.push({
        id: null,
        name: "المخزن الرئيسي",
      });
    });
    this.mutableExpenseAction = this.expenseAction;
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
  manage(): void {
    this.damage.price = this.selectedItem.price;
    this.damage.total = this.damage.price * this.damage.quantity;
    this.damage.product_id = this.selectedItem.id;
    stockApi
      .saveDamage(this.damage)
      .then((result: any) => {
        this.$root.$emit("createdDamage", result.data["data"]);
        this.getProducts(this.search);
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
    this.close();
  }

  liststock = [] as Stocks[];
  count = 0;
  headersProducts = [
    // { text: "الباركود", value: "barcode" },
    { text: "الاسم", value: "name" },
    { text: " الكمية", value: "quantity" },
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
  damage = { quantity: 1 } as Damage;

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
<style>
::v-deep .centered-input input {
  text-align: center;
}
</style>
