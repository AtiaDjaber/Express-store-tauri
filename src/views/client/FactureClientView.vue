<template>
  <div class="mt-3">
    <v-row class="mr-1 my-2">
      <!--      <printe :data="listFacture" :name="nameclient" />-->
      <v-col cols="5">
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
      <v-spacer></v-spacer>
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
      <!-- <printeDeatail :data="DataSales" :name="nameclient" :FactureNumber="FactureNumber"/> -->
      <!--      <printeDeatail :data="facture" :name="nameclient" />-->
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="FactureHeaders"
        :items="listFacture"
        single-select
        item-key="id"
        @click:row="rowClick"
        show-expand
        single-expand
        :server-items-length="count"
        @update:options="paginate"
        class="elevation-0"
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
            <!-- <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-2"
                fab
                outlined
                small
                v-bind="attrs"
                v-on="on"
                color="primary"
              >
                <v-icon>mdi-printer-outline</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                class="px-2"
                @click="printSelectedFacture(item, false)"
                link
              >
                <v-list-item-avatar>
                  <v-avatar size="36" color="primary lighten-4">
                    <v-icon color="primary lighten-1">mdi-script</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title>طباعة وصل</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                class="px-2"
                @click="printSelectedFacture(item, true)"
                link
              >
                <v-list-item-avatar>
                  <v-avatar size="36" color="primary lighten-4">
                    <v-icon color="primary lighten-1">mdi-file</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title>طباعة فاتورة</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
          </v-row>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="mt-3">
              <v-alert color="primary" dense type="info" border="left" text>{{
                item.remark ? item.remark : "لا توجد ملاحظة"
              }}</v-alert>
              <v-alert
                v-if="item.point > 0"
                :color="item.gift ? 'green' : 'red'"
                dense
                type="error"
                icon="mdi-gift"
                border="left"
                text
                >{{ item.point + " نقطة " }}
                <span class="mx-6"
                  ><v-icon :color="item.gift ? 'green' : 'red'">{{
                    item.gift ? "mdi-check-circle" : "mdi-close-circle"
                  }}</v-icon>
                  {{
                    item.gift
                      ? " تم تفعيل النقاط     "
                      : "لم يتم تفعيل النقاط    "
                  }}</span
                ></v-alert
              >
              <v-data-table
                :headers="SaleHeaders"
                :items="item.sales"
                item-key="id"
                class="elevation-1 headers-grey mb-3"
                color="red"
                :items-per-page="-1"
                single-select
                hide-default-footer
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

    <!-- <div id="facture" class="pa-3" style="width: 1000px">
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
                  v-if="setting.logo != null"
                  height="100px"
                  width="100px"
                  contain
                  :src="setting.logo"
                >
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
       
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2>فاتورة بيع</h2>
          </v-row>
          <p class="mt-6">رقم الفاتورة : {{ facture.id }}</p>
          <p>
            الزبون :
            {{ facture.client != null ? facture.client.name : facture.client }}
          </p>
          <p>التاريخ : {{ facture.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
        :headers="SalePrint"
        :items="facture.sales"
        disable-sort
        hide-default-footer
        :items-per-page="-1"
        class="elevation-0 mt-5"
      >
      </v-data-table>

      <v-row class="mt-4"></v-row>
      <p class="mt-4 mr-2">المجموع : {{ facture.montant }}</p>
      <v-divider
        class="light-blue darken-3 mb-1 mt-n1 mr-2"
        style="max-height: 2px; height: 2px; width: 120px"
      ></v-divider>
      <p class="mr-2">المدفوع : {{ facture.pay }}</p>
      <p class="mr-2">التخفيض : {{ facture.remise }}</p>
      <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
        <h4 class="mr-2">الباقي : {{ facture.rest }}</h4>
        <v-col cols="6"></v-col>
        <h4 class="mr-2" style="text-align: left">
          {{ setting.remark }}
        </h4>
      </v-row>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import clientPayment from "@/classes/clientPayment";
import clientModule from "@/store/clientModule";
import snackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Facture from "@/classes/facture";
import Sale from "@/classes/sale";
import client from "@/classes/client";
import printe from "@/views/printe/PrinteViews.vue";
import printeDeatail from "@/views/printe/printeDetailFacture.vue";
import Search from "@/classes/search";
import saleModule from "@/store/saleModule";
import ReturnDialog from "@/components/custom_dialogs/ReturnDialog.vue";
import historyApi from "@/api/historyApi";
import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";
import Decoded from "@/helper/decode";
import { Setting } from "@/classes/setting";
import PrintComponent from "@/components/PrintComponent.vue";
import { Debounce } from "vue-debounce-decorator";

@Component({
  components: {
    DeleteDialog,
    PrintComponent,
    CDatePicker,
    printe,
    printeDeatail,
    ReturnDialog,
  },
})
export default class FactureClientView extends Vue {
  FactureHeaders = [
    { text: "#", value: "id" },
    { text: "المبلغ", value: "montant" },
    { text: "الدفع", value: "pay" },
    { text: "الباقي", value: "rest" },
    { text: "تخفيض", value: "remise" },
    { text: "تاريخ", value: "created_at" },
    // { text: "ملاحظة", value: "remark" },
    { text: "", value: "actions" },
    { text: "", value: "data-table-expand" },
  ];

  SaleHeaders = [
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "المبلغ الاجمالي", value: "total" },
    { text: "المخزن", value: "depot.name" },
    { text: "العمليات", value: "actions" },
  ];
  onChangeBarcode(text: any): void {
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  clearInput(): void {
    this.search.name = "";
  }
  SalePrint = [
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "السعر", value: "sell_price" },
    { text: "المبلغ الاجمالي", value: "total" },
  ];

  search = new Search();

  payment = {} as clientPayment;

  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  clientId = 0;
  clientMontant: number;
  newitem = {} as client;
  listFacture = [] as Facture[];
  sales = [] as Sale[];
  nameclient: any = "";
  index: any;

  editFacture(facture: Facture) {
    let newFacture = Object.assign({}, facture);
    saleModule.setFacture(newFacture);
    this.$router.push({ path: "/" });
  }

  created() {
    this.$root.$on("returnedSale", (facture: any) => {
      this.listFacture?.splice(
        this.listFacture?.indexOf(
          this.listFacture?.find((s) => s.id == facture.id)
        ),
        1,
        facture
      );
    });
    this.$root.$on("clientId", (item: client) => {
      this.clientId = item.id;
      this.nameclient = item.name;
      this.search.client_id = item.id;
    });

    this.$root.$on("deleteFacture", (result: any) => {
      clientModule.client.montant = result.montant;
      if (result) {
        this.listFacture.splice(
          this.listFacture.indexOf(
            this.listFacture.find((c) => c.id == result.id) ?? ({} as any)
          ),
          1
        );
      }
    });
  }

  facture = {} as Facture;
  DataSales = {} as Facture;

  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
      console.log(item);
      this.facture = item;
      this.index = row.index;
      this.$root.$emit("index", this.index);
    } else {
      this.index = -1;
      this.$root.$emit("index", this.index);
      row.select(false);
    }
  }

  @Watch("search", { deep: true })
  filterData(): void {
    this.getFactures(this.search);
  }

  get setting(): Setting {
    return settingModule.getSetting;
  }

  printSelectedFacture(facture: any, isFacture = true): void {
    if (isFacture) {
      PrintImage.printFacturePdf(this.setting, facture, "زبون");
    } else {
      PrintImage.printBon(this.setting, facture, "زبون");
    }
  }

  @Debounce(50)
  getFactures(search: any) {
    this.listFacture = [];
    this.listFacture.length = 0;
    if (this.clientId) {
      clientModule
        .getClientfactursById(search)
        .then((data) => {
          console.log(data);
          this.listFacture = data.data as Facture[];
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
    console.log(obj);
    // this.getFactures(this.search);
  }
  clearFrom() {
    this.search.from = "";
  }

  clearTo() {
    this.search.to = "";
  }
}
</script>

<style scoped>
#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}
/* ::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
} */
</style>
