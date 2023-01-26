<template>
  <div class="mt-3">
    <v-row class="mx-3 my-2">
      <v-spacer></v-spacer>
      <v-text-field
        solo
        flat
        clearable
        append-icon="fa-search"
        hint="  البحث باسم الصنف او الباركود"
        placeholder="  البحث باسم الصنف او الباركود"
        v-model="search.name"
      ></v-text-field>
    </v-row>
    <v-data-table
      :headers="FactureHeaders"
      :items="liststock"
      single-select
      item-key="id"
      :server-items-length="count"
      @update:options="paginate"
      @click:row="rowClick"
      class="elevation-1 mt-3"
      :items-per-page="10"
      :footer-props="{
        'items-per-page-options': [10, 10],
        'show-current-page': true,
        'show-first-last-page': true,
        'page-text': 'رقم الصفحة',
        'items-per-page-text': 'عدد الأسطر',
      }"
    >
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import clientPayment from "@/classes/clientPayment";
import clientModule from "@/store/clientModule";
import snackBarModule from "@/store/snackBarModule";
import SnackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Client from "@/classes/client";
import Facture from "@/classes/facture";
import Sale from "@/classes/sale";
// import Facture from '../facture/Facture.vue';
import client from "@/classes/client";
import printe from "@/views/printe/PrinteViews.vue";
import printeDeatail from "@/views/printe/printeDetailFacture.vue";
import Search from "@/classes/search";
import saleModule from "@/store/saleModule";
import FactureTransfer from "@/classes/facture_transfer";
import Transfer from "@/classes/transfer";
import Depot from "@/classes/depot";
import ExportApi from "@/api/exportApi";
import Stocks from "@/classes/stock";
import ProductDepot from "@/classes/product_depot";
import stockApi from "@/api/stockApi";

@Component({ components: { DeleteDialog, CDatePicker, printe, printeDeatail } })
export default class ProductDepotView extends Vue {
  FactureHeaders = [
    { text: "الرقم", value: "product_id" },
    { text: "الباركود", value: "product.barcode" },
    { text: "الصنف", value: "product.name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "تاريخ", value: "created_at" },
    // {text: "", value: "actions"},
    // {text: "", value: "data-table-expand"},
  ];

  // SaleHeaders = [
  //   {text: "الصنف", value: "name", },
  //   {text: "الكمية", value: "quantity", },
  //   {text: "السعر", value: "price", },
  //   {text: "سعر البيع", value: "sell_price", },
  //   {text: "المبلغ الاجمالي", value: "total", },
  // ];
  search = new Search();

  apiExport = new ExportApi();

  Datafacture = {} as FactureTransfer;
  DataSales = {} as FactureTransfer;

  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  depotId = 0;
  clientMontant: number;
  FactureData = [] as FactureTransfer[];
  listFacture = [] as FactureTransfer[];
  transfers = [] as Transfer[];
  nameDepot = "";
  index: any;

  created() {
    this.$root.$on("selectedDepot", (item: Depot) => {
      this.nameDepot = item.name;
      this.search.depot_id = item.id;
    });
  }

  liststock = [] as ProductDepot[];
  private apiStock = new stockApi();

  getProductDepot(search?: Search): void {
    stockApi
      .getProductsDepot(search)
      .then((response) => {
        this.liststock = [];
        this.count = 0;

        if (response.status == 200) {
          this.liststock = response.data.data as ProductDepot[];
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

  @Watch("search", { deep: true })
  changedDepot() {
    if (this.search.depot_id) this.getProductDepot(this.search);
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.Datafacture = item;
      this.index = row.index;
      this.$root.$emit("index", this.index);
    } else {
      this.index = -1;
      this.$root.$emit("index", this.index);
      row.select(false);
    }
  }

  paginate(obj: any) {
    this.search.url = obj.page;

    if (this.search.depot_id) this.getProductDepot(this.search);
  }
}
</script>

<style scoped></style>
