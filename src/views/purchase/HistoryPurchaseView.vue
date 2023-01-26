<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <v-col cols="3">
        <v-text-field
          flat
          solo
          hint="البحث باسم الصنف او الباركود"
          append-icon="fa-search"
          clearable
          label="البحث باسم الصنف او الباركود"
          v-model="search.name"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-autocomplete
          :items="listFournisseurs"
          item-text="name"
          item-value="id"
          v-model="search.fournisseur_id"
          flat
          solo
          hint="اكتب اسم المورد"
          hide-details
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
      <!--          -->
      <!--        ></v-combobox>-->
      <!--      </v-col>-->

      <v-col>
        <c-date-picker
          v-model="search.from"
          label="تاريخ البداية"
          clearable
          @eventname="clearFrom"
        ></c-date-picker>
      </v-col>

      <v-col>
        <c-date-picker
          @eventname="clearTo"
          v-model="search.to"
          label="تاريخ النهاية"
          clearable
        ></c-date-picker>
      </v-col>
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="listFactures"
        single-select
        @click:row="rowClick"
        show-expand
        class="elevation-0"
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
              <v-alert color="primary" dense type="info" border="left" text>{{
                item.remark ? item.remark : "لا توجد ملاحظة"
              }}</v-alert>
              <v-data-table
                :headers="SaleHeaders"
                :items="item.purchases"
                single-select
                item-key="name"
                class="elevation-1 headers-grey mb-3"
                color="red"
                :items-per-page="-1"
                hide-default-footer
                :footer-props="{
                  'items-per-page-options': [10, 10],
                  'show-current-page': true,
                  'show-first-last-page': true,
                  'page-text': 'رقم الصفحة',
                  'items-per-page-text': 'عدد الأسطر',
                }"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-row>
                    <ReturnDialog
                      source="purchase"
                      :original="item"
                    ></ReturnDialog>
                  </v-row> </template
              ></v-data-table>
            </div>
          </td>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-btn
              color="green"
              small
              class="ml-2"
              outlined
              fab
              elevation="0"
              @click="editFacture(item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <delete-dialog
              :id="item.id"
              :disabled="false"
              :source="'FournisseurFacture'"
            />
            <print-component :item="item" type="مورد"></print-component>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
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
import purchaseModule from "@/store/purchaseModule";
import ReturnDialog from "@/components/custom_dialogs/ReturnDialog.vue";
import fournisseurModule from "@/store/fournisseurModule";
import PrintComponent from "@/components/PrintComponent.vue";

@Component({
  components: { PrintComponent, DeleteDialog, CDatePicker, ReturnDialog },
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
    // { text: "ملاحظة", value: "remark" },
    { text: "تاريخ", value: "created_at" },
    { text: "المستخدم", value: "user.name" },

    { text: "", value: "actions" },
    { text: "", value: "data-table-expand" },
  ];

  SaleHeaders = [
    { text: "#", value: "id" },
    { text: "الباركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "السعر", value: "purchase_price" },
    { text: "المبلغ الاجمالي", value: "total" },
    { text: "العمليات", value: "actions" },
  ];

  search = new Search();

  count = 0;

  listFactures = [] as FournisseurFacture[];
  selectHistory = {} as FournisseurFacture;
  selectedFournisseur = {} as Fournisseur;
  listFournisseurs = [] as Fournisseur[];
  findfacture: any;

  getFournisseurs(url?: string): void {
    FournisseurApi.getAllFournisseurs(url).then((data) => {
      this.listFournisseurs = data as Fournisseur[];
    });
  }

  getApi(): void {
    historyApi.getFourinsseurFactures(this.search).then((data) => {
      this.listFactures.length = 0;
      this.count = 0;
      this.listFactures = (data as any).data as FournisseurFacture[];
      if (this.listFactures.length > 0) this.count = (data as any).total;
    });
  }

  created(): void {
    this.getFournisseurs();
    this.$root.$on("returnedPurchase", (facture: any) => {
      this.listFactures?.splice(
        this.listFactures?.indexOf(
          this.listFactures?.find((s) => s.id == facture.id) ??
            ({} as FournisseurFacture)
        ),
        1,
        facture
      );
    });
    this.$root.$on("updateFactures", (_: any) => {
      console.log("received");
      this.getApi();
    });
    this.$root.$on("deleteFournisseurFacture", (result: any) => {
      fournisseurModule.fournisseur.montant = result.montant;
      if (result) {
        this.listFactures.splice(
          this.listFactures.indexOf(
            this.listFactures.find((c) => c.id == result.id) ?? ({} as any)
          ),
          1
        );
      }
    });
  }

  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
    }
  }

  @Watch("search", { deep: true })
  searchByDate(): void {
    this.getApi();
  }

  clearFrom(): void {
    this.search.from = "";
  }

  clearTo() {
    this.search.to = "";
  }

  paginate(obj: any) {
    this.search.url = obj.page;
    // this.getApi();
  }

  editFacture(facture: FournisseurFacture): void {
    let newFacture = Object.assign({}, facture);
    purchaseModule.setFacture(newFacture);
    this.$root.$emit("editFactureFournisseur", "");
    // this.$router.push({path: "/purchase"});
  }
}
</script>
<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}
</style>
