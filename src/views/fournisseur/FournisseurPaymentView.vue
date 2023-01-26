<template>
  <div>
    <v-col>
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
      <v-col>
        <v-data-table
          elevation="3"
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
            <delete-dialog
              :id="item.id"
              :disabled="false"
              :source="'CLIENTPAYMENT'"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-col>
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
  dataPrint: any = 0;
  @Ref() menu!: any;
  menuState = false;
  date = "";
  save(date: string) {
    this.menu.save(date);
  }
  count = 0;
  fournisseurId = 0;
  rest: number;
  nameFournisseur: any = "";
  dayn: number = 0;
  index: any;

  created() {
    this.$root.$on("fournisseurId", (item: Fournisseur) => {
      this.fournisseurId = item.id;
      this.nameFournisseur = item.name;
      this.dayn = item.montant;
      this.count++;
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

  datawasel = {} as FournisseurPayment;
  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.index = row.index;
      this.$root.$emit("index1", this.index);
      console.log(item);
      this.datawasel = item;
    } else {
      this.index = -1;
      this.$root.$emit("index1", this.index);
      row.select(false);
    }
  }

  @Watch("fournisseurId", { immediate: true, deep: true })
  changedFournisseurId() {
    this.payment.fournisseur_id = this.fournisseurId;
    this.getFournisseurPayments(this.fournisseurId, "");
  }
  getFournisseurPayments(FournisseurIdnumber: any, page: any) {
    this.paymentData = [];
    this.paymentData.length = 0;
    if (this.fournisseurId) {
      fournisseurModule
        .getFournisseurPaymentsById(FournisseurIdnumber, page)
        .then((data) => {
          ((data as any).data as fournisseurPayment[]).forEach((p) => {
            this.paymentData.push(p);
          });
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
        this.dayn = result.montant;
        // console.log(result.montant);
        let savedPayment = result.data as fournisseurPayment;
        this.dataPrint = savedPayment;
        this.paymentData.unshift(savedPayment);
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
}
</script>

<style scoped></style>
