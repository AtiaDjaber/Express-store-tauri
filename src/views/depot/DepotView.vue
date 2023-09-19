<template>
  <div class="pa-2">
    <v-row>
      <v-col cols="1">
        <manage-depot depotAction="1" />
      </v-col>
      <!--      <v-col cols="1">-->
      <!--        <Print />-->
      <!--      </v-col>-->

      <v-spacer></v-spacer>
      <v-col>
        <v-text-field
          color="blue darken-2"
          hint="اسم المخزن"
          placeholder="البحث باسم المخزن"
          required
          append-icon="fa-search"
          flat
          solo
          v-model="search.name"
          clearable
        ></v-text-field>
      </v-col>

      <!--      <v-btn large outlined class="mt-3 mr-5" color="grey darken-3" @click="print()">-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>
    <v-row no-gutters></v-row>
    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="listDepots"
        @click:row="rowClick"
        single-select
        show-expand
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row no-gutters>
              <v-col>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="5">الهاتف</v-col>
                  <v-col>{{ item.tel }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="5">العنوان</v-col>
                  <v-col>{{ item.address }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <!-- <v-row class="ma-1" no-gutters>
                <v-col cols="5">دين قديم</v-col>
                <v-col>{{ item.ancien }}</v-col>
              </v-row> -->
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="5">البريد الالكتروني</v-col>
                  <v-col>{{ item.email }}</v-col>
                </v-row>

                <v-divider></v-divider>

                <v-row class="ma-1" no-gutters>
                  <v-col cols="5">تاريخ التسجيل</v-col>
                  <v-col>{{ item.created_at }}</v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>
            </v-row>
          </td>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-btn
              color="green"
              class="ml-2"
              small
              fab
              outlined
              elevation="0"
              @click="editDepot(item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <DeleteDialog :id="item.id" :disabled="false" :source="'Depots'" />
          </v-row>
        </template> </v-data-table
    ></v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageDepot from "@/views/depot/dialog/ManageDepot.vue";

import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import Depot from "@/classes/depot";
import DepotApi from "@/api/depotApi";

@Component({
  components: { DeleteDialog, ManageDepot },
})
export default class DepotMain extends Vue {
  Headers = [
    { text: " اسم المخزن", value: "name" },
    { text: "العميات", value: "actions" },
    {
      text: "",
      value: "data-table-expand",
      // ,
    },
  ];

  count = 0;
  private api = new DepotApi();
  listDepots = [] as Depot[];
  selectDepot = {} as Depot;
  perPage = 0;

  search = new Search();

  @Watch("search", { deep: true })
  onChange() {
    this.getapi(this.search);
  }
  getapi(search?: Search) {
    this.api.getDepots(search).then((data) => {
      this.listDepots = [];
      this.count = 0;
      ((data as any).data as Depot[]).forEach((s) => {
        this.listDepots.push(s);
      });

      this.count = ((data as any).data as any).total;
      this.perPage = ((data as any).data as any).per_page;
    });
  }

  created() {
    this.$root.$on("createdDepot", (expense: Depot) => {
      //  this.expense.date="2017-01-01 00:00:00";
      this.listDepots.unshift(expense);
    });

    this.$root.$on("deletedDepotId", (deletedDepotId: number) => {
      if (deletedDepotId) {
        this.listDepots.splice(
          this.listDepots.indexOf(
            this.listDepots.find((c) => c.id == deletedDepotId) ?? ({} as Depot)
          ),
          1
        );
      }
    });

    this.$root.$on("updateDepot", (updateExpense: Depot) => {
      if (updateExpense) {
        this.listDepots?.splice(
          this.listDepots?.indexOf(
            this.listDepots?.find((s) => s.id == updateExpense.id) ??
              ({} as Depot)
          ),

          1,
          updateExpense
        );
      }
    });
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
    }
    this.$root.$emit("selectedDepot", item);
  }

  editDepot(edited: any) {
    this.$root.$emit("editDepot", edited);
  }

  print() {
    this.$root.$emit("printExpense");
  }

  paginate(obj: any) {
    this.search.url = obj.page;
    this.getapi(this.search);
  }

  /////////////////////////////////////////
}
</script>
<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}
</style>
