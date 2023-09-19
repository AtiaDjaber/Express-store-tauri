<template>
  <v-dialog v-model="dialog" persistent max-width="450">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn fab outlined small color="red">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-divider color="deeppink"></v-divider>
      <v-divider color="deeppink"></v-divider>
      <v-divider color="deeppink"></v-divider>
      <v-divider color="deeppink"></v-divider>
      <v-card-title style="color: deeppink" class="text-h4 my-2">
        تنبيه !</v-card-title
      >
      <v-card-text>
        <h2>يرجى تأكيد عملية الحذف</h2>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end plain">
        <v-btn outlined color="grey darken-1" large @click="close">
          إلفاء</v-btn
        >
        <v-btn color="pink darken-1" large dark @click="manage">حذف</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import groupModule from "@/store/groupModule";
import userApi from "@/api/userApi";
import expenseApi from "@/api/expenseApi";
import stockApi from "@/api/stockApi";
import saleModule from "@/store/saleModule";
import exportModule from "@/store/exportModule";
import fournisseurModule from "@/store/fournisseurModule";
import SaleApi from "@/api/saleApi";
import CategoryApi from "@/api/categoryApi";
import BoxApi from "@/api/boxApi";
import DepotApi from "@/api/depotApi";
import FournisseurFactureApi from "@/api/fournisseurFactureApi";

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
  private Apistock = new stockApi();

  // private api = new SubsriptionApi();
  manage(): void {
    console.log(this.source);

    if (this.source == "BOX")
      BoxApi.deleteBox(this.id)
        .then((result) => {
          this.$root.$emit("deletedBoxId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "CommandFournisseur") {
      FournisseurFactureApi.deleteCommand(this.id)
        .then((result) => {
          this.$root.$emit("CommandFournisseurId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });
    }
    if (this.source == "Barcode")
      stockApi
        .deleteBarcode(this.id)
        .then((result) => {
          this.$root.$emit("deletedBarcodeId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "Depots")
      DepotApi.deleteDepot(this.id)
        .then((result) => {
          this.$root.$emit("deletedDepotId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });
    if (this.source.includes("categories"))
      CategoryApi.deleteCategory(this.id, this.source)
        .then((result) => {
          this.$root.$emit("deletedCategoryId", result.data);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "Facture")
      clientModule
        .deleteFacture(this.id)
        .then((result) => {
          this.$root.$emit("deleteFacture", result.data);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "FournisseurFacture")
      fournisseurModule
        .deleteFacture(this.id)
        .then((result) => {
          this.$root.$emit("deleteFournisseurFacture", result.data);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "CLIENT")
      clientModule
        .deleteClient(this.id)
        .then((result) => {
          this.$root.$emit("deletedClientId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "Favorites")
      stockApi
        .deleteFavorite(this.id)
        .then((result) => {
          this.$root.$emit("deletedFavoriteId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "Damages")
      stockApi
        .deleteDamage(this.id)
        .then((result) => {
          this.$root.$emit("deletedDamageId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "SALE")
      SaleApi.deleteSale(this.id)
        .then((result) => {
          // saleModule.deleteItemById(this.id);
          this.$root.$emit("deletedSaleId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "factureTransfer")
      exportModule
        .deleteImportExportFacture(this.id)
        .then((result) => {
          this.$root.$emit("deleteFactureTransfer", {
            id: this.id,
            type: result["data"]["type"],
          });
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "UserView.vue")
      this.apiuser
        .deleteUser(this.id)
        .then((result) => {
          this.$root.$emit("deletedUserId", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "ExpenseView.vue")
      expenseApi
        .deleteExpense(this.id)
        .then((result) => {
          this.$root.$emit("deletedexpenseid", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "Stocks")
      stockApi
        .deleteStock(this.id)
        .then((result) => {
          this.$root.$emit("deletedstockid", this.id);
          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });

    if (this.source == "FOURNISSEURPAYMENT") {
      fournisseurModule
        .deletePayment(this.id)
        .then((result) => {
          this.$root.$emit("deletedFournisseurPayment", this.id);
          fournisseurModule.fournisseur.montant = result.data.montant;

          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });
    }

    if (this.source == "CLIENTPAYMENT") {
      clientModule
        .deletePayment(this.id)
        .then((result) => {
          this.$root.$emit("deletedClientPayment", this.id);
          clientModule.client.montant = result.data.montant;

          this.successMsg();
        })
        .catch((error) => {
          this.failedMsg(error);
        });
    }

    this.close();
  }

  successMsg(): void {
    SnackBarModule.setSnackbar({
      text: "تمت عملية الحذف",
      color: "success",
      timeout: 2000,
      show: true,
      icon: "mdi-checkbox-marked-circle-outline",
      x: "right",
      y: "top",
    });
  }

  failedMsg(error: any): void {
    SnackBarModule.setSnackbar({
      text: error,
      color: "error",
      timeout: 2000,
      show: true,
      icon: "mdi-alert-outline",
      x: "right",
      y: "top",
    });
  }
}
</script>
