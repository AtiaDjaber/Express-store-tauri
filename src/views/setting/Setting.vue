<template>
  <div>
    <v-row class="mt-6" justify="center">
      <v-btn @click="updateSetting()" color="blue darken-3 white--text">
        حفظ
        <v-icon class="mx-2">mdi-content-save</v-icon>
      </v-btn>
    </v-row>
    <v-tabs class="ma-8">
      <v-tab>
        <v-icon right>mdi-cog</v-icon>
        إعدادات عامة
      </v-tab>
      <v-tab>
        <v-icon right>mdi-printer</v-icon>
        معلومات الفاتورة
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-row justify="center" class="ma-8">
            <v-col cols="4">
              <c-date-picker
                placeholder="إختيار تاريخ الزكاة"
                label="تاريخ الزكاة"
                clearable
                v-model="setting.zakat"
                outlined
                dense
              ></c-date-picker>
            </v-col>
            <v-col cols="4"></v-col>
          </v-row>
        </v-card>
      </v-tab-item>

      <v-tab-item class="ma-16">
        <v-card flat>
          <v-row justify="center" class="mb-6">
            <v-col class="mx-6">
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field
                    v-model="setting.name_store"
                    outlined
                    dense
                    clearable
                    prepend-inner-icon="mdi-storefront-outline"
                    label="المحل"
                    hint=" أدخل اسم المحل "
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="setting.tel"
                    label="الهاتف"
                    dense
                    outlined
                    clearable
                    prepend-inner-icon="mdi-phone-in-talk-outline"
                    hint=" أدخل رقم الهاتف"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center" class="mt-n3">
                <v-col cols="6">
                  <v-text-field
                    v-model="setting.address"
                    outlined
                    dense
                    clearable
                    prepend-inner-icon="mdi-map-marker-outline"
                    label="العنوان"
                    hint="أدخل العنوان"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="setting.remark"
                    clearable
                    outlined
                    dense
                    prepend-inner-icon="mdi-note-edit-outline"
                    label="الملاحظة"
                    hint=" أدخل ملاحظة اسفل الفاتورة"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n3">
                <v-col cols="6">
                  <v-select
                    v-model="setting.printer"
                    :items="listPrinter"
                    item-text="name"
                    outlined
                    label="الطابعة"
                    placeholder="إختيار اسم الطابعة"
                    prepend-inner-icon="mdi-printer-outline"
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="4"></v-col>
              </v-row>
            </v-col>
            <v-col cols="3">
              <v-row class="mb-2">
                <span class="px-2">شعار المحل</span>
              </v-row>
              <v-card flat elevation="1" width="250" height="250" outlined>
                <v-img
                  eager
                  aspect-ratio="1"
                  :src="
                    setting.logo == null
                      ? '@/assets/no-image.png'
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
                      dense
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
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
// ;
import CDatePicker from "@/components/CDatePicker.vue";
import SettingApi from "@/api/setting_api";
import { Setting } from "@/classes/setting";
import SnackBarModule from "@/store/snackBarModule";
import settingModule from "@/store/settingModule";

@Component({ components: { CDatePicker } })
export default class SettingView extends Vue {
  settingApi = new SettingApi();

  // previewImage = null;
  imagePath = "";

  clearImage() {
    this.settingApi
      .updateSetting({ id: 1, logo: null } as Setting)
      .then((res) => {
        this.setting.logo = null;
        // this.previewImage = null;
        SnackBarModule.setSnackbar({
          text: "تمت عملية الحذف بنجاح",
          color: "success",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      });
  }

  async selectImage(image: File) {
    if (image != null && image != undefined) {
      let formData = new FormData();
      // this.previewImage = null;

      formData.append("logo", image);
      this.settingApi.uploadImage(formData).then((res) => {
        // this.previewImage = (process.env.VUE_APP_API_URL as string) + (res.data as Setting).logo;
        settingModule.getSettings();

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
      });
    }
  }

  // setting = {} as Setting;
  options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
      marginType: "printableArea",
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: "Header of the Page",
    footer: "Footer of the Page",
  };

  updateSetting() {
    this.settingApi.updateSetting(this.setting).then((res) => {
      // settingModule.getSettings();

      if (res.status == 200) {
        settingModule.getSettings();
        SnackBarModule.setSnackbar({
          text: "تمت عملية التعديل بنجاح",
          color: "success",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      }
    });
  }

  get setting() {
    return settingModule.getSetting;
  }

  created() {
    this.getPrinters();
    // this.getSetting();
  }

  async getPrinters() {
    // const remote = electron.remote;
    // let win = new remote.BrowserWindow({ show: false });
    // this.listPrinter = win.webContents.getPrinters();
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
