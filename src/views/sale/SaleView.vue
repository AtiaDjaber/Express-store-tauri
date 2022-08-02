<template>
  <div class="pa-3">
    <!--        <v-row class="mt-16" justify="center" align-content="center" align="center">-->
    <!--          <div id="barcodePrint">-->
    <!--            <barcode-->
    <!--              v-bind:value="barcode"-->
    <!--              text-position="top"-->
    <!--              text="product  01 "-->
    <!--              height="60"-->
    <!--              font-size="22"-->
    <!--              text-margin="4"-->
    <!--              font-options="bold"-->
    <!--            >-->
    <!--              غير موجود-->
    <!--            </barcode>-->
    <!--            <v-row justify="center" class="mb-1"><h2>hello</h2></v-row>-->
    <!--          </div>-->
    <!--          <v-btn @click="createImage">print</v-btn>-->
    <!--        </v-row>-->

    <v-row class="pa-3">
      <div v-show="depot_id" class="mt-3 ml-10">
        <!--        <ManageProductSale :expenseAction="1" />-->
        <ManageProductSaleDepot />
      </div>
      <!-- <v-btn @click="test()">test</v-btn> -->
      <!--      <div v-show="!facture.id" class="mt-3" style="width: 60px">-->
      <!--        <manage-teacher :teacherAction="1" :buttonSahpe="true" />-->
      <!--      </div>-->

      <!-- <v-col cols="3">
        <v-autocomplete
          :items="listclients"
          v-model="facture.client_id"
          item-text="name"
          item-value="id"
          outlined
          :disabled="facture.id != null"
          hide-details
          dense
          placeholder="اكتب اسم الزبون"
          label="الزبون"
          prepend-inner-icon="mdi-account-search"
          :clearable="facture.id == null"
        ></v-autocomplete>
      </v-col> -->
      <v-col>
        <v-autocomplete
          :items="listDepots"
          item-text="name"
          item-value="id"
          outlined
          hide-details
          dense
          v-model="depot_id"
          placeholder="اكتب اسم المخزن"
          label="المخزن"
          prepend-inner-icon="mdi-storefront"
          clearable
          @change="changeDepot"
        ></v-autocomplete>
      </v-col>

      <!--      <v-col cols="2" v-if="facture.client != null">-->
      <!--        <v-text-field-->
      <!--          outlined-->
      <!--          dense-->
      <!--          background-color="red"-->
      <!--          dark-->
      <!--          v-model="facture.client.montant"-->
      <!--          filled-->
      <!--          prefix="دين قديم : "-->
      <!--          readonly-->
      <!--          append-icon="mdi-search"-->
      <!--        ></v-text-field>-->
      <!--      </v-col>-->

      <v-spacer></v-spacer>
      <v-btn class="ml-2 mt-3" dark color="red " @click="clearCart()">
        تنظيف السلة
        <v-icon right>mdi-delete-outline</v-icon>
      </v-btn>
      <v-btn
        class="ml-2 mt-3"
        dark
        color="red "
        v-show="facture.id != null"
        @click="addNewFacture"
      >
        إلغاء التعديل
        <v-icon right>mdi-cancel</v-icon>
      </v-btn>
      <v-btn
        dark
        class="ml-2 mt-3"
        color="green darken-1"
        :disabled="depot_id == null"
        @click="saveFacture()"
      >
        {{ facture.id != null ? "تعديل الفاتورة" : "إضافة الفاتورة" }}
        <v-icon right>mdi-check</v-icon>
      </v-btn>
      <!--      <v-btn-->
      <!--          outlined-->
      <!--          class="ml-2 mt-3"-->
      <!--          color="grey darken-3"-->
      <!--          :disabled="depot_id == null"-->
      <!--          @click="saveFacture()"-->
      <!--      >-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>
    <v-row no-gutters></v-row>

    <v-data-table
      :headers="Headers"
      :items="facture.sales"
      @click:row="rowClick"
      hide-default-footer
      fixed-header
      height="550px"
      item-key="product_id"
      :items-per-page="-1"
      single-select
    >
      <template v-slot:item.quantity="{ item }">
        <v-text-field
          style="width: 60%"
          dense
          label="الكمية"
          flat
          solo
          hide-details
          type="number"
          v-model="item.quantity"
          @input="editItem(item)"
        ></v-text-field>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row>
          <!--         v-if="item.id==null"-->
          <v-btn @click="deleteItem(item)" rounded outlined small color="red">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
          <!--          <delete-dialog v-else :id="item.id" :source="'SALE'"/>-->
        </v-row>
      </template>
    </v-data-table>

    <v-col>
      <v-footer padless color="white">
        <v-row class="">
          <v-col cols="1" v-if="facture.id" class="mt-2">
            <h3>{{ facture.id ? "الفاتورة  # " + facture.id : "" }}</h3>
          </v-col>
          <v-col cols="2">
            <v-text-field
              outlined
              dense
              readonly
              v-model="facture.montant"
              append-icon="mdi-search"
              label="مبلغ الفاتورة  "
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              outlined
              dense
              type="number"
              v-model="facture.remise"
              append-icon="mdi-percent"
              label="تخفيض"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              outlined
              dense
              type="number"
              v-model="facture.pay"
              append-icon="mdi-cash"
              label="الدفع "
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              outlined
              dense
              readonly
              v-model="getRest"
              label="الباقي"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              dense
              v-model="facture.remark"
              append-icon="mdi-pencil"
              label="ملاحظة"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-footer>
    </v-col>

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="#fb6333"
        size="64"
      ></v-progress-circular>
    </v-overlay>
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
        <!--          العمود الثاتي-->
        <!--        data-html2canvas-ignore-->
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2>فاتورة بيع</h2>
          </v-row>
          <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
          <p class="mt-6">رقم الفاتورة : {{ facture.id }}</p>
          <p>
            الزبون :
            {{ facture.client != null ? facture.client.name : facture.client }}
          </p>
          <p>التاريخ : {{ facture.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
        :headers="Headers"
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
    </div>
  </div>
</template>

<script lang="ts">
import ManageTeacher from "@/views/client/dialog/ManageTeacher.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageProductSale from "@/views/sale/dialog/ManageProductSale.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Client from "@/classes/client";
import clientApi from "@/api/clientApi";
import saleModule from "@/store/saleModule";

import Facture from "@/classes/facture";
import FactureApi from "@/api/factureApi";
import Sale from "@/classes/sale";
import SnackBarModule from "@/store/snackBarModule";
import client from "@/classes/client";
import depotApi from "@/api/depotApi";
import Depot from "@/classes/depot";
import ManageProductImport from "@/views/export/dialog/ManageProductImport.vue";
import ManageProductSaleDepot from "@/views/sale/dialog/ManageProductSaleDepot.vue";

import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";

@Component({
  components: {
    ManageProductSaleDepot,
    ManageProductImport,
    DeleteDialog,
    ManageTeacher,
    ManageProductSale,
  },
})
export default class SaleView extends Vue {
  Headers = [
    { text: "#", value: "count" },
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "المبلغ الإجمالي", value: "total" },
    { text: "", value: "actions" },
  ];

  facture = { montant: 0, pay: 0, rest: 0, remise: 0, sales: [] } as Facture;

  apiFacture = new FactureApi();
  // apiSale = new SaleApi();

  barcode = "0978709669800";

  totalCredit = 0;

  loading = false;
  count = 0;
  private api = new clientApi();
  perPage = 0;

  changeDepot(depotId: any) {
    this.$root.$emit("depotIdFromSale", depotId);
  }

  get getRest() {
    this.facture.rest =
      Number(this.facture.montant) -
      Number(this.facture.pay) -
      Number(this.facture.remise);
    return (
      Number(this.facture.montant) -
      Number(this.facture.pay) -
      Number(this.facture.remise)
    );
  }

  editItem(sale: Sale) {
    console.log(sale);
    const index = this.facture.sales.findIndex(
      (e) => e.product_id == sale.product_id
    );

    this.facture.sales[index].quantity = sale.quantity;
    this.facture.sales[index].total =
      Number(sale.quantity) * Number(sale.sell_price);
  }

  listDepots = [] as Depot[];
  private depotApi = new depotApi();

  getDepots(url?: string) {
    this.depotApi.getAllDepots(url).then((data) => {
      this.listDepots = (data as any).data as Depot[];
    });
  }

  depot_id = 0;

  created() {
    this.getDepots();
    this.$root.$on("createdClient", (newClient: client) => {
      this.listclients.unshift(newClient);
      this.facture.client = newClient;
    });
    this.facture = saleModule.facture;
    this.$root.$on("deletedSaleId", (saleId: number) => {
      const index = this.facture.sales.findIndex((e) => e.id == saleId);
      if (index >= 0) this.facture.sales.splice(index, 1);
    });

    this.getapi();
  }

  @Watch("facture.sales", { deep: true })
  onChange() {
    this.calcule();
  }

  selectedSale = {} as Sale;

  calcule() {
    for (let i = 0; i < this.facture.sales.length; i++) {
      this.facture.sales[i].total =
        Number(this.facture.sales[i].quantity) *
        Number(this.facture.sales[i].sell_price);
    }

    this.facture.montant = 0;

    this.facture.sales.forEach((prodct, index) => {
      prodct.count = index + 1;
      this.facture.montant =
        Number(this.facture.montant) + Number(prodct.total);
    });
    // this.facture.rest = Number(this.facture.montant) - Number(this.facture.pay) - Number(this.facture.remise);
    // this.totalCredit =
    //     (Number(this.facture.montant) + Number((this.facture.client.montant) ?? 0));
  }

  changeClient(item: Client) {
    console.log(item);
    // saleModule.setClient(item);
  }

  public addNewFacture() {
    this.depot_id = null;
    // this.facture = {montant: 0, pay: 0, rest: 0, remise: 0, sales: []} as Facture;
    saleModule.setFacture({
      montant: 0,
      pay: 0,
      rest: 0,
      remise: 0,
      sales: [],
    } as Facture);
    // setTimeout(() => {
    this.facture = saleModule.getFacture;
    // }, 20);
  }

  clearCart() {
    saleModule.clearCart();
  }
  createHeaders(keys) {
    return keys.map((key) => ({
      name: key,
      prompt: key,
      width: 24,
      align: "center",
      padding: 0,
    }));
  }

  async saveFacture() {
    this.loading = true;
    for (let sale of this.facture.sales) {
      sale.depot_id = this.depot_id;
    }

    this.apiFacture
      .saveFacture(this.facture)
      .then((res) => {
        this.facture = res["data"];
        setTimeout(() => {
          PrintImage.print(document.getElementById("facture"));
          this.addNewFacture();
        }, 50);

        this.loading = false;

        SnackBarModule.setSnackbar({
          text: "تم إضافة الفاتورة بنجاح",
          color: "success",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      })
      .catch((err) => {
        this.loading = false;
        SnackBarModule.setSnackbar({
          text: "خطأ,فشل إضافة الفاتورة",
          color: "red",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      });
  }


  listclients = [] as Client[];

  getapi(url?: string) {
    this.api.getAllClients(url).then((data) => {
      // (data as Client[]).forEach((s) => {
      this.listclients = data as Client[];
      // });
    });
  }

  deleteItem(sale: Sale) {
    // const index = this.facture.sales.findIndex((e) => e.id == item.id);
    // saleModule.removeItem(item);
    const index = this.facture.sales.findIndex(
      (e) => e.product_id == sale.product_id
    );
    this.facture.sales.splice(index, 1);
  }

  clearAll() {
    // saleModule.clearCart();
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedSale = item;
    } else {
      row.select(false);
      this.selectedSale = {} as Sale;
    }
  }

  get setting() {
    return settingModule.getSetting;
  }

  paginate(obj: any) {
    this.getapi("?page=" + obj.page);
  }
}
</script>
<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}

/*::v-deep table.v-table tbody td {*/
/*  font-size: 20px !important;*/
/*}*/
.v-data-table ::v-deep th {
  font-size: 14px !important;
}

.v-data-table ::v-deep td {
  font-size: 16px !important;
}

/* #facture {
  position: absolute;
  top: -100px;
  z-index: -10;
} */

.border {
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 20px;
  background-color: #0d47a1;
  border-color: #f54c14;
  text-decoration: none;
}
</style>
