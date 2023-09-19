<template>
  <v-dialog v-model="dialog" scrollable persistent fullscreen max-width="1000">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn large color="primary" elevation="1">
          {{ $t("add_product") }} <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card
      v-if="dialog"
      color="plain"
      height="810"
      @keyup.enter="addBarcode()"
    >
      <v-card-title class="primary--text font-weight-bold">
        <span v-if="mutableStockAction == 1"> {{ $t("add_product") }}</span>
        <span v-else>{{ $t("edit_product") }} </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid" class="mx-n10">
            <v-row no-gutters>
              <v-col cols="8">
                <v-row class="mt-2">
                  <v-col>
                    <span class="title_input"> {{ $t("nom_produit") }} </span>
                    <v-text-field
                      v-model="stockobj.name"
                      color="blue darken-2"
                      flat
                      solo
                      :hint="$t('nom_produit')"
                      :placeholder="$t('nom_produit')"
                      required
                      prepend-inner-icon="mdi-cube-outline"
                      clearable
                      :rules="vuser.name"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <span class="title_input"> {{ $t("reference") }} </span>
                    <v-text-field
                      v-model="stockobj.reference"
                      color="blue darken-2"
                      flat
                      solo
                      :hint="$t('reference')"
                      :placeholder="$t('reference')"
                      prepend-inner-icon="mdi-bulletin-board"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n5">
                  <v-col cols="6" sm="6">
                    <span class="title_input"> {{ $t("quantity") }} </span>

                    <v-text-field
                      v-model="stockobj.quantity"
                      :placeholder="$t('quantity')"
                      :hint="$t('quantity')"
                      required
                      flat
                      solo
                      prepend-inner-icon="mdi-cart-outline"
                      type="number"
                      clearable
                      :rules="vuser.quantity"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6">
                    <span class="title_input"> {{ $t("prix_achat") }} </span>
                    <v-text-field
                      v-model="stockobj.price"
                      :placeholder="$t('prix_achat')"
                      :hint="$t('prix_achat')"
                      :label="$t('prix_achat')"
                      required
                      prepend-inner-icon="mdi-cash"
                      flat
                      suffix="DA"
                      hide-spin-buttons
                      solo
                      type="number"
                      clearable
                      :rules="vuser.price"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n5">
                  <v-col cols="4">
                    <span class="title_input"> {{ $t("prix_vente") }} </span>
                    <v-text-field
                      v-model="stockobj.sell_price"
                      :placeholder="$t('prix_vente')"
                      :hint="$t('prix_vente')"
                      :label="$t('prix_vente')"
                      required
                      prepend-inner-icon="mdi-cash"
                      flat
                      solo
                      suffix="DA"
                      hide-spin-buttons
                      type="number"
                      clearable
                      :rules="vuser.price"
                      @input="sellPrice"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <span class="title_input"> {{ $t("marge_benifit") }} </span>
                    <v-text-field
                      v-model="stockobj.Percentage"
                      :placeholder="$t('marge_benifit')"
                      :hint="$t('marge_benifit')"
                      :label="$t('marge_benifit')"
                      required
                      hide-spin-buttons
                      flat
                      solo
                      prepend-inner-icon="mdi-percent"
                      type="number"
                      @input="Percentage"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <span class="title_input">{{
                      $t("prix_vente") + " 2"
                    }}</span>
                    <v-text-field
                      v-model="stockobj.sell_price2"
                      :placeholder="$t('prix_vente') + ' 2'"
                      :hint="$t('prix_vente') + ' 2'"
                      :label="$t('prix_vente') + ' 2'"
                      prepend-inner-icon="mdi-cash"
                      flat
                      solo
                      suffix="DA"
                      hide-spin-buttons
                      type="number"
                      clearable
                      @input="sellPrice2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <span class="title_input">
                      {{ $t("marge_benifit") + " 2" }}</span
                    >
                    <v-text-field
                      v-model="stockobj.percentage2"
                      :placeholder="$t('marge_benifit')"
                      :hint="$t('marge_benifit')"
                      hide-spin-buttons
                      flat
                      solo
                      prepend-inner-icon="mdi-percent"
                      type="number"
                      @input="Percentage2"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n5">
                  <v-col cols="6">
                    <span class="title_input">
                      {{ $t("taille_emballage") }}
                    </span>
                    <v-text-field
                      v-model="stockobj.packing_size"
                      :placeholder="$t('taille_emballage')"
                      :hint="$t('taille_emballage')"
                      prepend-inner-icon="mdi-cube-outline"
                      flat
                      solo
                      hide-spin-buttons
                      type="number"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <span class="title_input">
                      {{ $t("prix_emballage") }}
                    </span>
                    <v-text-field
                      v-model="stockobj.packing_price"
                      :placeholder="$t('prix_emballage')"
                      :hint="$t('prix_emballage')"
                      flat
                      solo
                      prepend-inner-icon="mdi-cash"
                      type="number"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-row justify="end">
                  <v-card width="280" height="280" class="mt-7" outlined>
                    <img
                      height="275"
                      width="275"
                      style="position: absolute"
                      :src="base64 != '' ? base64 : resolveImage"
                    />
                    <!-- <v-img
                      eager
                      aspect-ratio="1"
                      :src="base64 != '' ? base64 : resolveImage"
                    > -->
                    <v-row class="ma-1">
                      <v-btn
                        class="ma-2"
                        small
                        v-if="stockobj.photo != null"
                        fab
                        elevation="1"
                      >
                        <v-icon
                          class="ma-4"
                          color="red"
                          size="30"
                          @click="clearImage"
                          >mdi-delete
                        </v-icon></v-btn
                      >

                      <v-btn fab small class="ma-2" elevation="1">
                        <v-file-input
                          class="ps-2 pb-4"
                          hide-input
                          id="file_cam"
                          accept="image/png, image/jpeg, image/bmp,image/webp"
                          prepend-icon="fa-camera"
                          @change="selectImage"
                        ></v-file-input
                      ></v-btn>
                    </v-row>
                    <!-- </v-img> -->
                  </v-card></v-row
                >
              </v-col>
            </v-row>
            <v-tabs v-model="tab" background-color="transparent">
              <v-tab :key="0">
                <h3>
                  {{ $t("barcode") }}<v-icon class="mx-2">mdi-barcode</v-icon>
                </h3>
              </v-tab>
              <v-tab :key="1">
                <h3>
                  {{ $t("alert") }}
                  <v-icon class="mx-2">mdi-bell-outline</v-icon>
                </h3>
              </v-tab>
              <v-tab :key="2">
                <h3>
                  {{ $t("additional_information") }}
                  <v-icon class="mx-2">mdi-plus</v-icon>
                </h3>
              </v-tab>
              <v-tab :key="3">
                <h3>
                  {{ $t("description") }}
                  <v-icon class="mx-2">mdi-comment-text-outline</v-icon>
                </h3>
              </v-tab>
              <v-tabs-items v-model="tab">
                <v-tab-item key="0" class="pa-4">
                  <v-row class="mt-3" justify="space-between">
                    <v-col>
                      <v-row no-gutters>
                        <v-btn
                          @click="generateBarcode()"
                          class="me-2"
                          flat
                          fab
                          rounded
                          height="45"
                          width="45"
                          tile
                          elevation="0"
                          color="#E7FBE7"
                        >
                          <v-icon color="green">mdi-barcode</v-icon>
                        </v-btn>
                        <v-col>
                          <v-text-field
                            color="blue darken-2"
                            prepend-inner-icon="mdi-barcode"
                            :hint="$t('barcode')"
                            :placeholder="$t('barcode')"
                            required
                            flat
                            solo
                            clearable
                            @keyup="onChangeBarcode"
                            :value="selectedBarcode.name"
                          ></v-text-field>
                        </v-col>
                        <v-text-field
                          class="mx-2"
                          style="max-width: 100px"
                          :hint="$t('quantity')"
                          :placeholder="$t('quantity')"
                          flat
                          solo
                          type="number"
                          hide-details
                          hide-spin-buttons
                          :value="selectedBarcode.quantity"
                        >
                          <template v-slot:append>
                            <v-icon @click="selectedBarcode.quantity++"
                              >mdi-plus</v-icon
                            >
                          </template>
                          <template v-slot:prepend-inner>
                            <v-icon @click="selectedBarcode.quantity--"
                              >mdi-minus</v-icon
                            >
                          </template>
                        </v-text-field>
                        <v-btn
                          @click="addBarcode()"
                          class="ms-2"
                          flat
                          fab
                          elevation="1"
                          rounded
                          height="45"
                          width="45"
                          color="primary"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </v-row>
                      <v-row class="mt-n2">
                        <v-card outlined width="100%">
                          <v-data-table
                            :headers="Headers"
                            :items="stockobj.barcodes"
                            single-select
                            item-key="name"
                            @click:row="rowClick"
                            class="elevation-0"
                            hide-default-footer
                            :items-per-page="-1"
                          >
                            <template v-slot:[`item.actions`]="{ item }">
                              <v-row>
                                <delete-dialog
                                  :id="item.id"
                                  :disabled="false"
                                  :source="'Barcode'"
                                />
                              </v-row>
                            </template>
                          </v-data-table>
                        </v-card>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row justify="end">
                        <v-card outlined height="45" width="292">
                          <v-row justify="center">
                            <span class="me-4">
                              <v-switch
                                v-model="setting.printBarcodePrice"
                                inset
                                @change="changeSetting()"
                                :label="$t('price')"
                              ></v-switch
                            ></span>
                            <span class="ms-4">
                              <v-switch
                                v-model="setting.printBarcodeName"
                                inset
                                @change="changeSetting()"
                                :label="$t('name')"
                              ></v-switch
                            ></span>
                          </v-row>
                        </v-card>
                      </v-row>
                      <v-row
                        justify="end"
                        class="mt-4"
                        v-if="barcodeToPrint.name"
                      >
                        <v-card
                          outlined
                          :color="$vuetify.theme.dark ? 'white' : undefined"
                          class="pa-3"
                        >
                          <div id="barcodePrint">
                            <v-row
                              v-if="setting.printBarcodeName"
                              justify="center"
                              class="mb-0 mt-2"
                            >
                              <h3
                                style="
                                  letter-spacing: normal;
                                  color: black;
                                  text-align: center;
                                  width: 255px;
                                "
                              >
                                {{
                                  stockobj.name != undefined
                                    ? stockobj.name
                                    : ""
                                }}
                              </h3>
                            </v-row>
                            <v-row
                              v-if="setting.printBarcodePrice"
                              justify="center"
                              class="my-0"
                            >
                              <h3 style="letter-spacing: normal; color: black">
                                {{
                                  stockobj.sell_price != undefined
                                    ? stockobj.sell_price + " دج "
                                    : ""
                                }}
                              </h3>
                            </v-row>
                            <barcode
                              class="mt-1"
                              displayValue="false"
                              format="CODE128"
                              :value="barcodeToPrint.name"
                              font-options="bold"
                              width="2"
                              height="70"
                              margin-bottom="1"
                              margin-top="1"
                            >
                            </barcode>
                            <v-row justify="center" class="my-0">
                              <h4 style="letter-spacing: normal; color: black">
                                {{ setting.name_store }}
                              </h4>
                            </v-row>
                          </div>
                        </v-card>
                      </v-row>
                      <v-row
                        v-if="barcodeToPrint.name"
                        no-gutters
                        justify="end"
                        class="mt-5 me-n3"
                      >
                        <v-text-field
                          class="mx-2"
                          style="max-width: 100px"
                          hint="عدد النسخ"
                          placeholder="أدخل عدد النسخ"
                          flat
                          solo
                          type="number"
                          hide-details
                          hide-spin-buttons
                          v-model="numberCopies"
                        >
                          <template v-slot:append>
                            <v-icon @click="numberCopies++">mdi-plus</v-icon>
                          </template>
                          <template v-slot:prepend-inner>
                            <v-icon @click="numberCopies--">mdi-minus</v-icon>
                          </template>
                        </v-text-field>
                        <v-btn
                          large
                          color="primary"
                          outlined
                          text
                          height="47"
                          width="180"
                          @click="createPdf()"
                        >
                          <v-icon color="primary" class="mx-2">
                            fa-print
                          </v-icon>
                          طباعة
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-tab-item>

                <v-tab-item key="1">
                  <v-row class="mt-3">
                    <v-col cols="6" sm="6">
                      <span class="title_input"> {{ $t("expire") }} </span>
                      <c-date-picker
                        v-model="stockobj.date_expire"
                        :hint="$t('expire')"
                        :placeholder="$t('expire')"
                        clearable
                        @eventname="clearDateExpire"
                      ></c-date-picker>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <span class="title_input">
                        {{ $t("alert_quantity") }}
                      </span>
                      <v-text-field
                        v-model="stockobj.quantity_alert"
                        :placeholder="$t('alert_quantity')"
                        :hint="$t('alert_quantity')"
                        required
                        flat
                        solo
                        prepend-inner-icon="mdi-bell-outline"
                        type="number"
                        clearable
                        :rules="vuser.quantity"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item key="2">
                  <v-row class="mt-3">
                    <v-col>
                      <span class="title_input">
                        {{ $t("select_category") }}
                      </span>
                      <v-autocomplete
                        :items="listCategories"
                        v-model="stockobj.category_id"
                        item-text="name"
                        item-value="id"
                        flat
                        solo
                        :placeholder="$t('select_category')"
                        :hint="$t('select_category')"
                        clearable
                        prepend-inner-icon="mdi-filter-outline"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="mt-n4">
                    <v-col cols="6" sm="6">
                      <span class="title_input">
                        {{ $t("complementary_products") }}
                      </span>
                      <v-autocomplete
                        :items="listAllProducts"
                        v-model="stockobj.accessoires"
                        multiple
                        item-text="name"
                        item-value="id"
                        flat
                        solo
                        return-object
                        :placeholder="$t('complementary_products')"
                        :hint="$t('complementary_products')"
                        chips
                        clearable
                        deletable-chips
                        prepend-inner-icon="mdi-package-variant-closed"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <span class="title_input">
                        {{ $t("alternative_products") }}
                      </span>
                      <v-autocomplete
                        :items="listAllProducts"
                        v-model="stockobj.alternatives"
                        item-text="name"
                        item-value="id"
                        return-object
                        multiple
                        chips
                        clearable
                        deletable-chips
                        flat
                        solo
                        :placeholder="$t('alternative_products')"
                        :label="$t('alternative_products')"
                        :hint="$t('alternative_products')"
                        prepend-inner-icon="mdi-directions-fork"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item key="3">
                  <v-row class="mt-3">
                    <v-col>
                      <span class="title_input"> {{ $t("description") }} </span>
                      <v-textarea
                        :placeholder="$t('description')"
                        :hint="$t('description')"
                        flat
                        v-model="stockobj.note"
                        solo
                        prepend-inner-icon="mdi-comment-text-outline"
                        clearable
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-spacer></v-spacer>
        <v-btn large outlined color=" red darken-1" @click="close">{{
          $t("cancel")
        }}</v-btn>
        <v-btn
          :loading="loading"
          large
          color="primary"
          class="mx-5"
          @click="manage"
          >{{ mutableStockAction == 1 ? $t("save") : $t("edit") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Ref, Prop } from "vue-property-decorator";
import SnackBarModule from "@/store/snackBarModule";
import stockApi from "@/api/stockApi";
import Stock from "@/classes/stock";
import VUser from "@/validation/VUser";
import VueBarcode from "vue-barcode";
import PrintImage from "@/print/print_image";
import Decoded from "@/helper/decode";
import settingModule from "@/store/settingModule";
import CDatePicker from "@/components/CDatePicker.vue";
import Category from "@/classes/category";
import CategoryApi from "@/api/categoryApi";
import Barcode from "@/classes/barcode";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import { Setting } from "@/classes/setting";
import Search from "@/classes/search";
import { resolveImage } from "@/helper/global_function";

@Component({ components: { barcode: VueBarcode, CDatePicker, DeleteDialog } })
export default class Manageexp extends Vue {
  Headers = [
    { text: "الباركود", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "العمليات", value: "actions" },
  ];
  @Prop({ default: 1 }) stockAction!: number;
  mutableStockAction = 1;
  tab = 0;
  selectedBarcode = { name: "", quantity: 1 } as Barcode;
  barcodeToPrint = { name: "", quantity: 1 } as Barcode;
  numberCopies = 1;
  @Ref() form: any;
  valid = true;

  createPdf(): void {
    PrintImage.printBarcode(
      document.getElementById("barcodePrint"),
      this.setting,
      this.numberCopies
    );
    this.numberCopies = 1;
  }

  onChangeBarcode(text: any): void {
    this.selectedBarcode.name = Decoded.DecodedBarcode(text.target.value);
    this.stockobj.barcode = Decoded.DecodedBarcode(text.target.value);
  }

  public dialog = false;

  stockobj = {
    barcode: "",
    barcodes: [],
    quantity_alert: 1,
    quantity: 0,
    accessoires: [],
    alternatives: [],
  } as Stock;
  vuser = new VUser();
  original = {} as Stock;

  addBarcode(): void {
    if (this.selectedBarcode.name) {
      this.stockobj.barcodes.unshift(this.selectedBarcode);
      this.newBarcode();
    }
  }

  get setting(): Setting {
    return settingModule.getSetting;
  }
  listCategories = [] as Category[];
  getListCategories(): void {
    CategoryApi.getCategories("categories")
      .then((response) => {
        this.listCategories = response;
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

  listAllProducts = [] as Stock[];
  getAllProducts(): void {
    stockApi.getAllStock(new Search()).then((res) => {
      this.listAllProducts = res.data;
    });
  }
  mounted(): void {
    this.getListCategories();
    this.getAllProducts();
  }
  created(): void {
    this.mutableStockAction = this.stockAction;

    this.$root.$on("editstock", (selectstock: Stock) => {
      if (selectstock.barcodes.length > 0) {
        this.barcodeToPrint = selectstock.barcodes[0];
      }
      this.stockobj = Object.assign({}, selectstock);
      this.mutableStockAction = 2;
      this.dialog = true;
      this.original = selectstock;
      this.sellPrice();
      this.sellPrice2();
    });

    this.$root.$on("deletedBarcodeId", (id: number) => {
      // console.log(this.stockobj.barcodes.findIndex((e) => e.id == id));
      this.stockobj.barcodes.splice(
        this.stockobj.barcodes.findIndex((e) => e.id == id),
        1
      );
    });
    this.$root.$on("categoryAdded", (category: Category) => {
      this.listCategories.push(category);
    });
  }

  Percentage() {
    this.stockobj.sell_price = Number(
      (
        Number((this.stockobj.Percentage * this.stockobj.price) / 100) +
        Number(this.stockobj.price)
      ).toFixed(2)
    );
  }

  Percentage2() {
    this.stockobj.sell_price2 = Number(
      (
        Number((this.stockobj.percentage2 * this.stockobj.price) / 100) +
        Number(this.stockobj.price)
      ).toFixed(2)
    );
  }
  sellPrice() {
    this.stockobj.Percentage = Number(
      (
        Number((this.stockobj.sell_price * 100) / this.stockobj.price) - 100
      ).toFixed(2)
    );
  }
  sellPrice2() {
    this.stockobj.percentage2 = Number(
      (
        Number((this.stockobj.sell_price2 * 100) / this.stockobj.price) - 100
      ).toFixed(2)
    );
  }

  newStock() {
    this.stockobj = {
      barcode: "",
      barcodes: [],
      quantity_alert: 1,
      quantity: 0,
    } as Stock;
  }
  newBarcode(): void {
    this.selectedBarcode = { name: "", quantity: 1 } as Barcode;
  }
  close(): void {
    this.newStock();
    this.newBarcode();

    this.mutableStockAction = 1;
    this.dialog = false;
    this.loading = false;
    this.base64 = "";
    this.selectedImage = null;
  }
  generateBarcode(): void {
    this.newBarcode();
    stockApi.getBarcode().then((res) => {
      this.selectedBarcode.name = res.data;
    });
  }

  changeSetting() {
    settingModule.setSetting(this.setting);
  }
  clearDateExpire() {
    this.stockobj.date_expire = null;
  }
  selectedImage: File;
  async selectImage(image: File): Promise<void> {
    if (image != null && image != undefined) {
      this.selectedImage = image;
      this.base64 = await this.convert(this.selectedImage);
      this.stockobj.path = (image as any).path;
    }
  }
  async convert(file: File): Promise<string> {
    if (file != undefined && file != null) {
      const fileToBlob = await new Blob(
        [new Uint8Array(await file.arrayBuffer())],
        {
          type: file.type,
        }
      );
      return (await this.blobToBase64(fileToBlob)) as string;
    }
  }

  blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  base64 = "";
  get resolveImage(): string {
    return resolveImage(this.stockobj, this.setting.host);
  }

  upload(id: number, original: Stock): void {
    if (this.selectedImage != null && this.selectedImage != undefined) {
      let formData = new FormData();

      formData.append("photo", this.selectedImage);
      formData.append("id", id.toString());
      console.log(formData);
      stockApi
        .uploadImage(formData)
        .then((res: any) => {
          Object.assign(original, res.data);

          this.close();
        })
        .catch((e) => {
          this.close();
        });
    } else {
      this.close();
    }
  }

  loading = false;
  manage(): void {
    if (this.form.validate()) {
      this.loading = true;

      if (this.mutableStockAction == 1) {
        stockApi
          .saveStock(this.stockobj)
          .then((result: any) => {
            let saved = ((result as any).data as any).data as Stock;

            this.upload(saved.id, saved);

            this.$root.$emit("createdstocks", saved);

            SnackBarModule.setSnackbar({
              text: "تمت الإضافة بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            this.loading = false;

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
      } else {
        stockApi
          .updateStock(this.stockobj)
          .then((result: any) => {
            if (result.status == 200) {
              let saved = ((result as any).data as any).data as Stock;
              Object.assign(this.original, saved);

              this.upload(saved.id, this.original);

              //   if (this.stockobj.id == (loginModule.getCurrentUser as Stock).id) {
              //     loginModule.setUser(JSON.stringify(this.stockobj));
              //     this.$root.$emit("editedCurrentUser", this.stockobj);
              //   }
            }
            SnackBarModule.setSnackbar({
              text: "تم التعديل بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            // this.close();
            this.loading = false;

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
      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);

      // trequest take for exapmle
    }
  }
  clearImage(): void {
    this.stockobj.photo = null;
    this.stockobj.path = null;
  }

  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
    }
    this.barcodeToPrint = item;
  }
}
</script>
