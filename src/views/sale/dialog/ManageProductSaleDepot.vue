<template>
  <v-dialog v-model="dialog" scrollable max-width="1000px">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn large color="primary" elevation="1">
          اضافة صنف
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="primary--text">
        <span> اضافة صنف للسلة</span>
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

          <v-data-table
            class="mb-n3"
            :headers="headersProducts"
            :items="liststock"
            single-select
            dense
            :loading="loading"
            loading-text="جاري تحميل البيانات ..."
            @keyup.enter="addToCartUsingEnterKey"
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
import SnackBarModule from "@/store/snackBarModule";
import stockApi from "@/api/stockApi";
import exportModule from "@/store/exportModule";
import Sale from "@/classes/sale";
import Search from "@/classes/search";
import Transfer from "@/classes/transfer";
import ProductDepot from "@/classes/product_depot";
import saleModule from "@/store/saleModule";
import settingModule from "@/store/settingModule";
import Decoded from "@/helper/decode";
import { Debounce } from "vue-debounce-decorator";

@Component({ components: {} })
export default class ManageProductSaleDepot extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  depotId = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  selectedItem = {} as ProductDepot;

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
  loading = false;

  created() {
    this.search.depot_id = settingModule.getSetting.depot_id;
    // this.getProductDepot(this.search);
    this.$root.$on("depotIdFromSale", (depotId: number) => {
      this.search.depot_id = depotId;
    });
    this.$root.$on("searchManageDepot", (search: string) => {
      this.search.name = search;

      this.dialog = true;
    });
  }

  onChangeBarcode(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }
  clearInput(): void {
    this.search.name = "";
  }
  addToCart(item: ProductDepot): void {
    item.product.quantity = item.quantity;
    let sale = Object.assign({}, {
      quantity: 1,
      product_id: item.product_id,
      name: item.product.name,
      sell_price: item.sell_price ? item.sell_price : item.product.sell_price,
      barcode: item.product.barcode,
      total: 0,
      price: item.product.price,
      alternatives: item.product.alternatives,
      accessoires: item.product.accessoires,
      product: item.product,
    } as Sale);

    saleModule.addItem(sale);
  }

  close() {
    this.depotId = 1;
    this.dialog = false;
  }

  count = 0;
  headersProducts = [
    // {text: "الرقم", value: "product_id"},
    // {text: "الباركود", value: "product.barcode"},
    { text: "الصنف", value: "product.name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    // {text: "تاريخ", value: "created_at"},
    { text: "", value: "actions" },
    // {text: "", value: "data-table-expand"},
  ];

  search = new Search();

  @Watch("search", { deep: true })
  onChange() {
    this.getProductDepot(this.search);
  }

  liststock = [] as ProductDepot[];

  @Debounce(80)
  getProductDepot(search?: Search): void {
    this.loading = true;

    stockApi
      .getProductsDepot(search)
      .then((response) => {
        this.liststock = [];
        this.count = 0;
        this.loading = false;

        if (response.status == 200) {
          this.liststock = response.data.data as ProductDepot[];
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

  addToCartUsingEnterKey() {
    this.addToCart(this.selectedItem);
  }
  paginate(obj: any) {
    this.search.url = obj.page;
    // this.getProductDepot(this.search);
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedItem = item;
    } else {
      row.select(false);
      this.selectedItem = {} as ProductDepot;
    }
  }
}
</script>
