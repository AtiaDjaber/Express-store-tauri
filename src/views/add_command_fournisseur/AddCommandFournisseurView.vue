<template>
  <div class="pa-3">
    <v-row class="pa-3">
      <div class="pt-3">
        <ManageProductPurchase typeFacture="commandFournisseur" />
      </div>
      <v-col cols="3">
        <v-text-field
          ref="barcodeRef"
          :hint="$t('product_search')"
          :label="$t('product_search')"
          :placeholder="$t('product_search')"
          required
          append-icon="fa-search"
          prepend-inner-icon="mdi-barcode-scan"
          flat
          solo
          :value="search.name"
          @keyup.enter="manageSearch"
          @keyup="onChangeBarcodeSearch"
          @click:clear="clearInput"
          clearable
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>

      <v-col class="mt-2">
        <span> {{ facture.id ? "الفاتورة  # " + facture.id : "" }}</span>
      </v-col>
      <v-spacer></v-spacer>
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
        v-show="facture.id != null"
        @click="addNewFacture"
      >
        إلغاء التعديل
        <v-icon right>mdi-cancel</v-icon>
      </v-btn>
      <v-btn
        class="ms-2 mt-3"
        color="green darken-1"
        large
        style="color: white"
        v-shortkey="['f1']"
        @shortkey="saveFacture(false)"
        :disabled="
          facture.fournisseur_id == null ||
          facture.items_command_fournisseur.length < 2
        "
        @click="saveFacture()"
      >
        حفظ F1
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            large
            v-on="on"
            class="mx-2 mt-3"
            style="color: white"
            color="blue darken-1"
            :disabled="
              facture.fournisseur_id == null ||
              facture.items_command_fournisseur.length < 2
            "
            v-shortkey="['f2']"
            @shortkey="saveFacture(true)"
            @click="saveFacture(true)"
          >
            طباعة F2
            <v-icon right>mdi-printer-outline</v-icon>
          </v-btn>
        </template>
        <span>Press F2</span>
      </v-tooltip>
      <v-col cols="auto">
        <v-autocomplete
          :items="listFournisseur"
          v-model="facture.fournisseur_id"
          item-text="name"
          item-value="id"
          solo
          flat
          :disabled="facture.id != null"
          hide-details
          placeholder="اكتب اسم المورد"
          label="المورد"
          prepend-inner-icon="mdi-account-search"
          :clearable="facture.id == null"
        ></v-autocomplete>
      </v-col>
      <manage-fournisseur :isFab="true" :teacherAction="1" />

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

    <div v-resize="onResize">
      <v-row no-gutters>
        <v-col class="me-6">
          <v-card outlined>
            <v-toolbar dense elevation="0" color="secondary" dark>
              <v-toolbar-title>
                <span style="font-size: 1.1rem"
                  >{{
                    typeProductNotif == "expired"
                      ? " منتهية صلاحية"
                      : "انتهت الكمية"
                  }}
                </span>
                <v-chip small color="grey">
                  {{
                    (typeProductNotif == "expired" ? expireProducts : products)
                      .length
                  }}
                </v-chip>
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <!-- <v-list-item @click="typeProductNotif = 'all'">
                    <v-list-item-title>الكل</v-list-item-title>
                  </v-list-item> -->
                  <v-list-item @click="typeProductNotif = 'expired'">
                    <v-list-item-title>منتهية الصلاحية</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="typeProductNotif = 'finished'">
                    <v-list-item-title
                      >تفذت من المخزون او كمية منخفضة</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-list
              shaped
              flat
              :height="windowSize.y - 300"
              style="overflow-y: auto"
              elevation="0"
            >
              <v-list-item-group v-model="items" multiple>
                <template
                  v-for="item in typeProductNotif == 'expired'
                    ? expireProducts
                    : products"
                >
                  <v-list-item
                    dense
                    :key="item.id"
                    :value="item"
                    active-class="primary--text"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-list-item-title
                          >{{ item.name }}
                          <v-chip small color="primary">
                            {{ item.quantity }}
                          </v-chip></v-list-item-title
                        >
                        <v-list-item-subtitle>{{
                          item.reference
                        }}</v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-checkbox
                          :input-value="active"
                          color="primary"
                        ></v-checkbox>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card> </v-col
        ><v-col cols="8">
          <v-card outlined>
            <v-data-table
              :headers="Headers"
              :items="facture.items_command_fournisseur"
              @click:row="rowClick"
              hide-default-footer
              fixed-header
              :height="windowSize.y - 250"
              :items-per-page="-1"
              single-select
            >
              <template v-slot:[`item.count`]="{ item, index }">
                <span>{{ index + 1 }}</span>
              </template>
              <template v-slot:item.quantity="{ item, index }">
                <v-text-field
                  style="width: 150px"
                  label="الكمية"
                  flat
                  dense
                  class="centered-input"
                  solo
                  hide-details
                  type="number"
                  hide-spin-buttons
                  v-model="item.quantity"
                  @input="editItem(item, index)"
                >
                  <template v-slot:append>
                    <v-icon @click="item.quantity++">mdi-plus</v-icon>
                  </template>
                  <template v-slot:prepend-inner>
                    <v-icon @click="item.quantity--">mdi-minus</v-icon>
                  </template>
                </v-text-field>
              </template>

              <template v-slot:[`item.actions`]="{ item, index }">
                <v-row>
                  <!--         v-if="item.id==null"-->
                  <v-btn
                    @click="deleteItem(item, index)"
                    fab
                    outlined
                    small
                    color="red"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                  <!--          <delete-dialog v-else :id="item.id" :source="'SALE'"/>-->
                </v-row>
              </template>
            </v-data-table>
          </v-card></v-col
        >
      </v-row>
    </div>

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="#fb6333"
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import ManageProductPurchase from "@/views/purchase/dialog/ManageProductPurchase.vue";
import Fournisseur from "@/classes/fournisseur";
import FournisseurApi from "@/api/fournisseurApi";
import commandFournisseurModule from "@/store/commandFournisseurModule";
import CommandFournisseur from "@/classes/CommandFournisseur";
import Purchase from "@/classes/purchase";
import VueBarcode from "vue-barcode";
import SnackBarModule from "@/store/snackBarModule";
import fournisseur from "@/classes/fournisseur";
import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";
import Decoded from "@/helper/decode";
import ManageFournisseur from "../fournisseur/dialog/ManageFournisseur.vue";
import stockApi from "@/api/stockApi";
import Search from "@/classes/search";
import Stock from "@/classes/stock";
import FournisseurFactureApi from "@/api/fournisseurFactureApi";
import ItemCommandFournisseur from "@/classes/ItemCommandFournisseur";
import NotificationApi from "@/api/notificationApi";
import stock from "@/classes/stock";

