<template>
  <v-tabs v-model="tab">
    <v-tab :key="0"> إضافة مشتريات </v-tab>
    <v-tab :key="1"> أرشيف المشتريات </v-tab>
    <v-tabs-items v-model="tab">
      <v-tab-item key="1">
        <PurchaseView></PurchaseView>
      </v-tab-item>
      <v-tab-item key="0">
        <HistoryPurchaseView></HistoryPurchaseView>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import PurchaseView from "@/views/purchase/PurchaseView.vue";
import HistoryPurchaseView from "@/views/purchase/HistoryPurchaseView.vue";
@Component({ components: { HistoryPurchaseView, PurchaseView } })
export default class PurchaseDetail extends Vue {
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
