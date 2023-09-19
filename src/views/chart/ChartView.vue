<template>
  <div class="pa-3">
    <v-row class="mt-2">
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
          <v-icon class="mx-2">mdi-check-circle-outline</v-icon>
          موافق
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-2 mt-n2">
      <!-- :style="$vuetify.breakpoint.mdAndUp ? ' flex: 1 0 18%;' : ''" -->
      <v-col
        cols="12"
        md="4"
        sm="6"
        lg="3"
        xl="2"
        v-for="(item, i) in items"
        :key="item.title + i"
      >
        <v-card outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 21px"
                class="mb-1 grey--text text--darken-1"
              >
                {{ item.title }}
              </v-list-item-title>
              <v-list-item-title
                :style="'font-family:Cairo-semi;font-size: 20px;'"
              >
                {{
                  item.displayCurrency == false
                    ? item.price
                    : formatCurrency(item.price, true)
                }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar tile size="60">
              <v-avatar :color="item.background" size="60">
                <v-icon :color="item.color" size="30"> {{ item.icon }} </v-icon>
              </v-avatar>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-card elevation="0" rounded="8" outlined class="pa-2">
      <canvas id="myChartDays" color="white" width="400" height="140"></canvas>
    </v-card>
    <v-card elevation="0" rounded="8" outlined class="pa-2 mt-3">
      <canvas id="myChartYears" color="white" width="400" height="140"></canvas>
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
            <template v-slot:[`item.total`]="{ item }">
              {{ formatCurrency(item.total, true) }}
            </template>
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
            <template v-slot:[`item.total`]="{ item }">
              {{ formatCurrency(item.total, true) }}
            </template>
            <template v-slot:[`item.totalSell`]="{ item }">
              {{ formatCurrency(item.totalSell, true) }}
            </template>
            <template v-slot:item.depot_id="{ item }">
              {{ formatCurrency(item.totalSell - item.total, true) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-6"></v-row>
    <v-row>
      <v-col cols="5">
        <v-card elevation="0" outlined>
          <v-data-table
            item-key="id"
            elevation="3"
            height="350"
            :headers="expenseHeaders"
            :items="expenses"
            single-select
            hide-default-footer
          >
            <template v-slot:[`item.total`]="{ item }">
              {{ formatCurrency(item.total, true) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
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

  expenseHeaders = [
    { text: "الفئة", value: "name" },
    { text: "المبلغ", value: "total" },
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
  chartDays;
  chartClient;
  chartProduct;
  labels = [];
  datas = [];

  labelsMonths = [];
  dataMonths = [];
  labelsDays = [];
  dataDays = [];
  montant = 0;
  clientsDues = 0;
  fournisseursDues = 0;
  // productInventory = 0;
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

  expenses = [];
  created() {
    this.getTopClientChart();
    this.getExpenses();
    this.getClientsFournisseursDues();
    this.getProductInventory();
    this.getYearMonthChart();
    this.getDepots();
    this.totalDepots();
    this.getDaysChart();
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
    this.items = [];
    this.getExpenses();
    this.getClientsFournisseursDues();
    this.getProductInventory();
    this.getDaysChart();
  }

  getYearMonthChart(): void {
    ChartApi.getChartData().then((res) => {
      this.labelsMonths = res.labels;
      this.dataMonths = res.data;

      const demoCanvas: HTMLCanvasElement = document.getElementById(
        "myChartYears"
      ) as any;

      let ctx = demoCanvas.getContext("2d");

      if (this.chartStore != undefined) {
        this.chartStore.destroy();
      }
      this.chartStore = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.labelsMonths,
          datasets: [
            {
              fill: true,
              borderDash: [5, 5],
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              label: " المبلغ",
              data: this.dataMonths,
              borderWidth: 1,
              tension: 0.2,
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

  getDaysChart(): void {
    ChartApi.getDaysChart(this.dateFrom, this.dateTo + " 23:59:50").then(
      (res) => {
        this.labelsDays = res.labels;
        this.dataDays = res.data;

        const demoCanvas: HTMLCanvasElement = document.getElementById(
          "myChartDays"
        ) as any;

        let ctx = demoCanvas.getContext("2d");

        if (this.chartDays != undefined) {
          this.chartDays.destroy();
        }
        this.chartDays = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.labelsDays,
            datasets: [
              {
                fill: true,
                borderDash: [5, 5],
                backgroundColor: "rgba(247, 88, 15, 0.2)",
                borderColor: "rgba(247, 88, 15, 1)",
                label: " المبلغ",
                data: this.dataDays,
                borderWidth: 1,
                tension: 0.3,
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
                text: " إحصائية الأرباح يوميا",
                fullSize: true,
                color: "orange",
                font: { size: 24 },
              },
            },
          },
        });
      }
    );
  }
  getTopClientChart(): void {
    ChartApi.getTopClientsData().then((res) => {
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
    ChartApi.getBenifitPeriod(this.dateFrom, this.dateTo + " 23:59:50")
      .then((data) => {
        this.expenses = data["expensesCategories"];
        console.log(this.expenses);
        this.montant = Number(data["benefits"]);
        this.items.push({
          title: "المبيعات",
          price: Number(data["sales"]),
          icon: "mdi-wallet-outline",
          color: "#734900",
          background: "#f7e9d0",
        });

        this.items.push({
          title: "عدد المبيعات",
          price: Number(data["countFactures"]),
          icon: "mdi-order-numeric-ascending",
          color: "#A459D1",
          background: "#dfb7f7",
          displayCurrency: false,
        });
        this.items.push({
          title: "المشتريات",
          price: Number(data["purchases"]),
          icon: "mdi-cart-plus",
          color: "#fa0563",
          background: "#f5d0de",
        });

        this.items.push({
          title: "عدد المشتريات",
          price: Number(data["countPurchases"]),
          icon: "mdi-order-numeric-ascending",
          color: "#4c4c6d",
          background: "#a7a7c9",
          displayCurrency: false,
        });

        this.items.push({
          title: "الفائدة",
          price: this.montant,
          icon: "fa-coins",
          color: "#52c234",
          background: "#ddfcd4",
        });
        this.items.push({
          title: "الخسائر",
          price: this.lossesTotal,
          icon: "fa-coins",
          color: "#8f1f2c",
          background: "#f7dfe2",
        });
        this.items.push({
          title: "الفائدة الصافية",
          price: this.montant - this.lossesTotal,
          icon: "mdi-lightbulb-on-outline",
          color: "#0397aa",
          background: "#caf7fc",
        });
        this.items.push({
          title: "مبلغ التخفيضات",
          price: Number(data["discountFactures"]),
          icon: "mdi-percent",
          color: "#d17524",
          background: "#ffe2c9",
          displayCurrency: false,
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

  lossesTotal = 0;
  getExpenses() {
    ChartApi.getExpensesAnalytics(
      this.dateFrom,
      this.dateTo + " 23:59:50"
    ).then((res) => {
      this.getBenefitPeriod();

      this.expensesTotal = Number(res["expenses"]["total"]);
      this.damagesTotal = Number(res["damages"]["total"]);
      this.lossesTotal = this.expensesTotal + this.damagesTotal;

      this.items.push({
        title: "المصاريف",
        price: this.expensesTotal,
        icon: "mdi-cash-multiple",
        color: "#734b6d",
        background: "#e8daf5",
      });
      this.items.push({
        title: "التالفة",
        price: this.damagesTotal,
        icon: "mdi-archive-off-outline",
        color: "#ffbf00",
        background: "#fcf2d4",
      });
    });
  }
  getDepots() {
    ChartApi.getBenifitPeriodDepots(
      this.dateFrom,
      this.dateTo + " 23:59:59"
    ).then((res) => {
      this.listDepots = res;
    });
  }
  formater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
  });
  getClientsFournisseursDues() {
    ChartApi.getClientDues().then((res) => {
      this.clientsDues = Number(res["clients"]["total"]);
      this.items.push({
        title: "الكريدي",
        price: this.clientsDues,
        icon: "mdi-account-multiple-outline",
        color: "#035caa",
        background: "#d7eafa",
      });

      this.fournisseursDues = Number(res["fournisseurs"]["total"]);
      this.items.push({
        title: "الديون",
        price: this.fournisseursDues,
        icon: "mdi-account-multiple-outline",
        color: "#000000",
        background: "#e0dede",
      });
    });
  }

  getProductInventory() {
    ChartApi.getProductsInventory().then((res) => {
      const productInventory = Number(res["inventory"]["total"]);
      const productInventorySell = Number(res["inventorySell"]["total"]);
      this.items.push({
        title: "الجرد",
        price: productInventory,
        icon: "mdi-shape-outline",
        color: "#ec3247",
        background: "#f7dfe2",
      });
      this.items.push({
        title: "الجرد(سعر البيع) ",
        price: productInventorySell,
        icon: "mdi-shape-outline",
        color: "#ec3247",
        background: "#f7dfe2",
      });
      this.items.push({
        title: "الزكاة",
        price: productInventory * 0.025,
        icon: "mdi-scale-balance",
        color: "#b8b818",
        background: "#f5f5c6",
      });
    });
  }
}
</script>
<style lang="css">
.back_color {
  background-color: rgb(248, 248, 248);
}
@media (min-width: 1264px) and (max-width: 1903px) {
  .flex.lg5-custom {
    width: 20%;
    max-width: 20%;
    flex-basis: 20%;
  }
}

@media (min-width: 1064px) and (max-width: 1903px) {
  .flex.lg5-custom {
    width: 18%;
    max-width: 18%;
    flex-basis: 20%;
  }
}
</style>