@Component({
  components: {
    ManageProductPurchase,
    barcode: VueBarcode,
    ManageFournisseur,
  },
})
export default class AddCommandFournisseurView extends Vue {
  Headers = [
    { text: "#", value: "count" },
    { text: "الصنف", value: "name" },
    { text: "المرجع", value: "reference" },
    { text: "الكمية", value: "quantity" },
    // { text: "السعر", value: "price" },
    { text: "", value: "actions" },
  ];

  items = [] as stock[];

  facture = {
    items_command_fournisseur: [],
  } as CommandFournisseur;

  apiFacture = new FournisseurFactureApi();
  search = new Search();

  @Ref() readonly barcodeRef: any;

  @Watch("items", { deep: true })
  itemsWatch() {
    for (let index = 0; index < this.items.length; index++) {
      let product = this.items[index];
      const res = this.facture.items_command_fournisseur.findIndex(
        (f) => product.id == f.product_id
      );
      if (res < 0) {
        this.facture.items_command_fournisseur.push({
          price: product.price,
          quantity: 1,
          product_id: product.id,
          name: product.name,
          reference: product.reference,
        } as ItemCommandFournisseur);
      }
    }
  }
  loading = false;
  count = 0;
  // private api = new fournisseurApi();
  perPage = 0;
  typeProductNotif = "finished";
  editItem(purchase: ItemCommandFournisseur, index: number): void {
    this.facture.items_command_fournisseur[index].quantity = purchase.quantity;
    this.facture.items_command_fournisseur[index].price = purchase.price;
  }

  focusBarcodeField(): void {
    this.$nextTick(() => this.barcodeRef.focus());
  }
  onChangeBarcodeSearch(text: any): void {
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }
  // emptyRow(): void {
  //   this.facture.items_command_fournisseur.push({
  //     count: this.facture.items_command_fournisseur.length + 1,
  //     quantity: 0,
  //     price: 0.0,
  //   });
  // }

  created(): void {
    // this.emptyRow();
    this.getNotifications();
    this.$root.$on("createdFournisseur", (newFour: fournisseur) => {
      this.listFournisseur.unshift(newFour);
      this.facture.fournisseur = newFour;
      this.facture.fournisseur_id = newFour.id;
    });
    this.$root.$on("editFactureFournisseur", (_: any) => {
      this.facture = commandFournisseurModule.getFacture;
    });
    this.facture = commandFournisseurModule.getFacture;
    this.$root.$on("deletedSaleId", (saleId: number) => {
      const index = this.facture.items_command_fournisseur.findIndex(
        (e) => e.id == saleId
      );
      if (index >= 0) this.facture.items_command_fournisseur.splice(index, 1);
    });

    this.getapi();
  }

