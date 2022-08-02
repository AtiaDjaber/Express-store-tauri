<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
<!--    <SideBar></SideBar>-->

    <!-- <User /> -->
    <!-- <Client /> -->
    <!-- <Stock /> -->
  </v-app>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SideBar from "../components/Sidebar.vue";
import Expense from "./expense/ExpenseView.vue";
import User from "./user/UserView.vue";
import Client from "./client/Client.vue";
import Clientview from "./client/ClientView.vue";
import Clientdetail from "./client/ClientDetail.vue";
import StockView from "./stock/StockView.vue";
// import SideBarRight from '../components/SideBarRight'
@Component({
  components: { SideBar, Expense, User, Clientview, Clientdetail, Client,Stock: StockView },
})
export default class Home extends Vue {}
</script>
