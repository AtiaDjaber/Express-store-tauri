<template>
  <div>
    <v-row class="mt-6" justify="center">
      <v-btn large @click="updateSetting()" color="blue darken-3 white--text">
        حفظ
        <v-icon class="ma-2" large>mdi-content-save</v-icon>
      </v-btn>
    </v-row>
    <v-tabs class="ma-8" centered fixed-tabs background-color="transparent">
      <v-tab>
        <v-icon right>mdi-cog</v-icon>

        <h2 class="ma-2">إعدادات عامة</h2>
      </v-tab>
      <v-tab>
        <v-icon right>mdi-receipt</v-icon>
        <h2 class="ma-2">معلومات الطباعة</h2>
      </v-tab>

      <v-tab>
        <v-icon right>mdi-printer</v-icon>
        <h2 class="ma-2">الطابعات</h2>
      </v-tab>

      <v-tab>
        <v-icon right>mdi-database-check</v-icon>
        <h2 class="ma-2">النسخ الاحتياطي</h2>
      </v-tab>
      <v-tab>
        <v-icon right>mdi-gift</v-icon>
        <h2 class="ma-2">الزبائن الأوفياء</h2>
      </v-tab>
      <v-tab-item>
        <v-row justify="center" class="mx-8 mt-8">
          <v-col cols="4">
            <h3 class="ma-2 primary--text">اختر تاريخ الزكاة</h3>
            <c-date-picker
              placeholder="اختر تاريخ الزكاة"
              label="اختر تاريخ الزكاة"
              hint="اختر تاريخ الزكاة"
              clearable
              v-model="setting.zakat"
              flat
              solo
            ></c-date-picker>
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
        <v-row justify="center" class="mx-8">
          <v-col cols="4">
            <h3 class="ma-2 primary--text">اختر مخزن البيع</h3>
            <v-select
              v-model="setting.depot_id"
              :items="listDepots"
              item-text="name"
              item-value="id"
              flat
              solo
              hint="اختر مخزن البيع"
              label="اختر مخزن البيع"
              placeholder="اختر مخزن البيع"
              prepend-inner-icon="mdi-store-outline"
            ></v-select>
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="5">
            <h3 class="ma-2 primary--text">عرض المفضلة</h3>

            <v-btn-toggle
              v-model="setting.isImage"
              mandatory
              class="mt-3"
              group
              background-color="red"
              color="primary"
            >
              <v-btn text>
                <v-icon class="mx-2">mdi-image-outline</v-icon>
                صور
              </v-btn>
              <v-btn text>
                ازرار
                <v-icon class="mx-2">mdi-image-off-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row class="my-6"></v-row>
      </v-tab-item>

      <v-tab-item class="ma-16">
        <v-row justify="center" class="mb-6">
          <v-col class="mx-6">
            <v-row justify="center">
              <v-col cols="6">
                <h3 class="ma-2 primary--text">اسم المحل</h3>

                <v-text-field
                  v-model="setting.name_store"
                  flat
                  solo
                  clearable
                  prepend-inner-icon="mdi-storefront-outline"
                  label="المحل"
                  hint=" أدخل اسم المحل "
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="ma-2 primary--text">الهاتف</h3>

                <v-text-field
                  v-model="setting.tel"
                  label="الهاتف"
                  flat
                  solo
                  clearable
                  prepend-inner-icon="mdi-phone-in-talk-outline"
                  hint=" أدخل رقم الهاتف"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-n3">
              <v-col cols="6">
                <h3 class="ma-2 primary--text">العنوان</h3>

                <v-text-field
                  v-model="setting.address"
                  flat
                  solo
                  clearable
                  prepend-inner-icon="mdi-map-marker-outline"
                  label="العنوان"
                  hint="أدخل العنوان"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <h3 class="ma-2 primary--text">أدخل الإيميل</h3>

                <v-text-field
                  v-model="setting.email"
                  clearable
                  flat
                  solo
                  prepend-inner-icon="mdi-email-outline"
                  label="الإيميل"
                  hint=" أدخل الإيميل"
                  placeholder=" أدخل الإيميل"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h3 class="ma-2 primary--text">ملاحظة أسفل الفاتورة</h3>

                <v-text-field
                  v-model="setting.remark"
                  clearable
                  flat
                  solo
                  prepend-inner-icon="mdi-note-edit-outline"
                  label="الملاحظة"
                  hint=" أدخل ملاحظة اسفل الفاتورة"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row class="mb-2">
              <h3 class="ma-2 primary--text">شعار المحل</h3>
            </v-row>
            <v-card flat elevation="1" width="250" height="250" outlined>
              <v-img
                eager
                aspect-ratio="1"
                :src="
                  setting.logo == null
                    ? 'require(../src/assets/no-image.png)'
                    : setting.logo
                "
              >
                <v-row class="ma-1">
                  <v-icon
                    class="ma-1"
                    color="red"
                    v-if="setting.logo != null"
                    size="30"
                    @click="clearImage"
                    >mdi-delete
                  </v-icon>
                  <v-file-input
                    class="mr-1"
                    hide-input
                    id="file_cam"
                    accept="image/png, image/jpeg, image/bmp"
                    prepend-icon="fa-camera"
                    @change="selectImage"
                  ></v-file-input>
                </v-row>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>

      <v-tab-item class="ma-16">
        <v-col justify="center" class="mb-6">
          <v-row class="mt-n3">
            <v-col cols="6">
              <h3 class="ma-2 primary--text">طابعة الباركود</h3>

              <v-select
                v-model="setting.barcode"
                :items="listPrinter"
                item-text="name"
                flat
                solo
                label="طابعة الباركود"
                placeholder="إختيار اسم طابعة الباركود"
                prepend-inner-icon="mdi-printer-outline"
              ></v-select>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row>
          <v-row class="mt-n3">
            <v-col cols="6">
              <h3 class="ma-2 primary--text">طابعة الفاتورة</h3>
              <v-select
                v-model="setting.facture"
                :items="listPrinter"
                item-text="name"
                flat
                solo
                label="طابعة الفاتورة"
                placeholder="إختيار اسم طابعة الفاتورة"
                prepend-inner-icon="mdi-printer-outline"
              ></v-select>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row>
          <v-row class="mt-n3">
            <v-col cols="6">
              <h3 class="ma-2 primary--text">طابعة الوصل</h3>

              <v-select
                v-model="setting.receipt"
                :items="listPrinter"
                item-text="name"
                flat
                solo
                label="طابعة الوصل"
                placeholder="إختيار اسم طابعة الوصل"
                prepend-inner-icon="mdi-printer-outline"
              ></v-select>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row>
        </v-col>
      </v-tab-item>

      <v-tab-item class="ma-16">
        <v-col justify="center" class="mb-6">
          <v-row class="mt-n3">
            <v-col cols="6">
              <h3 class="ma-2 primary--text">استيراد قاعدة بيانات</h3>
              <v-file-input
                class="mr-1"
                solo
                hide-spin-buttons
                flat
                accept=".sql"
                prepend-inner-icon="mdi-database-arrow-up-outline"
                @change="restoreDB"
              ></v-file-input>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row>
          <!-- <v-row class="mt-n3">
            <v-col cols="6">
              <h3 class="ma-2 primary--text">تصدير نسخة احتياطية</h3>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row> -->
        </v-col>
      </v-tab-item>
      <v-tab-item class="ma-16">
        <v-col justify="center" class="mb-6">
          <v-card outlined elevation="0">
            <div class="plain pa-1">
              <h3 class="green--text pa-5">
                <v-icon color="green" class="mx-2">mdi-arrow-up</v-icon>اكتساب
                النقاط
              </h3>
              <v-divider></v-divider>
              <v-row class="mt-n3 pa-8">
                <v-col cols="5">
                  <h3 class="ma-2 primary--text">قيمة المبلغ لتحويله لنقاط</h3>
                  <v-text-field
                    v-model="setting.priceToPoint"
                    flat
                    solo
                    type="number"
                    clearable
                    prepend-inner-icon="mdi-cash"
                    placeholder="ادخل قيمة المبلغ لتحويله لنقاط "
                    label="قيمة المبلغ لتحويله لنقاط"
                    hint=" قيمة المبلغ لتحويله لنقاط "
                  ></v-text-field>
                </v-col>
                <v-col cols="1" class="mx-auto mt-11">
                  <v-icon size="40">mdi-arrow-left</v-icon></v-col
                >
                <v-col cols="5">
                  <h3 class="ma-2 primary--text">
                    عدد النقاط المكتسبة من المبلغ
                  </h3>
                  <v-text-field
                    v-model="setting.pointFromPrice"
                    flat
                    solo
                    type="number"
                    clearable
                    prepend-inner-icon="mdi-cash-100"
                    placeholder="ادخل عدد النقاط المكتسبة من المبلغ"
                    label=" عدد النقاط المكتسبة من المبلغ"
                    hint=" عدد النقاط المكتسبة من المبلغ"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card>
          <v-card class="mt-8" outlined elevation="0">
            <div class="plain pa-1">
              <h3 class="secondary--text pa-5">
                <v-icon color="secondary" class="mx-2">mdi-arrow-down</v-icon
                >استبدال النقاط
              </h3>
              <v-divider></v-divider>
              <v-row class="mt-n3 pa-8">
                <v-col cols="5">
                  <h3 class="ma-2 primary--text">
                    عدد النقاط لتحويلها للاستفادة
                  </h3>
                  <v-text-field
                    v-model="setting.pointToPrice"
                    flat
                    solo
                    type="number"
                    clearable
                    prepend-inner-icon="mdi-cash-100"
                    placeholder="ادخل عدد النقاط "
                    label="عدد النقاط"
                    hint=" عدد النقاط "
                  ></v-text-field>
                </v-col>
                <v-col cols="1" class="mx-auto mt-11">
                  <v-icon size="40">mdi-arrow-left</v-icon></v-col
                >
                <v-col cols="5">
                  <h3 class="ma-2 primary--text">مبلغ الاستفادة</h3>
                  <v-text-field
                    v-model="setting.priceFromPoint"
                    flat
                    solo
                    type="number"
                    clearable
                    prepend-inner-icon="mdi-cash"
                    placeholder="ادخل مبلغ الاستفادة "
                    label="مبلغ الاستفادة"
                    hint=" مبلغ الاستفادة "
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-tab-item>
    </v-tabs>
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
import { Vue, Component } from "vue-property-decorator";
// import * as electron from "electron";
import CDatePicker from "@/components/CDatePicker.vue";
import SettingApi from "@/api/setting_api";
import { Setting } from "@/classes/setting";
import SnackBarModule from "@/store/snackBarModule";
import settingModule from "@/store/settingModule";
import DepotApi from "@/api/depotApi";
import Depot from "@/classes/depot";
import Search from "@/classes/search";
// import { exec } from "child_process";

