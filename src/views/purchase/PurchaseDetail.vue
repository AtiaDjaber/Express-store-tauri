<template>
  <v-tabs background-color="transparent" centered fixed-tabs v-model="tab">
    <v-tab :key="0"
      ><h3>{{ $t("add_purchases") }}</h3>
    </v-tab>

    <v-tab :key="2"
      ><h3>{{ $t("purchases_archive") }}</h3>
    </v-tab>

    <v-tabs-items v-model="tab">
      <v-tab-item key="1">
        <PurchaseView></PurchaseView>
      </v-tab-item>

      <v-tab-item key="2">
        <HistoryPurchaseView></HistoryPurchaseView>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PurchaseView from "@/views/purchase/PurchaseView.vue";
import HistoryPurchaseView from "@/views/purchase/HistoryPurchaseView.vue";
import AddCommandFournisseurView from "../add_command_fournisseur/AddCommandFournisseurView.vue";

@Component({
  components: { HistoryPurchaseView, PurchaseView, AddCommandFournisseurView },
})
export default class PurchaseDetail extends Vue {
  tab = 0;
  created(): void {
    this.tab++;
    setTimeout(() => {
      this.tab--;
    }, 1);
    this.$root.$on("editFactureFournisseur", (_: any) => {
      this.tab = 0;
    });
  }
}
</script>

<style scoped></style>
