<template>
  <div>
    <v-row class="mr-1 my-2">
      <!--      <printe :data="FactureData" :name="namefournisseur" />-->
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
      <!-- <printeDeatail :data="DataSales" :name="namefournisseur" :FactureNumber="FactureNumber"/> -->
      <!--      <printeDeatail :data="facture" :name="namefournisseur" />-->
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="FactureHeaders"
        :items="FactureData"
        single-select
        item-key="id"
        @click:row="rowClick"
        show-expand
        single-expand
        :server-items-length="count"
        @update:options="paginate"
        class="elevation-0 mt-3"
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
              :source="'FournisseurFacture'"
            />
            <print-component :item="item" type="مورد"></print-component>

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
                <v-list-item @click="printSelectedFacture(item, false)" link>
                  <v-list-item-title class="px-2"
                    >طباعة وصل</v-list-item-title
                  > </v-list-item
                ><v-list-item @click="printSelectedFacture(item, true)" link>
                  <v-list-item-title class="px-2"
                    >طباعة فاتورة</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu> -->
            <!-- <v-btn
              class="mx-2"
              @click="printSelectedFacture(item)"
              fab
              outlined
              small
              color="primary"
            >
              <v-icon>mdi-printer-outline</v-icon>
            </v-btn> -->
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
                :items="item.purchases"
                item-key="id"
                class="elevation-1 headers-grey mb-3"
                color="red"
                :items-per-page="-1"
                single-select
                hide-default-footer
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-row>
                    <ReturnDialog
                      source="purchase"
                      :original="item"
                    ></ReturnDialog>
                  </v-row>
                </template>
              </v-data-table>
            </div>
          </td>
        </template>
        <!-- <div class="mt-3 "></div> -->
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
              <v-col v-if="setting.logo != null" cols="3">
                <v-img
                  class="mt-n6"
                  style="align: right"
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
            <h2>فاتورة شراء</h2>
          </v-row>
          <p class="mt-6">رقم الفاتورة : {{ facture.id }}</p>
          <p>
            اسم المورد :
            {{
              facture.fournisseur != null
                ? facture.fournisseur.name
                : "غير محدد"
            }}
          </p>
          <p>التاريخ : {{ facture.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
        :headers="SaleHeaders"
        :items="facture.purchases"
        disable-sort
        hide-default-footer
        :items-per-page="-1"
        class="elevation-0 mt-5"
      >
      </v-data-table>

      <v-row class="mt-4"></v-row>
      <p class="mt-4 mr-2">المدفوع : {{ facture.pay }}</p>
      <p class="mr-2">التخفيض : {{ facture.remise }}</p>
      <p class="mr-2">الباقي : {{ facture.rest }}</p>

      <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
        <h4 class="mr-2">المجموع : {{ facture.montant }}</h4>
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
import fournisseurPayment from "@/classes/fournisseurPayment";
import fournisseurModule from "@/store/fournisseurModule";
import snackBarModule from "@/store/snackBarModule";
import SnackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Fournisseur from "@/classes/fournisseur";
import Sale from "@/classes/sale";
import printe from "@/views/printe/PrinteViews.vue";
import printeDeatail from "@/views/printe/printeDetailFacture.vue";
import Search from "@/classes/search";
import FournisseurFacture from "@/classes/fournisseurFacture";
import purchaseModule from "@/store/purchaseModule";
import settingModule from "@/store/settingModule";

import ReturnDialog from "@/components/custom_dialogs/ReturnDialog.vue";
import historyApi from "@/api/historyApi";
import Decoded from "@/helper/decode";
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
export default class FactureFournisseurView extends Vue {
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
    { text: "سعر الشراء", value: "purchase_price" },
    { text: "سعر البيع", value: "price" },
    { text: "المبلغ الاجمالي", value: "total" },
    { text: "العمليات", value: "actions" },
  ];

  search = new Search();

  payment = {} as fournisseurPayment;

  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  fournisseurMontant: number;
  newitem = {} as Fournisseur;
  FactureData = [] as FournisseurFacture[];
  listFacture = [] as FournisseurFacture[];
  sales = [] as Sale[];
  namefournisseur: any = "";
  index: any;

  editFacture(facture: FournisseurFacture): void {
    let newFacture = Object.assign({}, facture);
    purchaseModule.setFacture(newFacture);
    this.$router.push({ path: "/purchase" });
  }

  created() {
    this.$root.$on("fournisseurId", (item: Fournisseur) => {
      this.namefournisseur = item.name;
      this.search.fournisseur_id = item.id;
    });

    this.$root.$on("deleteFacture", (result: any) => {
      fournisseurModule.fournisseur.montant = result.montant;
      if (result) {
        this.FactureData.splice(
          this.FactureData.indexOf(
            this.FactureData.find((c) => c.id == result.id) ?? ({} as any)
          ),
          1
        );
      }
    });
    this.$root.$on("returnedPurchase", (facture: any) => {
      this.FactureData?.splice(
        this.FactureData?.indexOf(
          this.FactureData?.find((s) => s.id == facture.id) ??
            ({} as FournisseurFacture)
        ),
        1,
        facture
      );
    });
  }

  facture = {} as FournisseurFacture;
  DataSales = {} as FournisseurFacture;

  // printSelectedFacture(facture: any, isFacture = true): void {
  //   if (isFacture) {
  //     PrintImage.printFacturePdf(this.setting, facture, "مورد");
  //   } else {
  //     PrintImage.printBon(this.setting, facture, "مورد");
  //   }
  // }

  rowClick(item: any, row: any) {
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

  onChangeBarcode(text: any): void {
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }
  clearInput(): void {
    this.search.name = "";
  }

  @Watch("search", { deep: true })
  filterData(): void {
    this.getFacturesFournisseur();
  }

  @Debounce(50)
  getFacturesFournisseur(): void {
    this.FactureData = [];
    this.FactureData.length = 0;
    if (this.search.fournisseur_id) {
      historyApi
        .getFourinsseurFactures(this.search)
        .then((data) => {
          console.log(data);
          this.FactureData = data.data as FournisseurFacture[];
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

  get setting() {
    return settingModule.setting;
  }
  clearFrom() {
    this.search.from = "";
  }

  clearTo() {
    this.search.to = "";
  }
  paginate(obj: any) {
    this.search.url = obj.page;
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
</style>
