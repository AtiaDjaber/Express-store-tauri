<template>
  <v-tabs v-model="tab">
    <v-tab :key="0"> الفواتير</v-tab>
    <v-tab :key="1"> الدفع</v-tab>
    <!--    <v-tab :key="2"> التعويض </v-tab>-->
    <v-tabs-items v-model="tab">
      <v-tab-item key="0">
        <FacturePaymentView></FacturePaymentView>
      </v-tab-item>
      <v-tab-item key="1">
        <ClientPayment></ClientPayment>
      </v-tab-item>
      <!--       <v-tab-item key="2"> <Reparation></Reparation> </v-tab-item>-->
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import {Component, Vue} from "vue-property-decorator";
import FacturePaymentView from "@/views/client/FacturePaymentView";
import ClientPayment from "@/views/client/ClientPayment";
import Reparation from "@/views/client/ReparatoinView";

@Component({components: {ClientPayment, FacturePaymentView, Reparation}})
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
