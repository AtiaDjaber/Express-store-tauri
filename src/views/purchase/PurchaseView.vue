<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <div class="mt-3 ml-10">
        <ManageProductPurchase />
      </div>
      <v-col cols="3">
        <v-autocomplete
          :items="listFournisseur"
          v-model="facture.fournisseur_id"
          item-text="name"
          item-value="id"
          outlined
          :disabled="facture.id != null"
          hide-details
          dense
          placeholder="اكتب اسم المورد"
          label="المورد"
          prepend-inner-icon="mdi-account-search"
          :clearable="facture.id == null"
        ></v-autocomplete>
      </v-col>

      <v-col class="mt-2">
        <span> {{ facture.id ? "الفاتورة  # " + facture.id : "" }}</span>
      </v-col>
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
        class="ml-2 mt-3"
        color="green darken-1"
        style="color: white"
        :disabled="facture.fournisseur_id == null"
        @click="saveFacture()"
      >
        حفظ الفاتورة
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
      <!--      <v-btn-->
      <!--          outlined-->
      <!--          class="ml-2 mt-3"-->
      <!--          color="grey darken-3"-->
      <!--          :disabled="facture.fournisseur_id == null"-->
      <!--          @click="saveFacture()"-->
      <!--      >-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>
    <v-row no-gutters></v-row>

    <v-data-table
      :headers="Headers"
      :items="facture.purchases"
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
          style="width: 70%"
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

      <template v-slot:item.purchase_price="{ item }">
        <v-text-field
          style="width: 70%"
          dense
          label="سعر البيع"
          flat
          solo
          hide-details
          type="number"
          v-model="item.purchase_price"
          @input="editItem(item)"
        ></v-text-field>
      </template>
      <template v-slot:item.price="{ item }">
        <v-text-field
          style="width: 70%"
          dense
          label="سعر البيع"
          flat
          solo
          hide-details
          type="number"
          v-model="item.price"
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
            <h2>فاتورة شراء</h2>
          </v-row>
          <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
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
        :headers="Headers"
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageProductPurchase from "@/views/purchase/dialog/ManageProductPurchase.vue";
import Fournisseur from "@/classes/fournisseur";
import fournisseurApi from "@/api/fournisseurApi";
import purchaseModule from "@/store/purchaseModule";
import FournisseurFacture from "@/classes/fournisseurFacture";
import FournisseurFactureApi from "@/api/fournisseurFactureApi";
import Purchase from "@/classes/purchase";
import VueBarcode from "vue-barcode";
import html2canvas, { Options } from "html2canvas";
import SnackBarModule from "@/store/snackBarModule";
import fournisseur from "@/classes/fournisseur";
import depotApi from "@/api/depotApi";
import Depot from "@/classes/depot";
import { Setting } from "@/classes/setting";
import SettingApi from "@/api/setting_api";
import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";

@Component({
  components: {
    ManageProductPurchase,
    barcode: VueBarcode,
  },
})
export default class PurchaseView extends Vue {
  Headers = [
    { text: "#", value: "count" },
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر الشراء", value: "purchase_price" },
    { text: "سعر البيع", value: "price" },

    { text: "المبلغ الإجمالي", value: "total" },
    { text: "", value: "actions" },
  ];

  facture = {
    montant: 0,
    pay: 0,
    rest: 0,
    remise: 0,
    purchases: [],
  } as FournisseurFacture;

  apiFacture = new FournisseurFactureApi();

  barcode = "0978709669800";

  totalCredit = 0;

  loading = false;
  count = 0;
  private api = new fournisseurApi();
  perPage = 0;

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

  editItem(purchase: Purchase) {
    console.log(purchase);
    const index = this.facture.purchases.findIndex(
      (e) => e.product_id == purchase.product_id
    );

    this.facture.purchases[index].quantity = purchase.quantity;
    this.facture.purchases[index].price = purchase.price;
    this.facture.purchases[index].purchase_price = purchase.purchase_price;
    this.facture.purchases[index].total =
      Number(purchase.quantity) * Number(purchase.purchase_price);
  }

  created() {
    this.$root.$on("createdClient", (newClient: fournisseur) => {
      this.listFournisseur.unshift(newClient);
      this.facture.fournisseur = newClient;
    });
    this.facture = purchaseModule.getFacture;
    this.$root.$on("deletedSaleId", (saleId: number) => {
      const index = this.facture.purchases.findIndex((e) => e.id == saleId);
      if (index >= 0) this.facture.purchases.splice(index, 1);
    });

    this.getapi();
  }

  @Watch("facture.purchases", { deep: true })
  onChange() {
    this.calcule();
  }

  selectedSale = {} as Purchase;

  calcule() {
    for (let i = 0; i < this.facture.purchases.length; i++) {
      this.facture.purchases[i].total =
        Number(this.facture.purchases[i].quantity) *
        Number(this.facture.purchases[i].purchase_price);
    }

    this.facture.montant = 0;

    this.facture.purchases.forEach((prodct, index) => {
      prodct.count = index + 1;
      this.facture.montant =
        Number(this.facture.montant) + Number(prodct.total);
    });
  }

  public addNewFacture() {
    purchaseModule.setFacture({
      montant: 0,
      pay: 0,
      rest: 0,
      remise: 0,
      purchases: [],
    } as FournisseurFacture);
    // setTimeout(() => {
    this.facture = purchaseModule.getFacture;
    // }, 20);
  }

  get setting() {
    return settingModule.getSetting;
  }

  clearCart() {
    purchaseModule.clearCart();
  }

  saveFacture() {
    this.loading = true;

    this.apiFacture
      .saveFacture(this.facture)
      .then((res) => {
        console.log(res);

        this.facture = res["data"];
        this.loading = false;
        setTimeout(() => {
          PrintImage.print(document.getElementById("facture") as HTMLElement);
          this.addNewFacture();
        }, 50);

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

  listFournisseur = [] as Fournisseur[];

  getapi(url?: string) {
    this.api.getAllFournisseurs(url).then((data) => {
      this.listFournisseur = data as Fournisseur[];
    });
  }

  deleteItem(purchase: Purchase) {
    const index = this.facture.purchases.findIndex(
      (e) => e.product_id == purchase.product_id
    );
    this.facture.purchases.splice(index, 1);
  }

  clearAll() {
    // purchaseModule.clearCart();
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedSale = item;
    } else {
      row.select(false);
      this.selectedSale = {} as Purchase;
    }
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

#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}

.border {
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 20px;
  background-color: #0d47a1;
  border-color: #f54c14;
  text-decoration: none;
}
</style>
