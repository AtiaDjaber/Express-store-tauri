<template>
  <v-tabs v-model="tab" centered fixed-tabs>
    <v-tab :key="0">
      <v-icon class="mx-2">mdi-shape-outline</v-icon>
      <h3>الأصناف</h3>
    </v-tab>
    <v-tab :key="1">
      <v-icon class="mx-2">mdi-heart-multiple-outline</v-icon>
      <h3>المفضلة</h3>
    </v-tab>
    <v-tab :key="2">
      <v-icon class="mx-2">mdi-glass-fragile</v-icon>
      <h3>الأصناف التالفة</h3>
    </v-tab>
    <v-tabs-items v-model="tab">
      <v-tab-item key="0">
        <!-- <v-card color="#fbfafc" flat> -->
        <stock-view></stock-view>
        <!-- </v-card> -->
      </v-tab-item>
      <v-tab-item key="1">
        <!-- <v-card color="#fbfafc" flat>  -->
        <FavoriteView></FavoriteView>
        <!-- </v-card> -->
      </v-tab-item>
      <v-tab-item key="2">
        <!-- <v-card color="#fbfafc" flat>  -->
        <DamageView></DamageView>
        <!-- </v-card> -->
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StockView from "@/views/stock/StockView.vue";
import FavoriteView from "@/views/stock/FavoriteView.vue";
import DamageView from "./DamageView.vue";
@Component({ components: { FavoriteView, StockView, DamageView } })
export default class StockTabs extends Vue {
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
