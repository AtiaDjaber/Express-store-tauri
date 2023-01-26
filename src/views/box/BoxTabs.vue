<template>
  <v-tabs v-model="tab" background-color="transparent">
    <v-tab :key="0"><v-icon class="mx-2">mdi-receipt</v-icon> أرشيف</v-tab>
    <v-tabs-items v-model="tab">
      <v-tab-item key="0">
        <BoxTransactionView></BoxTransactionView>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BoxTransactionView from "@/views/box/BoxTransaction.vue";

@Component({ components: { BoxTransactionView: BoxTransactionView } })
export default class BoxTabs extends Vue {
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
