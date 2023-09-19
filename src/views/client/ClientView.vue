<template>
  <div class="pa-3">
    <v-row no-gutters>
      <manage-teacher :teacherAction="1" />
      <v-spacer></v-spacer>
      <v-text-field
        style="width: 50%"
        flat
        solo
        append-icon="fa-search"
        :hint="$t('client_search')"
        :placeholder="$t('client_search')"
        v-model="search.name"
      ></v-text-field>
    </v-row>

    <v-card outlined>
      <v-data-table
        elevation="3"
        :headers="clientHeaders"
        :items="clientData"
        @click:row="rowClick"
        single-select
        show-expand
        @update:options="paginate"
        :server-items-length="count"
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
            <v-btn
              class="me-2"
              color="green"
              small
              outlined
              fab
              elevation="0"
              @click="editClient(item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <delete-dialog :id="item.id" :disabled="false" :source="'CLIENT'" />
          </v-row>
        </template>
        <template v-slot:item.montant="{ item }">
          <v-chip dark :color="getColor(item.montant)">
            {{ formatCurrency(item.montant, false) }}
          </v-chip>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row class="ma-3" no-gutters>
              <v-col>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">الهاتف</v-col>
                  <v-col>{{ item.mobile }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">العنوان</v-col>
                  <v-col>{{ item.address }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">دين قديم</v-col>
                  <v-col>{{ item.ancien }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">البريد الالكتروني</v-col>
                  <v-col>{{ item.email }}</v-col>
                </v-row>

                <v-divider></v-divider>

                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">الباركود</v-col>
                  <v-col>{{ item.barcode }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">النقاط</v-col>
                  <v-col>{{ item.point }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">تاريخ التسجيل</v-col>
                  <v-col>{{ item.created_at }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">NIF</v-col>
                  <v-col>{{ item.nif }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">NºRC</v-col>
                  <v-col>{{ item.n_rc }}</v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="ma-1" no-gutters>
                  <v-col cols="4">NºAI</v-col>
                  <v-col>{{ item.n_ai }}</v-col>
                </v-row>
              </v-col>
            </v-row>
          </td>
        </template>
      </v-data-table></v-card
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import client from "@/classes/client";
import ManageTeacher from "./dialog/ManageTeacher.vue";
import clientModule from "@/store/clientModule";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import snackBarModule from "@/store/snackBarModule";
import Search from "@/classes/search";

@Component({ components: { ManageTeacher, DeleteDialog } })
export default class ClientView extends Vue {
  clientHeaders = [
    { text: "اسم الزبون", value: "name" },
    { text: "المبلغ", value: "montant" },
    // {text: "رقم الهاتف", value: "mobile"},
    { text: "العمليات", value: "actions" },
    { text: "", value: "data-table-expand" },
  ];

  previewImage = "";
  clientData = [] as client[];
  selectedClient = {} as client;
  count = 0;
  perPage = 0;
  search = { name: "", url: "" } as Search;

  getColor(montant) {
    if (montant > 0) return "red";
    // else if (montant >= 0 && montant<5) return "orange";
    // else return "green";
  }

  created() {
    this.$root.$on("createdClient", (Client: client) => {
      this.clientData.unshift(Client);
      this.count++;
    });
    this.$root.$on("updatedClient", (updatedclient: client) => {
      if (updatedclient) {
        this.clientData?.splice(
          this.clientData?.indexOf(
            this.clientData?.find((s) => s.id == updatedclient.id) ??
              ({} as client)
          ),
          1,
          updatedclient
        );
      }
    });
    this.$root.$on("deletedClientId", (deletedClientId: number) => {
      if (deletedClientId) {
        this.clientData.splice(
          this.clientData.indexOf(
            this.clientData.find((c) => c.id == deletedClientId) ??
              ({} as client)
          ),
          1
        );
      }
    });

    this.$root.$on(
      "ChangeMontantAfterDelete",
      (numberofchange: number, numberofclient: number) => {}
    );
  }

  paginate(obj: any) {
    this.search.url = "&page=" + obj.page;
  }

  @Watch("search", { deep: true })
  onSearchChange() {
    this.getClient();
  }

  private getClient() {
    clientModule
      .getClients(this.search)
      .then((data) => {
        // console.log( data)
        this.clientData.length = 0;
        ((data as any).data as client[]).forEach((s) => {
          this.clientData.push(s);
        });
        this.count = (data as any).total;
        this.perPage = ((data as any).data as any).per_page;
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

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedClient = item;
      clientModule.setClient(item);
    } else {
      // row.select(false);
      this.selectedClient = {} as client;
    }

    this.$root.$emit("clientId", item);
  }

  editClient(item: any) {
    this.$root.$emit("editClient", item);
  }
}
</script>
<style scoped>
/* ::v-deep tr {
  height: 40px !important;
} */
/* ::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
} */

/* ::v-deep td {
  height: 40px !important;
} */
</style>
