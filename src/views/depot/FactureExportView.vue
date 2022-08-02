<template>
  <div class="mt-3">
    <v-row class="mr-1 mt-2">
      <v-text-field
          outlined
          dense
          clearable
          append-icon="fa-search"
          label="  البحث باسم الصنف او الباركود"
          v-model="search.name"
      ></v-text-field>
      <v-spacer></v-spacer>
<!--      <printeDeatail :data="facture_transfer" :name="nameDepot"/>-->
    </v-row>
    <v-data-table
        :headers="FactureHeaders"
        :items="FactureData"
        single-select
        item-key="id"
        @click:row="rowClick"
        show-expand
        single-expand
        class="elevation-1 mt-3"
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
          <delete-dialog class="mx-2" :id="item.id" :source="'factureTransfer'"/>
          <v-btn class="mx-2" @click="printSelectedFacture(item)" rounded outlined small color="primary">
            <v-icon>mdi-printer-outline</v-icon>
          </v-btn>
        </v-row>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class="mt-3">
            <v-data-table
                :headers="SaleHeaders"
                :items="item.transfers"
                item-key="id"
                class="elevation-1 headers-grey mb-3"
                color="red"
                single-select
                hide-default-footer
                :items-per-page="-1"
            ></v-data-table>
          </div>
        </td>
      </template>
    </v-data-table>

    <div id="facture" class="pa-3" style="width: 1000px">
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
              <v-col v-if="setting.logo!=null" cols="3">
                <v-img
                    class="mt-n6"
                    style="align: right"
                    height="100px"
                    width="100px"
                    contain
                    :src="setting.logo">
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
        <!--        data-html2canvas-ignore-->
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2> فاتورة تصدير</h2>
          </v-row>
          <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
          <p class="mt-6">رقم الفاتورة : {{ facture_transfer.id }}</p>
          <p>المخزن : {{ facture_transfer.depot != null ? facture_transfer.depot.name : "غير محدد" }}</p>
          <p>التاريخ : {{ facture_transfer.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
          :headers="SaleHeaders"
          :items="facture_transfer.transfers"
          disable-sort
          hide-default-footer
          :items-per-page="-1"
          class="elevation-0 mt-5">
      </v-data-table>

      <v-row class="mt-4"></v-row>
      <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
        <h4 class="mr-2">المجموع : {{ facture_transfer.montant }}</h4>
        <v-col cols="6"></v-col>
        <h4 class="mr-2" style="text-align: left">
          {{ facture_transfer.remark }}
        </h4>
      </v-row>
    </div>

  </div>
</template>

<script lang="ts">
import {Component, Ref, Vue, Watch} from "vue-property-decorator";
import snackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Facture from "@/classes/facture";
import Search from "@/classes/search";
import saleModule from "@/store/saleModule";
import FactureTransfer from "@/classes/facture_transfer";
import Depot from "@/classes/depot";
import ExportApi from "@/api/exportApi";
import settingModule from "@/store/settingModule";
import html2canvas from "html2canvas";
import PrintImage from "@/print/print_image";

@Component({components: {DeleteDialog, CDatePicker}})
export default class FactureDepotView extends Vue {
  FactureHeaders = [
    {text: "#", value: "id", class: "grey lighten-4"},
    {text: "المبلغ", value: "montant", class: "grey lighten-4"},
    {text: "تاريخ", value: "created_at", class: "grey lighten-4"},
    {text: "ملاحظة", value: "remark", class: "grey lighten-4"},
    {text: "", value: "actions", class: "grey lighten-4"},
    {text: "", value: "data-table-expand", class: "grey lighten-4"},
  ];

  SaleHeaders = [
    {text: "الصنف", value: "name", class: "grey lighten-4"},
    {text: "الكمية", value: "quantity", class: "grey lighten-4"},
    {text: "السعر", value: "price", class: "grey lighten-4"},
    {text: "سعر البيع", value: "sell_price", class: "grey lighten-4"},
    {text: "المبلغ الاجمالي", value: "total", class: "grey lighten-4"},
  ];
  search = new Search();

  apiExport = new ExportApi();

  facture_transfer = {} as FactureTransfer;

  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  depotId = 0;
  FactureData = [] as FactureTransfer[];
  nameDepot = "";
  index: any;

  editFacture(facture: Facture) {
    let newFacture = Object.assign({}, facture);
    saleModule.setFacture(newFacture);
    this.$router.push({path: "/"});
  }

  created() {
    this.$root.$on("selectedDepot", (item: Depot) => {
      this.nameDepot = item.name;
      this.search.depot_id = item.id;
      // this.getExports(this.search);

    });

    this.$root.$on("deleteFactureTransfer", (result: any) => {
      debugger
      if (result.type == "export")
        this.FactureData.splice(this.FactureData.indexOf(
            this.FactureData.find((c) => c.id == result.id) ?? ({} as any)), 1
        );

    });
  }

  printSelectedFacture(facture: FactureTransfer) {
    this.facture_transfer = facture;

    setTimeout(() => {
      PrintImage.print(document.getElementById("facture") as HTMLElement,true)
    }, 50);
  }


  @Watch("search", {deep: true})
  changedDepot() {
    if (this.search.depot_id)
      this.getExports(this.search);
  }

  get setting() {
    return settingModule.getSetting;
  }

  rowClick(item: any, row: any) {
    // if (!row.isSelected) {
    row.select(true);
    this.facture_transfer = item;
    this.index = row.index;
    this.$root.$emit("index", this.index);
    // } else {
    //   this.index = -1;
    //   this.$root.$emit("index", this.index);
    //   row.select(false);
    // }
  }


  getExports(search: Search) {
    this.FactureData = [];
    this.count = 0;


    if (this.search.depot_id) {

      this.apiExport.getExports(search)
          .then((data) => {
            this.FactureData = data.data as FactureTransfer[];
            this.count = data.total;
          })
          .catch((error) => {
            snackBarModule.setSnackbar({
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
  }

  paginate(obj: any) {
    this.search.url = obj.page;
    if (this.search.depot_id)
      this.getExports(this.search);
  }
}
</script>

<style scoped>
#facture {
  position: absolute;
  /*display: none;*/
  top: -50px;
  z-index: -10;
}
</style>