  @Watch("facture.items_command_fournisseur", { deep: true, immediate: true })
  onFillRow() {
    const indexEmpty = this.facture.items_command_fournisseur.findIndex(
      (e) => e.name == null
    );
    if (indexEmpty < 0) {
      // this.emptyRow();
    }
  }

  selectedSale = {} as ItemCommandFournisseur;

  public addNewFacture(): void {
    commandFournisseurModule.setFacture({
      items_command_fournisseur: [],
    } as CommandFournisseur);
    // setTimeout(() => {
    this.facture = commandFournisseurModule.getFacture;
    // }, 20);
  }

  get setting() {
    return settingModule.getSetting;
  }

  clearCart() {
    commandFournisseurModule.clearCart();
    // this.emptyRow();
  }
  listStock = [] as Stock[];

  manageSearch(): void {
    stockApi
      .getStock(this.search)
      .then((response) => {
        if (response.status == 200) {
          this.listStock = response.data["data"];

          if (this.listStock.length == 1) {
            let stock = this.listStock[0];
            let purchase = Object.assign({}, {
              quantity: 1,
              product_id: stock.id,
              name: stock.name,
              price: stock.price,
            } as ItemCommandFournisseur);

            // this.$root.$emit("addItem",  purchase);
            commandFournisseurModule.addItem(purchase);
          } else {
            if (this.listStock.length > 1) {
              this.$root.$emit("searchManagePurchase", this.search.name);
            } else {
              SnackBarModule.setSnackbar({
                text: "المنتج غير موجود",
                color: "error",
                timeout: 2000,
                show: true,
                icon: "mdi-alert-outline",
                x: "right",
                y: "top",
              });
            }
          }
        }
        this.search.name = "";
      })
      .catch((error) => {
        SnackBarModule.setSnackbar({
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

  clearInput(): void {
    this.search.name = "";
  }
  saveFacture(print = false): void {
    this.loading = true;

    this.apiFacture
      .saveCommandFournisseur(this.facture)
      .then((res) => {
        this.facture = res["data"];
        let copyFacture = Object.assign({}, this.facture);

        this.items = [];
        this.addNewFacture();
        this.loading = false;
        if (print) {
          this.print(copyFacture);
        }
        // PrintImage.printFacturePdf(this.setting, copyFacture as any, "مورد");

        this.$root.$emit("updateFactures", "");
        SnackBarModule.setSnackbar({
          text: "تم عملية الإضافة بنجاح",
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
          text: "خطأ,فشل عملية الإضافة",
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

  getapi(url?: string): void {
    FournisseurApi.getAllFournisseurs(url).then((data) => {
      this.listFournisseur = data as Fournisseur[];
    });
  }

  print(command: CommandFournisseur): void {
    // console.log(this.selected);
    let printHeader = [
      {
        dataKey: "quantity",
        header: "الكمية",
      },
      {
        dataKey: "name",
        header: "الصنف",
      },
    ];
    PrintImage.printGenericFacturePdf(
      printHeader,
      command.items_command_fournisseur,
      "طلب شراء",
      [["المورد: " + command.fournisseur.name]],
      settingModule.getSetting
    );
  }
  @Watch("facture.fournisseur_id", { immediate: true, deep: true })
  selectClient(): void {
    this.facture.fournisseur = this.listFournisseur.find(
      (e) => e.id == this.facture.fournisseur_id
    );
  }

  deleteItem(purchase: Purchase, index: number): void {
    this.facture.items_command_fournisseur.splice(index, 1);
  }

  clearAll() {
    // commandFournisseurModule.clearCart();
  }
  windowSize = { x: 0, y: 0 };

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
  rowClick(item: any, row: any) {
    // if (!row.isSelected) {
    //   row.select(true);
    //   this.selectedSale = item;
    // } else {
    //   row.select(false);
    //   this.selectedSale = {} as Purchase;
    // }
  }

  products: Stock[] = [];
  expireProducts: Stock[] = [];
  expiredAndFinished = [];

  getNotifications(): void {
    NotificationApi.getNotificationsApi().then((res) => {
      this.products = res.data["quantityProducts"];
      this.expireProducts = res.data["expireProducts"];
      // this.expiredAndFinished = this.products.concat(this.expireProducts);
      console.log(res);
    });
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

::v-deep .centered-input input {
  text-align: center;
}
</style>
