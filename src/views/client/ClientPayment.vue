<template>
  <div>
    <v-row class="mt-3">
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
              :source="'CLIENTPAYMENT'"
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
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import clientPayment from "@/classes/clientPayment";
import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import client from "@/classes/client";
import { AxiosError } from "axios";
import PrintImage from "@/print/print_image";
import settingModule from "@/store/settingModule";
import { Debounce } from "vue-debounce-decorator";
import { formatCurrency } from "@/helper/global_function";

@Component({
  components: { CDatePicker, DeleteDialog },
})
export default class ClientPaymentView extends Vue {
  paymentHeaders = [
    { text: "#", value: "id" },
    { text: "التاريخ", value: "date" },
    { text: "المبلغ", value: "price" },
    { text: "", value: "actions" },
  ];
  paymentData = [] as clientPayment[];

  payment = {} as clientPayment;

  count = 0;
  rest: number;
  selectedClient = {} as client;

  created() {
    this.$root.$on("clientId", (item: client) => {
      this.selectedClient = item;
      // this.count++;
      this.payment.client_id = item.id;
      this.getClientPayments(this.selectedClient.id, "");
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

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
    } else {
      row.select(false);
    }
  }

  @Debounce(80)
  getClientPayments(ClientIdnumber: any, page: any) {
    if (this.selectedClient.id) {
      clientModule
        .getClientPaymentsById(ClientIdnumber, page)
        .then((data) => {
          this.paymentData = (data as any).data;
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

  manage(): void {
    clientModule
      .addPayment(this.payment)
      .then((result) => {
        this.selectedClient.montant = result.montant;
        let savedPayment = result.data as clientPayment;
        this.paymentData.unshift(savedPayment);
        this.count++;
        clientModule.client.montant = result.montant;
        // this.$set(this.paymentData, 0, savedPayment);
        // this.getClientPayments(this.clientId, 1);

        SnackBarModule.setSnackbar({
          text: "تمت العملية بنجاح",
          color: "success",
          timeout: 2000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
        this.payment = { client_id: this.selectedClient.id } as clientPayment;
        return savedPayment.id;
      })
      .catch((error: AxiosError) => {
        console.log(error);
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
    this.getClientPayments(this.selectedClient.id, obj.page);
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
        ["الزبون : " + " " + this.selectedClient.name],
        [
          formatCurrency(this.selectedClient.montant) +
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

<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}
</style>
