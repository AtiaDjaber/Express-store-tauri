<template>
  <v-tabs icons-and-text v-model="tab">
    <v-tab :key="0">
      الأصناف
      <v-icon class="mb-2">mdi-shape-outline</v-icon>
    </v-tab>
    <v-tab  :key="1">
      الصادرات
      <v-icon class="mb-2">mdi-arrow-up-bold-circle-outline</v-icon>
    </v-tab>
    <v-tab :key="2">
      الواردات      <v-icon class="mb-2">mdi-arrow-down-bold-circle-outline</v-icon>
    </v-tab>

    <v-tabs-items v-model="tab">
      <v-tab-item key="0">
        <ProductDepotView></ProductDepotView>
      </v-tab-item>
      <v-tab-item key="1">
        <FactureExportView></FactureExportView>
      </v-tab-item>
      <v-tab-item key="2">
        <FactureImportView></FactureImportView>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import {Component, Vue} from "vue-property-decorator";
import ClientPayment from "@/views/client/ClientPayment";
import Reparation from "@/views/client/ReparatoinView";
import ProductDepotView from "./ProductDepotView";
import FactureImportView from "@/views/depot/FactureImportView";
import FactureExportView from "@/views/depot/FactureExportView";

@Component({components: {FactureExportView, FactureImportView, ClientPayment, ProductDepotView, Reparation}})
export default class DepotDetail extends Vue {
  tab = 0;

  created() {
    this.tab++;
    setTimeout(() => {
      this.tab--;
    }, 1);
  }
}
</script>

<style scoped></style>
