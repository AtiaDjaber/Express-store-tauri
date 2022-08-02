<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="3">
        <c-date-picker
            outlined
            dense
            readonly
            placeholder=" أدخل تاريخ البداية  "
            label="تاريخ البداية"
            v-model="dateFrom"
        ></c-date-picker>
      </v-col>
      <v-col cols="3">
        <c-date-picker
            outlined
            dense
            readonly
            placeholder=" أدخل تاريخ النهاية  "
            label="تاريخ النهاية"
            v-model="dateTo"
        ></c-date-picker>
      </v-col>

      <v-col>
        <v-btn outlined  color="primary" @click="getAnalytic">
          <v-icon class="mx-2"> mdi-check-circle</v-icon>
          موافق
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-2 mt-n2">
      <v-col>
        <v-card
            style="background: linear-gradient(#114b05 ,#52c234)"
            dark
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title style="color: #f4f4fb;font-size: 24px;">
                الفائدة
              </v-list-item-title>
              <v-list-item-title style="color: #c3feb9;font-size: 20px;" class="mb-1">
                {{ montant }} DA
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar
                tile
                size="80"
            ></v-list-item-avatar>
            <v-icon color="#114b05" size="70">
              fa-coins
            </v-icon>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card style="background: linear-gradient(#070c49,#035caa)"
                dark>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title style="color: #f4f4fb;font-size: 24px;" class="mb-1">
                الكريدي
              </v-list-item-title>
              <v-list-item-title style="color: #ccccfc;font-size: 20px;" class="mb-1">
                {{ clientsDues }} DA
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar
                tile
                size="80"
            ></v-list-item-avatar>
            <v-icon color="#000428" size="80">
              mdi-account-multiple-outline
            </v-icon>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card style="background: linear-gradient(#93291E,#ec3247)" dark>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title style="color: #fef6f5;font-size: 24px;" class=" mb-1 ">
                جرد العتاد
              </v-list-item-title>
              <v-list-item-title style="color: #fbc4bf;font-size: 20px;" class=" mb-1">
                {{ productInventory }} DA
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar
                tile
                size="80"
            ></v-list-item-avatar>
            <v-icon color="#93291E" size="80">
              mdi-shape-outline
            </v-icon>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card
            dark
            style="background: linear-gradient(#351e48,#734b6d)">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title style="color: #f6effb;font-size: 24px;" class="mb-1">
                المصاريف
              </v-list-item-title>
              <v-list-item-title style="color: #e1c6fb;font-size: 20px;" class="text-h6 mb-1">
                {{ expensesTotal }} DA
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar
                tile
                size="80"
            ></v-list-item-avatar>
            <v-icon color="#351e48" size="80">
              mdi-cash-multiple
            </v-icon>
          </v-list-item>
          <!--          <v-card-title class="text-h5">-->
          <!--            المصاريف-->
          <!--          </v-card-title>-->
          <!--          <v-card-subtitle> DA {{ expensesTotal }}</v-card-subtitle>-->
        </v-card>
      </v-col>

    </v-row>

    <canvas id="myChartSchool" color="white" width="400" height="140"></canvas>
    <v-row class="my-12"></v-row>
    <!--    <canvas id="myChart" color="white" width="400" height="160"></canvas>-->
    <v-row class="my-6"></v-row>
    <!--   -->
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        <v-toolbar elevation="0" dense dark class="primary">-->
    <!--          <v-toolbar-title>أرباح الأساتذة</v-toolbar-title>-->
    <!--        </v-toolbar>-->
    <!--        &lt;!&ndash; <span>أرباح الأساتذة</span> &ndash;&gt;-->
    <!--        <v-data-table-->
    <!--          item-key="teacher_id"-->
    <!--          elevation="3"-->
    <!--          class="my-1"-->
    <!--          :headers="teachersHeaders"-->
    <!--          :items="attendanceData"-->
    <!--          @click:row="rowClick"-->
    <!--          single-select-->
    <!--          hide-default-footer-->
    <!--        ></v-data-table>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-data-table-->
    <!--          class="my-1"-->
    <!--          elevation="3"-->
    <!--          :headers="profitDetailHeaders"-->
    <!--          :items="detailData"-->
    <!--          hide-default-footer-->
    <!--          single-select-->
    <!--        ></v-data-table>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--   -->

    <div class="container" v-if="false" id="print">
      <h4
          style="margin: 20px; font-size: 22px; text-align: right; color: black"
      >
        <!-- السيد : {{ selectedAttendance.teacherName }} -->
      </h4>
      <div class="row">
        <div class="col-sm"></div>
        <h5 style="margin: 20px; text-align: center; color: black">
          تاريخ النهاية : {{ dateTo }}
        </h5>
        <h5 style="margin: 20px; text-align: center; color: black">
          تاريخ البداية : {{ dateFrom }}
        </h5>
      </div>
      <h5 style="margin: 20px; text-align: center; color: black">
        تفاصيل المبلغ
      </h5>
      <!--      -->
      <!--      <div class="container-fluid" style="font-size: 34px; text-align: right">-->
      <!--        <table class="table table-bordered" style="text-align: right">-->
      <!--          <thead>-->
      <!--            <tr>-->
      <!--              <th>المبلغ</th>-->
      <!--              <th>الفوج</th>-->
      <!--              <th>المادة</th>-->
      <!--            </tr>-->
      <!--          </thead>-->
      <!--          <tbody>-->
      <!--            <tr v-for="(item, index) in detailData" :key="index">-->
      <!--              <td>{{ item.total }}</td>-->
      <!--              <td>{{ item.groupName }}</td>-->
      <!--              <td>{{ item.subjName }}</td>-->
      <!--            </tr>-->
      <!--          </tbody>-->
      <!--        </table>-->
      <!--        <div class="row">-->
      <!--          <h5 style="margin: 20px; text-align: center; color: black">-->
      <!--            المجموع : {{ selectedAttendance.total }}-->
      <!--          </h5>-->
      <!--          <div class="col-sm"></div>-->

      <!--          <h5 style="margin: 20px; text-align: center; color: black"></h5>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    -->
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import ChartApi from "@/api/chartApi";
import snackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import Chart from 'chart.js/auto';

