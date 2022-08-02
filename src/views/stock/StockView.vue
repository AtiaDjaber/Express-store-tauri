<template>
  <div class="pa-3">
    <v-row class="pa-1">
      <v-col cols="2"> <Stockmanege /> </v-col>
      <!-- <v-spacer></v-spacer>
      <v-spacer></v-spacer> -->
      <!-- <col>
         <v-btn color="primary" @click="exportFile">
        تصدير اكسل
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
      </col>
      <v-col cols="2"></v-col>
      <v-col cols="4">
        <v-text-field
          outlined
          dense
          clearable
          append-icon="fa-search"
          label="  البحث باسم الصنف او الباركود"
          v-model="search.name"
        ></v-text-field>
      </v-col>
      <!-- <v-col cols="1"><v-btn @click="ExportFile">export</v-btn></v-col> -->

      <!-- <v-col cols="2" class="mt-n2">
        <v-file-input @change="selectedFile" label="File input"></v-file-input>
      </v-col> -->
    </v-row>
      <v-data-table
        :headers="Headers"
        :items="liststock"
        single-select
        @click:row="rowClick"
        :server-items-length="count"
        @update:options="paginate"
        :items-per-page="10"
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
              color="green"
              small
              class="ml-2"
              outlined
              rounded
              elevation="0"
              @click="editstock(item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <DeleteDialog :id="item.id" :disabled="false" :source="'Stocks'" />
          </v-row>
        </template>

        <template v-slot:item.quantity="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ item.quantity }}
          </v-chip>
        </template>
      </v-data-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Stockmanege from "@/views/stock/dialog/stockmanege.vue";
import SnackBarModule from "@/store/snackBarModule";
import stockApi from "@/api/stockApi";
import Stocks from "@/classes/stock";
import readXlsxFile from "read-excel-file";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import Depot from "@/classes/depot";
import writeXlsxFile from "write-excel-file";

@Component({ components: { Stockmanege, DeleteDialog } })
export default class StockView extends Vue {
  Headers = [
    { text: "باركود", value: "barcode", class: "grey lighten-4" },
    { text: "الصنف", value: "name", class: "grey lighten-4" },
    { text: " الكمية", value: "quantity", class: "grey lighten-4" },
    { text: "سعر الشراء", value: "price", class: "grey lighten-4" },
    { text: "سعر البيع", value: "sell_price", class: "grey lighten-4" },
    { text: " كمية التنبيه", value: "quantity_alert", class: "grey lighten-4" },
    { text: "", value: "actions", class: "grey lighten-4" },
  ];

  count = 0;
  original = "";
  private api = new stockApi();
  liststock = [] as Stocks[];
  selectstock = {} as Stocks;
  listDepots = [] as Depot[];
  search = new Search();
  listExecel = [] as Stocks[];
  Execel;

  DATA_ROW_1 = [
    {
      type: Number,
      value: 12,
    },
    {
      type: String,
      value: "مطرقة",
    },
    {
      type: Number,
      value: 142432,
    },
    {
      type: Number,
      value: 132322,
    },
    {
      type: Number,
      value: 166322,
    },
    {
      type: Number,
      value: 5431322,
    },
    // {
    //   value:this.liststock,
    // }
  ];

  //  objects = [
  //   {
  //     name:
  //     dateOfBirth:
  //     cost:
  //     paid:
  //   }
  //   ]
  // data= [this.HEADER_ROW,this.objects];

  schema = [
    {
      column: "باركود",
      type: Number,
      value: (Stocks) => Stocks.barcode,
    },
    {
      column: "الصنف",
      type: String,
      value: (Stocks) => Stocks.name,
    },
    {
      column: "الكمية",
      type: Number,
      value: (Stocks) => Stocks.quantity,
    },
    {
      column: "سعر الشراء",
      type: String,
      value: (Stocks) => Stocks.price,
    },
    {
      column: "سعر البيع",
      type: String,
      value: (Stocks) => Stocks.sell_price,
    },
    {
      column: "كمية التنبيه",
      type: Number,
      value: (Stocks) => Stocks.quantity_alert,
    },
  ];

  selectedFile(file: any) {
    // readXlsxFile(file).then((rows) => {
    //   rows.shift();
    //   for (let index = 0; index < rows.length; index++) {
    //     this.Execel = {
    //       name: rows[index].at(2),
    //       price: rows[index].at(6),
    //       sell_price: rows[index].at(6),
    //       quantity: rows[index].at(13),
    //       quantity_alert: rows[index].at(4),
    //       sell_price2: rows[index].at(5),
    //       barcode: rows[index].at(13).toString(),
    //     } as Stocks;
    //     this.listExecel.push(this.Execel);
    //     // this.liststock.unshift(this.Execel);
    //   }
    //   this.api.saveManyStock(this.listExecel).then((result: any) => {
    //     let saved = ((result as any).data as any).data as Stocks[];
    //     //  let saved = result as Stocks;
    //     this.liststock = saved;
    //   });
    //   this.listExecel = [] as Stocks[];
    // });
  }

  async exportFile() {
    const schema = [
      {
        column: "Name",
        type: String,
        value: (stock) => stock.name,
      },
      {
        column: "Price",
        type: String,
        value: (stock) => stock.price,
      },
      {
        column: "Quantity",
        type: Number,
        value: (stock) => stock.quantity,
      },
    ];
    await writeXlsxFile(this.liststock, {
      schema,
      fileName: "file.xlsx",
    });
  }

  @Watch("search", { deep: true })
  onChange() {
    this.getStocks(this.search);
  }

  getStocks(search?: Search): void {
    this.api
      .getStock(search)
      .then((response) => {
        this.liststock = [];
        this.count = 0;
        if (response.status == 200) {
          this.liststock = response.data.data as Stocks[];
          this.count = response.data.total;
        }
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

  created() {
    this.$root.$on("createdstocks", (stock: Stocks) => {
      this.liststock.unshift(stock);
      this.count++;
    });

    this.$root.$on("deletedstockid", (deletedstockid: number) => {
      if (deletedstockid) {
        this.liststock.splice(
          this.liststock.indexOf(
            this.liststock.find((c) => c.id == deletedstockid) ?? ({} as Stocks)
          ),
          1
        );
      }
    });

    // this.$root.$on("updatedUser", (updateUser: Stock) => {
    //   if (updateUser) {
    //     this.liststock?.splice(
    //         this.liststock?.indexOf(
    //             this.liststock?.find((s) => s.id == updateUser.id) ?? ({} as Stock)
    //         ),

    //         1,
    //         updateUser
    //     );
    //   }
    // });
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectstock = item;
    } else {
      row.select(false);
      this.selectstock = {} as Stocks;
    }
  }

  getColor(item: Stocks) {
    if (item.quantity <= 0) return "red";
    else if (item.quantity <= item.quantity_alert) return "orange";
    else return "green";
  }

  editstock(edited: any) {
    this.$root.$emit("editstock", edited);
  }

  paginate(obj: any) {
    this.search.url = obj.page;
    this.getStocks(this.search);
  }
}
</script>
