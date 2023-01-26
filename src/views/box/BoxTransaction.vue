<template>
  <div class="mt-3">
    <v-row>
      <v-col cols="3">
        <c-date-picker
          placeholder="التاريخ"
          hint="التاريخ"
          flat
          solo
          clearable
          v-model="transaction.date"
        ></c-date-picker>
      </v-col>
      <v-col cols="3">
        <v-text-field
          placeholder="مبلغ الافتتاح"
          hint="مبلغ الافتتاح"
          type="number"
          flat
          solo
          v-model="transaction.start_montant"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          :disabled="!search.box_id"
          elevation="1"
          color="primary"
          dark
          large
          @click="manage()"
        >
          <v-icon color="white" class="px-2"> mdi-cash</v-icon>
          إضافة
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-row class="mr-1 my-2">
      <v-col cols="5">
        <v-text-field
          solo
          flat
          append-icon="fa-search"
          clearable
          hint="البحث باسم الصنف او الباركود"
          placeholder="اكتب اسم الصنف او الباركود"
          :value="search.name"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <c-date-picker
          v-model="search.from"
          hint="تاريخ البداية"
          placeholder="تاريخ البداية"
          clearable
          @eventname="clearFrom"
        ></c-date-picker>
      </v-col>

      <v-col>
        <c-date-picker
          solo
          flat
          @eventname="clearTo"
          v-model="search.to"
          hint="تاريخ النهاية"
          placeholder="تاريخ النهاية"
          clearable
        ></c-date-picker>
      </v-col>
    </v-row> -->
    <v-data-table
      :headers="transactionHeaders"
      :items="listTransactions"
      single-select
      item-key="id"
      @click:row="rowClick"
      single-expand
      :server-items-length="count"
      @update:options="paginate"
      class="elevation-1 mt-3"
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
          <v-btn color="green" small class="ml-2" outlined fab elevation="0">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <delete-dialog
            :id="item.id"
            :disabled="false"
            :source="'BoxTransaction'"
          />
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import snackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import settingModule from "@/store/settingModule";
import PrintImage from "@/print/print_image";
import { Setting } from "@/classes/setting";
import Box from "@/classes/box";
import BoxApi from "@/api/boxApi";
import BoxTransaction from "@/classes/boxTransaction";
import SnackBarModule from "@/store/snackBarModule";

@Component({
  components: {
    DeleteDialog,
    CDatePicker,
  },
})
export default class BoxTransactionView extends Vue {
  transactionHeaders = [
    { text: "#", value: "id" },
    { text: "المستخدم", value: "user.name" },
    { text: "التاريخ", value: "date" },
    { text: "مبلغ الافتتاح", value: "start_montant" },
    { text: "مبلغ الغلاق", value: "close_montant" },
    { text: "ملاحظة", value: "remark" },
    { text: "", value: "actions" },
    // { text: "", value: "data-table-expand" },
  ];

  clearInput(): void {
    this.search.name = "";
  }

  search = new Search();

  transaction = {} as BoxTransaction;

  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  box = {} as Box;
  listTransactions = [] as BoxTransaction[];
  index: any;

  created() {
    this.$root.$on("boxId", (item: Box) => {
      this.box = item;
      this.transaction.box_id = item.id;
      this.transaction.user_id = item.user_id;
      this.search.box_id = item.id;
    });

    this.$root.$on("deleteBoxTransaction", (result: any) => {
      if (result) {
        this.listTransactions.splice(
          this.listTransactions.indexOf(
            this.listTransactions.find((c) => c.id == result.id)
          ),
          1
        );
      }
    });
  }

  manage() {
    this.transaction.close_montant = this.transaction.start_montant;
    BoxApi.saveBoxTransaction(this.transaction)
      .then((result) => {
        console.log(result.data);
        let saved = result.data as any;
        this.listTransactions.unshift(saved);
        SnackBarModule.setSnackbar({
          text: "تمت العملية بنجاح",
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
  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
      this.transaction = item;
      this.index = row.index;
      this.$root.$emit("index", this.index);
    } else {
      this.index = -1;
      this.$root.$emit("index", this.index);
      row.select(false);
    }
  }

  @Watch("search", { deep: true, immediate: true })
  filterData(): void {
    this.getTransactions(this.search);
  }

  get setting(): Setting {
    return settingModule.getSetting;
  }

  getTransactions(search: any): void {
    this.listTransactions = [];
    this.listTransactions.length = 0;
    if (this.search.box_id) {
      BoxApi.getBoxTransactions(search)
        .then((data) => {
          this.listTransactions = data.data;
          this.count = data.total;
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

  paginate(obj: any) {
    this.search.url = obj.page;
  }
  clearFrom() {
    this.search.from = "";
  }

  clearTo() {
    this.search.to = "";
  }
}
</script>

<style scoped></style>
