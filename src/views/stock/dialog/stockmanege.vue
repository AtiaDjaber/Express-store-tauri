<template>
  <v-dialog v-model="dialog" scrollable max-width="750">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn color="primary" elevation="3">
          اضافة صنف جديد
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="primary white--text">
        <span v-if="mutableStockAction == 1"> إضافة صنف جديد</span>
        <span v-else> تعديل معلومات الصنف</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-2">
              <v-col>
                <!-- <span>اسم المصروف</span> -->
                <v-text-field
                  v-model="stockobj.name"
                  color="blue darken-2"
                  dense
                  label="الصنف"
                  placeholder="ادخل اسم الصنف"
                  required
                  outlined
                  clearable
                  :rules="vuser.name"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="stockobj.barcode"
                  color="blue darken-2"
                  dense
                  label="الباركود"
                  placeholder="أدخل الباركود"
                  required
                  outlined
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col cols="6" sm="6">
                <v-text-field
                  v-model="stockobj.price"
                  placeholder="أدخل سعر الشراء"
                  label="سعر الشراء"
                  required
                  outlined
                  type="number"
                  dense
                  clearable
                  :rules="vuser.price"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="stockobj.sell_price"
                  placeholder="أدخل سعر البيع"
                  required
                  label="سعر البيع"
                  outlined
                  type="number"
                  dense
                  clearable
                  :rules="vuser.price"
                  @input="sellprice"
                ></v-text-field>
              </v-col>
              <v-row>
                <v-col cols="3"></v-col>
                <v-col>
                  <v-text-field
                    v-model="stockobj.Percentage"
                    placeholder="أدخل  نسبة الربح"
                    required
                    label=" نسبة الربح"
                    outlined
                    type="number"
                    dense
                    clearable
                    :rules="vuser.price"
                    @input="Percentage"
                  ></v-text-field>
                  </v-col>
                <v-col cols="3"></v-col>
              </v-row>
            </v-row>
            <v-row class="mt-n1">
              <!-- <v-col cols="4"> -->
              <!-- <span>صلاحيات المستخدم</span> -->
              <!-- </v-col> -->
              <!-- <v-col>
                <v-divider></v-divider>
              </v-col> -->
              <v-col cols="6" sm="6">
                <v-text-field
                  v-model="stockobj.quantity"
                  placeholder="أدخل الكمية"
                  label="الكمية"
                  required
                  outlined
                  type="number"
                  dense
                  clearable
                  :rules="vuser.quantity"
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="6">
                <v-text-field
                  v-model="stockobj.quantity_alert"
                  placeholder="أدخل كمية التنبيه"
                  label="كمية التنبيه"
                  required
                  outlined
                  type="number"
                  dense
                  clearable
                  :rules="vuser.quantity"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions style="background-color: #f7f7f7" class="justify-end">
        <v-btn large outlined color=" red darken-1" @click="close">إلغاء</v-btn>
        <v-btn
          large
          color="primary"
          v-if="mutableStockAction == 1"
          @click="manage"
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
import loginModule from "@/store/loginModule";

@Component({})
export default class Manageexp extends Vue {
  @Prop({ default: 1 }) stockAction!: number;
  mutableStockAction = 1;
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

  Apistock = new stockApi();

  stockobj = {} as Stock;
  vuser = new VUser();
  original = {} as Stock;

  items = ["يوم", "ساعة"];

  created() {
    this.mutableStockAction = this.stockAction;

    this.$root.$on("editstock", (selectstock: Stock) => {
      this.stockobj = Object.assign({}, selectstock);
      this.mutableStockAction = 2;
      this.dialog = true;
      this.original = selectstock;
    });
  }

Percentage(){
  this.stockobj.sell_price =  Number(this.stockobj.Percentage * this.stockobj.price / 100) + Number(this.stockobj.price) ;
}
sellprice(){  
  this.stockobj.Percentage =  Number(this.stockobj.sell_price * 100/ this.stockobj.price) - 100 ;
}

  close() {
    this.stockobj = {} as Stock;
    this.mutableStockAction = 1;
    this.dialog = false;
  }

  manage() {
    if (this.form.validate()) {
      if (this.mutableStockAction == 1) {
        console.log(this.stockobj.type);
        console.log(this.stockobj.quantity);
        // console.log(this.stockobj)
        // this.stockobj.type = "";

        this.Apistock.saveStock(this.stockobj)
          .then((result: any) => {
            let saved = ((result as any).data as any).data as Stock;

            this.$root.$emit("createdstocks", this.stockobj);

            SnackBarModule.setSnackbar({
              text: "تمت الإضافة بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
            this.close();
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
        this.Apistock.updateStock(this.stockobj)
          .then((result: any) => {
            if (result.status == 200) {
              Object.assign(this.original, this.stockobj);
              //   if (this.stockobj.id == (loginModule.getCurrentUser as Stock).id) {
              //     loginModule.setUser(JSON.stringify(this.stockobj));
              //     this.$root.$emit("editedCurrentUser", this.stockobj);
              //   }
            }
            this.close();
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
}
</script>
