<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="1000">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn large color="primary" elevation="1">
          اضافة صنف جديد
          <v-icon>mdi-plus</v-icon>
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
        <span v-if="mutableStockAction == 1"> إضافة صنف جديد</span>
        <span v-else> تعديل معلومات الصنف</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row>
              <v-col cols="8">
                <v-row class="mt-2">
                  <v-col>
                    <v-text-field
                      v-model="stockobj.name"
                      color="blue darken-2"
                      flat
                      solo
                      hint="الصنف"
                      placeholder="ادخل اسم الصنف"
                      required
                      prepend-inner-icon="mdi-cube-outline"
                      clearable
                      :rules="vuser.name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n2">
                  <v-col cols="6" sm="6">
                    <v-text-field
                      v-model="stockobj.quantity"
                      placeholder="أدخل الكمية"
                      hint="الكمية"
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
                    <v-text-field
                      v-model="stockobj.price"
                      placeholder="أدخل سعر الشراء"
                      hint="سعر الشراء"
                      label="سعر الشراء"
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
                <v-row class="mt-n2">
                  <v-col cols="6">
                    <v-text-field
                      v-model="stockobj.sell_price"
                      placeholder="أدخل سعر البيع"
                      required
                      hint="سعر البيع"
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
                  <v-col cols="6">
                    <v-text-field
                      v-model="stockobj.Percentage"
                      placeholder="أدخل  نسبة الربح"
                      required
                      hint=" نسبة الربح"
                      flat
                      solo
                      prepend-inner-icon="mdi-percent"
                      type="number"
                      clearable
                      :rules="vuser.price"
                      @input="Percentage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-card width="250" height="250" class="ma-3 pa-1" outlined>
                  <v-img
                    eager
                    aspect-ratio="1"
                    :src="base64 != '' ? base64 : resolveImage"
                  >
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
                          class="pr-2 pb-4"
                          hide-input
                          id="file_cam"
                          accept="image/png, image/jpeg, image/bmp,image/webp"
                          prepend-icon="fa-camera"
                          @change="selectImage"
                        ></v-file-input
                      ></v-btn>
                    </v-row>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
            <v-tabs v-model="tab" background-color="transparent">
              <v-tab :key="0">
                <h3>الباركود <v-icon class="mx-2">mdi-barcode</v-icon></h3>
              </v-tab>
              <v-tab :key="1">
                <h3>معلومات إضافية <v-icon class="mx-2">mdi-plus</v-icon></h3>
              </v-tab>
              <v-tab :key="2">
                <h3>التنبيه <v-icon class="mx-2">mdi-bell-outline</v-icon></h3>
              </v-tab>
              <!--    <v-tab :key="2"> التعويض </v-tab>-->
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
                            hint="الباركود"
                            placeholder="أدخل الباركود"
                            required
                            flat
                            solo
                            clearable
                            @keyup="onChangeBarcode"
                            :value="selectedBarcode.name"
                          ></v-text-field>
                        </v-col>
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
                        <h3 class="primary--text pt-5 mx-2">طباعة</h3>
                        <span class="mx-2">
                          <v-switch
                            v-model="setting.printBarcodePrice"
                            inset
                            @change="changeSetting()"
                            label=" السعر"
                          ></v-switch
                        ></span>
                        <span class="mx-2">
                          <v-switch
                            v-model="setting.printBarcodeName"
                            inset
                            label="الاسم"
                          ></v-switch
                        ></span>
                      </v-row>
                      <v-row justify="end" v-if="selectedBarcode.name">
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
                              <h3 style="letter-spacing: normal; color: black">
                                {{
                                  stockobj.name != undefined
                                    ? stockobj.name.substring(0, 30)
                                    : ""
                                }}
                              </h3>
                            </v-row>
                            <v-row
                              v-if="setting.printBarcodePrice"
                              justify="center"
                              class="my-1"
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
                              displayValue="false"
                              format="CODE128"
                              :value="selectedBarcode.name"
                              font-options="bold"
                              width="2"
                              height="80"
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
                      <v-row v-if="selectedBarcode.name" justify="end">
                        <v-btn
                          large
                          color="primary"
                          outlined
                          text
                          class="my-2"
                          width="292"
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
                    <v-col>
                      <v-autocomplete
                        :items="listCategories"
                        v-model="stockobj.category_id"
                        item-text="name"
                        item-value="id"
                        flat
                        solo
                        placeholder="اختر الفئة"
                        label="الفئة"
                        hint="الفئة"
                        clearable
                        prepend-inner-icon="mdi-filter-outline"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" sm="6">
                      <v-autocomplete
                        :items="listAllProducts"
                        v-model="stockobj.accessoires"
                        multiple
                        item-text="name"
                        item-value="id"
                        flat
                        solo
                        return-object
                        placeholder="ملحقات الصنف"
                        label="ملحقات"
                        hint="ملحقات"
                        chips
                        clearable
                        deletable-chips
                        prepend-inner-icon="mdi-package-variant-closed"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      الاصناف البديلة في حالة انتهاء الكمية
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
                        placeholder="اختر الاصناف البديلة في حالة انتهاء الكمية"
                        label="الاصناف البديلة في حالة انتهاء الكمية"
                        hint="الاصناف البديلة في حالة انتهاء الكمية"
                        prepend-inner-icon="mdi-directions-fork"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item key="2">
                  <v-row class="mt-3">
                    <v-col cols="6" sm="6">
                      <c-date-picker
                        v-model="stockobj.date_expire"
                        hint="تاريخ نهاية الصلاحية"
                        placeholder="تاريخ نهاية الصلاحية"
                        clearable
                        @eventname="clearDateExpire"
                      ></c-date-picker>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field
                        v-model="stockobj.quantity_alert"
                        placeholder="أدخل كمية التنبيه"
                        hint="كمية التنبيه"
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
              </v-tabs-items>
            </v-tabs>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-spacer></v-spacer>
        <v-btn large outlined color=" red darken-1" @click="close">إلغاء</v-btn>
        <v-btn
          :loading="loading"
          large
          color="primary"
          class="mx-5"
          @click="manage"
          >{{ mutableStockAction == 1 ? "حفظ" : "تعديل" }}
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

  @Ref() form: any;
  createPdf(): void {
    PrintImage.printBarcode(document.getElementById("barcodePrint"));
  }

  onChangeBarcode(text: any): void {
    this.stockobj.barcode = Decoded.DecodedBarcode(text.target.value);
  }

  public dialog = false;
  valid = true;

  stockobj = { barcode: "", barcodes: [] } as Stock;
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
        this.selectedBarcode = selectstock.barcodes[0];
      }
      this.stockobj = Object.assign({}, selectstock);
      this.mutableStockAction = 2;
      this.dialog = true;
      this.original = selectstock;
      this.sellPrice();
    });

    this.$root.$on("deletedBarcodeId", (id: number) => {
      // console.log(this.stockobj.barcodes.findIndex((e) => e.id == id));
      this.stockobj.barcodes.splice(
        this.stockobj.barcodes.findIndex((e) => e.id == id),
        1
      );
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
  sellPrice() {
    this.stockobj.Percentage = Number(
      (
        Number((this.stockobj.sell_price * 100) / this.stockobj.price) - 100
      ).toFixed(2)
    );
  }

  newStock() {
    this.stockobj = { barcode: "", barcodes: [] } as Stock;
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
    return resolveImage(this.stockobj.photo);
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
  manage() {
    this.loading = true;
    if (this.form.validate()) {
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
            this.close();
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
  }

  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
    }
    this.selectedBarcode = item;
  }
}
</script>
