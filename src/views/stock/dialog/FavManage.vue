<template>
  <v-dialog v-model="dialog" scrollable max-width="750">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn large color="primary" elevation="1">
          {{ $t("ajoute_favori") }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title class="primary--text font-weight-bold">
        <span v-if="mutableAction == 1"> {{ $t("ajoute_favori") }} </span>
        <span v-else> تعديل معلومات المفضلة</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="my-3">
              <v-col>
                <!-- <span>اسم المصروف</span> -->
                <v-text-field
                  v-model="favobj.name"
                  color="blue darken-2"
                  flat
                  solo
                  hint="المفضلة"
                  placeholder="ادخل اسم المفضلة"
                  required
                  prepend-inner-icon="mdi-heart-outline"
                  clearable
                  :rules="vuser.name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-spacer></v-spacer>
        <v-btn large outlined color=" red darken-1" @click="close">إلغاء</v-btn>
        <v-btn large color="primary" v-if="mutableAction == 1" @click="manage"
          >حفظ
        </v-btn>
        <v-btn large color="primary" v-else @click="manage">تعديل</v-btn>
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

import settingModule from "@/store/settingModule";
import Favorite from "@/classes/favorite";

@Component({ components: { barcode: VueBarcode } })
export default class FavManage extends Vue {
  @Prop({ default: 1 }) action!: number;
  mutableAction = 1;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string): void {
    this.menu.save(date);
  }

  @Ref() bdayMenu!: any;
  bdayMenuState = false;
  bdayDate = "";

  saveBday(date: string) {
    this.menu.save(date);
  }

  public dialog = false;
  valid = true;

  favobj = {} as Favorite;
  vuser = new VUser();
  original = {} as Favorite;

  created() {
    this.mutableAction = this.action;

    this.$root.$on("editfav", (selectstock: Favorite) => {
      this.favobj = Object.assign({}, selectstock);
      this.mutableAction = 2;
      this.dialog = true;
      this.original = selectstock;
    });
  }

  close() {
    this.favobj = {} as Favorite;
    this.mutableAction = 1;
    this.dialog = false;
  }

  manage() {
    if (this.form.validate()) {
      if (this.mutableAction == 1) {
        stockApi
          .saveFav(this.favobj)
          .then((result: any) => {
            let saved = ((result as any).data as any).data as Favorite;

            this.$root.$emit("createdFav", saved);

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
          .updateFav(this.favobj)
          .then((result: any) => {
            if (result.status == 200) {
              Object.assign(this.original, this.favobj);
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
      this.close();
      // trequest take for exapmle
    }
  }
}
</script>
