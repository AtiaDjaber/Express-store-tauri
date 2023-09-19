<template>
  <div>
    <v-row class="mr-1 mt-2">
      <!--      <printe :data="FactureData" :name="namefournisseur" />-->
      <v-col cols="5">
        <v-text-field
          solo
          flat
          append-icon="fa-search"
          clearable
          hint="البحث باسم الصنف او الباركود"
          placeholder="اكتب اسم الصنف او الباركود"
          :value="search.name"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <c-date-picker
          v-model="search.from"
          hint="تاريخ البداية"
          placeholder="تاريخ البداية"
          clearable
          @eventname="clearFrom"
        ></c-date-picker>
      </v-col>

      <v-col>
        <c-date-picker
          solo
          flat
          @eventname="clearTo"
          v-model="search.to"
          hint="تاريخ النهاية"
          placeholder="تاريخ النهاية"
          clearable
        ></c-date-picker>
      </v-col>
      <!-- <printeDeatail :data="DataSales" :name="namefournisseur" :FactureNumber="FactureNumber"/> -->
      <!--      <printeDeatail :data="facture" :name="namefournisseur" />-->
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="FactureHeaders"
        :items="FactureData"
        single-select
        item-key="id"
        @click:row="rowClick"
        show-expand
        single-expand
        :server-items-length="count"
        @update:options="paginate"
        class="elevation-0 mt-3"
        :footer-props="{
          'items-per-page-options': [10, 10],
          'show-current-page': true,
          'show-first-last-page': true,
          'page-text': 'رقم الصفحة',
          'items-per-page-text': 'عدد الأسطر',
        }"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <delete-dialog
              :id="item.id"
              :disabled="false"
              :source="'CommandFournisseur'"
            />
            <v-btn
              class="ms-2"
              fab
              outlined
              small
              v-bind="attrs"
              v-on="on"
              @click="print"
              color="primary"
            >
              <v-icon>mdi-printer-outline</v-icon>
            </v-btn>
          </v-row>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="mt-3">
              <!-- <v-alert color="primary" dense type="info" border="left" text>{{
                item.remark ? item.remark : "لا توجد ملاحظة"
              }}</v-alert> -->
              <v-data-table
                :headers="SaleHeaders"
                :items="item.items_command_fournisseur"
                item-key="id"
                class="elevation-1 headers-grey mb-3"
                color="red"
                :items-per-page="-1"
                single-select
                hide-default-footer
              >
                <template v-slot:[`item.actions`]="{ item }"> </template>
              </v-data-table>
            </div>
          </td>
        </template>
        <!-- <div class="mt-3 "></div> -->
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import fournisseurModule from "@/store/fournisseurModule";
import snackBarModule from "@/store/snackBarModule";
import CDatePicker from "@/components/CDatePicker.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Fournisseur from "@/classes/fournisseur";
import Sale from "@/classes/sale";
import printe from "@/views/printe/PrinteViews.vue";
import printeDeatail from "@/views/printe/printeDetailFacture.vue";
import Search from "@/classes/search";

import settingModule from "@/store/settingModule";

import ReturnDialog from "@/components/custom_dialogs/ReturnDialog.vue";
import historyApi from "@/api/historyApi";
import Decoded from "@/helper/decode";
import PrintComponent from "@/components/PrintComponent.vue";
import CommandFournisseur from "@/classes/CommandFournisseur";
import commandFournisseurModule from "@/store/commandFournisseurModule";
import PrintImage from "@/print/print_image";
import { Debounce } from "vue-debounce-decorator";

@Component({
  components: {
    DeleteDialog,
    PrintComponent,
    CDatePicker,
    printe,
    printeDeatail,
    ReturnDialog,
  },
})
export default class CommandFournisseurView extends Vue {
  FactureHeaders = [
    { text: "#", value: "id" },
    { text: "تاريخ", value: "created_at" },
    // { text: "ملاحظة", value: "remark" },
    { text: "العمليات", value: "actions" },
    { text: "", value: "data-table-expand" },
  ];

  SaleHeaders = [
    { text: "الصنف", value: "name" },
    { text: "الكمية", value: "quantity" },
    // { text: "العمليات", value: "actions" },
  ];

  search = new Search();

  @Ref() menu!: any;
  menuState = false;
  date = "";

  save(date: string) {
    this.menu.save(date);
  }

  count = 0;
  fournisseurMontant: number;
  newitem = {} as Fournisseur;
  FactureData = [] as CommandFournisseur[];
  sales = [] as Sale[];
  namefournisseur: any = "";
  index: any;

  editFacture(facture: CommandFournisseur): void {
    let newFacture = Object.assign({}, facture);
    commandFournisseurModule.setFacture(newFacture);
    this.$router.push({ path: "/command_fournisseur" });
  }

  created() {
    this.$root.$on("fournisseurId", (item: Fournisseur) => {
      this.namefournisseur = item.name;
      this.search.fournisseur_id = item.id;
    });

    this.$root.$on("CommandFournisseurId", (result: any) => {
      if (result) {
        this.FactureData.splice(
          this.FactureData.indexOf(
            this.FactureData.find((c) => c.id == result.id) ?? ({} as any)
          ),
          1
        );
      }
    });
  }

  facture = {} as CommandFournisseur;

  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
      this.facture = item;
      this.index = row.index;
      this.$root.$emit("index", this.index);
    } else {
      this.index = -1;
      this.$root.$emit("index", this.index);
      row.select(false);
    }
  }

  onChangeBarcode(text: any): void {
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }
  clearInput(): void {
    this.search.name = "";
  }

  print(command: CommandFournisseur): void {
    let printHeader = [
      {
        dataKey: "quantity",
        header: "الكمية",
      },
      {
        dataKey: "name",
        header: "الصنف",
      },
    ];
    PrintImage.printGenericFacturePdf(
      printHeader,
      command.items_command_fournisseur,
      "طلب شراء",
      [["المورد: " + command.fournisseur.name]],
      settingModule.getSetting
    );
  }
  @Watch("search", { deep: true })
  filterData(): void {
    this.getCommands();
  }

  @Debounce(50)
  getCommands(): void {
    this.FactureData = [];
    this.FactureData.length = 0;
    if (this.search.fournisseur_id) {
      historyApi
        .getCommandFourinsseur(this.search)
        .then((data) => {
          console.log(data);
          this.FactureData = data.data as CommandFournisseur[];
          this.count = data.total;
        })
        .catch((error) => {
          snackBarModule.setSnackbar({
            text: error,
            color: "error",
            timeout: 2000,
            show: true,
            icon: "mdi-alert-outline",
            x: "right",
            y: "top",
          });
        });
    }
  }

  get setting() {
    return settingModule.setting;
  }
  clearFrom() {
    this.search.from = "";
  }

  clearTo() {
    this.search.to = "";
  }
  paginate(obj: any) {
    this.search.url = obj.page;
  }
}
</script>

<style scoped>
#facture {
  position: absolute;
  /*display: none;*/
  top: -100px;
  z-index: -10;
}
</style>
