<template>
  <v-dialog v-model="dialog" scrollable max-width="650">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableDepotAction == 2 && !depotObj.id"
          color="primary"
          large
          elevation="1"
        >
          إضافة مخزن جديد
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title class="primary--text">
        <span v-if="mutableDepotAction == 1"> اضافة مخزن جديد</span>
        <span v-else> تعديل معلومات المخزن</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-6">
              <v-col>
                <v-text-field
                  color="blue darken-2"
                  hint="اسم المخزن"
                  placeholder="المخزن"
                  required
                  flat
                  solo
                  prepend-inner-icon="mdi-store-outline"
                  clearable
                  v-model="depotObj.name"
                  :rules="vDepot.name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col>
                <v-text-field
                  color="blue darken-2"
                  hint="الهاتف"
                  placeholder="ادخل الهاتف "
                  required
                  flat
                  solo
                  prepend-inner-icon="mdi-phone-in-talk-outline"
                  clearable
                  v-model="depotObj.tel"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  placeholder="ادخل الايميل"
                  hint="  الايميل"
                  prepend-inner-icon="mdi-email-outline"
                  required
                  flat
                  solo
                  clearable
                  v-model="depotObj.email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col>
                <v-text-field
                  placeholder="ادخل العنوان"
                  hint="  العنوان"
                  required
                  prepend-inner-icon="mdi-map-marker-outline"
                  flat
                  solo
                  clearable
                  v-model="depotObj.address"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn large outlined class="mx-3" color="red darken-1" @click="close"
          >إلغاء</v-btn
        >
        <v-btn
          large
          class="mx-3"
          color="primary"
          v-if="mutableDepotAction == 1"
          @click="manage"
          >حفظ
        </v-btn>
        <v-btn large class="mx-3" color="primary" v-else @click="manage"
          >تعديل
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Ref, Prop } from "vue-property-decorator";
import Depot from "@/classes/depot";
import VExpense from "@/validation/vExpense";
import DepotApi from "@/api/depotApi";
import SnackBarModule from "@/store/snackBarModule";

@Component({ components: {} })
export default class ManageDepot extends Vue {
  @Prop({ default: 1 }) depotAction!: number;
  mutableDepotAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
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
  // depotObj = {} as Depot;
  vDepot = new VExpense();

  apiDepot = new DepotApi();
  depotObj = {} as Depot;
  // vDepot = new VExpense();
  original = {} as Depot;

  created() {
    this.mutableDepotAction = this.depotAction;

    this.$root.$on("editDepot", (selectDepot: Depot) => {
      this.depotObj = Object.assign({}, selectDepot);

      this.mutableDepotAction = 2;
      this.dialog = true;
      this.original = selectDepot;
    });
  }

  close() {
    this.depotObj = {} as Depot;
    this.mutableDepotAction = 1;
    this.dialog = false;
  }

  manage() {
    if (this.form.validate()) {
      if (this.mutableDepotAction == 1) {
        this.apiDepot
          .saveDepot(this.depotObj)
          .then((result: any) => {
            let saved = (result as any).data as Depot;
            this.$root.$emit("createdDepot", saved);
            SnackBarModule.setSnackbar({
              text: "تمت العملية بنجاح",
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
        this.apiDepot.updateDepot(this.depotObj).then((result: any) => {
          Object.assign(this.original, result.data);
          SnackBarModule.setSnackbar({
            text: "تم التعديل بنجاح",
            color: "success",
            timeout: 2000,
            show: true,
            icon: "mdi-checkbox-marked-circle-outline",
            x: "right",
            y: "top",
          });
        });
      }
      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);
      this.close();
    }
  }
}
</script>
