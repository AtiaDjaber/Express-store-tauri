<template>
  <div id="facture" class="pa-3" style="width: 1000px">
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
            <v-col cols="3">
              <v-img
                class="mt-n6"
                style="align: right"
                v-if="previewImage != null"
                height="100px"
                width="100px"
                contain
                :src="previewImage"
              >
              </v-img>
            </v-col>
            <v-col>
              <v-row>
                <p class="mr-2">
                  <v-icon>mdi-map-marker-outline</v-icon>
                  {{ setting.address }}
                </p>
              </v-row>
              <v-row>
                <p class="mr-2">
                  <v-icon> mdi-phone-outline</v-icon>
                  {{ setting.tel }}
                </p>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
      <v-divider vertical></v-divider>
      <!--          العمود الثاتي-->
      <!--        data-html2canvas-ignore-->
      <v-col class="mr-6">
        <v-row justify="center" class="mb-2">
          <h2>فاتورة بيع</h2>
        </v-row>
        <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
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
    <p class="mt-4 mr-2">المدفوع : {{ facture.pay }}</p>
    <p class="mr-2">التخفيض : {{ facture.remise }}</p>
    <p class="mr-2">الباقي : {{ facture.rest }}</p>

    <v-row class="light-blue darken-3 white--text mx-1 my-1 py-2">
      <h4 class="mr-2">المجموع : {{ facture.montant }}</h4>
      <v-col cols="6"></v-col>
      <h4 class="mr-2" style="text-align: left">
        {{ setting.remark }}
      </h4>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import VueBarcode from "vue-barcode";
import html2canvas, { Options } from "html2canvas";

import { Setting } from "@/classes/setting";
import SettingApi from "@/api/setting_api";
import saleModule from "@/store/saleModule";

@Component({
  components: {
    barcode: VueBarcode,
  },
})
export default class FacturePrint extends Vue {
  all = -1;
  Headers = [
    { text: "#", value: "count" },
    // { text: "باركود", value: "barcode" },
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    { text: "السعر", value: "sell_price" },
    { text: "المبلغ الإجمالي", value: "total" },
    { text: "", value: "actions" },
  ];

  totalCredit = 0;
  // facture = {montant: 0, sales: []} as any;
  previewImage = null;
  setting = {} as Setting;
  settingApi = new SettingApi();

  get facture() {
    return saleModule.getFacture;
  }

  created() {
    // this.facture = saleModule.getFacture;
    this.getSetting();
    this.$on("facturePrint", (facture: any) => {
      // this.facture=facture;
    });
  }

  getSetting() {
    this.settingApi.getSetting().then((res) => {
      this.setting = res.data;
      if (this.setting.logo != null)
        this.previewImage =
          (process.env.VUE_APP_API_URL as string) + (res.data as Setting).logo;
    });
  }
}
</script>
<style scoped>
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}

/*::v-deep table.v-table tbody td {*/
/*  font-size: 20px !important;*/
/*}*/
.v-data-table ::v-deep th {
  font-size: 14px !important;
}

.v-data-table ::v-deep td {
  font-size: 16px !important;
}

#facture {
  position: absolute;
  top: -100px;
  z-index: -10;
}

.border {
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 20px;
  background-color: #0d47a1;
  border-color: #f54c14;
  text-decoration: none;
}
</style>
