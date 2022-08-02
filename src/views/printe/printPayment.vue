<template>
  <!-- <div> -->
  <v-dialog v-model="dialog" persistent max-width="1300">
<!--    <template v-slot:activator="{ on, attrs }">-->
<!--      <div v-bind="attrs" v-on="on">-->
<!--        <v-btn class="ml-7 mt-4" outlined>-->
<!--          طباعة كل دفعات-->
<!--          <v-icon right>mdi-printer</v-icon>-->
<!--        </v-btn>-->
<!--      </div>-->
<!--    </template>-->
    <v-card v-if="dialog">
      <v-row>
        <v-col cols="3"></v-col>
        <v-col cols="6" class="mt-5">
          <!-- <h4 class="mb-2 ml-14" style="text-align: center">وصل دفع</h4> -->
          <v-row class="">
            <v-img
              class="mb-10 ml-15"
              contain
              height="80px"
              width="80px"
              src="@/assets/Webp.net-resizeimage.png"
            ></v-img>
            <h4 class="mb-2 ml-15" style="text-align: center">وصل دفع</h4>
            <v-img
              class="mb-10 ml-10"
              contain
              height="80px"
              width="80px"
              src="@/assets/Webp.net-resizeimage.png"
            ></v-img>
          </v-row>
          <v-row class="mt-n10">
            <v-col cols="7"> <h4 class="mr-2">العنوان</h4></v-col>

            <v-col cols="5">
              <h4 class="mr-15" style="text-align: right">
                الزبون : {{ name }}
              </h4>
            </v-col>
          </v-row>
          <v-row class="mt-5 mb-5">
            <v-col cols="7"
              ><p class="mr-1">{{ this.setting.address }}</p></v-col
            ><v-col cols="5">
              <h4 class="mr-15" style="text-align: right">
                الوقت : {{ this.timeToday }}
              </h4>
            </v-col>
          </v-row>
          <v-data-table
            :headers="SaleHeaders"
            :items="data"
            hide-default-footer
            class="elevation-0"
          >
          </v-data-table>

          <v-row class="mt-4"> </v-row>
          <p class="mt-4">المجموع :120</p>
          <p>التخفيض :20</p>
          <v-row class="mt-2">
            <v-divider></v-divider>
            <v-col cols="8"></v-col>
          </v-row>
          <v-row class="light-blue darken-3 white--text">
            <p class="mr-4">المجموع : 100</p>
            <v-col cols="8"></v-col>
            <h4 class="mr-2" style="text-align: center">
              {{ this.setting.remark }}
            </h4>
          </v-row>
          <h4 class="mt-5 ml-5" style="text-align: center">
            {{ this.setting.name_store }}
          </h4>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-card v-if="dialog">
        <v-card-actions class="justify-end">
          <v-btn text color="green darken-1" @click="close"> إلفاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
  <!-- </div> -->
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import settingModule from "@/store/settingModule";

@Component({
  components: {},
})
export default class printPayment extends Vue {
  SaleHeaders = [
    {
      text: "التاريخ",
      value: "date",
      class: "light-blue darken-3 white--text",
    },
    { text: "السعر", value: "price", class: "light-blue darken-3 white--text" },
  ];

  @Prop() data!: string;
  @Prop() name!: string;
  public dialog = false;

  close() {
    this.dialog = false;
  }
  get setting(){
    return settingModule.getSetting;
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

  }


}
</script>
