<template>
  <v-dialog v-model="dialog" persistent max-width="450">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn color="green" small class="ml-2" text fab elevation="0">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-divider color="#875A7B"></v-divider>
      <v-divider color="#875A7B"></v-divider>
      <v-divider color="#875A7B"></v-divider>
      <v-divider color="#875A7B"></v-divider>
      <v-card-title style="color: gray" class="text-h4"
        >تعديل الكمية</v-card-title
      >
      <v-card-text>
        <v-text-field
          outlined
          label="الكمية"
          flat
          class="my-5"
          hide-details
          type="number"
          v-model="copy.quantity"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end" style="background-color: #f7f7f7">
        <v-btn outlined color="grey darken-1" large @click="close">
          إلفاء</v-btn
        >
        <v-btn color="primary" large dark @click="manage">موافق</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import Sale from "@/classes/sale";
import SaleApi from "@/api/saleApi";
import PurchaseApi from "@/api/purchaseApi";

@Component({})
export default class ReturnDialog extends Vue {
  @Prop() id!: number;
  @Prop() source!: string;
  @Prop() original!: Sale;
  public dialog = false;

  close(): void {
    this.dialog = false;
  }

  copy = {} as any;

  created(): void {
    this.copy = Object.assign({}, this.original);
  }
  manage(): void {
    if (this.source == "sale") {
      SaleApi.returnSale(this.copy)
        .then((result) => {
          this.$root.$emit("returnedSale", result["data"]["facture"]);
          this.$root.$emit("updatedClient", result["data"]["client"]);

          SnackBarModule.setSnackbar({
            text: "تمت عملية التعديل بنجاح",
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

    if (this.source == "purchase") {
      PurchaseApi.returnPurchase(this.copy)
        .then((result) => {
          this.$root.$emit("returnedPurchase", result["data"]["facture"]);
          this.$root.$emit("updatedFournisseur", result["data"]["fournisseur"]);

          SnackBarModule.setSnackbar({
            text: "تمت عملية التعديل بنجاح",
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
