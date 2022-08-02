<template>
  <!-- <div> -->
  <v-dialog scrollable v-model="dialog" persistent max-width="1100px">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn
            dark
            :disabled="NewIndex == -1"
            outlined
            class="ml-3"
            color="black">
          طباعة فاتورة
          <v-icon right>mdi-printer</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">

      <div class="pa-3" style="width: 1100px">
        <v-row no-gutters class="mt-6">
          <v-col cols="5">
            <v-row no-gutters>
              <!--              <v-col cols="3">-->
              <v-img
                  v-if="previewImage!=null"
                  height="80px"
                  contain
                  width="80px"
                  :src="previewImage">
              </v-img>

              <!--              </v-col>-->
              <!--              <v-col  >-->
              <h4 style="text-align: right">
                {{ this.setting.name_store }}
              </h4>

              <!--              </v-col>-->

            </v-row>
            <p class="mr-2">
              <v-icon>mdi-map-marker-outline</v-icon>
              {{ this.setting.address }}
            </p>
            <p class="mr-2">
              <v-icon> mdi-phone-outline</v-icon>
              {{ this.setting.tel }}
            </p>
          </v-col>
          <v-divider vertical></v-divider>
          <!--          العمود الثاتي-->
          <v-col class="mr-6 ">
            <v-row justify="center">
              <h1>فاتورة بيع</h1>
            </v-row>

            <p class="mt-6">
              <!-- رقم الفاتورة : {{ this.FactureNumber }} -->
              رقم الفاتورة : {{ this.data.id }}
            </p>
            <p>
              الزبون : {{ name }}
            </p>
            <p>
              التاريخ : {{ this.timeToday }}
            </p>
          </v-col>
        </v-row>
        <v-data-table
            :headers="SaleHeaders"
            :items="data.sales"
            disable-sort
            hide-default-footer
            class="elevation-0 mt-5">

        </v-data-table>

        <v-row class="mt-4"></v-row>

        <p class="mt-4 mr-2" style="text-align: left">المدفوع : {{ this.data.pay }}</p>
        <p class="mr-2">التخفيض : {{ this.data.remise }}</p>
        <p class="mr-2">الباقي : {{ this.data.rest }}</p>

        <v-row class="light-blue darken-3 white--text mx-1">
          <h4 class="mr-2">المجموع : {{ this.data.montant }}</h4>
          <v-col cols="6"></v-col>
          <h4 class="mr-2" style="text-align: left">
            {{ this.setting.remark }}
          </h4>
        </v-row>
      </div>

      <v-card-actions class="justify-end">
        <v-btn text color="green darken-1" @click="close"> إلفاء</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- </div> -->
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";
import {Setting} from "@/classes/setting";
import SettingApi from "@/api/setting_api";

@Component({
  components: {},
})
export default class printeDetailFacture extends Vue {
  SaleHeaders = [
    {text: "الصنف", value: "name", class: "light-blue darken-3 white--text"},
    {text: "الكمية", value: "quantity", class: "light-blue darken-3 white--text"},
    {text: "السعر", value: "price", class: "light-blue darken-3 white--text",},
    {text: "المبلغ الاجمالي", value: "total", class: "light-blue darken-3 white--text",},
  ];

  @Prop() data!: any;
  @Prop() name!: string;
  NewIndex = -1;
  public dialog = false;

  close() {
    this.dialog = false;
  }

  printInformation = {} as any;
  today = new Date();
  month: any;
  year: any;
  date: any;
  timeToday: any;

  created() {
    this.month = this.today.getMonth() + 1;
    this.year = this.today.getFullYear();
    this.date = this.today.getDate();
    this.timeToday = `${this.date}/${this.month}/${this.year}`;
    this.$root.$on("setting", (setting: any) => {
      this.printInformation = setting;
    });

    this.$root.$on("index", (Index: number) => {
      this.NewIndex = Index;
    });

    this.getSetting();
  }

  previewImage = null;
  setting = {} as Setting;
  settingApi = new SettingApi();

  getSetting() {
    this.settingApi.getSetting().then((res) => {
      this.setting = res.data;
      if (this.setting.logo != null)
        this.previewImage = (process.env.VUE_APP_API_URL as string) + (res.data as Setting).logo;

    });
  }
}
</script>
