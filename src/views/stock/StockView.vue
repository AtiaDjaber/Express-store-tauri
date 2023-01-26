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
      <!-- <v-col cols="2"></v-col> -->
      <v-spacer></v-spacer>
      <manage-type-expense resource="categories"></manage-type-expense>
      <v-col cols="4">
        <v-text-field
          solo
          flat
          clearable
          :value="search.name"
          append-icon="fa-search"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
          hint="  البحث باسم الصنف او الباركود"
          placeholder="  البحث باسم الصنف او الباركود"
        ></v-text-field>
      </v-col>
      <!-- <v-btn @click="show = !show">asds</v-btn> -->
      <!-- <v-col cols="1"><v-btn @click="ExportFile">export</v-btn></v-col> -->
      <v-btn
        fab
        tile
        class="mt-3 me-2"
        height="47"
        width="47"
        elevation="0"
        :loading="isSelecting"
        @click="handleFileImport"
      >
        <v-icon color="grey darken-1">mdi-upload</v-icon>
      </v-btn>

      <input
        type="file"
        @change="selectedFile"
        ref="uploader"
        style="display: none"
      />

      <!-- <v-col cols="1" class="mt-n2">
        <v-file-input
          ref="uploader"
          hide-input
          @change="selectedFile"
        ></v-file-input>
      </v-col> -->
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="liststock"
        single-select
        translate="yes"
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
              fab
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
    </v-card>
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
import Decoded from "@/helper/decode";
import ManageTypeExpense from "../expense/dialog/ManageTypeExpense.vue";

@Component({ components: { Stockmanege, DeleteDialog, ManageTypeExpense } })
export default class StockView extends Vue {
  Headers = [
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: " الكمية", value: "quantity" },
    { text: "سعر الشراء", value: "price" },
    { text: "سعر البيع", value: "sell_price" },
    { text: " كمية التنبيه", value: "quantity_alert" },
    { text: " صلاحية المنتج", value: "date_expire" },
    { text: " الفئة", value: "category.name" },
    { text: "", value: "actions" },
  ];

  count = 0;
  original = "";
  // private api = new stockApi();
  liststock = [] as Stocks[];
  selectstock = {} as Stocks;
  listDepots = [] as Depot[];
  search = new Search();
  listExecel = [] as Stocks[];
  Execel: any;

  onChangeBarcode(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  // DATA_ROW_1 = [
  //   {
  //     type: Number,
  //     value: 12,
  //   },
  //   {
  //     type: String,
  //     value: "مطرقة",
  //   },
  //   {
  //     type: Number,
  //     value: 142432,
  //   },
  //   {
  //     type: Number,
  //     value: 132322,
  //   },
  //   {
  //     type: Number,
  //     value: 166322,
  //   },
  //   {
  //     type: Number,
  //     value: 5431322,
  //   },
  //   // {
  //   //   value:this.liststock,
  //   // }
  // ];

  //  objects = [
  //   {
  //     name:
  //     dateOfBirth:
  //     cost:
  //     paid:
  //   }
  //   ]
  // data= [this.HEADER_ROW,this.objects];
  show = true;
  // schema = [
  //   {
  //     column: "باركود",
  //     type: Number,
  //     value: (Stocks) => Stocks.barcode,
  //   },
  //   {
  //     column: "الصنف",
  //     type: String,
  //     value: (Stocks) => Stocks.name,
  //   },
  //   {
  //     column: "الكمية",
  //     type: Number,
  //     value: (Stocks) => Stocks.quantity,
  //   },
  //   {
  //     column: "سعر الشراء",
  //     type: String,
  //     value: (Stocks) => Stocks.price,
  //   },
  //   {
  //     column: "سعر البيع",
  //     type: String,
  //     value: (Stocks) => Stocks.sell_price,
  //   },
  //   {
  //     column: "كمية التنبيه",
  //     type: Number,
  //     value: (Stocks) => Stocks.quantity_alert,
  //   },
  // ];

  clearInput(): void {
    this.search.name = "";
  }
  isSelecting = false;
  handleFileImport() {
    this.isSelecting = true;
    console.log(this.$refs);
    // After obtaining the focus when closing the FilePicker, return the button state to normal
    window.addEventListener(
      "focus",
      () => {
        this.isSelecting = false;
      },
      { once: false }
    );

    // Trigger click on the FileInput
    (this.$refs.uploader as any).click();
  }
  selectedFile(e: any): void {
    // console.log();
    // e.target.files[0]
    readXlsxFile(e.target.files[0]).then((rows) => {
      rows.shift();

      for (let index = 0; index < rows.length; index++) {
        this.Execel = {
          name: rows[index][1],
          barcode: rows[index][2].toString(),
          quantity: rows[index][3],
          price: rows[index][4],
          date_expire:
            rows[index][6] != null
              ? new Date(rows[index][6].toString())
              : null,
          sell_price: rows[index][7],
          sell_price2: rows[index][5],

          quantity_alert: rows[index][8],
        } as Stocks;
        this.listExecel.push(this.Execel);
        // this.liststock.unshift(this.Execel);
      }
      stockApi.saveManyStock(this.listExecel).then((result: any) => {
        let saved = ((result as any).data as any).data as Stocks[];
        //  let saved = result as Stocks;
        this.liststock.unshift(...saved);
      });
      this.listExecel = [] as Stocks[];
    });
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
    stockApi
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
            this.liststock.find((c) => c.id == deletedstockid)
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
    // this.getStocks(this.search);
  }
}
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 5s ease;
}

/* .app {
  background: #f6f4f6 !important;
    background-color: #f6f6f6;

} */

::v-deep .centered-input input {
  text-align: center;
}
</style>
