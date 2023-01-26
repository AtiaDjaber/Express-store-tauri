<template>
  <v-col>
    <v-row>
      <v-col>
        <c-date-picker
          placeholder="التاريخ"
          hint="التاريخ"
          flat
          solo
          clearable
          v-model="payment.date"
        ></c-date-picker>
      </v-col>
      <v-col>
        <v-text-field
          placeholder="المبلغ"
          hint="المبلغ"
          type="number"
          flat
          solo
          v-model="payment.price"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          :disabled="clientId == 0"
          elevation="1"
          color="primary"
          dark
          large
          @click="manage()"
        >
          <v-icon color="white" class="px-2"> mdi-cash</v-icon>
          دفع
        </v-btn>
      </v-col>
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
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import clientPayment from "@/classes/clientPayment";
import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import client from "@/classes/client";

@Component({
  components: { CDatePicker, DeleteDialog },
})
export default class ClientPaymentView extends Vue {
  paymentHeaders = [
    { text: "#", value: "id" },
    { text: "التاريخ", value: "date" },
    { text: "السعر", value: "price" },
    { text: "", value: "actions" },
  ];
  paymentData = [] as clientPayment[];

  payment = {} as clientPayment;
  dataPrint: any = 0;
  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  clientId = 0;
  rest: number;
  nameClient: any = "";
  dayn: number = 0;
  index: any;

  created() {
    this.$root.$on("clientId", (item: client) => {
      this.clientId = item.id;
      this.nameClient = item.name;
      this.dayn = item.montant;
      this.count++;
    });

    this.$root.$on("deletedClientPayment", (id: number) => {
      if (id) {
        this.paymentData.splice(
          this.paymentData.indexOf(
            this.paymentData.find((c) => c.id == id) ?? ({} as clientPayment)
          ),
          1
        );
      }
    });
  }

  datawasel = {} as clientPayment;

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

  @Watch("clientId", { immediate: true, deep: true })
  changedClientId() {
    this.payment.client_id = this.clientId;
    this.getClientPayments(this.clientId, "");
  }

  getClientPayments(ClientIdnumber: any, page: any) {
    this.paymentData = [];
    this.paymentData.length = 0;
    if (this.clientId) {
      clientModule
        .getClientPaymentsById(ClientIdnumber, page)
        .then((data) => {
          ((data as any).data as clientPayment[]).forEach((p) => {
            this.paymentData.push(p);
          });
          this.count = (data as any).total;
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
  }

  manage() {
    clientModule
      .addPayment(this.payment)
      .then((result) => {
        this.dayn = result.montant;
        // console.log(result.montant);
        let savedPayment = result.data as clientPayment;
        this.dataPrint = savedPayment;
        this.paymentData.unshift(savedPayment);
        clientModule.client.montant = result.montant;
        SnackBarModule.setSnackbar({
          text: "تمت العملية بنجاح",
          color: "success",
          timeout: 2000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
        this.payment = { client_id: this.clientId } as clientPayment;
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
    this.getClientPayments(this.clientId, obj.page);
  }
}
</script>

<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}
</style>
