<template>
  <div>
    <v-tabs class="ma-3">
      <v-tab>
        <v-icon right>mdi-download</v-icon>
        الكميات المنتهية و المنخفضة
      </v-tab>
      <v-tab>
        <v-icon right>mdi-calendar</v-icon>
        الأصناف منتهية الصلاحية
      </v-tab>

      <v-tab-item class="ma-3">
        <div v-resize="onResize">
          <v-card elevation="0" outlined
            ><v-data-table
              :headers="quantityHeaders"
              :items="prodcuts"
              hide-default-footer
              fixed-header
              :height="windowSize.y - 180"
              item-key="count"
              :items-per-page="-1"
              single-select
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
          <v-card elevation="0" outlined>
            <v-data-table
              :headers="expireHeaders"
              :items="expireProdcuts"
              hide-default-footer
              fixed-header
              :height="windowSize.y - 180"
              item-key="count"
              :items-per-page="-1"
              single-select
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

@Component({ components: { CDatePicker } })
export default class NotificationView extends Vue {
  search = new Search();
  quantityHeaders = [
    { text: "#", value: "count" },
    { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
  ];
  expireHeaders = [
    { text: "#", value: "count" },
    { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "نهاية الصلاحية", value: "date_expire" },
  ];
  prodcuts: Stock[] = [];
  expireProdcuts: Stock[] = [];
  created() {
    this.getNotifications();
  }
  getNotifications(): void {
    NotificationApi.getNotificationsApi().then((res) => {
      this.prodcuts = res.data["quantityProducts"];
      this.expireProdcuts = res.data["expireProducts"];
      console.log(res);
    });
  }
  windowSize = { x: 0, y: 0 };

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