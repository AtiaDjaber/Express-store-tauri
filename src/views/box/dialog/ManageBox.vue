<template>
  <v-dialog v-model="dialog" scrollable max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableTeacherAction == 2 && !box.id"
          :large="!isFab"
          :fab="isFab"
          class="mx-1"
          :color="!isFab ? 'primary' : ''"
          :small="isFab"
          :elevation="!isFab ? 1 : 0"
        >
          {{ !isFab ? "إضافة صندوق" : "" }}
          <v-icon class="mx-2">mdi-cash-register</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog" color="plain">
      <v-card-title class="primary--text">
        <span style="font-size: 20px" class="mr-5 mb-1 font-weight-bold">
          {{
            mutableTeacherAction == 1 ? "صندوق جديد" : "تعديل معلومات الصندوق"
          }}
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-3">
              <v-col class=""
                ><v-text-field
                  label="اسم الصندوق"
                  hint="اسم الصندوق"
                  flat
                  solo
                  v-model="box.name"
                  :rules="vTeacher.firstname"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <h3 class="pt-2 px-4">حالة الصندوق</h3>
              <v-col>
                <v-btn-toggle
                  v-model="box.status"
                  mandatory
                  group
                  class="mt-n5"
                  background-color="red"
                  color="primary"
                >
                  <v-btn text> غير نشط </v-btn>
                  <v-btn text> نشط </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-autocomplete
                  :items="listUsers"
                  v-model="box.user_id"
                  item-text="name"
                  item-value="id"
                  flat
                  solo
                  placeholder="اختر المستخدم"
                  label="المستخدم"
                  hint="المستخدم"
                  clearable
                  prepend-inner-icon="mdi-user-outline"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn outlined large class="mx-6" color="red darken-1" @click="close"
          >إلغاء</v-btn
        >
        <v-btn
          large
          class="mx-3"
          color="primary "
          v-if="mutableTeacherAction === 1"
          @click="manage"
          >حفظ</v-btn
        >
        <v-btn large color="primary" v-else @click="manage">تعديل</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Box from "@/classes/box";
import { Vue, Component, Ref, Prop } from "vue-property-decorator";
import SnackBarModule from "@/store/snackBarModule";
import VTeacher from "@/validation/vTeacher";
import Group from "@/classes/group";
import Search from "@/classes/search";
import CDatePicker from "@/components/CDatePicker.vue";
import User from "@/classes/user";
import userApi from "@/api/userApi";
import BoxApi from "@/api/boxApi";

@Component({ components: { CDatePicker } })
export default class ManageBox extends Vue {
  @Prop({ default: 0 }) teacherAction!: number;
  @Prop({ default: false }) isFab!: boolean;
  mutableTeacherAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  listUsers = [] as User[];

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
  box = {} as Box;
  vTeacher = new VTeacher();

  groups = [] as Group[];
  groupIds = [] as number[];

  search = { name: "", url: "" } as Search;
  page = 1;
  count = 0;
  perPage = 0;

  created() {
    this.mutableTeacherAction = this.teacherAction;

    this.getListUsers();

    this.$root.$on("editBox", (box: Box) => {
      this.box = Object.assign({}, box);
      console.log(this.box);
      this.mutableTeacherAction = 2;
      this.dialog = true;
    });
  }

  close(): void {
    this.box = {} as Box;
    this.mutableTeacherAction = 1;
    this.dialog = false;
  }

  manage(): void {
    if (this.form.validate()) {
      if (this.mutableTeacherAction == 1) {
        BoxApi.saveBox(this.box)
          .then((result) => {
            let savedClient = (result as any).data as Box;
            this.$root.$emit("createdBox", savedClient);

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
        BoxApi.updateBox(this.box)
          .then((result) => {
            let updatedBox = (result as any).data as Box;
            this.$root.$emit("updatedBox", updatedBox);
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
  userApi = new userApi();
  getListUsers(): void {
    this.userApi
      .getAllUser()
      .then((response) => {
        this.listUsers = response.data;
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
}
</script>
