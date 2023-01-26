<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="6" md="5" sm="6" lg="3">
        <v-row no-gutters>
          <p
            style="font-size: 1.2rem"
            class="mx-3 mt-2 primary--text font-weight-medium"
          >
            تاريخ البداية
          </p>
          <v-col>
            <c-date-picker
              readonly
              clearable
              placeholder=" أدخل تاريخ البداية  "
              label="تاريخ البداية"
              v-model="dateFrom"
            ></c-date-picker>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" md="5" sm="6" lg="3">
        <v-row no-gutters>
          <p
            style="font-size: 1.2rem"
            class="mx-3 mt-2 primary--text font-weight-medium"
          >
            تاريخ النهاية
          </p>
          <v-col>
            <c-date-picker
              readonly
              clearable
              placeholder=" أدخل تاريخ النهاية  "
              hint="تاريخ النهاية"
              v-model="dateTo"
            ></c-date-picker
          ></v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-btn outlined large color="primary" @click="getAnalytic">
          <v-icon class="mx-2">mdi-check-circle</v-icon>
          موافق
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-2 mt-n2">
      <v-col
        cols="12"
        md="4"
        sm="6"
        lg="2"
        xl="2"
        v-for="(item, i) in items"
        :key="item.title + i"
      >
        <v-card outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 24px"
                class="mb-1 primary--text font-weight-bold"
              >
                {{ item.title }}
              </v-list-item-title>
              <v-list-item-title
                :style="'font-size: 20px;color:' + item.color"
                class="font-weight-bold'"
              >
                {{ item.price }} DA
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar tile size="60">
              <v-avatar :color="item.background" size="60">
                <v-icon :color="item.color" size="40"> {{ item.icon }} </v-icon>
              </v-avatar>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-card elevation="0" rounded="8" outlined class="pa-2">
      <canvas
        id="myChartSchool"
        color="white"
        width="400"
        height="140"
      ></canvas>
    </v-card>
    <v-row class="mt-3">
      <v-col
        ><v-card elevation="0" rounded="8" outlined class="pa-2">
          <canvas
            id="myChartClients"
            color="white"
            width="400"
            height="140"
          ></canvas> </v-card
      ></v-col>
      <v-col
        ><v-card elevation="0" rounded="8" outlined class="pa-2">
          <canvas
            id="myChartProducts"
            color="white"
            width="400"
            height="140"
          ></canvas> </v-card
      ></v-col>
    </v-row>

    <v-row class="my-4">
      <!-- <v-col cols="6">
        <v-card elevation="0" rounded="8" class="pa-2">
          <v-data-table
            item-key="teacher_id"
            elevation="3"
            class="my-4"
            height="350"
            :headers="depotsHeaders"
            :items="listDepots"
            single-select
            hide-default-footer
          >
            <template v-slot:item.depot="{ item }">
              {{ item == null ? "المخزن الرئيسي" : item.name }}
            </template>
          </v-data-table>
        </v-card>
      </v-col> -->
      <v-col cols="5">
        <v-card elevation="0" outlined>
          <v-data-table
            item-key="teacher_id"
            elevation="3"
            height="350"
            :headers="depotsHeaders"
            :items="listDepots"
            single-select
            hide-default-footer
          >
            <template v-slot:item.depot="{ item }">
              {{ item.depot == null ? "المخزن الرئيسي" : item.depot.name }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card elevation="0" outlined>
          <v-data-table
            item-key="teacher_id"
            elevation="3"
            height="350"
            :headers="totalDepotsHeaders"
            :items="inventory"
            single-select
            hide-default-footer
          >
            <template v-slot:item.depot_id="{ item }">
              {{ (item.totalSell - item.total).toFixed(2) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="my-6"></v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import ChartApi from "@/api/chartApi";
import snackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import Chart from "chart.js/auto";

@Component({ components: { CDatePicker, DeleteDialog } })
export default class ChartView extends Vue {
  depotsHeaders = [
    { text: "المخزن", value: "depot" },
    { text: "الفائدة", value: "total" },
  ];

  totalDepotsHeaders = [
    { text: "المخزن", value: "name" },
    { text: "مجموع (سعر البيع)", value: "totalSell" },
    { text: "مجموع (سعر الشراء)", value: "total" },
    { text: "الفائدة المتوقعة", value: "depot_id" },
  ];

  chartApi = new ChartApi();

  chartData = [];
  detailData = [];
  myChart;
  chartStore;
  chartClient;
  chartProduct;
  labels = [];
  datas = [];

  labelsSchool = [];
  datasSchool = [];
  montant = 0;
  clientsDues = 0;
  fournisseursDues = 0;
  productInventory = 0;
  expensesTotal = 0;
  damagesTotal = 0;

  items = [];

  listDepots = [];
  dateFrom = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  )
    .toISOString()
    .substr(0, 10);

  dateTo = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10);

  created() {
    this.getTopClientChart();
    this.getExpenses();
    this.getClientsFournisseursDues();
    this.getProductInventory();
    this.getBenefitPeriod();
    this.getYearMonthChart();
    this.getDepots();
    this.totalDepots();
    // this.getBenefitSchoolPeriod();
  }

  inventory = [];
  totalDepots(): void {
    ChartApi.getTotalDepots().then((res) => {
      this.inventory = res;
    });
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

  getYearMonthChart(): void {
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
              tension: 0.2,
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
              color: "orange",
              font: { size: 24 },
            },
          },
        },
      });
    });
  }

  getTopClientChart(): void {
    this.chartApi.getTopClientsData().then((res) => {
      let labelsClients = res["clients"].labels;
      let listData: [] = res["clients"].data;
      this.chartProducts(res["products"]);
      let datasClients = [];
      listData.forEach((element) => {
        datasClients.push(element);
      });

      const demoCanvas: HTMLCanvasElement = document.getElementById(
        "myChartClients"
      ) as any;

      let ctx = demoCanvas.getContext("2d");

      if (this.chartClient != undefined) {
        this.chartStore.destroy();
      }
      this.chartClient = new Chart(ctx, {
        type: "polarArea",
        data: {
          labels: labelsClients,
          datasets: [
            {
              label: " المبلغ",
              data: datasClients,
              borderWidth: 0,

              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(75, 192, 192)",
                "rgb(255, 205, 86)",
                "rgb(201, 203, 207)",
                "rgb(245, 71, 222)",
                "rgba(74, 255, 16, 1)",
              ],
            },
          ],
        },

        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "أحسن الزبائن",
              fullSize: true,
              color: "orange",
              font: { size: 24 },
            },
          },
        },
      });

      // products chart
    });
  }

  chartProducts(data: any): void {
    let labelsProducts = data.labels;
    let listData: [] = data.data;
    let datas = [];
    listData.forEach((element) => {
      datas.push(element);
    });

    const demoCanvas: HTMLCanvasElement = document.getElementById(
      "myChartProducts"
    ) as any;

    let ctx = demoCanvas.getContext("2d");

    if (this.chartProduct != undefined) {
      this.chartStore.destroy();
    }
    this.chartProduct = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: labelsProducts,
        datasets: [
          {
            label: " المبلغ",
            data: datas,
            borderWidth: 0,
            backgroundColor: [
              "rgba(74, 255, 16, 1)",
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(245, 71, 222)",
              "rgb(201, 203, 207)",
            ],
          },
        ],
      },

      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "أكثر المنتجات ربحا",
            fullSize: true,
            color: "orange",
            font: { size: 24 },
          },
        },
      },
    });
  }

  getBenefitPeriod(): void {
    this.chartApi
      .getBenifitPeriod(this.dateFrom, this.dateTo + " 23:59:50")
      .then((data) => {
        this.montant = Number(data["benefits"]);
        this.items.push({
          title: "المبيعات",
          price: Number(data["sales"]).toFixed(2),
          icon: "mdi-wallet-outline",
          color: "#734900",
          background: "#f7e9d0",
        });

        this.items.push({
          title: "المشتريات",
          price: Number(data["purchases"]).toFixed(2),
          icon: "mdi-cart-plus",
          color: "#fa0563",
          background: "#f5d0de",
        });

        this.items.push({
          title: "الفائدة",
          price: this.montant.toFixed(2),
          icon: "fa-coins",
          color: "#52c234",
          background: "#ddfcd4",
        });
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
      .getExpensesAnalytics(this.dateFrom, this.dateTo + " 23:59:50")
      .then((res) => {
        this.expensesTotal = Number(res["expenses"]["total"]);
        this.damagesTotal = Number(res["damages"]["total"]);
        this.items.push({
          title: "المصاريف",
          price: this.expensesTotal.toFixed(2),
          icon: "mdi-cash-multiple",
          color: "#734b6d",
          background: "#e8daf5",
        });
        this.items.push({
          title: "التالفة",
          price: this.damagesTotal.toFixed(2),
          icon: "mdi-archive-off-outline",
          color: "#ffbf00",
          background: "#fcf2d4",
        });
      });
  }
  getDepots() {
    this.chartApi
      .getBenifitPeriodDepots(this.dateFrom, this.dateTo + " 23:59:59")
      .then((res) => {
        this.listDepots = res;
      });
  }

  getClientsFournisseursDues() {
    this.chartApi.getClientDues().then((res) => {
      this.clientsDues = Number(res["clients"]["total"]);
      this.items.push({
        title: "الكريدي",
        price: this.clientsDues.toFixed(2),
        icon: "mdi-account-multiple-outline",
        color: "#035caa",
        background: "#d7eafa",
      });

      this.fournisseursDues = Number(res["fournisseurs"]["total"]);
      this.items.push({
        title: "الديون",
        price: this.fournisseursDues.toFixed(2),
        icon: "mdi-account-multiple-outline",
        color: "#000000",
        background: "#e0dede",
      });
    });
  }

  getProductInventory() {
    this.chartApi.getProductsInventory().then((res) => {
      this.productInventory = Number(res["total"]);
      this.items.push({
        title: "الجرد",
        price: this.productInventory.toFixed(2),
        icon: "mdi-shape-outline",
        color: "#ec3247",
        background: "#f7dfe2",
      });
      this.items.push({
        title: "الزكاة",
        price: (this.productInventory * 0.025).toFixed(2),
        icon: "mdi-scale-balance",
        color: "#f0f005",
        background: "#f5f5c6",
      });
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
<style lang="css">
.back_color {
  background-color: rgb(248, 248, 248);
}
</style>
