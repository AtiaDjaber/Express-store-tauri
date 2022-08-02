<template>
  <div class="mt-3">
    <v-row class="mr-1 my-2">
      <!--      <printe :data="listFacture" :name="nameclient" />-->

      <v-spacer></v-spacer>

      <!-- <printeDeatail :data="DataSales" :name="nameclient" :FactureNumber="FactureNumber"/> -->
      <!--      <printeDeatail :data="facture" :name="nameclient" />-->
    </v-row>
    <v-data-table
        :headers="FactureHeaders"
        :items="listFacture"
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
          <delete-dialog :id="item.id" :disabled="false" :source="'Facture'"/>
          <v-btn class="mr-2" @click="printSelectedFacture(item)" rounded outlined small color="primary">
            <v-icon>mdi-printer-outline</v-icon>
          </v-btn>
        </v-row>
      </template>
      <template v-slot:item.price="{ item }">
        {{ item.type == "يوم" ? item.priceRentDay : item.priceRentHour }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class="mt-3">
            <v-data-table
                :headers="SaleHeaders"
                :items="item.sales"
                item-key="id"
                class="elevation-1 headers-grey mb-3"
                color="red"
                single-select
                hide-default-footer
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
    </div>

  </div>
</template>

<script lang="ts">
import {Component, Ref, Vue, Watch} from "vue-property-decorator";
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

@Component({
  components: {
    DeleteDialog, CDatePicker, printe, printeDeatail, ReturnDialog,
  }
})
export default class FacturePaymentView extends Vue {
  FactureHeaders = [
    {text: "#", value: "id", class: "grey lighten-4"},
    {text: "المبلغ", value: "montant", class: "grey lighten-4"},
    {text: "الدفع", value: "pay", class: "grey lighten-4"},
    {text: "الباقي", value: "rest", class: "grey lighten-4"},
    {text: "تخفيض", value: "remise", class: "grey lighten-4"},
    {text: "تاريخ", value: "created_at", class: "grey lighten-4"},
    {text: "ملاحظة", value: "remark", class: "grey lighten-4"},
    {text: "", value: "actions", class: "grey lighten-4"},
    {text: "", value: "data-table-expand", class: "grey lighten-4"},
  ];

  SaleHeaders = [
    {text: "الصنف", value: "name", class: "grey lighten-4"},
    {text: "الكمية", value: "quantity", class: "grey lighten-4"},
    {text: "سعر البيع", value: "sell_price", class: "grey lighten-4"},
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
    this.$router.push({path: "/"});
  }

  private api = new historyApi();

  created() {
    this.$root.$on("returnedSale", (factureId: any) => {
      this.api.getFacture(factureId).then((res) => {
        let facture = res as Facture;
        this.listFacture?.splice(
            this.listFacture?.indexOf(
                this.listFacture?.find((s) => s.id == facture.id) ?? ({} as Facture)
            ), 1, facture
        );
      });
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

  @Watch("clientId", {deep: true})
  changedClientId() {
    this.payment.client_id = this.clientId;
    this.getFacturePayments(this.clientId, "");
  }

  get setting() {
    return settingModule.getSetting
  }

  printSelectedFacture(facture: Facture) {
    this.facture = facture;
    setTimeout(() => {
      PrintImage.print(document.getElementById("facture") as HTMLElement)
    }, 50);
  }

  getFacturePayments(ClientIdnumber: any, page: any) {
    this.listFacture = [];
    this.listFacture.length = 0;
    if (this.clientId) {
      clientModule
          .getClientfactursById(ClientIdnumber, page)
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

  // paginate(obj: any) {
  //   this.getFacturePayments(this.clientId, obj.page);
  // }
}
</script>

<style scoped>#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}
</style>
