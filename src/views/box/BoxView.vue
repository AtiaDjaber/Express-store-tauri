<template>
  <div class="pa-3">
    <v-row no-gutters>
      <manage-box :teacherAction="1" />
      <v-spacer></v-spacer>
      <v-text-field
        style="width: 50%"
        flat
        solo
        append-icon="fa-search"
        hint="البحث باسم الصندوق"
        placeholder="البحث باسم الصندوق"
        v-model="search.name"
      ></v-text-field>
    </v-row>

    <v-data-table
      elevation="3"
      :headers="clientHeaders"
      :items="boxesData"
      @click:row="rowClick"
      single-select
      @update:options="paginate"
      :server-items-length="count"
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
          <v-btn
            class="ml-2"
            color="green"
            small
            outlined
            fab
            elevation="0"
            @click="editBox(item)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <delete-dialog :id="item.id" :disabled="false" :source="'BOX'" />
        </v-row>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip dark :color="getColor(item.status)">
          {{ item.status ? "نشط" : "غير نشط" }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ManageBox from "./dialog/ManageBox.vue";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import snackBarModule from "@/store/snackBarModule";
import Search from "@/classes/search";
import Box from "@/classes/box";
import clientModule from "@/store/clientModule";
import BoxApi from "@/api/boxApi";

@Component({ components: { ManageBox, DeleteDialog } })
export default class BoxView extends Vue {
  clientHeaders = [
    { text: "الصندوق", value: "name" },
    { text: "الحالة", value: "status" },
    { text: "المستخدم الحالي", value: "user.name" },
    { text: "", value: "actions" },
  ];

  previewImage = "";
  boxesData = [] as Box[];
  selectedBox = {} as Box;
  count = 0;
  perPage = 0;
  search = new Search();

  getColor(status: boolean): string {
    if (!status) {
      return "red";
    } else return "green";
  }

  created(): void {
    this.$root.$on("createdBox", (box: Box) => {
      this.boxesData.unshift(box);
    });
    this.$root.$on("updatedBox", (updatedBox: Box) => {
      if (updatedBox) {
        this.boxesData?.splice(
          this.boxesData?.indexOf(
            this.boxesData?.find((s) => s.id == updatedBox.id)
          ),
          1,
          updatedBox
        );
      }
    });
    this.$root.$on("deletedBoxId", (deletedBoxId: number) => {
      if (deletedBoxId) {
        this.boxesData.splice(
          this.boxesData.indexOf(
            this.boxesData.find((c) => c.id == deletedBoxId)
          ),
          1
        );
      }
    });
  }

  paginate(obj: any): void {
    this.search.url = "&page=" + obj.page;
  }

  @Watch("search", { deep: true })
  onSearchChange() {
    this.getBoxes();
  }

  private getBoxes() {
    BoxApi.getBoxes(this.search)
      .then((data) => {
        this.boxesData = (data as any).data as Box[];
        this.count = (data as any).total;
        this.perPage = ((data as any).data as any).per_page;
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

  rowClick(item: any, row: any): void {
    if (!row.isSelected) {
      row.select(true);
      this.selectedBox = item;
      // clientModule.setClient(item);
    }

    this.$root.$emit("boxId", item);
  }

  editBox(item: any) {
    this.$root.$emit("editBox", item);
  }
}
</script>
<style scoped>
/* ::v-deep tr {
  height: 40px !important;
} */
/* ::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
} */

/* ::v-deep td {
  height: 40px !important;
} */
</style>
