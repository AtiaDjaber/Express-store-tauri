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
<!--      <v-col cols="3">-->
<!--        <v-autocomplete-->
<!--            :items="listclients"-->
<!--            item-text="name"-->
<!--            item-value="id"-->
<!--            v-model="search.client_id"-->
<!--            outlined-->
<!--            hide-details-->
<!--            dense-->
<!--            placeholder="اكتب اسم الزبون"-->
<!--            label="الزبون"-->
<!--            prepend-inner-icon="mdi-account-search"-->
<!--            clearable-->
<!--        ></v-autocomplete>-->
<!--      </v-col>-->
      <v-col>
        <v-autocomplete
            :items="listDepots"
            v-model="search.depot_id"
            item-text="name"
            item-value="id"
            outlined
            hide-details
            dense
            placeholder="اكتب اسم المخزن"
            label="المخزن"
            prepend-inner-icon="mdi-storefront"
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
        ></c-date-picker
        >
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-row>
          <v-btn
              color="green"
              small
              class="ml-2"
              outlined
              rounded
              elevation="0"
              @click="editFacture(item)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <delete-dialog  :id="item.id" :disabled="false" :source="'Facture'"/>
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
                :items="item.sales"
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
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-row>
                  <ReturnDialog :sale="item"></ReturnDialog>

                </v-row>
              </template>
            </v-data-table>
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
              <v-col cols="3">
                <v-img
                    class="mt-n6"
                    style="align: right"
                    v-if="setting.logo!=null"
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
        <!--          العمود الثاتي-->
        <!--        data-html2canvas-ignore-->
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2>فاتورة بيع</h2>
          </v-row>
          <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
          <p class="mt-6">رقم الفاتورة : {{ facture.id }}</p>
          <p>الزبون : {{ facture.client != null ? facture.client.name : facture.client }}</p>
          <p>التاريخ : {{ facture.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
          :headers="SalePrint"
          :items="facture.sales"
          disable-sort
          hide-default-footer
          :items-per-page="-1"
          class="elevation-0 mt-5">

      </v-data-table>

      <v-row class="mt-4"></v-row>
      <p class="mt-4 mr-2">المجموع : {{ facture.montant }}</p>
      <v-divider class="light-blue darken-3 mb-1 mt-n1 mr-2"
                 style="max-height: 2px;height: 2px;width: 120px;"></v-divider>
      <p class="mr-2">المدفوع : {{ facture.pay }}</p>
      <p class="mr-2">التخفيض : {{ facture.remise }}</p>
      <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
        <h4 class="mr-2">الباقي : {{ facture.rest }}</h4>
        <v-col cols="6"></v-col>
        <h4 class="mr-2" style="text-align: left">
          {{ setting.remark }}
        </h4>
      </v-row>
    </div>

  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from "vue-property-decorator";
import Facture from "@/classes/facture";
import historyApi from "@/api/historyApi";
import Client from "@/classes/client";
import clientApi from "@/api/clientApi";
import Search from "@/classes/search";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import CDatePicker from "@/components/CDatePicker.vue";
import Depot from "@/classes/depot";
import depotApi from "@/api/depotApi";
import settingModule from "@/store/settingModule";
import html2canvas from "html2canvas";

import PrintImage from "@/print/print_image";
import ReturnDialog from "@/components/custom_dialogs/ReturnDialog.vue";
import Expense from "@/classes/expense";
import saleModule from "@/store/saleModule";
import clientModule from "@/store/clientModule";

@Component({
  components: {ReturnDialog, DeleteDialog, CDatePicker},
})
export default class HistoryView extends Vue {
  Headers = [
    // {text: "المخزن", value: "depot.name"},
    {text: "#", value: "id", class: "grey lighten-4"},
    // {text: "الزبون", value: "client.name", class: "grey lighten-4"},
    {text: "المبلغ", value: "montant", class: "grey lighten-4"},
    {text: "الدفع", value: "pay", class: "grey lighten-4"},
    {text: "تخفيض", value: "remise", class: "grey lighten-4"},
    {text: "الباقي", value: "rest", class: "grey lighten-4"},
    {text: "ملاحظة", value: "remark", class: "grey lighten-4"},
    {text: "تاريخ", value: "created_at", class: "grey lighten-4"},
    {text: "", value: "actions", class: "grey lighten-4"},
    {text: "", value: "data-table-expand", class: "grey lighten-4"},

  ];

  SaleHeaders = [
    {text: "#", value: "id", class: "grey lighten-4"},
    {text: "الباركود", value: "barcode", class: "grey lighten-4"},
    {text: "الصنف", value: "name", class: "grey lighten-4"},
    {text: "الكمية", value: "quantity", class: "grey lighten-4"},
    {text: "السعر", value: "sell_price", class: "grey lighten-4"},
    {text: "المبلغ الاجمالي", value: "total", class: "grey lighten-4"},
    {text: "المخزن", value: "depot.name", class: "grey lighten-4"},
    {text: "العمليات", value: "actions", class: "grey lighten-4"},

  ];
  SalePrint = [
    {text: "الصنف", value: "name", class: "grey lighten-4"},
    {text: "الكمية", value: "quantity", class: "grey lighten-4"},
    {text: "السعر", value: "sell_price", class: "grey lighten-4"},
    {text: "المبلغ الاجمالي", value: "total", class: "grey lighten-4"},
  ];


  search = new Search();

  count = 0;
  private apiClient = new clientApi();
  private api = new historyApi();
  listhisory = [] as Facture[];
  facture = {} as Facture;
  perPage = 0;
  selectedClient = {} as Client;
  listclients = [] as Client[];

  getapiClient(url?: string) {
    this.apiClient.getAllClients(url).then((data) => {
      this.listclients = data as Client[];
    });
  }

  printSelectedFacture(facture: Facture) {
    this.facture = facture;
    setTimeout(() => {
      PrintImage.print(document.getElementById("facture") as HTMLElement)
    }, 50);
  }

  private depotApi = new depotApi();

  listDepots = [] as Depot[];

  getDepots(url?: string) {
    this.depotApi.getAllDepots(url).then((data) => {
      this.listDepots = (data as any).data as Depot[];
    });
  }

  getapi(search?: Search) {
    this.api.getFactures(search).then((data) => {
      this.listhisory.length = 0;
      this.count = 0;
      ((data as any).data as Facture[]).forEach((s) => {
        this.listhisory.push(s);
      });
      if (this.listhisory.length > 0) this.count = (data as any as any).total;
      this.perPage = (data as any as any).per_page;
    });
  }

  get setting() {
    return settingModule.getSetting
  }

  created() {
    this.$root.$on("returnedSale", (factureId: any) => {
      this.api.getFacture(factureId).then((res) => {
        let facture = res as Facture;
        this.listhisory?.splice(
            this.listhisory?.indexOf(
                this.listhisory?.find((s) => s.id == facture.id) ?? ({} as Facture)
            ), 1, facture
        );
      });
    });
    this.$root.$on("deleteFacture", (result: any) => {
      clientModule.client.montant = result.montant;
      if (result) {
        this.listhisory.splice(
            this.listhisory.indexOf(
                this.listhisory.find((c) => c.id == result.id) ?? ({} as any)
            ),
            1
        );
      }
    });
    this.getDepots();
    this.getapiClient();
  }

  editFacture(facture: Facture) {
    let newFacture = Object.assign({}, facture);
    saleModule.setFacture(newFacture);
    this.$router.push({path: "/"});
  }
  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
    }
    // this.facture = item;
  }

  @Watch("search", {deep: true})
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

#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}
</style>
