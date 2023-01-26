<template>
  <div class="pa-3">
    <v-row class="pa-1">
      <v-col cols="2"> <ManageProductDamage /> </v-col>
      <!-- <v-spacer></v-spacer>
      <v-spacer></v-spacer> -->
      <!-- <col>
         <v-btn color="primary" @click="exportFile">
        تصدير اكسل
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
      <!-- <v-col cols="2"></v-col> -->
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-text-field
          solo
          flat
          clearable
          :value="search.name"
          append-icon="fa-search"
          @keyup="onChangeBarcode"
          @click:clear="clearInput"
          hint="  البحث باسم الصنف او الباركود"
          placeholder="  البحث باسم الصنف او الباركود"
        ></v-text-field>
      </v-col>
      <!-- <v-btn @click="show = !show">asds</v-btn> -->
      <!-- <v-col cols="1"><v-btn @click="ExportFile">export</v-btn></v-col> -->

      <!-- <v-col cols="2" class="mt-n2">
        <v-file-input @change="selectedFile" label="File input"></v-file-input>
      </v-col> -->
    </v-row>
    <v-card outlined>
      <v-data-table
        :headers="Headers"
        :items="listDamages"
        single-select
        @click:row="rowClick"
        :server-items-length="count"
        @update:options="paginate"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [10, 10],
          'show-current-page': true,
          'show-first-last-page': true,
          'page-text': 'رقم الصفحة',
          'items-per-page-text': 'عدد الأسطر',
        }"
        ><template v-slot:item.total="{ item }">
          {{ item.total }}
        </template>
        <template v-slot:item.quantity="{ item }">
          <v-chip color="red" dark>
            {{ item.quantity }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <DeleteDialog :id="item.id" :disabled="false" :source="'Damages'" />
          </v-row>
        </template> </v-data-table
    ></v-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageProductDamage from "@/views/stock/dialog/ManageProductDamage.vue";
import SnackBarModule from "@/store/snackBarModule";
import stockApi from "@/api/stockApi";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import Search from "@/classes/search";
import Depot from "@/classes/depot";
import Decoded from "@/helper/decode";
import Damage from "@/classes/damage";

@Component({ components: { ManageProductDamage, DeleteDialog } })
export default class DamageView extends Vue {
  Headers = [
    { text: "الصنف", value: "product.name" },
    { text: " الكمية", value: "quantity" },
    { text: "السعر", value: "price" },
    { text: "المبلغ", value: "total" },
    { text: " المخزن", value: "depot.name" },
    { text: " المستخدم", value: "user.name" },
    { text: " التاريخ", value: "created_at" },
    { text: "", value: "actions" },
  ];

  count = 0;
  original = "";
  // private api = new stockApi();
  listDamages = [] as Damage[];
  selectDamage = {} as Damage;
  listDepots = [] as Depot[];
  search = new Search();

  onChangeBarcode(text: any): void {
    //  &'èèàààéà&&à"
    this.search.name = Decoded.DecodedBarcode(text.target.value);
  }

  clearInput(): void {
    this.search.name = "";
  }

  @Watch("search", { deep: true })
  onChange() {
    this.getDamagesData(this.search);
  }

  getDamagesData(search?: Search): void {
    stockApi
      .getDamages(search)
      .then((response) => {
        this.listDamages = [];
        this.count = 0;

        if (response.status == 200) {
          console.log(response.data.data["data"]);
          this.listDamages = response.data.data["data"];
          this.count = response.data.data["total"];
        }
      })
      .catch((error) => {
        SnackBarModule.setSnackbar({
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

  created() {
    this.$root.$on("createdDamage", (damage: Damage) => {
      this.listDamages.unshift(damage);
      this.count++;
    });

    this.$root.$on("deletedDamageId", (deletedDamageId: number) => {
      if (deletedDamageId) {
        this.listDamages.splice(
          this.listDamages.indexOf(
            this.listDamages.find((c) => c.id == deletedDamageId)
          ),
          1
        );
      }
    });

    // this.$root.$on("updatedUser", (updateUser: Stock) => {
    //   if (updateUser) {
    //     this.liststock?.splice(
    //         this.liststock?.indexOf(
    //             this.liststock?.find((s) => s.id == updateUser.id) ?? ({} as Stock)
    //         ),

    //         1,
    //         updateUser
    //     );
    //   }
    // });
  }

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectDamage = item;
    } else {
      row.select(false);
      this.selectDamage = {} as Damage;
    }
  }

  editstock(edited: any) {
    this.$root.$emit("editDamage", edited);
  }

  paginate(obj: any) {
    this.search.url = obj.page;
    // this.getStocks(this.search);
  }
}
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 5s ease;
}

/* .app {
  background: #f6f4f6 !important;
    background-color: #f6f6f6;

} */

::v-deep .centered-input input {
  text-align: center;
}
</style>