@Component({ components: { CDatePicker } })
export default class SettingView extends Vue {
  settingApi = new SettingApi();
  listPrinter:[] = [];
  public selectedPrinter = {} ;
  // previewImage = null;
  imagePath = "";
  private api = new DepotApi();
  listDepots = [] as Depot[];
  clearImage() {
    this.setting.logo = null;
    settingModule.setSetting(this.setting);
    // this.settingApi
    //   .updateSetting({ id: 1, logo: null } as Setting)
    //   .then((res) => {
    //     this.setting.logo = null;
    //     // this.previewImage = null;
    //     SnackBarModule.setSnackbar({
    //       text: "تمت عملية الحذف بنجاح",
    //       color: "success",
    //       timeout: 3000,
    //       show: true,
    //       icon: "mdi-checkbox-marked-circle-outline",
    //       x: "right",
    //       y: "top",
    //     });
    //   });
  }
  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = (error) => reject(error);
    });
  }

  async selectImage(image: File) {
    if (image != null && image != undefined) {
      this.setting.logo = await this.convertToBase64(image);
      settingModule.setSetting(this.setting);
      // let formData = new FormData();

      // formData.append("logo", image);
      // this.settingApi.uploadImage(formData).then((res) => {
      //   settingModule.getSettings();

      SnackBarModule.setSnackbar({
        text: "تمت تغيير الشعار بنجاح",
        color: "success",
        timeout: 3000,
        show: true,
        icon: "mdi-checkbox-marked-circle-outline",
        x: "right",
        y: "top",
      });
      // }
      // });
    }
  }

  updateSetting() {
    console.log(this.setting);
    settingModule.setSetting(this.setting);
    SnackBarModule.setSnackbar({
      text: "تمت عملية التعديل بنجاح",
      color: "success",
      timeout: 3000,
      show: true,
      icon: "mdi-checkbox-marked-circle-outline",
      x: "right",
      y: "top",
    });
    // this.settingApi.updateSetting(this.setting).then((res) => {
    //   localStorage.setItem("depot_id", this.setting.depot_id?.toString());
    //   if (res.status == 200) {
    //     settingModule.getSettings();
    //     SnackBarModule.setSnackbar({
    //       text: "تمت عملية التعديل بنجاح",
    //       color: "success",
    //       timeout: 3000,
    //       show: true,
    //       icon: "mdi-checkbox-marked-circle-outline",
    //       x: "right",
    //       y: "top",
    //     });
    //   }
    // });
  }

  get setting() {
    return settingModule.getSetting;
  }
  search = new Search();

  created() {
    this.getPrinters();
    this.api.getDepots(this.search).then((data) => {
      this.listDepots = [];

      this.listDepots = (data as any).data;
      this.listDepots.push({
        id: null,
        name: "المخزن الرئيسي",
      });
    });
  }

  async getPrinters(): Promise<void> {
    // let win = new electron.remote.BrowserWindow({ show: false });
    // this.listPrinter = win.webContents.getPrinters();
  }
  loading = false;
  restoreDB(file: File): void {
    if (file != null) {
      this.loading = true;
      // const printCmd = exec(
      //   "mysql -u root express_store < backup\\" + file.name
      // );

      // printCmd.stdout.on("data", (data) => {
      //   this.loading = false;
      //   console.log(`print data: ${data}`);
      // });
      // printCmd.stderr.on("data", (data) => {
      //   console.error(`child stderr:\n${data}`);
      //   this.loading = false;
      // });
    }
  }
}
</script>
<style>
.v-card.borderme {
  border: 2px solid #f54c14 !important;
}

.v-card.borderout {
  border: 1px solid #bcaaa4 !important;
}
#file_cam {
  color: rgb(69 175 26 / 89%);
}
/* #my-table {  position: absolute; y: -10000; } */
</style>
