<template>
  <div class="mt-5">
    <v-row>
      <v-col>
        <c-date-picker
          placeholder="التاريخ"
          hint="التاريخ"
          label="التاريخ"
          clearable
          v-model="payment.date"
        ></c-date-picker
      ></v-col>
      <v-col
        ><v-text-field
          label="المبلغ"
          type="number"
          flat
          solo
          v-model="payment.price"
        ></v-text-field
      ></v-col>
      <v-col
        ><v-btn
          :disabled="fournisseurId == 0"
          elevation="1"
          color="primary"
          dark
          large
          @click="manage()"
          ><v-icon color="white" class="px-2"> mdi-cash </v-icon>
          دفع
        </v-btn></v-col
      >
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-data-table
            elevation="0"
            :headers="paymentHeaders"
            :items="paymentData"
            @click:row="rowClick"
            @update:options="paginate"
            :server-items-length="count"
            single-select
            :footer-props="{
              'items-per-page-options': [10, 10],
              'show-current-page': true,
              'show-first-last-page': true,
              'page-text': 'رقم الصفحة',
              'items-per-page-text': 'عدد الأسطر',
            }"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-row>
                <delete-dialog
                  :id="item.id"
                  :disabled="false"
                  :source="'FOURNISSEURPAYMENT'"
                />
                <v-btn
                  class="ms-2"
                  fab
                  outlined
                  small
                  @click="print(item)"
                  color="primary"
                >
                  <v-icon>mdi-printer-outline</v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import fournisseurPayment from "@/classes/fournisseurPayment";
import fournisseurModule from "@/store/fournisseurModule";
import snackBarModule from "@/store/snackBarModule";
import SnackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Fournisseur from "@/classes/fournisseur";
import FournisseurPayment from "@/classes/fournisseurPayment";
import { Debounce } from "vue-debounce-decorator";
import { formatCurrency } from "@/helper/global_function";
import PrintImage from "@/print/print_image";
import settingModule from "@/store/settingModule";

@Component({
  components: { CDatePicker, DeleteDialog },
})
export default class FournisseurPaymentView extends Vue {
  paymentHeaders = [
    { text: "#", value: "id" },
    { text: "التاريخ", value: "date" },
    { text: "السعر", value: "price" },
    { text: "", value: "actions" },
  ];
  paymentData = [] as FournisseurPayment[];

  payment = {} as FournisseurPayment;

  count = 0;
  fournisseurId = 0;
  rest: number;
  selectedFournisseur: any = {} as Fournisseur;

  created() {
    this.$root.$on("fournisseurId", (item: Fournisseur) => {
      this.fournisseurId = item.id;
      this.selectedFournisseur = item;
      // this.count++;
      this.payment.fournisseur_id = this.fournisseurId;
      this.getFournisseurPayments(this.payment.fournisseur_id, 1);
    });

    this.$root.$on("deletedFournisseurPayment", (id: number) => {
      if (id) {
        this.paymentData.splice(
          this.paymentData.indexOf(
            this.paymentData.find((c) => c.id == id) ??
              ({} as fournisseurPayment)
          ),
          1
        );
      }
    });
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
    } else {
      row.select(false);
    }
  }

  @Debounce(80)
  getFournisseurPayments(FournisseurIdnumber: any, page: any) {
    if (this.fournisseurId) {
      fournisseurModule
        .getFournisseurPaymentsById(FournisseurIdnumber, page)
        .then((data) => {
          this.paymentData = (data as any).data as fournisseurPayment[];

          this.count = (data as any).total;
        })
        .catch((error) => {
          snackBarModule.setSnackbar({
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
  }

  manage() {
    fournisseurModule
      .addPayment(this.payment)
      .then((result) => {
        this.selectedFournisseur.montant = result.montant;
        // console.log(result.montant);
        let savedPayment = result.data as fournisseurPayment;
        this.paymentData.unshift(savedPayment);
        this.count++;
        fournisseurModule.fournisseur.montant = result.montant;
        SnackBarModule.setSnackbar({
          text: "تمت العملية بنجاح",
          color: "success",
          timeout: 2000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
        this.payment = {
          fournisseur_id: this.fournisseurId,
        } as fournisseurPayment;
        return savedPayment.id;
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
  paginate(obj: any) {
    this.getFournisseurPayments(this.fournisseurId, obj.page);
  }

  print(payment): void {
    // console.log(this.selected);
    let printHeader = [
      {
        dataKey: "date",
        header: "تاريخ الدفع",
      },
      {
        dataKey: "price",
        header: "المبلغ",
      },

      {
        dataKey: "id",
        header: "رقم الوصل",
      },
    ];

    PrintImage.printGenericFacturePdf(
      printHeader,
      [payment],
      "وصل دفع",
      [
        ["المورد : " + " " + this.selectedFournisseur.name],
        [
          formatCurrency(this.selectedFournisseur.montant) +
            " DA" +
            " : " +
            "الباقي ",
        ],
      ],
      settingModule.getSetting
    );
  }
}
</script>

<style scoped></style>
