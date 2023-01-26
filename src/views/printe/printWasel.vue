<template>
  <!-- <div> -->
  <v-dialog v-model="dialog" persistent max-width="1000">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn dark :disabled="NewIndex == -1" class="ml-15 mt-4" outlined color="black">
          طباعة وصل
          <v-icon right>mdi-printer</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-row>
        <v-col cols="3"></v-col>
        <v-col cols="6" class="mt-5">
          <v-row class="">
            <v-img
                class="mb-10 ml-15"
                contain
                height="80px"
                width="80px"
                :src="setting.logo"
            ></v-img>
            <h4 class="mb-2 ml-16" style="text-align: center">وصل دفع</h4>
            <v-img
                v-if="previewImage!=null"
                class="mb-10"
                contain
                height="80px"
                width="80px"
                :src="previewImage"
            ></v-img>
          </v-row>
          <v-row class="mt-n10">
            <v-col cols="7"><h4 class="mr-2">العنوان</h4></v-col>

            <v-col cols="5">
              <h4 class="mr-8" style="text-align: right">
                الزبون : {{ name }}
              </h4>
            </v-col>
          </v-row>
          <v-row class="mt-5 mb-5">
            <v-col cols="7"
            ><p class="mr-1">{{ this.setting.address }}</p></v-col
            >
            <v-col cols="5">
              <h4 class="mr-8" style="text-align: right">
                الوقت : {{ this.timeToday }}
                <!-- الوقت : {{ data.date }}  -->
              </h4>
            </v-col>
          </v-row>


          <v-row class="mt-4"></v-row>
          <v-row class="mt-4 mr-2">
            <h4 class="mt-4 mr-5">الوقت : {{ data.date }} </h4>

            <h4 class="mt-4 mr-15">الدفع : {{ data.price }} </h4>
            <h4 class="mt-4 mr-15"> الدين : {{ dayn }} </h4>
          </v-row>
          <v-row class="mt-2">
            <!-- <v-divider></v-divider> -->
            <v-col cols="8"></v-col>
          </v-row>
          <v-col cols="12">
            <v-row class="light-blue darken-3 white--text mt-3">
              <v-col cols="3"></v-col>
              <h4 class="mr-13" style="text-align:left">
                {{ this.setting.remark }}
              </h4>

            </v-row>
          </v-col>
          <h4 class="mt-5 ml-12" style="text-align: center">{{ this.setting.name_store }}</h4>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>
      <v-card v-if="dialog">
        <v-card-actions class="justify-end">
          <v-btn text color="green darken-1" @click="close"> إلفاء</v-btn>
        </v-card-actions>
      </v-card>
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
export default class printWasel extends Vue {
  @Prop() data!: string;
  @Prop() name!: string;
  @Prop() dayn!: number;
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
    this.$root.$on("index1", (Index: number) => {
      this.NewIndex = Index;
    });
    this.getSetting();
  }

  previewImage = null;
  setting = {} as Setting;
  settingApi = new SettingApi();

  getSetting() {
    // this.settingApi.getSetting().then((res) => {
    //   this.setting = res.data;
    //   if (this.setting.logo != null)
    //     this.previewImage = (process.env.VUE_APP_API_URL as string) + (res.data as Setting).logo;

    // });
  }
}
</script>
