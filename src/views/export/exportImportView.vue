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
      <div class="mt-3 ml-10">
        <ManageProductExport v-if="toggle_exclusive == 1" />
        <ManageProductImport v-else />
      </div>

      <!--      <div v-show="!facture.id" class="mt-3" style="width: 60px">-->
      <!--        <manage-teacher :teacherAction="1" :isFab="true" />-->
      <!--      </div>-->

      <!--      <v-col cols="3">-->
      <!--        <v-autocomplete-->
      <!--          :items="listclients"-->
      <!--          v-model="facture.client"-->
      <!--          item-text="name"-->
      <!--          outlined-->
      <!--          :disabled="facture.id != null"-->
      <!--          return-object-->
      <!--          hide-details-->
      <!--          -->
      <!--          placeholder="اكتب اسم الزبون"-->
      <!--          label="الزبون"-->
      <!--          prepend-inner-icon="mdi-account-search"-->
      <!--          :clearable="facture.id == null"-->
      <!--        ></v-autocomplete>-->
      <!--      </v-col>-->
      <v-btn-toggle
        v-model="toggle_exclusive"
        mandatory
        class="mt-3"
        group
        background-color="red"
        color="primary"
      >
        <v-btn text>
          <v-icon class="mx-2">mdi-arrow-down-bold-circle-outline</v-icon>
          استيراد
        </v-btn>
        <v-btn text>
          تصدير
          <v-icon class="mx-2">mdi-arrow-up-bold-circle-outline</v-icon>
        </v-btn>
      </v-btn-toggle>

      <!--      <v-switch-->
      <!--          v-model="switch1"-->
      <!--          inset-->
      <!--          label="تصدير"-->
      <!--      >-->
      <!--      </v-switch>-->
      <v-col class="mr-6">
        <v-autocomplete
          :items="listDepots"
          item-text="name"
          item-value="id"
          v-model="facture_transfer.depot_id"
          flat
          solo
          hide-details
          placeholder="اكتب اسم المخزن"
          hint="المخزن"
          prepend-inner-icon="mdi-storefront"
          clearable
          @change="changeDepot"
        ></v-autocomplete>
      </v-col>

      <v-col class="mt-2">
        <span>
          {{
            facture_transfer.id ? "الفاتورة  # " + facture_transfer.id : ""
          }}</span
        >
      </v-col>
      <v-btn
        class="ml-2 mt-3"
        large
        outlined
        dark
        color="red "
        @click="clearCart()"
      >
        تنظيف السلة
        <v-icon right>mdi-delete-outline</v-icon>
      </v-btn>
      <v-btn
        class="ml-2 mt-3"
        dark
        large
        color="red "
        v-show="facture_transfer.id != null"
        @click="addNewFacture"
      >
        إلغاء التعديل
        <v-icon right>mdi-cancel</v-icon>
      </v-btn>

      <v-btn
        dark
        large
        elevation="1"
        class="ml-2 mt-3"
        color="green darken-1"
        :disabled="facture_transfer.depot_id == null"
        @click="saveFacture()"
      >
        حفظ الفاتورة
        <v-icon right>mdi-check</v-icon>
      </v-btn>
      <!--      <v-btn-->
      <!--          outlined-->
      <!--          class="ml-2 mt-3"-->
      <!--          color="grey darken-3"-->
      <!--          :disabled="facture_transfer.depot_id == null"-->
      <!--          @click="printFacture()"-->
      <!--      >-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>
    <v-row no-gutters></v-row>
    <div v-resize="onResize">
      <v-card outlined>
        <v-data-table
          :headers="Headers"
          :items="facture_transfer.transfers"
          @click:row="rowClick"
          hide-default-footer
          fixed-header
          :height="windowSize.y - 270"
          item-key="product_id"
          :items-per-page="-1"
          single-select
        >
          <template v-slot:item.quantity="{ item }">
            <v-text-field
              style="width: 150px"
              label="الكمية"
              flat
              solo
              hide-spin-buttons
              class="centered-input"
              dense
              hide-details
              type="number"
              v-model="item.quantity"
              @input="editItem(item)"
            >
              <template v-slot:append>
                <v-icon @click="item.quantity++">mdi-plus</v-icon>
              </template>
              <template v-slot:prepend-inner>
                <v-icon @click="item.quantity--">mdi-minus</v-icon>
              </template></v-text-field
            >
          </template>
          <template v-slot:item.sell_price="{ item }">
            <v-text-field
              style="width: 150px"
              label="سعر البيع"
              flat
              solo
              hide-spin-buttons
              class="centered-input"
              dense
              hide-details
              type="number"
              v-model="item.sell_price"
              @input="editItem(item)"
            >
            </v-text-field>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-row>
              <!--         v-if="item.id==null"-->
              <v-btn @click="deleteItem(item)" fab outlined small color="red">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <!--          <delete-dialog v-else :id="item.id" :source="'SALE'"/>-->
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <v-col>
      <!-- <v-footer outlined color="white"> -->
      <v-row class="">
        <v-col cols="3">
          <v-text-field
            flat
            solo
            readonly
            v-model="facture_transfer.montant"
            append-icon="mdi-cash"
            persistent-placeholder
            hint="مبلغ الفاتورة  "
            persistent-hint
            placeholder="مبلغ الفاتورة  "
          ></v-text-field>
        </v-col>

        <v-col cols="5">
          <v-text-field
            solo
            flat
            v-model="facture_transfer.remark"
            append-icon="mdi-pencil"
            hint="ملاحظة"
            placeholder="اكتب ملاحظة"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- </v-footer> -->
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
        <!--        data-html2canvas-ignore-->
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2>
              {{ toggle_exclusive == 1 ? "فاتورة تصدير" : "فاتورة استيراد" }}
            </h2>
          </v-row>
          <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
          <p class="mt-6">رقم الفاتورة : {{ facture_transfer.id }}</p>
          <p>
            المخزن :
            {{
              facture_transfer.depot != null ? facture_transfer.depot.name : ""
            }}
          </p>
          <p>التاريخ : {{ facture_transfer.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
        :headers="Headers"
        :items="facture_transfer.transfers"
        disable-sort
        hide-default-footer
        :items-per-page="-1"
        class="elevation-0 mt-5"
      >
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
import ManageTeacher from "@/views/client/dialog/ManageTeacher.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageProductExport from "@/views/export/dialog/ManageProductExport.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Client from "@/classes/client";
import clientApi from "@/api/clientApi";
import Sale from "@/classes/transfer";
import VueBarcode from "vue-barcode";
import SnackBarModule from "@/store/snackBarModule";
import exportModule from "@/store/exportModule";
import depotApi from "@/api/depotApi";
import Depot from "@/classes/depot";
import FactureTransfer from "@/classes/facture_transfer";
import Transfer from "@/classes/transfer";
import ExportImportApi from "@/api/exportApi";
import ManageProductImport from "@/views/export/dialog/ManageProductImport.vue";
import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";

@Component({
  components: {
    ManageProductImport,
    DeleteDialog,
    ManageTeacher,
    ManageProductExport,
    barcode: VueBarcode,
  },
})
export default class ExportImportView extends Vue {
  Headers = [
    { text: "#", value: "count" },
    // {text: "باركود", value: "barcode", },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "المبلغ الإجمالي", value: "total" },
    { text: "", value: "actions" },
  ];

  facture_transfer = {
    montant: 0,
    transfers: [],
    id: null,
    created_at: null,
  } as FactureTransfer;
  // facture_transfer = {montant: 0, transfers: [], id: null, created_at: null} as FactureTransfer;

  apiFacture = new ExportImportApi();

  barcode = "0978709669800";

  // facture = { montant: 0, pay: 0, rest: 0, remise: 0 } as Facture;
  totalCredit = 0;

  loading = false;
  count = 0;
  private api = new clientApi();
  perPage = 0;

  get setting() {
    return settingModule.getSetting;
  }

  editItem(transfer: Transfer) {
    const index = this.facture_transfer.transfers.findIndex(
      (e) => e.product_id == transfer.product_id
    );

    this.facture_transfer.transfers[index].quantity = transfer.quantity;
    this.facture_transfer.transfers[index].total =
      Number(transfer.quantity) * Number(transfer.sell_price);
  }

  listDepots = [] as Depot[];
  private depotApi = new depotApi();

  getDepots(url?: string) {
    this.depotApi.getAllDepots(url).then((data) => {
      this.listDepots = (data as any).data as Depot[];
    });
  }

  created() {
    this.getDepots();

    this.facture_transfer = exportModule.facture;
    this.$root.$on("deletedSaleId", (transferId: number) => {
      const index = this.facture_transfer.transfers.findIndex(
        (e) => e.id == transferId
      );
      if (index >= 0) this.facture_transfer.transfers.splice(index, 1);
    });

    this.getapi();
  }

  @Watch("facture_transfer.transfers", { deep: true })
  onChange() {
    this.calcule();
  }

  selectedTransfer = {} as Transfer;

  calcule() {
    for (let i = 0; i < this.facture_transfer.transfers.length; i++) {
      this.facture_transfer.transfers[i].total =
        Number(this.facture_transfer.transfers[i].quantity) *
        Number(this.facture_transfer.transfers[i].sell_price);
    }

    this.facture_transfer.montant = 0;

    this.facture_transfer.transfers.forEach((sale: Sale, index) => {
      sale.count = index + 1;
      this.facture_transfer.montant = Number(
        (Number(this.facture_transfer.montant) + Number(sale.total)).toFixed(2)
      );
    });
  }

  public addNewFacture() {
    exportModule.facture = { montant: 0, transfers: [] } as FactureTransfer;
    this.facture_transfer = exportModule.facture;
  }

  toggle_exclusive = 1;

  saveFacture() {
    this.loading = true;
    let tel = this.listDepots.find(
      (e) => e.id == this.facture_transfer.depot_id
    ).tel;
    // shell.openExternal(
    //   "https://api.whatsapp.com/send?phone=" + tel.replace("+", "")
    // );

    if (this.toggle_exclusive == 1) {
      this.facture_transfer.type = "export";
      this.apiFacture
        .saveExport(this.facture_transfer)
        .then((res) => {
          // this.facture_transfer = res["data"] as FactureTransfer;

          this.loading = false;
          this.addNewFacture();

          PrintImage.printFacturePdf(
            this.setting,
            res["data"] as FactureTransfer,
            "مخزن"
          );

          // setTimeout(() => {
          //   PrintImage.print(document.getElementById("facture") as HTMLElement);
          // }, 50);

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
    } else {
      this.facture_transfer.type = "import";

      this.apiFacture
        .saveImport(this.facture_transfer)
        .then((res) => {
          this.facture_transfer = res["data"] as FactureTransfer;
          this.loading = false;
          // setTimeout(() => {
            // PrintImage.print(document.getElementById("facture") as HTMLElement);
            this.addNewFacture();
          // }, 50);

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
  }

  windowSize = { x: 0, y: 0 };
  onResize(): void {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }

  changeDepot(depotId: any) {
    this.$root.$emit("depotIdFromSale", depotId);
  }

  // public selectedPrinter = {} as electron.PrinterInfo;

  listclients = [] as Client[];

  getapi(url?: string) {
    this.api.getAllClients(url).then((data) => {
      // (data as Client[]).forEach((s) => {
      this.listclients = data as Client[];
      // });
    });
  }

  deleteItem(transfer: Sale) {
    // const index = this.facture.transfers.findIndex((e) => e.id == item.id);
    // exportModule.removeItem(item);
    const index = this.facture_transfer.transfers.findIndex(
      (e) => e.product_id == transfer.product_id
    );
    this.facture_transfer.transfers.splice(index, 1);
  }

  clearCart() {
    exportModule.clearCart();
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedTransfer = item;
    } else {
      row.select(false);
      this.selectedTransfer = {} as Transfer;
    }
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

.v-btn-toggle--group > .v-btn.v-btn {
  background-color: transparent !important;
  border-color: transparent;
  margin: 0px;
  min-width: auto;
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

#facture {
  position: absolute;
  /* display: none; */
  top: -1000px;
  z-index: -10;
}
::v-deep .centered-input input {
  text-align: center;
}
</style>
