<template>
  <v-dialog v-model="dialog" scrollable max-width="550">
    <template v-slot:activator="{}">
      <!-- <div class="mr-2" v-bind="attrs" v-on="on">
        <v-btn color="primary" outlined small rounded>
          <v-icon>mdi-lock-outline</v-icon>
        </v-btn>
      </div> -->
    </template>
    <v-card v-if="dialog" class="plain">
      <v-card-title class="primary--text">
        <span> تغيير كلمة مرور المستخدم</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <!-- <v-row class="mt-1">
              <v-col>
                <v-text-field
                  v-model="userobj.old_password"
                  color="blue darken-2"
                  
                  label="كلمة المرور القديمة"
                  placeholder="أدخل كلمة المرور القديمة"
                  required
                  type="password"
                  outlined
                  clearable
                ></v-text-field>
              </v-col>
            </v-row> -->

            <v-row class="mt-1">
              <v-col>
                <v-text-field
                  v-model="userobj.password"
                  color="blue darken-2"
                  label="كلمة المرور الجديدة"
                  placeholder="أدخل كلمة المرور الجديدة"
                  required
                  type="password"
                  flat
                  solo
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn large color="red darken-1" @click="close">إلغاء</v-btn>
        <v-btn large class="mx-3" color="green darken-1" @click="manage">{{
          mutableExpenseAction == 1 ? "حفظ" : "تعديل"
        }}</v-btn>
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
export default class PasswordReset extends Vue {
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
      this.Apiuser.updatePasswordUser(this.userobj)
        .then((result: any) => {
          if (result.status == 200) {
            Object.assign(this.original, this.userobj);
            if (this.userobj.id == (loginModule.getCurrentUser as User).id) {
              loginModule.setUser(JSON.stringify(this.userobj));
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

      setTimeout(() => {
        this.form?.resetValidation();
      }, 10);
      // trequest take for exapmle
    }
  }
}
</script>
