<template>
  <v-dialog v-model="dialog" persistent max-width="450">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn rounded outlined small color="red">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-divider color="deeppink"></v-divider>
      <v-divider color="deeppink"></v-divider>
      <v-divider color="deeppink"></v-divider>
      <v-divider color="deeppink"></v-divider>
      <v-card-title style="color: deeppink" class="text-h4"> تنبيه !</v-card-title>
      <v-card-text>
        <h3>يرجى تأكيد عملية الحذف</h3>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end" style="background-color: #f7f7f7">
        <v-btn outlined color="grey darken-1" large @click="close"> إلفاء</v-btn>
        <v-btn color="pink darken-1" large dark @click="manage">حذف</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";


import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import groupModule from "@/store/groupModule";
import userApi from "@/api/userApi";
import expenseApi from "@/api/expenseApi";
import stockApi from "@/api/stockApi";
import saleModule from "@/store/saleModule";
import exportModule from "@/store/exportModule";
import fournisseurModule from "@/store/fournisseurModule";

@Component({})
export default class DeleteDialog extends Vue {
  @Prop() id!: number;
  @Prop() source!: string;
  @Prop() disabled!: boolean;
  public dialog = false;

  close() {
    this.dialog = false;
  }

  private apiuser = new userApi();
  private apiexpense = new expenseApi();
  private Apistock = new stockApi();

  // private api = new SubsriptionApi();
  manage() {
    if (this.source == "Facture")
      clientModule.deleteFacture(this.id)
          .then((result) => {
            console.log("montante")
            console.log(result)
            this.$root.$emit("deleteFacture", result.data);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });

          });

    if (this.source == "FournisseurFacture")
      fournisseurModule.deleteFacture(this.id)
          .then((result) => {
            console.log("montante")
            console.log(result)
            this.$root.$emit("deleteFacture", result.data);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });

          });


    if (this.source == "CLIENT")
      clientModule
          .deleteClient(this.id)
          .then((result) => {
            this.$root.$emit("deletedClientId", this.id);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });


    if (this.source == "SALE")
      saleModule
          .deleteSale(this.id)
          .then((result) => {
            // saleModule.deleteItemById(this.id);
            this.$root.$emit("deletedSaleId", this.id);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });

    if (this.source == "factureTransfer")
      exportModule
          .deleteImportExportFacture(this.id)
          .then((result) => {
            debugger
            this.$root.$emit("deleteFactureTransfer", {"id":this.id,"type":result["data"]["type"]});
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });

    if (this.source == "UserView.vue")
      this.apiuser
          .deleteUser(this.id)
          .then((result) => {
            this.$root.$emit("deletedUserId", this.id);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });
    if (this.source == "ExpenseView.vue")
      this.apiexpense
          .deleteExpense(this.id)
          .then((result) => {
            this.$root.$emit("deletedexpenseid", this.id);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });

    if (this.source == "Stocks")
      this.Apistock.deleteStock(this.id)
          .then((result) => {
            this.$root.$emit("deletedstockid", this.id);
            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
              text: error,
              color: "error",
              timeout: 2000,
              show: true,
              icon: "mdi-alert-outline",
              x: "right",
              y: "top",
            });
          });

    if (this.source == "CLIENTPAYMENT") {
      clientModule
          .deletePayment(this.id)
          .then((result) => {
            this.$root.$emit("deletedClientPayment", this.id);
            clientModule.client.montant = result.data.montant;

            SnackBarModule.setSnackbar({
              text: "تمت عملية الحذف",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
          })
          .catch((error) => {
            SnackBarModule.setSnackbar({
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

    this.close();
  }
}
</script>