@Component({components: {CDatePicker, DeleteDialog}})
export default class ChartView extends Vue {
  teachersHeaders = [
    {text: "الإسم الكامل", value: "teacherName"},
    {text: "المبلغ", value: "total"},
  ];

  profitDetailHeaders = [
    {text: "المادة", value: "subjName"},
    {text: "الفوج", value: "groupName"},
    {text: "المبلغ", value: "total"},
  ];

  chartApi = new ChartApi();

  chartData = [];
  detailData = [];
  myChart;
  chartStore;
  labels = [];
  datas = [];

  labelsSchool = [];
  datasSchool = [];

  montant = 0;
  clientsDues = 0;
  productInventory = 0;
  expensesTotal = 0;

  dateFrom = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
  ).toISOString().substr(0, 10);


  dateTo = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10);

  created() {
    this.getExpenses();
    this.getClientsDues();
    this.getProductInventory();
    this.getBenefitPeriod();
    this.getYearMonthChart();

    // this.getBenefitSchoolPeriod();
  }

  print() {
    (this as any).$htmlToPaper("print");
  }

  getAnalytic() {
    this.chartApi
        .getTeachersAnalytics(this.dateFrom, this.dateTo + " 23:59:50")
        .then((res) => {
          this.labels = res.labels;
          let listData: [] = res.data;
          this.datas = listData;

          const demoCanvas: HTMLCanvasElement = document.getElementById(
              "myChart"
          ) as any;

          let ctx = demoCanvas.getContext("2d");

          if (this.myChart != undefined) {
            this.myChart.destroy();
          }
          this.myChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: this.labels,
              datasets: [
                {
                  label: " المبلغ",
                  data: this.datas,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(245, 186, 145, 0.6)",
                    "rgba(74, 255, 16, 0.6)",
                    "rgba(16, 59, 255, 0.6)",
                    "rgba(238, 15, 255, 0.6)",
                    "rgba(255, 15, 15, 0.6)",
                    "rgba(243, 255, 15,0.6)",
                    "rgba(75, 192, 192, 0.6)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(245, 186, 145, 1)",
                    "rgba(74, 255, 16, 1)",
                    "rgba(16, 59, 255, 1)",
                    "rgba(238, 15, 255, 1)",
                    "rgba(255, 15, 15, 1)",
                    "rgba(243, 255, 15, 1)",
                    "rgba(75, 192, 192, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: " إحصائية أرباح الأساتذة خلال مدة زمنية",
                  fullSize: true,
                  color: "black",
                  font: {
                    size: 24,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        });
    // this.getTeachers();
    this.getExpenses();
    this.getBenefitPeriod();
    // this.getSchoolChart();
  }

  getYearMonthChart() {
    this.chartApi.getChartData().then((res) => {
      this.labelsSchool = res.labels;
      let listData: [] = res.data;
      this.datasSchool = [];
      listData.forEach((element) => {
        this.datasSchool.push(element);
      });

      const demoCanvas: HTMLCanvasElement = document.getElementById(
          "myChartSchool"
      ) as any;

      let ctx = demoCanvas.getContext("2d");

      if (this.chartStore != undefined) {
        this.chartStore.destroy();
      }
      this.chartStore = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.labelsSchool,
          datasets: [
            {
              fill: true,
              borderDash: [5, 5],
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              label: " المبلغ",
              data: this.datasSchool,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          // animation: {
          //   onProgress: function (animation) {
          //     var c = document.getElementById("myChartSchool");
          //     var ctx = (c as any).getContext("2d");
          //     ctx.font = "22px Verdana";
          //     // Create gradient
          //     var gradient = ctx.createLinearGradient(
          //       0,
          //       0,
          //       (c as any).width,
          //       0
          //     );
          //     gradient.addColorStop("0", "magenta");
          //     gradient.addColorStop("0.5", "blue");
          //     // Fill with gradient
          //     ctx.fillStyle = gradient;
          //     ctx.fillText("أرباح المدرسة خلال سنة", 45, 70);
          //   },
          // },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: " إحصائية الأرباح شهريا",
              fullSize: true,
              color: "black",
              font: {size: 24},
            },
          },
        },
      });
    });
  }

  getBenefitPeriod(): void {
    this.chartApi.getBenifitPeriod(this.dateFrom, this.dateTo + " 23:59:50")
        .then((data) => {
          this.montant = Number(data);
        })
        .catch((error) => {
          snackBarModule.setSnackbar({
            text: error,
            color: "error",
            timeout: 2000,
            show: true,
            icon: "times",
            x: "right",
            y: "top",
          });

        });
  }


  getExpenses() {
    this.chartApi
        .getExpensessAnalytics(this.dateFrom, this.dateTo + " 23:59:50")
        .then((res) => {
          debugger
          this.expensesTotal = Number(res["total"]);
        });
  }


  getClientsDues() {
    this.chartApi
        .getClientDues()
        .then((res) => {
          this.clientsDues = Number(res["total"]);
        });
  }


  getProductInventory() {
    this.chartApi
        .getProductsInventory()
        .then((res) => {
          this.productInventory = Number(res["total"]);
        });
  }

  // rowClick(item
  //              :
  //              any, row
  //              :
  //              any
  // ) {
  //   this.detailData = [];
  //   this.detailData.length = 0;
  //   if (!row.isSelected) {
  //     row.select(true);
  //     //   this.selectedAttendance = item;
  //   } else {
  //     row.select(false);
  //     //   this.selectedAttendance = {};
  //   }
  // }
}
</script>
<style>

</style>
