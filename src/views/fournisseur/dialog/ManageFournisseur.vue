<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableTeacherAction == 2 && !fournisseur.id"
          dark
          :fab="buttonSahpe"
          class="mx-3"
          color="primary"
          :small="buttonSahpe == true ? true : false"
          elevation="3"
        >
          {{ !buttonSahpe ? "إضافة مورد" : "" }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="light-blue darken-4">
        <span
          style="font-size: 20px; color: white"
          v-if="mutableTeacherAction == 1"
          class="mr-5 mb-1"
        >
          مورد جديد</span
        >
        <span style="font-size: 20px; color: white" v-else>
          تعديل معلومات المورد</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-3">
              <v-col class=""
                ><v-text-field
                  label="الإسم الكامل"
                  outlined
                  dense
                  v-model="fournisseur.name"
                  :rules="vTeacher.firstname"
                ></v-text-field
              ></v-col>
              <v-col class=""
                ><v-text-field
                  label="المبلغ"
                  outlined
                  type="number"
                  dense
                  v-model="fournisseur.montant"
                  :rules="vTeacher.price"
                ></v-text-field
              ></v-col>
            </v-row>

            <v-row class="">
              <v-col class=""
                ><v-text-field
                  label="رقم الهاتف"
                  outlined
                  dense
                  type="number"
                  v-model="fournisseur.mobile"
                  :rules="vTeacher.mobile"
                ></v-text-field
              ></v-col>
              <v-col class=""
                ><v-text-field
                  label="البريد الإلكتروني"
                  outlined
                  dense
                  v-model="fournisseur.email"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <v-col cols=""
                ><v-text-field
                  label="العنوان"
                  outlined
                  dense
                  v-model="fournisseur.address"
                  :rules="vTeacher.address"
                ></v-text-field
              ></v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text color="red darken-1" @click="close">إلغاء</v-btn>
        <v-btn
          text
          color="green darken-1"
          v-if="mutableTeacherAction === 1"
          @click="manage"
          >حفظ</v-btn
        >
        <v-btn text color="green darken-1" v-else @click="manage">تعديل</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import fournisseur from "@/classes/fournisseur";
import { Vue, Component, Ref, Prop, Watch } from "vue-property-decorator";
import fournisseurModule from "@/store/fournisseurModule";
import SnackBarModule from "@/store/snackBarModule";
import VTeacher from "@/validation/vTeacher";
import Search from "@/classes/search";
import CDatePicker from "@/components/CDatePicker.vue";
import Fournisseur from "@/classes/fournisseur";

@Component({ components: { CDatePicker } })
export default class ManageFournisseur extends Vue {
  @Prop({ default: 0 }) teacherAction!: number;
  @Prop({ default: false }) buttonSahpe!: boolean;
  mutableTeacherAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";
  img = undefined;
  previewImage = "";
  selectImage(image: any) {
    this.img = image;
    this.previewImage = URL.createObjectURL(this.img);
  }
  save(date: string) {
    this.menu.save(date);
  }
  @Ref() bdayMenu!: any;
  bdayMenuState = false;
  bdayDate = "";
  saveBday(date: string) {
    this.menu.save(date);
  }
  public dialog = false;
  valid = true;
  fournisseur = { montant: 0.0, ancien: 0.0 } as fournisseur;
  vTeacher = new VTeacher();

  groupIds = [] as number[];

  search = { name: "", url: "" } as Search;
  page = 1;
  count = 0;
  perPage = 0;

  created() {
    this.mutableTeacherAction = this.teacherAction;

    this.getGroups();

    this.$root.$on("editfournisseur", (fournisseur: fournisseur) => {
      this.fournisseur = Object.assign({}, fournisseur);
      console.log(this.fournisseur);
      this.mutableTeacherAction = 2;
      this.dialog = true;
    });
  }
  // TODO Change manegeteacher
  private getGroups() {
    // groupModule.getGroups(this.search).then((data) => {
    //   this.groups.length = 0;
    //   ((data as any).data as Group[]).forEach((g) => {
    //     let group = Object.assign({}, g);
    //     group.name =
    //       group.name +
    //       " (" +
    //       group.subj.name +
    //       " " +
    //       group.subj.level +
    //       " " +
    //       group.subj.grade +
    //       ")";
    //     this.groups.push(group);
    //   });
    //   this.count = (data as any).total;
    //   this.perPage = (data as any).per_page;
    // });
  }

  @Watch("search", { deep: true })
  onSearchChange() {
    this.getGroups();
  }
  @Watch("page", { deep: true })
  onPageChange() {
    this.search.url = "&page=" + this.page;
  }

  close() {
    this.fournisseur = { montant: 0.0, ancien: 0.0 } as fournisseur;
    this.mutableTeacherAction = 1;
    this.dialog = false;
  }
  // TODO teacher_id: savedfournisseur.id ?? 0,            ضفتلها ؟؟ 0
  manage() {
    if (this.form.validate()) {
      if (this.mutableTeacherAction == 1) {
        this.fournisseur.ancien = this.fournisseur.montant;
        fournisseurModule
          .saveFournisseur(this.fournisseur)
          .then((result) => {
            let savedfournisseur = (result as any).data as Fournisseur;
            this.$root.$emit("createdFournisseur", savedfournisseur);

            SnackBarModule.setSnackbar({
              text: "تمت الإضافة بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
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
      } else {
        fournisseurModule
          .updateFournisseur(this.fournisseur)
          .then((result) => {
            let updatedfournisseur = (result as any).data as Fournisseur;
            this.$root.$emit("updatedFournisseur", updatedfournisseur);
            SnackBarModule.setSnackbar({
              text: "تم التعديل بنجاح",
              color: "success",
              timeout: 2000,
              show: true,
              icon: "mdi-checkbox-marked-circle-outline",
              x: "right",
              y: "top",
            });
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
      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);
      this.close();
    }
  }
}
</script>
