<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <v-col cols="3">
        <v-text-field
          solo
          flat
          append-icon="fa-search"
          clearable
          hint="البحث باسم الصنف او الباركود"
          placeholder="اكتب اسم الصنف او الباركود"
          :value="search.name"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-autocomplete
          :items="listclients"
          item-text="name"
          item-value="id"
          v-model="search.client_id"
          placeholder="اكتب اسم الزبون"
          hint="الزبون"
          prepend-inner-icon="mdi-account-search"
          clearable
          solo
          flat
        ></v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete
          :items="listDepots"
          v-model="search.depot_id"
          item-text="name"
          item-value="id"
          solo
          flat
          placeholder="اكتب اسم المخزن"
          hint="المخزن"
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
      <!--          -->
      <!--        ></v-combobox>-->
      <!--      </v-col>-->

      <v-col>
        <c-date-picker
          v-model="search.from"
          hint="تاريخ البداية"
          placeholder="تاريخ البداية"
          clearable
          @eventname="clearFrom"
        ></c-date-picker>
      </v-col>

      <v-col>
        <c-date-picker
          solo
          flat
          @eventname="clearTo"
          v-model="search.to"
          hint="تاريخ النهاية"
          placeholder="تاريخ النهاية"
          clearable
        ></c-date-picker>
      </v-col>
    </v-row>

    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="listhisory"
        single-select
        @click:row="rowClick"
        show-expand
        class="elevation-0"
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
        <template v-slot:item.client="{ item }">
          {{ item.client != null ? item.client.name : "بيع مباشر" }}
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
              :source="'Facture'"
            />
            <print-component :item="item" type="زبون"></print-component>
          </v-row>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="mt-3">
              <v-alert color="primary" dense type="info" border="left" text>{{
                item.remark ? item.remark : "لا توجد ملاحظة"
              }}</v-alert>

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
                    <ReturnDialog source="sale" :original="item"></ReturnDialog>
                  </v-row>
                </template>
              </v-data-table>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
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
import PrintImage from "@/print/print_image";
import ReturnDialog from "@/components/custom_dialogs/ReturnDialog.vue";
import saleModule from "@/store/saleModule";
import clientModule from "@/store/clientModule";
import Decoded from "@/helper/decode";
import PrintComponent from "@/components/PrintComponent.vue";

@Component({
  components: { PrintComponent, ReturnDialog, DeleteDialog, CDatePicker },
})
export default class HistoryView extends Vue {
  Headers = [
    // {text: "المخزن", value: "depot.name"},
    { text: "#", value: "id" },
    { text: "الزبون", value: "client" },
    { text: "المبلغ", value: "montant" },
    { text: "الدفع", value: "pay" },
    { text: "تخفيض", value: "remise" },
    { text: "الباقي", value: "rest" },
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
    { text: "السعر", value: "sell_price" },
    { text: "المبلغ الاجمالي", value: "total" },
    { text: "المخزن", value: "depot.name" },
    { text: "العمليات", value: "actions" },
  ];
  SalePrint = [
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "السعر", value: "sell_price" },
    { text: "المبلغ الاجمالي", value: "total" },
  ];

  search = new Search();

  count = 0;
  private apiClient = new clientApi();
  // private api = new historyApi();
  listhisory = [] as Facture[];
  facture = {} as Facture;
  perPage = 0;
  selectedClient = {} as Client;
  listclients = [] as Client[];

  getApiClient(url?: string) {
    this.apiClient.getAllClients(url).then((data) => {
      this.listclients = data as Client[];
    });
  }

  private depotApi = new depotApi();

  listDepots = [] as Depot[];

  getDepots(url?: string) {
    this.depotApi.getAllDepots(url).then((data) => {
      this.listDepots = (data as any).data as Depot[];
    });
  }

  getapi(search?: Search) {
    historyApi.getFactures(search).then((data) => {
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
    return settingModule.getSetting;
  }

  created() {
    this.$root.$on("returnedSale", (facture: any) => {
      this.listhisory?.splice(
        this.listhisory?.indexOf(
          this.listhisory?.find((s) => s.id == facture.id) ?? ({} as Facture)
        ),
        1,
        facture
      );
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
    this.getApiClient();
  }

  onChangeBarcode(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  clearInput(): void {
    this.search.name = "";
  }
  editFacture(facture: Facture) {
    let newFacture = Object.assign({} as Facture, facture);
    saleModule.setFacture(newFacture);
    this.$router.push({ path: "/" });
  }
  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
    }
    // this.facture = item;
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
    // this.getapi(this.search);
  }

  // printFacture() {
  //   let factureElement = document.getElementById("facture") as HTMLElement;
  //   html2canvas(factureElement, {
  //     allowTaint: false,
  //     scale: 4,
  //     logging: true,
  //     imageTimeout: 0,
  //     useCORS: true,
  //     onclone(doc, html) {
  //       doc.getElementById("facture").style.display = "block";
  //     },
  //   }).then(async function (canvas) {
  //     const blob: any = await new Promise((resolve) =>
  //       canvas.toBlob((blob) => resolve(blob), "image/jpg")
  //     );
  //     const buffer = new Buffer(await blob.arrayBuffer());
  //     let date = new Date().getTime();

  //     let filePath = "facture/" + date + ".png";
  //     await new Promise((resolve, reject) =>
  //       fs.writeFile(filePath, buffer, "binary", (err) => {
  //         electron.shell.openPath(fs.realpath.name);

  //         let printCmd = exec(
  //           ".\\SumatraPDF.exe -silent -print-to-default -print-settings landscape " +
  //             filePath
  //         );

  //         printCmd.stdout.on("data", (data: any) =>
  //           console.log(`print data: ${data}`)
  //         );
  //       })
  //     );
  //   });
  // }
}
</script>
<style scoped>
#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}
</style>
