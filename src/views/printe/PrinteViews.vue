<template>
  <!-- <div> -->
  <v-dialog v-model="dialog" persistent max-width="1300">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn outlined>
          طباعة الفاتورات
          <v-icon right>mdi-printer</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-row>
        <v-col cols="3"></v-col>
        <v-col cols="6" class="mt-5">
          <!-- <h4 class="mb-2 ml-16" style="text-align: center">
            {{ this.setting.name_store }}
          </h4> -->
          <v-row class="">
            <v-img
              v-if="previewImage != null"
              class="mb-10 ml-15"
              contain
              height="80px"
              width="80px"
              :src="previewImage"
            ></v-img>
            <h4 class="mb-2 ml-16" style="text-align: center">
              {{ this.setting.name_store }}
            </h4>
          </v-row>
          <v-row class="mt-n10">
            <v-col cols="7"> <h4 class="mr-2">العنوان</h4></v-col>

            <v-col cols="5">
              <h4 class="mr-13" style="text-align: right">
                الزبون : {{ name }}
              </h4>
              <!-- <h4 class="mr-8" style="text-align: right">الزبون : {{ this.setting.name_store }}</h4> -->
            </v-col>
          </v-row>
          <v-row class="mt-5 mb-5">
            <v-col cols="7"
              ><p class="mr-1">{{ this.setting.address }}</p></v-col
            ><v-col cols="5">
              <h4 class="mr-13" style="text-align: right">
                الوقت : {{ this.timeToday }}
              </h4>
            </v-col>
          </v-row>
          <v-data-table
            :headers="FactureHeaders"
            :items="data"
            hide-default-footer
            class="elevation-0 mt-1"
          >
          </v-data-table>

          <v-row class="mt-4"> </v-row>
          <!-- <p class="mt-4">المجموع :120</p>
          <p>التخفيض :20</p> -->
          <!-- <v-row class="mt-2">
            <v-divider></v-divider>
            <v-col cols="8"></v-col>
          </v-row> -->
          <v-row class="light-blue darken-3 white--text">
            <!-- <p class="mr-4">المجموع : 100</p> -->
            <v-col cols="4"></v-col>
            <h4 class="mr-5" style="text-align: center">
              {{ this.setting.remark }}
            </h4>
          </v-row>
          <v-row class="mt-4">
            <v-col cols="4"></v-col>
            <h4 class="mr-4" style="text-align: center">
              {{ this.setting.tel }}
            </h4>
          </v-row>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-card v-if="dialog">
        <v-card-actions class="justify-end mt-4">
          <v-btn text color="green darken-1" @click="close"> إلفاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
  <!-- </div> -->
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Setting } from "@/classes/setting";
import SettingApi from "@/api/setting_api";

@Component({
  components: {},
})
export default class PrinteViews extends Vue {
  FactureHeaders = [
    { text: "الرقم", value: "id", class: "light-blue darken-3 white--text " },

    {
      text: "المبلغ",
      value: "montant",
      class: "light-blue darken-3 white--text ",
    },

    { text: "الدفع", value: "pay", class: "light-blue darken-3 white--text " },
    {
      text: "الباقي",
      value: "rest",
      class: "light-blue darken-3 white--text ",
    },

    {
      text: "تخفيض",
      value: "remise",
      class: "light-blue darken-3 white--text ",
    },
    {
      text: "تاريخ",
      value: "created_at",
      class: "light-blue darken-3 white--text ",
    },
  ];
  Headers = [
    {
      text: "المصروف",
      value: "name",
      class: "light-blue darken-3 white--text ",
    },
    {
      text: "السعر",
      value: "calories",
      class: "light-blue darken-3 white--text ",
    },
    {
      text: "التاريخ",
      value: "carbs",
      class: "light-blue darken-3 white--text ",
    },
    { text: "ملاحظة", value: "fat", class: "light-blue darken-3 white--text " },
  ];
  @Prop() data!: string;
  @Prop() name!: string;

  public dialog = false;
  close() {
    this.dialog = false;
  }

  // listexpense = [] as Expense[];

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

    this.getSettingData();
  }

  previewImage = null;
  setting = {} as Setting;
  settingApi = new SettingApi();

  getSettingData() {
    // this.settingApi.getSetting().then((res) => {
    //   this.setting = res.data;
    //   if (this.setting.logo != null)
    //     this.previewImage = (process.env.VUE_APP_API_URL as string) + (res.data as Setting).logo;
    // });
  }
}
</script>
