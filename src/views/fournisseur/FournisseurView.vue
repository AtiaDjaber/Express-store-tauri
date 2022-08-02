<template>
  <div class="pa-3">
    <v-row no-gutters>
      <manage-fournisseur :teacherAction="1"/>
      <v-spacer></v-spacer>
      <v-text-field
          style="width: 50%"
          outlined
          dense
          append-icon="fa-search"
          label="البحث بالاسم او اللقب"
          v-model="search.name"
      ></v-text-field>
    </v-row>

    <v-data-table
        elevation="3"
        :headers="fournisseurHeaders"
        :items="fournisseurData"
        @click:row="rowClick"
        single-select
        show-expand
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
              rounded
              elevation="0"
              @click="editfournisseur(item)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <delete-dialog
              :id="item.id"
              :disabled="false"
              :source="'fournisseur'"
          />
        </v-row>
      </template>
      <template v-slot:item.montant="{ item }">
        <v-chip dark :color="getColor(item.montant)">
          {{ item.montant }}
        </v-chip>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row no-gutters>
            <v-col>
              <v-row class="ma-1" no-gutters>
                <v-col cols="4">الهاتف</v-col>
                <v-col>{{ item.mobile }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-1" no-gutters>
                <v-col cols="4">العنوان</v-col>
                <v-col>{{ item.address }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-1" no-gutters>
                <v-col cols="4">دين قديم</v-col>
                <v-col>{{ item.ancien }}</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ma-1" no-gutters>
                <v-col cols="4">البريد الالكتروني</v-col>
                <v-col>{{ item.email }}</v-col>
              </v-row>

              <v-divider></v-divider>

              <v-row class="ma-1" no-gutters>
                <v-col cols="4">تاريخ التسجيل</v-col>
                <v-col>{{ item.created_at }}</v-col>
              </v-row>
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from "vue-property-decorator";
import fournisseur from "@/classes/fournisseur";
import ManageFournisseur from "./dialog/ManageFournisseur.vue";
import fournisseurModule from "@/store/fournisseurModule";
import DeleteDialog from "@/components/custom_dialogs/DeleteDialog.vue";
import snackBarModule from "@/store/snackBarModule";
import Search from "@/classes/search";
import Fournisseur from "@/classes/fournisseur";

@Component({components: {ManageFournisseur, DeleteDialog}})
export default class FournisseurView extends Vue {
  fournisseurHeaders = [
    {text: "الإسم", value: "name", class: "grey lighten-4"},
    {text: "المبلغ", value: "montant", class: "grey lighten-4"},
    // {text: "رقم الهاتف", value: "mobile", class: "grey lighten-4"},
    {text: "", value: "actions", class: "grey lighten-4"},
    {text: "", value: "data-table-expand", class: "grey lighten-4"},

  ];

  previewImage = "";
  fournisseurData = [] as Fournisseur[];
  selectedfournisseur = {} as Fournisseur;
  count = 0;
  perPage = 0;
  search = {name: "", url: ""} as Search;

  getColor(montant) {
    if (montant > 0) return "red";
    // else if (montant >= 0 && montant<5) return "orange";
    // else return "green";
  }

  created() {
    this.$root.$on("createdFournisseur", (fournisseur: Fournisseur) => {
      this.fournisseurData.unshift(fournisseur);
    });
    this.$root.$on("updatedFournisseur", (updatedfournisseur: Fournisseur) => {
      if (updatedfournisseur) {
        this.fournisseurData?.splice(
            this.fournisseurData?.indexOf(
                this.fournisseurData?.find((s) => s.id == updatedfournisseur.id) ??
                ({} as Fournisseur)
            ),
            1,
            updatedfournisseur
        );
      }
    });
    this.$root.$on("deletedfournisseurId", (deletedfournisseurId: number) => {
      if (deletedfournisseurId) {
        this.fournisseurData.splice(
            this.fournisseurData.indexOf(
                this.fournisseurData.find((c) => c.id == deletedfournisseurId) ??
                ({} as Fournisseur)
            ),
            1
        );
      }
    });

    this.$root.$on(
        "ChangeMontantAfterDelete",
        (numberofchange: number, numberoffournisseur: number) => {
          console.log("numberofchange");
          console.log(numberofchange);
          console.log("numberoffournisseur");
          console.log(numberoffournisseur);
        }
    );
  }

  paginate(obj: any) {
    this.search.url = "&page=" + obj.page;
  }

  @Watch("search", {deep: true})
  onSearchChange() {
    this.getFournisseur();
  }

  private getFournisseur() {
    fournisseurModule
        .getFournisseurs(this.search)
        .then((data) => {
          // console.log( data)
          this.fournisseurData.length = 0;
          ((data as any).data as Fournisseur[]).forEach((s) => {
            this.fournisseurData.push(s);
          });
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

  rowClick(item: any, row: any) {
    if (!row.isSelected) {
      row.select(true);
      this.selectedfournisseur = item;
      fournisseurModule.setFournisseur(item);
    } else {
      this.selectedfournisseur = {} as fournisseur;
    }
    this.$root.$emit("fournisseurId", item);
  }

  editfournisseur(item: any) {
    this.$root.$emit("editfournisseur", item);
  }
}
</script>
<style scoped>
/* ::v-deep tr {
  height: 40px !important;
} */
::v-deep tr.v-data-table__selected {
  background: #c7e0f5 !important;
}

/* ::v-deep td {
  height: 40px !important;
} */
</style>
