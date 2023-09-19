<template>
  <v-dialog v-model="dialog" scrollable max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn color="primary" large elevation="1">
          {{ $t("add_product") }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card
      v-if="dialog"
      color="plain"
      v-shortkey="['enter']"
      @shortkey="addToCartUsingEnterKey()"
    >
      <v-card-title class="primary--text font-weight-bold">
        <span> {{ $t("add_product_cart") }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row class="mt-1">
            <v-text-field
              autofocus
              :hint="$t('product_search')"
              :label="$t('product_search')"
              :placeholder="$t('product_search')"
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
              :loading="loading"
              loading-text="جاري تحميل البيانات ..."
              @click:row="rowClick"
              @dblclick:row="addToCartUsingEnterKey"
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
              <!-- <template v-slot:[`item.actionUp`]="{ item }">
                <v-btn color="success" icon @click="moveUp(item.id)">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
              </template> -->
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
              <template v-slot:item.quantity="{ item }">
                <v-chip :color="getColor(item)" dark>
                  {{ item.quantity }}
                </v-chip>
              </template>
            </v-data-table></v-card
          >
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
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import SnackBarModule from "@/store/snackBarModule";
import Stocks from "@/classes/stock";
import stockApi from "@/api/stockApi";
import saleModule from "@/store/saleModule";
import Stock from "@/classes/stock";
import Sale from "@/classes/sale";
import Search from "@/classes/search";
import Decoded from "@/helper/decode";
import { getQteFromSearch, getSelectPrice } from "@/helper/global_function";
import settingModule from "@/store/settingModule";
import { Setting } from "@/classes/setting";
import { Debounce } from "vue-debounce-decorator";

@Component({ components: {} })
export default class ManageProductSale extends Vue {
  headersProducts = [
    // { text: "الباركود", value: "barcode" },
    { text: "الاسم", value: "name" },
    { text: "المرجع", value: "reference" },
    { text: " الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "", value: "actions" },
  ];
  loading = false;

  @Prop({ default: 0 }) expenseAction!: number;

  public dialog = false;
  valid = true;
  stock = { alternatives: [], accessoires: [] } as Stock;

  created() {
    this.$root.$on("searchManageSale", (search: string) => {
      this.search.name = search;

      this.dialog = true;
    });
  }
  get setting(): Setting {
    return settingModule.getSetting;
  }

  addToCart(stock: Stock): void {
    const sale = Object.assign({}, {
      quantity: getQteFromSearch(stock, this.search),
      product_id: stock.id,
      name: stock.name,
      sell_price: getSelectPrice(stock, this.setting),
      barcode: stock.barcode,
      total: stock.sell_price,
      price: stock.price,
      alternatives: stock.alternatives,
      accessoires: stock.accessoires,
      product: stock,
    } as Sale);

    saleModule.addItem(sale);
  }

  close(): void {
    this.dialog = false;
  }

  onChangeBarcode(text: any): void {
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }
  clearInput(): void {
    this.search.name = "";
  }

  liststock = [] as Stocks[];
  count = 0;

  search = new Search();

  @Watch("search", { deep: true })
  onChange() {
    this.getProducts(this.search);
  }

  // moveUp(id: number) {
  //   const index = this.liststock.findIndex((e) => e.id == id);
  //   if (index > 0) {
  //     const el = this.liststock[index];
  //     this.$set(this.liststock, index, this.liststock[index - 1]);
  //     this.$set(this.liststock, index - 1, el);
  //   }
  // }
  addToCartUsingEnterKey() {
    // console.log("dbCLick");
    // row.select(true);

    // this.selectedItem = item;
    if (this.selectedItem.id) {
      this.addToCart(this.selectedItem);
    }
  }
  @Debounce(80)
  getProducts(search?: Search): void {
    this.loading = true;
    stockApi
      .getStock(search)
      .then((response) => {
        this.loading = false;

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
        this.loading = false;
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

  getColor(item: Stocks): string {
    if (item.quantity <= 0) return "red";
    else if (item.quantity <= item.quantity_alert) return "orange";
    else return "green";
  }
  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
      this.selectedItem = item;
    } else {
      // row.select(false);
      // this.selectedItem = {} as Stock;
    }
  }
}
</script>
