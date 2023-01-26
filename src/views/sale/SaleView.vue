<template>
  <div class="pa-3">
    <v-bottom-sheet v-model="sheet">
      <v-list class="pb-8">
        <v-subheader>
          <h2 class="primary--text">
            {{ isAlternative ? "المنتجات البديلة للصنف " : "ملحقات الصنف " }}
          </h2>
          <v-spacer></v-spacer>
          <v-icon @click="sheet = false">mdi-close</v-icon>
        </v-subheader>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in accessoireAndAlternative"
          :key="item.name + i"
          @click="selectAccAlterItem(item)"
        >
          <v-list-item-avatar>
            <v-avatar size="32px">
              <v-icon>{{
                isAlternative
                  ? "mdi-directions-fork "
                  : "mdi-package-variant-closed "
              }}</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
    <v-btn
      depressed
      elevation="2"
      fab
      style="position: fixed; left: -25px; top: 50%; z-index: 20"
      @click="manageFavDisplay()"
    >
      <v-icon class="pl-4">{{
        display == true ? "mdi-arrow-left" : "mdi-arrow-right"
      }}</v-icon>
    </v-btn>

    <!-- <v-btn
      color="pink"
      style="position: fixed; left: 0%; top: 50%; z-index: 20"
      dark
    >
      buy now
    </v-btn> -->
    <!--        <v-row class="mt-16" justify="center" align-content="center" align="center">-->
    <!--          <div id="barcodePrint">-->
    <!--            <barcode-->
    <!--              v-bind:value="barcode"-->
    <!--              text-position="top"-->
    <!--              text="product  01 "-->
    <!--              height="60"-->
    <!--              font-size="22"-->
    <!--              text-margin="4"-->
    <!--              font-options="bold"-->
    <!--            >-->
    <!--              غير موجود-->
    <!--            </barcode>-->
    <!--            <v-row justify="center" class="mb-1"><h2>hello</h2></v-row>-->
    <!--          </div>-->
    <!--          <v-btn @click="createImage">print</v-btn>-->
    <!--        </v-row>-->

    <v-row no-gutters>
      <!-- v-show="depot_id" -->
      <div
        class="mx-3"
        v-show="setting.depot_id == null || setting.depot_id == 0"
      >
        <ManageProductSale :expenseAction="1" />
      </div>

      <div
        class="mx-3"
        v-show="setting.depot_id != null && setting.depot_id != 0"
      >
        <ManageProductSaleDepot />
      </div>

      <!-- <v-btn @click="test()">test</v-btn> -->
      <!--      <div v-show="!facture.id" class="mt-3" style="width: 60px">-->
      <!--        <manage-teacher :teacherAction="1" :isFab="true" />-->
      <!--      </div>-->
      <v-col cols="3">
        <v-text-field
          hint="البحث باسم الصنف او الباركود  "
          label="البحث باسم الصنف او الباركود  "
          placeholder="البحث باسم الصنف او الباركود  "
          required
          append-icon="fa-search"
          prepend-inner-icon="mdi-barcode-scan"
          flat
          solo
          :value="search.name"
          @keyup.enter="manageSearch"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
          clearable
        ></v-text-field>
      </v-col>

      <!-- <v-col>
        <v-autocomplete
          :items="listDepots"
          item-text="name"
          item-value="id"
          outlined
          hide-details
          
          v-model="depot_id"
          placeholder="اكتب اسم المخزن"
          label="المخزن"
          prepend-inner-icon="mdi-storefront"
          clearable
          @change="changeDepot"
        ></v-autocomplete>
      </v-col> -->

      <!--      <v-col cols="2" v-if="facture.client != null">-->
      <!--        <v-text-field-->
      <!--          outlined-->
      <!--          dense-->
      <!--          background-color="red"-->
      <!--          dark-->
      <!--          v-model="facture.client.montant"-->
      <!--          filled-->
      <!--          prefix="دين قديم : "-->
      <!--          readonly-->
      <!--          append-icon="mdi-search"-->
      <!--        ></v-text-field>-->
      <!--      </v-col>-->

      <v-spacer></v-spacer>

      <v-btn
        class="mx-3"
        dark
        large
        elevation="0"
        color="error"
        v-show="facture.id != null"
        @click="addNewFacture"
      >
        إلغاء التعديل
        <v-icon right>mdi-cancel</v-icon>
      </v-btn>
      <!-- :disabled="depot_id == null" -->
      <v-tooltip bottom color="secondary">
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            large
            v-on="on"
            elevation="0"
            class="mx-3"
            color="green "
            :disabled="facture.sales.length < 1"
            v-shortkey="['f1']"
            @shortkey="saveFacture()"
            @click="saveFacture()"
          >
            {{ facture.id != null ? "تعديل الفاتورة" : "إضافة الفاتورة" }}
            <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Press F1</span>
      </v-tooltip>

      <v-col cols="3">
        <v-autocomplete
          :items="listclients"
          v-model="facture.client_id"
          item-text="name"
          item-value="id"
          flat
          solo
          :disabled="facture.id != null"
          hide-details
          placeholder="اكتب اسم الزبون"
          label="الزبون"
          prepend-inner-icon="mdi-account-search"
          :clearable="facture.id == null"
        ></v-autocomplete>
      </v-col>

      <manage-teacher :isFab="true" :teacherAction="1" />
      <!--      <v-btn-->
      <!--          outlined-->
      <!--          class="ml-2 mt-3"-->
      <!--          color="grey darken-3"-->
      <!--          :disabled="depot_id == null"-->
      <!--          @click="saveFacture()"-->
      <!--      >-->
      <!--        طباعة-->
      <!--        <v-icon right>mdi-printer</v-icon>-->
      <!--      </v-btn>-->
    </v-row>

    <v-row no-gutters>
      <v-col :cols="display ? 7 : 12">
        <v-card class="mb-2 elevation-0" outlined>
          <v-row class="my-3" justify="center">
            <h1 class="primary--text">
              المبلغ الإجمالي :
              {{ this.facture.montant.toFixed(2) }} دج
            </h1>
          </v-row>
        </v-card>

        <!-- Start List Carts -->
        <div v-resize="onResize">
          <!-- <v-card elevation="0" outlined> -->
          <v-row no-gutters justify="space-between" class="pl-4 pr-1 pb-1">
            <v-col cols="3">
              <v-row no-gutters>
                <v-col v-show="indexOlderFacture > 1" cols="4">
                  <v-tooltip bottom color="secondary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        elevation="0"
                        tile
                        fab
                        height="45"
                        width="46"
                        :loading="loadingNext"
                        v-shortkey="['arrowright']"
                        @shortkey="getNextFacture()"
                        @click="getNextFacture()"
                      >
                        <v-icon large color="grey">mdi-arrow-right</v-icon>
                      </v-btn>
                    </template>
                    <span>الأمام [Arrow Right]</span>
                  </v-tooltip>
                </v-col>
                <v-col
                  v-show="!(indexOlderFacture == totalOlderFactures)"
                  cols="4"
                >
                  <v-tooltip bottom color="secondary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        tile
                        fab
                        height="45"
                        width="46"
                        elevation="0"
                        :loading="loadingPrevious"
                        v-shortkey="['arrowleft']"
                        @shortkey="getPreviousFacture()"
                        @click="getPreviousFacture()"
                      >
                        <v-icon large color="grey">mdi-arrow-left</v-icon>
                      </v-btn>
                    </template>
                    <span> السابق [Arrow Left]</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="4">
                  <v-tooltip bottom color="secondary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        tile
                        fab
                        small
                        height="45"
                        width="46"
                        elevation="0"
                        v-shortkey="['del']"
                        @shortkey="clearCart()"
                        @click="clearCart()"
                      >
                        <v-icon large color="red">mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>تنظيف السلة [Del]</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row no-gutters>
                <v-col cols="11">
                  <!-- <v-card height="35" elevation="0" class="mx-2"> -->
                  <v-slide-group mandatory show-arrows>
                    <v-slide-item v-for="(facture, i) in cartList" :key="i">
                      <!-- <v-badge inline color="green" content="6">
                            <v-btn
                              fab
                              outlined
                              :class="
                                i != indexCurrentCart
                                  ? ' px-2 mx-2'
                                  : 'font-weight-bold px-2 mx-2'
                              "
                              link
                              @click.exact="changeCart(i)"
                              :color="i != indexCurrentCart ? 'grey' : 'pink'"
                              ><h3>{{ facture.cartNumber }}</h3>
                            </v-btn>
                          </v-badge> -->
                      <v-card
                        @click.exact="changeCart(i)"
                        link
                        rounded
                        :class="
                          i != indexCurrentCart ? ' px-2 mx-2 ' : ' px-2 mx-2 '
                        "
                        :color="i != indexCurrentCart ? 'greyback' : 'pink'"
                      >
                        <v-row>
                          <v-card-title class="pa-4">
                            <v-btn
                              fab
                              x-small
                              :class="
                                i != indexCurrentCart
                                  ? ' '
                                  : 'font-weight-bold  '
                              "
                              elevation="0"
                              @click.exact="changeCart(i)"
                              ><h2>{{ facture.cartNumber }}</h2>
                            </v-btn>
                            <div
                              :class="
                                i != indexCurrentCart
                                  ? 'grey--text text--darken-1 ps-1'
                                  : 'white--text ps-1'
                              "
                            >
                              {{ facture.cartName }}
                            </div>

                            <!-- <div
                                  :class="
                                    i != indexCurrentCart
                                      ? 'black--text lighten-1'
                                      : 'white--text'
                                  "
                                >
                                  {{ facture.cartNumber }}
                                </div> -->
                          </v-card-title>
                          <v-divider v-if="i != 0" inset vertical></v-divider>
                          <v-icon
                            v-if="i != 0"
                            @click="removeCart(i)"
                            :color="i != indexCurrentCart ? 'grey ' : 'white'"
                            class="px-3"
                            >mdi-close-outline</v-icon
                          >
                        </v-row>
                      </v-card>
                      <!-- <v-chip
                            label
                            :close="i != 0"
                            link
                            close-icon="mdi-close-outline"
                            :class="
                              i != indexCurrentCart
                                ? ' px-2 mx-2'
                                : 'font-weight-bold px-2 mx-2'
                            "
                            :color="
                              i != indexCurrentCart ? 'grey lighten-3' : 'pink'
                            "
                            @click:close="removeCart(i)"
                            @click.exact="changeCart(i)"
                          >
                            <v-avatar left class="pink mx-1">
                              <strong style="color: white">{{
                                facture.cartNumber
                              }}</strong>
                            </v-avatar>
                            <div class="px-1">{{ facture.cartName }}</div>
                          </v-chip> -->
                    </v-slide-item>
                  </v-slide-group>
                  <!-- </v-card> -->
                </v-col>

                <v-col cols="1">
                  <v-tooltip bottom color="secondary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        elevation="0"
                        outlined
                        fab
                        height="46"
                        width="46"
                        rounded
                        color="green"
                        @click="addCart()"
                      >
                        <v-icon>mdi-cart-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>إضافة سلة</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card outlined>
            <v-data-table
              :headers="Headers"
              :items="facture.sales"
              @click:row="rowClick"
              hide-default-footer
              fixed-header
              :height="windowSize.y - 395"
              item-key="product_id"
              :items-per-page="-1"
              single-select
            >
              <template v-slot:item.quantity="{ item }">
                <v-text-field
                  style="width: 120px; text-align: center"
                  dense
                  label="الكمية"
                  flat
                  solo
                  class="centered-input"
                  hide-spin-buttons
                  hide-details
                  type="number"
                  v-model="item.quantity"
                  @input="editItem(item)"
                >
                  <template v-slot:append>
                    <v-icon @click="item.quantity++">mdi-plus</v-icon>
                  </template>
                  <template v-slot:prepend-inner>
                    <v-icon @click="item.quantity--">mdi-minus</v-icon>
                  </template>
                </v-text-field>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-row no-gutters>
                  <v-col>
                    <v-btn
                      @click="deleteItem(item)"
                      outlined
                      fab
                      class="ma-1"
                      small
                      color="red"
                    >
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ma-1"
                          outlined
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          color="primary"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          @click="
                            displayAlternativeAccesoiresBottom(
                              item.alternatives,
                              item,
                              true
                            )
                          "
                          link
                        >
                          <v-list-item-title class="px-2"
                            >أصناف بديلة</v-list-item-title
                          > </v-list-item
                        ><v-list-item
                          @click="
                            displayAlternativeAccesoiresBottom(
                              item.accessoires,
                              item,
                              false
                            )
                          "
                          link
                        >
                          <v-list-item-title class="px-2"
                            >ملحقات الصنف</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card>
          <!-- </v-card> -->
        </div>
      </v-col>

      <v-col v-if="display" class="pr-3" cols="5">
        <v-card style="overflow-y: auto" :height="windowSize.y - 255" outlined>
          <v-slide-group class="mx-1" mandatory show-arrows>
            <v-slide-item
              v-for="favorite in listFavorites"
              v-bind:key="favorite.id"
              v-slot="{ active, toggle }"
            >
              <v-btn
                class="mx-1 my-1"
                :input-value="active"
                active-class="pink white--text"
                depressed
                rounded
                large
                @click="changeFav(toggle, favorite)"
              >
                <h3>{{ favorite.name }}</h3>
              </v-btn>
            </v-slide-item>
          </v-slide-group>
          <v-divider></v-divider>
          <v-row v-if="!isLoadingFav && selectedFav" no-gutters class="ma-1">
            <v-col
              v-for="product in selectedFav.products"
              v-bind:key="selectedFav.name + product.id"
              class="pa-1"
              cols="6"
              lg="3"
              md="3"
              sm="4"
            >
              <v-card
                v-if="!setting.isImage"
                outlined
                height="160"
                elevation="0"
                style="cursor: pointer"
                @click="addToCart(product)"
              >
                <v-img :src="getFullPath(product.photo)" contain height="110px">
                  <div class="ribbon-1">
                    <span style="color: white" class="prevent-select">
                      {{ product.sell_price }}</span
                    >
                  </div>
                </v-img>

                <v-card-title class="pa-1 titleCard"
                  >{{ product.name }}
                </v-card-title>
              </v-card>
              <!-- Button Card -->
              <v-card
                v-else
                outlined
                :color="selectedProductColor(product)"
                height="140"
                elevation="0"
                style="cursor: pointer"
                @click="addToCart(product)"
              >
                <v-card-title
                  style="float: center"
                  class="pa-1 text-center white--text prevent-select"
                >
                  {{ product.name }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-else no-gutters class="mx-1">
            <v-col v-for="n in 20" v-bind:key="n" cols="3">
              <v-skeleton-loader
                light
                type="image"
                height="155"
                class="ma-1"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- <v-footer padless height="40" class="mt-3"> -->
    <v-row no-gutters class="mt-3">
      <v-col cols="1" v-if="facture.id" class="mt-2">
        <h3>
          {{ facture.id ? "الفاتورة  # " + facture.id : "" }}
        </h3>
      </v-col>
      <!-- <v-col cols="2">
          <v-text-field
            outlined
            
            readonly
            v-model="facture.montant"
            append-icon="mdi-search"
            label="دين قدي  "
          ></v-text-field>
        </v-col> -->
      <v-col cols="2" class="px-2">
        <v-text-field
          flat
          solo
          type="number"
          v-model="facture.remise"
          append-icon="mdi-percent"
          hint="تخفيض"
          placeholder="تخفيض"
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="px-2">
        <v-text-field
          flat
          solo
          type="number"
          v-model="facture.pay"
          append-icon="mdi-cash"
          hint="الدفع "
          placeholder="الدفع "
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="px-2">
        <v-text-field
          solo
          flat
          readonly
          v-model="getRest"
          append-icon="mdi-cash"
          placeholder="الباقي"
          hint="الباقي"
        ></v-text-field>
      </v-col>
      <v-col class="px-2">
        <v-text-field
          flat
          solo
          v-model="facture.remark"
          append-icon="mdi-pencil"
          label="ملاحظة"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- </v-footer> -->

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="#fb6333"
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<!-- <div id="facture" class="pa-3" style="width: 1000px">
      <v-row no-gutters class="mt-6">
        <v-col cols="6">
          <v-col>
            <v-row justify="center" class="mb-2">
              <h2>
                {{ setting.name_store }}
              </h2>
            </v-row>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col v-if="setting.logo != null" cols="3">
                <v-img
                  class="mt-n6"
                  style="align: right"
                  height="100px"
                  width="100px"
                  contain
                  :src="setting.logo"
                >
                </v-img>
              </v-col>
              <v-col>
                <v-row>
                  <p class="mr-2">
                    <v-icon>mdi-map-marker-outline</v-icon>
                    {{
                      setting.depot != null
                        ? setting.depot.address
                        : setting.address
                    }}
                  </p>
                </v-row>
                <v-row>
                  <p class="mr-2">
                    <v-icon> mdi-phone-outline</v-icon>
                    {{
                      setting.depot != null ? setting.depot.tel : setting.tel
                    }}
                  </p>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
        <v-divider vertical></v-divider>
    
        <v-col class="mr-6">
          <v-row justify="center" class="mb-2">
            <h2>فاتورة بيع</h2>
          </v-row>
          <p class="mt-6">رقم الفاتورة : {{ facture.id }}</p>
          <p>
            الزبون :
            {{ facture.client != null ? facture.client.name : facture.client }}
          </p>
          <p>التاريخ : {{ facture.created_at }}</p>
        </v-col>
      </v-row>
      <v-data-table
        :headers="Headers"
        :items="facture.sales"
        disable-sort
        hide-default-footer
        :items-per-page="-1"
        class="elevation-0 mt-5"
      >
      </v-data-table>

      <v-row class="mt-4"></v-row>
      <p class="mt-4 mr-2">المجموع : {{ facture.montant }}</p>
      <v-divider
        class="light-blue darken-3 mb-1 mt-n1 mr-2"
        style="max-height: 2px; height: 2px; width: 120px"
      ></v-divider>
      <p class="mr-2">المدفوع : {{ facture.pay }}</p>
      <p class="mr-2">التخفيض : {{ facture.remise }}</p>
      <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
        <h4 class="mr-2">الباقي : {{ facture.rest }}</h4>
        <v-col cols="6"></v-col>
        <h4 class="mr-2" style="text-align: left">
          {{ setting.remark }}
        </h4>
      </v-row>
    </div> -->

<script lang="ts">
import ManageTeacher from "@/views/client/dialog/ManageTeacher.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageProductSale from "@/views/sale/dialog/ManageProductSale.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Client from "@/classes/client";
import clientApi from "@/api/clientApi";
import saleModule from "@/store/saleModule";
import Facture from "@/classes/facture";
import FactureApi from "@/api/factureApi";
import Sale from "@/classes/sale";
// import * as electron from "electron";
import SnackBarModule from "@/store/snackBarModule";
import client from "@/classes/client";
import depotApi from "@/api/depotApi";
import Depot from "@/classes/depot";
import ManageProductImport from "@/views/export/dialog/ManageProductImport.vue";
import ManageProductSaleDepot from "@/views/sale/dialog/ManageProductSaleDepot.vue";

import settingModule from "@/store/settingModule";
import PrintPdf from "@/print/print_image";
import stockApi from "@/api/stockApi";
import Search from "@/classes/search";
import ProductDepot from "@/classes/product_depot";
import Stock from "@/classes/stock";
import Decoded from "@/helper/decode";
import Favorite from "@/classes/favorite";
import HelperFunctions from "@/helper/helper_functions";

@Component({
  components: {
    ManageProductSaleDepot,
    ManageProductImport,
    DeleteDialog,
    ManageProductSale,
    ManageTeacher,
  },
})
export default class SaleView extends Vue {
  facture = this.emptyFacture();
  cartList = [this.emptyFacture()] as Facture[];

  accessoireAndAlternative = [] as Stock[];
  display = true;

  sheet = false;
  isAlternative = false;
  displayAlternativeAccesoiresBottom(
    products: Stock[],
    sale: Sale,
    alternative: boolean
  ): void {
    this.accessoireAndAlternative = products;
    this.sheet = true;
    this.selectedSale = sale;
    this.isAlternative = alternative;
  }
  // get cartLists() {
  //   this.cartList = saleModule.cartList;
  //   return saleModule.cartList;
  // }
  removeCart(i: number): void {
    console.log("remove");
    if (i != 0) {
      this.cartList.splice(i, 1);
      if (this.indexCurrentCart == i) {
        this.changeCart(0);
      } else {
        if (this.indexCurrentCart - 1 > 0) {
          this.changeCart(this.indexCurrentCart - 1);
        }
      }
    }
  }

  selectAccAlterItem(item: Stock): void {
    this.search.name = item.name;
    this.manageSearch();
    this.sheet = false;
  }
  getMax(): number {
    let max = 1;
    for (let i = 0; i < this.cartList.length; i++) {
      for (let j = 0; j < this.cartList.length; j++) {
        if (max < this.cartList[i].cartNumber) {
          max = this.cartList[i].cartNumber;
        }
      }
    }
    return max + 1;
  }
  addCart(): void {
    this.cartList.push(this.emptyFacture(this.getMax()));
    this.changeCart(this.cartList.length - 1);
  }
  manageFavDisplay(): void {
    if (this.display) {
      localStorage.setItem("displayFav", "hide");
      this.display = false;
    } else {
      localStorage.setItem("displayFav", "show");
      this.display = true;
    }
  }
  changeCart(i: number): void {
    console.log("change");
    saleModule.changeSelectedCart(i);
    this.facture = this.cartList[i];
  }

  get indexCurrentCart(): number {
    return saleModule.currentCart;
  }
  displayFav(): void {
    this.display =
      (localStorage.getItem("displayFav") ?? "show") == "show" ? true : false;
  }
  // displayFav = true;
  Headers = [
    // { text: "#", value: "count" },
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "سعر البيع", value: "sell_price" },
    { text: "المبلغ الإجمالي", value: "total" },
    { text: "", value: "actions", width: 130 },
  ];

  indexOlderFacture = 0;
  totalOlderFactures = 1;
  loadingPrevious = false;
  loadingNext = false;
  async getPreviousFacture(): Promise<void> {
    if (this.totalOlderFactures > this.indexOlderFacture) {
      this.loadingPrevious = true;
      this.indexOlderFacture = this.indexOlderFacture + 1;
      let res = await FactureApi.paginateFacture(this.indexOlderFacture);
      if (res["total"] > 0) {
        let localFacture = res["data"][0] as Facture;
        localFacture.cartName = this.facture.cartName;
        localFacture.cartNumber = this.facture.cartNumber;
        this.cartList[this.indexCurrentCart] = localFacture;
        this.facture = this.cartList[this.indexCurrentCart];
        // if (res["total"] > this.indexOlderFacture) {
        this.totalOlderFactures = res["total"];
        // }
      }
      this.loadingPrevious = false;
    }
  }
  //
  async getNextFacture(): Promise<void> {
    if (this.indexOlderFacture > 0) {
      this.indexOlderFacture = this.indexOlderFacture - 1;
      this.loadingNext = true;

      let res = await FactureApi.paginateFacture(this.indexOlderFacture);
      if (this.indexOlderFacture > 0) {
        let localFacture = res["data"][0] as Facture;
        localFacture.cartName = this.facture.cartName;
        localFacture.cartNumber = this.facture.cartNumber;
        this.cartList[this.indexCurrentCart] = localFacture;
        this.facture = this.cartList[this.indexCurrentCart]; // if (res["current"] > 0) {
        // this.indexOlderFacture = this.indexOlderFacture - 1;
        // }
      }
      this.loadingNext = false;
    }
  }

  apiFacture = new FactureApi();
  // apiSale = new SaleApi();
  isLoadingFav = true;
  totalCredit = 0;

  loading = false;
  count = 0;
  private api = new clientApi();
  perPage = 0;

  changeDepot(depotId: any) {
    this.$root.$emit("depotIdFromSale", depotId);
  }
  tab = 0;

  get getRest(): number {
    this.facture.rest = Number(
      (
        Number(this.facture.montant) -
        Number(this.facture.pay) -
        Number(this.facture.remise)
      ).toFixed(2)
    );
    return this.facture.rest;
  }

  windowSize = { x: 0, y: 0 };

  onResize(): void {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }

  editItem(sale: Sale) {
    const index = this.facture.sales.findIndex(
      (e) => e.product_id == sale.product_id
    );

    this.facture.sales[index].quantity = sale.quantity;
    this.facture.sales[index].total =
      Number(sale.quantity) * Number(sale.sell_price);
  }

  listDepots = [] as Depot[];
  private depotApi = new depotApi();

  getDepots(url?: string) {
    this.depotApi.getAllDepots(url).then((data) => {
      this.listDepots = (data as any).data as Depot[];
    });
  }

  addToCart(product: Stock): void {
    let sale = Object.assign({}, {
      quantity: Number(product.pivot["quantity"]),
      product_id: product.id,
      name: product.name,
      sell_price: product.sell_price,
      barcode: product.barcode,
      total: Number(product.pivot["quantity"]) * product.sell_price,
      price: product.price,
      // quantity_stock: product.quantity,
      accessoires: product.accessoires,
      alternatives: product.alternatives,
      product: product,
    } as Sale);
    saleModule.addItem(sale);
  }
  changeFav(toggle: any, favorite: Favorite): void {
    this.selectedFav = favorite;
    toggle.call();
  }

  depot_id = 0;
  host: string;
  created() {
    this.cartList = saleModule.getListFacture;
    this.facture = saleModule.getListFacture[0];
    // this.cartList[this.indexCurrentCart] = saleModule.facture;
    this.host = process.env.VUE_APP_API_URL;

    this.search.depot_id = this.setting.depot_id;
    // this.getDepots();
    this.$root.$on("createdClient", (newClient: client) => {
      this.listclients.unshift(newClient);
      this.facture.client = newClient;
    });
    this.$root.$on("deletedSaleId", (saleId: number) => {
      const index = this.facture.sales.findIndex((e) => e.id == saleId);
      if (index >= 0) this.facture.sales.splice(index, 1);
    });

    this.getapi();
    this.getFavorites();
    this.displayFav();
  }

  selectedSale = {} as Sale;

  @Watch("facture.sales", { deep: true })
  onChange() {
    this.calcule();
  }

  selectedProductColor(product: Stock): string {
    return HelperFunctions.selectedColor(product);
  }
  @Watch("cartList")
  cahngeFacture() {
    this.facture = this.cartList[this.indexCurrentCart];
  }
  calcule() {
    for (let i = 0; i < this.facture.sales.length; i++) {
      this.facture.sales[i].total = Number(
        (
          Number(this.facture.sales[i].quantity) *
          Number(this.facture.sales[i].sell_price)
        ).toFixed(2)
      );
    }

    this.facture.montant = 0;

    this.facture.sales.forEach((prodct, index) => {
      prodct.count = index + 1;
      this.facture.montant = Number(
        (Number(this.facture.montant) + Number(prodct.total)).toFixed(2)
      );
    });
    if (this.facture.client_id == null) {
      this.facture.pay = this.facture.montant;
    }
    // this.facture.rest = Number(this.facture.montant) - Number(this.facture.pay) - Number(this.facture.remise);
    // this.totalCredit =
    //     (Number(this.facture.montant) + Number((this.facture.client.montant) ?? 0));
  }

  onChangeBarcode(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  clearInput(): void {
    this.search.name = "";
  }
  changeClient(item: Client) {
    // console.log(item);
    // saleModule.setClient(item);
  }
  public addNewFacture(): void {
    this.depot_id = null;

    this.cartList.splice(
      this.indexCurrentCart,
      1,
      this.emptyFacture(this.cartList[this.indexCurrentCart].cartNumber)
    );
    this.facture = this.cartList[this.indexCurrentCart];
    this.assignPointSystem();

    saleModule.setCartList(this.cartList);
    this.indexOlderFacture = 0;
  }
  emptyFacture(cartNumber = 1): Facture {
    return {
      montant: 0,
      pay: 0,
      rest: 0,
      remise: 0,
      sales: [],
      cartName: "السلة",
      cartNumber: cartNumber,
    } as Facture;
  }

  clearCart() {
    saleModule.clearCart();
  }
  createHeaders(keys) {
    return keys.map((key) => ({
      name: key,
      prompt: key,
      width: 24,
      align: "center",
      padding: 0,
    }));
  }
  assignPointSystem(): void {
    this.facture = Object.assign(this.facture, {
      priceToPoint: this.setting.priceToPoint,
      priceFromPoint: this.setting.priceFromPoint,
      pointFromPrice: this.setting.pointFromPrice,
      pointToPrice: this.setting.pointToPrice,
    });
  }

  saveFacture(): void {
    this.loading = true;
    for (let sale of this.facture.sales) {
      sale.depot_id = this.setting.depot_id;
    }
    this.apiFacture
      .saveFacture(this.facture)
      .then((res) => {
        this.loading = false;
        this.addNewFacture();

        PrintPdf.printFacturePdf(this.setting, res["data"], "زبون");
        // PrintPdf.printBon(this.setting, res["data"], "زبون");

        SnackBarModule.setSnackbar({
          text: "تم إضافة الفاتورة بنجاح",
          color: "success",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      })
      .catch((err) => {
        this.loading = false;
        SnackBarModule.setSnackbar({
          text: "خطأ,فشل إضافة الفاتورة",
          color: "red",
          timeout: 3000,
          show: true,
          icon: "mdi-checkbox-marked-circle-outline",
          x: "right",
          y: "top",
        });
      });
  }

  // public selectedPrinter = {} as electron.PrinterInfo;

  listclients = [] as Client[];

  getapi(url?: string) {
    this.api.getAllClients(url).then((data) => {
      // (data as Client[]).forEach((s) => {
      this.listclients = data as Client[];
      // });
    });
  }

  deleteItem(sale: Sale) {
    // const index = this.facture.sales.findIndex((e) => e.id == item.id);
    // saleModule.removeItem(item);
    const index = this.facture.sales.findIndex(
      (e) => e.product_id == sale.product_id
    );
    this.facture.sales.splice(index, 1);
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedSale = item;
    } else {
      row.select(false);
      this.selectedSale = {} as Sale;
    }
  }

  get setting() {
    return settingModule.getSetting;
  }

  search = new Search();
  listStockDepot = [] as ProductDepot[];
  listStock = [] as Stock[];

  listFavorites = [] as Favorite[];
  selectedFav = {} as Favorite;
  getFavorites() {
    this.isLoadingFav = true;
    stockApi
      .getFav()
      .then((response) => {
        this.listFavorites = response.data;
        if (this.listFavorites.length > 0) {
          this.selectedFav = this.listFavorites[0];
        }
        this.isLoadingFav = false;
      })
      .catch((e) => {
        this.isLoadingFav = false;
      });
  }
  manageSearch(): void {
    if (this.setting.depot_id == null || this.setting.depot_id == 0) {
      stockApi
        .getStock(this.search)
        .then((response) => {
          if (response.status == 200) {
            this.listStock = response.data["data"];

            if (this.listStock.length == 1) {
              let stock = this.listStock[0];

              let sale = Object.assign({}, {
                quantity: 1,
                product_id: stock.id,
                name: stock.name,
                sell_price: stock.sell_price,
                barcode: stock.barcode,
                total: stock.sell_price,
                price: stock.price,
                product: stock,
              } as Sale);

              // this.checkQuantity(sale);
              saleModule.addItem(sale);
            } else {
              if (this.listStock.length > 1) {
                this.$root.$emit("searchManageSale", this.search.name);
              } else {
                SnackBarModule.setSnackbar({
                  text: "المنتج غير موجود",
                  color: "error",
                  timeout: 2000,
                  show: true,
                  icon: "mdi-alert-outline",
                  x: "right",
                  y: "top",
                });
              }
            }
          }
          this.search.name = "";
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
    } else {
      stockApi
        .getProductsDepot(this.search)
        .then((response) => {
          if (response.status == 200) {
            this.listStockDepot = response.data["data"];

            if (this.listStockDepot.length == 1) {
              let item = this.listStockDepot[0];
              item.product.quantity = item.quantity;
              let sale = Object.assign({}, {
                quantity: 1,
                product_id: item.product_id,
                name: item.product.name,
                sell_price: item.sell_price
                  ? item.sell_price
                  : item.product.sell_price,
                barcode: item.product.barcode,
                total: item.product.sell_price,
                price: item.product.price,
                product: item.product,
              } as Sale);
              saleModule.addItem(sale);
            } else {
              if (this.listStockDepot.length > 1) {
                this.$root.$emit("searchManageDepot", this.search.name);
              } else {
                SnackBarModule.setSnackbar({
                  text: "المنتج غير موجود",
                  color: "error",
                  timeout: 2000,
                  show: true,
                  icon: "mdi-alert-outline",
                  x: "right",
                  y: "top",
                });
              }
            }
          }
          this.search.name = "";
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
  // checkQuantity(item: any) {
  //   if (item.quantity < 1) {
  //     SnackBarModule.setSnackbar({
  //       text: "الكمية غير متوفرة",
  //       color: "error",
  //       timeout: 2000,
  //       show: true,
  //       icon: "mdi-alert-outline",
  //       x: "right",
  //       y: "top",
  //     });
  //   }
  // }
  getFullPath(photo: string) {
    return this.host + "storage/attachments/" + photo;
  }
}
</script>
<style scoped>
/* ::v-deep tr.v-data-table__selected {
  background: #ffeafc !important;
} */

/*::v-deep table.v-table tbody td {*/
/*  font-size: 20px !important;*/
/*}*/
.v-data-table ::v-deep th {
  font-size: 14px !important;
}

.v-data-table ::v-deep td {
  font-size: 16px !important;
}

/* #facture {
  position: absolute;
  top: -1000px;
  z-index: -10;
} */
#facture {
  /* position: absolute;
  top: -50px;
  z-index: -10; */
}

.border {
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 20px;
  /* background-color: #08080855; */
  background-color: #0d47a1;
  border-color: #f54c14;
  text-decoration: none;
}
::v-deep .centered-input input {
  text-align: center;
}
</style>
