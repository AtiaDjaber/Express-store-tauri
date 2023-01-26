<template>
  <v-col>
    <v-data-table
      :headers="Headers"
      :items="ReparationData"
      single-select
      @click:row="rowClick"
      :server-items-length="count"
      :items-per-page="10"
      class="elevation-1"
    >
    </v-data-table>
  </v-col>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import clientPayment from "@/classes/clientPayment";
import clientModule from "@/store/clientModule";
import snackBarModule from "@/store/snackBarModule";
import SnackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Client from "@/classes/client";
import Reparation from "@/classes/reparation";
import RepApi from "@/api/reparationApi";
import client from "@/classes/client";

@Component({ components: { DeleteDialog, CDatePicker } })
export default class ReparatoinView extends Vue {
  Headers = [
    { text: "#", value: "id" },
    { text: "المنتج", value: "product.name" },
    { text: "المبلغ", value: "montant" },
    // { text: "الكمية", value: "product.quantity" },
    // { text: "سعر التعويض", value: "product.price" },
    { text: "ملاحظة", value: "remark" },
    { text: "تاريخ", value: "created_at" },
    { text: "", value: "actions" },
  ];

  count = 0;
  clientId: number = 0;
  clientMontant: number;
  newitem = {} as client;
  ReparationData = [] as Reparation[];
  api = new RepApi();

  created() {
    // this.$root.$on("clientId", (item: client) => {
    //   this.clientId = item.id;
    //   console.log("repid = " + this.clientId);
    // });

    this.$root.$on("clientId", (item: client) => {
      this.clientId = item.id;
      console.log("repid = " + this.clientId);
    });

    // this.clientId=clientModule.client.id;
    // console.log("repid = " + clientModule.client.id);
  }

  @Watch("clientId", { deep: true })
  changedClientId() {
    console.log("repid = " + this.clientId);
    this.getRep(this.clientId, "1");
  }
  getRep(clientId: number, page: any) {
    this.ReparationData = [];
    this.ReparationData.length = 0;
    if (this.clientId) {
      this.api
        .getRep(clientId, page)
        .then((data) => {
          (((data as any).data as any).data as Reparation[]).forEach((p) => {
            console.log(data);
            this.ReparationData.push(p);
          });
          this.count = ((data as any).data as any).total;
        })
        .catch((error) => {
          snackBarModule.setSnackbar({
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
  }
  rowClick(row: any, item: any) {
    if (!row.isSelected) {
      row.select(true);
    } else {
      row.select(false);
    }
  }
}
</script>

<style scoped></style>
