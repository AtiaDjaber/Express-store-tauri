<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <v-col cols="3">
        <v-text-field
          outlined
          dense
          append-icon="fa-search"
          clearable
          label="البحث باسم الصنف او الباركود"
          v-model="search.name"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-autocomplete
          :items="listfournisseurs"
          item-text="name"
          item-value="id"
          v-model="search.fournisseur_id"
          outlined
          hide-details
          dense
          placeholder="اكتب اسم المورد"
          label="المورد"
          prepend-inner-icon="mdi-account-search"
          clearable
        ></v-autocomplete>
      </v-col>

      <!--      <v-col cols="2">-->
      <!--        <v-combobox-->
      <!--          v-model="search.type"-->
      <!--          :items="items"-->
      <!--          label="النوع"-->
      <!--          outlined-->
      <!--          dense-->
      <!--        ></v-combobox>-->
      <!--      </v-col>-->

      <v-col>
        <c-date-picker
          dense
          outlined
          v-model="search.from"
          label="تاريخ البداية"
          clearable
          @eventname="clearFrom"
        ></c-date-picker>
      </v-col>

      <v-col>
        <c-date-picker
          dense
          outlined
          @eventname="clearTo"
          v-model="search.to"
          label="تاريخ النهاية"
          clearable
        ></c-date-picker>
      </v-col>
    </v-row>

    <v-data-table
      :headers="Headers"
      :items="listhisory"
      single-select
      @click:row="rowClick"
      show-expand
      class="elevation-1"
      :items-per-page="perPage"
      :server-items-length="count"
      @update:options="paginate"
      :footer-props="{
        'items-per-page-options': [10, 10],
        'show-current-page': true,
        'show-first-last-page': true,
        'page-text': 'رقم الصفحة',
        'items-per-page-text': 'عدد الأسطر',
      }"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class="mt-3">
            <v-data-table
              :headers="SaleHeaders"
              :items="item.purchases"
              single-select
              item-key="name"
              class="elevation-1 headers-grey mb-3"
              color="red"
              hide-default-footer
              :footer-props="{
                'items-per-page-options': [10, 10],
                'show-current-page': true,
                'show-first-last-page': true,
                'page-text': 'رقم الصفحة',
                'items-per-page-text': 'عدد الأسطر',
              }"
            ></v-data-table>
          </div>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import historyApi from "@/api/historyApi";
import Search from "@/classes/search";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import CDatePicker from "@/components/CDatePicker.vue";

import FournisseurApi from "@/api/fournisseurApi";
import FournisseurFacture from "@/classes/fournisseurFacture";
import Fournisseur from "@/classes/fournisseur";

@Component({
  components: { DeleteDialog, CDatePicker },
})
export default class HistoryPurchaseView extends Vue {
  Headers = [
    // {text: "المخزن", value: "depot.name"},
    { text: "#", value: "id" },
    { text: "المورد", value: "fournisseur.name" },
    { text: "المبلغ", value: "montant" },
    { text: "الدفع", value: "pay" },
    { text: "الباقي", value: "rest" },
    { text: "تخفيض", value: "remise" },
    { text: "ملاحظة", value: "remark" },
    { text: "تاريخ", value: "created_at" },
    { text: "", value: "data-table-expand" },
  ];

  SaleHeaders = [
    { text: "#", value: "id", class: "grey lighten-4" },
    { text: "الباركود", value: "barcode", class: "grey lighten-4" },
    { text: "الصنف", value: "name", class: "grey lighten-4" },
    { text: "الكمية", value: "quantity", class: "grey lighten-4" },
    { text: "السعر", value: "purchase_price", class: "grey lighten-4" },
    { text: "المبلغ الاجمالي", value: "total", class: "grey lighten-4" },
  ];

  search = new Search();

  count = 0;
  private apiFournisseur = new FournisseurApi();
  private api = new historyApi();
  listhisory = [] as FournisseurFacture[];
  selecthistory = {} as FournisseurFacture;
  perPage = 0;
  selectedFournisseur = {} as Fournisseur;
  listfournisseurs = [] as Fournisseur[];
  findfacture: any;

  getapiFournisseur(url?: string) {
    this.apiFournisseur.getAllFournisseurs(url).then((data) => {
      this.listfournisseurs = data as Fournisseur[];
    });
  }

  getapi(search?: Search) {
    this.api.getFourinsseurFactures(search).then((data) => {
      this.listhisory.length = 0;
      this.count = 0;
      ((data as any).data as FournisseurFacture[]).forEach((s) => {
        this.listhisory.push(s);
      });
      if (this.listhisory.length > 0) this.count = (data as any as any).total;
      this.perPage = (data as any as any).per_page;
    });
  }

  created() {
    this.getapiFournisseur();
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
    }
  }

  @Watch("search", { deep: true })
  searchbydate() {
    this.getapi(this.search);
  }

  clearFrom() {
    this.search.from = "";
  }

  clearTo() {
    this.search.to = "";
  }

  paginate(obj: any) {
    this.search.url = obj.page;
    this.getapi(this.search);
  }
}
</script>
<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}
</style>
