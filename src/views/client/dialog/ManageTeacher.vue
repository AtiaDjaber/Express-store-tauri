<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableTeacherAction == 2 && !Client.id"
          dark
          :fab="buttonSahpe"
          class="mx-3"
          color="primary"
          :small="buttonSahpe == true ? true : false"
          elevation="3"
        >
          {{ !buttonSahpe ? "إضافة زبون" : "" }}
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
          زبون جديد</span
        >
        <span style="font-size: 20px; color: white" v-else>
          تعديل معلومات الزبون</span
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
                  v-model="Client.name"
                  :rules="vTeacher.firstname"
                ></v-text-field
              ></v-col>
              <v-col class=""
                ><v-text-field
                  label="دين قديم"
                  outlined
                  type="number"
                  dense
                  v-model="Client.ancien"
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
                  v-model="Client.mobile"
                  :rules="vTeacher.mobile"
                ></v-text-field
              ></v-col>
              <v-col class=""
                ><v-text-field
                  label="البريد الإلكتروني"
                  outlined
                  dense
                  v-model="Client.email"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <v-col cols=""
                ><v-text-field
                  label="العنوان"
                  outlined
                  dense
                  v-model="Client.address"
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
import client from "@/classes/client";
import { Vue, Component, Ref, Prop, Watch } from "vue-property-decorator";
import clientModule from "@/store/clientModule";
import SnackBarModule from "@/store/snackBarModule";
import VTeacher from "@/validation/vTeacher";
import Group from "@/classes/group";
import groupModule from "@/store/groupModule";
import Search from "@/classes/search";
import CDatePicker from "@/components/CDatePicker.vue";

@Component({ components: { CDatePicker } })
export default class ManageTeacher extends Vue {
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
  Client = { montant: 0.0, ancien: 0.0 } as client;
  vTeacher = new VTeacher();

  groups = [] as Group[];
  groupIds = [] as number[];

  search = { name: "", url: "" } as Search;
  page = 1;
  count = 0;
  perPage = 0;

  created() {
    this.mutableTeacherAction = this.teacherAction;

    this.getGroups();

    this.$root.$on("editClient", (Client: client) => {
      this.Client = Object.assign({}, Client);
      console.log(this.Client);
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
    this.Client = { montant: 0.0, ancien: 0.0 } as client;
    this.mutableTeacherAction = 1;
    this.dialog = false;
  }
  // TODO teacher_id: savedClient.id ?? 0,            ضفتلها ؟؟ 0
  manage() {
    if (this.form.validate()) {
      if (this.mutableTeacherAction == 1) {
        clientModule
          .saveclient(this.Client)
          .then((result) => {
            let savedClient = (result as any).data as client;
            this.$root.$emit("createdClient", savedClient);

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
        clientModule
          .updateClient(this.Client)
          .then((result) => {
            let updatedclient = (result as any).data as client;
            this.$root.$emit("updatedClient", updatedclient);
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
