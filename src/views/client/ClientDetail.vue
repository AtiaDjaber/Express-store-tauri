<template>
  <v-tabs v-model="tab" background-color="transparent">
    <v-tab :key="0"><v-icon class="mx-2">mdi-receipt</v-icon> الفواتير</v-tab>
    <v-tab :key="1"><v-icon class="mx-2">mdi-cash</v-icon> المدفوعات</v-tab>
    <!--    <v-tab :key="2"> التعويض </v-tab>-->
    <v-tabs-items v-model="tab">
      <v-tab-item key="0">
        <FactureClientView></FactureClientView>
      </v-tab-item>
      <v-tab-item key="1">
        <ClientPayment></ClientPayment>
      </v-tab-item>
      <!--       <v-tab-item key="2"> <Reparation></Reparation> </v-tab-item>-->
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import FactureClientView from "@/views/client/FactureClientView";
import ClientPayment from "@/views/client/ClientPayment";
import Reparation from "@/views/client/ReparatoinView";

@Component({ components: { ClientPayment, FactureClientView, Reparation } })
export default class ClientDetail extends Vue {
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
