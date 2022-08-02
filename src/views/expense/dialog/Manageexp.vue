<template>
  <v-dialog v-model="dialog" scrollable max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn

          :disabled="mutableExpenseAction == 2 && !expenseobj.id"
          color="primary"
          elevation="5"
        >
         إضافة مصروف
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="light-blue darken-4 white--text">
        <span v-if="mutableExpenseAction == 1"> مصروف جديد</span>
        <span v-else> تعديل معلومات المصروف</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-6">
              <v-col>
                <v-text-field
                  color="blue darken-2"
                  dense
                  label="اسم المصروف"
                  placeholder="المصروف"
                  required
                  outlined
                  clearable
                  v-model="expenseobj.name"
                  :rules="vexpense.name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <v-col>
                <v-text-field
                  placeholder="السعر"
                  label="  السعر"
                  required
                  outlined
                   type="number"
                  dense
                  clearable
                  v-model="expenseobj.price"
                  :rules="vexpense.price"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col>
                <v-text-field
                  placeholder="ملاحظة"
                  label="ملاحظة"
                  required
                  outlined
                  dense
                  clearable
                  v-model="expenseobj.remarque"
                  
                ></v-text-field>
                <!-- <v-text-field
                  placeholder="التاريخ"
                  label="التاريخ"
                  required
                  outlined
                  dense
                  clearable
                  v-model="expenseobj.date"
                  
                ></v-text-field> -->
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn text color="red darken-1" @click="close">إلغاء</v-btn>
        <v-btn
        text
          color="green darken-1"
          v-if="mutableExpenseAction == 1"
          @click="manage"
          >حفظ
        </v-btn>
        <v-btn text color="green darken-1" v-else @click="manage"
          >تعديل
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Ref, Prop } from "vue-property-decorator";
import expense from "@/classes/expense";
import Expense from "@/classes/expense";
import VExpense from "@/validation/vExpense";
import expenseApi from "@/api/expenseApi";
import SnackBarModule from "@/store/snackBarModule";
import loginModule from "@/store/loginModule";

@Component({ components: {} })
export default class ManageDepot extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  mutableExpenseAction = 0;
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
  //  TODO :disabled="mutableExpenseAction == 2 && !expenseobj.id"
  // expenseobj = {} as Expense;
  vexpense = new VExpense();

  Apiexpense = new expenseApi();
  expenseobj = {} as Expense;
  // vexpense = new VExpense();
  original = {} as Expense;
  created() {
    this.mutableExpenseAction = this.expenseAction;

    this.$root.$on("editexpense", (selectexpense: expense) => {
      this.expenseobj = Object.assign({}, selectexpense);

      this.mutableExpenseAction = 2;
      this.dialog = true;
      this.original = selectexpense;
    });
  }

  close() {
    this.expenseobj = {} as expense;
    this.mutableExpenseAction = 1;
    this.dialog = false;
    
  }
  get currentUser() {
    return loginModule.getCurrentUser;
  }
  manage() {
    this.expenseobj.user_id=this.currentUser.id;
    if (this.form.validate()) {
      if (this.mutableExpenseAction == 1) {
        this.Apiexpense.saveExpense(this.expenseobj)
          .then((result: any) => {
            let saved = (result as any).data as expense;
            this.$root.$emit("createdExpense", saved);
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
        this.Apiexpense.updateExpense(this.expenseobj).then((result: any) => {
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
        // .catch((error:any) => {
        //   SnackBarModule.setSnackbar({
        //     text: error,
        //     color: "error",
        //     timeout: 2000,
        //     show: true,
        //     icon: "mdi-alert-outline",
        //     x: "right",
        //     y: "top",
        //   });
        // });
      }
      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);
      this.close();
    }
  }
}
</script>
