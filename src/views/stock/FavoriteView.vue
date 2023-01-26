<template>
  <div class="pa-3">
    <v-row class="pa-1">
      <v-col cols="2"> <fav-manage /> </v-col>
      <!-- <v-spacer></v-spacer>
      <v-spacer></v-spacer> -->
      <!-- <col>
         <v-btn color="primary" @click="exportFile">
        تصدير اكسل
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
      <!-- <v-col cols="2"></v-col> -->
      <v-spacer></v-spacer>
      <div
        class="mx-3 mt-2"
        v-show="setting.depot_id == null || setting.depot_id == 0"
      >
        <manage-product-fav :v-if="selectedFav.id" :expenseAction="1" />
      </div>
      <!-- <v-btn @click="show = !show">asds</v-btn> -->
      <!-- <v-col cols="1"><v-btn @click="ExportFile">export</v-btn></v-col> -->

      <!-- <v-col cols="2" class="mt-n2">
        <v-file-input @change="selectedFile" label="File input"></v-file-input>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-card outlined>
          <v-data-table
            :headers="HeadersFav"
            :items="listFavorites"
            single-select
            translate="yes"
            @click:row="rowClick"
            hide-default-footer
            :items-per-page="-1"
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
                  @click="editfav(item)"
                >
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
                <DeleteDialog
                  :id="item.id"
                  :disabled="false"
                  :source="'Favorites'"
                />
              </v-row>
            </template> </v-data-table
        ></v-card>
      </v-col>
      <v-col cols="8">
        <div v-resize="onResize">
          <v-card
            style="overflow-y: auto"
            :height="windowSize.y - 300"
            elevation="0"
            outlined
          >
            <v-row v-if="!isLoadingFav" no-gutters class="ma-1">
              <v-col
                v-for="product in selectedFav.products"
                v-bind:key="product.id"
                cols="2"
              >
                <v-card
                  outlined
                  v-if="!setting.isImage"
                  height="155"
                  elevation="0"
                  class="ma-1"
                  style="cursor: pointer"
                >
                  <v-img
                    :src="getFullPath(product.photo)"
                    contain
                    height="110px"
                  >
                    <div class="ribbon-1">
                      <span style="color: white" class="prevent-select">
                        {{ product.sell_price }}</span
                      >
                    </div>
                    <!-- <v-chip
                      color="#08080855"
                      text
                      dark
                      class="mt-1 mr-n2 font-weight-bold"
                      >{{ product.sell_price }}
                    </v-chip> -->

                    <v-btn
                      class="ma-2"
                      fab
                      style="float: right"
                      x-small
                      dark
                      elevation="0"
                      color="pink lighten-1"
                      @click="removeFavorite(product)"
                    >
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </v-img>
                  <v-card-title class="pa-1 titleCard">{{
                    product.name
                  }}</v-card-title>
                </v-card>
                <v-card
                  v-else
                  outlined
                  :color="selectedProductColor(product)"
                  height="155"
                  elevation="0"
                  class="ma-1"
                  style="cursor: pointer"
                >
                  <v-btn
                    class="ma-2"
                    fab
                    style="float: right"
                    x-small
                    dark
                    elevation="0"
                    color="pink lighten-1"
                    @click="removeFavorite(product)"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                  <v-card-title
                    class="pa-1 text-center white--text prevent-select"
                    >{{ product.name }}
                  </v-card-title>

                  <!-- <v-row justify="center"
                  ><v-chip
                    v-if="setting.isImage"
                    text
                    dark
                    dense
                    class="mt-1 font-weight-bold"
                    >{{ product.sell_price }}</v-chip
                  ></v-row
                > -->
                </v-card>
              </v-col>
            </v-row>

            <v-row v-else no-gutters class="mx-1">
              <v-col v-for="n in 40" v-bind:key="n" cols="2">
                <v-skeleton-loader
                  light
                  type="image"
                  height="155"
                  class="ma-1"
                ></v-skeleton-loader>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import FavManage from "@/views/stock/dialog/FavManage.vue";
