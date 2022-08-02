<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="5">
        <DepotView></DepotView>
      </v-col>
      <v-divider vertical class="my-6"></v-divider>
      <v-col>
        <DepotDetail></DepotDetail>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from "vue-property-decorator";
import ManageDepot from "@/views/depot/dialog/ManageDepot.vue";

import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import Depot from "@/classes/depot";
import DepotApi from "@/api/depotApi";
import DepotView from "@/views/depot/DepotView.vue";
import DepotDetail from "@/views/depot/DepotDetail.vue";

@Component({
  components: {DepotDetail, DepotView, DeleteDialog, ManageDepot },
})
export default class DepotMain extends Vue {
  Headers = [
    { text: " اسم المخزن", value: "name" },
    { text: "العنوان", value: "address" },
    { text: "الايميل", value: "email" },
    { text: "الهاتف", value: "tel" },
    { text: "التاريخ ", value: "created_at" },
    { text: "", value: "actions" },
  ];

  count = 0;
  private api = new DepotApi();
  listDepots = [] as Depot[];
  selectDepot = {} as Depot;
  perPage = 0;

  search=new Search();

  @Watch("search", {deep: true})
  onChange(){
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
            this.listDepots.find((c) => c.id == deletedDepotId) ??
              ({} as Depot)
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
    } else {
      row.select(false);
    }
  }

  editDepot(edited: any) {
    this.$root.$emit("editDepot", edited);
  }

  print() {
    this.$root.$emit("printExpense");
  }

  paginate(obj: any) {
    this.search.url=obj.page;
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
