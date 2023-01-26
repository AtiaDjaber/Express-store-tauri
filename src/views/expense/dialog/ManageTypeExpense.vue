<template>
  <v-dialog v-model="dialog" scrollable max-width="800">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn class="mt-3" color="secondary" large outlined elevation="0">
          إضافة فئة
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title>
        <span> إضافة فئة </span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-4">
              <v-col cols="10">
                <v-text-field
                  label="الاسم"
                  placeholder="الاسم"
                  hint="الاسم"
                  required
                  flat
                  solo
                  clearable
                  v-model="expenseCategoryObj.name"
                  :rules="vexpense.name"
                ></v-text-field>
              </v-col>
              <v-btn
                class="mt-3"
                color="primary"
                @click="manage()"
                large
                elevation="0"
              >
                إضافة
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-row>
            <v-row class="mt-n6">
              <v-col>
                <v-card outlined>
                  <v-data-table
                    :headers="Headers"
                    :items="listCategories"
                    single-select
                    hide-default-footer
                  >
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-row>
                        <DeleteDialog
                          :id="item.id"
                          :disabled="false"
                          :source="resource"
                        />
                      </v-row>
                    </template> </v-data-table
                ></v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="justify-end mx-3">
        <v-btn large outlined color="red darken-1" @click="dialog = false"
          >إلغاء</v-btn
        >
        <v-btn large dark color="green darken-1" @click="manage">حفظ </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import Expense from "@/classes/expense";
import VExpense from "@/validation/vExpense";
import SnackBarModule from "@/store/snackBarModule";
import loginModule from "@/store/loginModule";
import categoryApi from "@/api/categoryApi";

import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Category from "@/classes/category";

@Component({ components: { DeleteDialog } })
export default class ManageTypeExpense extends Vue {
  Headers = [
    { text: "الاسم", value: "name" },
    { text: "المستخدم", value: "user.name" },
    { text: "التاريخ", value: "created_at" },
    { text: "العمليات", value: "actions" },
  ];
  @Prop({ default: 0 }) expenseAction!: number;
  mutableExpenseAction = 0;
  date = "";
  @Ref() form: any;

  @Prop() resource: string;
  public dialog = false;
  valid = true;

  vexpense = new VExpense();

  expenseCategoryObj = {} as Category;

  listCategories = [] as Category[];
  getAllCategories(): void {
    categoryApi
      .getCategories(this.resource)
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
  created(): void {
    this.getAllCategories();
    this.$root.$on("deletedCategoryId", (categoryId: number) => {
      if (categoryId) {
        this.listCategories.splice(
          this.listCategories.indexOf(
            this.listCategories.find((c) => c.id == categoryId)
          ),
          1
        );
      }
    });
  }

  close() {
    this.expenseCategoryObj = {};
    // this.dialog = false;
  }
  get currentUser() {
    return loginModule.getCurrentUser;
  }
  manage() {
    if (this.form.validate()) {
      categoryApi
        .saveCategory(this.expenseCategoryObj, this.resource)
        .then((result: any) => {
          let saved = (result as any).data;
          this.listCategories.unshift(saved);
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

      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);
      this.close();
    }
  }
}
</script>
