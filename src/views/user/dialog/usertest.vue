<template>
  <v-dialog v-model="dialog" scrollable max-width="550">
    <template v-slot:activator="{ on, attrs }">
      <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn
          :disabled="mutableExpenseAction == 2 && !userobj.id"
          color="primary"
          elevation="2"
          large
        >
          اضافة مستخدم
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="light-blue darken-4 white--text">
        <span v-if="mutableExpenseAction == 1"> مستخدم جديد</span>
        <span v-else> تعديل معلومات المستخدم</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row class="mt-2">
              <v-col>
                <v-text-field
                  v-model="userobj.name"
                  color="blue darken-2"
                  label="اسم المستخدم"
                  placeholder="المستخدم"
                  required
                  outlined
                  clearable
                  :rules="vuser.name"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="userobj.tel"
                  placeholder="أدخل رقم الهاتف"
                  required
                  label="رقم الهاتف"
                  outlined
                  clearable
                  type="number"
                  :rules="vuser.mobile"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-1">
              <v-col>
                <!-- <span>اسم المصروف</span> -->
                <v-text-field
                  v-model="userobj.email"
                  color="blue darken-2"
                  label="البريد الإلكتروني"
                  placeholder="ادخل البريد الإلكتروني"
                  required
                  outlined
                  clearable
                  :rules="vuser.name"
                ></v-text-field>
              </v-col>
              <v-col v-if="mutableExpenseAction == 1">
                <v-text-field
                  v-model="userobj.password"
                  color="blue darken-2"
                  label="كلمة المرور"
                  placeholder="أدخل كلمة المرور"
                  required
                  type="password"
                  outlined
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mr-2">
              <!-- <v-col cols="4"> -->
              <span>صلاحيات المستخدم</span>
              <!-- </v-col> -->
              <v-col>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col>
                <v-switch
                  inset
                  label="الزبائن"
                  v-model="userobj.client"
                ></v-switch>
              </v-col>
              <v-col>
                <v-switch
                  inset
                  label="المصاريف"
                  v-model="userobj.expense"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row class="mt-n2">
              <v-col>
                <v-switch
                  inset
                  label="الموردين"
                  v-model="userobj.fournisseur"
                ></v-switch>
              </v-col>
              <v-col>
                <v-switch
                  inset
                  label="مشتريات"
                  v-model="userobj.purchase"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col>
                <v-switch
                  inset
                  label="المستخدمين"
                  v-model="userobj.user"
                ></v-switch>
              </v-col>
              <v-col>
                <v-switch
                  inset
                  label="الإحصائيات"
                  v-model="userobj.chart"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col>
                <v-switch
                  inset
                  label="الفواتير"
                  v-model="userobj.facture"
                ></v-switch>
              </v-col>
              <v-col>
                <v-switch
                  inset
                  label="المنتجات"
                  v-model="userobj.sale"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row class="mt-n2">
              <v-col>
                <v-switch
                  inset
                  label="مخازن"
                  v-model="userobj.depot"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn text color="red darken-1" @click="close">إلغاء</v-btn>
        <v-btn
          text
          color="green darken-1"
          v-if="mutableExpenseAction == 1"
          @click="manage"
          >حفظ</v-btn
        >
        <v-btn text color="green darken-1" v-else @click="manage">تعديل</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Ref, Prop } from "vue-property-decorator";
import SnackBarModule from "@/store/snackBarModule";
import userApi from "@/api/userApi";
import User from "@/classes/user";
import VUser from "@/validation/VUser";
import loginModule from "@/store/loginModule";
@Component({})
export default class UserTest extends Vue {
  @Prop({ default: 0 }) userAction!: number;
  mutableExpenseAction = 0;
  @Ref() form: any;
  @Ref() menu!: any;
  menuState = false;
  date = "";
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

  Apiuser = new userApi();

  userobj = {} as User;
  vuser = new VUser();
  original = {} as User;
  //
  created() {
    this.mutableExpenseAction = this.userAction;

    this.$root.$on("reset_password", (selectuser: User) => {
      this.userobj = Object.assign({}, selectuser);
      this.mutableExpenseAction = 2;
      this.dialog = true;
      this.original = selectuser;
    });
  }
  close() {
    this.userobj = {} as User;
    this.mutableExpenseAction = 1;
    this.dialog = false;
  }

  manage() {
    if (this.form.validate()) {
      if (this.mutableExpenseAction == 1) {
        this.userobj.status = "wwww";
        this.Apiuser.saveUser(this.userobj)
          .then((result: any) => {
            let saved = ((result as any).data as any).data as User;

            this.$root.$emit("createdUser", this.userobj);
            this.close();

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
        this.Apiuser.updateUser(this.userobj)
          .then((result: any) => {
            if (result.status == 200) {
              Object.assign(this.original, this.userobj);
              if (this.userobj.id == (loginModule.getCurrentUser as User).id) {
                loginModule.setUser(JSON.stringify(this.userobj));
                this.$root.$emit("editedCurrentUser", this.userobj);
              }
            }
            this.close();
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
            this.close();
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
      // trequest take for exapmle
    }
  }
}
</script>
