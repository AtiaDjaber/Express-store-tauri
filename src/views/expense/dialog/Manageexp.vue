<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableExpenseAction == 2 && !expenseobj.id"
          color="primary"
          large
          elevation="1"
        >
          {{ $t("add_expense") }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title>
        <span v-if="mutableExpenseAction == 1"> {{ $t("add_expense") }}</span>
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
                  :hint="$t('expense_name')"
                  :placeholder="$t('expense_name')"
                  required
                  flat
                  solo
                  clearable
                  v-model="expenseobj.name"
                  :rules="vexpense.name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <v-col>
                <v-text-field
                  :hint="$t('montant')"
                  :placeholder="$t('montant')"
                  required
                  flat
                  solo
                  type="number"
                  clearable
                  v-model="expenseobj.price"
                  :rules="vexpense.price"
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="6">
                <c-date-picker
                  v-model="expenseobj.date"
                  :hint="$t('date')"
                  :placeholder="$t('date')"
                  solo
                  flat
                  clearable
                ></c-date-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-autocomplete
                  :items="listCategories"
                  v-model="expenseobj.expense_category_id"
                  item-text="name"
                  item-value="id"
                  flat
                  solo
                  :hint="$t('select_category')"
                  :placeholder="$t('select_category')"
                  clearable
                  prepend-inner-icon="mdi-filter-outline"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col>
                <v-text-field
                  :hint="$t('remark')"
                  :placeholder="$t('remark')"
                  required
                  flat
                  solo
                  clearable
                  v-model="expenseobj.remarque"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-autocomplete
                  :items="listBoxes"
                  v-model="expenseobj.box_id"
                  item-text="name"
                  item-value="id"
                  flat
                  solo
                  :hint="$t('select_box')"
                  :placeholder="$t('select_box')"
                  clearable
                  prepend-inner-icon="mdi-user-outline"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn text color="red darken-1" @click="close">{{
          $t("cancel")
        }}</v-btn>
        <v-btn
          text
          color="green darken-1"
          v-if="mutableExpenseAction == 1"
          @click="manage"
          >{{ $t("save") }}
        </v-btn>
        <v-btn text color="green darken-1" v-else @click="manage"
          >{{ $t("edit") }}
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
import CategoryApi from "@/api/categoryApi";
import Category from "@/classes/category";
import CDatePicker from "@/components/CDatePicker.vue";
import Box from "@/classes/box";
import BoxApi from "@/api/boxApi";

@Component({ components: { CDatePicker } })
export default class ManageDepot extends Vue {
  @Prop({ default: 0 }) expenseAction!: number;
  mutableExpenseAction = 0;

  date = "";

  public dialog = false;
  valid = true;
  @Ref() form: any;

  vexpense = new VExpense();

  expenseobj = {} as Expense;
  original = {} as Expense;

  listBoxes = [] as Box[];

  listCategories = [] as Category[];
  getListBoxes(): void {
    BoxApi.getAllBoxes()
      .then((response) => {
        this.listBoxes = response;
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
  getListCategories(): void {
    CategoryApi.getCategories("expense_categories")
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
  created() {
    this.getListBoxes();
    this.mutableExpenseAction = this.expenseAction;
    this.getListCategories();
    this.$root.$on("editexpense", (selectexpense: expense) => {
      this.expenseobj = Object.assign({}, selectexpense);

      this.mutableExpenseAction = 2;
      this.dialog = true;
      this.original = selectexpense;
    });
    this.$root.$on("categoryAdded", (category: Category) => {
      this.listCategories.push(category);
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
    this.expenseobj.user_id = this.currentUser.id;
    if (this.form.validate()) {
      if (this.mutableExpenseAction == 1) {
        expenseApi
          .saveExpense(this.expenseobj)
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
        expenseApi.updateExpense(this.expenseobj).then((result: any) => {
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
