<template>
  <v-tabs v-model="tab" centered fixed-tabs background-color="transparent">
    <v-tab :key="0">
      <v-icon class="mx-2">mdi-receipt</v-icon>
      <h3>
        {{ $t("factures") }}
      </h3>
    </v-tab>
    <v-tab :key="1">
      <v-icon class="mx-2">mdi-cash</v-icon>
      <h3>
        {{ $t("payments") }}
      </h3>
    </v-tab>
    <v-tab :key="2">
      <v-icon class="mx-2">mdi-receipt</v-icon>
      <h3>
        {{ $t("purchase_order") }}
      </h3>
    </v-tab>
    <v-tabs-items v-model="tab">
      <v-tab-item key="0">
        <fournisseur-facture-view></fournisseur-facture-view>
      </v-tab-item>
      <v-tab-item key="1">
        <fournisseur-payment-view></fournisseur-payment-view>
      </v-tab-item>
      <v-tab-item key="2">
        <command-fournisseur-view></command-fournisseur-view>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import FournisseurFactureView from "@/views/fournisseur/FournisseurFactureView";
import FournisseurPaymentView from "@/views/fournisseur/FournisseurPaymentView";
import CommandFournisseurView from "@/views/fournisseur/CommandFournisseurView.vue";
CommandFournisseurView;
@Component({
  components: {
    FournisseurPaymentView,
    FournisseurFactureView,
    CommandFournisseurView,
  },
})
export default class FournisseurDetail extends Vue {
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
