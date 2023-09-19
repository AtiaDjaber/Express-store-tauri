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
          autofocus
          solo
          flat
          clearable
          :value="search.name"
          append-icon="fa-search"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
          :hint="$t('product_search')"
          :label="$t('product_search')"
          :placeholder="$t('product_search')"
        ></v-text-field>
      </v-col>
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            fab
            tile
            class="mt-3 me-2"
            height="47"
            width="47"
            elevation="0"
            :loading="isSelecting"
            @click="handleFileImport"
          >
            <v-icon color="grey darken-1">mdi-download</v-icon>
          </v-btn>
        </template>
        <span>إستيراد المنتجات من ملف إكسيل</span>
      </v-tooltip>

      <input
        type="file"
        @change="selectedFile"
        ref="uploader"
        style="display: none"
      />

      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            fab
            tile
            class="mt-3 me-2"
            height="47"
            width="47"
            elevation="0"
            @click="exportFile"
          >
            <v-icon color="grey darken-1">mdi-upload</v-icon>
          </v-btn>
        </template>
        <span>تصدير المنتجات في ملف إكسيل</span>
      </v-tooltip>
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="liststock"
        single-select
        :loading="loading"
        loading-text="جاري تحميل البيانات ..."
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
          'items-per-page-text': ' عدد العناصر - ' + count,
        }"
      >
        <template v-slot:[`item.price`]="{ item }">
          {{ formatCurrency(item.price) }}
        </template>
        <template v-slot:[`item.sell_price`]="{ item }">
          {{ formatCurrency(item.sell_price) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-btn
              color="green"
              small
              class="me-2"
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
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
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
import { Debounce } from "vue-debounce-decorator";
import Stock from "@/classes/stock";

@Component({ components: { Stockmanege, DeleteDialog, ManageTypeExpense } })
export default class StockView extends Vue {
  Headers = [
    { text: "الصنف", value: "name" },
    { text: "المرجع", value: "reference" },
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
  listExcel = [] as Stocks[];
  excel: any;

  onChangeBarcode(text: any): void {
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
  loading = false;
  selectedFile(e: any): void {
    this.loading = true;
    console.log("rows");

    readXlsxFile(e.target.files[0]).then((rows) => {
      rows.shift();

      console.log(rows);
      this.listExcel = [] as Stocks[];

      for (let index = 0; index < rows.length; index++) {
        // Work with easy store
        // this.excel = {
        //   name: rows[index].at(1),
        //   barcode: rows[index].at(2)?.toString(),
        //   quantity: Number(rows[index].at(3)?.toString()),
        //   price: Number(rows[index].at(4)?.toString().replaceAll(",", "")),
        //   date_expire:
        //     rows[index].at(6) != null
        //       ? new Date(rows[index].at(6)?.toString())
        //       : null,
        //   sell_price: Number(rows[index].at(7)?.toString().replaceAll(",", "")),
        //   sell_price2: Number(
        //     rows[index].at(5)?.toString().replaceAll(",", "")
        //   ),
        //   quantity_alert: Number(rows[index].at(8)?.toString()),
        // } as Stocks;

        //work with Express Store
        this.excel = {
          // name: rows[index].at(0),
          // quantity: Number(rows[index].at(1)?.toString()),
          // price: Number(rows[index].at(2)?.toString().replaceAll(",", "")),
          // sell_price: Number(rows[index].at(3)?.toString().replaceAll(",", "")),
          // sell_price2: Number(
          //   rows[index].at(4)?.toString().replaceAll(",", "")
          // ),
          // packing_price: Number(
          //   rows[index].at(5)?.toString().replaceAll(",", "")
          // ),
          // packing_size: Number(rows[index].at(6)?.toString()),
          // date_expire:
          //   rows[index].at(7) != null
          //     ? new Date(rows[index].at(7)?.toString())
          //     : null,
          // quantity_alert: Number(rows[index].at(8)?.toString()),
          // reference: rows[index].at(9)?.toString(),
          // photo: rows[index].at(10)?.toString(),
          // path: rows[index].at(11)?.toString(),
          // barcode: rows[index].at(12)?.toString(),
          // note: rows[index].at(13)?.toString(),
        } as Stock;

        // Work with Taki
        // this.excel = {
        //   name: rows[index].at(2)?.toString(),
        //   barcode: rows[index].at(0)?.toString(),
        //   quantity: 0,
        //   price: 0,
        //   date_expire: null,
        //   sell_price: 0,
        //   sell_price2: 0,
        //   quantity_alert: 1,
        // } as Stocks;

        /// add to list

        this.listExcel.push(this.excel);
      }
      stockApi
        .saveManyStock(this.listExcel)
        .then((result: any) => {
          this.getStocks(this.search);
          this.loading = false;

          SnackBarModule.setSnackbar({
            text: "تمت استيراد المنتجات بنجاح",
            color: "success",
            timeout: 2000,
            show: true,
            icon: "mdi-checkbox-marked-circle-outline",
            x: "right",
            y: "top",
          });
        })
        .catch((error) => {
          this.loading = false;

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
    });
  }

  async exportFile() {
    let res = await stockApi.getAllStockExport();
    console.log(res);
    if (res.status == 200) {
      let allProduct = res.data;
      const schema = [
        {
          column: "Nom du produit",
          type: String,
          value: (stock) => stock.name,
        },

        {
          column: "Quantité",
          type: Number,
          value: (stock) => stock.quantity,
        },
        {
          column: "Prix ​​d'achat",
          type: String,
          value: (stock) => stock.price.toString(),
        },
        {
          column: "Prix ​​de vente 1",
          type: String,
          value: (stock) => stock.sell_price.toString(),
        },
        {
          column: "Prix ​​de vente 2",
          type: String,
          value: (stock) => stock.sell_price2?.toString(),
        },

        {
          column: "Prix ​​de gros",
          type: String,
          value: (stock: Stocks) => stock.packing_price?.toString(),
        },
        {
          column: "Taille d'emballage",
          type: String,
          value: (stock: Stocks) => stock.packing_size?.toString(),
        },
        {
          column: "Date d'expiration",
          type: String,
          value: (stock) => stock.date_expire?.toString(),
        },
        {
          column: "Quantity alert",
          type: String,
          value: (stock: Stocks) => stock.quantity_alert?.toString(),
        },
        {
          column: "Reference",
          type: String,
          value: (stock: Stocks) => stock.reference?.toString(),
        },
        {
          column: "Photo",
          type: String,
          value: (stock: Stocks) => stock.photo?.toString(),
        },
        {
          column: "Path",
          type: String,
          value: (stock: Stocks) => stock.path?.toString(),
        },
        {
          column: "Barcode",
          type: String,
          value: (stock: Stocks) =>
            stock.barcodes?.map((e) => e.name).join(" "),
        },
        {
          column: "Note",
          type: String,
          value: (stock: Stocks) => stock.note?.toString(),
        },
      ];
      console.log(allProduct);
      await writeXlsxFile(allProduct, {
        schema,
        fileName: "list_products.xlsx",
      });
    }
  }

  @Watch("search", { deep: true })
  onChange(): void {
    this.getStocks(this.search);
  }

  @Debounce(80)
  getStocks(search?: Search): void {
    this.loading = true;

    stockApi
      .getStock(search)
      .then((response) => {
        this.loading = false;

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

  created(): void {
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

  getColor(item: Stocks): string {
    if (item.quantity <= 0) return "red";
    else if (item.quantity <= item.quantity_alert) return "orange";
    else return "green";
  }

  editstock(edited: any): void {
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
