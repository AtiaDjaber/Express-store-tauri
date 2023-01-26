<template>
  <div class="pa-3">
    <v-row class="pa-2">
      <v-col cols="1">
        <Manegeexp :expenseAction="1" />
      </v-col>
      <!--      <v-col cols="1">-->
      <!--        <Print />-->
      <!--      </v-col>-->

      <v-spacer></v-spacer>
      <manage-type-expense resource="expense_categories"></manage-type-expense>
      <v-col cols="4">
        <v-text-field
          color="blue darken-2"
          hint="اسم المصروف"
          placeholder="البحث باسم المصروف"
          required
          append-icon="fa-search"
          flat
          solo
          v-model="search.name"
          clearable
        ></v-text-field>
      </v-col>

      <!--      <v-btn  outlined class="mt-3 mr-5" color="grey darken-3" @click="print()">-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="listexpense"
        @click:row="rowClick"
        single-select
        :server-items-length="count"
        :items-per-page="perPage"
        @update:options="paginate"
        :footer-props="{
          'items-per-page-options': [10, 10],
          'show-current-page': true,
          'show-first-last-page': true,
          'page-text': 'رقم الصفحة',
          'items-per-page-text': 'عدد الأسطر',
        }"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-btn
              color="green"
              class="ml-2"
              small
              outlined
              fab
              elevation="0"
              @click="editexpense(item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <DeleteDialog
              :id="item.id"
              :disabled="false"
              :source="'ExpenseView.vue'"
            />
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import expense from "@/classes/expense";
import expenseApi from "@/api/expenseApi";
import Expense from "@/classes/expense";
import Manegeexp from "@/views/expense/dialog/Manageexp.vue";
// import Print from "@/views/print/print.vue";
// import TimeFormatService from "@/service/timeFormatService";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import ManageTypeExpense from "./dialog/ManageTypeExpense.vue";

@Component({
  components: { DeleteDialog, Manegeexp, ManageTypeExpense },
})
export default class ExpenseView extends Vue {
  Headers = [
    { text: "المصروف", value: "name" },
    { text: "المبلغ", value: "price" },
    { text: "ملاحظة", value: "remarque" },
    { text: "الفئة", value: "expense_category.name" },
    { text: "المستخدم", value: "user.name" },
    { text: "التاريخ", value: "date" },

    { text: "", value: "actions" },
  ];

  count = 0;
  listexpense = [] as Expense[];
  selectexpense = {} as Expense;
  perPage = 0;

  search = new Search();

  @Watch("search", { deep: true })
  onChange() {
    this.getapi(this.search);
  }

  getapi(search?: Search) {
    expenseApi.getExpenses(search).then((data) => {
      console.log(data);
      this.listexpense.length = 0;
      this.count = 0;
      (((data as any).data as any).data as expense[]).forEach((s) => {
        // s.date = TimeFormatService.format_date(new Date(s.date));
        // console.log(s);
        this.listexpense.push(s);
      });

      if (this.listexpense.length > 0)
        this.$root.$emit("printExpenses", this.listexpense);
      this.count = ((data as any).data as any).total;
      this.perPage = ((data as any).data as any).per_page;
    });
  }

  created() {
    this.$root.$on("createdExpense", (expense: Expense) => {
      //  this.expense.date="2017-01-01 00:00:00";
      this.listexpense.unshift(expense);
    });

    this.$root.$on("deletedexpenseid", (deletedexpenseid: number) => {
      if (deletedexpenseid) {
        this.listexpense.splice(
          this.listexpense.indexOf(
            this.listexpense.find((c) => c.id == deletedexpenseid)
          ),
          1
        );
      }
    });

    this.$root.$on("updateExpense", (updateExpense: Expense) => {
      if (updateExpense) {
        this.listexpense?.splice(
          this.listexpense?.indexOf(
            this.listexpense?.find((s) => s.id == updateExpense.id) ??
              ({} as Expense)
          ),

          1,
          updateExpense
        );
      }
    });
  }

  // TODO    <Deleteeexpense :id="item.id" :disabled="false" :source="'Expenses'"/> قفلة حذف في الجدول

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      // this.selectexpense = item;
    } else {
      row.select(false);
      // this.selectexpense = {} as Expense;
    }
  }

  editexpense(edited: any) {
    this.$root.$emit("editexpense", edited);
  }

  print() {
    this.$root.$emit("printExpense");
  }

  paginate(obj: any) {
    this.search.url = obj.page;
  }

  /////////////////////////////////////////
}
</script>
<style scoped>
/* ::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
} */
</style>
