<template>
  <div>
    <v-tabs class="ma-3">
      <v-tab>
        <v-icon right>mdi-download</v-icon>
        <h3>الكميات المنتهية و المنخفضة</h3>
      </v-tab>
      <v-tab>
        <v-icon right>mdi-calendar</v-icon>
        <h3>الأصناف منتهية الصلاحية</h3>
      </v-tab>

      <v-tab-item class="ma-3">
        <v-btn
          dark
          large
          elevation="0"
          class="ma-2"
          color="primary"
          v-shortkey="['f2']"
          @shortkey="print"
          @click="print"
        >
          طباعة F2
          <v-icon right>mdi-printer-outline</v-icon>
        </v-btn>
        <div v-resize="onResize">
          <v-card outlined
            ><v-data-table
              :headers="quantityHeaders"
              :items="products"
              hide-default-footer
              v-model="selected"
              fixed-header
              show-select
              :height="windowSize.y - 210"
              item-key="id"
              :items-per-page="-1"
            >
              <template v-slot:item.count="{ item, index }">
                <span>{{ index + 1 }}</span>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </v-tab-item>

      <v-tab-item class="ma-3">
        <div v-resize="onResize">
          <v-card outlined>
            <v-data-table
              :headers="expireHeaders"
              :items="expireProducts"
              hide-default-footer
              fixed-header
              :height="windowSize.y - 180"
              item-key="count"
              :items-per-page="-1"
              show-select
            >
              <template v-slot:item.count="{ item, index }">
                <span>{{ index + 1 }}</span>
              </template>
            </v-data-table>
          </v-card>
        </div></v-tab-item
      >
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CDatePicker from "@/components/CDatePicker.vue";

import NotificationApi from "@/api/notificationApi";

import Search from "@/classes/search";
import Stock from "@/classes/stock";
import PrintImage from "@/print/print_image";
import settingModule from "@/store/settingModule";

@Component({ components: { CDatePicker } })
export default class NotificationView extends Vue {
  search = new Search();
  quantityHeaders = [
    { text: "#", value: "count" },
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
  ];
  expireHeaders = [
    { text: "#", value: "count" },
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "نهاية الصلاحية", value: "date_expire" },
  ];

  selected = [];
  products: Stock[] = [];
  expireProducts: Stock[] = [];
  windowSize = { x: 0, y: 0 };

  print(): void {
    // console.log(this.selected);
    let printHeader = [
      {
        dataKey: "name",
        header: "الصنف",
      },
    ];
    PrintImage.printGenericFacturePdf(
      printHeader,
      this.selected.length > 0 ? this.selected : this.products,
      "المنتجات المنتهية و المنخفضة",
      [],
      settingModule.getSetting
    );
  }

  created(): void {
    this.getNotifications();
  }

  getNotifications(): void {
    NotificationApi.getNotificationsApi().then((res) => {
      this.products = res.data["quantityProducts"];
      this.expireProducts = res.data["expireProducts"];
      console.log(res);
    });
  }

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
}
</script>
<style>
.v-card.borderme {
  border: 2px solid #f54c14 !important;
}

.v-card.borderout {
  border: 1px solid #bcaaa4 !important;
}
#file_cam {
  color: rgb(69 175 26 / 89%);
}
/* #my-table {  position: absolute; y: -10000; } */
</style>