import SnackBarModule from "@/store/snackBarModule";
import stockApi from "@/api/stockApi";
import Stocks from "@/classes/stock";
import readXlsxFile from "read-excel-file";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import Depot from "@/classes/depot";
import Decoded from "@/helper/decode";
import Favorite from "@/classes/favorite";
import settingModule from "@/store/settingModule";
import ManageProductFav from "@/views/stock/dialog/ManageProductFav.vue";
import Stock from "@/classes/stock";
import HelperFunctions from "@/helper/helper_functions";

@Component({ components: { FavManage, DeleteDialog, ManageProductFav } })
export default class FavoriteView extends Vue {
  removeFavorite(stock: Stock) {
    stockApi.detachProductFromFavorite(this.selectedFav, stock).then((res) => {
      this.selectedFav.products.splice(
        this.selectedFav.products.findIndex((p) => p.id == stock.id),
        1
      );
      SnackBarModule.setSnackbar({
        text: "تمت عملية الحذف بنجاح",
        color: "success",
        timeout: 2000,
        show: true,
        icon: "mdi-checkbox-marked-circle-outline",
        x: "right",
        y: "top",
      });
    });
  }
  HeadersFav = [
    { text: "الاسم", value: "name" },
    { text: "العمليات", value: "actions" },
  ];
  isLoadingFav = true;
  selectedProductColor(product: Stock): string {
    return HelperFunctions.selectedColor(product);
  }
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
  listFavorites = [] as Favorite[];
  selectedFav = {} as Favorite;
  getFavorites() {
    this.isLoadingFav = true;

    stockApi
      .getFav()
      .then((response) => {
        this.listFavorites = response.data;
        // if (this.listFavorites.length > 0) {
        //   this.selectedFav = this.listFavorites[0];
        // }
        this.isLoadingFav = false;
      })
      .catch((e) => {
        this.isLoadingFav = false;
      });
  }

  //  objects = [
  //   {
  //     name:
  //     dateOfBirth:
  //     cost:
  //     paid:
  //   }
  //   ]
  // data= [this.HEADER_ROW,this.objects];

  clearInput(): void {
    this.search.name = "";
  }

  @Watch("search", { deep: true })
  onChange() {
    this.getStocks(this.search);
  }
  windowSize = { x: 0, y: 0 };

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
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

  get setting() {
    return settingModule.getSetting;
  }

  host: string;
  created() {
    this.host = process.env.VUE_APP_API_URL;
    this.getFavorites();
    this.$root.$on("addProductToFav", (stock: Stock) => {
      this.selectedFav.products.unshift(stock);
    });
    this.$root.$on("createdFav", (favorite: Favorite) => {
      favorite.products = [];
      this.listFavorites.unshift(favorite);
      // this.selectedFav = favorite;
    });
    this.$root.$on("deletedFavoriteId", (deletedFavoriteId: number) => {
      if (deletedFavoriteId) {
        this.listFavorites.splice(
          this.listFavorites.indexOf(
            this.listFavorites.find((c) => c.id == deletedFavoriteId)
          ),
          1
        );
        this.selectedFav = {} as Favorite;
      }
    });
  }
  getFullPath(photo: string) {
    return this.host + "storage/attachments/" + photo;
  }
  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedFav = item;
      this.$root.$emit("selectedFavorite", this.selectedFav);
    } else {
      row.select(false);
      this.selectedFav = {} as Favorite;
    }
  }
  changeFav(toggle: any, favorite: Favorite) {
    this.selectedFav = favorite;
  }
  getColor(item: Stocks) {
    if (item.quantity <= 0) return "red";
    else if (item.quantity <= item.quantity_alert) return "orange";
    else return "green";
  }

  editfav(edited: any) {
    this.$root.$emit("editfav", edited);
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
